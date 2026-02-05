# HEARTBEAT.md - Periodic Checks

## Task Master Checks
Every heartbeat (~30 min), check upcoming deadlines:
```bash
python3 /home/ubuntu/clawd/skills/task-master/scripts/check_reminders.py --hours 24
```
Alert if non-empty.

## Self-Improving Checks
Check recent errors and lessons:
```bash
python3 /home/ubuntu/clawd/skills/self-improving/scripts/check_lessons.py
```

## Knowledge Graph Checks
Surface recent entities:
```bash
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/check_graph.py
```

## Execution Governor Checks
Every 6 hours, check stalled initiatives:
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py check
```
Escalate with binary decision (kill/proceed/simplify).

## Night Shift CEO Mode
**Activation:** Rajesh offline >4 hours (11 PM - 7 AM IST)
```bash
python3 /home/ubuntu/clawd/skills/night-shift-worker/scripts/night_shift_ceo.py
```
**Objective:** ONE high-quality morning surprise (money/usefulness/productivity)

## Morning Brief Rule
- If Rajesh says "Good Morning" → trigger immediately
- Otherwise auto-trigger at 9 AM IST

## Scout Research Agent
Every 6 hours (09:00, 15:00, 21:00, 03:00 IST):
```bash
python3 /home/ubuntu/clawd/agents/saas-research/scripts/run_research_cycle.py
```

## Agent Coordination

### ContentClaw
Every 12 hours (09:00, 21:00 IST): Research trends → generate posts

### Social Media Manager
Just-in-Time delivery (5 min before posting):
- 10:55 AM IST → LinkedIn
- 3:55 PM IST → X/Twitter  
- 6:55 PM IST → Reddit

### Vercel Monitor
Every 30 min: Check deployments
Daily 9:30 AM IST: Daily audit
Weekly Monday 9:30 AM IST: Security audit

### Code Reviewer
Daily 10 AM IST: Code report
On new PR: Review and alert on security issues

## When to Alert
✅ Content ready (5 min warning)
✅ Project build complete
⚠️ Security issues
🚨 Deployment failures
📊 Daily/weekly summaries
🎯 High-value opportunities

*Stored to ByteRover: 2026-02-03*
