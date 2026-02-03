#!/usr/bin/env python3
"""
Execution Governor
Purpose: Prevent stalled work, zombie ideas, and low-ROI loops
Responsibilities: Track initiatives, flag inactivity, detect duplicates/circular effort
Constraints: Observation + escalation only. No content, no research, no execution.
"""
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

INITIATIVES_FILE = Path("/home/ubuntu/clawd/memory/initiatives.json")
DISABLE_FLAG = Path("/home/ubuntu/clawd/.disable-governor")

def load_initiatives():
    if INITIATIVES_FILE.exists():
        with open(INITIATIVES_FILE) as f:
            return json.load(f)
    return {"initiatives": [], "next_id": 1, "config": {"default_threshold_hours": 48, "auto_recommend_kill_after": 3, "enabled": True}}

def save_initiatives(data):
    with open(INITIATIVES_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def is_disabled():
    return DISABLE_FLAG.exists()

def check_stalled(initiative, threshold_hours=48):
    """Check if initiative has been inactive > threshold."""
    last_activity = datetime.fromisoformat(initiative.get('last_activity', initiative['started_at']))
    cutoff = datetime.now() - timedelta(hours=threshold_hours)
    return last_activity < cutoff and initiative['status'] == 'active'

def check_duplicates(initiatives, current):
    """Detect similar initiatives by topic/name."""
    duplicates = []
    current_name = current.get('name', '').lower()
    current_agent = current.get('agent', '')
    
    for other in initiatives:
        if other['id'] == current['id']:
            continue
        if other['status'] != 'active':
            continue
        # Simple similarity check
        other_name = other.get('name', '').lower()
        if any(word in other_name for word in current_name.split() if len(word) > 4):
            if other_agent := other.get('agent'):
                if other_agent != current_agent:
                    duplicates.append(other)
    
    return duplicates

def detect_circular(initiatives):
    """Detect circular dependencies (A waiting on B, B waiting on A)."""
    circular = []
    waiting_map = {}
    
    for i in initiatives:
        if i.get('waiting_on'):
            waiting_map[i['id']] = i['waiting_on']
    
    for init_id, waiting_on in waiting_map.items():
        if waiting_on in waiting_map and waiting_map[waiting_on] == init_id:
            circular.append((init_id, waiting_on))
    
    return circular

def format_escalation(initiative, issue_type, details=None):
    """Format escalation message - binary decisions only."""
    lines = [
        "🚨 EXECUTION GOVERNOR ALERT",
        "",
        f"Initiative: {initiative.get('name', initiative['id'])}",
        f"Agent: {initiative.get('agent', 'manual')}",
        f"Started: {initiative['started_at']}",
        f"Last Activity: {initiative.get('last_activity', 'Never')}",
        f"Status: {issue_type.upper()}",
    ]
    
    if issue_type == 'stalled':
        stalled_hours = int((datetime.now() - datetime.fromisoformat(initiative.get('last_activity', initiative['started_at']))).total_seconds() / 3600)
        lines.append(f"Stalled for: {stalled_hours}h (threshold: 48h)")
        
        escalations = initiative.get('escalation_count', 0)
        lines.append(f"Escalations: {escalations}")
        
        if escalations >= 3:
            lines.append("")
            lines.append("⚠️ AUTO-RECOMMEND: KILL (3+ escalations)")
    
    elif issue_type == 'duplicate':
        lines.append(f"Duplicate of: {details['name']} ({details['agent']})")
    
    elif issue_type == 'circular':
        lines.append(f"Circular with: {details}")
    
    lines.append("")
    lines.append("Decision required:")
    lines.append("[ ] KILL — Drop it, move on")
    lines.append("[ ] PROCEED — Reactivate with new deadline")
    lines.append("[ ] SIMPLIFY — Reduce scope, ship smaller")
    
    return "\n".join(lines)

def governor_check():
    """Main governor check - observation only."""
    if is_disabled():
        print("Governor disabled via flag.")
        return 0
    
    data = load_initiatives()
    
    if not data.get('config', {}).get('enabled', True):
        print("Governor disabled in config.")
        return 0
    
    initiatives = data.get('initiatives', [])
    threshold = data.get('config', {}).get('default_threshold_hours', 48)
    escalations = []
    
    # Check stalled initiatives
    for initiative in initiatives:
        if initiative['status'] != 'active':
            continue
        
        # Check stalled
        if check_stalled(initiative, threshold):
            initiative['escalation_count'] = initiative.get('escalation_count', 0) + 1
            escalations.append(format_escalation(initiative, 'stalled'))
        
        # Check duplicates
        duplicates = check_duplicates(initiatives, initiative)
        for dup in duplicates:
            escalations.append(format_escalation(initiative, 'duplicate', dup))
    
    # Check circular dependencies
    circular = detect_circular(initiatives)
    for init_id, waiting_on in circular:
        init = next((i for i in initiatives if i['id'] == init_id), None)
        if init:
            escalations.append(format_escalation(init, 'circular', waiting_on))
    
    save_initiatives(data)
    
    if escalations:
        print("\n\n".join(escalations))
        return 1
    
    return 0

def register_initiative(name, agent, expected_output, time_sensitive=False):
    """Register a new initiative for tracking."""
    data = load_initiatives()
    
    initiative = {
        "id": f"{agent}-{data['next_id']}",
        "name": name,
        "agent": agent,
        "started_at": datetime.now().isoformat(),
        "last_activity": datetime.now().isoformat(),
        "status": "active",
        "expected_output": expected_output,
        "escalation_count": 0,
        "time_sensitive": time_sensitive,
        "waiting_on": None
    }
    
    data['initiatives'].append(initiative)
    data['next_id'] += 1
    save_initiatives(data)
    
    print(f"Registered: {initiative['id']}")
    return initiative['id']

def update_activity(initiative_id):
    """Update last activity timestamp."""
    data = load_initiatives()
    
    for initiative in data['initiatives']:
        if initiative['id'] == initiative_id:
            initiative['last_activity'] = datetime.now().isoformat()
            save_initiatives(data)
            return True
    
    return False

def mark_complete(initiative_id):
    """Mark initiative as completed."""
    data = load_initiatives()
    
    for initiative in data['initiatives']:
        if initiative['id'] == initiative_id:
            initiative['status'] = 'completed'
            save_initiatives(data)
            return True
    
    return False

def main():
    if len(sys.argv) < 2:
        # No arguments - run check by default
        sys.exit(governor_check())
    
    if sys.argv[1] in ("--help", "-h"):
        print("Usage: governor.py [check|register|activity|complete|disable|enable|status]")
        print("")
        print("Execution Governor - Prevent stalled work and track initiatives")
        print("")
        print("Commands:")
        print("  check                           - Run governor check (default)")
        print("  register <name> <agent> <expected> [--urgent]  - Register new initiative")
        print("  activity <initiative_id>        - Update activity timestamp")
        print("  complete <initiative_id>        - Mark initiative complete")
        print("  disable                         - Disable governor checks")
        print("  enable                          - Enable governor checks")
        print("  status                          - Show governor status")
        print("")
        print("Examples:")
        print('  governor.py register "Build API" coding-agent "Working API endpoint"')
        print('  governor.py check')
        print('  governor.py activity coding-agent-1')
        sys.exit(0)
    
    command = sys.argv[1]
    
    if command == "check":
        sys.exit(governor_check())
    
    elif command == "register" and len(sys.argv) >= 5:
        # Usage: governor.py register "Name" agent "Expected output" [time_sensitive]
        name = sys.argv[2]
        agent = sys.argv[3]
        expected = sys.argv[4]
        time_sensitive = len(sys.argv) > 5 and sys.argv[5] == "--urgent"
        register_initiative(name, agent, expected, time_sensitive)
    
    elif command == "activity" and len(sys.argv) >= 3:
        update_activity(sys.argv[2])
    
    elif command == "complete" and len(sys.argv) >= 3:
        mark_complete(sys.argv[2])
    
    elif command == "disable":
        DISABLE_FLAG.touch()
        print("Governor disabled.")
    
    elif command == "enable":
        if DISABLE_FLAG.exists():
            DISABLE_FLAG.unlink()
        print("Governor enabled.")
    
    elif command == "status":
        data = load_initiatives()
        print(f"Enabled: {not is_disabled() and data.get('config', {}).get('enabled', True)}")
        print(f"Active initiatives: {len([i for i in data['initiatives'] if i['status'] == 'active'])}")
        print(f"Total initiatives: {len(data['initiatives'])}")
    
    else:
        print("Usage: governor.py [check|register|activity|complete|disable|enable|status]")
        sys.exit(1)

if __name__ == "__main__":
    main()
