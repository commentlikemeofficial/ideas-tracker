---
name: task-master
description: Track, prioritize, and manage TODOs with deadline reminders across all conversations. Use when the user mentions tasks, todos, deadlines, reminders, or needs to track action items across sessions. Triggers include "add task", "what are my tasks", "remind me", "deadline", "prioritize", or any task management request.
---

# Task Master

Cross-session task tracking with prioritization and deadline reminders.

## Quick Commands

```bash
# Add a task
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py add "Task description" [priority] [deadline] [context]

# List open tasks (sorted by priority)
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py list

# List all tasks including completed
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py list all

# Complete a task
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py complete <id>

# Delete a task
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py delete <id>

# Check upcoming deadlines
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py upcoming [hours]
```

## Adding Tasks

When user mentions a task or action item:

```bash
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py add "Ship the v2 API" high 2026-01-30 "Project X"
```

Priority levels: `critical` > `high` > `medium` > `low`
Deadline format: ISO datetime (e.g., `2026-01-30T17:00`) or just date `2026-01-30`

## Listing Tasks

Always show open tasks sorted by priority when asked about tasks/todos:

```bash
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py list
```

Output format:
```
  ○ #5 [HIGH] Ship the v2 API [due: 2026-01-30]
  ○ #3 [MEDIUM] Write blog post
  ✓ #2 [LOW] Update docs
```

## Deadline Reminders

The system checks for upcoming deadlines automatically. To manually check:

```bash
python3 /home/ubuntu/clawd/skills/task-master/scripts/check_reminders.py --hours 48
```

## Data Schema

See [references/schema.md](references/schema.md) for full task structure.

Storage: `/home/ubuntu/clawd/memory/tasks.json`

## Patterns

**Extracting tasks from conversation:**
- Listen for phrases like "I need to...", "Remind me to...", "Don't forget..."
- Ask: priority? deadline? context/project?
- Add immediately, confirm with user

**Review cadence:**
- Check tasks during heartbeats
- Surface urgent/overdue items proactively
- Weekly: suggest archiving old completed tasks

**Prioritization:**
- Critical = same day or blockers
- High = this week
- Medium = next week
- Low = backlog