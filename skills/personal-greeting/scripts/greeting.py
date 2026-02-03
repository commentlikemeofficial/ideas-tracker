#!/usr/bin/env python3
"""
personal-greeting: Context-aware greetings based on time, activity, and patterns
"""
import json
import sys
import os
import random
from datetime import datetime, timedelta
from pathlib import Path

# Timezone setup for India/Kolkata
os.environ['TZ'] = 'Asia/Kolkata'

# Paths
TASKS_FILE = Path("/home/ubuntu/clawd/memory/tasks.json")
LESSONS_FILE = Path("/home/ubuntu/clawd/memory/lessons.json")
GRAPH_FILE = Path("/home/ubuntu/clawd/memory/knowledge_graph.json")
MEMORY_DIR = Path("/home/ubuntu/clawd/memory")

MOTIVATIONAL_QUOTES = [
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your future is created by what you do today, not tomorrow.",
    "Small steps every day lead to big results.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream big. Start small. Act now.",
    "Your only limit is your mind.",
    "Make each day your masterpiece.",
    "Ship fast, iterate faster.",
    "Done is better than perfect.",
    "Build in public. Learn in public.",
    "Consistency beats intensity.",
    "Action creates clarity.",
]

FUN_SUGGESTIONS = [
    "Watch a documentary about AI or tech history",
    "Try a new coding challenge on LeetCode or HackerRank",
    "Explore a new open-source project on GitHub",
    "Listen to a startup podcast (How I Built This, Indie Hackers)",
    "Take a walk and brainstorm new product ideas",
    "Read a chapter from a tech book you've been putting off",
    "Build a small side project just for fun",
    "Contribute to an open-source issue",
    "Watch a conference talk on YouTube (PyCon, React Conf)",
    "Try a new programming language or framework",
    "Write a blog post about something you learned this week",
    "Clean up your GitHub profile and pin best projects",
    "Network with other builders on Twitter/X or LinkedIn",
    "Review and optimize your development workflow",
    "Experiment with a new AI tool or API",
]

LEARNING_RECOMMENDATIONS = [
    "Deep dive into system design patterns",
    "Learn about vector databases and embeddings",
    "Study distributed systems architecture",
    "Explore WebAssembly and its use cases",
    "Learn about LLM fine-tuning and prompting",
    "Study Kubernetes internals and operators",
    "Explore eBPF and modern observability",
    "Learn about event-driven architecture",
    "Study database internals and query optimization",
    "Explore Rust for systems programming",
    "Learn about WebRTC and real-time systems",
    "Study blockchain fundamentals (if curious)",
    "Explore GraphQL federation and microservices",
    "Learn about CI/CD best practices and GitOps",
    "Study machine learning deployment (MLOps)",
]

def get_current_time():
    """Get current time in IST (Asia/Kolkata)."""
    return datetime.now()

def is_morning():
    """Check if it's morning greeting time (6-10 AM)."""
    hour = get_current_time().hour
    return 6 <= hour < 10

def is_night():
    """Check if it's night greeting time (11 PM-2 AM)."""
    hour = get_current_time().hour
    return hour >= 23 or hour < 2

def is_weekend():
    """Check if it's weekend (Saturday=5, Sunday=6)."""
    return get_current_time().weekday() >= 5

def get_sleep_pattern():
    """Analyze chat history for sleep/activity patterns."""
    today = get_current_time().date()
    
    # Check today's memory file for activity timestamps
    memory_file = MEMORY_DIR / f"{today}.md"
    
    if not memory_file.exists():
        return "No activity data for today yet."
    
    try:
        with open(memory_file) as f:
            content = f.read()
            # Count messages and estimate activity
            lines = content.strip().split('\n')
            if len(lines) > 20:
                return "You've been highly active today! 🔥"
            elif len(lines) > 5:
                return "Moderate activity today. Good balance! ⚖️"
            else:
                return "Light day so far. Ready to crush it? 🚀"
    except:
        return "Activity pattern unavailable."

def get_today_tasks():
    """Get today's tasks from task-master."""
    if not TASKS_FILE.exists():
        return []
    
    try:
        with open(TASKS_FILE) as f:
            data = json.load(f)
            today = get_current_time().strftime("%Y-%m-%d")
            
            # Get open tasks with today's deadline or no deadline
            tasks = []
            for task in data.get("tasks", []):
                if task.get("status") == "open":
                    deadline = task.get("deadline", "")
                    if not deadline or deadline.startswith(today):
                        tasks.append(task)
            
            return tasks[:5]  # Top 5
    except:
        return []

def get_today_accomplishments():
    """Get today's completed tasks."""
    if not TASKS_FILE.exists():
        return []
    
    try:
        with open(TASKS_FILE) as f:
            data = json.load(f)
            today = get_current_time().strftime("%Y-%m-%d")
            
            completed_today = []
            for task in data.get("tasks", []):
                if task.get("status") == "completed":
                    completed_at = task.get("completed_at", "")
                    if completed_at.startswith(today):
                        completed_today.append(task)
            
            return completed_today
    except:
        return []

def get_tomorrow_priority():
    """Get high priority tasks for tomorrow."""
    if not TASKS_FILE.exists():
        return []
    
    try:
        with open(TASKS_FILE) as f:
            data = json.load(f)
            tomorrow = (get_current_time() + timedelta(days=1)).strftime("%Y-%m-%d")
            
            priorities = []
            for task in data.get("tasks", []):
                if task.get("status") == "open":
                    deadline = task.get("deadline", "")
                    priority = task.get("priority", "medium")
                    # Include critical/high priority or tasks due tomorrow
                    if priority in ["critical", "high"] or deadline.startswith(tomorrow):
                        priorities.append(task)
            
            return priorities[:3]
    except:
        return []

