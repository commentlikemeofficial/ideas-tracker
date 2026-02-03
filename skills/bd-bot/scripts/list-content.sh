#!/bin/bash
# List Content - Show scheduled content from Google Sheet

SHEET_ID="11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ"

echo "📅 Fetching content queue from Google Sheet..."
echo ""

# Read sheet data
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py read \
    --sheet-id "$SHEET_ID" \
    2>&1 | head -50

echo ""
echo "🔗 Full sheet: https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
