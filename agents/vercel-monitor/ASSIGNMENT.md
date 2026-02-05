# Vercel Monitor Assignment - 2026-02-04

## Mission
Monitor all Vercel deployments and ensure infrastructure health.

## Tasks

### 1. Project Discovery
- [ ] List all Vercel projects via CLI
- [ ] Document project URLs and environments
- [ ] Set up monitoring for each

### 2. Health Checks
Run every 30 minutes:
```bash
# Check deployment status
vercel ls --json

# Check for failed deployments
# Alert if any production deployment fails
```

### 3. Daily Audit (9:30 AM IST)
- [ ] Review yesterday's deployments
- [ ] Check for build errors
- [ ] Monitor bandwidth usage (stay within free tier)

### 4. Weekly Security Audit (Mondays)
- [ ] Check for exposed env vars
- [ ] Review domain configurations
- [ ] Verify access controls

## Output
Daily report saved to: `/home/ubuntu/clawd/agents/vercel-monitor/reports/`

## Start Here
```bash
# Check if logged in
vercel whoami

# List projects
vercel list

# Check first project's deployments
vercel ls [project-name]
```
