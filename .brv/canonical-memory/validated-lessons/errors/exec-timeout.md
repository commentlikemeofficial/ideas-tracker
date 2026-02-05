# Validated Errors

## Lesson #2: Exec Timeout Prevents Hangs
**Confirmed:** 2026-01-28
**Evidence:** Used 2x
**Category:** Error Prevention

**Problem:** Long-running commands hang indefinitely

**Solution:** Always use timeout on exec
```python
subprocess.run(cmd, timeout=30)
```

**Prevention:** Add timeouts to all network operations and long-running commands
