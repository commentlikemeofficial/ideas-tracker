#!/bin/bash
# weekly-security-audit.sh - Comprehensive security audit
# Run every Monday at 9 AM IST

REPORT_FILE="/home/ubuntu/clawd/agents/vercel-monitor/reports/security-$(date +%Y-%m-%d).md"
mkdir -p "$(dirname "$REPORT_FILE")"

echo "🔒 Vercel Security Audit Report" > "$REPORT_FILE"
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S IST')" >> "$REPORT_FILE"
echo "==========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

ISSUES_FOUND=0

# 1. Check all projects for public/private status
echo "📋 Project Visibility Check" >> "$REPORT_FILE"
echo "---------------------------" >> "$REPORT_FILE"

PROJECTS=$(vercel projects list --yes 2>/dev/null | grep -E "^\s+[a-zA-Z0-9-]+" | awk '{print $1}')

for PROJECT in $PROJECTS; do
    # Check if linked to GitHub
    GITHUB_LINK=$(vercel project inspect "$PROJECT" --yes 2>/dev/null | grep -i "github" || true)
    
    if [ -n "$GITHUB_LINK" ]; then
        echo "✅ $PROJECT: Linked to GitHub" >> "$REPORT_FILE"
        
        # Extract repo name from GitHub link
        REPO_NAME=$(echo "$GITHUB_LINK" | grep -oE "[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$" || echo "")
        
        if [ -n "$REPO_NAME" ]; then
            # Check GitHub repo visibility
            REPO_VISIBILITY=$(gh repo view "$REPO_NAME" --json visibility -q '.visibility' 2>/dev/null || echo "unknown")
            echo "   GitHub Visibility: $REPO_VISIBILITY" >> "$REPORT_FILE"
            
            if [ "$REPO_VISIBILITY" = "PUBLIC" ]; then
                # Check for sensitive files
                SENSITIVE_FILES=$(gh api "repos/$REPO_NAME/contents" -q '.[] | .name' 2>/dev/null | grep -iE "\.env|config|secret|key|password" || true)
                if [ -n "$SENSITIVE_FILES" ]; then
                    echo "   ⚠️  WARNING: Potentially sensitive files in public repo:" >> "$REPORT_FILE"
                    echo "$SENSITIVE_FILES" | sed 's/^/      - /' >> "$REPORT_FILE"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                fi
            fi
        fi
    else
        echo "ℹ️  $PROJECT: Not linked to GitHub" >> "$REPORT_FILE"
    fi
done

echo "" >> "$REPORT_FILE"

# 2. Environment Variable Security
echo "🔐 Environment Variable Security" >> "$REPORT_FILE"
echo "--------------------------------" >> "$REPORT_FILE"

for PROJECT in $PROJECTS; do
    ENV_VARS=$(vercel env ls "$PROJECT" --yes 2>/dev/null)
    
    # Check for unencrypted sensitive vars
    UNENCRYPTED=$(echo "$ENV_VARS" | grep -iE "password|secret|private.?key" | grep -v "Encrypted" || true)
    
    if [ -n "$UNENCRYPTED" ]; then
        echo "⚠️  $PROJECT: Potentially unencrypted sensitive variables" >> "$REPORT_FILE"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo "✅ $PROJECT: All sensitive vars appear encrypted" >> "$REPORT_FILE"
    fi
done

echo "" >> "$REPORT_FILE"

# 3. Domain & SSL Check
echo "🌐 Domain & SSL Configuration" >> "$REPORT_FILE"
echo "-----------------------------" >> "$REPORT_FILE"

DOMAINS=$(vercel domains ls --yes 2>/dev/null | grep -E "^\s+[a-zA-Z0-9.-]+" | awk '{print $1}')

for DOMAIN in $DOMAINS; do
    # Check SSL status
    SSL_STATUS=$(vercel domains inspect "$DOMAIN" --yes 2>/dev/null | grep -i "ssl\|https" | head -3)
    echo "$DOMAIN:" >> "$REPORT_FILE"
    echo "$SSL_STATUS" | sed 's/^/  /' >> "$REPORT_FILE"
done

echo "" >> "$REPORT_FILE"

# 4. Team & Access Review
echo "👥 Team Access Review" >> "$REPORT_FILE"
echo "---------------------" >> "$REPORT_FILE"
vercel teams list --yes 2>/dev/null | head -10 >> "$REPORT_FILE" || echo "No team information available" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# Summary
echo "==========================================" >> "$REPORT_FILE"
if [ $ISSUES_FOUND -gt 0 ]; then
    echo "🚨 SECURITY ALERT: $ISSUES_FOUND issue(s) found!" >> "$REPORT_FILE"
else
    echo "✅ No security issues found" >> "$REPORT_FILE"
fi

cat "$REPORT_FILE"

# If issues found, alert the user
if [ $ISSUES_FOUND -gt 0 ]; then
    echo ""
    echo "🚨 SECURITY ALERT: Found $ISSUES_FOUND potential security issues!"
    echo "Review the full report at: $REPORT_FILE"
    exit 1
fi

exit 0
