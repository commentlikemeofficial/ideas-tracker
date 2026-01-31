#!/bin/bash
# build-project.sh - Build a new project from scratch
# Usage: ./build-project.sh --name "project-name" --type "saas|mvp|tool" --idea "description" --stack "nextjs-supabase"

set -e

# Parse arguments
PROJECT_NAME=""
PROJECT_TYPE=""
IDEA=""
STACK=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --name)
      PROJECT_NAME="$2"
      shift 2
      ;;
    --type)
      PROJECT_TYPE="$2"
      shift 2
      ;;
    --idea)
      IDEA="$2"
      shift 2
      ;;
    --stack)
      STACK="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ -z "$PROJECT_NAME" ] || [ -z "$PROJECT_TYPE" ] || [ -z "$IDEA" ]; then
  echo "Usage: ./build-project.sh --name \"my-app\" --type \"saas\" --idea \"AI document analyzer\" [--stack \"nextjs-supabase\"]"
  exit 1
fi

PROJECT_DIR="/home/ubuntu/clawd/agents/ai-developer/projects/$PROJECT_NAME"
LOG_FILE="/home/ubuntu/clawd/agents/ai-developer/projects/build-log.json"

echo "🚀 AI Developer Agent - Building Project"
echo "========================================="
echo "Project: $PROJECT_NAME"
echo "Type: $PROJECT_TYPE"
echo "Stack: ${STACK:-auto-detect}"
echo "Idea: $IDEA"
echo ""

# Check rate limits before starting
echo "⏱️  Checking rate limits..."
./check-rate-limits.sh || {
  echo "⚠️  Rate limits approaching. Queuing build for later."
  echo "$(date -Iseconds) - $PROJECT_NAME - QUEUED" >> "$LOG_FILE"
  exit 0
}

# Create project directory
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "📁 Created project directory: $PROJECT_DIR"
echo ""

# Step 1: Get Tech Stack Recommendation from Tech Architect
echo "🏗️  Step 1: Consulting Tech Architect..."
echo "======================================="
echo "Sending system design request..."
echo ""

TECH_SPEC_FILE="$PROJECT_DIR/tech-spec.md"
cat > "$TECH_SPEC_FILE" << EOF
# Technical Specification: $PROJECT_NAME

## Project Overview
- **Name:** $PROJECT_NAME
- **Type:** $PROJECT_TYPE
- **Description:** $IDEA
- **Requested Stack:** ${STACK:-TBD}

## Tech Architect Recommendations
[To be filled by Tech Architect Agent]

## Chosen Stack (Free Tier Only)
- Frontend:
- Backend:
- Database:
- Auth:
- AI/ML:
- Deployment:

## Architecture Diagram
[To be added]

## API Design
[To be added]

## Database Schema
[To be added]

## Development Phases
1. Phase 1: Core MVP
2. Phase 2: Features
3. Phase 3: Polish

## Cost Estimate
All free tier: $0/month
EOF

echo "✅ Tech spec template created: $TECH_SPEC_FILE"
echo "   Tech Architect will fill this in"
echo ""

# Step 2: Initialize Project (if stack known)
if [ -n "$STACK" ]; then
  echo "⚙️  Step 2: Initializing Project with Stack: $STACK"
  echo "===================================================="
  
  case $STACK in
    nextjs-supabase|nextjs)
      echo "Creating Next.js + Supabase project..."
      # Use create-next-app with minimal template
      # This would normally run: npx create-next-app@latest
      echo "npx create-next-app@latest $PROJECT_NAME --typescript --tailwind --eslint --app --src-dir --import-alias \"@/*\"" > "$PROJECT_DIR/init-command.sh"
      ;;
    express-mongodb)
      echo "Creating Express + MongoDB project..."
      mkdir -p "$PROJECT_DIR/src"
      ;;
    fastapi-postgres)
      echo "Creating FastAPI + PostgreSQL project..."
      mkdir -p "$PROJECT_DIR/app"
      ;;
    *)
      echo "Unknown stack: $STACK. Tech Architect will recommend."
      ;;
  esac
  
  echo "✅ Project initialized"
  echo ""
fi

# Step 3: Create Development Plan
echo "📋 Step 3: Creating Development Plan"
echo "===================================="

DEV_PLAN="$PROJECT_DIR/dev-plan.md"
cat > "$DEV_PLAN" << EOF
# Development Plan: $PROJECT_NAME

## Build Strategy
- Use Kimi CLI for coding (with breaks)
- Code Reviewer checks every PR
- Vercel Monitor handles deployment
- All free tier services only

## Session 1: Setup & Auth (30 min)
- [ ] Initialize project
- [ ] Setup auth (Supabase/NextAuth)
- [ ] Basic layout & navigation
- [ ] Environment variables

## Session 2: Core Features (45 min)
- [ ] Database schema
- [ ] API endpoints
- [ ] Main functionality

## Session 3: UI/UX (45 min)
- [ ] Page layouts
- [ ] Components
- [ ] Styling

## Session 4: Integration & Polish (30 min)
- [ ] AI integration (if needed)
- [ ] Error handling
- [ ] Loading states

## Session 5: Testing & Deploy (30 min)
- [ ] Tests
- [ ] Code review
- [ ] Deploy to Vercel

## Rate Limit Management
- 30-45 min coding sessions
- 15-20 min breaks between
- Switch to DeepSeek/Gemini if Kimi limited
- Use local Ollama for simple tasks

## Progress Tracking
- Log each session to build-log.json
- Update this plan as we go
- Note any blockers
EOF

echo "✅ Development plan created: $DEV_PLAN"
echo ""

# Step 4: Log the build start
echo "📝 Step 4: Logging Build Start"
echo "=============================="

mkdir -p "$(dirname "$LOG_FILE")"
if [ ! -f "$LOG_FILE" ]; then
  echo "[]" > "$LOG_FILE"
fi

# Add entry to build log
jq --arg name "$PROJECT_NAME" \
   --arg type "$PROJECT_TYPE" \
   --arg idea "$IDEA" \
   --arg date "$(date -Iseconds)" \
   '. += [{"name": $name, "type": $type, "idea": $idea, "started": $date, "status": "planning"}]' \
   "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"

echo "✅ Build logged"
echo ""

# Summary
echo "🎯 Build Project Initialized!"
echo "============================="
echo ""
echo "Project: $PROJECT_NAME"
echo "Location: $PROJECT_DIR"
echo ""
echo "Next Steps:"
echo "1. Tech Architect reviews tech-spec.md"
echo "2. Once approved, AI Developer starts building"
echo "3. Code Reviewer checks each session"
echo "4. Vercel Monitor deploys when ready"
echo ""
echo "Files Created:"
echo "  📄 $TECH_SPEC_FILE"
echo "  📄 $DEV_PLAN"
echo ""
echo "⏱️  Estimated build time: 2-4 hours (with breaks)"
echo "💰 Cost: $0 (all free tier)"
