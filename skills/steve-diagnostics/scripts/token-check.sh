#!/bin/bash
# Token check - warn if context getting heavy

MEMORY_DIR="/home/ubuntu/clawd/memory"

echo "=== Context Size Check ==="

# Check memory file sizes
if [ -d "$MEMORY_DIR" ]; then
    TOTAL_LINES=$(cat "$MEMORY_DIR"/*.md 2>/dev/null | wc -l)
    echo "📝 Total memory lines: $TOTAL_LINES"
    
    if [ "$TOTAL_LINES" -gt 1000 ]; then
        echo "⚠️  Context getting heavy - consider /compact or archiving old memories"
    elif [ "$TOTAL_LINES" -gt 500 ]; then
        echo "✅ Context healthy but growing"
    else
        echo "✅ Context light and fast"
    fi
else
    echo "Memory directory not found"
fi
