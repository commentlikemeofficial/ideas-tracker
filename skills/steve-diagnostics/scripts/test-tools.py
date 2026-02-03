#!/usr/bin/env python3
"""
Comprehensive tool testing script for clawd workspace
Tests all skill scripts and reports issues
"""
import subprocess
import sys
from pathlib import Path

SKILLS_DIR = Path("/home/ubuntu/clawd/skills")

def test_script(script_path):
    """Test a single script and return status."""
    try:
        result = subprocess.run(
            [sys.executable, str(script_path), "--help"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0, result.stderr
    except Exception as e:
        return False, str(e)

def show_help():
    print("""Tool Testing Script for clawd workspace

Usage: test-tools.py [options]

Options:
  --help          Show this help message

Description:
  Tests all skill scripts and reports issues.
  Runs --help on each Python script in skills/ directory.
  Reports working and broken tools.
""")

def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--help':
        show_help()
        return 0
    
    print("🔧 Testing clawd tools...\n")
    
    broken = []
    working = []
    
    for skill_dir in SKILLS_DIR.iterdir():
        if not skill_dir.is_dir():
            continue
            
        scripts_dir = skill_dir / "scripts"
        if not scripts_dir.exists():
            continue
            
        for script in scripts_dir.glob("*.py"):
            ok, err = test_script(script)
            if ok:
                working.append(f"✅ {skill_dir.name}/{script.name}")
            else:
                broken.append(f"❌ {skill_dir.name}/{script.name}: {err[:50]}")
    
    print(f"WORKING ({len(working)}):")
    for w in working[:10]:
        print(f"  {w}")
    if len(working) > 10:
        print(f"  ... and {len(working) - 10} more")
    
    if broken:
        print(f"\nBROKEN ({len(broken)}):")
        for b in broken:
            print(f"  {b}")
    
    print(f"\n{'='*50}")
    print(f"Total: {len(working)} working, {len(broken)} broken")
    
    return len(broken)

if __name__ == "__main__":
    sys.exit(main())
