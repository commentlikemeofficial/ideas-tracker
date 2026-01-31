#!/bin/bash
# add-feature.sh - Add a new feature to existing project
# Usage: ./add-feature.sh --project "my-app" --feature "payment" --description "Stripe integration"

PROJECT=""
FEATURE=""
DESCRIPTION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --project)
      PROJECT="$2"
      shift 2
      ;;
    --feature)
      FEATURE="$2"
      shift 2
      ;;
    --description)
      DESCRIPTION="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ -z "$PROJECT" ] || [ -z "$FEATURE" ]; then
  echo "Usage: ./add-feature.sh --project \"my-app\" --feature \"payment\" [--description \"Stripe integration\"]"
  exit 1
fi

PROJECT_DIR="/home/ubuntu/clawd/agents/ai-developer/projects/$PROJECT"

if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Project not found: $PROJECT"
  echo "Available projects:"
  ls -1 /home/ubuntu/clawd/agents/ai-developer/projects/ 2>/dev/null || echo "  (none)"
  exit 1
fi

echo "➕ AI Developer - Adding Feature"
echo "================================"
echo "Project: $PROJECT"
echo "Feature: $FEATURE"
echo "Description: ${DESCRIPTION:-N/A}"
echo ""

# Check rate limits
./check-rate-limits.sh || {
  echo "⚠️  Rate limits high. Using alternative model."
  echo "   Will use DeepSeek or Gemini instead of Kimi."
}

echo "📝 Feature Plan"
echo "--------------"

FEATURE_PLAN="$PROJECT_DIR/feature-$FEATURE-plan.md"
cat > "$FEATURE_PLAN" << EOF
# Feature Addition: $FEATURE

## Overview
- **Project:** $PROJECT
- **Feature:** $FEATURE
- **Description:** ${DESCRIPTION:-TBD}
- **Started:** $(date -Iseconds)

## Implementation Plan
1. Review existing codebase
2. Design feature architecture
3. Implement (30-45 min sessions)
4. Write tests
5. Code review
6. Deploy

## Files to Modify
[List files here]

## New Files Needed
[List new files]

## API Changes
[Document API changes]

## Database Changes
[Document schema changes]

## Estimated Time
- Implementation: 1-2 hours (with breaks)
- Testing: 30 min
- Review: 30 min
- Total: 2-3 hours

## Notes
[Track progress here]
EOF

echo "✅ Feature plan created: $FEATURE_PLAN"
echo ""
echo "Next: AI Developer will implement this feature"
echo "       in 30-45 min sessions with breaks"
