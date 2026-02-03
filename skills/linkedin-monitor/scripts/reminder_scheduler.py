#!/usr/bin/env python3
"""
Schedule LinkedIn check reminders via cron.
"""

import subprocess
import sys

def schedule_reminder(days=3):
    """Schedule a reminder to check LinkedIn every N days."""
    # Create cron job
    cron_line = f"0 9 */{days} * * cd /home/ubuntu/clawd && /usr/bin/python3 -c \"import subprocess; subprocess.run(['clawdbot', 'cron', 'run', '--text', 'Reminder: Time to check LinkedIn manually. Check connection requests, messages, and notifications.'])]\" >> /tmp/linkedin_reminder.log 2>&1"
    
    # Read existing crontab
    result = subprocess.run(["crontab", "-l"], capture_output=True, text=True)
    existing = result.stdout if result.returncode == 0 else ""
    
    # Remove existing linkedin reminder
    lines = [l for l in existing.split('\n') if 'linkedin' not in l.lower()]
    
    # Add new reminder
    lines.append(cron_line)
    
    # Write back
    new_crontab = '\n'.join(lines) + '\n'
    subprocess.run(["crontab", "-"], input=new_crontab, text=True)
    
    print(f"✅ Reminder scheduled: Every {days} days at 9 AM")
    print(f"   Next reminder: Check LinkedIn manually for connection requests, messages, notifications")


def remove_reminder():
    """Remove LinkedIn check reminders."""
    result = subprocess.run(["crontab", "-l"], capture_output=True, text=True)
    if result.returncode != 0:
        print("No crontab found")
        return
    
    lines = [l for l in result.stdout.split('\n') if 'linkedin' not in l.lower()]
    new_crontab = '\n'.join(lines) + '\n'
    subprocess.run(["crontab", "-"], input=new_crontab, text=True)
    
    print("✅ LinkedIn reminders removed")


def main():
    if len(sys.argv) < 2:
        print("Usage: reminder_scheduler.py <command> [days]")
        print("\nCommands:")
        print("  schedule [days]  - Schedule reminders (default: every 3 days)")
        print("  remove           - Remove all LinkedIn reminders")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "schedule":
        days = int(sys.argv[2]) if len(sys.argv) > 2 else 3
        schedule_reminder(days)
    elif command == "remove":
        remove_reminder()
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
