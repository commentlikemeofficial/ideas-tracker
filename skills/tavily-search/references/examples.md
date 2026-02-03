# Tavily Search Examples

## Development Queries

### Language Best Practices
```bash
python3 scripts/tavily.py search "Python type hints best practices 2024"
python3 scripts/tavily.py research "Rust vs Go for backend services"
python3 scripts/tavily.py search "JavaScript async await common mistakes"
```

### Frameworks
```bash
python3 scripts/tavily.py search "FastAPI vs Flask performance"
python3 scripts/tavily.py research "React server components explained"
python3 scripts/tavily.py search "Django ORM optimization techniques"
```

### Databases
```bash
python3 scripts/tavily.py research "PostgreSQL indexing strategies"
python3 scripts/tavily.py search "Redis use cases caching patterns"
python3 scripts/tavily.py research "MongoDB vs PostgreSQL for SaaS"
```

## DevOps & Infrastructure

### Containers
```bash
python3 scripts/tavily.py search "Docker best practices production"
python3 scripts/tavily.py research "Kubernetes deployment patterns"
python3 scripts/tavily.py search "Docker Compose vs Kubernetes"
```

### Cloud
```bash
python3 scripts/tavily.py research "AWS Lambda cold start optimization"
python3 scripts/tavily.py search "Terraform state management best practices"
python3 scripts/tavily.py research "Multi-cloud vs single cloud 2024"
```

### CI/CD
```bash
python3 scripts/tavily.py search "GitHub Actions vs GitLab CI"
python3 scripts/tavily.py research "trunk based development vs git flow"
```

## AI & Machine Learning

### Models
```bash
python3 scripts/tavily.py news "Claude 3.5 Sonnet capabilities"
python3 scripts/tavily.py search "GPT-4 vs Claude 3 comparison"
python3 scripts/tavily.py research "open source LLMs 2024 leaderboard"
```

### Tools
```bash
python3 scripts/tavily.py search "LangChain alternatives 2024"
python3 scripts/tavily.py research "vector databases comparison"
python3 scripts/tavily.py search "RAG implementation best practices"
```

### Techniques
```bash
python3 scripts/tavily.py research "prompt engineering patterns"
python3 scripts/tavily.py search "fine-tuning vs RAG when to use"
```

## Business & Product

### SaaS
```bash
python3 scripts/tavily.py research "SaaS pricing models that work"
python3 scripts/tavily.py search "freemium vs free trial conversion"
python3 scripts/tavily.py research "product-led growth strategies"
```

### Markets
```bash
python3 scripts/tavily.py news "AI startup funding winter 2024"
python3 scripts/tavily.py research "B2B SaaS marketing channels"
```

### Tools
```bash
python3 scripts/tavily.py search "Notion alternatives open source"
python3 scripts/tavily.py research "best auth providers for SaaS"
```

## Research Patterns

### Comparison
```bash
python3 scripts/tavily.py research "X vs Y comparison"
python3 scripts/tavily.py research "X vs Y vs Z features"
```

### How-to
```bash
python3 scripts/tavily.py search "how to X in Python"
python3 scripts/tavily.py search "tutorial: deploy X to Y"
```

### Troubleshooting
```bash
python3 scripts/tavily.py search "X error: common causes"
python3 scripts/tavily.py search "fix X issue in production"
```

### Trends
```bash
python3 scripts/tavily.py news "X framework latest version"
python3 scripts/tavily.py news "X technology trends 2024"
```

## Tips

1. **Be specific**: "Python pandas groupby tutorial" > "pandas help"
2. **Include year**: "best practices 2024" for recent info
3. **Use research for depth**: Complex topics need `research`, not `search`
4. **Use news for recency**: Time-sensitive queries
5. **Save important results**: `--save` for documentation building