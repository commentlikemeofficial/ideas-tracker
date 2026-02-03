# DPDPA Compliance Agent - Technical Blueprint

**Architecture:** Modern Full-Stack with Edge Compute  
**Pattern:** Server Components + Edge API Routes + Realtime Subscriptions  
**Scale Target:** 10K organizations, 100K users

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Web App    │  │ Telegram Bot │  │  WhatsApp    │               │
│  │  (Next.js)   │  │   (Node)     │  │   (API)      │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└────────────────────┬────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────────┐
│                      EDGE LAYER (Vercel)                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Next.js 16 App Router                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │   │
│  │  │   Server    │ │    API      │ │     Server Actions      │ │   │
│  │  │ Components  │ │   Routes    │ │    (Mutations)          │ │   │
│  │  │  (React 19) │ │  (Edge)     │ │                         │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────────┐
│                     SERVICE LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Supabase   │  │    AI SDK    │  │   Razorpay   │               │
│  │  (DB/Auth)   │  │ (OpenRouter) │  │  (Payments)  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │    Resend    │  │   Telegram   │  │   WhatsApp   │               │
│  │   (Email)    │  │    (Bot)     │  │   (Meta)     │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack Details

### Core Framework
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Next.js | 16.x | App Router, Turbopack, Edge |
| Runtime | React | 19.x | Server Components, Actions |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| UI | Shadcn UI | Latest | Component library |
| Animation | Framer Motion | 11.x | Micro-interactions |
| Icons | Lucide React | Latest | Icon system |
| State | Zustand | 4.x | Client state |
| Query | TanStack Query | 5.x | Server state |
| Forms | React Hook Form | 7.x | Form management |
| Validation | Zod | 3.x | Schema validation |

### Backend & Infrastructure
| Service | Provider | Tier | Purpose |
|---------|----------|------|---------|
| Hosting | Vercel | Pro | Edge deployment |
| Database | Supabase | Free | PostgreSQL + Realtime |
| Auth | Supabase Auth | Free | Multi-provider auth |
| Storage | Supabase Storage | Free | File uploads |
| AI | OpenRouter | Free tier | LLM aggregation |
| Email | Resend | Free | Transactional email |
| Payments | Razorpay | Standard | Indian payments |
| Monitoring | Vercel Analytics | Pro | Performance |

---

## 3. Database Schema (PostgreSQL)

### Core Tables

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT CHECK (size IN ('startup', 'sme', 'enterprise')),
  gst_number TEXT,
  dpia_required BOOLEAN DEFAULT false,
  dpo_name TEXT,
  dpo_email TEXT,
  dpo_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'inactive'
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'compliance_officer', 'auditor', 'member')),
  org_id UUID REFERENCES organizations(id),
  phone TEXT,
  telegram_chat_id TEXT,
  whatsapp_number TEXT,
  email_notifications BOOLEAN DEFAULT true,
  telegram_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'archived')),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  compliance_level TEXT CHECK (compliance_level IN ('non_compliant', 'partial', 'compliant', 'exemplary')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  ai_recommendations JSONB DEFAULT '[]'::jsonb,
  risk_areas JSONB DEFAULT '[]'::jsonb
);

-- Assessment Questions (DPDPA Sections)
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, -- 'section_4', 'section_5', etc.
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  description TEXT,
  weight INTEGER DEFAULT 1,
  evidence_required BOOLEAN DEFAULT false,
  help_text TEXT,
  order_index INTEGER
);

-- Assessment Responses
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question_id UUID REFERENCES assessment_questions(id),
  answer TEXT CHECK (answer IN ('yes', 'no', 'partial', 'na')),
  evidence_url TEXT,
  notes TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Assets (Data Mapping)
CREATE TABLE data_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('database', 'file_storage', 'api', 'third_party', 'physical')),
  category TEXT CHECK (category IN ('personal', 'sensitive', 'critical', 'public')),
  location TEXT,
  retention_period TEXT,
  encryption_status TEXT,
  access_controls JSONB DEFAULT '{}'::jsonb,
  dpi_completed BOOLEAN DEFAULT false,
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consent Records
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  purpose TEXT NOT NULL,
  consent_given BOOLEAN,
  consent_date TIMESTAMPTZ,
  withdrawal_date TIMESTAMPTZ,
  method TEXT,
  proof_url TEXT,
  version TEXT DEFAULT '1.0'
);

