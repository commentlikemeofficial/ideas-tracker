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

**CRITICAL:** Every session must log learnings, not just talk about them:
```bash
# When user teaches/corrects you, LOG IT:
python3 skills/self-improving/scripts/learner.py add-lesson "what you learned" "insight" "tool" "tags"

# Verify recent learnings:
cat memory/daily-learning-log.md
```

**Rule:** Saying "I learned" without persisting to lessons.json = didn't happen.

## Knowledge Graph Checks

Surface recent entities and strong connections:

```bash
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/check_graph.py
```

## Execution Governor Checks

Every 6 hours, check for stalled initiatives, duplicates, and circular effort:

```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py check
```

If output is non-empty, escalate immediately with binary decision (kill/proceed/simplify).

**Governor Constraints:**
- Observation + escalation only
- No content creation, no research, no execution
- Immediate Telegram notification (no batching)
- Auto-recommend kill after 3 escalations

## Night Shift CEO Mode — UPGRADED (Build PRs Overnight)

**Activation:** When Rajesh offline >4 hours (11 PM - 7 AM IST)

**Check and activate:**
```bash
python3 /home/ubuntu/clawd/skills/night-shift-worker/scripts/night_shift_ceo.py
```

**Objective:** Build ONE code project overnight using Kimi CLI, ready for Rajesh to review in the morning

**How it works:**
1. Picks next project from build queue (workflow automations, tools, features)
2. Prepares workspace with instructions for Kimi CLI
3. Creates ready-to-run Kimi command
4. Delivers build location + instructions to Rajesh
5. Rajesh reviews → runs Kimi if needed → tests → integrates

**Build Queue:** `/home/ubuntu/clawd/night-shift-work/build-queue.json`
**Built Projects:** `/home/ubuntu/clawd/night-shift-work/built-projects.json`
**Build Output:** `/home/ubuntu/clawd/night-shift-work/builds/YYYYMMDD-{project-id}/`

**Current Projects in Queue:**
1. Auto-commit Helper (detect uncommitted changes, smart commit messages)
2. Daily Work Summary Generator (parse memory + git, create daily reports)
3. GitHub PR Notifier (monitor repos, send Telegram alerts)
4. Skill Usage Analytics (track which skills are used, weekly reports)
5. Memory Auto-sync (sync MEMORY.md with daily files)
6. 2nd Brain Web UI (NextJS app for visualizing knowledge)

**Constraints:**
- Max ONE delivery per morning
- Prepares workspace but doesn't auto-run Kimi (requires review first)
- Silence acceptable if quality bar not met
- Creates PRs/branches, never pushes to main

**Delivery Format:**
```
🌙 NIGHT SHIFT DELIVERY

Built: {Project Name}

What it is:
[Description]

Build Location:
/path/to/build

To Review:
1. cd /path/to/build
2. Read BUILD_INSTRUCTIONS.md
3. Review code
4. Run Kimi command if needed

Why it matters:
[Saves time/improves workflow]

Next Steps:
1. Review code
2. Test it
3. Copy to main project if good
```

## Morning Brief Rule

**Rule:** If Rajesh says "Good Morning" → trigger morning brief immediately.
**Otherwise:** Auto-trigger at 9 AM IST (3:30 AM UTC) daily.

Check current time in IST. If it's around 9 AM IST and no morning brief was sent yet today, generate and send the morning brief:

```bash
python3 /home/ubuntu/clawd/skills/morning-brief/scripts/generate_brief.py
```

## Afternoon Research Report (NEW)

**Time:** 3:00 PM IST (9:30 AM UTC) daily

**Purpose:** Deep dive on concepts that improve Rajesh — ML, productivity workflows, business strategies, or our working relationship.

**Topics to rotate:**
- AI/ML concepts (embeddings, RAG, fine-tuning)
- Productivity workflows (time management, automation)
- SaaS/business strategies (pricing, growth, marketing)
- Tool improvements (new skills, better workflows)

**Execution:**
```bash
python3 /home/ubuntu/clawd/agents/afternoon-research/scripts/generate_report.py
```

**Output format:**
```
📊 AFTERNOON RESEARCH REPORT
[Topic]

Key insights:
• [Insight 1]
• [Insight 2]

How to apply:
[Actionable steps]

Recommended next action:
[One thing to try]
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

### AI Developer Agent

**On new project request from Scout/Tech Architect:**
```bash
cd /home/ubuntu/clawd/agents/ai-developer && ./scripts/build-project.sh --name "project" --type "saas" --idea "description"
```
→ Works with Tech Architect on system design
→ Builds in 30-45 min sessions with breaks
→ Sends code to Code Reviewer
→ Deploys via Vercel Monitor
→ **All free tier only!**

**Rate limit management:**
- Check limits: `./scripts/check-rate-limits.sh`
- Use Kimi CLI with 15-20 min breaks
- Fallback to DeepSeek/Gemini if limited
- Log all builds to track usage

**On feature/bug:**
```bash
./scripts/add-feature.sh --project "app" --feature "auth"
./scripts/fix-bug.sh --project "app" --issue "login-error"
```

## Communication Rules
- **Agents → Steve:** All reports go to me first
- **Steve filters:** I decide what needs your attention
- **You see:** Only actionable items and summaries
- **Silent ops:** Routine checks, healthy status, background tasks

## When Steve Alerts You
✅ Content ready for posting (5 min warning)
✅ Project build complete
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
