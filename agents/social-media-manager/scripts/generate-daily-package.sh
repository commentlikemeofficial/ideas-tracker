#!/bin/bash
# generate-daily-package.sh - Generate daily content package from ContentClaw output

DATE=$(date +%Y-%m-%d)
PACKAGE_DIR="/home/ubuntu/clawd/agents/social-media-manager/daily-packages"
CONTENTCLAW_DIR="/home/ubuntu/clawd/tracking"

mkdir -p "$PACKAGE_DIR"

# Find today's ContentClaw output
POSTS_FILE="$CONTENTCLAW_DIR/autonomous_run_${DATE}_posts.md"
REPORT_FILE="$CONTENTCLAW_DIR/autonomous_run_${DATE}_report.md"

if [ ! -f "$POSTS_FILE" ]; then
    echo "❌ No ContentClaw output found for today ($DATE)"
    echo "ContentClaw may not have run yet."
    exit 1
fi

echo "📱 Generating Daily Content Package..."
echo "======================================"

# Create the package
PACKAGE_FILE="$PACKAGE_DIR/content-package-${DATE}.md"

cat > "$PACKAGE_FILE" << EOF
# 📱 Daily Content Package - $DATE
**Generated:** $(date '+%Y-%m-%d %H:%M IST')  
**Status:** ⏳ Pending Your Approval

---

## 🎥 Content Source
EOF

# Extract video info from report
if [ -f "$REPORT_FILE" ]; then
    echo "" >> "$PACKAGE_FILE"
    cat "$REPORT_FILE" >> "$PACKAGE_FILE"
fi

cat >> "$PACKAGE_FILE" << EOF

---

## 📋 CURATED POSTS FOR TODAY

EOF

# Extract top posts for each platform (simplified - in real implementation, would use AI to select best)
echo "### 🟦 LINKEDIN POST (Recommended)" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "**Optimal Time:** Today 11:00 AM IST" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "\`\`\`" >> "$PACKAGE_FILE"
grep -A 30 "HORMOZI FRAMEWORK" "$POSTS_FILE" | head -25 >> "$PACKAGE_FILE" || echo "Content available in full posts file" >> "$PACKAGE_FILE"
echo "\`\`\`" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "📋 **Copy command:** \`cat $POSTS_FILE | grep -A 30 'HORMOZI'\`" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"

echo "### 🐦 X/TWITTER POST (Thread Format)" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "**Optimal Time:** Today 4:00 PM IST" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "\`\`\`" >> "$PACKAGE_FILE"
grep -A 20 "NAVAL FRAMEWORK" "$POSTS_FILE" | head -15 >> "$PACKAGE_FILE" || echo "Content available in full posts file" >> "$PACKAGE_FILE"
echo "\`\`\`" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "📋 **Copy command:** \`cat $POSTS_FILE | grep -A 20 'NAVAL'\`" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"

echo "### 🔴 REDDIT POST" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "**Subreddit:** r/startups or r/Entrepreneur" >> "$PACKAGE_FILE"
echo "**Optimal Time:** Today 7:00 PM IST" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"
echo "\`\`\`" >> "$PACKAGE_FILE"
echo "[Discussion starter based on video content]" >> "$PACKAGE_FILE"
echo "See full content in: $POSTS_FILE" >> "$PACKAGE_FILE"
echo "\`\`\`" >> "$PACKAGE_FILE"
echo "" >> "$PACKAGE_FILE"

cat >> "$PACKAGE_FILE" << EOF

---

## 📂 FULL CONTENT FILES

- **All Posts:** \`$POSTS_FILE\`
- **Report:** \`$REPORT_FILE\`
- **30 posts generated** across 5 frameworks × 3 platforms

---

## 🎯 RECOMMENDATIONS

1. **11:00 AM** - Post LinkedIn version (thought leadership performs best mid-morning)
2. **4:00 PM** - Post X thread (US afternoon engagement)
3. **7:00 PM** - Post to Reddit (evening discussion time)

---

## ✅ YOUR ACTION

1. Review the curated posts above
2. Copy and customize as needed
3. Post at recommended times
4. **NO AUTO-POSTING** - You control everything!

EOF

echo "✅ Package created: $PACKAGE_FILE"
echo ""
echo "📋 Quick Preview:"
echo "================="
head -50 "$PACKAGE_FILE"
