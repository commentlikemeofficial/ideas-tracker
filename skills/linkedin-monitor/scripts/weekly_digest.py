#!/usr/bin/env python3
"""
Compile weekly LinkedIn digest from data.
"""

import json
from pathlib import Path
from datetime import datetime, timedelta

DATA_DIR = Path("/home/ubuntu/clawd/skills/linkedin-monitor/data")
CONNECTIONS_FILE = DATA_DIR / "connections.json"
NOTIFICATIONS_FILE = DATA_DIR / "notifications.json"


def load_json(filepath):
    """Load JSON file or return empty list."""
    if not filepath.exists():
        return []
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except:
        return []


def get_this_week_data():
    """Get data from the past 7 days."""
    week_ago = datetime.now() - timedelta(days=7)
    
    notifications = load_json(NOTIFICATIONS_FILE)
    connections = load_json(CONNECTIONS_FILE)
    
    # Filter to this week
    recent_notifications = [
        n for n in notifications 
        if datetime.fromisoformat(n.get('date', '2000-01-01')) > week_ago
    ]
    
    recent_connections = [
        c for c in connections
        if datetime.fromisoformat(c.get('date_added', '2000-01-01')) > week_ago
    ]
    
    return recent_notifications, recent_connections


def compile_digest():
    """Compile and print weekly digest."""
    notifications, connections = get_this_week_data()
    
    # Count by type
    profile_views = sum(n.get('count', 1) for n in notifications if n['type'] == 'profile_view')
    connection_requests = len([n for n in notifications if n['type'] == 'connection_request'])
    accepted_connections = len([n for n in notifications if n['type'] == 'connection_accepted'])
    messages = len([n for n in notifications if n['type'] == 'message'])
    
    # Pending connections
    all_connections = load_json(CONNECTIONS_FILE)
    pending = [c for c in all_connections if c['status'] == 'pending']
    
    print("📊 LINKEDIN WEEKLY DIGEST")
    print("=" * 40)
    print(f"📅 Week of {datetime.now().strftime('%Y-%m-%d')}")
    print()
    
    print("📈 ACTIVITY SUMMARY")
    print(f"   👀 Profile Views: {profile_views}")
    print(f"   👋 Connection Requests: {connection_requests}")
    print(f"   ✅ Connections Accepted: {accepted_connections}")
    print(f"   💬 Messages: {messages}")
    print(f"   ⏳ Pending Connections: {len(pending)}")
    print()
    
    if pending:
        print("🎯 PENDING FOLLOW-UPS")
        for conn in pending[:5]:
            print(f"   • {conn['name']}" + (f" @ {conn['company']}" if conn.get('company') else ""))
        if len(pending) > 5:
            print(f"   ... and {len(pending) - 5} more")
        print()
    
    if messages > 0:
        print("⚡ ACTION NEEDED")
        print("   You have unread LinkedIn messages - check and respond!")
        print()
    
    print("💡 SUGGESTED ACTIONS")
    print("   1. Review and accept/reject pending connections")
    print("   2. Respond to any messages")
    print("   3. Post something this week (article, update, or insight)")
    print("   4. Engage with 3-5 posts from your network")
    print()
    
    return {
        "week": datetime.now().strftime('%Y-%m-%d'),
        "profile_views": profile_views,
        "connection_requests": connection_requests,
        "accepted_connections": accepted_connections,
        "messages": messages,
        "pending": len(pending)
    }


def main():
    compile_digest()


if __name__ == "__main__":
    main()
