# Process Management One-Liners

## Process Monitoring

```bash
# Top processes by CPU
ps aux --sort=-%cpu | head -10

# Top processes by Memory
ps aux --sort=-%mem | head -10

# Processes with high thread count
ps -eLf | awk '{print $2}' | sort | uniq -c | sort -rn | head -10

# Find processes using swap
for file in /proc/*/status ; do awk '/VmSwap|Name/{printf $2" "$3}END{print ""}' $file; done | grep -v "0 kB" | sort -k2 -n

# Zombie processes
ps aux | awk '{if ($8 ~ /^Z/) print $0}'
```

## Process Control

```bash
# Kill all processes by name
pkill -f process_name

# Kill by port
kill $(lsof -t -i:8080)

# Graceful then force kill
timeout 5 kill -15 $PID || kill -9 $PID

# Restart service if not running
pgrep nginx || systemctl start nginx

# Kill processes older than X hours
find /proc -maxdepth 1 -name "[0-9]*" -mmin +360 -exec basename {} \; | xargs -r kill
```

## Resource Usage

```bash
# Memory usage by process
smem -r -k -c pid,uss,comm | head -20

# CPU time consumed by processes
ps -eo pid,comm,cputime | sort -k3 -rn | head -10

# IO statistics
iotop -bo -d 1 -n 5 | tail -n +4 | head -20

# Open files by process
lsof -p $PID | wc -l

# Process tree
pstree -p $PID
```

## Service Management

```bash
# Failed systemd services
systemctl --failed --type=service

# Services taking long to start
systemd-analyze blame | head -20

# Critical chain at boot
systemd-analyze critical-chain

# Restart all failed services
systemctl reset-failed && systemctl restart $(systemctl --failed --type=service --no-pager | grep -oP '^\S+(?=\.service)' | tail -n +2)

# Check service dependencies
systemctl list-dependencies $SERVICE
```