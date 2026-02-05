#!/usr/bin/env python3
"""
Scout - AI Product & SaaS Research Cycle
Run every 6 hours via cron or heartbeat
"""
import json
import os
import sys
import subprocess
import re
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path

MEMORY_DIR = Path("/home/ubuntu/clawd/agents/saas-research/memory")

def run_reddit_cli(subreddit, limit=15):
    """Run reddit-cli to get posts from a subreddit"""
    try:
        result = subprocess.run(
            ["reddit-cli", "posts", subreddit, str(limit), "hot"],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except Exception as e:
        return ""

def fetch_hackernews():
    """Fetch top stories from Hacker News"""
    try:
        # Get top story IDs
        req = urllib.request.Request(
            "https://hacker-news.firebaseio.com/v0/topstories.json",
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            story_ids = json.loads(response.read().decode())[:20]
        
        stories = []
        for story_id in story_ids:
            try:
                req = urllib.request.Request(
                    f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json",
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                with urllib.request.urlopen(req, timeout=5) as response:
                    story = json.loads(response.read().decode())
                    if story and story.get('title'):
                        stories.append({
                            'title': story.get('title', ''),
                            'score': story.get('score', 0),
                            'comments': story.get('descendants', 0),
                            'url': story.get('url', '')
                        })
            except:
                continue
        return stories
    except Exception as e:
        print(f"Error fetching HN: {e}")
        return []

def fetch_indiehackers():
    """Fetch posts from Indie Hackers (simplified)"""
    # Since IH requires auth, we'll use a placeholder approach
    # In production, this could use their API or RSS feeds
    return []

def analyze_opportunities_from_reddit(raw_text):
    """Extract potential SaaS opportunities from Reddit posts"""
    opportunities = []
    
    # Pain point keywords
    pain_patterns = [
        r"(struggling with|struggle with|hard to|difficult to|pain|painful|frustrated|annoying)",
        r"(looking for|need|want|wish there was|would pay for|any tool that)",
        r"(currently using|switched from|tried|workaround|hack|manual process)",
        r"(expensive|costs too much|can't afford|overpriced|cheaper alternative)",
        r"(time consuming|takes forever|so slow|wastes time)",
        r"(AI|automation|automatic|sync|integrate|workflow|API)",
    ]
    
    posts = re.split(r'\n(?=\d+\.)', raw_text)
    
    for post in posts:
        if not post.strip():
            continue
            
        title_match = re.search(r'^\d+\.\s*(.+?)(?:\n|$)', post)
        content_match = re.search(r'📝\s*(.+?)(?:\n|$)', post, re.DOTALL)
        upvotes_match = re.search(r'⬆️\s*(\d+)', post)
        comments_match = re.search(r'💬\s*(\d+)', post)
        
        title = title_match.group(1).strip() if title_match else ""
        content = content_match.group(1).strip() if content_match else ""
        upvotes = int(upvotes_match.group(1)) if upvotes_match else 0
        comments = int(comments_match.group(1)) if comments_match else 0
        
        full_text = f"{title} {content}".lower()
        
        # Skip low-value posts
        skip_keywords = ['$1m', '$10m', 'million', 'exit', 'sold my', 'i made', 
                        'how i', 'journey', 'launched my', 'show hn']
        if any(kw in full_text for kw in skip_keywords):
            continue
            
        # Check for pain points
        pain_score = 0
        evidence = []
        
        for pattern in pain_patterns:
            matches = re.findall(pattern, full_text, re.IGNORECASE)
            pain_score += len(matches)
            if matches:
                for match in matches[:2]:
                    if isinstance(match, tuple):
                        match = match[0]
                    idx = full_text.lower().find(match.lower())
                    if idx >= 0:
                        context = full_text[max(0, idx-30):min(len(full_text), idx+50)]
                        evidence.append(f"\"...{context}...\"")
        
        engagement = upvotes + (comments * 3)
        
        if engagement >= 10 and pain_score >= 2:
            opportunities.append({
                'title': title[:120],
                'content': content[:300] if len(content) > 300 else content,
                'upvotes': upvotes,
                'comments': comments,
                'engagement': engagement,
                'pain_score': pain_score,
                'evidence': evidence[:3],
                'raw_text': full_text
            })
    
    return opportunities

def analyze_opportunities_from_hn(stories):
    """Extract potential SaaS opportunities from HN stories"""
    opportunities = []
    
    # Keywords indicating opportunities
    opportunity_keywords = [
        'show hn', 'launch', 'beta', 'saas', 'ai ', 'automation', 
        'workflow', 'tool for', 'app for', 'platform', 'service'
    ]
    
    pain_keywords = [
        'problem', 'pain', 'struggle', 'difficult', 'frustrating',
        'time-consuming', 'manual', 'expensive', 'workaround'
    ]
    
    for story in stories:
        title = story.get('title', '').lower()
        score = story.get('score', 0)
        comments = story.get('comments', 0)
        
        # Check if it's a potential opportunity
        opp_score = 0
        factors = []
        
        for kw in opportunity_keywords:
            if kw in title:
                opp_score += 1
                factors.append(f"Keyword: {kw}")
        
        for kw in pain_keywords:
            if kw in title:
                opp_score += 2
                factors.append(f"Pain point: {kw}")
        
        engagement = score + (comments * 2)
        
        # Consider if it has decent engagement and opportunity signals
        if engagement >= 50 and opp_score >= 2:
            opportunities.append({
                'title': story['title'][:120],
                'content': f"URL: {story.get('url', '')}",
                'upvotes': score,
                'comments': comments,
                'engagement': engagement,
                'pain_score': opp_score,
                'evidence': factors[:3],
                'raw_text': title
            })
    
    return opportunities

def score_opportunity(opp):
    """Score opportunity using matrix"""
    score = 0
    factors = []
    
    # Engagement (0-3 points)
    engagement = opp.get('engagement', 0)
    if engagement >= 100:
        score += 3
        factors.append("High engagement (100+)")
    elif engagement >= 50:
        score += 2
        factors.append("Good engagement (50+)")
    elif engagement >= 20:
        score += 1
        factors.append("Some engagement (20+)")
    
    # Pain intensity (0-3 points)
    pain_score = opp.get('pain_score', 0)
    if pain_score >= 4:
        score += 3
        factors.append("Strong pain signals")
    elif pain_score >= 3:
        score += 2
        factors.append("Clear pain signals")
    else:
        score += 1
        factors.append("Some pain mentioned")
    
    # AI/SaaS fit (0-2 points)
    ai_keywords = ['ai', 'automation', 'automatic', 'workflow', 'api', 'integrate', 'sync', 'saas']
    raw_text = opp.get('raw_text', '')
    if any(kw in raw_text for kw in ai_keywords):
        score += 2
        factors.append("AI/automation fit")
    
    # Willingness to pay (0-2 points)
    pay_keywords = ['pay', 'buy', 'purchase', 'expensive', 'cost', 'budget', 'worth it', 'would pay']
    if any(kw in raw_text for kw in pay_keywords):
        score += 2
        factors.append("Payment intent mentioned")
    
    return score, factors

def generate_recommendation(score, factors, title):
    """Generate actionable recommendation"""
    if score >= 7:
        return "🎯 HIGH PRIORITY: Strong signal. Validate immediately with landing page."
    elif score >= 5:
        return "✅ VALIDATE: Good opportunity. Research competitors and build MVP."
    elif score >= 3:
        return "📊 MONITOR: Some potential. Watch for more signals."
    else:
        return "⏭️ SKIP: Low confidence. Not enough validation."

def log_findings(findings, source_info=""):
    """Log research findings to memory"""
    today = datetime.now().strftime("%Y-%m-%d")
    log_file = MEMORY_DIR / f"research-{today}.md"
    
    timestamp = datetime.now().strftime("%H:%M")
    
    with open(log_file, "a") as f:
        f.write(f"\n## Research Cycle - {timestamp}\n\n")
        if source_info:
            f.write(f"**Data Source:** {source_info}\n\n")
        
        if not findings:
            f.write("No high-value opportunities identified in this cycle.\n\n")
            return
            
        for finding in findings:
            f.write(f"### {finding['name']} (Score: {finding['score']}/10)\n")
            f.write(f"**Source:** {finding['source']}\n\n")
            f.write(f"**Problem/Opportunity:** {finding['problem']}\n\n")
            if finding.get('upvotes'):
                f.write(f"**Engagement:** {finding['upvotes']} upvotes, {finding['comments']} comments\n\n")
            f.write(f"**Scoring Factors:**\n")
            for factor in finding['factors']:
                f.write(f"- {factor}\n")
            f.write(f"\n**Evidence:**\n")
            for ev in finding['evidence']:
                f.write(f"> {ev}\n\n")
            f.write(f"**Recommendation:** {finding['recommendation']}\n\n")
            f.write(f"---\n\n")

def main():
    """Main research cycle"""
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)
    
    print("🔍 Scout research cycle starting...")
    
    all_opportunities = []
    source_info = ""
    
    # Try Reddit first
    subreddits = ['SaaS', 'Entrepreneur', 'startups', 'smallbusiness']
    reddit_available = False
    
    for subreddit in subreddits:
        print(f"  📡 Scraping r/{subreddit}...")
        raw_data = run_reddit_cli(subreddit, limit=20)
        
        if raw_data and len(raw_data) > 100 and "Error" not in raw_data:
            reddit_available = True
            opps = analyze_opportunities_from_reddit(raw_data)
            for opp in opps:
                opp['source'] = f"r/{subreddit}"
            all_opportunities.extend(opps)
    
    # If Reddit unavailable, use Hacker News
    if not reddit_available or not all_opportunities:
        print("  📰 Using Hacker News fallback...")
        source_info = "Hacker News (Reddit unavailable - auth required)"
        hn_stories = fetch_hackernews()
        if hn_stories:
            opps = analyze_opportunities_from_hn(hn_stories)
            for opp in opps:
                opp['source'] = 'Hacker News'
            all_opportunities.extend(opps)
    else:
        source_info = "Reddit"
    
    if not all_opportunities:
        print("⚠️ No opportunities found in this cycle")
        log_findings([], source_info)
        return 0
    
    # Score and rank opportunities
    scored_opps = []
    for opp in all_opportunities:
        score, factors = score_opportunity(opp)
        scored_opps.append({
            **opp,
            'score': score,
            'factors': factors
        })
    
    # Sort by score descending
    scored_opps.sort(key=lambda x: x['score'], reverse=True)
    
    # Take top 5
    top_opps = scored_opps[:5]
    
    # Format findings
    findings = []
    for opp in top_opps:
        findings.append({
            'name': opp['title'][:80],
            'source': opp['source'],
            'problem': opp.get('content', opp['title'])[:200],
            'score': opp['score'],
            'upvotes': opp.get('upvotes', 0),
            'comments': opp.get('comments', 0),
            'factors': opp['factors'],
            'evidence': opp.get('evidence', ["Opportunity identified"]),
            'recommendation': generate_recommendation(opp['score'], opp['factors'], opp['title'])
        })
    
    # Log findings
    log_findings(findings, source_info)
    
    # Output summary
    print(f"\n📊 Research Summary:")
    print(f"   Source: {source_info}")
    print(f"   Analyzed {len(all_opportunities)} potential opportunities")
    print(f"   Top {len(findings)} logged to memory\n")
    
    for f in findings:
        print(f"   [{f['score']}/10] {f['name'][:60]}...")
    
    # High-value alert check
    high_value = [f for f in findings if f['score'] >= 7]
    if high_value:
        print(f"\n🚨 HIGH-VALUE OPPORTUNITIES DETECTED: {len(high_value)}")
        for hv in high_value:
            print(f"   → {hv['name']}")
        return 1  # Signal to caller that escalation needed
    
    print("\n✅ Research cycle complete")
    return 0

if __name__ == "__main__":
    sys.exit(main())
