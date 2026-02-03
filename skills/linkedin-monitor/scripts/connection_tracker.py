#!/usr/bin/env python3
"""
Track LinkedIn connections and suggest follow-ups.
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timedelta

DATA_DIR = Path("/home/ubuntu/clawd/skills/linkedin-monitor/data")
CONNECTIONS_FILE = DATA_DIR / "connections.json"


def load_connections():
    """Load connections database."""
    if not CONNECTIONS_FILE.exists():
        return []
    try:
        with open(CONNECTIONS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []


def save_connections(data):
    """Save connections database."""
    with open(CONNECTIONS_FILE, 'w') as f:
        json.dump(data, f, indent=2)


def add_connection(name, title="", company="", notes=""):
    """Add a new connection manually."""
    connections = load_connections()
    connections.append({
        "name": name,
        "title": title,
        "company": company,
        "status": "pending",
        "date_added": datetime.now().isoformat(),
        "follow_up_suggested": True,
        "notes": notes
    })
    save_connections(connections)
    print(f"✅ Added {name} to connection tracker")


def update_status(name, status):
    """Update connection status (pending/connected/ignored)."""
    connections = load_connections()
    for conn in connections:
        if name.lower() in conn["name"].lower():
            conn["status"] = status
            conn["date_updated"] = datetime.now().isoformat()
            save_connections(connections)
            print(f"✅ Updated {conn['name']} to {status}")
            return
    print(f"❌ Connection '{name}' not found")


def suggest_follow_ups():
    """Suggest connections to follow up with."""
    connections = load_connections()
    pending = [c for c in connections if c["status"] == "pending" and c.get("follow_up_suggested", True)]
    
    if not pending:
        print("✅ No pending follow-ups!")
        return
    
    print(f"🎯 {len(pending)} connection(s) to follow up with:\n")
    
    for conn in pending[:10]:  # Show top 10
        print(f"👤 {conn['name']}")
        if conn.get("title") or conn.get("company"):
            print(f"   {conn.get('title', '')} @ {conn.get('company', '')}")
        print(f"   Added: {conn['date_added'][:10]}")
        
        # Generate DM suggestion
        name = conn['name'].split()[0]
        company = conn.get('company', 'your company')
        print(f"\n💬 Suggested DM:")
        print(f'"Hi {name}, thanks for connecting! I saw you\'re at {company}. ')
        print(f'I\'m always interested in connecting with folks in the space. Would love to hear what you\'re working on!"')
        print()


def list_connections(status=None):
    """List all connections, optionally filtered by status."""
    connections = load_connections()
    
    if status:
        connections = [c for c in connections if c["status"] == status]
    
    if not connections:
        print(f"📭 No connections found" + (f" with status '{status}'" if status else ""))
        return
    
    print(f"📊 {len(connections)} connection(s):\n")
    
    for conn in connections:
        emoji = {"pending": "⏳", "connected": "✅", "ignored": "❌"}.get(conn["status"], "❓")
        print(f"{emoji} {conn['name']}")
        if conn.get("title") or conn.get("company"):
            print(f"   {conn.get('title', '')} @ {conn.get('company', '')}")
        print(f"   Status: {conn['status']} | Added: {conn['date_added'][:10]}")
        print()


def main():
    if len(sys.argv) < 2:
        print("Usage: connection_tracker.py <command> [args]")
        print("\nCommands:")
        print("  add <name> [title] [company] [notes]  - Add connection")
        print("  update <name> <status>                - Update status (pending/connected/ignored)")
        print("  suggest                               - Show follow-up suggestions")
        print("  list [status]                         - List all connections")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "add":
        if len(sys.argv) < 3:
            print("❌ Usage: add <name> [title] [company] [notes]")
            sys.exit(1)
        name = sys.argv[2]
        title = sys.argv[3] if len(sys.argv) > 3 else ""
        company = sys.argv[4] if len(sys.argv) > 4 else ""
        notes = sys.argv[5] if len(sys.argv) > 5 else ""
        add_connection(name, title, company, notes)
    
    elif command == "update":
        if len(sys.argv) < 4:
            print("❌ Usage: update <name> <status>")
            sys.exit(1)
        update_status(sys.argv[2], sys.argv[3])
    
    elif command == "suggest":
        suggest_follow_ups()
    
    elif command == "list":
        status = sys.argv[2] if len(sys.argv) > 2 else None
        list_connections(status)
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
