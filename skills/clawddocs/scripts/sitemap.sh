#!/bin/bash
# Sitemap generator - shows all docs by category

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Usage: sitemap.sh"
  echo ""
  echo "Show Clawdbot documentation structure"
  echo ""
  echo "This displays all documentation categories available at docs.clawd.bot"
  exit 0
fi

echo "Fetching Clawdbot documentation sitemap..."

# Categories structure based on docs.clawd.bot
CATEGORIES=(
  "start"
  "gateway"
  "providers"
  "concepts"
  "tools"
  "automation"
  "cli"
  "platforms"
  "nodes"
  "web"
  "install"
  "reference"
)

for cat in "${CATEGORIES[@]}"; do
  echo "📁 /$cat/"
done
