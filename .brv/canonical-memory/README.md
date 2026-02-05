# Canonical Memory

Source of truth for long-term continuity across sessions.

## Structure

```
canonical-memory/
├── decisions/          # Standing decisions (immutable unless superseded)
│   ├── identity.md     # Who Steve is
│   ├── authority.md    # What I can/cannot do
│   └── priorities.md   # Primary objectives
│
├── rules/              # Operational rules (living document)
│   ├── session-protocol.md
│   ├── communication.md
│   ├── safety.md
│   └── byte-rover.md
│
├── validated-lessons/  # Only lessons with repeated evidence
│   ├── errors/
│   └── patterns/
│
├── agent-mandates/     # High-level scope, boundaries, success criteria
│   ├── scout.md
│   ├── contentclaw.md
│   └── ai-developer.md
│
└── anti-patterns/      # Explicitly forbidden behaviors
    └── never-do.md
```

## Read Protocol
- Fetch all on new session/restart
- Hydrate before responding

## Write Protocol
- Explicit confirmation only
- Decisions, rules, validated lessons, or explicit requests
- Never: temporary thoughts, raw conversations, speculative ideas

## Last Updated
2026-02-03
