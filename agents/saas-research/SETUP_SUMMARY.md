# 🎯 Scout: AI Product & SaaS Research Agent — Setup Complete

## What Just Happened

Created **Scout** — a specialized sub-agent for continuous market research and opportunity identification.

---

## 📁 File Structure

```
/home/ubuntu/clawd/agents/saas-research/
├── IDENTITY.md          # Who Scout is
├── SOUL.md              # How Scout thinks
├── USER.md              # What Rajesh needs
├── HEARTBEAT.md         # Research schedule
├── COLLABORATION.md     # How Scout & Steve work together
├── scripts/
│   ├── run_research_cycle.py    # Automated research (every 6h)
│   └── delegate_to_scout.py     # Manual task assignment
└── memory/
    └── research-YYYY-MM-DD.md   # Daily research logs
```

---

## 🔄 How It Works

### Automated (Always On)
- Scout runs research cycles every **6 hours**
- Checks: Reddit, HN, Twitter, Indie Hackers, product directories
- Logs findings to `memory/research-YYYY-MM-DD.md`
- Surfaces top opportunities via heartbeat

### On-Demand (You Trigger)
You ask Steve → Steve spawns Scout → Scout researches → Returns findings

**Example:**
> You: "Find gaps in AI compliance tools"
> 
> Steve spawns Scout with that task
> 
> Scout returns structured analysis
> 
> Steve and Scout debate → Final recommendation to you

---

## 📊 Opportunity Scoring

Scout scores every opportunity 0-10:

| Factor | Weight | What Scout Checks |
|--------|--------|-------------------|
| Pain intensity | 30% | Complaint frequency, emotional language |
| Market size | 25% | TAM, comparable exits |
| Competition gap | 20% | Existing solutions, pricing, features |
| Acquisition channel | 15% | Where users already gather |
| Build complexity | 10% | MVP time, AI leverage possible |

**Score > 7/10 = Immediate alert to you**

---

## 👁️ How You Observe

### 1. Review Research Logs
```bash
# See today's findings
cat /home/ubuntu/clawd/agents/saas-research/memory/research-2026-01-30.md

# See all historical research
ls /home/ubuntu/clawd/agents/saas-research/memory/
```

### 2. Jump Into Active Sessions
```bash
# Steve can show you active Scout sessions
# You can read transcripts or join the conversation
```

### 3. Request Specific Research
Just tell Steve what you want researched. Examples:
- "Deep dive on DPDPA compliance market"
- "Find what's missing in LinkedIn automation"
- "Validate this idea: AI podcast clip generator"

---

## 🚀 Next Steps

1. **Test it:** Tell Steve to assign Scout a research task
2. **Tune it:** After a few cycles, tell me what to adjust
3. **Scale it:** Add more data sources or research verticals

---

## Current Research Focus

1. **AI Compliance Tools** — DPDPA, GDPR, SOC2 automation
2. **Developer Productivity** — AI code review, documentation
3. **LinkedIn Automation** — Beyond CommentLikeMe
4. **Content Operations** — AI video/audio pipelines
5. **SMB Legal Tech** — Contract review, IP monitoring

**Want to add or change focus areas? Just tell Steve.**
