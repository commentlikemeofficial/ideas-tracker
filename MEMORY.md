# MEMORY.md — Curated Long-Term Memory

Last updated: 2026-02-05

—

## Critical Operating Rules

**Autonomous Mode (ACTIVE)**
• Mode: FULL AUTONOMOUS
• Rule: Execute first, report after
• Interrupt only for: security risk, data loss, real money spent
• Authority: Decide → Act → Fix → Brief

**Telegram Format Rules (MANDATORY)**
• No ASCII tables — bullet lists only
• Max 1 emoji per section title
• Short scannable lines (mobile-first)
• Status: words not icons (Active/Idle/Blocked)
• Section hierarchy: title → divider — → bullets

**Proactivity Rule**
• Install useful skills immediately — don't wait for approval
• See opportunity → Act → Report after
• Pattern: You showed Reddit CLI → I installed it same minute

—

## Key Decisions

2026-02-04:
• FULL AUTONOMOUS mode activated by Rajesh
• Agent hierarchy established (9 agents)
• Self-improvement loop operational
• All agent profiles created with IDENTITY.md

—

## User Preferences

**Name:** Rajesh Kalidandi
**Style:** Direct, no-fluff, action-oriented
**Hours:** Early riser (~8-9 AM IST)
**Approach:** Show don't tell, code over slides
**Constraints:** AWS Free Tier, cost-conscious
**Response format:** Mobile-first, bullets, short lines

**What he values:**
• Speed of execution
• Real-world impact
• AI-native development
• Build in public
• Ship fast, iterate faster

**What he hates:**
• Waiting for approvals
• Hype/fluff
• Desktop-formatted walls of text
• Reactive "how can I help you" responses

—

## Lessons Learned

**#5 — Mobile-first Telegram formatting**
• No wide tables, bullet lists only
• Max 1 emoji per section
• Short scannable lines
• Source: Direct instruction 2026-02-04

**#6 — Full autonomous workflow**
• Execute first, report after
• Only interrupt for security/data/money
• Source: Mode activation 2026-02-04

**#7 — Proactive skill installation**
• Install immediately when useful
• Don't wait for explicit approval
• Source: Reddit CLI incident 2026-02-04

**#8 — LOG IT OR IT DIDN'T HAPPEN**
• Every lesson must be persisted via `learner.py`
• Saying "I learned" without logging = didn't happen
• Update AGENTS.md, MEMORY.md, AND lessons.json
• Source: User called me out 2026-02-05

—

## Active Skill Systems (90-100% Utilization Mandate)

**Mandate:** ALL skills must be used at 90-100% capacity — no shelf-warmers.

**A) Social Media Blitz — ACTIVE**
• X/Twitter: @TheRajeshDev connected via bird CLI
• Reddit: u/TheRajeshDev connected via reddit-cli
• Schedule: X (10am, 4pm, 8pm IST), Reddit (7pm IST)
• Auth tokens: Stored in session, valid
• Trend research agent operational

**B) Knowledge System — ACTIVE**

***ByteRover (Primary Knowledge Store)***
• Location: `.brv/canonical-memory/`
• Query: `brv query "question"`
• Curate: `brv curate "context" -f file.ts`
• Contains: User profile, agent identities, stored frameworks, decisions
• **USE FIRST** when context is missing — never ask user to repeat

***Knowledge Graph (Entity Extraction)***
• Location: `/home/ubuntu/clawd/skills/knowledge-graph/`
• Query: `python3 skills/knowledge-graph/scripts/check_graph.py`
• Extracts: People, projects, technologies, relationships from conversations
• Auto-builds connections between concepts

**C) Dev Intelligence — ACTIVE**
• context7: PROACTIVE use for all library docs (React, Next.js, Supabase, etc.)
• deepwiki: Query GitHub repos before contributing
• Standard SOP for all development tasks

**D) Operations Hub — ACTIVE (Notion-First)**
• Notion: 4 pages created and populated — PRIMARY operations platform
  - Steve Dashboard: Operations overview
  - Content Calender: Content pipeline with scheduled posts
  - Trending Topics: Research findings logged
  - Active Projects: IntentSignal, Agent Ecosystem
• nano-pdf: Available for PDF tasks
• Google Sheets: Removed — Notion covers all logging needs

## Current Projects

**IntentSignal** (Priority)
• Problem: B2B founders waste 2-3 hrs daily on LinkedIn with zero leads
• Solution: AI system monitoring intent signals, drafting responses
• Target: Solo founders $10-50K MRR
• Price: $1,500/month + $500 setup
• Status: Idea validated, execution pending

