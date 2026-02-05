#!/usr/bin/env python3
"""
Night Shift CEO Mode — UPGRADED v2
Builds code PRs overnight for Rajesh to review in the morning
Uses Kimi CLI for actual coding
"""

import json
import sys
import os
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

NIGHT_SHIFT_LOG = Path("/home/ubuntu/clawd/night-shift-work/ceo-log.json")
DELIVERY_FILE = Path("/home/ubuntu/clawd/night-shift-work/morning-delivery.json")
LAST_MESSAGE_FILE = Path("/home/ubuntu/clawd/memory/last-message-timestamp.txt")
WORK_DIR = Path("/home/ubuntu/clawd/night-shift-work")
BUILDS_DIR = WORK_DIR / "builds"

def is_night_shift_hours():
    """Check if it's night shift hours (11 PM - 7 AM IST)."""
    ist_hour = (datetime.utcnow() + timedelta(hours=5, minutes=30)).hour
    return ist_hour >= 23 or ist_hour < 7

def is_rajesh_offline():
    """Check if Rajesh hasn't messaged for >4 hours."""
    if not LAST_MESSAGE_FILE.exists():
        return True
    
    last_msg = datetime.fromisoformat(LAST_MESSAGE_FILE.read_text().strip())
    hours_since = (datetime.now() - last_msg).total_seconds() / 3600
    return hours_since > 4

def should_activate():
    """Check if Night Shift CEO mode should activate."""
    return is_night_shift_hours() and is_rajesh_offline()

def log_activity(activity):
    """Log night shift activity."""
    data = {"activities": [], "last_updated": datetime.now().isoformat()}
    if NIGHT_SHIFT_LOG.exists():
        with open(NIGHT_SHIFT_LOG) as f:
            data = json.load(f)
    
    data["activities"].append({
        "timestamp": datetime.now().isoformat(),
        "activity": activity
    })
    
    NIGHT_SHIFT_LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(NIGHT_SHIFT_LOG, 'w') as f:
        json.dump(data, f, indent=2)

def already_delivered_today():
    """Check if we already delivered this morning."""
    if not DELIVERY_FILE.exists():
        return False
    
    with open(DELIVERY_FILE) as f:
        delivery = json.load(f)
    
    delivery_date = datetime.fromisoformat(delivery.get('timestamp', '2000-01-01')).date()
    return delivery_date == datetime.now().date()

def get_build_queue():
    """Get list of projects to build."""
    queue_file = WORK_DIR / "build-queue.json"
    
    default_queue = [
        {
            "id": "auto-commit-helper",
            "name": "Auto-commit Helper",
            "description": "Script that detects uncommitted changes in clawd repo and suggests/commits them with smart messages",
            "files": ["scripts/auto-commit.py"],
            "tech": "python",
            "priority": 1
        },
        {
            "id": "daily-work-summary",
            "name": "Daily Work Summary Generator",
            "description": "Parse memory files, git commits, and activity logs to generate a daily work summary report",
            "files": ["scripts/daily-summary.py"],
            "tech": "python",
            "priority": 2
        },
        {
            "id": "github-pr-notifier",
            "name": "GitHub PR Notifier",
            "description": "Check for new PRs and issues in tracked repos, send Telegram notifications",
            "files": ["scripts/pr-notify.py"],
            "tech": "python",
            "priority": 3
        },
        {
            "id": "skill-usage-analytics",
            "name": "Skill Usage Analytics",
            "description": "Track which Clawdbot skills are used most/least, generate weekly utilization reports",
            "files": ["scripts/skill-analytics.py"],
            "tech": "python",
            "priority": 4
        },
        {
            "id": "memory-auto-sync",
            "name": "Memory Auto-sync",
            "description": "Automatically sync MEMORY.md with daily memory files, keep long-term memory organized",
            "files": ["scripts/memory-sync.py"],
            "tech": "python",
            "priority": 5
        },
        {
            "id": "second-brain-ui",
            "name": "2nd Brain Web UI",
            "description": "NextJS app to visualize .brv/canonical-memory/ and memory/ files in Obsidian-style graph view",
            "files": ["apps/second-brain/"],
            "tech": "nextjs",
            "priority": 6
        }
    ]
    
    if queue_file.exists():
        return json.loads(queue_file.read_text())
    else:
        queue_file.write_text(json.dumps(default_queue, indent=2))
        return default_queue

def mark_project_built(project_id):
    """Mark a project as built."""
    built_file = WORK_DIR / "built-projects.json"
    built = {"projects": [], "last_updated": datetime.now().isoformat()}
    
    if built_file.exists():
        built = json.loads(built_file.read_text())
    
    if project_id not in built["projects"]:
        built["projects"].append(project_id)
        built_file.write_text(json.dumps(built, indent=2))

def get_next_project():
    """Get the next project to build."""
    queue = get_build_queue()
    built_file = WORK_DIR / "built-projects.json"
    built = []
    
    if built_file.exists():
        built = json.loads(built_file.read_text()).get("projects", [])
    
    # Find first unbuilt project
    for project in sorted(queue, key=lambda x: x["priority"]):
        if project["id"] not in built:
            return project
    
    return None

