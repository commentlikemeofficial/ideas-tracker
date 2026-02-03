---
name: personal-greeting
description: Context-aware personal greetings based on time of day, activity patterns, and tasks. Provides morning briefings with tasks and motivation, evening summaries with accomplishments, and weekend suggestions. Use for automated daily check-ins, motivation, and activity tracking integrated with task management.
---

# Personal Greeting

Context-aware greetings that know your day. Time-based, activity-aware, integrated with your tasks.

## Quick Use

```bash
# Auto-detect time and greet appropriately
python3 /home/ubuntu/clawd/skills/personal-greeting/scripts/greeting.py

# Specific greetings
python3 /home/ubuntu/clawd/skills/personal-greeting/scripts/greeting.py morning
python3 /home/ubuntu/clawd/skills/personal-greeting/scripts/greeting.py night
python3 /home/ubuntu/clawd/skills/personal-greeting/scripts/greeting.py weekend

# Debug time detection
python3 /home/ubuntu/clawd/skills/personal-greeting/scripts/greeting.py time
```

## Greeting Types

### 🌅 Morning (6-10 AM IST)

Includes:
- Activity pattern analysis from chat history
- Today's tasks (top 3 priorities)
- Motivational quote
- Weekend bonus (if applicable)

```
🌅 Good morning, early riser!

You've been highly active today! 🔥

📋 Today's Focus (3 tasks):
   • [HIGH] Ship v2 API
   • [MEDIUM] Write blog post
   • [CRITICAL] Fix production bug

💡 "Ship fast, iterate faster."
```

### 🌙 Night (11 PM-2 AM IST)

Includes:
- Today's completed tasks (wins)
- Tomorrow's priorities
- Sleep reminder
- Motivational quote

```
🌙 Good evening! Time to wind down.

✅ Today's Wins (4 completed):
   • Shipped v2 API
   • Fixed auth bug
   • Deployed to staging
   • Updated docs

🎯 Tomorrow's Priorities:
   • [CRITICAL] Production deploy
   • [HIGH] Customer demo prep

😴 Sleep Reminder: Aim for 7-8 hours...
```

### 🎉 Weekend

Includes:
- Fun activity suggestion
- Learning recommendation
- Light task reminder (if critical items pending)
- Relaxation quote

```
🎉 Happy Saturday! Weekend mode activated.

🎮 Fun Idea: Try a new coding challenge on LeetCode

📚 Learn Something: Deep dive into system design patterns

🌴 "Rest is not idleness. It's preparation for better work."
```

## Timezone

Hardcoded to **Asia/Kolkata (IST)** — Rajesh's timezone.

Current time detection: `6-10 AM morning`, `11 PM-2 AM night`, `Sat-Sun weekend`

## Data Sources

| Data | Source |
|------|--------|
| Tasks | `/home/ubuntu/clawd/memory/tasks.json` (task-master) |
| Activity | Memory files (`memory/YYYY-MM-DD.md`) |
| Accomplishments | Completed tasks from today |
| Priorities | Critical/high priority open tasks |

## Integration

Works automatically with:
- **task-master** — Reads/prioritizes your tasks
- **memory system** — Analyzes daily activity patterns
- **knowledge-graph** — Could extend for topic-based suggestions

## Quotes Database

15+ motivational quotes covering:
- Shipping mentality
- Consistency
- Action over perfection
- Building in public
- Growth mindset

## Suggestions Database

### Fun Suggestions (15+)
- Coding challenges
- Open source exploration
- Podcast recommendations
- Side project ideas
- Networking activities

### Learning Recommendations (15+)
- System design
- AI/ML topics
- Infrastructure
- New languages
- Architecture patterns

## Automation Ideas

**Cron job for morning greeting:**
```bash
# Add to crontab (runs at 7 AM IST)
0 7 * * * python3 /home/ubuntu/clawd/skills/personal-greeting/scripts/greeting.py morning
```

**Heartbeat integration:**
Check time during heartbeats and send appropriate greeting on first interaction of the time block.

## Customization

Edit the script to customize:
- Quotes in `MOTIVATIONAL_QUOTES`
- Fun suggestions in `FUN_SUGGESTIONS`
- Learning topics in `LEARNING_RECOMMENDATIONS`
- Time windows (morning/night hours)

## Output Format

All greetings include:
1. Time-appropriate emoji greeting
2. Personal context (activity/tasks)
3. Actionable information
4. Motivation or relaxation message
5. Weekend bonuses when applicable