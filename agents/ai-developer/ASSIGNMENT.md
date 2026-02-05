# AI Developer Assignment - 2026-02-04

## Mission
Start building IntentSignal MVP - LinkedIn B2B Intent Monitoring Tool

## Background
IntentSignal monitors LinkedIn for high-intent B2B signals (job changes, funding news, hiring posts) and alerts sales teams to reach out at the perfect moment.

## MVP Scope (Week 1)

### Phase 1: Core Monitoring Engine
- [ ] Set up project structure (Next.js + Supabase)
- [ ] Create LinkedIn scraper (playwright-based)
- [ ] Build signal detection algorithm
  - Job change posts
  - "We're hiring" posts
  - Funding announcements
  - Pain point mentions

### Phase 2: Alert System
- [ ] Email notification system
- [ ] Slack webhook integration
- [ ] Dashboard for viewing signals

### Phase 3: Targeting
- [ ] Company filter (by size, industry)
- [ ] Role-based targeting
- [ ] Keyword-based intent scoring

## Tech Stack
- Frontend: Next.js 14 (App Router)
- Backend: Supabase (PostgreSQL + Auth)
- Scraping: Playwright
- AI: OpenAI API for signal classification
- Hosting: Vercel (free tier)

## Output
- Working MVP deployed to Vercel
- GitHub repo with clean code
- README with setup instructions

## Start Here
```bash
cd /home/ubuntu/clawd/agents/ai-developer/projects
mkdir intentsignal
cd intentsignal
npx create-next-app@latest . --typescript --tailwind --app
```

**Priority: HIGH** - This is the #1 roadmap item per ByteRover context.
