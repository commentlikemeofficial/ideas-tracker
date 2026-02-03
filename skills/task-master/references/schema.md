# Task Data Schema

## Task Structure

```json
{
  "id": 1,
  "description": "Task description",
  "priority": "high",
  "deadline": "2026-01-30T17:00:00",
  "status": "open",
  "context": "Project Alpha",
  "created_at": "2026-01-28T17:33:00",
  "completed_at": null
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique task identifier (auto-incrementing) |
| `description` | string | The task text |
| `priority` | string | One of: `critical`, `high`, `medium`, `low` |
| `deadline` | ISO datetime or null | When the task is due |
| `status` | string | `open`, `completed`, or `archived` |
| `context` | string | Project/context tag for grouping |
| `created_at` | ISO datetime | When task was created |
| `completed_at` | ISO datetime or null | When task was marked done |

## Priority Levels

- **critical** - Blocker, do immediately
- **high** - Important, schedule soon
- **medium** - Normal priority (default)
- **low** - Backlog, nice-to-have

## Storage

Tasks stored at: `/home/ubuntu/clawd/memory/tasks.json`

Format:
```json
{
  "tasks": [...],
  "next_id": 42
}
```