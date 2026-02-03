# DPDPA Compliance Agent - Setup Guide

**Prerequisites:** Node.js 20+, Git, VS Code/Cursor  
**Estimated Time:** 2-3 hours (first run)  
**Difficulty:** Intermediate

---

## Quick Start (TL;DR)

```bash
# 1. Clone and setup
git clone https://github.com/yourusername/complysec.git
cd complysec
cp .env.example .env.local

# 2. Install dependencies
npm install

# 3. Start development
npm run dev

# 4. Open http://localhost:3000
```

---

## 1. Prerequisites Check

### Required Software

```bash
# Check Node.js version (must be 20+)
node --version  # v20.11.0 or higher

# Check npm version
npm --version   # v10.0.0 or higher

# Check Git
git --version   # v2.40.0 or higher
```

### Install Node.js 20 (if needed)

**macOS (Homebrew):**
```bash
brew install node@20
brew link node@20
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/)

### Recommended VS Code Extensions

```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code: formatter
- ESLint
- GitLens
- Thunder Client (API testing)
- Database Client (for PostgreSQL)
```

---

## 2. Project Initialization

### 2.1 Create Next.js 16 Project

```bash
# Create project with Next.js 16
echo "my-app" | npx shadcn@latest init --yes --template next --base-color slate

# Navigate to project
cd my-app

# Initialize Git
git init
git add .
git commit -m "Initial commit: Next.js 16 + shadcn setup"
```

### 2.2 Install Core Dependencies

```bash
# UI Components
npx shadcn add button card input label badge
npx shadcn add dialog dropdown-menu sheet tabs
npx shadcn add table accordion form calendar
npx shadcn add toast skeleton chart
npx shadcn add avatar select textarea

# Animation
npm install framer-motion

# Icons
npm install lucide-react

# State Management
npm install zustand

# Server State
npm install @tanstack/react-query

# Forms
npm install react-hook-form @hookform/resolvers zod

# Date handling
npm install date-fns

# PDF generation (reports)
npm install @react-pdf/renderer

# Charts
npm install recharts

# Telegram Bot (server-side only)
npm install telegraf

# AI SDK
npm install ai @openrouter/ai-sdk-provider

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Razorpay
npm install razorpay

# Email
npm install resend

# Class utilities
npm install clsx tailwind-merge
```

### 2.3 Install Dev Dependencies

```bash
npm install -D @types/node @types/react @types/react-dom
npm install -D prettier prettier-plugin-tailwindcss
npm install -D eslint-config-prettier
npm install -D playwright  # E2E testing
```

---

## 3. Environment Configuration

### 3.1 Create .env.local

```bash
touch .env.local
```

### 3.2 Copy Template

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ComplySec

# Supabase (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI - OpenRouter (get from https://openrouter.ai/keys)
OPENROUTER_API_KEY=your_openrouter_key

# Email - Resend (get from https://resend.com/api-keys)
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=ComplySec

# Payments - Razorpay (get from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Telegram Bot (get from @BotFather on Telegram)
TELEGRAM_BOT_TOKEN=your_bot_token

# Optional: WhatsApp (Meta Developer Portal)
WHATSAPP_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id

# Security (generate strong random strings)
JWT_SECRET=generate_random_string_32_chars
ENCRYPTION_KEY=generate_random_string_32_chars
```

### 3.3 Generate Secrets

```bash
# Generate secure random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 4. Supabase Setup

### 4.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `complysec`
4. Database Password: Generate strong password
5. Region: `Mumbai (South Asia)` (closest to India)
6. Click "Create Project"

### 4.2 Get Credentials

1. Go to Project Settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 4.3 Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your_project_ref

# Create migration
supabase migration new initial_schema

# Copy schema from tech-blueprint.md to:
# supabase/migrations/20240101000000_initial_schema.sql

# Deploy
supabase db push
```

### 4.4 Setup Storage Buckets

```sql
-- Run in Supabase SQL Editor

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('evidence', 'evidence', false),
  ('reports', 'reports', false),
  ('policies', 'policies', false);

-- Set up storage policies
CREATE POLICY "Allow org access to evidence"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'evidence' AND auth.uid() IS NOT NULL);
```

### 4.5 Enable Realtime

```sql
-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE assessments;
ALTER PUBLICATION supabase_realtime ADD TABLE compliance_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE breach_incidents;
```

---

## 5. Authentication Setup

### 5.1 Configure Supabase Auth

1. Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Configure:
   - Confirm email: ✅ (recommended for production)
   - Secure email change: ✅
   - Secure password change: ✅

4. Enable **Google OAuth** (optional):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add redirect: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

### 5.2 Configure Site URL

