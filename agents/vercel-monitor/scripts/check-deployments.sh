#!/bin/bash
# check-deployments.sh - Quick deployment health check
# Run via heartbeat every 30 minutes

echo "🔍 Vercel Deployment Check - $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# Get list of projects
PROJECTS=$(vercel projects list --yes 2>/dev/null | grep -E "^\s+[a-zA-Z0-9-]+" | awk '{print $1}')

if [ -z "$PROJECTS" ]; then
    echo "❌ No projects found or authentication issue"
    exit 1
fi

FAILED_DEPLOYMENTS=0
TOTAL_PROJECTS=0

for PROJECT in $PROJECTS; do
    TOTAL_PROJECTS=$((TOTAL_PROJECTS + 1))
    
    # Get latest deployment status
    LATEST_DEPLOY=$(vercel list "$PROJECT" --yes 2>/dev/null | head -5)
    
    if echo "$LATEST_DEPLOY" | grep -q "ERROR\|FAILED\|CANCELED"; then
        echo "⚠️  $PROJECT: Latest deployment has issues!"
        FAILED_DEPLOYMENTS=$((FAILED_DEPLOYMENTS + 1))
    else
        echo "✅ $PROJECT: Healthy"
    fi
done

echo ""
echo "=========================================="
echo "Total Projects: $TOTAL_PROJECTS"
echo "Issues Found: $FAILED_DEPLOYMENTS"

if [ $FAILED_DEPLOYMENTS -gt 0 ]; then
    echo "🚨 ALERT: $FAILED_DEPLOYMENTS project(s) need attention!"
    exit 1
fi

echo "✅ All deployments healthy"
exit 0
