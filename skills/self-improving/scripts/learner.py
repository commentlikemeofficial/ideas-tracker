#!/usr/bin/env python3
"""
self-improving: Capture errors, lessons, and feedback to build institutional knowledge
"""
import json
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

LESSONS_FILE = Path("/home/ubuntu/clawd/memory/lessons.json")

def load_lessons() -> Dict:
    """Load lessons database."""
    if LESSONS_FILE.exists():
        with open(LESSONS_FILE) as f:
            return json.load(f)
    return {
        "lessons": [],
        "patterns": {},
        "tool_effectiveness": {},
        "next_id": 1
    }

def save_lessons(data: Dict):
    """Save lessons database."""
    LESSONS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LESSONS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def add_lesson(
    lesson: str,
    category: str,
    context: str = "",
    tool: str = "",
    outcome: str = "success",  # success, failure, partial
    tags: List[str] = None
) -> int:
    """Add a new lesson to the knowledge base."""
    data = load_lessons()
    lesson_id = data["next_id"]
    
    entry = {
        "id": lesson_id,
        "lesson": lesson,
        "category": category,  # error, insight, workaround, preference, pattern
        "context": context,
        "tool": tool,
        "outcome": outcome,
        "tags": tags or [],
        "created_at": datetime.now().isoformat(),
        "accessed_count": 0,
        "last_accessed": None
    }
    
    data["lessons"].append(entry)
    data["next_id"] = lesson_id + 1
    
    # Update category patterns
    if category not in data["patterns"]:
        data["patterns"][category] = []
    data["patterns"][category].append(lesson_id)
    
    save_lessons(data)
    return lesson_id

def add_error(
    error: str,
    root_cause: str,
    solution: str,
    tool: str = "",
    prevention: str = ""
) -> int:
    """Add an error with context for future avoidance."""
    context = f"ERROR: {error}\nROOT_CAUSE: {root_cause}\nSOLUTION: {solution}"
    if prevention:
        context += f"\nPREVENTION: {prevention}"
    
    return add_lesson(
        lesson=f"Error: {error}",
        category="error",
        context=context,
        tool=tool,
        outcome="failure",
        tags=["error", tool] if tool else ["error"]
    )

def add_feedback(
    what_worked: str,
    what_didnt: str = "",
    suggestion: str = "",
    tool: str = ""
) -> int:
    """Capture user feedback on approaches."""
    context = f"WORKED: {what_worked}"
    if what_didnt:
        context += f"\nDIDNT_WORK: {what_didnt}"
    if suggestion:
        context += f"\nSUGGESTION: {suggestion}"
    
    return add_lesson(
        lesson=what_worked,
        category="feedback",
        context=context,
        tool=tool,
        outcome="success" if not what_didnt else "partial",
        tags=["feedback", tool] if tool else ["feedback"]
    )

def search_lessons(query: str = "", category: str = "", tool: str = "", limit: int = 5) -> List[Dict]:
    """Search lessons by query, category, or tool."""
    data = load_lessons()
    results = []
    
    for lesson in data["lessons"]:
        match = True
        
        if category and lesson["category"] != category:
            match = False
        if tool and lesson["tool"] != tool:
            match = False
        if query and query.lower() not in lesson["lesson"].lower() and query.lower() not in lesson.get("context", "").lower():
            match = False
        
        if match:
            results.append(lesson)
    
    # Sort by relevance (most accessed first, then newest)
    results.sort(key=lambda x: (-x.get("accessed_count", 0), x["created_at"]), reverse=True)
    
    # Update access counts
    for r in results[:limit]:
        r["accessed_count"] = r.get("accessed_count", 0) + 1
        r["last_accessed"] = datetime.now().isoformat()
    
    save_lessons(data)
    return results[:limit]

def get_tool_guidance(tool: str) -> List[Dict]:
    """Get accumulated wisdom about a specific tool."""
    return search_lessons(tool=tool, limit=10)

def get_common_errors(tool: str = "") -> List[Dict]:
    """Get common errors (optionally filtered by tool)."""
    return search_lessons(category="error", tool=tool, limit=10)