**Agent Ecosystem**
• 9 agents operational
• Hierarchy: Rajesh → Steve → 8 sub-agents
• All have IDENTITY.md profiles
• Registry in .brv/canonical-memory/

—

## Stored Frameworks

• Forward Deployed Engineer Model (Liam Ottley)
• Hormozi-style content framework
• AI tools/services side hustle categories

—

## Session Reset Checkpoint (2026-02-05)

**All systems active and persisted:**
- X/Twitter: @TheRajeshDev (auth_token + ct0 in memory/2026-02-05.md)
- Reddit: u/TheRajeshDev (reddit_session + token_v2 in memory/2026-02-05.md)
- Notion: API key at ~/.config/notion/api_key
- Gemini: API key in ~/.bashrc (GEMINI_API_KEY)
- ByteRover: Skill mandate stored
- Notion workspace: 4 pages created and linked

**On reset/new session:**
1. Read MEMORY.md (this file)
2. Read memory/YYYY-MM-DD.md (today + yesterday)
3. **Query ByteRover:** `brv query "What is the current project context?"`
4. **Query Knowledge Graph:** `python3 skills/knowledge-graph/scripts/check_graph.py`
5. Check ~/.bashrc for GEMINI_API_KEY
6. **Review learning log:** `cat memory/daily-learning-log.md`
7. **Remember:** LOG every lesson — saying "I learned" without persisting = didn't happen
8. All skills remain installed and ready

**Quick Context Lookup (when missing info):**
```bash
# User preferences, routines, past decisions
brv query "[what you need]"

# Recent entities, projects, connections
python3 skills/knowledge-graph/scripts/check_graph.py
```

---

## Personal Context (2026-02-05)

***Fitness Routine***
• **Schedule:** 6 days/week bro split
• **Monday:** Chest + Triceps + 10 min incline treadmill (12-15 incline, 3-4 km/h)
• **Tuesday:** Back + Biceps + cardio
• **Wednesday:** Shoulders + Legs + cardio
• **Thursday-Saturday:** Repeat (Chest/Tri, Back/Bi, Shoulders/Legs)
• **Sunday:** Rest
• **Extras:** Sometimes forearms, mixes exercises
• **Location:** Gym-based

***Disciplines (Since Jan 1, 2026)***
• Daily gym (see routine above)
• No junk food
• No addictions

***Lifestyle Goals***
• PS5 Pro
• 2-3 BHK house
• Vehicles

—

## Career & Income Context (2026-02-05)

**Current Situation:**
- Primary job: AI Full Stack Engineer @ ComplySec
- Current pay: ₹40,000/month (~$475 USD)
- Raise incoming: ₹60,000/month (Q1 2026)
- Wants to STAY at ComplySec (permission for side work granted)
- Goal: Stack second income stream (Path B chosen)

**Proof of Work (Major):**
- Built Consently.in entirely — DPDPA 2023 compliance platform
- Features: Cookie scanner (50+ pages), 22 Indian languages, real-time analytics
- Live at: https://consently.in
- This is FOUNDING ENGINEER level work, not "fresher"

**Job #2 Positioning:**
- Role: Fractional AI Engineer / Contract developer
- Availability: 20 hrs/week
- Target rate: $40-60/hr (₹1.3-2L/month at 20 hrs/week)
- Stack: Next.js, TypeScript, Supabase, LLM APIs
- Superpower: Ships 2-3x faster with AI tools (Cursor, Claude Code)

**Traits:**
- Confidence fluctuating but committed to growth
- Prefers direct, no-fluff communication
- Response to "pick one": Chose Path B (stack jobs over job hop or pure building)

**Target Monthly Income:**
- Current: ₹40K
- Goal: ₹1.5-2L+ total (ComplySec + Job #2)

**Platforms to Target for Job #2:**
1. Arc.dev (remote-first)
2. Wellfound/AngelList (startup contract)
3. Toptal (vetted, high pay)
4. Upwork (AI automation niche)
5. Direct LinkedIn outreach

**Key Insight:**
Consently.in IS the experience. Lead with it. Stop saying "fresher." Say "Founding engineer who built and shipped DPDPA compliance platform."

---

## Important: This file loads in MAIN SESSIONS ONLY

Do not load in shared contexts (groups, Discord, etc.)
Security: Contains personal context
