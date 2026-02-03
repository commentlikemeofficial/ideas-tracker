#!/bin/bash
# Fetch a specific doc from Clawdbot documentation
if [ -z "$1" ]; then
  echo "Usage: fetch-doc.sh <path>"
  echo "Example: fetch-doc.sh gateway/configuration"
  exit 1
fi

echo "Fetching: https://docs.clawd.bot/$1"
echo ""

curl -s "https://docs.clawd.bot/$1" 2>/dev/null | head -100 || echo "Error: Could not fetch document"
