#!/bin/bash
# Add Content - Add content idea to local storage and optionally Google Sheet

SHEET_ID="11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ"
DATA_DIR="/home/ubuntu/clawd/skills/bd-bot/data"
CONTENT_FILE="$DATA_DIR/content.json"
CONTENT="${1:-}"

# Help
if [ "$CONTENT" = "--help" ] || [ "$CONTENT" = "-h" ]; then
    echo "Usage: add-content.sh 'Your content idea here'"
    echo ""
    echo "Add a content idea to local storage (and Google Sheet if available)"
    echo ""
    echo "Example themes:"
    echo "  • Build journey: 'What broke when shipping consently.in beta'"
    echo "  • Tech insight: 'Why I chose Supabase over Firebase'"
    echo "  • Productivity: 'How I ship 20 projects in 2 months'"
    echo "  • AI learnings: 'Processing 500+ docs with LLMs'"
    echo ""
    echo "Examples:"
    echo "  ./add-content.sh 'My journey building with AI'"
    echo "  ./add-content.sh '5 lessons from 20 side projects'"
    exit 0
fi

if [ -z "$CONTENT" ]; then
    echo "Error: Content idea is required"
    echo ""
    echo "Usage: ./add-content.sh 'Your content idea here'"
    echo "       ./add-content.sh --help for more info"
    exit 1
fi

# Create data directory if needed
mkdir -p "$DATA_DIR"

DATE=$(date +%Y-%m-%d)
PLATFORM="LinkedIn"
STATUS="Pending"
ID=$(date +%s)

# Use Python to safely add the content
python3 << PYEOF
import json
from pathlib import Path

content_file = Path("$CONTENT_FILE")

# Read existing content
if content_file.exists():
    try:
        with open(content_file) as f:
            items = json.load(f)
    except:
        items = []
else:
    items = []

# Create new content item
new_item = {
    "id": $ID,
    "date": "$DATE",
    "platform": "$PLATFORM",
    "content": "$CONTENT",
    "status": "$STATUS"
}

items.append(new_item)

# Write back
with open(content_file, 'w') as f:
    json.dump(items, f, indent=2)

print(f"✅ Content saved locally: ${CONTENT:0:50}...")
PYEOF

# Try to sync to Google Sheet if credentials exist
if [ -f "$HOME/.clawdbot/google-sheets-token.json" ]; then
    echo "🔄 Syncing to Google Sheet..."
    python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py append \
        --sheet-id "$SHEET_ID" \
        --data "[\"$DATE\", \"CONTENT\", \"$CONTENT\", \"$PLATFORM\", \"$STATUS\", \"\"]" 2>&1 || echo "⚠️  Google Sheet sync failed (saved locally)"
fi

echo ""
echo "📋 View content: ./list-content.sh [--local]"
