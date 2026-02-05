# Execution Tracking Rules

## Initiative Registration
**Confirmed:** 2026-02-03

### Auto-Track
All agent-started initiatives automatically registered.

### Manual Track
Ad-hoc thinking and conversations NOT tracked unless explicitly registered:
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  register "Initiative Name" agent "Expected output"
```

### Time-Sensitive Override
Steve may set 24h threshold for urgent initiatives:
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  register "Urgent Fix" ai-developer "Deploy hotfix" --urgent
```

## Activity Updates
Agents must update activity on progress:
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  activity [initiative-id]
```

## Completion
Mark complete when done:
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py \
  complete [initiative-id]
```

## Governor Check
Run automatically via heartbeat every 6 hours.
Manual check:
```bash
python3 /home/ubuntu/clawd/skills/execution-governor/scripts/governor.py check
```
