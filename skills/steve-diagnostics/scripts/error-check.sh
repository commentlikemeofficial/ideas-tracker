#!/bin/bash
# Error check - last 10 errors

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Usage: error-check.sh"
  echo ""
  echo "Show last 10 errors from today's log"
  exit 0
fi

LOGFILE="/tmp/clawdbot/clawdbot-$(date +%Y-%m-%d).log"

echo "=== Recent Errors ==="
if [ -f "$LOGFILE" ]; then
    grep -iE "error|fail|exception|invalid" "$LOGFILE" 2>/dev/null | tail -10 | while read line; do
        echo "  • $line"
    done || echo "No errors found"
else
    echo "No log file for today"
fi