def morning_greeting():
    """Generate morning greeting."""
    lines = []
    now = get_current_time()
    hour = now.hour
    
    # Time-appropriate greeting
    if hour < 8:
        lines.append("🌅 Good morning, early riser!")
    else:
        lines.append("☀️ Good morning!")
    
    # Sleep/activity pattern
    lines.append(f"\n{get_sleep_pattern()}")
    
    # Today's tasks
    tasks = get_today_tasks()
    if tasks:
        lines.append(f"\n📋 Today's Focus ({len(tasks)} tasks):")
        for task in tasks[:3]:
            prio = task.get("priority", "medium").upper()
            desc = task.get("description", "Task")
            lines.append(f"   • [{prio}] {desc}")
    else:
        lines.append("\n📋 No urgent tasks for today. Perfect time to plan!")
    
    # Motivational quote
    lines.append(f"\n💡 {random.choice(MOTIVATIONAL_QUOTES)}")
    
    # Weekend bonus
    if is_weekend():
        lines.append(f"\n🎉 It's the weekend! {random.choice(FUN_SUGGESTIONS)}")
    
    return "\n".join(lines)

def night_greeting():
    """Generate night greeting."""
    lines = []
    now = get_current_time()
    hour = now.hour
    
    # Time-appropriate greeting
    if hour >= 23:
        lines.append("🌙 Good evening! Time to wind down.")
    else:
        lines.append("🌃 Still up? Let's wrap up the day.")
    
    # Today's accomplishments
    completed = get_today_accomplishments()
    if completed:
        lines.append(f"\n✅ Today's Wins ({len(completed)} completed):")
        for task in completed[:5]:
            lines.append(f"   • {task.get('description', 'Task')}")
    else:
        lines.append("\n📊 No tasks marked complete today.")
    
    # Tomorrow's priorities
    priorities = get_tomorrow_priority()
    if priorities:
        lines.append(f"\n🎯 Tomorrow's Priorities:")
        for task in priorities:
            prio = task.get("priority", "medium").upper()
            desc = task.get("description", "Task")
            lines.append(f"   • [{prio}] {desc}")
    else:
        lines.append("\n🎯 No urgent priorities for tomorrow. Nice!")
    
    # Sleep reminder
    lines.append(f"\n😴 Sleep Reminder: Aim for 7-8 hours. Good sleep = better code.")
    
    # Quote
    lines.append(f"\n🌟 {random.choice(MOTIVATIONAL_QUOTES)}")
    
    return "\n".join(lines)

def weekend_greeting():
    """Generate weekend greeting with fun/learning suggestions."""
    lines = []
    
    day_name = get_current_time().strftime("%A")
    lines.append(f"🎉 Happy {day_name}! Weekend mode activated.")
    
    # Fun suggestion
    lines.append(f"\n🎮 Fun Idea: {random.choice(FUN_SUGGESTIONS)}")
    
    # Learning recommendation
    lines.append(f"\n📚 Learn Something: {random.choice(LEARNING_RECOMMENDATIONS)}")
    
    # Check for pending tasks (light reminder)
    tasks = get_today_tasks()
    critical = [t for t in tasks if t.get("priority") == "critical"]
    if critical:
        lines.append(f"\n⚠️  Heads up: {len(critical)} critical task(s) pending. Maybe a quick win?")
    
    # Relaxation quote
    weekend_quotes = [
        "Rest is not idleness. It's preparation for better work.",
        "Weekends are for recharging your creative batteries.",
        "Balance is not something you find, it's something you create.",
    ]
    lines.append(f"\n🌴 {random.choice(weekend_quotes)}")
    
    return "\n".join(lines)

def auto_greeting():
    """Automatically choose appropriate greeting based on time."""
    if is_morning():
        return morning_greeting()
    elif is_night():
        return night_greeting()
    elif is_weekend():
        return weekend_greeting()
    else:
        # Regular day greeting
        hour = get_current_time().hour
        if 10 <= hour < 17:
            return f"👋 Good afternoon! Ready to ship?\n\n{random.choice(MOTIVATIONAL_QUOTES)}"
        else:
            return f"👋 Evening! Winding down or grinding on?\n\n{random.choice(MOTIVATIONAL_QUOTES)}"

def main():
    if len(sys.argv) < 2:
        # Auto-detect and print appropriate greeting
        print(auto_greeting())
        return
    
    cmd = sys.argv[1]
    
    if cmd == "morning":
        print(morning_greeting())
    elif cmd == "night":
        print(night_greeting())
    elif cmd == "weekend":
        print(weekend_greeting())
    elif cmd == "auto":
        print(auto_greeting())
    elif cmd == "time":
        now = get_current_time()
        print(f"Current time (IST): {now.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Hour: {now.hour}")
        print(f"Is morning (6-10 AM): {is_morning()}")
        print(f"Is night (11 PM-2 AM): {is_night()}")
        print(f"Is weekend: {is_weekend()}")
    else:
        print(f"Unknown command: {cmd}")
        print("Usage: greeting.py [morning|night|weekend|auto|time]")

if __name__ == "__main__":
    main()