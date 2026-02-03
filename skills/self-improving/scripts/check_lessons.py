#!/usr/bin/env python3
"""
Check for lessons that should be surfaced before starting similar tasks
"""
import sys
import json
from pathlib import Path

LESSONS_FILE = Path("/home/ubuntu/clawd/memory/lessons.json")

def load_lessons():
    if LESSONS_FILE.exists():
        with open(LESSONS_FILE) as f:
            return json.load(f)
    return {"lessons": []}

def get_recent_errors(hours=48):
    """Get recent errors that might be relevant (excluding resolved)."""
    from datetime import datetime, timedelta
    
    data = load_lessons()
    cutoff = datetime.now() - timedelta(hours=hours)
    
    recent = []
    for lesson in data["lessons"]:
        # Skip resolved lessons
        if lesson.get("outcome") == "resolved":
            continue
        if lesson["category"] == "error":
            created = datetime.fromisoformat(lesson["created_at"])
            if created > cutoff:
                recent.append(lesson)
    
    return recent

def get_high_impact_lessons(min_accessed=2):
    """Get frequently-accessed lessons (high value), excluding resolved."""
    data = load_lessons()
    
    impactful = [
        l for l in data["lessons"] 
        if l.get("accessed_count", 0) >= min_accessed 
        and l.get("outcome") != "resolved"
    ]
    impactful.sort(key=lambda x: -x.get("accessed_count", 0))
    
    return impactful[:5]

if __name__ == "__main__":
    # Handle --help
    if len(sys.argv) > 1 and sys.argv[1] in ("--help", "-h"):
        print("Usage: check_lessons.py")
        print("")
        print("Check for recent errors and high-value lessons.")
        print("Shows errors from last 48h and most-accessed lessons.")
        print("")
        print("Examples:")
        print("  check_lessons.py")
        sys.exit(0)
    
    try:
        # Check for recent errors
        recent_errors = get_recent_errors()
        
        output = []
        
        if recent_errors:
            output.append("🚨 RECENT ERRORS (last 48h):")
            for e in recent_errors[:3]:
                output.append(f"  • #{e['id']}: {e['lesson'][:60]}")
        
        # Check for high-impact lessons
        impactful = get_high_impact_lessons()
        
        if impactful:
            output.append("\n📚 HIGH-VALUE LESSONS:")
            for l in impactful[:3]:
                output.append(f"  • #{l['id']} (used {l.get('accessed_count', 0)}x): {l['lesson'][:60]}")
        
        if output:
            print("\n".join(output))
    except Exception as e:
        print(f"Error checking lessons: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Always exit 0 - empty output just means no lessons to surface (not an error)
    sys.exit(0)