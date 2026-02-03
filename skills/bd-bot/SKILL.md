---
name: bd-bot
description: Business development automation - outbound lead scraping, enrichment, pitch drafting + inbound content scheduling. Use to find AI/full-stack freelance projects and grow personal brand.
---

# BD Bot - Business Development Automation

Helps Rajesh find freelance projects and grow inbound leads through content.

**📊 Data stored in:** [Google Sheet](https://docs.google.com/spreadsheets/d/11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ/edit)

---

## 🎯 Quick Start (15 min/day)

### Morning: Outbound (10 min)
```bash
cd /home/ubuntu/clawd/skills/bd-bot

# Add leads you find (or add directly in Google Sheet)
./scripts/add-lead.sh "Company" "Contact" "Role" "Source" "Notes"

# View all leads
./scripts/list-leads.sh

# Generate pitch for a company
./scripts/draft-pitch.sh "Company Name"
```

### Evening: Inbound (5 min)
```bash
# Add content ideas as they come
./scripts/add-content.sh "Your insight here"

# View content queue
./scripts/list-content.sh
```

---

## 📤 Outbound Scripts

| Script | Purpose | Example |
|--------|---------|---------|
| `add-lead.sh` | Add new lead to track | `./add-lead.sh "Infloso AI" "Hiring Manager" "Full Stack" "LinkedIn" "7LPA after trial"` |
| `list-leads.sh` | View all leads | `./list-leads.sh` |
| `draft-pitch.sh` | Generate pitch template | `./draft-pitch.sh "Infloso AI"` |

**Lead Sources to Check:**
- [Wellfound](https://wellfound.com/jobs) — Search: AI engineer, Full stack, Next.js
- [YC Jobs](https://www.ycombinator.com/jobs) — Engineering, Remote
- [LinkedIn Jobs](https://linkedin.com/jobs) — Freelance AI developer, Contract
- [Indie Hackers](https://indiehackers.com/group/looking-to-hire)
- Twitter/X — Search: "hiring AI developer"

---

## 📥 Inbound Scripts

| Script | Purpose | Example |
|--------|---------|---------|
| `add-content.sh` | Queue content idea | `./add-content.sh "What I learned shipping consently.in"` |
| `list-content.sh` | View content queue | `./list-content.sh` |

**Content Themes:**
- **Build journey:** consently.in lessons, what broke, how fixed
- **Tech insights:** Stack choices (Supabase vs Firebase), AI integration patterns
- **Productivity:** Solo dev workflows, shipping 20+ projects in 2 months
- **AI learnings:** Processing 500+ docs, LLM prompt engineering

---

## 💼 Pitch Template

Uses consently.in as proof point:

> Hi [Name],
> 
> Saw you're building at [Company]. I recently solo-built **consently.in** — a DPDPA compliance platform in beta with 15+ users, 500+ docs processed.
> 
> Built with Next.js + Supabase + AI APIs — same stack you mentioned.
> 
> Quick stats: 60+ GitHub repos, 20+ projects in 2 months, patent holder.
> 
> Open to a quick chat?

---

## 📊 Google Sheet Structure

| Date | Company | Contact | Role | Source | Status | Notes |
|------|---------|---------|------|--------|--------|-------|
| 2026-01-29 | Infloso AI | Hiring Mgr | Full Stack | Referral | New | 7LPA after trial |

**Status options:** New, Contacted, Replied, Interview, Offer, Closed

---

## 🚀 Daily Workflow

**Step 1:** Research 10 mins (Wellfound, YC, LinkedIn)
**Step 2:** Add 2-3 quality leads to sheet
**Step 3:** Draft + personalize pitches for top 2
**Step 4:** Send (LinkedIn DM or Email)
**Step 5:** Update status in sheet

**Target:** 5 outreach per day = 25/week = 100/month

---

## 📈 Success Metrics

Track in the Google Sheet:
- Leads added per week
- Response rate
- Calls booked
- Offers received
- Content posts published
- Engagement on posts

---

## 💡 Pro Tips

1. **Quality > Quantity** — Research before reaching out
2. **Personalize** — Mention specific company/product detail
3. **Follow up** — 3-4 days later if no response
4. **Content consistency** — 1 post/day builds inbound
5. **Track everything** — What works, what doesn't

---

## 🔗 Links

- **Google Sheet:** https://docs.google.com/spreadsheets/d/11xNDqsOjMku9GT0JDyrFoo-iIwD8paINr6vSbs4-AFQ/edit
- **consently.in:** https://www.consently.in (your proof point)
- **LinkedIn:** https://linkedin.com/in/rajeshkalidandi
- **GitHub:** https://github.com/rajeshkalidandi

---

*Built for Rajesh Kalidandi. Ship fast, iterate faster.* 🚀
