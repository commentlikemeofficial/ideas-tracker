# Tavily Search

AI-optimized web search with citations. Get answers, not just links.

## Setup

### 1. Get API Key

Sign up at [tavily.com](https://tavily.com) and get your API key.

### 2. Configure

Add to `~/.clawdbot/.env`:

```bash
TAVILY_API_KEY=tvly-dev-your-key-here
```

Or export directly:

```bash
export TAVILY_API_KEY=tvly-dev-your-key-here
```

### 3. Test

```bash
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "Python best practices"
```

## Commands

### search — Quick web search

```bash
# Basic search
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "Docker compose tutorial"

# More results
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "Kubernetes patterns" --max 10

# Save to file
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "AWS Lambda limits" --save
```

**Output:**
- AI-generated summary (2-3 sentences)
- List of sources with URLs
- Confidence scores
- Response time

### research — Deep research

```bash
# Thorough research on topic
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py research "microservices architecture"

# Save comprehensive results
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py research "graph databases comparison" --save
```

Uses advanced search depth for more comprehensive results.

### news — Latest news

```bash
# Recent news on topic
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py news "AI developments"

# Industry specific
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py news "tech layoffs 2024"
```

Optimized for recent content and news sources.

## Example Queries

### Development

```bash
# Best practices
python3 scripts/tavily.py search "Python async/await best practices"

# Comparisons
python3 scripts/tavily.py research "PostgreSQL vs MongoDB performance"

# Tutorials
python3 scripts/tavily.py search "Docker multi-stage builds tutorial"
```

### DevOps & Cloud

```bash
# Infrastructure
python3 scripts/tavily.py research "Terraform vs Pulumi 2024"

# Kubernetes
python3 scripts/tavily.py search "Kubernetes operators explained"

# AWS
python3 scripts/tavily.py search "AWS ECS vs EKS when to use"
```

### AI & ML

```bash
# Latest models
python3 scripts/tavily.py news "Claude 3.5 capabilities"

# Frameworks
python3 scripts/tavily.py research "LangChain vs LlamaIndex"

# Tools
python3 scripts/tavily.py search "vector databases comparison"
```

### Business & Product

```bash
# Market research
python3 scripts/tavily.py research "SaaS pricing strategies"

# Trends
python3 scripts/tavily.py news "AI startup funding 2024"

# Competition
python3 scripts/tavily.py search "Notion alternatives open source"
```

## Output Format

```
============================================================
🔍 QUERY: Python async best practices
============================================================

📋 SUMMARY:
Python's async/await syntax enables concurrent I/O operations. Best 
practices include using asyncio.gather for parallel tasks, avoiding 
blocking calls in async functions, and using async context managers...

📚 SOURCES (5 found):

1. [Async IO in Python: A Complete Walkthrough - Real Python](https://realpython.com/async-io-python/)
   A comprehensive guide to Python's asyncio library and async/await...
   Score: 0.95

2. [Python Asyncio: The Complete Tutorial - SuperFastPython](https://superfastpython.com/asyncio-tutorial/)
   Learn how to use asyncio for asynchronous programming...
   Score: 0.91

⏱️  Response time: 2.34s
```

## Saved Results

Use `--save` to store results:

```bash
python3 scripts/tavily.py research "serverless patterns" --save
```

Saved to: `/home/ubuntu/clawd/research/`

Files are JSON with full results, sources, and metadata.

## Rate Limits

- Free tier: 1,000 API calls/month
- Paid tiers: Higher limits available

Each command = 1 API call.

## Tips

1. **Use quotes** for exact phrases: `"machine learning"`
2. **Be specific** for better results: "Python pandas merge dataframes"
3. **Use research** for comprehensive answers
4. **Use news** for time-sensitive queries
5. **Save results** for reference or documentation

## Differences from Regular Search

| Feature | Tavily | Google/Bing |
|---------|--------|-------------|
| AI Summary | ✅ Built-in | ❌ Manual |
| Citations | ✅ Automatic | ❌ Manual |
| Confidence | ✅ Score per source | ❌ No score |
| Optimized for LLMs | ✅ Yes | ❌ No |
| Context awareness | ✅ Better | ❌ Basic |

## Troubleshooting

**"Error: TAVILY_API_KEY not set"**
→ Add key to `~/.clawdbot/.env`

**"Error: Rate limit exceeded"**
→ Free tier limit reached. Wait or upgrade.

**"Error: Invalid API key"**
→ Check key at tavily.com dashboard

## Links

- [Tavily](https://tavily.com)
- [API Docs](https://docs.tavily.com)