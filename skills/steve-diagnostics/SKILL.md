---
name: steve-diagnostics
description: Steve's self-health check - response times, token usage, errors, session bloat. Use when debugging slow responses or checking system health.
---

# Steve Diagnostics

Quick health checks for this Clawdbot instance.

## Quick Status
```bash
scripts/steve-status.sh
```
Shows: response times, token count, errors, memory usage

## Check Token Bloat
```bash
scripts/token-check.sh
```
Alerts if session is getting heavy (>30k tokens)

## Recent Errors
```bash
scripts/error-check.sh
```
Last 10 errors from today's log

## Daily Stats
```bash
scripts/daily-stats.sh
```
Messages, costs, errors for today
