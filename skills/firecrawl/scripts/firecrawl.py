#!/usr/bin/env python3
"""
firecrawl: Web scraping with clean markdown output using Firecrawl API
"""
import os
import sys
import json
import time
import argparse
from pathlib import Path
from urllib.parse import urljoin, urlparse

# Try to load from .env file
env_file = Path.home() / ".clawdbot" / ".env"
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            if line.strip() and not line.startswith('#') and '=' in line:
                key, value = line.strip().split('=', 1)
                os.environ.setdefault(key, value)

API_KEY = os.environ.get('FIRECRAWL_API_KEY')
BASE_URL = "https://api.firecrawl.dev/v1"

def get_headers():
    """Get API headers with auth."""
    if not API_KEY:
        print("Error: FIRECRAWL_API_KEY not set. Add to ~/.clawdbot/.env")
        sys.exit(1)
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

def make_request(url, method="GET", data=None):
    """Make HTTP request with error handling."""
    try:
        import urllib.request
        import urllib.error
        
        req = urllib.request.Request(
            url,
            headers=get_headers(),
            method=method
        )
        
        if data:
            req.data = json.dumps(data).encode('utf-8')
        
        with urllib.request.urlopen(req, timeout=60) as response:
            return json.loads(response.read().decode('utf-8'))
            
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print("Error: Rate limit hit. Waiting 10 seconds...")
            time.sleep(10)
            return make_request(url, method, data)
        elif e.code == 401:
            print("Error: Invalid API key")
        elif e.code == 404:
            print(f"Error: URL not found or blocked")
        else:
            print(f"Error: HTTP {e.code} - {e.reason}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def scrape_url(url, formats=None):
    """
    Scrape a single URL and return clean content.
    
    Args:
        url: The URL to scrape
        formats: List of formats to return (default: ["markdown"])
    """
    if formats is None:
        formats = ["markdown"]
    
    api_url = f"{BASE_URL}/scrape"
    data = {
        "url": url,
        "formats": formats
    }
    
    print(f"Scraping: {url}")
    result = make_request(api_url, method="POST", data=data)
    
    if not result or not result.get("success"):
        print(f"Failed to scrape {url}")
        if result and "error" in result:
            print(f"Error: {result['error']}")
        return None
    
    return result.get("data", {})

def crawl_domain(url, limit=100, scrape_options=None):
    """
    Crawl an entire domain and map all pages.
    
    Args:
        url: The starting URL (domain will be extracted)
        limit: Max pages to crawl (default: 100)
        scrape_options: Additional scrape options
    """
    # Extract domain from URL
    parsed = urlparse(url)
    domain = f"{parsed.scheme}://{parsed.netloc}"
    
    api_url = f"{BASE_URL}/crawl"
    data = {
        "url": url,
        "limit": limit,
        "scrapeOptions": scrape_options or {"formats": ["markdown"]}
    }
    
    print(f"Starting crawl of {domain}")
    print(f"Max pages: {limit}")
    
    result = make_request(api_url, method="POST", data=data)
    
    if not result or not result.get("success"):
        print("Failed to start crawl")
        if result and "error" in result:
            print(f"Error: {result['error']}")
        return None
    
    job_id = result.get("id")
    if not job_id:
        print("No job ID returned")
        return None
    
    print(f"Crawl job started: {job_id}")
    return poll_crawl_status(job_id)

def poll_crawl_status(job_id):
    """Poll for crawl completion."""
    status_url = f"{BASE_URL}/crawl/{job_id}"
    
    print("Polling for results (this may take a while)...")
    max_attempts = 60  # 5 minutes max
    
    for attempt in range(max_attempts):
        result = make_request(status_url)
        
        if not result:
            print("Failed to check status")
            return None
        
        status = result.get("status")
        
        if status == "completed":
            print(f"Crawl complete! Found {result.get('total', 0)} pages")
            return result.get("data", [])
        elif status == "failed":
            print(f"Crawl failed: {result.get('error', 'Unknown error')}")
            return None
        elif status == "scraping":
            current = result.get("current", 0)
            total = result.get("total", "?")
            print(f"  Progress: {current}/{total} pages...")
        
        time.sleep(5)
    
    print("Crawl timed out")
    return None

def extract_data(url, prompt=None, schema=None):
    """
    Extract specific data from a page using LLM.
    
    Args:
        url: The URL to extract from
        prompt: What to extract (e.g., "Extract all product prices")
        schema: Optional JSON schema for structured output
    """
    api_url = f"{BASE_URL}/extract"
    data = {"url": url}
    
    if prompt:
        data["prompt"] = prompt
    if schema:
        data["schema"] = schema
    
    print(f"Extracting from: {url}")
    if prompt:
        print(f"Prompt: {prompt}")
    
    result = make_request(api_url, method="POST", data=data)
    
    if not result or not result.get("success"):
        print("Extraction failed")
        if result and "error" in result:
            print(f"Error: {result['error']}")
        return None
    
    return result.get("data", {})

def save_output(data, filename=None, url=None):
    """Save output to file."""
    if not filename and url:
        # Generate filename from URL
        parsed = urlparse(url)
        domain = parsed.netloc.replace(".", "_")
        path = parsed.path.strip("/").replace("/", "_") or "index"
        filename = f"{domain}_{path}.md"
    
    if not filename:
        filename = "output.md"
    
    # Ensure .md extension
    if not filename.endswith(".md"):
        filename += ".md"
    
    output_dir = Path("/home/ubuntu/clawd/scrapes")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / filename
    
    if isinstance(data, list):
        # Multiple pages (crawl result)
        with open(output_path, 'w') as f:
            for page in data:
                f.write(f"# {page.get('metadata', {}).get('title', 'Untitled')}\n\n")
                f.write(f"URL: {page.get('metadata', {}).get('sourceURL', 'N/A')}\n\n")
                f.write(page.get('markdown', '') or page.get('content', ''))
                f.write("\n\n---\n\n")
    elif isinstance(data, dict):
        # Single page
        with open(output_path, 'w') as f:
            if "markdown" in data:
                f.write(data["markdown"])
            elif "content" in data:
                f.write(data["content"])
            elif "llm_extraction" in data:
                f.write(json.dumps(data["llm_extraction"], indent=2))
            else:
                f.write(json.dumps(data, indent=2))
    else:
        with open(output_path, 'w') as f:
            f.write(str(data))
    
    print(f"Saved to: {output_path}")
    return output_path

def main():
    parser = argparse.ArgumentParser(description="Firecrawl Web Scraper")
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Scrape command
    scrape_parser = subparsers.add_parser("scrape", help="Scrape a single URL")
    scrape_parser.add_argument("url", help="URL to scrape")
    scrape_parser.add_argument("-o", "--output", help="Output filename")
    scrape_parser.add_argument("--html", action="store_true", help="Include HTML output")
    
    # Crawl command
    crawl_parser = subparsers.add_parser("crawl", help="Crawl an entire domain")
    crawl_parser.add_argument("url", help="Starting URL")
    crawl_parser.add_argument("-l", "--limit", type=int, default=100, help="Max pages (default: 100)")
    crawl_parser.add_argument("-o", "--output", help="Output filename")
    
    # Extract command
    extract_parser = subparsers.add_parser("extract", help="Extract specific data")
    extract_parser.add_argument("url", help="URL to extract from")
    extract_parser.add_argument("-p", "--prompt", required=True, help="What to extract")
    extract_parser.add_argument("-o", "--output", help="Output filename")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    if args.command == "scrape":
        formats = ["markdown"]
        if args.html:
            formats.append("html")
        
        data = scrape_url(args.url, formats=formats)
        if data:
            # Print markdown to stdout
            if "markdown" in data:
                print("\n" + "="*60)
                print("MARKDOWN OUTPUT:")
                print("="*60 + "\n")
                print(data["markdown"][:5000])  # Limit output
                if len(data["markdown"]) > 5000:
                    print("\n... (truncated)")
            
            # Save full output
            save_output(data, args.output, args.url)
    
    elif args.command == "crawl":
        data = crawl_domain(args.url, limit=args.limit)
        if data:
            print(f"\nCrawled {len(data)} pages")
            save_output(data, args.output, args.url)
    
    elif args.command == "extract":
        data = extract_data(args.url, prompt=args.prompt)
        if data:
            print("\n" + "="*60)
            print("EXTRACTED DATA:")
            print("="*60 + "\n")
            if "llm_extraction" in data:
                print(json.dumps(data["llm_extraction"], indent=2))
            else:
                print(json.dumps(data, indent=2))
            save_output(data, args.output, args.url)

if __name__ == "__main__":
    main()