-- Breach Incidents
CREATE TABLE breach_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'contained', 'resolved', 'notified')),
  detected_at TIMESTAMPTZ,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  affected_users_count INTEGER,
  data_categories JSONB DEFAULT '[]'::jsonb,
  notification_sent BOOLEAN DEFAULT false,
  board_notified BOOLEAN DEFAULT false,
  dpb_notified BOOLEAN DEFAULT false
);

-- Compliance Tasks
CREATE TABLE compliance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  due_date TIMESTAMPTZ,
  section_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Audit Logs (DPDPA Requirement)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id),
  type TEXT CHECK (type IN ('compliance_summary', 'gap_analysis', 'executive_report', 'dpia_report')),
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'failed')),
  file_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by UUID REFERENCES users(id)
);

-- Subscriptions (Razorpay)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_customer_id TEXT,
  plan_id TEXT,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'active', 'paused', 'cancelled', 'completed')),
  current_start TIMESTAMPTZ,
  current_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_assessments_org ON assessments(org_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_data_assets_org ON data_assets(org_id);
CREATE INDEX idx_consent_org ON consent_records(org_id);
CREATE INDEX idx_breach_org ON breach_incidents(org_id);
CREATE INDEX idx_tasks_org ON compliance_tasks(org_id);
CREATE INDEX idx_audit_org_time ON audit_logs(org_id, created_at);
CREATE INDEX idx_reports_org ON reports(org_id);
```

---

## 4. API Architecture

### Route Structure

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/route.ts      # Next-Auth with Supabase
│   ├── assessments/
│   │   ├── route.ts                     # POST: create, GET: list
│   │   └── [id]/
│   │       ├── route.ts                 # GET: details, PATCH: update
│   │       ├── submit/route.ts          # POST: submit response
│   │       ├── complete/route.ts        # POST: complete assessment
│   │       └── report/route.ts          # POST: generate report
│   ├── compliance/
│   │   ├── status/route.ts              # GET: org compliance status
│   │   ├── tasks/route.ts               # CRUD for tasks
│   │   └── calendar/route.ts            # GET: upcoming deadlines
│   ├── data-assets/
│   │   └── route.ts                     # CRUD for data mapping
│   ├── consent/
│   │   ├── route.ts                     # CRUD for consent records
│   │   └── verify/route.ts              # POST: verify consent
│   ├── breaches/
│   │   ├── route.ts                     # CRUD for incidents
│   │   └── notify/route.ts              # POST: trigger notifications
│   ├── reports/
│   │   ├── route.ts                     # GET: list, POST: generate
│   │   └── [id]/
│   │       ├── download/route.ts        # GET: download PDF
│   │       └── share/route.ts           # POST: share via email
│   ├── webhooks/
│   │   ├── razorpay/route.ts            # POST: payment events
│   │   ├── telegram/route.ts            # POST: bot messages
│   │   └── supabase/route.ts            # POST: DB events
│   └── ai/
│       ├── analyze/route.ts             # POST: analyze compliance gap
│       ├── recommend/route.ts           # POST: get recommendations
│       └── generate-policy/route.ts     # POST: generate policy doc
```

### API Response Standard

```typescript
// Standard API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

// Usage example
const response: ApiResponse<Assessment> = {
  success: true,
  data: assessment,
  meta: { timestamp: new Date().toISOString() }
};
```

---

## 5. Server Actions (Next.js 15)

### Key Actions

```typescript
// app/actions/assessments.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAssessment(data: CreateAssessmentInput) {
  const supabase = await createClient();
  
  const { data: assessment, error } = await supabase
    .from('assessments')
    .insert({
      name: data.name,
      org_id: data.orgId,
      created_by: data.userId,
      status: 'in_progress'
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  // Initialize responses for all questions
  await initializeAssessmentResponses(assessment.id);
  
  revalidatePath('/dashboard/assessments');
  return assessment;
}

export async function submitAssessmentResponse(
  assessmentId: string,
  questionId: string,
  answer: AssessmentAnswer
) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('assessment_responses')
    .upsert({
      assessment_id: assessmentId,
      question_id: questionId,
      answer: answer.value,
      notes: answer.notes,
      evidence_url: answer.evidenceUrl,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw new Error(error.message);
  
  revalidatePath(`/dashboard/assessments/${assessmentId}`);
}

export async function completeAssessment(assessmentId: string) {
  const supabase = await createClient();
  
  // Calculate scores
  const score = await calculateAssessmentScore(assessmentId);
  
  // Get AI recommendations
  const recommendations = await getAIRecommendations(assessmentId);
  
  const { data, error } = await supabase
    .from('assessments')
    .update({
      status: 'completed',
      overall_score: score.overall,
      compliance_level: score.level,
      ai_recommendations: recommendations,
      completed_at: new Date().toISOString()
    })
    .eq('id', assessmentId)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  // Trigger notifications
  await notifyAssessmentComplete(assessmentId);
  
  revalidatePath('/dashboard/assessments');
  return data;
}
```

---

## 6. AI Integration

### AI SDK Setup

```typescript
// lib/ai/client.ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Primary model with fallbacks
const MODELS = {
  primary: 'google/gemini-2.0-flash-001',
  fallback: 'anthropic/claude-3-haiku',
  analysis: 'deepseek/deepseek-chat'
};

// Compliance gap analyzer
export async function analyzeComplianceGap(
  section: string,
  responses: AssessmentResponse[]
) {
  const prompt = `
    Analyze the following DPDPA ${section} compliance responses.
    Identify gaps, risks, and provide specific recommendations.
    
    Responses: ${JSON.stringify(responses)}
    
    Return structured analysis with:
    1. Compliance score (0-100)
    2. Risk level (low/medium/high/critical)
    3. Specific gaps identified
    4. Actionable recommendations
    5. Timeline for remediation
  `;
  
  const { object } = await generateObject({
    model: openrouter(MODELS.primary),
    schema: z.object({
      score: z.number().min(0).max(100),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      gaps: z.array(z.string()),
      recommendations: z.array(z.object({
        priority: z.enum(['low', 'medium', 'high', 'urgent']),
        action: z.string(),
        timeline: z.string(),
        resources: z.array(z.string())
      })),
      remediationTimeline: z.string()
    }),
    prompt,
  });
  
  return object;
}

// Policy generator
export async function generatePolicy(
  type: 'privacy' | 'terms' | 'cookie' | 'dpa',
  orgData: OrganizationData
) {
  const { text } = await generateText({
    model: openrouter(MODELS.primary),
    prompt: `
      Generate a ${type} policy for ${orgData.name}, 
      a ${orgData.industry} company based in India.
      
      Ensure DPDPA 2023 compliance with:
      - Clear data collection purposes
      - User rights (access, correction, erasure)
      - Consent mechanisms
      - Data retention periods
      - Breach notification procedures
      - Contact details for DPO
      
      Format: Professional legal document, India-specific.
    `,
  });
  
  return text;
}
```

---

## 7. Telegram Bot Architecture

### Bot Commands

```typescript
// lib/bot/telegram.ts
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Command: /start
bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;
  
  // Link Telegram to user account
  await linkTelegramAccount(userId, chatId);
  
  await ctx.reply(
    `👋 Welcome to ComplySec!\n\n` +
    `I'll send you compliance alerts and updates.\n\n` +
    `Commands:\n` +
    `/status - Check compliance status\n` +
    `/tasks - View pending tasks\n` +
    `/alerts - Configure notifications\n` +
    `/help - Show all commands`
  );
});

