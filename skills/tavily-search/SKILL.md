---
name: tavily-search
description: AI-optimized web search with citations using Tavily API. Search the web with AI-generated summaries and source attribution. Use when needing researched answers with sources, quick fact-checking, or comprehensive topic research without manual browsing.
---

# Tavily Search

Search the web with AI. Get answers + sources, not just links.

## Quick Start

```bash
# Quick search with summary
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "Python best practices"

# Deep research
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py research "microservices patterns"

# Latest news
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py news "AI developments"
```

## Setup

1. Get API key: [tavily.com](https://tavily.com)
2. Add to `~/.clawdbot/.env`:
   ```
   TAVILY_API_KEY=your-key-here
   ```

## Commands

### search

Quick search with AI summary (2-3 sentences) + sources.

```bash
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "query"
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "query" --max 10
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "query" --save
```

### research

Deep research with advanced search depth + more sources.

```bash
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py research "topic"
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py research "topic" --save
```

### news

Latest news on topic (optimized for recency).

```bash
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py news "topic"
```

## Output

- **📋 Summary**: AI-generated 2-3 sentence answer
- **📚 Sources**: List with URLs, snippets, confidence scores
- **⏱️ Response time**: How long the search took

## Features

- ✅ AI-optimized results (better than raw Google/Bing)
- ✅ Automatic citations with URLs
- ✅ Confidence scores per source
- ✅ Summarized findings
- ✅ Built for LLM context (clean, structured)

## Saved Results

Use `--save` to store JSON results in `/home/ubuntu/clawd/research/`

## When to Use

| Use Case | Command |
|----------|---------|
| Quick fact check | `search` |
| Learn a topic | `research` |
| Stay updated | `news` |
| Build documentation | `research --save` |
| Verify claims | `search` with multiple queries |

## vs Other Search

| | Tavily | Regular Search |
|--|--------|----------------|
| AI summary | ✅ Auto | ❌ Manual |
| Citations | ✅ Auto | ❌ Manual |
| Confidence | ✅ Score | ❌ None |
| Optimized for AI | ✅ Yes | ❌ No |

## See Also

- [README.md](README.md) - Full documentation with examples
- [references/examples.md](references/examples.md) - Query patterns