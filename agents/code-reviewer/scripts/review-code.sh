#!/bin/bash
# review-code.sh - Review a specific file or directory
# Usage: ./review-code.sh <file-path>

FILE_PATH=$1

if [ -z "$FILE_PATH" ]; then
    echo "Usage: ./review-code.sh <file-path>"
    echo "Example: ./review-code.sh src/components/Button.tsx"
    exit 1
fi

if [ ! -f "$FILE_PATH" ]; then
    echo "❌ File not found: $FILE_PATH"
    exit 1
fi

echo "🔍 Code Review: $FILE_PATH"
echo "=========================================="
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "Lines: $(wc -l < "$FILE_PATH")"
echo ""

# Language detection
EXT="${FILE_PATH##*.}"
echo "Language: $EXT"
echo ""

# Run checks based on file type
echo "🔎 Automated Checks"
echo "------------------"

case $EXT in
    ts|tsx|js|jsx)
        # JavaScript/TypeScript checks
        if grep -q "any" "$FILE_PATH"; then
            echo "⚠️  Found 'any' types - consider stricter typing"
        fi
        if grep -q "console.log" "$FILE_PATH"; then
            echo "⚠️  Found console.log - remove in production"
        fi
        if grep -qE "TODO|FIXME" "$FILE_PATH"; then
            echo "📌 Found TODO/FIXME comments"
        fi
        ;;
    py)
        # Python checks
        if grep -q "print(" "$FILE_PATH"; then
            echo "⚠️  Found print statements - use logging"
        fi
        if ! grep -q "def test_" "$FILE_PATH"; then
            echo "📌 No test functions found - consider adding tests"
        fi
        ;;
    sql)
        # SQL checks
        if grep -qi "SELECT \*" "$FILE_PATH"; then
            echo "⚠️  Avoid SELECT * - specify columns explicitly"
        fi
        ;;
esac

# General checks
if [ $(wc -l < "$FILE_PATH") -gt 500 ]; then
    echo "📏 File is large ($(wc -l < "$FILE_PATH") lines) - consider splitting"
fi

echo ""
echo "📋 Summary"
echo "----------"
echo "Review complete. Check manually for:"
echo "- Logic errors"
echo "- Edge cases"
echo "- Performance issues"
echo "- Security vulnerabilities"
