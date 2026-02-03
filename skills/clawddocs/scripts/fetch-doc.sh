#!/bin/bash
# Fetch a specific doc from Clawdbot documentation

if [ -z "$1" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Usage: fetch-doc.sh <path>"
  echo ""
  echo "Fetch documentation from docs.clawd.bot"
  echo ""
  echo "Arguments:"
  echo "  path - Documentation path (e.g., gateway/configuration)"
  echo ""
  echo "Examples:"
  echo "  fetch-doc.sh gateway/configuration"
  echo "  fetch-doc.sh tools/browser"
  echo "  fetch-doc.sh concepts/agents"
  
  if [ -z "$1" ]; then
    exit 1
  else
    exit 0
  fi
fi

echo "Fetching: https://docs.clawd.bot/$1"
echo ""

curl -s "https://docs.clawd.bot/$1" 2>/dev/null | head -100 || echo "Error: Could not fetch document"
