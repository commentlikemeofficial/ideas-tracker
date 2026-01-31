#!/bin/bash
# review-pr.sh - Review a GitHub PR
# Usage: ./review-pr.sh <pr-number> <repo>

PR_NUMBER=$1
REPO=$2

if [ -z "$PR_NUMBER" ] || [ -z "$REPO" ]; then
    echo "Usage: ./review-pr.sh <pr-number> <repo>"
    echo "Example: ./review-pr.sh 42 commentlikemeofficial/ideas-tracker"
    exit 1
fi

echo "🔍 Code Review Report for PR #$PR_NUMBER"
echo "=========================================="
echo "Repository: $REPO"
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Get PR details
PR_DETAILS=$(gh pr view $PR_NUMBER --repo $REPO --json title,author,files,additions,deletions 2>/dev/null)

if [ -z "$PR_DETAILS" ]; then
    echo "❌ Could not fetch PR details. Check PR number and repository."
    exit 1
fi

echo "📋 PR Summary"
echo "-------------"
echo "$PR_DETAILS" | jq -r '"Title: \(.title)"'
echo "$PR_DETAILS" | jq -r '"Author: \(.author.login)"'
echo "$PR_DETAILS" | jq -r '"Changes: +\(.additions) -\(.deletions)"'
echo ""

# Get changed files
echo "📝 Changed Files"
echo "---------------"
gh pr diff $PR_NUMBER --repo $REPO --name-only 2>/dev/null | head -20
echo ""

# Generate review report
echo "🔎 Review Findings"
echo "-----------------"
echo "Running automated checks..."
echo ""

# Check for common issues
DIFF=$(gh pr diff $PR_NUMBER --repo $REPO 2>/dev/null)

# Check for console.log
if echo "$DIFF" | grep -q "console.log"; then
    echo "⚠️  Found console.log statements - remove before merging"
fi

# Check for TODO/FIXME
if echo "$DIFF" | grep -qE "TODO|FIXME|XXX"; then
    echo "📌 Found TODO/FIXME comments - ensure they're tracked"
fi

# Check for large files
if echo "$DIFF" | grep -qE "^\+.*.{500,}"; then
    echo "📏 Very long lines detected - consider refactoring"
fi

echo ""
echo "✅ Review Complete"
echo ""
echo "Next Steps:"
echo "1. Check files manually for logic errors"
echo "2. Verify test coverage"
echo "3. Run security scan if needed"
echo "4. Approve or request changes on GitHub"
