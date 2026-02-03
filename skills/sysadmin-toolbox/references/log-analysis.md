# Log Analysis One-Liners

## Quick Log Inspection

```bash
# Tail log with real-time filtering
tail -f /var/log/syslog | grep -i error

# View last N lines of multiple logs
tail -n 100 /var/log/syslog /var/log/auth.log

# Follow multiple logs simultaneously
multitail /var/log/nginx/access.log /var/log/nginx/error.log
```

## Error Analysis

```bash
# Count errors by type in log file
grep -i "error" /var/log/app.log | cut -d' ' -f5- | sort | uniq -c | sort -rn | head -20

# Extract errors with timestamps
grep -E "ERROR|FATAL" /var/log/app.log | awk '{print $1" "$2" "$NF}'

# Find most frequent error messages
grep "ERROR" app.log | sed 's/.*ERROR/ERROR/' | sort | uniq -c | sort -rn | head -10

# Errors per hour
grep "ERROR" app.log | awk -F: '{print $1":"$2}' | sort | uniq -c
```

## Performance Log Analysis

```bash
# Slow queries (MySQL/PostgreSQL)
grep -E "Query_time|duration" slow.log | awk '{if($3>1) print}'

# Response time distribution
awk '{print $NF}' access.log | grep -o '[0-9]*' | sort -n | uniq -c

# Top 10 slowest requests
awk '{print $NF" "$0}' access.log | sort -rn | head -10

# 5xx errors by endpoint
grep '" 5[0-9][0-9] ' access.log | awk '{print $7}' | sort | uniq -c | sort -rn
```

## Log Rotation & Cleanup

```bash
# Find largest log files
find /var/log -name "*.log" -size +100M -exec ls -lh {} \;

# Compress logs older than 7 days
find /var/log -name "*.log" -mtime +7 -exec gzip {} \;

# Delete logs older than 30 days
find /var/log -name "*.log.*" -mtime +30 -delete

# Check disk usage by logs
du -sh /var/log/* | sort -rh | head -20
```