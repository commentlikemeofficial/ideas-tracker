#!/usr/bin/env python3
"""
ContentClaw - YouTube Content Repurposer (YouTube Data API v3 Edition)
Extract, summarize, and repurpose YouTube videos using official API
"""

import sys
import re
import json
import urllib.request
import subprocess
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# YouTube Data API v3
YOUTUBE_API_KEY = "AIzaSyBv8v6V7bLjTvnIO-MYIjm22d1xGTDwQ1o"
YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

def extract_video_id(url):
    """Extract YouTube video ID from URL"""
    parsed = urlparse(url)
    if parsed.hostname in ('youtu.be',):
        return parsed.path[1:]
    if parsed.hostname in ('www.youtube.com', 'youtube.com'):
        if parsed.path == '/watch':
            return parse_qs(parsed.query)['v'][0]
        if parsed.path.startswith('/embed/'):
            return parsed.path.split('/')[2]
        if parsed.path.startswith('/v/'):
            return parsed.path.split('/')[2]
    return None

def get_video_details(video_id):
    """Get video details using YouTube Data API v3"""
    try:
        url = f"{YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id={video_id}&key={YOUTUBE_API_KEY}"
        
        req = urllib.request.Request(url, headers={
            'User-Agent': 'ContentClaw/1.0'
        })
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            if data.get('items') and len(data['items']) > 0:
                video = data['items'][0]
                snippet = video.get('snippet', {})
                stats = video.get('statistics', {})
                
                return {
                    "title": snippet.get('title', 'Unknown'),
                    "channel": snippet.get('channelTitle', 'Unknown'),
                    "description": snippet.get('description', ''),
                    "published_at": snippet.get('publishedAt', ''),
                    "tags": snippet.get('tags', []),
                    "view_count": stats.get('viewCount', '0'),
                    "like_count": stats.get('likeCount', '0'),
                    "comment_count": stats.get('commentCount', '0')
                }
        return None
    except Exception as e:
        print(f"⚠️  API Error: {e}")
        return None

def get_captions_list(video_id):
    """Get available caption tracks"""
    try:
        url = f"{YOUTUBE_API_BASE}/captions?part=snippet&videoId={video_id}&key={YOUTUBE_API_KEY}"
        
        req = urllib.request.Request(url, headers={
            'User-Agent': 'ContentClaw/1.0'
        })
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get('items', [])
    except Exception as e:
        return []

def search_video_topic(topic, max_results=5):
    """Search for videos on a topic to find similar content"""
    try:
        url = f"{YOUTUBE_API_BASE}/search?part=snippet&q={urllib.parse.quote(topic)}&type=video&maxResults={max_results}&key={YOUTUBE_API_KEY}"
        
        req = urllib.request.Request(url, headers={
            'User-Agent': 'ContentClaw/1.0'
        })
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get('items', [])
    except Exception as e:
        return []

def extract_key_insights(description, title, tags):
    """Extract key insights from video metadata"""
    # Combine all text sources
    full_text = f"{title}. {description}"
    
    # Split into sentences and take first meaningful ones
    sentences = re.split(r'(?<=[.!?])\s+', description)
    
    # Filter out short sentences and URLs
    meaningful = []
    for s in sentences[:10]:  # First 10 sentences
        s = s.strip()
        if len(s) > 30 and not s.startswith('http') and not s.startswith('www'):
            meaningful.append(s)
        if len(meaningful) >= 5:
            break
    
    if not meaningful:
        # Fallback to description summary
        meaningful = [description[:200] + "..."]
    
    return meaningful[:5]  # Top 5 insights

def generate_linkedin_post(title, channel, insights, video_url, view_count):
    """Generate LinkedIn-style post"""
    hook = f"Just watched {channel}'s breakdown on {title}."
    
    insights_text = "\n\n".join([f"• {insight}" for insight in insights])
    
    post = f"""{hook}

Key insights that stood out:

{insights_text}

What struck me most: The depth of analysis here. This isn't surface-level content—it's actionable intelligence.

As someone building in the AI/compliance space (consently.in with 15+ beta users), I'm always looking for insights that challenge my thinking.

What stood out to you? Drop a comment below. 👇

🎥 Source: {video_url}

#{channel.replace(' ', '')} #AI #SaaS #BuildingInPublic #StartupIndia"""
    return post

def generate_x_thread(title, channel, insights, video_url):
    """Generate X/Twitter thread"""
    tweets = [
        f"🧵 Just watched {channel}'s video on {title}\n\nHere are the key insights:\n\n1/ 🧵",
    ]
    
    for i, insight in enumerate(insights[:5], 2):
        # Truncate if too long
        tweet_text = insight[:250] if len(insight) > 250 else insight
        tweets.append(f"{i}/ {tweet_text}")
    
    tweets.append(f"{len(insights)+2}/ This is exactly the kind of deep analysis that shapes how I think about building AI products.\n\n{len(insights)+3}/ What content creators are you learning from? 👇\n\nSource: {video_url}")
    
    return tweets