// Command: /status
bot.command('status', async (ctx) => {
  const orgId = await getOrgIdFromChat(ctx.chat.id);
  const status = await getComplianceStatus(orgId);
  
  await ctx.reply(
    `📊 Compliance Status\n\n` +
    `Overall Score: ${status.score}/100\n` +
    `Level: ${status.level}\n` +
    `Open Tasks: ${status.openTasks}\n` +
    `Upcoming Deadlines: ${status.upcomingDeadlines}\n\n` +
    `Last Assessment: ${status.lastAssessmentDate}`
  );
});

// Command: /tasks
bot.command('tasks', async (ctx) => {
  const orgId = await getOrgIdFromChat(ctx.chat.id);
  const tasks = await getPendingTasks(orgId, 5);
  
  let message = `📋 Pending Tasks\n\n`;
  tasks.forEach((task, i) => {
    message += `${i + 1}. ${task.title}\n`;
    message += `   Due: ${task.dueDate} | Priority: ${task.priority}\n\n`;
  });
  
  await ctx.reply(message);
});

// Alert dispatcher
export async function sendComplianceAlert(
  orgId: string,
  alert: ComplianceAlert
) {
  const chatIds = await getTelegramChatIds(orgId);
  
  const message = formatAlertMessage(alert);
  
  for (const chatId of chatIds) {
    try {
      await bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'View Details', url: alert.actionUrl }],
            [{ text: 'Mark Complete', callback_data: `complete_${alert.taskId}` }]
          ]
        }
      });
    } catch (error) {
      console.error(`Failed to send alert to ${chatId}:`, error);
    }
  }
}

