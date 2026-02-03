---
name: morning-brief
description: Personalized morning briefing for Rajesh - weather, tasks, trending content, and productivity tips delivered daily at 9 AM IST
---

# Morning Brief Skill

Personalized daily morning briefing for Rajesh Kalidandi, delivered at 9 AM IST.

## What It Includes

🌤️ **Weather** - Hyderabad local weather  
📋 **Your Tasks** - From task-master todo list  
🤖 **My Tasks** - What I can do for you today  
📺 **YouTube** - Trending videos in your interests  
📰 **Tech News** - AI/SaaS/development trending stories  
💡 **Productivity Tips** - Personalized recommendations  

## Interests Tracked

- AI/ML & LLM APIs
- Next.js & TypeScript
- SaaS product development
- DPDPA compliance
- LinkedIn automation
- Open source contributions
- Full stack development

## Current Projects Monitored

- ComplySec (DPDPA 2023 compliance)
- CommentLikeMe (LinkedIn AI tool)
- Universal Read API (open source)

## Schedule

**Daily at 9:00 AM IST** (Asia/Kolkata timezone)

## Scripts

```bash
# Generate morning brief manually
python3 /home/ubuntu/clawd/skills/morning-brief/scripts/generate_brief.py
```

## Configuration

Edit `scripts/generate_brief.py` to customize:
- Interests
- Projects tracked
- Productivity tips
- News sources

## Dependencies

- task-master skill (for todo list)
- tavily-search skill (for trending news)
- weather API (wttr.in)
