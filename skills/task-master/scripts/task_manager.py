#!/usr/bin/env python3
"""
task-master: Core task management operations
"""
import json
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path

TASKS_FILE = Path("/home/ubuntu/clawd/memory/tasks.json")

def load_tasks():
    """Load tasks from storage."""
    if TASKS_FILE.exists():
        with open(TASKS_FILE) as f:
            return json.load(f)
    return {"tasks": [], "next_id": 1}

def save_tasks(data):
    """Save tasks to storage."""
    TASKS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(TASKS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def add_task(description, priority="medium", deadline=None, context=None):
    """Add a new task."""
    data = load_tasks()
    task_id = data["next_id"]
    
    task = {
        "id": task_id,
        "description": description,
        "priority": priority.lower(),
        "deadline": deadline,
        "status": "open",
        "context": context or "",
        "created_at": datetime.now().isoformat(),
        "completed_at": None
    }
    
    data["tasks"].append(task)
    data["next_id"] = task_id + 1
    save_tasks(data)
    
    print(f"Task #{task_id} added: {description}")
    return task_id

def list_tasks(filter_status="open", sort_by="priority"):
    """List tasks with optional filtering."""
    data = load_tasks()
    tasks = [t for t in data["tasks"] if filter_status == "all" or t["status"] == filter_status]
    
    # Priority ordering: critical > high > medium > low
    priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    
    if sort_by == "priority":
        tasks.sort(key=lambda t: (priority_order.get(t["priority"], 2), t.get("deadline") or "9999"))
    elif sort_by == "deadline":
        tasks.sort(key=lambda t: (t.get("deadline") or "9999", priority_order.get(t["priority"], 2)))
    
    return tasks

def complete_task(task_id):
    """Mark a task as completed."""
    data = load_tasks()
    for task in data["tasks"]:
        if task["id"] == int(task_id):
            task["status"] = "completed"
            task["completed_at"] = datetime.now().isoformat()
            save_tasks(data)
            print(f"Task #{task_id} completed: {task['description']}")
            return True
    print(f"Task #{task_id} not found")
    return False

def delete_task(task_id):
    """Delete a task permanently."""
    data = load_tasks()
    original_len = len(data["tasks"])
    data["tasks"] = [t for t in data["tasks"] if t["id"] != int(task_id)]
    
    if len(data["tasks"]) < original_len:
        save_tasks(data)
        print(f"Task #{task_id} deleted")
        return True
    print(f"Task #{task_id} not found")
    return False

def get_upcoming_tasks(hours=24):
    """Get tasks with deadlines within the next N hours."""
    data = load_tasks()
    now = datetime.now()
    cutoff = now + timedelta(hours=hours)
    
    upcoming = []
    for task in data["tasks"]:
        if task["status"] != "open" or not task.get("deadline"):
            continue
        try:
            deadline = datetime.fromisoformat(task["deadline"])
            if now <= deadline <= cutoff:
                upcoming.append(task)
        except:
            pass
    
    return sorted(upcoming, key=lambda t: t["deadline"])

def format_task_list(tasks, verbose=False):
    """Format tasks for display."""
    if not tasks:
        return "No tasks found."
    
    lines = []
    for t in tasks:
        status = "✓" if t["status"] == "completed" else "○"
        prio = t["priority"].upper()
        deadline = f" [due: {t['deadline'][:10]}]" if t.get("deadline") else ""
        context = f" ({t['context']})" if verbose and t.get("context") else ""
        lines.append(f"  {status} #{t['id']} [{prio}] {t['description']}{deadline}{context}")
    
    return "\n".join(lines)

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "list"
    
    if cmd == "add":
        desc = sys.argv[2] if len(sys.argv) > 2 else "New task"
        priority = sys.argv[3] if len(sys.argv) > 3 else "medium"
        deadline = sys.argv[4] if len(sys.argv) > 4 else None
        context = sys.argv[5] if len(sys.argv) > 5 else None
        add_task(desc, priority, deadline, context)
    
    elif cmd == "list":
        status = sys.argv[2] if len(sys.argv) > 2 else "open"
        sort = sys.argv[3] if len(sys.argv) > 3 else "priority"
        tasks = list_tasks(status, sort)
        print(format_task_list(tasks))
    
    elif cmd == "complete":
        task_id = sys.argv[2] if len(sys.argv) > 2 else None
        if task_id:
            complete_task(task_id)
        else:
            print("Usage: complete <task_id>")
    
    elif cmd == "delete":
        task_id = sys.argv[2] if len(sys.argv) > 2 else None
        if task_id:
            delete_task(task_id)
        else:
            print("Usage: delete <task_id>")
    
    elif cmd == "upcoming":
        hours = int(sys.argv[2]) if len(sys.argv) > 2 else 24
        tasks = get_upcoming_tasks(hours)
        print(format_task_list(tasks))
    
    else:
        print("Unknown command. Use: add, list, complete, delete, upcoming")