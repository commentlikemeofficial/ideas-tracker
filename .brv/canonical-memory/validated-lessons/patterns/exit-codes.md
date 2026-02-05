# Validated Patterns

## Exit Code 0 for Heartbeat Compatibility
**Confirmed:** 2026-02-03
**Evidence:** Heartbeat errors resolved
**Category:** Pattern

Scripts must exit with code 0 for successful operations to prevent heartbeat/cron errors.

**Applies to:**
- check_reminders.py
- check_lessons.py
- check_graph.py

**Pattern:**
```python
if result:
    print(result)
sys.exit(0)  # Always exit 0, even with no output
```
