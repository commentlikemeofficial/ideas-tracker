#!/usr/bin/env python3
"""
Parse forwarded LinkedIn notification emails.
Extract relevant info and store in database.
"""

import json
import re
import sys
import os
from datetime import datetime
from pathlib import Path

DATA_DIR = Path("/home/ubuntu/clawd/skills/linkedin-monitor/data")
DATA_DIR.mkdir(exist_ok=True)

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


def save_json(filepath, data):
    """Save data to JSON file."""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)


def parse_email(email_text):
    """
    Parse LinkedIn email and extract relevant info.
    Returns dict with type and extracted data.
    """
    email_text = email_text.lower()
    
    # Connection request patterns
    if any(phrase in email_text for phrase in [
        "wants to connect with you", 
        "invited you to connect",
        "wants to join your network",
        "would like to connect"
    ]):
        return parse_connection_request(email_text)
    
    # Connection accepted patterns
    if any(phrase in email_text for phrase in [
        "accepted your invitation",
        "is now a connection",
        "accepted your connection request"
    ]):
        return parse_connection_accepted(email_text)
    
    # Profile view patterns
    if any(phrase in email_text for phrase in [
        "viewed your profile",
        "people viewed your profile",
        "viewed your linkedin profile"
    ]):
        return parse_profile_view(email_text)
    
    # Message patterns
    if any(phrase in email_text for phrase in [
        "sent you a message",
        "new message",
        "messaged you"
    ]):
        return parse_message(email_text)
    
    return {"type": "unknown", "raw": email_text[:500]}


def parse_connection_request(email_text):
    """Extract connection request info."""
    # Try to find name (usually at start or after "Hi")
    name_match = re.search(r'(?:hi\s+|hello\s+|^)([a-z\s]+)(?:\s+wants|\s+invited)', email_text, re.IGNORECASE)
    name = name_match.group(1).strip().title() if name_match else "Unknown"
    
    # Try to find title/company
    title_match = re.search(r'(?:at|with)\s+([a-z\s]+?)(?:\.|,|\n)', email_text, re.IGNORECASE)
    company = title_match.group(1).strip().title() if title_match else ""
    
    return {
        "type": "connection_request",
        "from": name,
        "title": "",
        "company": company,
        "date": datetime.now().isoformat(),
        "action": "pending",
        "notes": ""
    }


def parse_connection_accepted(email_text):
    """Extract connection accepted info."""
    name_match = re.search(r'([a-z\s]+)(?:\s+accepted|\s+is now)', email_text, re.IGNORECASE)
    name = name_match.group(1).strip().title() if name_match else "Unknown"
    
    return {
        "type": "connection_accepted",
        "from": name,
        "date": datetime.now().isoformat(),
        "notified": False
    }


def parse_profile_view(email_text):
    """Extract profile view info."""
    # Try to find view count
    count_match = re.search(r'(\d+)\s+(?:people|person)\s+viewed', email_text, re.IGNORECASE)
    count = int(count_match.group(1)) if count_match else 1
    
    return {
        "type": "profile_view",
        "count": count,
        "date": datetime.now().isoformat(),
        "source": "email"
    }


def parse_message(email_text):
    """Extract message notification info."""
    name_match = re.search(r'([a-z\s]+)\s+sent you', email_text, re.IGNORECASE)
    name = name_match.group(1).strip().title() if name_match else "Unknown"
    
    return {
        "type": "message",
        "from": name,
        "date": datetime.now().isoformat(),
        "priority": "high"
    }


def store_notification(data):
    """Store notification in database."""
    notifications = load_json(NOTIFICATIONS_FILE)
    notifications.append(data)
    save_json(NOTIFICATIONS_FILE, notifications)
    
    # If it's a connection, also add to connections tracker
    if data["type"] == "connection_request":
        connections = load_json(CONNECTIONS_FILE)
        connections.append({
            "name": data["from"],
            "title": data.get("title", ""),
            "company": data.get("company", ""),
            "status": "pending",
            "date_added": data["date"],
            "follow_up_suggested": True,
            "notes": data.get("notes", "")
        })
        save_json(CONNECTIONS_FILE, connections)


def main():
    if len(sys.argv) > 1 and sys.argv[1] in ("--help", "-h"):
        print("Usage: email_parser.py [email_text]")
        print("\nParses forwarded LinkedIn notification emails.")
        print("If no email_text provided, reads from stdin.")
        print("\nExamples:")
        print('  email_parser.py "John wants to connect with you..."')
        print('  cat email.txt | email_parser.py')
        sys.exit(0)
    
    if len(sys.argv) < 2:
        # Read from stdin
        email_text = sys.stdin.read()
    else:
        email_text = sys.argv[1]
    
    if not email_text.strip():
        print("❌ No email text provided")
        sys.exit(1)
    
    result = parse_email(email_text)
    store_notification(result)
    
    print(f"✅ Parsed {result['type']}")
    
    # Generate response based on type
    if result["type"] == "connection_request":
        print(f"\n👤 {result['from']}")
        if result.get("company"):
            print(f"   Company: {result['company']}")
        print("\n💡 Suggested follow-up:")
        print(f'"Hi {result["from"].split()[0]}, thanks for connecting! I noticed you\'re at {result.get("company", "your company")}. Would love to learn more about what you\'re working on."')
        
    elif result["type"] == "connection_accepted":
        print(f"\n🎉 {result['from']} accepted your connection!")
        print("💡 Consider sending a welcome message")
        
    elif result["type"] == "message":
        print(f"\n📩 New message from {result['from']}")
        print("⚡ Priority: HIGH - Check LinkedIn messages")
        
    elif result["type"] == "profile_view":
        print(f"\n👀 {result['count']} profile view(s)")
    
    return result


if __name__ == "__main__":
    main()
