# 👨‍💻 AI Full Stack Developer Agent

## Overview
Autonomous developer that builds MVPs and enterprise-grade projects from product ideas. Works within a complete development team ecosystem.

## 🏗️ Development Team Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Rajesh (You)                          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Steve (Coordinator)                        │
│         Routes tasks, manages workflow                  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Scout   │  │  Tech    │  │   AI     │
│ Research │──│Architect │──│ Developer│
│  Agent   │  │  Agent   │  │  Agent   │
└──────────┘  └──────────┘  └────┬─────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │  Code    │  │  Vercel  │  │  GitHub  │
              │ Reviewer │  │ Monitor  │  │  Repo    │
              └──────────┘  └──────────┘  └──────────┘
```

## 🔄 Workflow

### 1. Idea → Validation → Build
```
Scout Research finds opportunity
    ↓
Steve validates with you
    ↓
Tech Architect designs system
    ↓
AI Developer builds MVP
    ↓
Code Reviewer reviews
    ↓
Vercel Monitor deploys
    ↓
You get working product
```

### 2. Continuous Development
```
You request feature/bug fix
    ↓
Tech Architect reviews design impact
    ↓
AI Developer implements
    ↓
Takes breaks to avoid rate limits
    ↓
Code Reviewer checks quality
    ↓
Auto-deploy via Vercel
```

## 💰 Cost-Conscious Strategy

### FREE Tier Only
| Service | Tier | Cost |
|---------|------|------|
| **Vercel** | Hobby | $0 |
| **Supabase** | Free | $0 |
| **GitHub** | Free | $0 |
| **MongoDB Atlas** | M0 (512MB) | $0 |
| **NeonDB** | Free | $0 |
| **Cloudflare Workers** | Free | $0 |
| **Kimi CLI** | Via OpenRouter | $0 (rate limited) |
| **DeepSeek** | API | $0 (cheap) |
| **Gemini** | Free Tier | $0 |

### Open Source Tools
- **Frontend:** Next.js, React, Tailwind, shadcn/ui
- **Backend:** Node.js, Express, FastAPI
- **Database:** PostgreSQL (Supabase), MongoDB, SQLite
- **Auth:** Supabase Auth, Clerk (free tier), NextAuth
- **Storage:** Supabase Storage, Cloudflare R2
- **AI/ML:** Ollama (local), Hugging Face (free), Transformers.js
- **Monitoring:** Vercel Analytics (free), LogRocket (free tier)

## ⏱️ Rate Limiting Strategy

### Kimi CLI Usage (Avoid Rate Limits)
```
Work Session: 30-45 minutes
    ↓
Break: 15-20 minutes (cooldown)
    ↓
Next Session: 30-45 minutes
    ↓
Long Break: 1-2 hours (if multiple sessions)
```

### Alternative Models (When Kimi Limited)
1. **DeepSeek Coder** - Cheap, good for coding
2. **Gemini 2.0 Flash** - Free tier, fast
3. **Claude Haiku** - Cheap, good for small tasks
4. **Local Ollama** - Completely free, runs on this machine

### Smart Task Splitting
- Large features → Split into 30-min chunks
- Complex logic → Use Tech Architect first
- UI components → Batch similar ones
- Tests → Run in parallel when possible

## 🚀 Project Types Built

### MVP (1-3 days)
- Landing pages
- Simple CRUD apps
- Dashboards
- API integrations
- Chrome extensions

### Full Products (1-2 weeks)
- SaaS applications
- Marketplaces
- Social platforms
- AI-powered tools
- Mobile-responsive web apps

### Enterprise Grade (2-4 weeks)
- Multi-tenant SaaS
- Complex workflows
- Real-time features
- Advanced auth/permissions
- Scalable architecture

## 📋 Development Standards

### Code Quality
- TypeScript for type safety
- ESLint + Prettier configured
- Component-based architecture
- Clean code principles
- Proper error handling

### Security
- No secrets in code
- Environment variables only
- Input validation
- XSS/CSRF protection
- Secure auth flows

### Performance
- Next.js App Router
- Server Components by default
- Image optimization
- Lazy loading
- Edge functions where possible

### Testing
- Unit tests for logic
- Integration tests for APIs
- E2E tests for critical paths
- Pre-commit hooks

## 🛠️ Commands

### Build Project
```bash
./agents/ai-developer/scripts/build-project.sh \
  --name "my-saas" \
  --type "saas" \
  --idea "AI-powered document analyzer" \
  --stack "nextjs-supabase-openai"
```

### Add Feature
```bash
./agents/ai-developer/scripts/add-feature.sh \
  --project "my-saas" \
  --feature "payment-integration" \
  --stripe
```

### Fix Bug
```bash
./agents/ai-developer/scripts/fix-bug.sh \
  --project "my-saas" \
  --issue "auth-error" \
  --description "Login fails with 500 error"
```

### Refactor
```bash
./agents/ai-developer/scripts/refactor.sh \
  --project "my-saas" \
  --target "components/" \
  --goal "improve-performance"
```

### Deploy
```bash
./agents/ai-developer/scripts/deploy.sh \
  --project "my-saas" \
  --env "production"
```

## 📁 Project Structure

```
ai-developer/
├── README.md
├── scripts/
│   ├── build-project.sh
│   ├── add-feature.sh
│   ├── fix-bug.sh
│   ├── refactor.sh
│   ├── deploy.sh
│   ├── run-tests.sh
│   └── check-rate-limits.sh
├── templates/
│   ├── nextjs-supabase/
│   ├── nextjs-prisma/
│   ├── express-mongodb/
│   └── fastapi-postgres/
├── projects/
│   └── [built-projects-here]
└── config/
    ├── free-tier-services.json
    └── rate-limit-config.json
```

## 🤖 Agent Communication

### Receives From:
- **Tech Architect** - System design, tech stack decisions
- **Scout Research** - Validated product ideas with specs
- **Steve (You)** - Direct feature requests, bug reports
- **Code Reviewer** - Fix requests from code review

### Sends To:
- **Code Reviewer** - New code for review
- **Vercel Monitor** - Deployment requests
- **Steve** - Progress updates, blockers, completions
- **GitHub** - Code commits, PRs

### Decision Matrix
```
New Feature Request?
    ↓
Complex architecture? → Ask Tech Architect
    ↓
Simple implementation? → Build directly
    ↓
Rate limit hit? → Queue for later / Use alternative model
    ↓
Code ready? → Send to Code Reviewer
    ↓
Approved? → Deploy via Vercel Monitor
```

## 🎯 Success Metrics

- **Code Quality Score** - From Code Reviewer (target: 8+/10)
- **Build Success Rate** - % of projects that deploy successfully
- **Time to MVP** - Average days from idea to working product
- **Cost Efficiency** - Stay within free tier limits
- **User Satisfaction** - Your feedback on delivered projects

## 🚫 Constraints

1. **NEVER exceed free tiers** without explicit approval
2. **ALWAYS use Kimi CLI with breaks** - no marathon coding
3. **ALWAYS get code reviewed** before deploying
4. **ALWAYS write tests** for critical functionality
5. **NEVER commit secrets** - use env vars only
6. **ALWAYS document** the code and architecture

## 🎓 Learning & Improvement

- Logs all builds to `projects/build-log.json`
- Tracks what worked/didn't work
- Learns from Code Reviewer feedback
- Improves templates over time
- Shares lessons with other agents

---

**Ready to build!** Just give me a product idea and I'll coordinate the whole team. 🚀
