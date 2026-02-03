#!/bin/bash
# Add Lead - Add a new lead to Google Sheet

SHEET_ID="11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ"
COMPANY="${1:-}"
CONTACT="${2:-}"
ROLE="${3:-}"
SOURCE="${4:-}"
NOTES="${5:-}"

if [ -z "$COMPANY" ]; then
    echo "Usage: ./add-lead.sh 'Company Name' 'Contact Name' 'Role' 'Source' 'Notes'"
    echo ""
    echo "Example:"
    echo "  ./add-lead.sh 'Infloso AI' 'Hiring Manager' 'Full Stack Dev' 'LinkedIn' '7LPA after trial'"
    echo ""
    echo "Or add directly to the Google Sheet:"
    echo "  https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
    exit 1
fi

DATE=$(date +%Y-%m-%d)
STATUS="New"

# Append to sheet
python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py append \
    --sheet-id "$SHEET_ID" \
    --data "[\"$DATE\", \"$COMPANY\", \"$CONTACT\", \"$ROLE\", \"$SOURCE\", \"$STATUS\", \"$NOTES\"]" \
    2>&1

echo ""
echo "✅ Lead added: $COMPANY"
echo "📊 View all leads: https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
