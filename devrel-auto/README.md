# RepoDocs.ai

> Auto-generate documentation from code. Never write a README again.

## What is this?

RepoDocs.ai is a DevRel-as-a-Service tool that:
- Analyzes your GitHub repositories
- Auto-generates professional READMEs
- Creates API documentation from code
- Generates changelogs from commits
- Keeps docs updated via pull requests

## Why?

Developers hate writing documentation. But great docs = more GitHub stars = more users = more revenue.

Current solutions:
- **ReadMe.com**: $99-499/mo, complex setup
- **GitBook**: Manual, doesn't sync with code
- **Mintlify**: Beautiful but requires writing

**RepoDocs.ai**: Zero-config, AI-generated from code, auto-updates.

## Market Validation

- **Score**: 8.5/10 opportunity
- **Pain**: High — every dev team struggles with docs
- **Competition**: Weak — no true auto-generation exists
- **Pricing**: $19/mo Pro (undercuts market by 5x)

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Supabase (auth + DB)
- Stripe (payments)
- GitHub API
- LLM for generation (OpenAI/Claude)

## MVP Features

- [x] Landing page
- [x] Dashboard UI
- [ ] GitHub OAuth
- [ ] Repo analyzer
- [ ] README generator (AI)
- [ ] API doc generator
- [ ] Changelog generator
- [ ] Stripe payments
- [ ] Auto-update via PR

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 3 repos, basic README |
| Pro | $19/mo | Unlimited, API docs, changelogs, auto-update |
| Team | $49/mo | Org-wide, custom templates, SSO |

## Next Steps

1. Deploy to Vercel
2. Add GitHub OAuth
3. Build code analyzer
4. Integrate LLM for generation
5. Launch on Product Hunt

---

Built in 20 minutes by AI. For developers, by AI. 🤖
