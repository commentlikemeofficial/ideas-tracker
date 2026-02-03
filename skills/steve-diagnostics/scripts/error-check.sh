#!/bin/bash
# Error check - last 10 errors

LOGFILE="/tmp/clawdbot/clawdbot-$(date +%Y-%m-%d).log"

echo "=== Recent Errors ==="
if [ -f "$LOGFILE" ]; then
    grep -iE "error|fail|exception|invalid" "$LOGFILE" 2>/dev/null | tail -10 | while read line; do
        echo "  • $line"
    done || echo "No errors found"
else
    echo "No log file for today"
fi
