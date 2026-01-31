# 💡 Ideas Tracker

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  <b>🚀 Turn your shower thoughts into validated business opportunities</b>
</p>

<p align="center">
  <a href="https://ideas-tracker-demo.vercel.app">🌐 Live Demo</a> • 
  <a href="#features">✨ Features</a> • 
  <a href="#getting-started">🚀 Getting Started</a> • 
  <a href="#scoring-system">📊 Scoring System</a>
</p>

---

## ✨ Features

### 🎯 Smart Idea Scoring
- **4-Dimensional Scoring**: Market Size, Competition, Technical Feasibility, Personal Fit
- **Visual Score Cards**: Color-coded progress bars (🔴 🟡 🟢)
- **Auto-ranking**: Ideas sorted by total score (max 40 points)

### 📊 Status Pipeline
Track your ideas through the journey:

```
🔍 Researching → ✅ Validating → 🚀 Building → 🎉 Launched
      ↓              ↓             ↓            ↓
   Exploring     Talking to     MVP dev      Live & 
   the market    customers      in progress  monetizing
```

### 🔍 Powerful Filtering
- **Real-time search** across titles, descriptions, and markets
- **Status filters** with emoji indicators
- **Smart sorting** by score, date, or alphabetically

### 💾 Local-First Storage
- **Zero backend needed** - stores everything in browser
- **Instant load** - no API calls, no latency
- **Privacy-first** - your ideas stay on your device

### 🎨 Premium UI/UX
- **Dark mode by default** - easy on the eyes
- **Glassmorphism effects** - modern, sleek aesthetics
- **Smooth animations** - delightful micro-interactions
- **Responsive design** - works on mobile, tablet, desktop

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/commentlikemeofficial/ideas-tracker.git

# Navigate to project
cd ideas-tracker/my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start tracking! 🎉

---

## 📊 Scoring System

Each idea is scored across 4 dimensions (1-10 scale):

| Dimension | Question to Ask | Weight |
|-----------|----------------|--------|
| **Market Size** 🌍 | How big is the addressable market? | 10 pts |
| **Competition** ⚔️ | How crowded is the space? (Higher = less competition) | 10 pts |
| **Technical Feasibility** 🛠️ | Can you build this with current tech? | 10 pts |
| **Personal Fit** 💪 | Are YOU the right person to build this? | 10 pts |

### Score Interpretation

| Score | Rating | Action |
|-------|--------|--------|
| 32-40 | 🟢 **Go!** | High potential, start validating |
| 24-31 | 🟡 **Maybe** | Promising but needs refinement |
| 16-23 | 🟠 **Research** | Needs more validation |
| 0-15 | 🔴 **Pass** | Probably not worth pursuing |

---

## 🎯 Use Cases

### For Indie Hackers
Track multiple SaaS ideas, compare scores, pick winners

### For Product Managers
Organize feature ideas, prioritize roadmap

### For Startup Founders
Validate concepts before building, track pivot ideas

### For Side Project Junkies
Never lose a shower thought again!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State**: React Hooks + LocalStorage

---

## 📝 Sample Ideas Included

The app comes pre-loaded with 5 sample ideas to demonstrate the workflow:

1. **AI Content Repurposing SaaS** - Transform one video into 30+ pieces
2. **Micro-SaaS for Notion** - Niche workflow automation
3. **No-Code Website Builder** - AI-powered landing pages
4. **Developer API Marketplace** - Stripe for APIs
5. **Community Platform for Indie Hackers** - Network + accountability

---

## 🎨 Customization

### Adding Custom Statuses

Edit `lib/types.ts`:

```typescript
export type IdeaStatus = 
  | 'Researching' 
  | 'Validating' 
  | 'Building' 
  | 'Launched'
  | 'Your Custom Status';
```

### Modifying Score Criteria

Change the scoring dimensions in `lib/types.ts`:

```typescript
export interface IdeaScores {
  marketSize: number;
  competition: number;
  technicalFeasibility: number;
  personalFit: number;
  yourCustomMetric: number; // Add new!
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions welcome! Check out [issues](https://github.com/commentlikemeofficial/ideas-tracker/issues) for ideas.

```bash
# Fork the repo
git clone https://github.com/YOUR_USERNAME/ideas-tracker.git

# Create a branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push and PR
git push origin feature/amazing-feature
```

---

## 📸 Screenshots

### Dashboard
*Main view with all ideas, search, and filters*

### Idea Detail
*Deep dive into a single idea with scoring breakdown*

### Add/Edit Form
*Comprehensive idea entry with 4-dimension scoring*

---

## 🔮 Roadmap

- [ ] **Export to CSV/JSON** - Take your data anywhere
- [ ] **Cloud Sync** - Optional Supabase backend
- [ ] **AI Validation** - GPT-powered idea analysis
- [ ] **Kanban Board** - Drag-and-drop status management
- [ ] **Tags System** - Categorize by tech stack, market, etc.
- [ ] **Dark/Light Toggle** - User preference
- [ ] **PWA Support** - Install as mobile app

---

## 💖 Support

If this tool helps you launch your next project, consider:

- ⭐ Starring the repo
- 🐦 Tweeting about it
- 🍕 Buying me a coffee

---

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/commentlikemeofficial">@commentlikemeofficial</a>
</p>

<p align="center">
  <i>"The best time to track an idea was when you had it. The second best time is now."</i>
</p>
