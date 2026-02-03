# Task Master Skill

## Purpose
Task management system for tracking work items, deadlines, and priorities.

## Usage

```bash
# Add a task
python3 skills/task-master/scripts/task_manager.py add "Task description" [priority] [deadline] [context]

# List tasks
python3 skills/task-master/scripts/task_manager.py list [status] [sort_by]

# Complete a task
python3 skills/task-master/scripts/task_manager.py complete <task_id>

# Delete a task
python3 skills/task-master/scripts/task_manager.py delete <task_id>

# Check upcoming deadlines
python3 skills/task-master/scripts/task_manager.py upcoming [hours]

# Check reminders (for cron/heartbeat)
python3 skills/task-master/scripts/check_reminders.py [--hours 24]
```

## Priority Levels
- critical
- high
- medium
- low

## Examples

```bash
# Add urgent task
python3 skills/task-master/scripts/task_manager.py add "Fix production bug" critical 2025-02-05 "User reported"

# List open tasks sorted by deadline
python3 skills/task-master/scripts/task_manager.py list open deadline

# Complete task #3
python3 skills/task-master/scripts/task_manager.py complete 3
```

## Data Storage
Tasks stored in: `/home/ubuntu/clawd/memory/tasks.json`

## Scripts
- `task_manager.py` - Main task operations
- `check_reminders.py` - Check for upcoming/overdue tasks

## Integration
Use with cron or heartbeat to get daily reminders:
```bash
0 9 * * * cd /home/ubuntu/clawd && python3 skills/task-master/scripts/check_reminders.py
```