def get_preferences() -> List[Dict]:
    """Get user preferences from feedback."""
    return search_lessons(category="feedback", limit=10)

def format_lesson(lesson: Dict, verbose: bool = False) -> str:
    """Format a lesson for display."""
    lines = [
        f"#{lesson['id']} [{lesson['category'].upper()}] {lesson['lesson'][:80]}"
    ]
    if verbose:
        if lesson.get("context"):
            lines.append(f"  Context: {lesson['context'][:200]}")
        if lesson.get("tool"):
            lines.append(f"  Tool: {lesson['tool']}")
        if lesson.get("tags"):
            lines.append(f"  Tags: {', '.join(lesson['tags'])}")
        lines.append(f"  Learned: {lesson['created_at'][:10]}")
    return "\n".join(lines)

def suggest_approach(task_description: str) -> str:
    """Suggest approach based on similar past tasks."""
    # Search for relevant lessons
    lessons = search_lessons(query=task_description, limit=5)
    
    if not lessons:
        return "No relevant lessons found for this type of task."
    
    output = ["Based on past experience:"]
    
    for lesson in lessons:
        if lesson["category"] == "error":
            output.append(f"⚠️  Avoid: {lesson['lesson']}")
            if "PREVENTION" in lesson.get("context", ""):
                prev = lesson["context"].split("PREVENTION:")[1].strip().split("\n")[0]
                output.append(f"   Prevention: {prev}")
        elif lesson["category"] == "feedback":
            output.append(f"✓  What worked: {lesson['lesson']}")
        else:
            output.append(f"💡 {lesson['lesson']}")
    
    return "\n".join(output)

def main():
    if len(sys.argv) < 2:
        print("Usage: learner.py <command> [args]")
        print("Commands: add-lesson, add-error, add-feedback, search, tool, errors, suggest")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "add-lesson":
        if len(sys.argv) < 4:
            print("Usage: add-lesson <lesson> <category> [tool] [tags]")
            sys.exit(1)
        tags = sys.argv[5].split(",") if len(sys.argv) > 5 else []
        id = add_lesson(sys.argv[2], sys.argv[3], tool=sys.argv[4] if len(sys.argv) > 4 else "", tags=tags)
        print(f"Lesson #{id} added")
    
    elif cmd == "add-error":
        if len(sys.argv) < 5:
            print("Usage: add-error <error> <root_cause> <solution> [tool] [prevention]")
            sys.exit(1)
        id = add_error(sys.argv[2], sys.argv[3], sys.argv[4], 
                      sys.argv[5] if len(sys.argv) > 5 else "",
                      sys.argv[6] if len(sys.argv) > 6 else "")
        print(f"Error lesson #{id} added")
    
    elif cmd == "add-feedback":
        if len(sys.argv) < 3:
            print("Usage: add-feedback <what_worked> [what_didnt] [suggestion] [tool]")
            sys.exit(1)
        id = add_feedback(sys.argv[2], 
                         sys.argv[3] if len(sys.argv) > 3 else "",
                         sys.argv[4] if len(sys.argv) > 4 else "",
                         sys.argv[5] if len(sys.argv) > 5 else "")
        print(f"Feedback #{id} added")
    
    elif cmd == "search":
        query = sys.argv[2] if len(sys.argv) > 2 else ""
        results = search_lessons(query=query)
        for r in results:
            print(format_lesson(r, verbose=True))
            print()
    
    elif cmd == "tool":
        if len(sys.argv) < 3:
            print("Usage: tool <tool_name>")
            sys.exit(1)
        results = get_tool_guidance(sys.argv[2])
        print(f"Lessons for {sys.argv[2]}:")
        for r in results:
            print(format_lesson(r))
    
    elif cmd == "errors":
        tool = sys.argv[2] if len(sys.argv) > 2 else ""
        results = get_common_errors(tool)
        for r in results:
            print(format_lesson(r, verbose=True))
            print()
    
    elif cmd == "suggest":
        if len(sys.argv) < 3:
            print("Usage: suggest <task_description>")
            sys.exit(1)
        print(suggest_approach(sys.argv[2]))
    
    else:
        print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()