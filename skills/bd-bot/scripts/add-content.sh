#!/bin/bash
# Add Content - Add content idea to Google Sheet

SHEET_ID="11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ"
CONTENT="${1:-}"

if [ -z "$CONTENT" ]; then
    echo "Usage: ./add-content.sh 'Your content idea here'"
    echo ""
    echo "Example themes:"
    echo "  • Build journey: 'What broke when shipping consently.in beta'"
    echo "  • Tech insight: 'Why I chose Supabase over Firebase'"
    echo "  • Productivity: 'How I ship 20 projects in 2 months'"
    echo "  • AI learnings: 'Processing 500+ docs with LLMs'"
    echo ""
    echo "Or add directly to the Google Sheet:"
    echo "  https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
    exit 1
fi

DATE=$(date +%Y-%m-%d)
PLATFORM="LinkedIn"
STATUS="Pending"

# Append to sheet (second sheet or after lead columns)
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py append \
    --sheet-id "$SHEET_ID" \
    --data "[\"$DATE\", \"CONTENT\", \"$CONTENT\", \"$PLATFORM\", \"$STATUS\", \"\"]" \
    2>&1

echo ""
echo "✅ Content queued: ${CONTENT:0:50}..."
echo "📊 View all content: https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