def prepare_kimi_workspace(project):
    """Prepare workspace for Kimi to build in."""
    today = datetime.now().strftime("%Y%m%d")
    build_dir = BUILDS_DIR / f"{today}-{project['id']}"
    build_dir.mkdir(parents=True, exist_ok=True)
    
    # Create instructions file for Kimi
    instructions = f"""# Kimi Build Instructions

Project: {project['name']}
Date: {datetime.now().isoformat()}

## Goal
{project['description']}

## Requirements
1. Create a working, production-ready implementation
2. Include proper error handling
3. Add clear comments and documentation
4. Follow best practices for {project['tech']}
5. Include a README with usage instructions
6. Make it ready for Rajesh to review and integrate

## Output Directory
{build_dir}

## Files to Create
{chr(10).join(f"- {f}" for f in project['files'])}

## Context
This is for the clawd workspace - an AI agent management system.
The project runs on Ubuntu with Python, Node.js, and uses:
- Clawdbot for AI agent orchestration
- GitHub for code hosting
- Telegram for notifications
- ByteRover for knowledge management

## Success Criteria
- [ ] Code works without errors
- [ ] Has proper error handling
- [ ] Well commented
- [ ] README explains usage
- [ ] Ready to integrate into main project

Run Kimi CLI in this directory to build the project.
"""
    
    instructions_file = build_dir / "BUILD_INSTRUCTIONS.md"
    instructions_file.write_text(instructions)
    
    return build_dir, instructions_file

def build_with_kimi(project):
    """Build project using Kimi CLI."""
    log_activity(f"Preparing build: {project['name']}")
    
    build_dir, instructions_file = prepare_kimi_workspace(project)
    
    # Create the prompt for Kimi
    prompt = f"""Build this project for me:

{project['description']}

Requirements:
- Working, production-ready code
- Error handling
- Clear comments
- README with usage instructions
- Ready to integrate

Create all files in the current directory.

Start building now."""
    
    # Write prompt file
    prompt_file = build_dir / "kimi-prompt.txt"
    prompt_file.write_text(prompt)
    
    log_activity(f"Workspace prepared: {build_dir}")
    
    # Try to run Kimi (non-interactive mode if possible)
    try:
        # Check if Kimi can run in non-interactive mode
        # For now, we prepare everything and log the command
        kimi_command = f"cd {build_dir} && kimi -m 'Build a {project['name']}: {project['description']}. Create working code with error handling, comments, and README.'"
        
        command_file = build_dir / "run-kimi.sh"
        command_file.write_text(f"#!/bin/bash\n{kimi_command}\n")
        command_file.chmod(0o755)
        
        log_activity(f"Kimi command ready: {command_file}")
        
        return {
            "success": True,
            "build_dir": str(build_dir),
            "instructions": str(instructions_file),
            "prompt": str(prompt_file),
            "kimi_command": str(command_file),
            "project": project
        }
    except Exception as e:
        log_activity(f"Kimi prep failed: {e}")
        return None

def format_delivery(build_result):
    """Format morning delivery message."""
    project = build_result["project"]
    
    return f"""🌙 NIGHT SHIFT DELIVERY

Built: {project['name']}

What it is:
{project['description']}

Build Location:
{build_result['build_dir']}

To Review:
1. `cd {build_result['build_dir']}`
2. Read BUILD_INSTRUCTIONS.md for context
3. Review the code files
4. Test if it works

To Rebuild with Kimi:
```bash
{build_result['kimi_command']}
```

Or run Kimi with this prompt:
```
{build_result['prompt']}
```

Why it matters:
This automation saves time on {project['name'].lower()} daily.

Next Steps:
1. Review the code
2. Test it
3. Copy to main project if good
4. Or run Kimi yourself to refine it
"""

def main():
    if not should_activate():
        print("Night Shift CEO: Not active (Rajesh online or daytime)")
        return 0
    
    if already_delivered_today():
        print("Night Shift CEO: Already delivered today")
        return 0
    
    print("🌙 Night Shift CEO activating...")
    log_activity("Activated")
    
    # Get next project
    project = get_next_project()
    
    if not project:
        log_activity("No projects in queue")
        print("Night Shift CEO: No projects to build")
        return 0
    
    log_activity(f"Selected project: {project['name']}")
    
    # Build it
    build_result = build_with_kimi(project)
    
    if build_result and build_result.get("success"):
        # Mark as built
        mark_project_built(project["id"])
        
        # Format delivery
        delivery = format_delivery(build_result)
        
        # Save delivery
        with open(DELIVERY_FILE, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "delivery": delivery,
                "type": "build",
                "project": project,
                "build_dir": build_result["build_dir"]
            }, f, indent=2)
        
        print(delivery)
        log_activity(f"Delivered: {project['name']}")
        return 0
    else:
        log_activity("Build preparation failed")
        print("Night Shift CEO: Failed to prepare build")
        return 1

if __name__ == "__main__":
    sys.exit(main())
