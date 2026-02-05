# Steve Setup Guide — For New OpenClaw Instance

Complete guide to recreate this Steve workspace on a new machine.

---

## 1. Prerequisites

```bash
# Install Node.js 22+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Clawdbot
npm install -g clawdbot
```

---

## 2. Clone This Repository

```bash
git clone https://github.com/commentlikemeofficial/ideas-tracker.git clawd
cd clawd
```

### Option A: Quick Restore (Full Backup Included)

This repo includes complete OpenClaw configuration:

```bash
# Restore OpenClaw config to your home directory
mkdir -p ~/.openclaw
cp -r openclaw-config/* ~/.openclaw/

# Restore ByteRover config
mkdir -p ~/.brv
cp -r .brv/* ~/.brv/

# Create symlink (Clawdbot expects this)
ln -sf ~/.openclaw ~/.clawdbot
```

Done! Skip to Step 9.

### Option B: Fresh Setup (Manual)

Continue with steps 3-8 below for manual configuration.

---

## 3. Install All Skills

```bash
# Core skills
clawdbot skills install byterover
clawdbot skills install knowledge-graph
clawdbot skills install self-improving
clawdbot skills install context7
clawdbot skills install deepwiki
clawdbot skills install agent-browser
clawdbot skills install agent-builder
clawdbot skills install bird
clawdbot skills install reddit-cli
clawdbot skills install morning-brief
clawdbot skills install personal-greeting
clawdbot skills install humanizer
clawdbot skills install ui-formatter
clawdbot skills install sysadmin-toolbox
clawdbot skills install steve-diagnostics
clawdbot skills install dont-hack-me
clawdbot skills install firecrawl
clawdbot skills install tavily-search
clawdbot skills install mcporter
clawdbot skills install cron
clawdbot skills install weather
clawdbot skills install google-sheets
clawdbot skills install notion
clawdbot skills install github
clawdbot skills install nano-pdf
clawdbot skills install nano-banana-pro
clawdbot skills install bd-bot
clawdbot skills install prompt-log
clawdbot skills install auto-updater
clawdbot skills install execution-governor
clawdbot skills install bluebubbles
clawdbot skills install clawdhub
clawdbot skills install skill-creator
clawdbot skills install tmux
clawdbot skills install slack
clawdbot skills install coding-agent
clawdbot skills install clawddocs
```

---

## 4. Configure API Keys

Create `.env` file in `/home/ubuntu/clawd/`:

```bash
# YouTube Data API
YOUTUBE_API_KEY=your_key_here

# OpenAI (if using)
OPENAI_API_KEY=your_key_here

# Gemini (for Nano Banana Pro image generation)
GEMINI_API_KEY=your_key_here
```

Also add to `~/.bashrc`:
```bash
export GEMINI_API_KEY=your_key_here
export OPENAI_API_KEY=your_key_here
```

---

## 5. Setup ByteRover

```bash
# Install ByteRover CLI
npm install -g @byterover/cli

# Initialize in the clawd directory
brv init

# Copy canonical memory from backup
# (You'll need to manually recreate or restore .brv/canonical-memory/)
```

---

## 6. Configure Social Media (Optional)

### X/Twitter (bird CLI)
```bash
# Get auth tokens from browser cookies:
# - auth_token
# - ct0
# Store in memory/YYYY-MM-DD.md or secure location
```

### Reddit (reddit-cli)
```bash
# Get cookies from browser:
# - reddit_session
# - token_v2
# Store in memory/YYYY-MM-DD.md or secure location
```

---

## 7. Configure Notion (Optional)

```bash
mkdir -p ~/.config/notion
echo "your_notion_api_key" > ~/.config/notion/api_key
```

---

## 8. Initialize Knowledge Systems

```bash
# Create memory directory structure
mkdir -p memory

# Initialize lessons.json
cat > memory/lessons.json << 'EOF'
{
  "lessons": [],
  "patterns": {},
  "tool_effectiveness": {},
  "next_id": 1
}
EOF

# Create daily learning log
touch memory/daily-learning-log.md

# Initialize knowledge graph
python3 skills/knowledge-graph/scripts/check_graph.py
```

---

## 9. First Run Checklist

Start a new session and verify:

1. **Read core files:**
   - `SOUL.md`
   - `USER.md`
   - `MEMORY.md`
   - `AGENTS.md`
   - `HEARTBEAT.md`

2. **Test ByteRover:**
   ```bash
   brv query "What is the current project context?"
   ```

3. **Test Knowledge Graph:**
   ```bash
   python3 skills/knowledge-graph/scripts/check_graph.py
   ```

4. **Verify skills:**
   ```bash
   clawdbot skills list
   ```

---

## 10. Connect Telegram (Optional)

```bash
# Start Clawdbot gateway
clawdbot gateway start

# Get bot token from @BotFather
# Configure in clawdbot.json or via web UI
```

---

## Files That Persist Everything

| File | Purpose |
|------|---------|
| `AGENTS.md` | Operating rules, learning system |
| `MEMORY.md` | Long-term memory, user context |
| `HEARTBEAT.md` | Periodic checks schedule |
| `SOUL.md` | Personality and behavior |
| `USER.md` | User preferences |
| `IDENTITY.md` | Steve's identity |
| `.brv/canonical-memory/` | ByteRover knowledge base |
| `memory/lessons.json` | Learned lessons |
| `memory/daily-learning-log.md` | Human-readable learning |
| `memory/knowledge_graph.json` | Entity relationships |

---

## What NOT to Commit (Sensitive)

- `.env` (API keys)
- `~/.openclaw/` (session tokens, credentials)
- `memory/` daily files with auth tokens
- Browser cookies/auth tokens

---

## Quick Restore Commands

```bash
# Full backup
tar -czvf clawd-backup-$(date +%Y%m%d-%H%M).tar.gz ~/clawd

# Restore
cd ~
tar -xzvf clawd-backup-YYYYMMDD-HHMM.tar.gz
```

---

*Generated: 2026-02-05*
*Repo: https://github.com/commentlikemeofficial/ideas-tracker*
