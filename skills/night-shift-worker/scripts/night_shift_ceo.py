#!/usr/bin/env python3
"""
Night Shift CEO Mode
Runs when Rajesh is offline/sleeping.
Produces at most ONE high-quality morning surprise.
"""
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

NIGHT_SHIFT_LOG = Path("/home/ubuntu/clawd/night-shift-work/ceo-log.json")
DELIVERY_FILE = Path("/home/ubuntu/clawd/night-shift-work/morning-delivery.json")
LAST_MESSAGE_FILE = Path("/home/ubuntu/clawd/memory/last-message-timestamp.txt")

def is_night_shift_hours():
    """Check if it's night shift hours (11 PM - 7 AM IST)."""
    ist_hour = (datetime.utcnow() + timedelta(hours=5, minutes=30)).hour
    return ist_hour >= 23 or ist_hour < 7

def is_rajesh_offline():
    """Check if Rajesh hasn't messaged for >4 hours."""
    if not LAST_MESSAGE_FILE.exists():
        return True
    
    last_msg = datetime.fromisoformat(LAST_MESSAGE_FILE.read_text().strip())
    hours_since = (datetime.now() - last_msg).total_seconds() / 3600
    return hours_since > 4

def should_activate():
    """Check if Night Shift CEO mode should activate."""
    return is_night_shift_hours() and is_rajesh_offline()

def log_activity(activity):
    """Log night shift activity."""
    data = {"activities": [], "last_updated": datetime.now().isoformat()}
    if NIGHT_SHIFT_LOG.exists():
        with open(NIGHT_SHIFT_LOG) as f:
            data = json.load(f)
    
    data["activities"].append({
        "timestamp": datetime.now().isoformat(),
        "activity": activity
    })
    
    NIGHT_SHIFT_LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(NIGHT_SHIFT_LOG, 'w') as f:
        json.dump(data, f, indent=2)

def already_delivered_today():
    """Check if we already delivered this morning."""
    if not DELIVERY_FILE.exists():
        return False
    
    with open(DELIVERY_FILE) as f:
        delivery = json.load(f)
    
    delivery_date = datetime.fromisoformat(delivery.get('timestamp', '2000-01-01')).date()
    return delivery_date == datetime.now().date()

def evaluate_opportunity(opportunity):
    """Evaluate if opportunity meets quality bar."""
    score = 0
    
    # Money potential
    if opportunity.get('revenue_potential') in ['high', 'medium']:
        score += 3 if opportunity['revenue_potential'] == 'high' else 1
    
    # Usefulness
    if opportunity.get('usefulness') in ['high', 'medium']:
        score += 3 if opportunity['usefulness'] == 'high' else 1
    
    # Productivity
    if opportunity.get('productivity_gain') in ['high', 'medium']:
        score += 3 if opportunity['productivity_gain'] == 'high' else 1
    
    # Feasibility (must be doable)
    if opportunity.get('feasible', False):
        score += 1
    
    return score >= 5  # High bar

def scout_opportunities():
    """Brief Scout check for high-value opportunities."""
    # This would integrate with Scout agent
    # For now, return empty (silence is acceptable)
    log_activity("Scout check - no high-value opportunities")
    return []

def build_artifact(opportunity):
    """Build a small artifact if opportunity is validated."""
    log_activity(f"Building artifact: {opportunity.get('name', 'unnamed')}")
    # Would direct AI Developer for small builds
    return None

def draft_content():
    """Draft high-value content if no build opportunities."""
    log_activity("ContentClaw check - evaluating content opportunities")
    # Would integrate with ContentClaw
    return None

def format_delivery(artifact, artifact_type):
    """Format morning delivery per specification."""
    if artifact_type == "opportunity":
        return f"""🌙 NIGHT SHIFT DELIVERY

{artifact['name']}

Research Summary:
{artifact['summary'][:200]}...

Why it matters:
{artifact['impact']}

Recommended next action:
{artifact['next_action']}"""
    
    elif artifact_type == "build":
        return f"""🌙 NIGHT SHIFT DELIVERY

Built: {artifact['name']}

Location: {artifact['path']}

Why it matters:
{artifact['impact']}

Recommended next action:
{artifact['next_action']}"""
    
    elif artifact_type == "content":
        return f"""🌙 NIGHT SHIFT DELIVERY

Drafted: {artifact['title']}

Platform: {artifact['platform']}

Why it matters:
{artifact['impact']}

Recommended next action:
{artifact['next_action']}"""
    
    return None

def main():
    if not should_activate():
        print("Night Shift CEO: Not active (Rajesh online or daytime)")
        return 0
    
    if already_delivered_today():
        print("Night Shift CEO: Already delivered today")
        return 0
    
    print("🌙 Night Shift CEO activating...")
    log_activity("Activated")
    
    # Try to find ONE high-quality opportunity
    opportunities = scout_opportunities()
    
    for opp in opportunities:
        if evaluate_opportunity(opp):
            # Try to build artifact
            artifact = build_artifact(opp)
            if artifact:
                delivery = format_delivery(artifact, "build")
                if delivery:
                    # Save delivery
                    with open(DELIVERY_FILE, 'w') as f:
                        json.dump({
                            "timestamp": datetime.now().isoformat(),
                            "delivery": delivery,
                            "type": "build"
                        }, f, indent=2)
                    print(delivery)
                    log_activity("Delivered build artifact")
                    return 0
    
    # Try content if no build opportunities
    content = draft_content()
    if content:
        delivery = format_delivery(content, "content")
        if delivery:
            with open(DELIVERY_FILE, 'w') as f:
                json.dump({
                    "timestamp": datetime.now().isoformat(),
                    "delivery": delivery,
                    "type": "content"
                }, f, indent=2)
            print(delivery)
            log_activity("Delivered content")
            return 0
    
    # Quality bar not met - silence is acceptable
    log_activity("Quality bar not met - no delivery")
    print("Night Shift CEO: Quality bar not met, no delivery")
    return 0

if __name__ == "__main__":
    sys.exit(main())