1. Authentication → URL Configuration
2. Site URL: `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
3. Redirect URLs: Add `/**` for wildcard

---

## 6. AI Integration Setup

### 6.1 OpenRouter Configuration

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create API Key
3. Add to `.env.local`: `OPENROUTER_API_KEY`

### 6.2 Test AI Connection

Create `scripts/test-ai.ts`:

```typescript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function test() {
  const { text } = await generateText({
    model: openrouter('google/gemini-2.0-flash-001'),
    prompt: 'Say hello from ComplySec AI',
  });
  console.log(text);
}

test();
```

Run: `npx tsx scripts/test-ai.ts`

---

## 7. Telegram Bot Setup

### 7.1 Create Bot

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`
3. Follow prompts:
   - Name: `ComplySec Bot`
   - Username: `complysec_bot` (must end in _bot)
4. Copy the HTTP API token
5. Add to `.env.local`: `TELEGRAM_BOT_TOKEN`

### 7.2 Webhook Setup (Production)

```bash
# Set webhook (replace with your domain)
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://yourdomain.com/api/webhooks/telegram"}'
```

---

## 8. Razorpay Setup

### 8.1 Create Account

1. Go to [razorpay.com](https://razorpay.com)
2. Sign up with business details
3. Complete KYC (takes 1-2 days)

### 8.2 Get API Keys

1. Dashboard → Account & Settings → API Keys
2. Generate Key (Test Mode for development)
3. Copy Key ID and Secret to `.env.local`

### 8.3 Configure Webhook

1. Settings → Webhooks → Add New Webhook
2. URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Secret: Generate random string
4. Events to subscribe:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `payment.failed`

### 8.4 Create Plans

```bash
# Create plans via API
curl -X POST https://api.razorpay.com/v1/plans \
  -u key_id:key_secret \
  -H 'Content-Type: application/json' \
  -d '{
    "period": "monthly",
    "interval": 1,
    "item": {
      "name": "ComplySec Starter",
      "amount": 99900,
      "currency": "INR",
      "description": "Starter plan for DPDPA compliance"
    }
  }'
```

---

## 9. Email Setup (Resend)

### 9.1 Create Account

1. Go to [resend.com](https://resend.com)
2. Sign up
3. Verify domain (for production)

### 9.2 Get API Key

1. Dashboard → API Keys
2. Create API Key
3. Add to `.env.local`

### 9.3 Verify Domain (Production)

1. Add domain in Resend Dashboard
2. Add DNS records to your domain provider
3. Wait for verification (can take up to 24h)

---

## 10. Development Workflow

### 10.1 Start Development Server

```bash
# Start with Turbopack (fast)
npm run dev

# Or explicitly
next dev --turbopack
```

### 10.2 Build for Production

```bash
# Build locally
npm run build

# Start production server
npm start
```

### 10.3 Run Tests

```bash
# Unit tests
npm test

# E2E tests (Playwright)
npx playwright test

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 11. Project Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── assessments/
│   │   ├── compliance/
│   │   ├── data-assets/
│   │   ├── breaches/
│   │   └── reports/
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── assessments/
│   │   ├── webhooks/
│   │   └── ai/
│   ├── actions/                  # Server Actions
│   │   ├── assessments.ts
│   │   ├── compliance.ts
│   │   └── auth.ts
│   ├── layout.tsx
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn components
│   ├── layout/                   # Layout components
│   ├── dashboard/                # Dashboard-specific
│   └── forms/                    # Form components
├── lib/
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts
│   │   └── server.ts
│   ├── ai/                       # AI utilities
│   ├── razorpay.ts
│   ├── resend.ts
│   └── utils.ts
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types
├── public/                       # Static assets
├── supabase/
│   └── migrations/               # Database migrations
├── scripts/                      # Utility scripts
├── tests/                        # Test files
├── .env.local                    # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 12. VS Code Configuration

### 12.1 Create .vscode/settings.json

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### 12.2 Create .vscode/extensions.json

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 13. Git Configuration

### 13.1 .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/

# Next.js
.next/
out/

# Production
build/
dist/

# Environment
.env
.env.local
.env.*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Supabase
.supabase/

# Playwright
test-results/
playwright-report/
```

### 13.2 Commit Message Convention

```bash
# Format: type(scope): description

feat(auth): add Google OAuth
fix(assessments): resolve scoring bug
docs(readme): update setup instructions
refactor(api): optimize query performance
test(e2e): add dashboard tests
chore(deps): update dependencies
```

---

## 14. Deployment Checklist

### 14.1 Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### 14.2 Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select project → Settings → Environment Variables
3. Add all variables from `.env.local`
4. Redeploy

### 14.3 Domain Configuration

1. Vercel Dashboard → Domains
2. Add custom domain: `complysec.in`
3. Configure DNS with domain provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 15. Troubleshooting

### Common Issues

**1. Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Supabase connection errors**
```bash
# Check environment variables
cat .env.local | grep SUPABASE

# Test connection
npx tsx scripts/test-supabase.ts
```

**3. Turbopack issues**
```bash
# Use regular Webpack instead
npm run dev:webpack
```

**4. Type errors**
```bash
# Regenerate types
npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

**5. Build failures**
```bash
# Check for lint errors
npm run lint

# Type check
npx tsc --noEmit

# Build with verbose output
npm run build --debug
```

---

## 16. Next Steps After Setup

1. [ ] Create first assessment
2. [ ] Test AI recommendations
3. [ ] Setup Telegram bot
4. [ ] Configure Razorpay test mode
5. [ ] Send test email via Resend
6. [ ] Run E2E tests
7. [ ] Deploy to staging
8. [ ] Beta user onboarding

---

## Support & Resources

- **Documentation:** https://docs.complysec.in
- **Discord:** https://discord.gg/complysec
- **Email:** support@complysec.in
- **GitHub Issues:** https://github.com/yourusername/complysec/issues

---

**Setup Complete!** 🚀  
Ready to build the future of DPDPA compliance.

*Last Updated: Pre-Build Phase*
