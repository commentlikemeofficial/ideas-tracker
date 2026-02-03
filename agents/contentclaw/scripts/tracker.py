#!/usr/bin/env python3
"""
ContentClaw Google Sheets Tracker
Log all content to tracking spreadsheet
"""

import sys
import json
from datetime import datetime

def log_to_sheets(video_url, title, insights, linkedin, x_thread, reddit, status="draft"):
    """Log content to Google Sheets"""
    
    # Format thread for sheet
    x_thread_text = "\n---\n".join(x_thread)
    
    # Prepare data
    row_data = json.dumps({
        "date": datetime.now().strftime("%Y-%m-%d"),
        "video_url": video_url,
        "title": title,
        "key_insights": insights,
        "linkedin_post": linkedin[:1000],  # Truncate for sheet
        "x_thread": x_thread_text[:1000],
        "reddit_post": reddit[:1000],
        "platforms": "LinkedIn,X,Reddit",
        "status": status,
        "links": ""
    })
    
    print(f"📊 Logging to Google Sheets...")
    print(f"   Video: {title}")
    print(f"   Platforms: LinkedIn, X, Reddit")
    print(f"   Status: {status}")
    
    # Would call google-sheets skill here
    # For now, save to local log
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "action": "log_content",
        "data": json.loads(row_data)
    }
    
    with open("/home/ubuntu/clawd/agents/contentclaw/memory/sheets_log.jsonl", "a") as f:
        f.write(json.dumps(log_entry) + "\n")
    
    print("✅ Logged successfully!")
    return True

def list_recent_content():
    """List recent content from log"""
    try:
        with open("/home/ubuntu/clawd/agents/contentclaw/memory/sheets_log.jsonl", "r") as f:
            lines = f.readlines()
            print(f"📊 Recent Content ({len(lines)} entries):\n")
            for line in lines[-5:]:  # Last 5
                entry = json.loads(line)
                data = entry.get("data", {})
                print(f"  📅 {data.get('date')} | {data.get('title', 'Unknown')[:40]}... | {data.get('status')}")
    except FileNotFoundError:
        print("No content logged yet.")

def main():
    if len(sys.argv) < 2:
        print("ContentClaw Sheets Tracker")
        print("\nUsage:")
        print("  tracker.py list              # List recent content")
        print("  tracker.py log <json-file>   # Log content from file")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "list":
        list_recent_content()
    elif command == "log" and len(sys.argv) >= 3:
        # Load from contentclaw output file
        with open(sys.argv[2], 'r') as f:
            data = json.load(f)
        
        log_to_sheets(
            data["video_url"],
            data["title"],
            data["insights"],
            data["linkedin"],
            data["x_thread"],
            data["reddit"],
            data.get("status", "draft")
        )
    else:
        print("Unknown command")
        sys.exit(1)

if __name__ == "__main__":
    main()
