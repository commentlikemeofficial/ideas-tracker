# Operational Rules

## Destructive Action Safeguards
**Confirmed:** 2026-02-03

### Always Ask Before:
- `rm` (permanent deletion) — prefer `trash`
- Database drops, table deletion
- Git force pushes, branch deletion
- API key revocation
- Infrastructure teardown

### Warning Required For:
- Expensive operations (high API costs)
- Irreversible changes
- External commitments
- Public posts (tweets, emails)

## Safety Defaults
**Confirmed:** 2026-02-03

- `trash` > `rm` (recoverable beats gone forever)
- When in doubt, ask
- Never commit secrets to git
