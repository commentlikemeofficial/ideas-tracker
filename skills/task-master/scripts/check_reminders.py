#!/usr/bin/env python3
"""
task-master: Check for upcoming deadlines and output reminder text
Usage: check_reminders.py [--hours HOURS]
"""
import sys
import json
from datetime import datetime, timedelta
from pathlib import Path

TASKS_FILE = Path("/home/ubuntu/clawd/memory/tasks.json")

def load_tasks():
    if TASKS_FILE.exists():
        with open(TASKS_FILE) as f:
            return json.load(f)
    return {"tasks": []}

def check_reminders(hours=24):
    data = load_tasks()
    now = datetime.now()
    cutoff = now + timedelta(hours=hours)
    
    urgent = []
    upcoming = []
    
    for task in data["tasks"]:
        if task["status"] != "open" or not task.get("deadline"):
            continue
        try:
            deadline = datetime.fromisoformat(task["deadline"])
            if deadline < now:
                urgent.append(task)
            elif deadline <= cutoff:
                upcoming.append(task)
        except:
            pass
    
    # Sort by deadline
    urgent.sort(key=lambda t: t["deadline"])
    upcoming.sort(key=lambda t: t["deadline"])
    
    output = []
    
    if urgent:
        output.append("🚨 OVERDUE TASKS:")
        for t in urgent:
            days_late = (now - datetime.fromisoformat(t["deadline"])).days
            late_text = f" ({days_late}d late)" if days_late > 0 else " (due today)"
            output.append(f"  • #{t['id']}: {t['description']}{late_text}")
    
    if upcoming:
        output.append("⏰ UPCOMING DEADLINES:")
        for t in upcoming:
            hours_until = int((datetime.fromisoformat(t["deadline"]) - now).total_seconds() / 3600)
            time_text = f"in {hours_until}h" if hours_until < 24 else f"in {hours_until//24}d"
            output.append(f"  • #{t['id']}: {t['description']} ({time_text})")
    
    return "\n".join(output) if output else ""

if __name__ == "__main__":
    hours = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[1] == "--hours" else 24
    result = check_reminders(hours)
    if result:
        print(result)
        sys.exit(0)
    sys.exit(1)  # No reminders = exit 1 so cron knows not to send message