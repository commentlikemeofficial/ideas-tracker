#!/bin/bash
# generate-images.sh - Generate images for today's social media posts

DATE=$(date +%Y-%m-%d)
PACKAGE_DIR="/home/ubuntu/clawd/agents/social-media-manager/daily-packages"
IMAGE_DIR="/home/ubuntu/clawd/agents/social-media-manager/images/${DATE}"

mkdir -p "$IMAGE_DIR"

echo "🎨 Generating Images for Social Media Posts"
echo "============================================"
echo "Date: $DATE"
echo ""

# Check if content package exists
PACKAGE_FILE="$PACKAGE_DIR/content-package-${DATE}.md"
if [ ! -f "$PACKAGE_FILE" ]; then
    echo "❌ No content package found for today"
    echo "Run generate-daily-package.sh first"
    exit 1
fi

echo "📁 Saving images to: $IMAGE_DIR"
echo ""

# Extract topics from content package
LINKEDIN_TOPIC=$(grep -A 5 "VIDEO 1:" "$PACKAGE_FILE" 2>/dev/null | head -1 | sed 's/.*VIDEO 1: //')
X_TOPIC=$(grep -A 5 "VIDEO 2:" "$PACKAGE_FILE" 2>/dev/null | head -1 | sed 's/.*VIDEO 2: //')

echo "🖼️  Image 1: LinkedIn (Professional style)"
echo "Topic: $LINKEDIN_TOPIC"
echo "Prompt: Create a professional LinkedIn header image about $LINKEDIN_TOPIC"
echo "Style: Clean, minimalist, blue/purple gradients, tech visualization"
echo "Format: 1200x627px"
echo ""

echo "🖼️  Image 2: X/Twitter (Bold style)"  
echo "Topic: $LINKEDIN_TOPIC"
echo "Prompt: Create a bold Twitter/X image about $LINKEDIN_TOPIC"
echo "Style: High contrast, attention-grabbing, dark background"
echo "Format: 1200x1200px"
echo ""

echo "🖼️  Image 3: Reddit (Informative style)"
echo "Topic: $X_TOPIC"
echo "Prompt: Create an informative/educational image about $X_TOPIC"
echo "Style: Clean infographic, diagrams, easy to read"
echo "Format: 1200x800px"
echo ""

# Save image prompts for later generation
mkdir -p "$IMAGE_DIR"
echo "$LINKEDIN_TOPIC" > "$IMAGE_DIR/linkedin-topic.txt"
echo "$X_TOPIC" > "$IMAGE_DIR/x-topic.txt"
echo "$X_TOPIC" > "$IMAGE_DIR/reddit-topic.txt"

echo "✅ Image prompts saved to $IMAGE_DIR/"
echo ""
echo "📝 To generate actual images, use the nano-banana-pro skill:"
echo "   LinkedIn: Professional header about '$LINKEDIN_TOPIC'"
echo "   X/Twitter: Bold graphic about '$LINKEDIN_TOPIC'"
echo "   Reddit: Informative graphic about '$X_TOPIC'"
echo ""
echo "Images should be saved as:"
echo "  - $IMAGE_DIR/linkedin.png"
echo "  - $IMAGE_DIR/x-twitter.png"
echo "  - $IMAGE_DIR/reddit.png"