def generate_reddit_post(title, channel, insights, video_url):
    """Generate Reddit-style post"""
    insights_text = "\n\n".join([f"• {insight}" for insight in insights])
    
    post = f"""[Discussion] {title} - Key insights from {channel}

Just came across this video and wanted to share the key points with the community:

{insights_text}

**My take:** {channel} consistently delivers quality analysis. This video is no exception.

**Questions for the community:**
- What content creators do you follow for industry insights?
- How do you stay updated on AI/SaaS trends?
- What topics should I cover next?

Source: {video_url}"""
    return post

def humanize_text(text, tone="casual"):
    """Run text through humanizer"""
    try:
        result = subprocess.run(
            ['python3', '/home/ubuntu/clawd/skills/humanizer/scripts/humanize.py', text, '--tone', tone],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except:
        pass
    return text

def main():
    if len(sys.argv) < 2:
        print("🎥 ContentClaw - YouTube Content Repurposer")
        print("\nUsage:")
        print("  python3 contentclaw.py <youtube-url>")
        print("\nExample:")
        print("  python3 contentclaw.py 'https://youtube.com/watch?v=...'")
        sys.exit(1)
    
    url = sys.argv[1]
    video_id = extract_video_id(url)
    
    if not video_id:
        print(f"❌ Error: Could not extract video ID from {url}")
        sys.exit(1)
    
    print("🎥 ContentClaw Activated (YouTube Data API v3)")
    print(f"📹 Video ID: {video_id}")
    print(f"🔗 URL: {url}\n")
    
    # Get video details via API
    print("📡 Fetching video details via YouTube Data API...")
    details = get_video_details(video_id)
    
    if not details:
        print("❌ Failed to fetch video details. Check API key or video ID.")
        sys.exit(1)
    
    print(f"✅ Video found: {details['title']}")
    print(f"📺 Channel: {details['channel']}")
    print(f"👁️  Views: {details['view_count']}")
    print(f"👍 Likes: {details['like_count']}\n")
    
    # Check for captions
    print("📜 Checking for captions...")
    captions = get_captions_list(video_id)
    if captions:
        print(f"✅ Found {len(captions)} caption track(s)")
        # Note: Downloading captions requires OAuth, not just API key
        print("💡 Note: Caption download requires OAuth. Using description for now.")
    else:
        print("⚠️  No captions available. Using description + tags.")
    
    # Extract insights
    print("🧠 Extracting key insights...\n")
    insights = extract_key_insights(
        details['description'],
        details['title'],
        details['tags']
    )
    
    # Generate posts
    print("✍️ Repurposing content for 3 platforms...\n")
    
    linkedin = generate_linkedin_post(
        details['title'],
        details['channel'],
        insights,
        url,
        details['view_count']
    )
    
    thread = generate_x_thread(
        details['title'],
        details['channel'],
        insights,
        url
    )
    
    reddit = generate_reddit_post(
        details['title'],
        details['channel'],
        insights,
        url
    )
    
    # Humanize
    print("🎨 Humanizing tone...")
    linkedin = humanize_text(linkedin, "professional")
    reddit = humanize_text(reddit, "casual")
    
    # Output
    print("\n" + "=" * 60)
    print("💼 LINKEDIN POST (Professional)")
    print("=" * 60)
    print(linkedin)
    print("\n")
    
    print("=" * 60)
    print("🐦 X THREAD (Punchy)")
    print("=" * 60)
    for i, tweet in enumerate(thread, 1):
        print(f"\n--- Tweet {i} ---")
        print(tweet[:280] if len(tweet) > 280 else tweet)
    print("\n")
    
    print("=" * 60)
    print("🔴 REDDIT POST (Discussion)")
    print("=" * 60)
    print(reddit)
    print("\n")
    
    # Save to file
    output = {
        "date": datetime.now().isoformat(),
        "video_url": url,
        "video_id": video_id,
        "title": details['title'],
        "channel": details['channel'],
        "insights": insights,
        "view_count": details['view_count'],
        "like_count": details['like_count'],
        "linkedin": linkedin,
        "x_thread": thread,
        "reddit": reddit,
        "status": "draft"
    }
    
    filename = f"/home/ubuntu/clawd/agents/contentclaw/memory/content_{video_id}_{datetime.now().strftime('%Y%m%d')}.json"
    with open(filename, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"💾 Saved to: {filename}")
    print("\n✅ ContentClaw mission complete!")
    print("📋 Next: Copy posts above and paste into LinkedIn/X/Reddit")

if __name__ == "__main__":
    main()
