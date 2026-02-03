#!/bin/bash
# Add Lead - Add a new lead to local storage and optionally Google Sheet

SHEET_ID="11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ"
DATA_DIR="/home/ubuntu/clawd/skills/bd-bot/data"
LEADS_FILE="$DATA_DIR/leads.json"
COMPANY="${1:-}"
CONTACT="${2:-}"
ROLE="${3:-}"
SOURCE="${4:-}"
NOTES="${5:-}"

# Help
if [ "$COMPANY" = "--help" ] || [ "$COMPANY" = "-h" ]; then
    echo "Usage: add-lead.sh 'Company Name' 'Contact Name' 'Role' 'Source' 'Notes'"
    echo ""
    echo "Add a new lead to local storage (and Google Sheet if available)"
    echo ""
    echo "Arguments:"
    echo "  Company Name   - Name of the company (required)"
    echo "  Contact Name   - Name of the contact person"
    echo "  Role           - Role/position you're targeting"
    echo "  Source         - Where you found this lead (LinkedIn, Email, etc.)"
    echo "  Notes          - Additional notes"
    echo ""
    echo "Examples:"
    echo "  ./add-lead.sh 'Infloso AI' 'Hiring Manager' 'Full Stack Dev' 'LinkedIn' '7LPA after trial'"
    echo "  ./add-lead.sh 'TechCorp' '' 'Backend Engineer' 'Referral' 'Remote friendly'"
    exit 0
fi

if [ -z "$COMPANY" ]; then
    echo "Error: Company name is required"
    echo ""
    echo "Usage: ./add-lead.sh 'Company Name' 'Contact Name' 'Role' 'Source' 'Notes'"
    echo "       ./add-lead.sh --help for more info"
    exit 1
fi

# Create data directory if needed
mkdir -p "$DATA_DIR"

DATE=$(date +%Y-%m-%d)
STATUS="New"
ID=$(date +%s)

# Use Python to safely add the lead
python3 << PYEOF
import json
import sys
from pathlib import Path

leads_file = Path("$LEADS_FILE")

# Read existing leads
if leads_file.exists():
    try:
        with open(leads_file) as f:
            leads = json.load(f)
    except:
        leads = []
else:
    leads = []

# Create new lead
new_lead = {
    "id": $ID,
    "date": "$DATE",
    "company": "$COMPANY",
    "contact": "$CONTACT",
    "role": "$ROLE",
    "source": "$SOURCE",
    "status": "$STATUS",
    "notes": "$NOTES"
}

leads.append(new_lead)

# Write back
with open(leads_file, 'w') as f:
    json.dump(leads, f, indent=2)

print(f"✅ Lead saved locally: $COMPANY")
PYEOF

# Try to sync to Google Sheet if credentials exist
if [ -f "$HOME/.clawdbot/google-sheets-token.json" ]; then
    echo "🔄 Syncing to Google Sheet..."
    SYNC_OUTPUT=$(python3 /home/ubuntu/clawd/skills/google-sheets/scripts/sheets.py append \
        --sheet-id "$SHEET_ID" \
        --data "[\"$DATE\", \"$COMPANY\", \"$CONTACT\", \"$ROLE\", \"$SOURCE\", \"$STATUS\", \"$NOTES\"]" 2>&1)
    
    if echo "$SYNC_OUTPUT" | grep -q "Error"; then
        echo "⚠️  Google Sheet sync failed (will retry later)"
    else
        echo "✅ Synced to Google Sheet"
    fi
fi

echo ""
echo "📊 View all leads:"
echo "  Local: ./list-leads.sh --local"
echo "  Sheet: https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
