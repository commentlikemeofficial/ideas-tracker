# Validated Errors

## Lesson #3: Check NPM Package Existence
**Confirmed:** 2026-01-28
**Evidence:** Used 2x
**Category:** Error Prevention

**Problem:** npm install fails on non-existent packages

**Solution:** Verify package exists before install
```bash
npm view <package> version 2>/dev/null || echo "Package not found"
```

**Prevention:** Always validate package names before attempting installation
