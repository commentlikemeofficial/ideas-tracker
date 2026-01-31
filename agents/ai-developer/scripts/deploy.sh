#!/bin/bash
# deploy.sh - Deploy project to Vercel
# Usage: ./deploy.sh --project "my-app" [--env "production"]

PROJECT=""
ENV="preview"

while [[ $# -gt 0 ]]; do
  case $1 in
    --project)
      PROJECT="$2"
      shift 2
      ;;
    --env)
      ENV="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ -z "$PROJECT" ]; then
  echo "Usage: ./deploy.sh --project \"my-app\" [--env \"production\"]"
  exit 1
fi

PROJECT_DIR="/home/ubuntu/clawd/agents/ai-developer/projects/$PROJECT"

if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Project not found: $PROJECT"
  exit 1
fi

echo "🚀 AI Developer - Deploying to Vercel"
echo "======================================"
echo "Project: $PROJECT"
echo "Environment: $ENV"
echo ""

# Check if it's a git repo
if [ ! -d "$PROJECT_DIR/.git" ]; then
  echo "⚠️  Not a git repository. Initializing..."
  cd "$PROJECT_DIR"
  git init
  git add .
  git commit -m "Initial commit"
fi

# Check for GitHub remote
if ! git -C "$PROJECT_DIR" remote | grep -q "origin"; then
  echo "🔗 No GitHub remote configured."
  echo "   Create repo on GitHub first:"
  echo "   gh repo create $PROJECT --public --source=$PROJECT_DIR --remote=origin --push"
  echo ""
  echo "   Or provide existing repo:"
  echo "   git -C $PROJECT_DIR remote add origin <github-url>"
  exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git -C "$PROJECT_DIR" push origin main 2>/dev/null || git -C "$PROJECT_DIR" push origin master 2>/dev/null || echo "Already up to date"

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
echo "   Running: vercel --$ENV --yes"

if [ "$ENV" == "production" ]; then
  vercel --prod --cwd "$PROJECT_DIR" --yes 2>&1 || echo "Deploy via: cd $PROJECT_DIR && vercel --prod"
else
  vercel --cwd "$PROJECT_DIR" --yes 2>&1 || echo "Deploy via: cd $PROJECT_DIR && vercel"
fi

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Vercel Monitor will track the deployment status."
echo "You'll be notified if any issues arise."
