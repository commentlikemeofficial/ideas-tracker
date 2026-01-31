#!/bin/bash
# fix-bug.sh - Fix a bug in existing project
# Usage: ./fix-bug.sh --project "my-app" --issue "auth-error" --description "Login fails"

PROJECT=""
ISSUE=""
DESCRIPTION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --project)
      PROJECT="$2"
      shift 2
      ;;
    --issue)
      ISSUE="$2"
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

if [ -z "$PROJECT" ] || [ -z "$ISSUE" ]; then
  echo "Usage: ./fix-bug.sh --project \"my-app\" --issue \"auth-error\" [--description \"Login fails with 500\"]"
  exit 1
fi

PROJECT_DIR="/home/ubuntu/clawd/agents/ai-developer/projects/$PROJECT"

if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Project not found: $PROJECT"
  exit 1
fi

echo "🐛 AI Developer - Bug Fix"
echo "========================="
echo "Project: $PROJECT"
echo "Issue: $ISSUE"
echo "Description: ${DESCRIPTION:-N/A}"
echo ""

# Check rate limits
./check-rate-limits.sh || {
  echo "⚠️  Rate limits high. Will use alternative model."
}

# Create bug report
BUG_REPORT="$PROJECT_DIR/bug-$ISSUE.md"
cat > "$BUG_REPORT" << EOF
# Bug Report: $ISSUE

## Details
- **Project:** $PROJECT
- **Issue ID:** $ISSUE
- **Description:** ${DESCRIPTION:-TBD}
- **Reported:** $(date -Iseconds)
- **Status:** 🔍 Investigating

## Investigation
[Track investigation here]

## Root Cause
[Document root cause]

## Fix Applied
[Document fix]

## Testing
- [ ] Fix verified locally
- [ ] Tests pass
- [ ] Code reviewed
- [ ] Deployed to staging

## Prevention
[How to prevent similar bugs]
EOF

echo "✅ Bug report created: $BUG_REPORT"
echo ""
echo "AI Developer will:"
echo "1. Investigate the bug (15 min)"
echo "2. Implement fix (15-30 min)"
echo "3. Test the fix (15 min)"
echo "4. Send to Code Reviewer"
echo ""
echo "⏱️  Estimated fix time: 45-60 minutes"
