#!/bin/bash
# ContentClaw Autonomous Runner
# Triggered by cron/heartbeat - runs without user approval

WORKDIR="/home/ubuntu/clawd/agents/contentclaw"
LOG_FILE="$WORKDIR/memory/autonomous_runs.log"

echo "$(date): ContentClaw autonomous run started" >> $LOG_FILE

# Step 1: Research trending topics
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py research "AI SaaS YouTube trends 2025" --save > /tmp/tavily_results.txt 2>&1

# Step 2: Find YouTube URLs from results
# For now, use a known good video or search results
VIDEO_URL="https://youtube.com/watch?v=EXAMPLE"

# Step 3: Generate content for ALL platforms
python3 $WORKDIR/scripts/contentclaw.py "$VIDEO_URL" >> $LOG_FILE 2>&1

# Step 4: Log to Google Sheets
LATEST_JSON=$(ls -t $WORKDIR/memory/content_*.json | head -1)
if [ -f "$LATEST_JSON" ]; then
    python3 $WORKDIR/scripts/tracker.py log "$LATEST_JSON" >> $LOG_FILE 2>&1
    echo "$(date): Content generated and logged for $VIDEO_URL" >> $LOG_FILE
else
    echo "$(date): ERROR - No content generated" >> $LOG_FILE
fi

echo "$(date): Autonomous run completed" >> $LOG_FILE
