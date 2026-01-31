#!/bin/bash
# daily-audit.sh - Daily comprehensive audit
# Run once daily at 9 AM IST

REPORT_FILE="/home/ubuntu/clawd/agents/vercel-monitor/reports/daily-$(date +%Y-%m-%d).md"
mkdir -p "$(dirname "$REPORT_FILE")"

echo "📊 Vercel Daily Audit Report" > "$REPORT_FILE"
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S IST')" >> "$REPORT_FILE"
echo "==========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 1. Deployment Summary
echo "🚀 Deployment Summary" >> "$REPORT_FILE"
echo "---------------------" >> "$REPORT_FILE"
vercel list --yes 2>/dev/null | head -20 >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 2. Environment Variables Check
echo "🔐 Environment Variables Audit" >> "$REPORT_FILE"
echo "------------------------------" >> "$REPORT_FILE"

PROJECTS=$(vercel projects list --yes 2>/dev/null | grep -E "^\s+[a-zA-Z0-9-]+" | awk '{print $1}')

for PROJECT in $PROJECTS; do
    echo "" >> "$REPORT_FILE"
    echo "Project: $PROJECT" >> "$REPORT_FILE"
    ENV_COUNT=$(vercel env ls "$PROJECT" --yes 2>/dev/null | grep -c "production\|preview\|development" || echo "0")
    echo "  Environment Variables: $ENV_COUNT" >> "$REPORT_FILE"
    
    # Check for potential secrets in env var names
    SUSPICIOUS=$(vercel env ls "$PROJECT" --yes 2>/dev/null | grep -iE "password|secret|key|token|api|auth" || true)
    if [ -n "$SUSPICIOUS" ]; then
        echo "  ⚠️  Found potentially sensitive env vars:" >> "$REPORT_FILE"
        echo "$SUSPICIOUS" | sed 's/^/    /' >> "$REPORT_FILE"
    fi
done

echo "" >> "$REPORT_FILE"

# 3. Domain Status
echo "🌐 Domain Status" >> "$REPORT_FILE"
echo "----------------" >> "$REPORT_FILE"
vercel domains ls --yes 2>/dev/null | head -20 >> "$REPORT_FILE" || echo "No custom domains configured" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 4. Bandwidth Usage (approximate)
echo "📈 Recent Activity" >> "$REPORT_FILE"
echo "------------------" >> "$REPORT_FILE"
for PROJECT in $PROJECTS; do
    DEPLOY_COUNT=$(vercel list "$PROJECT" --yes 2>/dev/null | grep -c "production\|preview" || echo "0")
    echo "$PROJECT: $DEPLOY_COUNT recent deployments" >> "$REPORT_FILE"
done

echo "" >> "$REPORT_FILE"
echo "==========================================" >> "$REPORT_FILE"
echo "✅ Daily audit complete" >> "$REPORT_FILE"

cat "$REPORT_FILE"
