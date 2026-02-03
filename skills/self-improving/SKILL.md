# Self-Improving Skill

## Purpose
Capture errors, lessons, and feedback to build institutional knowledge and prevent repeated mistakes.

## Usage

```bash
# Add a general lesson
python3 skills/self-improving/scripts/learner.py add-lesson <lesson> <category> [tool] [tags]

# Add an error with solution
python3 skills/self-improving/scripts/learner.py add-error <error> <root_cause> <solution> [tool] [prevention]

# Add feedback on what worked
python3 skills/self-improving/scripts/learner.py add-feedback <what_worked> [what_didnt] [suggestion] [tool]

# Search lessons
python3 skills/self-improving/scripts/learner.py search [query]

# Get tool-specific guidance
python3 skills/self-improving/scripts/learner.py tool <tool_name>

# Get common errors
python3 skills/self-improving/scripts/learner.py errors [tool]

# Suggest approach based on past tasks
python3 skills/self-improving/scripts/learner.py suggest <task_description>

# Check for recent lessons (for cron/heartbeat)
python3 skills/self-improving/scripts/check_lessons.py
```

## Categories
- error - Mistakes and how to fix them
- insight - General learnings
- workaround - Temporary solutions
- preference - User preferences
- pattern - Recurring patterns

## Examples

```bash
# Log an error
python3 skills/self-improving/scripts/learner.py add-error \
    "Database connection timeout" \
    "Connection pool exhausted" \
    "Increase pool size in config" \
    "postgresql" \
    "Monitor connection count"

# Log what worked
python3 skills/self-improving/scripts/learner.py add-feedback \
    "Using async/await improved performance by 3x" \
    "" \
    "Apply to other I/O bound operations" \
    "python"

# Search for relevant lessons
python3 skills/self-improving/scripts/learner.py search "database"

# Get suggestions before starting a task
python3 skills/self-improving/scripts/learner.py suggest "Deploy to production"
```

## Data Storage
Lessons stored in: `/home/ubuntu/clawd/memory/lessons.json`

## Scripts
- `learner.py` - Main lesson management
- `check_lessons.py` - Surface relevant lessons

## Integration
Use before starting similar tasks:
```bash
# Check for relevant lessons
python3 skills/self-improving/scripts/learner.py suggest "$TASK_DESCRIPTION"
```
