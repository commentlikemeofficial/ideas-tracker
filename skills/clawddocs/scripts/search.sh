#!/bin/bash
# Search docs by keyword using the sitemap

if [ -z "$1" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Usage: search.sh <keyword>"
  echo ""
  echo "Search Clawdbot documentation by keyword"
  echo ""
  echo "Arguments:"
  echo "  keyword - Search term"
  echo ""
  echo "Examples:"
  echo "  search.sh gateway"
  echo "  search.sh browser"
  echo ""
  echo "Note: Run sitemap.sh first to cache the documentation structure"
  
  if [ -z "$1" ]; then
    exit 1
  else
    exit 0
  fi
fi

echo "Searching docs for: $1"
echo ""

# Check if sitemap cache exists
CACHE_DIR="$HOME/.cache/clawddocs"
SITEMAP_FILE="$CACHE_DIR/sitemap.txt"

if [ -f "$SITEMAP_FILE" ]; then
  grep -i "$1" "$SITEMAP_FILE" 2>/dev/null || echo "No matches found in cached sitemap"
else
  echo "Sitemap not cached. Run ./scripts/sitemap.sh first"
fi
