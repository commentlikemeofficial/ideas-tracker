---
name: coding-agent
description: Run Kimi CLI, Codex, Claude Code, or other AI coding agents via background process for programmatic control.
metadata: {"clawdbot":{"emoji":"🧩","requires":{"anyBins":["kimi","codex","claude","opencode","pi"]}}}
---

# Coding Agent (background-first)

Use **bash background mode** for non-interactive coding work. For interactive coding sessions, use the **tmux** skill.

## Default: Kimi CLI

Kimi CLI is pre-installed and configured with `kimi-for-coding` model.

### The Pattern: workdir + background

```bash
# Start Kimi in target directory (focused context)
bash workdir:~/project background:true command:"kimi -y -p 'Your task here'"

# Returns sessionId for tracking
process action:log sessionId:XXX
process action:poll sessionId:XXX
```

### Building MVPs (Auto-approve mode)

```bash
# Auto-approve all changes (use carefully!)
bash workdir:~/project background:true command:"kimi -y -p 'Build a Next.js app with auth'"

# With specific constraints
bash workdir:~/project background:true command:"kimi -y -p 'Build landing page. Stack: React + Tailwind. Max 3 components.'"
```

### Research + Implementation Flow

```bash
# 1. Research phase (output to file)
bash workdir:/tmp background:true command:"kimi -y -p 'Research Stripe vs LemonSqueezy for Indian SaaS. Output to /tmp/research.md'"

# 2. Read research
read path:/tmp/research.md

# 3. Implement based on research
bash workdir:~/project background:true command:"kimi -y -p 'Implement payment using findings from /tmp/research.md'"
```

---

## Kimi CLI Reference

**Config:** `~/.kimi/config.toml` (already set to `kimi-for-coding`)

**Flags:**
- `-y`, `--yolo` — Auto-approve all actions (no confirmation)
- `-p`, `--prompt` — Non-interactive mode (run and exit)
- `--print` — Print mode (non-interactive, text output)
- `--model` — Override model (default: kimi-for-coding)
- `--thinking` — Enable thinking mode

**Examples:**

```bash
# Simple task
kimi -y -p "Create a README for this project"

# Complex build
kimi -y -p "Build a full-stack todo app. Frontend: Next.js + Tailwind. Backend: FastAPI. DB: SQLite. Include auth."

# Code review
kimi -y -p "Review src/ directory for security issues. Output findings to review.md"

# Refactoring
kimi -y -p "Refactor this codebase to use TypeScript strict mode. Fix all type errors."
```

---

## Alternative Agents

### Codex CLI (OpenAI)
```bash
bash workdir:~/project background:true command:"codex --yolo 'Your task'"
```

### Claude Code (Anthropic)
```bash
bash workdir:~/project background:true command:"claude 'Your task'"
```

### Pi Coding Agent
```bash
bash workdir:~/project background:true command:"pi -p 'Your task'"
```

---

## Monitoring & Control

```bash
# List all sessions
process action:list

# Check progress
process action:log sessionId:XXX limit:50

# Check if running
process action:poll sessionId:XXX

# Send input (if interactive)
process action:write sessionId:XXX data:"y"

# Kill if stuck
process action:kill sessionId:XXX
```

---

## ⚠️ Rules

1. **Default to Kimi** — It's already installed and configured
2. **Use `-y` for builds** — Auto-approve for overnight/supervised runs
3. **Workdir matters** — Keep agents focused on specific directories
4. **NEVER run in ~/clawd/** — That's the live Clawdbot workspace!
5. **Monitor long runs** — Check logs periodically with `process action:log`
6. **Kill stuck sessions** — Don't let hung processes run forever

---

## PR Template (For Agent-Generated PRs)

When agents submit PRs to external repos:

````markdown
## Original Prompt
[Exact request/problem statement]

## What this does
[High-level description]

**Features:**
- [Key feature 1]
- [Key feature 2]

**Example usage:**
```bash
# Example
command example
```

## Feature intent
[Why useful, how it fits, workflows it enables]

## How I tested
**Manual verification:**
1. [Test step] - Output: `[result]`
2. [Test step] - Result: [result]

**Files tested:**
- [Detail]
- [Edge cases]

## Implementation details
**New files:**
- `path/file.ts` - [description]

**Modified files:**
- `path/file.ts` - [change]

**Technical notes:**
- [Detail 1]
- [Detail 2]

---
*Submitted by Steve 🤖 - AI Coworker*
````

---

## Auto-Build Workflow (Overnight)

```bash
# 1. Scout finds opportunity (research output → /tmp/opportunity.md)

# 2. Steve evaluates and triggers Kimi
bash workdir:/tmp/project background:true command:"kimi -y -p 'Read /tmp/opportunity.md and build MVP. Stack: Next.js + Tailwind + Supabase. Focus on core feature only.'"

# 3. Monitor and report
process action:log sessionId:XXX | tail -20

# 4. Morning summary for Rajesh
```

---

## Quick Commands

```bash
# Kimi version
kimi --version

# Kimi web UI
kimi web --port 3456

# Check config
cat ~/.kimi/config.toml
```
