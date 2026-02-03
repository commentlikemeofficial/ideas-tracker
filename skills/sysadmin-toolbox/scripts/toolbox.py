#!/usr/bin/env python3
"""
sysadmin-toolbox: Quick access to sysadmin one-liners
"""
import sys
import subprocess
import argparse

# Command categories
COMMANDS = {
    "logs": {
        "tail-error": "tail -f /var/log/syslog | grep -i error",
        "errors-count": "grep -i error /var/log/syslog | cut -d' ' -f5- | sort | uniq -c | sort -rn | head -20",
        "large-logs": "find /var/log -name '*.log' -size +100M -exec ls -lh {} \\;",
        "disk-usage": "du -sh /var/log/* | sort -rh | head -20",
    },
    "processes": {
        "top-cpu": "ps aux --sort=-%cpu | head -10",
        "top-mem": "ps aux --sort=-%mem | head -10",
        "zombies": r"ps aux | awk '{if ($8 ~ /^Z/) print $0}'",
        "swap-usage": r"for file in /proc/*/status ; do awk '/VmSwap|Name/{printf $2\" \"$3}END{print \"\"}' $file; done | grep -v '0 kB' | sort -k2 -n",
        "failed-services": "systemctl --failed --type=service",
    },
    "network": {
        "test-port": "timeout 5 bash -c '</dev/tcp/localhost/8080' && echo 'open' || echo 'closed'",
        "listening": "ss -tlnp | grep LISTEN",
        "connections": r"netstat -tan | awk '{print $6}' | sort | uniq -c | sort -rn",
        "top-ips": r"netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -20",
        "bandwidth": "iftop -i eth0 -nNP",
    },
    "security": {
        "suid": "find / -perm -4000 -type f 2>/dev/null",
        "world-writable": "find / -xdev -type d -perm -0002 -a ! -perm -1000 2>/dev/null",
        "no-owner": "find / -xdev -nouser -o -nogroup 2>/dev/null",
        "sudoers": r"grep -Po '^sudo.+:\K.*$' /etc/group | tr ',' '\n'",
        "ssh-brute": r"grep 'Failed password' /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head",
    },
    "aws": {
        "running-instances": "aws ec2 describe-instances --filters 'Name=instance-state-name,Values=running' --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,PublicIpAddress,Tags[?Key==`Name`].Value|[0]]' --output table",
        "s3-buckets": "aws s3 ls",
        "cloudwatch-alarms": "aws cloudwatch describe-alarms --state-value ALARM",
        "iam-users": "aws iam list-users --query 'Users[*].[UserName,PasswordLastUsed]' --output table",
        "current-costs": "aws ce get-cost-and-usage --time-period Start=$(date -d \"$(date +%Y-%m-01)\" +%Y-%m-%d),End=$(date +%Y-%m-%d) --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=SERVICE",
    }
}

def list_commands():
    """List all available commands."""
    for category, cmds in COMMANDS.items():
        print(f"\n[{category.upper()}]")
        for name, cmd in cmds.items():
            print(f"  {name}: {cmd[:60]}...")

def get_command(category, name):
    """Get a specific command."""
    if category in COMMANDS and name in COMMANDS[category]:
        return COMMANDS[category][name]
    return None

def run_command(cmd):
    """Execute a command."""
    print(f"$ {cmd}\n")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=False, text=True)
        return result.returncode
    except Exception as e:
        print(f"Error: {e}")
        return 1

def main():
    parser = argparse.ArgumentParser(description="Sysadmin Toolbox")
    parser.add_argument("category", nargs="?", help="Command category (logs, processes, network, security, aws)")
    parser.add_argument("command", nargs="?", help="Command name")
    parser.add_argument("--list", "-l", action="store_true", help="List all commands")
    parser.add_argument("--show", "-s", action="store_true", help="Show command without running")
    
    args = parser.parse_args()
    
    if args.list or not args.category:
        list_commands()
        return
    
    cmd = get_command(args.category, args.command)
    if not cmd:
        print(f"Unknown command: {args.category}/{args.command}")
        print(f"\nAvailable in '{args.category}':")
        if args.category in COMMANDS:
            for name in COMMANDS[args.category]:
                print(f"  - {name}")
        return 1
    
    if args.show:
        print(cmd)
    else:
        return run_command(cmd)

if __name__ == "__main__":
    sys.exit(main())