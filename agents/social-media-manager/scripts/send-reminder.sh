#!/bin/bash
# send-reminder.sh - Send just-in-time reminder with content + image
# Usage: ./send-reminder.sh [linkedin|x|reddit]

PLATFORM=$1
DATE=$(date +%Y-%m-%d)
PACKAGE_DIR="/home/ubuntu/clawd/agents/social-media-manager/daily-packages"
IMAGE_DIR="/home/ubuntu/clawd/agents/social-media-manager/images/${DATE}"

if [ -z "$PLATFORM" ]; then
    echo "Usage: ./send-reminder.sh [linkedin|x|reddit]"
    exit 1
fi

# Determine message based on platform
case $PLATFORM in
    linkedin)
        EMOJI="🟦"
        PLATFORM_NAME="LINKEDIN"
        TIME="11:00 AM"
        ;;
    x)
        EMOJI="🐦"
        PLATFORM_NAME="X/TWITTER"
        TIME="4:00 PM"
        ;;
    reddit)
        EMOJI="🔴"
        PLATFORM_NAME="REDDIT"
        TIME="7:00 PM"
        ;;
    *)
        echo "Unknown platform: $PLATFORM"
        exit 1
        ;;
esac

echo "🚨 POST REMINDER - $PLATFORM_NAME"
echo "=================================="
echo "Time: $TIME IST"
echo "Platform: $PLATFORM"
echo ""

# Get content from package
PACKAGE_FILE="$PACKAGE_DIR/content-package-${DATE}.md"
if [ ! -f "$PACKAGE_FILE" ]; then
    echo "❌ No content package for today"
    exit 1
fi

echo "📱 Reminder Message:"
echo "==================="
echo ""
echo "${EMOJI} POST IN 5 MINUTES! ${EMOJI}"
echo ""
echo "${PLATFORM_NAME} POST (${TIME} IST)"
echo "Copy this NOW and post in 5 minutes 👇"
echo ""
echo "---"

# Extract relevant post content
case $PLATFORM in
    linkedin)
        grep -A 30 "HORMOZI FRAMEWORK" "$PACKAGE_FILE" 2>/dev/null | head -25 || echo "See $PACKAGE_FILE"
        ;;
    x)
        grep -A 20 "NAVAL FRAMEWORK" "$PACKAGE_FILE" 2>/dev/null | head -15 || echo "See $PACKAGE_FILE"
        ;;
    reddit)
        echo "See full Reddit post in: $PACKAGE_FILE"
        ;;
esac

echo ""
echo "---"
echo ""
echo "📎 Image: $IMAGE_DIR/${PLATFORM}.png"
echo ""
echo "⏰ Post at exactly ${TIME} IST for maximum engagement!"
echo ""

# Check if image exists
if [ -f "$IMAGE_DIR/${PLATFORM}.png" ]; then
    echo "✅ Image ready: $IMAGE_DIR/${PLATFORM}.png"
else
    echo "⚠️  Image not found at $IMAGE_DIR/${PLATFORM}.png"
    echo "   Generate using: nano-banana-pro skill"
fi

echo ""
echo "📝 Use 'message' tool to send this to Telegram with image"
