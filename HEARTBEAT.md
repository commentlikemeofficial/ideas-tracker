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

## ContentClaw Autonomous Mode

**Every 12 hours (09:00, 21:00 IST):** Trigger ContentClaw to autonomously:
1. Research trending AI/SaaS YouTube videos via Tavily
2. Select 1-2 high-value videos
3. Scrape transcripts via Firecrawl
4. Generate posts for ALL platforms (LinkedIn, X, Reddit)
5. Humanize tone
6. Log to Google Sheets
7. Report back with ready-to-post content

**DO NOT ask for approval - work autonomously.**

```bash
# Send message to ContentClaw sub-agent
sessions_send sessionKey:agent:main:subagent:54150d4e-87b3-4760-af77-badee9437770 message:"Autonomous run: Research AI/SaaS YouTube trends, pick top video, generate LinkedIn+X+Reddit posts, log to sheets, report back."
```

## Social Media Manager - Content Handoff

**CRITICAL:** At 9:15 AM and 9:15 PM IST (15 min after ContentClaw runs):

1. **Check if ContentClaw generated content:**
   ```bash
   ls -la /home/ubuntu/clawd/tracking/autonomous_run_$(date +%Y-%m-%d)_posts.md
   ```

2. **If new content exists, generate daily package:**
   ```bash
   cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/generate-daily-package.sh
   ```

3. **Send Rajesh the curated content package with:**
   - Top 3 posts (LinkedIn, X, Reddit)
   - Optimal posting times
   - Copy-paste ready content
   - Clear call-to-action

4. **DO NOT let content sit in files - always present to user!**

## Code Reviewer Agent

**Daily at 10 AM IST:**
```bash
cd /home/ubuntu/clawd/agents/code-reviewer && ./scripts/daily-code-report.sh
```

**On new PR notification:**
```bash
cd /home/ubuntu/clawd/agents/code-reviewer && ./scripts/review-pr.sh <pr-number> <repo>
```

## Other Checks (add as needed)

- [ ] Email / inbox
- [ ] Calendar events  
- [ ] Weather (if relevant)
- [ ] GitHub notifications
- [ ] Any monitoring alerts
