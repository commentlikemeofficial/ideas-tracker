# Tech Architect Assignment - 2026-02-04

## Mission
Design the technical architecture for IntentSignal before AI Developer builds it.

## Project: IntentSignal
LinkedIn B2B Intent Monitoring Tool

## Deliverables

### 1. System Architecture Diagram
Create blueprint covering:
- Data flow (LinkedIn → Scraper → Classifier → Database → Alerts)
- Component interactions
- API endpoints needed

### 2. Database Schema
Design Supabase tables:
```sql
-- companies (target accounts)
-- signals (detected intent signals)
-- alerts (notification log)
-- users (team members)
-- subscriptions (billing)
```

### 3. Scraping Strategy
- Playwright vs API approach
- Rate limiting considerations
- Anti-detection measures
- Data extraction patterns

### 4. Signal Classification
- Intent scoring algorithm
- LLM prompts for classification
- Confidence thresholds

### 5. Alert Logic
- Real-time vs batch processing
- Email/Slack integration design
- Filtering and deduplication

## Output
Save to: `/home/ubuntu/clawd/agents/tech-architect/blueprints/intentsignal-architecture.md`

## Priority
🔴 HIGH - Blocker for AI Developer. Complete within 24 hours.
