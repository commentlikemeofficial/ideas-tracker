#!/usr/bin/env python3
"""
Auto-updater: Daily updates with full summary report
Runs via cron, backs up before updates, reports what changed
"""
import subprocess
import json
import os
import shutil
from datetime import datetime
from pathlib import Path

# Config
BACKUP_DIR = Path.home() / '.clawdbot' / 'backups'
LOG_FILE = Path.home() / '.clawdbot' / 'auto-update.log'
SKILLS_DIR = Path.home() / 'clawd' / 'skills'

def log(msg):
    timestamp = datetime.now().isoformat()
    with open(LOG_FILE, 'a') as f:
        f.write(f"[{timestamp}] {msg}\n")
    print(msg)

def backup_skills():
    """Backup skills directory before updates"""
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = BACKUP_DIR / f'skills_backup_{timestamp}.tar.gz'
    
    try:
        subprocess.run(
            ['tar', '-czf', str(backup_path), '-C', str(SKILLS_DIR.parent), 'skills'],
            check=True,
            capture_output=True
        )
        return str(backup_path)
    except Exception as e:
        return None

def get_clawdbot_version():
    """Get current Clawdbot version"""
    try:
        result = subprocess.run(['clawdbot', '--version'], capture_output=True, text=True)
        return result.stdout.strip() if result.returncode == 0 else "unknown"
    except:
        return "unknown"

def get_skill_versions():
    """Get current skill versions before update"""
    versions = {}
    try:
        result = subprocess.run(
            ['clawdhub', 'list', '--dir', str(SKILLS_DIR)],
            capture_output=True,
            text=True
        )
        # Parse output for skill names
        for line in result.stdout.split('\n'):
            if line.strip() and not line.startswith('-'):
                skill_name = line.split()[0] if line.split() else line.strip()
                versions[skill_name] = "current"
    except:
        pass
    return versions

def update_clawdbot():
    """Update Clawdbot itself"""
    old_version = get_clawdbot_version()
    
    try:
        # Try source install update first
        result = subprocess.run(
            ['clawdbot', 'update'],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode == 0:
            new_version = get_clawdbot_version()
            if new_version != old_version:
                return True, f"Updated to {new_version} (was {old_version})"
            return True, "Already up to date"
        else:
            return False, f"Update failed: {result.stderr}"
    except Exception as e:
        return False, f"Update error: {e}"

def update_skills():
    """Update all installed skills"""
    try:
        # First do a dry-run to see what would update
        dry_run = subprocess.run(
            ['clawdhub', 'update', '--all', '--dir', str(SKILLS_DIR), '--dry-run'],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        # Now do the actual update
        result = subprocess.run(
            ['clawdhub', 'update', '--all', '--dir', str(SKILLS_DIR)],
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if result.returncode == 0:
            # Parse what was updated from the output
            updated = []
            if "already up to date" in result.stdout.lower():
                return True, [], "All skills already up to date"
            
            # Look for updated skills in output
            for line in result.stdout.split('\n'):
                if '→' in line or 'updated' in line.lower():
                    updated.append(line.strip())
            
            return True, updated, result.stdout
        else:
            return False, [], f"Skill update failed: {result.stderr}"
    except Exception as e:
        return False, [], f"Skill update error: {e}"

def main():
    log("="*60)
    log("🔄 Starting daily auto-update")
    log("="*60)
    
    errors = []
    
    # Create backup
    backup_path = backup_skills()
    
    # Update Clawdbot
    clawdbot_success, clawdbot_msg = update_clawdbot()
    if not clawdbot_success:
        errors.append(f"Clawdbot: {clawdbot_msg}")
    
    # Update skills
    skills_success, skills_updated, skills_msg = update_skills()
    if not skills_success:
        errors.append(f"Skills: {skills_msg}")
    
    # Generate report
    print("\n" + "="*60)
    print("🔄 Daily Auto-Update Complete")
    print("="*60)
    print()
    
    # Clawdbot status
    if clawdbot_success:
        print(f"**Clawdbot**: {clawdbot_msg}")
    else:
        print(f"**Clawdbot**: ❌ {clawdbot_msg}")
    print()
    
    # Skills status
    if skills_success:
        if skills_updated:
            print(f"**Skills Updated ({len(skills_updated)})**:")
            for skill in skills_updated[:10]:  # Limit to 10
                print(f"- {skill}")
            if len(skills_updated) > 10:
                print(f"... and {len(skills_updated) - 10} more")
        else:
            print("**Skills**: All already up to date")
    else:
        print(f"**Skills**: ❌ {skills_msg}")
    print()
    
    # Errors
    if errors:
        print("**Errors**:")
        for err in errors:
            print(f"- {err}")
        print()
    
    if backup_path:
        print(f"💾 Backup: {backup_path}")
        print()
    
    print("="*60)
    
    log("="*60)
    log("Auto-update complete")
    log("="*60)

if __name__ == "__main__":
    main()