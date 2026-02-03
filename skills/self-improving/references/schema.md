# Lessons Data Schema

## Storage

File: `/home/ubuntu/clawd/memory/lessons.json`

## Structure

```json
{
  "lessons": [
    {
      "id": 1,
      "lesson": "Always test scripts before packaging",
      "category": "insight",
      "context": "Detailed context about when/why",
      "tool": "npm",
      "outcome": "success",
      "tags": ["testing", "packaging"],
      "created_at": "2026-01-28T18:00:00",
      "accessed_count": 3,
      "last_accessed": "2026-01-28T19:00:00"
    }
  ],
  "patterns": {
    "insight": [1, 5, 8],
    "error": [2, 3]
  },
  "next_id": 10
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Unique identifier |
| `lesson` | string | Core lesson text (searchable) |
| `category` | string | error, insight, workaround, preference, pattern, feedback |
| `context` | string | Full context, error details, solutions |
| `tool` | string | Associated tool (npm, git, aws, etc.) |
| `outcome` | string | success, failure, partial |
| `tags` | array | Searchable tags |
| `created_at` | ISO datetime | When learned |
| `accessed_count` | int | How often retrieved |
| `last_accessed` | ISO datetime | Last relevance |

## Categories

- **error**: Failures, bugs, mistakes with solutions
- **insight**: Better approaches, realizations
- **workaround**: Temporary fixes, hacks
- **preference**: User style preferences
- **pattern**: Reusable architectures, templates
- **feedback**: Post-task retrospective data

## Usage Tracking

The system automatically tracks:
- How often each lesson is accessed
- Which lessons are most valuable
- Recent vs. evergreen knowledge

High-access lessons surface automatically during suggestions.