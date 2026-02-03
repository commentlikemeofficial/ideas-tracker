# Scout + Steve + Kimi Workflow v2.0

**Status:** ✅ CONFIGURED | **Default:** Validate Before Build

---

## Workflow Summary

```
Scout (24-48h research) → Steve (evaluation) → Rajesh (approval) → Kimi (build)
                         ↓                      ↓
                   Score < 6? Drop       "No"? Drop
                   Score > 7.5? Submit   "Yes"? Build
```

**Key Constraint:** NO development during research. NO auto-builds without approval.

---

## Phase Details

### Phase 1: Scout Research (24-48h)
- **Focus:** ONE idea at a time
- **Output:** Validation report with 0-10 score
- **Location:** `~/clawd/agents/saas-research/memory/`

**Scoring Dimensions (weighted):**
| Dimension | Weight | What Scout Checks |
|-----------|--------|-------------------|
| Problem clarity | 20% | Reddit/HN/Twitter pain signals |
| Market demand | 20% | Search trends, engagement metrics |
| Competition gap | 15% | Competitor weaknesses, differentiation |
| Stack fit | 15% | Next.js/Supabase/AI compatibility |
| MVP speed | 15% | Can build in < 8 hours? |
| Monetization | 15% | Pricing model, CAC/LTV estimates |

**Decision Matrix:**
- **0-6:** DROP → Next idea
- **6-7.5:** MONITOR → Keep in backlog
- **7.5-10:** SUBMIT → Await Rajesh approval

### Phase 2: Decision Gate
**Steve presents:**
```
🔍 Scout Research Complete (48h)

Idea: [Name]
Score: X/10
Key Finding: [One-liner]
Risk: [Main concern]

[ ] BUILD IT
[ ] MONITOR
[ ] NEXT (drop)
```

### Phase 3: Build (Only if Approved)
**Kimi CLI:**
```bash
kimi -y -p "Build MVP: [idea]. Stack: [X]. Focus: [core feature]."
```

---

## Current Setup

### ✅ Installed & Ready
- Kimi CLI v1.4 (logged in, `kimi-for-coding` model)
- Coding Agent skill (Kimi as default)
- Scout agent framework
- Validation workflow documented

### 📁 Key Files
| File | Purpose |
|------|---------|
| `WORKFLOW.md` | Full workflow documentation |
| `COLLABORATION.md` | Agent communication patterns |
| `memory/active-research.json` | Current research state |
| `memory/validation-*.md` | Completed validation reports |

---

## Manual Operation (Until Cron Set Up)

**To start a research cycle:**
```bash
cd /home/ubuntu/clawd/agents/saas-research
python3 scripts/run_research_cycle.py
```

**To check status:**
```bash
cat memory/active-research.json
```

**To trigger build (after approval):**
```bash
export PATH="$HOME/.local/bin:$PATH"
cd /tmp/[idea-name]
kimi -y -p "Build MVP per validation report"
```

---

## Next Steps

1. **Set up Scout cron** (every 6h) — research progress checks
2. **Seed first idea** — what should Scout research first?
3. **Test the flow** — run one full 48h cycle manually

**Ready to start?** What idea should Scout research first?

---

*Workflow configured: 2026-01-30*
*Agents: Scout (research) → Steve (evaluate) → Kimi (build)*
