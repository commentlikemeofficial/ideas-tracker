#!/usr/bin/env python3
"""
tavily-search: AI-optimized web search with citations using Tavily API
"""
import os
import sys
import json
import argparse
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

# Load from .env file
env_file = Path.home() / ".clawdbot" / ".env"
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            if line.strip() and not line.startswith('#') and '=' in line:
                key, value = line.strip().split('=', 1)
                os.environ.setdefault(key, value)

API_KEY = os.environ.get('TAVILY_API_KEY')
BASE_URL = "https://api.tavily.com"

def get_headers():
    """Get API headers."""
    return {
        "Content-Type": "application/json"
    }

def make_request(endpoint, data):
    """Make API request with error handling."""
    if not API_KEY:
        print("Error: TAVILY_API_KEY not set. Add to ~/.clawdbot/.env")
        sys.exit(1)
    
    url = f"{BASE_URL}/{endpoint}"
    data["api_key"] = API_KEY
    
    try:
        req = Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers=get_headers(),
            method="POST"
        )
        
        with urlopen(req, timeout=60) as response:
            return json.loads(response.read().decode('utf-8'))
            
    except HTTPError as e:
        if e.code == 401:
            print("Error: Invalid API key")
        elif e.code == 429:
            print("Error: Rate limit exceeded")
        else:
            try:
                error_body = json.loads(e.read().decode('utf-8'))
                print(f"Error: {error_body.get('detail', e.reason)}")
            except:
                print(f"Error: HTTP {e.code} - {e.reason}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def search(query, search_depth="basic", include_answer=True, max_results=5):
    """
    Perform web search with Tavily.
    
    Args:
        query: Search query
        search_depth: 'basic' or 'advanced'
        include_answer: Include AI-generated answer
        max_results: Number of results (1-20)
    """
    data = {
        "query": query,
        "search_depth": search_depth,
        "include_answer": include_answer,
        "max_results": max_results,
        "include_images": False,
        "include_raw_content": False
    }
    
    return make_request("search", data)

def format_result(result, idx=None):
    """Format a single search result."""
    lines = []
    prefix = f"{idx}. " if idx else "• "
    
    title = result.get('title', 'No title')
    url = result.get('url', '')
    content = result.get('content', '').strip()
    score = result.get('score', 0)
    
    lines.append(f"{prefix}[{title}]({url})")
    if content:
        # Truncate long content
        if len(content) > 300:
            content = content[:300] + "..."
        lines.append(f"   {content}")
    if score:
        lines.append(f"   Score: {score:.2f}")
    
    return "\n".join(lines)

def print_search_results(data, query, show_summary=True):
    """Print formatted search results."""
    if not data:
        return
    
    print(f"\n{'='*60}")
    print(f"🔍 QUERY: {query}")
    print(f"{'='*60}\n")
    
    # AI Answer / Summary
    answer = data.get('answer')
    if answer and show_summary:
        print("📋 SUMMARY:")
        print(f"{answer}\n")
    
    # Results
    results = data.get('results', [])
    if results:
        print(f"📚 SOURCES ({len(results)} found):")
        print()
        
        for i, result in enumerate(results, 1):
            print(format_result(result, i))
            print()
    
    # Response time
    response_time = data.get('response_time')
    if response_time:
        print(f"⏱️  Response time: {response_time:.2f}s")

def quick_search(query):
    """Quick search with basic results."""
    print(f"Searching: {query}")
    data = search(query, search_depth="basic", max_results=5)
    
    if data:
        print_search_results(data, query, show_summary=True)
        return data
    return None

def deep_research(topic):
    """Deep research with advanced search."""
    print(f"Researching: {topic}")
    print("This may take longer (advanced search)...")
    
    data = search(topic, search_depth="advanced", max_results=10)
    
    if data:
        print_search_results(data, topic, show_summary=True)
        
        # Additional context for research
        results = data.get('results', [])
        if len(results) > 5:
            print(f"\n💡 Found {len(results)} sources. Top insights:")
            for i, r in enumerate(results[:3], 1):
                content = r.get('content', '')[:150]
                print(f"   {i}. {content}...")
        
        return data
    return None

def news_search(query):
    """Search for latest news."""
    # Add news context to query
    news_query = f"latest news {query} 2024 2025"
    print(f"Searching latest news: {query}")
    
    data = search(news_query, search_depth="basic", max_results=8)
    
    if data:
        print_search_results(data, news_query, show_summary=True)
        
        # Filter for recent content
        results = data.get('results', [])
        print(f"\n📰 TOP NEWS STORIES:")
        for i, r in enumerate(results[:5], 1):
            title = r.get('title', 'Untitled')
            url = r.get('url', '')
            print(f"   {i}. {title}")
            print(f"      {url}\n")
        
        return data
    return None

def save_results(data, query, output_dir=None):
    """Save search results to file."""
    if output_dir is None:
        output_dir = Path("/home/ubuntu/clawd/research")
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate filename from query
    safe_query = "".join(c if c.isalnum() else "_" for c in query[:50])
    timestamp = json.loads(json.dumps(data)).get('response_time', '')
    filename = f"{safe_query}_{int(__import__('time').time())}.json"
    
    output_path = output_dir / filename
    
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"💾 Results saved to: {output_path}")
    return output_path

def main():
    parser = argparse.ArgumentParser(
        description="Tavily AI Search",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s search "Python async best practices"
  %(prog)s research "microservices architecture patterns"
  %(prog)s news "AI developments"
  %(prog)s search "AWS Lambda limits" --save
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Quick web search")
    search_parser.add_argument("query", help="Search query")
    search_parser.add_argument("--max", type=int, default=5, help="Max results (1-20)")
    search_parser.add_argument("--save", action="store_true", help="Save results to file")
    
    # Research command
    research_parser = subparsers.add_parser("research", help="Deep research with multiple sources")
    research_parser.add_argument("topic", help="Research topic")
    research_parser.add_argument("--max", type=int, default=10, help="Max results (1-20)")
    research_parser.add_argument("--save", action="store_true", help="Save results to file")
    
    # News command
    news_parser = subparsers.add_parser("news", help="Latest news on topic")
    news_parser.add_argument("query", help="News topic")
    news_parser.add_argument("--max", type=int, default=8, help="Max results")
    news_parser.add_argument("--save", action="store_true", help="Save results to file")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    result = None
    
    if args.command == "search":
        result = quick_search(args.query)
        if result and args.save:
            save_results(result, args.query)
    
    elif args.command == "research":
        result = deep_research(args.topic)
        if result and args.save:
            save_results(result, args.topic)
    
    elif args.command == "news":
        result = news_search(args.query)
        if result and args.save:
            save_results(result, f"news_{args.query}")

if __name__ == "__main__":
    main()