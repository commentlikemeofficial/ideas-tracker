---
name: sysadmin-toolbox
description: Ready-to-run shell one-liners for common sysadmin tasks including log analysis, process management, network diagnostics, security checks, and AWS CLI operations. Use when needing quick commands for system administration, troubleshooting, monitoring, or AWS management without writing scripts from scratch.
---

# Sysadmin Toolbox

Production-ready one-liners for the trenches. Copy, paste, run.

## Quick Access

```bash
# List all available commands
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/toolbox.py --list

# Run a specific command
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/toolbox.py logs tail-error
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/toolbox.py processes top-cpu
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/toolbox.py network listening

# Show command without running
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/toolbox.py security suid --show
```

## Categories

### Logs — [references/log-analysis.md](references/log-analysis.md)

```bash
# Real-time error monitoring
tail -f /var/log/syslog | grep -i error

# Error frequency analysis
grep -i "error" /var/log/app.log | cut -d' ' -f5- | sort | uniq -c | sort -rn | head -20

# Find bloated log files
find /var/log -name "*.log" -size +100M -exec ls -lh {} \;
```

### Processes — [references/process-mgmt.md](references/process-mgmt.md)

```bash
# CPU hogs
ps aux --sort=-%cpu | head -10

# Memory hogs
ps aux --sort=-%mem | head -10

# Zombie processes
ps aux | awk '{if ($8 ~ /^Z/) print $0}'

# Failed systemd services
systemctl --failed --type=service
```

### Network — [references/network.md](references/network.md)

```bash
# Test port without telnet
timeout 5 bash -c "</dev/tcp/localhost/8080" && echo "open" || echo "closed"

# Listening ports
ss -tlnp | grep LISTEN

# Connections by state
netstat -tan | awk '{print $6}' | sort | uniq -c | sort -rn

# Top connecting IPs
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -20
```

### Security — [references/security.md](references/security.md)

```bash
# SUID binaries (privilege escalation risk)
find / -perm -4000 -type f 2>/dev/null

# World-writable directories
find / -xdev -type d -perm -0002 -a ! -perm -1000 2>/dev/null

# SSH brute force attempts
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head

# Check for users with empty passwords
awk -F: '($2 == "") {print $1}' /etc/shadow
```

### AWS CLI — [references/aws-cli.md](references/aws-cli.md)

```bash
# List running instances
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,PublicIpAddress,Tags[?Key==`Name`].Value|[0]]' --output table

# S3 bucket sizes
aws s3 ls s3://bucket-name --recursive --human-readable --summarize

# CloudWatch alarms firing
aws cloudwatch describe-alarms --state-value ALARM

# Current month costs by service
aws ce get-cost-and-usage --time-period Start=$(date -d "$(date +%Y-%m-01)" +%Y-%m-%d),End=$(date +%Y-%m-%d) --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=SERVICE
```

## Patterns

**Before running a command:**
1. Check with `--show` flag to see what it does
2. Review in reference file for variations
3. Modify for your specific environment

**Common modifications:**
- Change log paths (`/var/log/syslog` → your log location)
- Adjust thresholds (`+100M` → `+1G`)
- Add filters (`grep -i error` → `grep -i "specific error"`)
- Change time ranges (`-mtime -1` → `-mtime -7`)

## Reference Files

| File | Contents |
|------|----------|
| [references/log-analysis.md](references/log-analysis.md) | Error extraction, log rotation, performance analysis |
| [references/process-mgmt.md](references/process-mgmt.md) | CPU/memory monitoring, process control, service management |
| [references/network.md](references/network.md) | Connectivity tests, traffic analysis, route debugging |
| [references/security.md](references/security.md) | Access auditing, file permissions, intrusion detection |
| [references/aws-cli.md](references/aws-cli.md) | EC2, S3, IAM, CloudWatch, RDS, cost monitoring |

## Safety Notes

⚠️ **Review before running destructive commands:**
- `aws s3 sync ... --delete` — Can delete data
- `kill -9` — Force terminates processes
- `find ... -delete` — Irreversible file deletion
- `iptables -F` — Flushes all firewall rules

✅ **Use `--show` flag to preview commands**
✅ **Test on non-production first**
✅ **Have backups before cleanup operations**

---

## Safe NPM Install

Use `safe_npm_install.py` to prevent indefinite hangs:

```bash
# Default 60s timeout
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/safe_npm_install.py

# Custom timeout (e.g., 2 minutes)
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/safe_npm_install.py --timeout 120

# In specific directory
python3 /home/ubuntu/clawd/skills/sysadmin-toolbox/scripts/safe_npm_install.py --cwd /path/to/project
```

**Why:** Regular `npm install` can hang indefinitely on network issues. This wrapper kills the entire process tree after timeout.