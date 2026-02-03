# Security Checks One-Liners

## User & Access Auditing

```bash
# Users with sudo access
grep -Po '^sudo.+:\K.*$' /etc/group | tr ',' '\n'

# Recent user logins
lastlog | grep -v "Never"

# Failed login attempts
lastb | head -20

# Users with empty passwords
awk -F: '($2 == "") {print $1}' /etc/shadow

# Accounts with UID 0 (root)
awk -F: '($3 == "0") {print $1}' /etc/passwd
```

## File & Permission Auditing

```bash
# SUID binaries (potential privilege escalation)
find / -perm -4000 -type f 2>/dev/null

# World-writable files
find / -xdev -type d -perm -0002 -a ! -perm -1000 2>/dev/null

# Files with no owner
find / -xdev -nouser -o -nogroup 2>/dev/null

# Recently modified files (last 24h)
find /etc -type f -mtime -1 -ls 2>/dev/null

# SSH key permissions check
find ~/.ssh -type f -exec ls -la {} \; | grep -v "rw-------"
```

## Network Security

```bash
# Open ports
ss -tulpn | grep LISTEN

# iptables rules summary
iptables -L -v -n --line-numbers

# Check for promiscuous mode
ip link | grep PROMISC

# ARP table inspection
arp -a | sort

# Check for IP forwarding
cat /proc/sys/net/ipv4/ip_forward
```

## Malware & Intrusion Detection

```bash
# Running processes with deleted binaries
ls -la /proc/*/exe 2>/dev/null | grep deleted

# Processes with open network connections
lsof -i -P | grep -v "COMMAND"

# Check for hidden processes
ps aux | awk '{print $2}' | sort -n | diff - <(ls /proc | grep -E '^[0-9]+$' | sort -n)

# Verify system binary integrity
debsums -s 2>/dev/null || rpm -Va 2>/dev/null

# Suspicious cron jobs
find /etc/cron* -type f -exec ls -la {} \; 2>/dev/null
```

## Log Security Analysis

```bash
# SSH brute force attempts
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head

# Successful root logins
grep "Accepted" /var/log/auth.log | grep root

# Sudo command usage
zgrep -h "COMMAND=" /var/log/auth.log* | tail -20

# Kernel errors (possible exploits)
dmesg | grep -i "segfault\|overflow\|exploit"

# Suspicious su activity
grep "su:" /var/log/auth.log | grep -v "session opened"
```