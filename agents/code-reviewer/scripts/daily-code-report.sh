#!/bin/bash
# daily-code-report.sh - Generate daily code quality report

echo "📊 Daily Code Quality Report"
echo "============================"
echo "Date: $(date '+%Y-%m-%d')"
echo ""

# Check for open PRs needing review
echo "🔔 PRs Needing Review"
echo "--------------------"
gh pr list --repo commentlikemeofficial/ideas-tracker --state open --json number,title,author,createdAt 2>/dev/null | \
    jq -r '.[] | "#\(.number): \(.title) by @\(.author.login) (created \(.createdAt | split("T")[0]))"' | \
    head -10 || echo "No open PRs found"

echo ""

# Recent commits
echo "📝 Recent Commits"
echo "----------------"
git log --oneline -10 2>/dev/null || echo "Not a git repository"

echo ""

# Code quality metrics
echo "📈 Quick Metrics"
echo "---------------"

# Count files by type
if [ -d "src" ]; then
    echo "TypeScript files: $(find src -name '*.ts' -o -name '*.tsx' 2>/dev/null | wc -l)"
    echo "JavaScript files: $(find src -name '*.js' -o -name '*.jsx' 2>/dev/null | wc -l)"
    echo "CSS files: $(find src -name '*.css' -o -name '*.scss' 2>/dev/null | wc -l)"
fi

echo ""
echo "✅ Report Complete"
