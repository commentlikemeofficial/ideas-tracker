# 2nd Brain Web UI — Build Instructions

## Goal
Build a NextJS app that visualizes Clawd knowledge in an Obsidian + Linear style interface.

## Features Required

### 1. Document Viewer
- Read and display Markdown files from:
  - `/home/ubuntu/clawd/.brv/canonical-memory/`
  - `/home/ubuntu/clawd/memory/`
- Nice Markdown rendering with syntax highlighting
- Document search/filter

### 2. Graph View (Obsidian-style)
- Visual graph showing connections between documents
- Nodes = documents, Edges = links between them
- Click to navigate
- Zoom/pan

### 3. List View (Linear-style)
- Clean list of all documents
- Group by folder/category
- Filter by date, type, tags
- Sort options

### 4. Daily Journal
- Auto-generated from memory files
- Timeline view of conversations
- Search across all entries

### 5. Tech Stack
- NextJS 14+ (App Router)
- TypeScript
- Tailwind CSS
- D3.js or ForceGraph for graph visualization
- react-markdown for rendering
- lucide-react for icons

## File Structure
```
app/
  page.tsx              # Main dashboard
  layout.tsx            # Root layout
  graph/
    page.tsx            # Graph visualization
  list/
    page.tsx            # Document list view
  journal/
    page.tsx            # Daily journal view
  doc/
    [path]/
      page.tsx          # Single document view
components/
  GraphView.tsx         # D3 force graph
  DocumentList.tsx      # Linear-style list
  MarkdownRenderer.tsx  # Markdown with syntax highlighting
  Sidebar.tsx           # Navigation
  SearchBar.tsx         # Global search
lib/
  documents.ts          # File reading logic
  graph.ts              # Graph building logic
  journal.ts            # Journal generation
public/
  (static assets)
```

## Data Sources
- `.brv/canonical-memory/` — Agent mandates, rules, user profile
- `memory/` — Daily notes, lessons, knowledge graph

## Design
- Dark mode default (like Obsidian)
- Clean, minimal UI
- Fast navigation
- Mobile responsive

## Success Criteria
- [ ] Can browse all documents
- [ ] Graph shows connections
- [ ] Journal view works
- [ ] Search works
- [ ] Looks good
- [ ] Runs on localhost:3000

Build this now with working code.
