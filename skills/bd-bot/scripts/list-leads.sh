#!/bin/bash
# List Leads - Show leads from Google Sheet

SHEET_ID="11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ"
LEADS_FILE="/home/ubuntu/clawd/skills/bd-bot/data/leads.json"

# Check if --help requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: list-leads.sh [--local]"
    echo ""
    echo "Show leads from local cache or Google Sheet"
    echo ""
    echo "Options:"
    echo "  --local   Show from local cache only"
    echo "  --help    Show this help"
    echo ""
    echo "Examples:"
    echo "  list-leads.sh         # Try Google Sheet, fallback to local"
    echo "  list-leads.sh --local # Show local cache only"
    exit 0
fi

# If --local flag or no credentials, use local file
if [ "$1" = "--local" ] || [ ! -f "$HOME/.clawdbot/google-sheets-token.json" ]; then
    if [ -f "$LEADS_FILE" ]; then
        echo "📋 Local Leads:"
        echo ""
        cat "$LEADS_FILE" | python3 -m json.tool 2>/dev/null || cat "$LEADS_FILE"
    else
        echo "No local leads found."
        echo ""
        echo "To add leads:"
        echo "  ./add-lead.sh 'Company' 'Contact' 'Role' 'Source' 'Notes'"
    fi
    exit 0
fi

echo "📊 Fetching leads from Google Sheet..."
echo ""

# Read sheet data with error handling
OUTPUT=$(python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py read \
    --sheet-id "$SHEET_ID" 2>&1)

# Check for errors
if echo "$OUTPUT" | grep -q "Error"; then
    echo "⚠️  Could not read from Google Sheet"
    echo ""
    echo "Error: $OUTPUT"
    echo ""
    echo "Falling back to local cache..."
    echo ""
    if [ -f "$LEADS_FILE" ]; then
        cat "$LEADS_FILE" | python3 -m json.tool 2>/dev/null || cat "$LEADS_FILE"
    else
        echo "No local leads found."
    fi
else
    echo "$OUTPUT" | head -50
fi

echo ""
echo "🔗 Full sheet: https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
