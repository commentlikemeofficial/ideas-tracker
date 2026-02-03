#!/usr/bin/env python3
"""
Comprehensive Skill Testing Script for Clawd Workspace
Tests all Python scripts in the skills directory and reports issues
"""

import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

SKILLS_DIR = Path("/home/ubuntu/clawd/skills")
RESULTS_FILE = Path("/home/ubuntu/clawd/memory/skill_test_results.json")

def run_test(script_path, args=None, env=None, timeout=10):
    """Run a script and capture results."""
    cmd = [sys.executable, str(script_path)]
    if args:
        cmd.extend(args)
    
    result = {
        "script": str(script_path.relative_to(SKILLS_DIR.parent)),
        "success": False,
        "exit_code": None,
        "stdout": "",
        "stderr": "",
        "error": None
    }
    
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            env={**subprocess.os.environ, **(env or {})}
        )
        result["exit_code"] = proc.returncode
        result["stdout"] = proc.stdout[:500] if proc.stdout else ""
        result["stderr"] = proc.stderr[:500] if proc.stderr else ""
        
        # Success if exit code is 0
        result["success"] = proc.returncode == 0
        
    except subprocess.TimeoutExpired:
        result["error"] = "Timeout"
    except Exception as e:
        result["error"] = str(e)
    
    return result

def find_python_scripts():
    """Find all Python scripts in skills directory."""
    scripts = []
    for path in SKILLS_DIR.rglob("*.py"):
        # Skip __pycache__ and test files
        if "__pycache__" not in str(path) and not path.name.startswith("test_"):
            scripts.append(path)
    return sorted(scripts)

def test_script_with_various_args(script_path):
    """Test a script with various argument combinations."""
    results = []
    
    # Test with --help (all scripts should support this)
    help_result = run_test(script_path, ["--help"], timeout=5)
    results.append(help_result)
    
    # Script-specific tests
    script_name = script_path.name
    
    # Scripts that should work with no args
    no_arg_scripts = [
        "check_reminders.py", "check_lessons.py", "check_graph.py",
        "greeting.py", "generate_brief.py", "weekly_digest.py",
        "night_shift.py", "auto-update.py"
    ]
    
    if script_name in no_arg_scripts:
        r = run_test(script_path, timeout=15)
        results.append(r)
        
    if script_name == "check_reminders.py":
        # Should succeed even with no tasks
        r = run_test(script_path, ["--hours", "24"], timeout=5)
        results.append(r)
        
    elif script_name == "task_manager.py":
        # Test basic commands
        results.append(run_test(script_path, ["list"], timeout=5))
        
    elif script_name == "learner.py":
        # Test search command
        results.append(run_test(script_path, ["search"], timeout=5))
        
    elif script_name == "graph.py":
        # Test stats command
        results.append(run_test(script_path, ["stats"], timeout=5))
        
    return results

def main():
    print("=" * 60)
    print("CLAWD SKILL TESTING SUITE")
    print("=" * 60)
    print()
    
    scripts = find_python_scripts()
    # Exclude the test script itself
    scripts = [s for s in scripts if s.name != "test_all.py"]
    print(f"Found {len(scripts)} Python scripts to test\n")
    
    all_results = []
    failed_scripts = []
    
    for script in scripts:
        print(f"Testing: {script.name}")
        results = test_script_with_various_args(script)
        all_results.extend(results)
        
        # Check for failures
        script_failed = False
        for r in results:
            if not r["success"]:
                script_failed = True
                failed_scripts.append({
                    "script": r["script"],
                    "args": r.get("args", []),
                    "exit_code": r["exit_code"],
                    "stderr": r["stderr"],
                    "error": r["error"]
                })
        
        if script_failed:
            print(f"  ❌ FAILED")
        else:
            print(f"  ✓ Passed")
    
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total tests: {len(all_results)}")
    print(f"Passed: {sum(1 for r in all_results if r['success'])}")
    print(f"Failed: {len(failed_scripts)}")
    print()
    
    if failed_scripts:
        print("FAILED TESTS:")
        for f in failed_scripts:
            print(f"  - {f['script']} (exit {f['exit_code']})")
            if f.get("stderr"):
                print(f"    stderr: {f['stderr'][:150]}")
            if f.get("error"):
                print(f"    error: {f['error']}")
    
    # Save results
    output = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": len(all_results),
        "passed": sum(1 for r in all_results if r["success"]),
        "failed": len(failed_scripts),
        "failed_details": failed_scripts,
        "all_results": all_results
    }
    
    RESULTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(RESULTS_FILE, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"\nResults saved to: {RESULTS_FILE}")
    
    return len(failed_scripts)

if __name__ == "__main__":
    exit_code = main()
    sys.exit(0 if exit_code == 0 else 1)
