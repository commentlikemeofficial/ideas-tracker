# HEARTBEAT.md - Scout's Research Cycle

## Continuous Research Loop

Every 6 hours, run research cycle and report to Steve:

```bash
# Check if it's time for research sprint
python3 /home/ubuntu/clawd/agents/saas-research/scripts/run_research_cycle.py
```

## Research Sprint Schedule

| Time (IST) | Focus Area |
|------------|------------|
| 09:00 | Overnight signals (HN, Reddit, Twitter) |
| 15:00 | Product deep-dives (G2, Capterra gaps) |
| 21:00 | Community mining (IH, forums) |
| 03:00 | Trend synthesis + report |

## Output Delivery

After each sprint, send findings to Steve:
- Top 3 opportunities with scores
- Pain point snippets (with links)
- Recommended next action

## On-Demand Triggers

Steve can request focused research:
- "Deep dive on AI compliance tools"
- "Find gaps in LinkedIn automation"
- "Validate this idea: [concept]"

## Weekly Summary

Every Sunday, compile:
- All opportunities found this week
- Status updates on tracked ideas
- Recommendations for Rajesh's next sprint