export { bot };
```

---

## 8. Security & DPDPA Compliance

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_assets ENABLE ROW LEVEL SECURITY;

-- Organizations policy
CREATE POLICY "Users can view their org"
  ON organizations
  FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

-- Assessments policy
CREATE POLICY "Users can view org assessments"
  ON assessments
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

-- Data assets policy
CREATE POLICY "Users can manage org data assets"
  ON data_assets
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid()
    )
  );

-- Audit logging trigger
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    org_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  ) VALUES (
    COALESCE(NEW.org_id, OLD.org_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

### Encryption Standards

| Data Type | Storage | Transit |
|-----------|---------|---------|
| PII | AES-256 (at rest) | TLS 1.3 |
| Auth tokens | Argon2id + JWT | HTTPS only |
| Files | Server-side encryption | Signed URLs |
| Backups | Encrypted snapshots | N/A |

---

## 9. Component Architecture

### Shadcn UI Components Required

```bash
# Base components
npx shadcn add button card input label badge
npx shadcn add dialog dropdown-menu sheet
npx shadcn add table tabs accordion
npx shadcn add form calendar date-picker
npx shadcn add toast skeleton
npx shadcn add chart

# Custom components to build
# - ComplianceScoreCard
# - AssessmentProgress
# - DataAssetTable
# - TaskBoard
# - BreachTimeline
# - ReportViewer
# - NotificationCenter
```

### Component Structure

```
components/
├── ui/                    # Shadcn base components
├── layout/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Shell.tsx
├── dashboard/
│   ├── ComplianceScore.tsx
│   ├── RecentAssessments.tsx
│   ├── UpcomingTasks.tsx
│   └── QuickActions.tsx
├── assessments/
│   ├── AssessmentList.tsx
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   └── ResultsSummary.tsx
├── data-assets/
│   ├── AssetTable.tsx
│   ├── AssetForm.tsx
│   └── ClassificationBadge.tsx
├── breaches/
│   ├── IncidentCard.tsx
│   ├── SeverityBadge.tsx
│   └── NotificationPanel.tsx
└── reports/
    ├── ReportGenerator.tsx
    ├── ReportCard.tsx
    └── ShareDialog.tsx
```

---

## 10. File Storage Structure

```
Supabase Storage:
├── organizations/
│   └── {org_id}/
│       ├── evidence/
│       │   └── {assessment_id}/
│       │       └── {file_name}
│       ├── reports/
│       │   └── {report_id}.pdf
│       ├── policies/
│       │   └── {policy_type}.pdf
│       └── logos/
│           └── logo.png
```

---

## 11. Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=https://complysec.in
NEXT_PUBLIC_APP_NAME=ComplySec

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI (OpenRouter)
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@complysec.in
RESEND_FROM_NAME=ComplySec

# Payments (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=

# WhatsApp (Meta)
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# Security
JWT_SECRET=
ENCRYPTION_KEY=
```

---

## 12. Deployment Strategy

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev --turbopack",
  "installCommand": "npm install",
  "regions": ["bom1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_key"
  },
  "crons": [
    {
      "path": "/api/cron/daily-checks",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/weekly-reports",
      "schedule": "0 10 * * 1"
    }
  ]
}
```

### Domain Setup

| Environment | Domain | Purpose |
|-------------|--------|---------|
| Production | complysec.in | Main app |
| Staging | staging.complysec.in | Testing |
| API | api.complysec.in | API endpoints |
| Webhooks | hooks.complysec.in | Webhook handlers |

---

*Blueprint Version: 1.0*  
*Last Updated: Pre-Build Phase*
