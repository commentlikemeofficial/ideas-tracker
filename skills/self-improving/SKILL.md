---
name: self-improving
description: Capture errors, lessons learned, and feedback to build institutional knowledge that improves future performance. Use when mistakes happen, better approaches are discovered, user preferences are expressed, or when starting tasks similar to past work. Triggers include "remember this", "don't do X again", "that worked well", "lesson learned", or before starting complex/multi-step work.
---

# Self-Improving

Build a knowledge base of what works, what doesn't, and why. Automatically apply those lessons to future tasks.

## Core Philosophy

Every mistake is data. Every success is a pattern. Capture both.

## Quick Commands

```bash
# Add a lesson
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py add-lesson "Always test scripts before packaging" insight exec

# Log an error with solution
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py add-error \
  "npm install hung indefinitely" \
  "missing undici dependency in npx sandbox" \
  "install globally instead of npx" \
  "npm" \
  "prefer global installs for CLI tools"

# Capture what worked
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py add-feedback \
  "Using timeout on exec prevented indefinite hangs" \
  "" \
  "always add timeouts to network operations"

# Get suggestions for current task
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py suggest "deploy to AWS"

# Search lessons
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py search "npm"

# Get tool-specific wisdom
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py tool "git"

# See recent errors
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py errors
```

## Categories

- **error**: Mistakes, failures, what broke and why
- **insight**: Realizations, better ways, "aha" moments  
- **workaround**: Temporary fixes, hacks that work
- **preference**: User preferences on style, approach, output
- **pattern**: Reusable solutions, templates, architectures
- **feedback**: What worked/didn't in completed tasks

## When to Capture

**Always capture:**
- Commands that failed unexpectedly
- Workarounds that took time to find
- User corrections ("no, do it this way instead")
- Performance bottlenecks discovered
- Security or safety lessons

**Capture when significant:**
- New tool/workflows that work well
- Architectural decisions and rationale
- Time-saving shortcuts
- Better ways to phrase/code/build

## Integration Patterns

**Before starting similar work:**
```bash
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py suggest "task description"
```

**After errors:**
```bash
python3 /home/ubuntu/clawd/skills/self-improving/scripts/learner.py add-error "..." "..." "..."
```

**During heartbeats:**
The check_lessons.py script surfaces recent errors and high-value lessons automatically.

## Storage

Lessons stored at: `/home/ubuntu/clawd/memory/lessons.json`

Structure tracks:
- What was learned
- Context/circumstances
- How often it's been accessed
- When it was last relevant

## Retrieval

Lessons are retrieved by:
1. **Keyword matching** in task descriptions
2. **Tool association** (npm, git, aws, etc.)
3. **Category filtering** (errors, patterns, etc.)
4. **Access frequency** (most-used lessons surface first)

## Example Workflow

1. **Task**: Deploy to production
2. **Check**: `learner.py suggest "deploy to production"`
3. **Surface**: "Lesson #5: Always run tests before deploy"
4. **Execute**: Run tests
5. **Result**: Success
6. **Capture**: `learner.py add-feedback "Running tests caught 2 bugs pre-deploy"`

## Data Schema

See [references/schema.md](references/schema.md) for full structure.