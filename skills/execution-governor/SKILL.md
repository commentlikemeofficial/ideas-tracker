# Execution Governor

governance layer for preventing stalled work, zombie ideas, and low-ROI loops.

## Installation

Governor is automatically available. No installation needed.

## Usage

### Register an Initiative
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  register "Initiative Name" agent "Expected output"
```

### Register Urgent Initiative (24h threshold)
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  register "Urgent Fix" ai-developer "Deploy hotfix" --urgent
```

### Update Activity
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  activity [initiative-id]
```

### Mark Complete
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  complete [initiative-id]
```

### Check for Stalled Work
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py check
```

### Check Status
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py status
```

### Disable Governor
```bash
touch /home/ubuntu/clawd/.disable-governor
```

### Enable Governor
```bash
rm /home/ubuntu/clawd/.disable-governor
```

## How It Works

1. **Registration**: All agent-started work auto-registered
2. **Tracking**: Monitors last activity timestamp
3. **Detection**:
   - Stalled: No activity >48h (or 24h for urgent)
   - Duplicates: Similar names across different agents
   - Circular: A waiting on B, B waiting on A
4. **Escalation**: Immediate Telegram alert with binary decision

## Constraints

- NO content creation
- NO research
- NO execution
- NO alternative suggestions
- Observation + escalation only

## Escalation Format

```
🚨 EXECUTION GOVERNOR ALERT

Initiative: [name]
Agent: [agent]
Status: [STALLED/DUPLICATE/CIRCULAR]

Decision required:
[ ] KILL — Drop it, move on
[ ] PROCEED — Reactivate with new deadline
[ ] SIMPLIFY — Reduce scope, ship smaller
```

## Auto-Recommend Kill

After 3 escalations, governor adds:
```
⚠️ AUTO-RECOMMEND: KILL (3+ escalations)
```

Final decision always remains with Rajesh.

## Files

- Script: `skills/execution-governor/scripts/governor.py`
- Data: `memory/initiatives.json`
- Disable Flag: `.disable-governor`

## Integration

Governor runs automatically via heartbeat every 6 hours.
