#!/bin/bash
# Steve Status - Quick health check

echo "=== Steve Health Check ==="
echo ""

# Today's log file
LOGFILE="/tmp/clawdbot/clawdbot-$(date +%Y-%m-%d).log"

# Response times (last 10 messages)
echo "⏱️  Recent Response Times:"
if [ -f "$LOGFILE" ]; then
    grep "duration_ms" "$LOGFILE" 2>/dev/null | tail -10 | jq -r '"  \(.timestamp[11:19]) \(.duration_ms)ms \(.model // "unknown")"' 2>/dev/null || echo "  (no timing data)"
else
    echo "  (no log file)"
fi
echo ""

# Token estimate from memory files
MEMORY_DIR="/home/ubuntu/clawd/memory"
if [ -d "$MEMORY_DIR" ]; then
    MEM_SIZE=$(du -sh "$MEMORY_DIR" 2>/dev/null | cut -f1)
    MEM_FILES=$(ls -1 "$MEMORY_DIR"/*.md 2>/dev/null | wc -l)
    echo "📝 Memory: $MEM_FILES files, $MEM_SIZE"
else
    echo "📝 Memory: not initialized"
fi
echo ""

# Recent errors
echo "🚨 Recent Errors (last 5):"
if [ -f "$LOGFILE" ]; then
    grep -i "error\|fail\|exception" "$LOGFILE" 2>/dev/null | tail -5 | cut -d' ' -f1,2,5- || echo "  (none found)"
else
    echo "  (no log file)"
fi
echo ""

# Disk usage
echo "💾 Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2 " used (" $5 ")"}')"
echo ""

# Session suggestion
LOG_SIZE=$(stat -c%s "$LOGFILE" 2>/dev/null || echo 0)
if [ "$LOG_SIZE" -gt 1048576 ]; then
    echo "⚠️  Log file > 1MB - consider compacting session with /compact"
fi
