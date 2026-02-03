#!/bin/bash
# Daily stats summary

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Usage: daily-stats.sh"
  echo ""
  echo "Show daily statistics"
  echo ""
  echo "Shows:"
  echo "  • Message count"
  echo "  • Error count"
  echo "  • Log size"
  echo "  • Tool call count"
  exit 0
fi

LOGFILE="/tmp/clawdbot/clawdbot-$(date +%Y-%m-%d).log"

echo "=== Daily Stats ($(date +%Y-%m-%d)) ==="

if [ -f "$LOGFILE" ]; then
    # Message count (approximate from user messages)
    MSG_COUNT=$(grep -c '"role":"user"' "$LOGFILE" 2>/dev/null || echo 0)
    echo "📨 Messages: $MSG_COUNT"
    
    # Error count
    ERR_COUNT=$(grep -ciE "error|fail|exception" "$LOGFILE" 2>/dev/null || echo 0)
    echo "🚨 Errors: $ERR_COUNT"
    
    # Log size
    LOG_SIZE=$(du -h "$LOGFILE" 2>/dev/null | cut -f1)
    echo "📝 Log size: $LOG_SIZE"
    
    # Tool calls
    TOOL_COUNT=$(grep -c '"tool"' "$LOGFILE" 2>/dev/null || echo 0)
    echo "🔧 Tool calls: $TOOL_COUNT"
else
    echo "No log file for today"
fi
