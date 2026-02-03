---
name: prompt-log
description: Extract conversation transcripts from AI coding session logs (Clawdbot, Claude Code, Codex, Kimi). Use when asked to export prompt history, session logs, or transcripts from .jsonl session files.
---

# Prompt Log

Extract and export conversation transcripts from AI coding session logs.

## Quick start

Run the bundled script on a session file:

```bash
node scripts/extract.js <session-file>
```

## Inputs

- **Session file**: A `.jsonl` session log from Clawdbot, Claude Code, Codex, or Kimi.
- **Optional filters**: `--after` and `--before` ISO timestamps.
- **Optional output**: `--output` path for the markdown transcript.

## Outputs

- Writes a markdown transcript. Defaults to `.prompt-log/YYYY-MM-DD-HHMMSS.md` in the current project.

## Examples

```bash
# Extract from Kimi session
node scripts/extract.js ~/.kimi/sessions/session-abc.jsonl

# Extract from Clawdbot session
node scripts/extract.js ~/.clawdbot/agents/main/sessions/123.jsonl

# Extract with time range
node scripts/extract.js ~/.codex/sessions/2026/01/12/abcdef.jsonl --after "2026-01-12T10:00:00" --before "2026-01-12T12:00:00"

# Custom output
node scripts/extract.js session.jsonl --output my-transcript.md
```

## Supported Formats

- **Clawdbot/OpenClaw**: `~/.clawdbot/agents/main/sessions/*.jsonl`
- **Claude Code**: `~/.claude/projects/*/sessions/*.jsonl`
- **Codex**: `~/.codex/sessions/*/*/*/*.jsonl`
- **Kimi**: `~/.kimi/sessions/*.jsonl`

## Dependencies

- Node.js (no external dependencies)
