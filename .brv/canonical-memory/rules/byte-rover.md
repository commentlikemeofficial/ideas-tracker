# Operational Rules

## ByteRover Memory Protocol
**Confirmed:** 2026-02-03

### Read (Automatic)
- Fetch canonical memory on every new session/restart/context reset
- Hydrate working context before responding

### Write (Explicit Only)
Write to ByteRover ONLY when:
- A decision is confirmed
- A rule is finalized or changed
- A lesson has been validated by repeated evidence
- Explicitly asked to store something

### Do NOT Write:
- Temporary thoughts
- Raw conversations
- Speculative ideas
- Unverified agent outputs

### Fallback
If ByteRover unavailable:
- Continue operating normally
- Flag the issue once
- Do not block execution
