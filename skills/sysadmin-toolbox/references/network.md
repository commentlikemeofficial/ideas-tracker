# Network Diagnostics One-Liners

## Connectivity Tests

```bash
# Test port connectivity
timeout 5 bash -c "</dev/tcp/localhost/8080" && echo "open" || echo "closed"

# Check if host is up (no ping)
timeout 2 nc -z $HOST 22 && echo "up" || echo "down"

# Continuous ping with timestamp
ping google.com | while read pong; do echo "$(date): $pong"; done

# Test multiple hosts
for h in host1 host2 host3; do ping -c 1 -W 1 $h >/dev/null && echo "$h: up" || echo "$h: DOWN"; done

# Check DNS resolution
dig +short $DOMAIN @8.8.8.8
```

## Connection Analysis

```bash
# Active connections by state
netstat -tan | awk '{print $6}' | sort | uniq -c | sort -rn

# Connections per IP
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -20

# Top connecting IPs
ss -tan | awk '{print $4}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10

# Listening ports
ss -tlnp | grep LISTEN

# Track new connections per second
watch -n 1 'ss -tan | wc -l'
```

## Bandwidth & Traffic

```bash
# Monitor bandwidth by interface
iftop -i eth0 -nNP

# Network throughput
sar -n DEV 1 5

# Bandwidth usage by process
nethogs eth0

# Check interface errors
ifconfig eth0 | grep -E "RX errors|TX errors"

# Monitor packet drops
watch -n 1 'cat /proc/net/dev | grep eth0'
```

## Route & Path Analysis

```bash
# Trace with timing
traceroute -n -w 2 $HOST

# MTR (continuous traceroute)
mtr -n --report --report-cycles 10 $HOST

# Check MTU path
ping -M do -s 1472 $HOST

# BGP route lookup
whois -h whois.radb.net "!gAS$ASNUM"

# Local routing table
ip route | column -t
```