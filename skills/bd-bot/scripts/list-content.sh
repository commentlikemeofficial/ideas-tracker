#!/bin/bash
# List Content - Show content ideas from local storage or Google Sheet

SHEET_ID="11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ"
DATA_DIR="/home/ubuntu/clawd/skills/bd-bot/data"
CONTENT_FILE="$DATA_DIR/content.json"

# Help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: list-content.sh [--local]"
    echo ""
    echo "Show content ideas from local cache or Google Sheet"
    echo ""
    echo "Options:"
    echo "  --local   Show from local cache only"
    echo "  --help    Show this help"
    exit 0
fi

# If --local flag or no credentials, use local file
if [ "$1" = "--local" ] || [ ! -f "$HOME/.clawdbot/google-sheets-token.json" ]; then
    if [ -f "$CONTENT_FILE" ]; then
        echo "📋 Content Queue:"
        echo ""
        cat "$CONTENT_FILE" | python3 -m json.tool 2>/dev/null || cat "$CONTENT_FILE"
    else
        echo "No content ideas found."
        echo ""
        echo "To add content:"
        echo "  ./add-content.sh 'Title' 'Type' 'Topic' 'Status'"
    fi
    exit 0
fi

echo "📅 Fetching content queue from Google Sheet..."
echo ""

# Read sheet data with error handling
OUTPUT=$(python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py read \
    --sheet-id "$SHEET_ID" 2>&1)

# Check for errors
if echo "$OUTPUT" | grep -q "Error"; then
    echo "⚠️  Could not read from Google Sheet"
    echo "Falling back to local cache..."
    echo ""
    if [ -f "$CONTENT_FILE" ]; then
        cat "$CONTENT_FILE" | python3 -m json.tool 2>/dev/null || cat "$CONTENT_FILE"
    else
        echo "No local content found."
    fi
else
    echo "$OUTPUT" | head -50
fi

echo ""
echo "🔗 Full sheet: https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
