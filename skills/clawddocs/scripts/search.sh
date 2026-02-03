#!/bin/bash
# Search docs by keyword using the sitemap
if [ -z "$1" ]; then
  echo "Usage: search.sh <keyword>"
  exit 1
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
