#!/bin/bash
# Show recently updated docs

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Usage: recent.sh [days]"
  echo ""
  echo "Show recently updated documentation"
  echo ""
  echo "Arguments:"
  echo "  days - Number of days to look back (default: 7)"
  echo ""
  echo "Examples:"
  echo "  recent.sh       # Last 7 days"
  echo "  recent.sh 14    # Last 14 days"
  exit 0
fi

DAYS=${1:-7}
echo "Docs updated in the last $DAYS days"
# In full version, this queries the change tracking
