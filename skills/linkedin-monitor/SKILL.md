# linkedin-monitor
## Overview
Monitor LinkedIn activity safely through email parsing and manual inputs. No browser automation, no API scraping, 100% ToS-compliant.

## What This Skill Does
- Parses forwarded LinkedIn notification emails (connection requests, profile views, messages)
- Sends reminders to manually check LinkedIn every 2-3 days
- Tracks connection requests you forward and suggests follow-ups
- Compiles weekly digests from profile view screenshots you upload
- Alerts on important notifications (messages, accepted connections)

## Workflows

### 1. Email Parsing
When user forwards a LinkedIn email, determine the type and extract relevant info:

**Email Types:**
- `connection_request` — Someone sent you a connection request
- `connection_accepted` — Someone accepted your request  
- `profile_view` — Someone viewed your profile
- `message` — New LinkedIn message
- `job_alert` — Job recommendations (ignore unless user asks)
- `newsletter` — LinkedIn news (ignore)

**Parse and store:**
```json
{
  "type": "connection_request",
  "from": "Name",
  "title": "Their Title",
  "company": "Their Company",
  "date": "2026-01-29",
  "action": "pending|accepted|rejected",
  "notes": "User-added notes"
}
```

### 2. Manual Check Reminders
Set up a cron job to remind user every 3 days to manually check LinkedIn:
- Check for pending connection requests
- Review messages
- Check notifications
- Post something (optional)

### 3. Weekly Digest
Every Sunday, compile a summary of:
- Profile views count (from user's screenshot uploads)
- New connections made
- Messages received
- Pending connection requests that need action

### 4. Connection Tracking
Maintain a database of connections:
- People who sent you requests (with their title/company)
- People you should follow up with
- Suggested DM templates based on their profile

## File Structure

- `scripts/email_parser.py` — Parse forwarded LinkedIn emails
- `scripts/connection_tracker.py` — Track and query connections
- `scripts/weekly_digest.py` — Compile weekly summary
- `scripts/reminder_scheduler.py` — Schedule manual check reminders
- `data/connections.json` — Connection database
- `data/notifications.json` — Notification history

## Usage Examples

**"I got a connection request from John Doe, VP at Google"**
→ Add to tracker, suggest follow-up message

**"Remind me to check LinkedIn"**
→ Schedule 3-day reminder via cron

**"Here's my weekly profile views screenshot"** [image]
→ Parse screenshot (OCR), extract view count, compile digest

**"Who should I follow up with?"**
→ Query connections with "pending" status, suggest DMs

**"Weekly LinkedIn summary"**
→ Run weekly_digest.py, show stats

## Safe Practices
- Never automate LinkedIn login or actions
- Never scrape LinkedIn pages
- All data comes from user-provided emails/screenshots
- User controls all interactions
