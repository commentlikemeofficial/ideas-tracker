# HEARTBEAT.md - Periodic Checks

## Task Master Checks

Every heartbeat (every ~30 min), check for upcoming task deadlines:

```bash
python3 /home/ubuntu/clawd/skills/task-master/scripts/check_reminders.py --hours 24
```

If output is non-empty, alert the user with the reminder text.

## Self-Improving Checks

Check for recent errors and high-value lessons:

```bash
python3 /home/ubuntu/clawd/skills/self-improving/scripts/check_lessons.py
```

If output is non-empty, share the lessons learned.

## Knowledge Graph Checks

Surface recent entities and strong connections:

```bash
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/check_graph.py
```

## Morning Brief Rule

**Rule:** If Rajesh says "Good Morning" → trigger morning brief immediately.
**Otherwise:** Auto-trigger at 9 AM IST (3:30 AM UTC) daily.

Check current time in IST. If it's around 9 AM IST and no morning brief was sent yet today, generate and send the morning brief:

```bash
python3 /home/ubuntu/clawd/skills/morning-brief/scripts/generate_brief.py
```

## Scout Research Agent

Every 6 hours (09:00, 15:00, 21:00, 03:00 IST), trigger Scout's research cycle:

```bash
python3 /home/ubuntu/clawd/agents/saas-research/scripts/run_research_cycle.py 2>&1 | head -20
```

If output shows opportunities, surface to Rajesh.

## Agent Coordination Hub (Steve manages all)

### ContentClaw Autonomous Mode
**Every 12 hours (09:00, 21:00 IST):**
```bash
sessions_send sessionKey:agent:main:subagent:54150d4e-87b3-4760-af77-badee9437770 message:"Autonomous run: Research AI/SaaS YouTube trends, pick top video, generate LinkedIn+X+Reddit posts, log to sheets, report back."
```
→ **Silent operation** - Steve will handle output

### Social Media Manager - Just-in-Time Delivery
**CRITICAL: Send reminders 5 MINUTES before posting time, NOT early morning!**

**Morning Preparation (9:15 AM IST):**
1. Generate content package:
   ```bash
   cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/generate-daily-package.sh
   ```

2. Generate images for each platform:
   ```bash
   cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/generate-images.sh
   ```

3. **DO NOT send to user yet** - Schedule reminders for later

**Just-in-Time Reminders (Send exactly at these times with image):**

**10:55 AM IST** (5 min before LinkedIn):
→ Send LinkedIn post content + image via Telegram

**3:55 PM IST** (5 min before X/Twitter):
→ Send X post content + image via Telegram

**6:55 PM IST** (5 min before Reddit):
→ Send Reddit post content + image via Telegram

### Scout Research Agent
**Every 6 hours (09:00, 15:00, 21:00, 03:00 IST):**
```bash
python3 /home/ubuntu/clawd/agents/saas-research/scripts/run_research_cycle.py 2>&1 | head -20
```
→ **Silent** unless high-value opportunity found
→ If opportunity score > 8/10, Steve alerts Rajesh

### Vercel Monitor Agent
**Every 30 minutes:**
```bash
cd /home/ubuntu/clawd/agents/vercel-monitor && ./scripts/check-deployments.sh
```
→ **Silent** if healthy
→ If failures detected, Steve assesses and alerts if critical

**Daily at 9:30 AM IST:**
```bash
cd /home/ubuntu/clawd/agents/vercel-monitor && ./scripts/daily-audit.sh
```
→ **Silent** - included in daily wrap-up

**Weekly (Monday 9:30 AM IST):**
```bash
cd /home/ubuntu/clawd/agents/vercel-monitor && ./scripts/weekly-security-audit.sh
```
→ Steve reviews and includes in Monday report

### Code Reviewer Agent
**Daily at 10 AM IST:**
```bash
cd /home/ubuntu/clawd/agents/code-reviewer && ./scripts/daily-code-report.sh
```
→ **Silent** unless critical issues found
→ Minor issues included in daily wrap-up

**On new PR (if detected):**
```bash
cd /home/ubuntu/clawd/agents/code-reviewer && ./scripts/review-pr.sh <pr-number> <repo>
```
→ Steve reviews report
→ Security issues → Immediate alert to Rajesh
→ Suggestions → Included in daily summary

## Communication Rules
- **Agents → Steve:** All reports go to me first
- **Steve filters:** I decide what needs your attention
- **You see:** Only actionable items and summaries
- **Silent ops:** Routine checks, healthy status, background tasks

## When Steve Alerts You
✅ Content ready for posting
⚠️ Security issues found
🚨 Deployment failures
📊 Daily/weekly summaries
🎯 High-value opportunities

## Other Checks (add as needed)

- [ ] Email / inbox
- [ ] Calendar events  
- [ ] Weather (if relevant)
- [ ] GitHub notifications
- [ ] Any monitoring alerts
