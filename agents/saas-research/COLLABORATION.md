# COLLABORATION.md - How Scout, Steve & Rajesh Work Together

## Core Principle: Validate Before Build

**Scout researches for 24-48h → Steve evaluates → Rajesh approves → Kimi builds**

**NO exceptions. NO auto-builds without explicit approval.**

---

## Workflow Stages

### Stage 1: Scout Discovery (24-48h)
```
Scout (locked on ONE idea)
    ↓
Research: trends, users, competition, market, tech feasibility
    ↓
Collect evidence quantitatively
    ↓
Score: 0-10 using rubric
    ↓
Generate validation report
```

**Scout Rules:**
- ONE idea at a time
- Minimum 24h research (prefer 48h)
- NO development during research
- Objective scoring, no cherry-picking

### Stage 2: Decision Gate
```
Scout submits report → Steve reviews → Rajesh decides
```

| Score | Steve Action | Rajesh Decision |
|-------|--------------|-----------------|
| < 6 | Recommend DROP | "Next" → Scout finds new idea |
| 6-7.5 | Recommend MONITOR | "Keep watching" or "Next" |
| > 7.5 | Recommend BUILD | "Build it" → Stage 3<br>"No" → Drop, next idea |

### Stage 3: Build (Only if Approved)
```
Rajesh: "Build it"
    ↓
Steve: Set up Kimi CLI in /tmp/[idea]/
    ↓
Kimi: Auto-build MVP (4-8h)
    ↓
Steve: Test and review
    ↓
Steve: Report to Rajesh
    ↓
Rajesh: Ship / Pivot / Kill
```

---

## Communication Patterns

### Hour 0: Research Starts
**Scout → Steve:**
```
"Starting 48h validation on: [Idea Name]
Problem: [One-liner]
Initial signals: [X Reddit posts, Y HN threads]
Locked until: [Timestamp + 48h]"
```

### Hour 24: Mid-point Check
**Scout → Steve:**
```
"24h update on [Idea]:
- Trend strength: [Strong/Medium/Weak]
- User pain evidence: [X quotes]
- Competition gap: [Yes/No - details]
- Concerns: [Any red flags]"
```

### Hour 48: Validation Report
**Scout → Steve:**
```
Validation report complete: [idea]-[date].md
Score: X/10
Recommendation: [GO / MONITOR / NO-GO]
```

**Steve → Rajesh:**
```
🔍 Scout's 48h Research Complete

Idea: [Name]
Score: X/10 ([Problem: X, Market: X, Stack: X, Speed: X, Money: X])

Key Finding: [One-liner]
Risk: [Main concern]

Decision needed:
[ ] BUILD IT → Kimi starts now
[ ] MONITOR → Keep researching this
[ ] NEXT → Drop it, find new idea

Full report: [link]
```

### Build Complete
**Steve → Rajesh:**
```
✅ MVP Built: [Idea Name]
Location: /tmp/[idea]/
Time: X hours
Features: [List]
Tested: [Yes/No - results]

Demo: [screenshot/link]

Decision:
[ ] SHIP - Deploy to production
[ ] PIVOT - Keep but change direction
[ ] KILL - Abandon, next idea
```

---

## Tools Each Agent Uses

### Scout
- `web_search` - Trend discovery
- `web_fetch` - Deep content analysis
- `memory_search` - Check past research
- `write` - Validation reports
- `cron` - Schedule research cycles

### Steve
- `read` - Review validation reports
- `sessions_spawn` - Start Kimi builds
- `process` - Monitor Kimi progress
- `message` - Report to Rajesh
- `exec` - Test builds

### Kimi (via Steve)
- `kimi -y` - Auto-build MVPs
- Workdir: `/tmp/[idea-name]/`
- Model: `kimi-for-coding`

---

## File Structure

```
/home/ubuntu/clawd/agents/saas-research/
├── WORKFLOW.md              # This workflow (source of truth)
├── COLLABORATION.md         # This file
├── memory/
│   ├── active-research.json # Current idea being researched
│   ├── validation-[idea]-[date].md  # Completed reports
│   ├── rejected/            # Dropped ideas (learnings)
│   └── builds/              # Successful MVPs
└── scripts/
    ├── run_research_cycle.py    # Scout research runner
    └── submit_validation.py     # Report generator
```

---

## Key Principles

1. **Patience over speed** - 48h validation beats 10 rushed MVPs
2. **One idea at a time** - No parallel research
3. **Score objectively** - Use the rubric, no gut feelings
4. **Rajesh decides** - Steve recommends, Rajesh approves
5. **Drop quickly** - Score < 6? Move on. Don't get attached.
6. **Preserve learnings** - Rejected ideas go to `rejected/` folder

---

## Example Timeline

```
Day 1 09:00 - Scout starts: "AI Contract Review for SMBs"
Day 1 09:00 - Steve: "Locked for 48h. Researching."

Day 2 09:00 - Scout: "24h update. Strong signals. Continuing."

Day 3 09:00 - Scout: "Validation complete. Score: 8.2/10"
Day 3 09:05 - Steve: "Rajesh - Scout recommends BUILD. Approve?"
Day 3 10:30 - Rajesh: "Build it"
Day 3 10:35 - Steve: "Kimi starting build..."

Day 3 18:00 - Steve: "MVP complete. Demo ready."
Day 3 18:30 - Rajesh: "SHIP - Deploy it"

Day 4+       - Live product, real users, real revenue
```

---

## Emergency Overrides

Rajesh can override at any stage:
- "Stop research, drop this" → Scout stops, next idea
- "Build NOW" → Skip remaining research hours
- "Research longer" → Extend 48h to 72h

**But the default is: 48h validation → approval → build.**

---

*Workflow Version: 2.0 - Validate Before Build*
*Updated: 2026-01-30 by Steve*
