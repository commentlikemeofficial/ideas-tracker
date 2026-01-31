# 🤖 AI Agent Coordination Hub

## Agent Hierarchy

```
                    Rajesh (You)
                         ↑
                    Steve (Me)
                   /    |    \
                  /     |     \
         ContentClaw  Scout  Vercel Monitor
               |        |          |
         Social Media   Tech    Code Reviewer
           Manager    Architect
```

## Communication Protocol

### 1. Autonomous Agents → Steve
- All agents report to me first
- I aggregate and filter information
- I decide what needs your attention

### 2. Steve → Rajesh (When to alert you)
- ✅ Content ready for approval
- ⚠️ Issues found (security, failures)
- 📊 Daily/weekly summaries
- 🚨 Urgent matters only

### 3. What You DON'T See (handled silently)
- Routine checks passing
- Content generation in progress
- Monitoring heartbeat OK
- Background tasks completing

## Agent Communication Flow

### ContentClaw + Social Media Manager
```
ContentClaw generates content
    ↓
Saves to tracking/ folder
    ↓
[Silent - no message to you]
    ↓
Steve detects new content (via heartbeat)
    ↓
Social Media Manager creates package
    ↓
Steve reviews package
    ↓
Steve sends YOU the curated content
```

### Scout Research
```
Scout runs every 6 hours
    ↓
Researches opportunities
    ↓
[Silent - unless high-value finding]
    ↓
If opportunity score > 8/10
    ↓
Steve gets notified
    ↓
Steve summarizes and alerts you
```

### Vercel Monitor
```
Monitor runs checks every 30 min
    ↓
[Silent - if all healthy]
    ↓
If issues detected
    ↓
Steve gets alerted immediately
    ↓
Steve assesses severity
    ↓
If critical → Alert you
If minor → Handle/fix silently
```

### Code Reviewer
```
New PR opened
    ↓
Code Reviewer analyzes
    ↓
Saves report to agents/code-reviewer/reports/
    ↓
[Silent - unless critical issues]
    ↓
If security issues found
    ↓
Steve alerts you immediately
    ↓
If minor suggestions
    ↓
Steve includes in daily summary
```

## Daily Update Schedule (What You Receive)

### 9:15 AM IST - Morning Content Package
- Social media posts ready for approval
- Curated from ContentClaw's 9 AM run
- Copy-paste ready

### 10:00 AM IST - Code Review Summary
- Overnight PR reviews
- Any security issues
- Code quality highlights

### 6:00 PM IST - Daily Wrap-up
- What happened today
- Any pending approvals needed
- Tomorrow's scheduled content

### 9:15 PM IST - Evening Content Package
- Next day's content ready
- From ContentClaw's 9 PM run

### Weekly (Monday 9 AM) - Weekly Report
- Performance summary
- Security audit results
- Content calendar for the week

## Silent Operations (You Won't Be Bothered)

✅ All monitoring checks passing
✅ Content generation completing
✅ Routine code reviews (no critical issues)
✅ Background research
✅ Deployment health checks
✅ Security scans (no issues)

## Escalation Criteria (When Steve Alerts You)

🚨 **IMMEDIATE (Right Now)**
- Security breach detected
- Production deployment failed
- Critical bug in PR review
- Urgent opportunity expires soon

⚠️ **SAME DAY**
- Content ready for approval
- PR needs your review
- Domain/SSL issues
- Build failures

📊 **DAILY DIGEST**
- Content performance
- Code review summaries
- Research findings
- System health report

## Your Commands

You can always ask me:
- "Status" - Check all agents
- "Content" - Get today's posts
- "Review PR #42" - Review specific PR
- "Security check" - Run security audit
- "What did Scout find?" - Research updates

## Communication Rules

1. **I filter everything** - You only see what matters
2. **No spam** - Only actionable items reach you
3. **Context included** - I summarize, you decide
4. **Easy approvals** - Copy-paste ready content
5. **Silent fixes** - I handle minor issues

## Agent Status Dashboard

| Agent | Status | Last Activity | Next Run |
|-------|--------|---------------|----------|
| ContentClaw | 🟢 | 9:00 AM | 9:00 PM |
| Scout | 🟢 | 3:00 PM | 9:00 PM |
| Vercel Monitor | 🟢 | Ongoing | Every 30 min |
| Code Reviewer | 🟢 | On-demand | On PR |
| Social Media Mgr | 🟢 | 9:15 AM | 9:15 PM |

All agents working autonomously. You only hear from me when there's something worth your time! 🫂
