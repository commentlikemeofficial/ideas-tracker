#!/bin/bash
# check-rate-limits.sh - Check current rate limits and suggest actions

echo "⏱️  Rate Limit Status Check"
echo "==========================="
echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Check Kimi/OpenRouter usage (approximate)
# In real implementation, this would query actual API usage

KIMI_SESSIONS_TODAY=$(find /home/ubuntu/clawd/agents/ai-developer/projects -name "*.log" -mtime -1 | wc -l)

echo "📊 Today's Activity"
echo "------------------"
echo "Coding sessions today: $KIMI_SESSIONS_TODAY"
echo ""

# Rate limit thresholds
if [ $KIMI_SESSIONS_TODAY -lt 3 ]; then
  echo "✅ Status: GREEN"
  echo "   Safe to use Kimi CLI"
  echo "   Recommend: 30-45 min session"
  exit 0
elif [ $KIMI_SESSIONS_TODAY -lt 6 ]; then
  echo "⚠️  Status: YELLOW"
  echo "   Approaching limits"
  echo "   Recommend: Shorter sessions (20-30 min)"
  echo "   Alternative: Use DeepSeek or Gemini"
  exit 0
else
  echo "🔴 Status: RED"
  echo "   Rate limits likely hit"
  echo "   Action: Switch to alternative models"
  echo "   Options:"
  echo "     - DeepSeek Coder (cheap, fast)"
  echo "     - Gemini 2.0 Flash (free tier)"
  echo "     - Local Ollama (completely free)"
  exit 1
fi
