#!/usr/bin/env python3
"""
Morning Brief Skill - Personalized daily briefing for Rajesh
Sends daily at 9-10 AM IST via cron
"""
import subprocess
import json
from datetime import datetime
from pathlib import Path

# User context
USER = {
    "name": "Rajesh",
    "location": "Hyderabad, India",
    "timezone": "Asia/Kolkata",
    "interests": [
        "AI/ML", "Next.js", "TypeScript", "SaaS products",
        "DPDPA compliance", "LinkedIn automation", "Open source",
        "Full stack development", "LLM APIs", "Productivity"
    ],
    "current_projects": [
        "ComplySec - DPDPA 2023 compliance",
        "CommentLikeMe - LinkedIn AI tool",
        "Universal Read API - open source"
    ],
    "goals": [
        "Grow ComplySec to more users",
        "Build in public on LinkedIn",
        "Ship fast and iterate",
        "Contribute to open source"
    ]
}

def get_weather():
    """Get weather for Hyderabad"""
    try:
        result = subprocess.run(
            ['curl', '-s', 'wttr.in/Hyderabad?format=%C+%t+%h+%w'],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except:
        pass
    return "Weather data unavailable"

def get_tasks():
    """Get today's tasks from task-master"""
    try:
        result = subprocess.run(
            ['python3', '/home/ubuntu/clawd/skills/task-master/scripts/check_reminders.py', '--hours', '24'],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.stdout.strip() if result.stdout.strip() else "No urgent tasks for today"
    except:
        return "Task check unavailable"

def get_trending_tech():
    """Search for trending AI/tech news"""
    search_terms = [
        "AI news today",
        "Next.js updates",
        "SaaS product launches",
        "LinkedIn AI tools"
    ]
    stories = []
    try:
        for term in search_terms[:2]:  # Limit to avoid rate limits
            result = subprocess.run(
                ['python3', '-c', f'''
import sys
sys.path.insert(0, "/home/ubuntu/clawd/skills/tavily-search/scripts")
from tavily_search import tavily_search
try:
    results = tavily_search("{term}", 2)
    for r in results[:2]:
        print(f"• {{r['title']}} - {{r['url']}}")
except:
    pass
'''],
                capture_output=True,
                text=True,
                timeout=15
            )
            if result.stdout.strip():
                stories.extend(result.stdout.strip().split('\n'))
    except:
        pass
    
    return '\n'.join(stories[:5]) if stories else "• Check Hacker News for tech updates\n• Browse LinkedIn for AI news"

def get_youtube_recommendations():
    """Generate YouTube video recommendations based on interests"""
    topics = [
        ("Next.js 15 features", "latest web dev"),
        ("AI SaaS tutorial", "building with AI"),
        ("TypeScript tips", "code quality"),
        ("LinkedIn growth strategy", "building in public")
    ]
    
    videos = []
    for topic, category in topics[:3]:
        videos.append(f"🔍 Search: \"{topic}\" ({category})")
    
    return '\n'.join(videos)

def suggest_my_tasks():
    """Suggest tasks I can do for Rajesh today"""
    suggestions = [
        "🤖 Review and optimize your ComplySec code",
        "📊 Check CommentLikeMe user analytics",
        "📝 Draft LinkedIn post about recent progress",
        "🔧 Update documentation for Universal Read API",
        "🐛 Review any open issues or bugs",
        "📧 Check for important emails/mentions",
        "🚀 Research new AI tools for your stack"
    ]
    return '\n'.join(suggestions[:4])

def get_productivity_tips():
    """Generate personalized productivity recommendations"""
    tips = [
        "🎯 **Focus Block**: Dedicate 2 hours to your #1 priority (ComplySec user growth?)",
        "📱 **LinkedIn**: Post an update about what you're shipping today",
        "⚡ **Quick Win**: Complete one small task from your list in the first hour",
        "🧠 **Learning**: Watch one tech video during lunch break",
        "🔄 **Iterate**: Review yesterday's work and ship one improvement",
        "🤝 **Network**: Engage with 3 posts from your 5K+ LinkedIn network",
        "📈 **Track**: Update your work log in Google Sheets"
    ]
    return '\n'.join(tips[:3])

def generate_brief():
    """Generate the complete morning brief"""
    now = datetime.now()
    
    brief = f"""
🌅 **Good Morning, Rajesh!** 🚀
📅 {now.strftime('%A, %B %d, %Y')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌤️ **Weather in Hyderabad**
{get_weather()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **Your Tasks Today**
{get_tasks()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 **What I Can Do For You Today**
{suggest_my_tasks()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📺 **YouTube Videos to Watch**
{get_youtube_recommendations()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📰 **Trending in Your Interests**
{get_trending_tech()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Today's Productivity Boosters**
{get_productivity_tips()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **Focus Reminder**
You're an AI Full Stack Engineer shipping real products.
Today's mantra: *Ship fast, iterate faster, build in public.*

Have a productive day! 💪
"""
    return brief

if __name__ == "__main__":
    print(generate_brief())
