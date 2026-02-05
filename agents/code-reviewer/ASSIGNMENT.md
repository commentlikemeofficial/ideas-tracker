# Code Reviewer Assignment - 2026-02-04

## Mission
Review all code before deployment. Catch bugs, security issues, and quality problems.

## Tasks

### 1. Daily Code Report (10 AM IST)
- [ ] Check for new commits in all repos
- [ ] Review any open PRs
- [ ] Flag security issues immediately
- [ ] Log suggestions for improvements

### 2. PR Review Triggers
When AI Developer submits code:
- [ ] Review for bugs and logic errors
- [ ] Check for security vulnerabilities
- [ ] Verify code style consistency
- [ ] Ensure tests exist

### 3. Review Criteria
- **Security**: No hardcoded secrets, input validation, auth checks
- **Performance**: No N+1 queries, efficient algorithms
- **Maintainability**: Clear naming, comments for complex logic
- **Testing**: Unit tests for critical paths

## Output
- Security issues → Immediate alert to Steve/Rajesh
- Suggestions → Daily summary report
- Reports saved to: `/home/ubuntu/clawd/agents/code-reviewer/reports/`

## Current Status
🟡 STANDBY - Waiting for AI Developer to submit IntentSignal code
