---
name: firecrawl
description: Web scraping and content extraction using Firecrawl API. Scrape single pages, crawl entire domains, or extract specific data from websites. Use when needing clean markdown from web pages, mapping website structure, or extracting structured data without dealing with complex scraping logic.
---

# Firecrawl

Clean web scraping without the headache. Single pages, full crawls, or structured extraction.

## Setup

API key stored in: `~/.clawdbot/.env`

```bash
# Set your API key
echo 'FIRECRAWL_API_KEY=fc-f2d4db94d0224789940304d7fdbe9bb0' > ~/.clawdbot/.env
```

Get a key at: https://firecrawl.dev

## Commands

### scrape — Single page extraction

```bash
# Extract clean markdown
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py scrape https://example.com

# Include HTML
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py scrape https://example.com --html

# Save to file
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py scrape https://example.com -o mypage.md
```

Output:
- Prints markdown to stdout
- Saves full content to `/home/ubuntu/clawd/scrapes/`

### crawl — Full website crawl

```bash
# Crawl up to 100 pages (default)
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py crawl https://example.com

# Custom page limit
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py crawl https://example.com --limit 50

# Save output
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py crawl https://example.com -o sitemap.md
```

Output:
- Crawls all discoverable pages
- Polls until complete
- Saves all pages to single markdown file

### extract — Structured data extraction

```bash
# Extract specific info
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py extract \
  https://example.com/products \
  --prompt "Extract all product names and prices"

# Extract with schema (structured JSON)
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py extract \
  https://example.com/article \
  --prompt "Extract author, publish date, and main topics"
```

Output:
- LLM-extracted structured data
- JSON format
- Saved to `/home/ubuntu/clawd/scrapes/`

## Error Handling

| Error | Handling |
|-------|----------|
| Rate limit (429) | Auto-retry after 10s |
| Invalid API key (401) | Clear error message |
| Not found (404) | Reports blocked/missing URL |
| Timeout | 60s timeout, graceful failure |
| Crawl timeout | Polls up to 5 minutes |

## Output Location

All scraped content saved to:
```
/home/ubuntu/clawd/scrapes/
```

Filenames auto-generated from URL:
- `example.com_index.md`
- `docs.example.com_api_reference.md`

## Use Cases

**Documentation:**
```bash
# Scrape API docs for local reference
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py scrape \
  https://docs.firecrawl.dev/api-reference -o firecrawl_api.md
```

**Research:**
```bash
# Crawl competitor pricing pages
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py crawl \
  https://competitor.com/pricing --limit 20
```

**Data extraction:**
```bash
# Extract structured data from article
python3 /home/ubuntu/clawd/skills/firecrawl/scripts/firecrawl.py extract \
  https://blog.example.com/post \
  --prompt "Extract: author, date, summary, key points"
```

## Rate Limits

Free tier: 500 credits/month (~500 pages)
Paid tier: Higher limits

Crawls consume credits per page scraped.

## Tips

- Use `--limit` on crawls to control credit usage
- Start with `scrape` to test on single page
- Use `extract` for structured data instead of parsing HTML
- Saved files include metadata (title, URL) as headers

## API Reference

See Firecrawl docs: https://docs.firecrawl.dev