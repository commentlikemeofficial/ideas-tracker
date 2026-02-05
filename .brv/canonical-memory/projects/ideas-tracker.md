# Ideas Tracker Project

**Repo:** https://github.com/commentlikemeofficial/ideas-tracker  
**Live Demo:** https://ideas-tracker-demo.vercel.app

## What It Does
Turn shower thoughts into validated business opportunities.

## Features
- **4-Dimensional Scoring**: Market Size, Competition, Technical Feasibility, Personal Fit (max 40 points)
- **Status Pipeline**: Researching → Validating → Building → Launched
- **Local-First Storage**: Zero backend, browser-only
- **Premium UI**: Dark mode, glassmorphism, smooth animations

## Scoring System
| Dimension | Weight |
|-----------|--------|
| Market Size | 10 pts |
| Competition | 10 pts |
| Technical Feasibility | 10 pts |
| Personal Fit | 10 pts |

### Score Interpretation
- 32-40: 🟢 **Go!** - Start validating
- 24-31: 🟡 **Maybe** - Needs refinement
- 16-23: 🟠 **Research** - More validation needed
- 0-15: 🔴 **Pass** - Not worth pursuing

## Tech Stack
- Next.js 16 (App Router)
- TypeScript 5.0
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- LocalStorage state

## Roadmap
- [ ] Export to CSV/JSON
- [ ] Cloud Sync (Supabase)
- [ ] AI Validation (GPT-powered)
- [ ] Kanban Board
- [ ] Tags System
- [ ] Dark/Light Toggle
- [ ] PWA Support

*Stored to ByteRover: 2026-02-03*
