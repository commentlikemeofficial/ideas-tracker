# ContentClaw Quick Reference

**Location:** `/home/ubuntu/clawd/agents/contentclaw/`

## 🎯 What ContentClaw Does

Transforms YouTube videos into platform-ready content:
- 🔍 **Research:** Finds trending topics via Tavily
- 📜 **Extract:** Pulls YouTube transcripts (with fallback)
- ✍️ **Repurpose:** Creates LinkedIn, X, Reddit posts
- 🎨 **Humanize:** Adjusts tone for authenticity
- 📊 **Track:** Logs everything to Google Sheets

## 🚀 Quick Commands

### Repurpose a YouTube Video
```bash
python3 /home/ubuntu/clawd/agents/contentclaw/scripts/contentclaw.py "https://youtube.com/watch?v=VIDEO_ID"
```

### List Recent Content
```bash
python3 /home/ubuntu/clawd/agents/contentclaw/scripts/tracker.py list
```

### Log Content to Sheets
```bash
python3 /home/ubuntu/clawd/agents/contentclaw/scripts/tracker.py log /path/to/content.json
```

## 🛠️ Skills Allocated to ContentClaw

| Skill | Purpose |
|-------|---------|
| `tavily-search` | Trend research |
| `firecrawl` | Web scraping |
| `humanizer` | Tone adjustment |
| `ui-formatter` | Telegram formatting |
| `google-sheets` | Content tracking |
| `youtube-transcript-api` | Video extraction |

## 📁 File Structure

```
/home/ubuntu/clawd/agents/contentclaw/
├── IDENTITY.md           # Agent definition
├── README.md            # This file
├── scripts/
│   ├── contentclaw.py   # Main repurposer
│   └── tracker.py       # Sheets logger
└── memory/
    ├── content_*.json   # Generated content
    └── sheets_log.jsonl # Tracking log
```

## 📝 Output Format

For each video, ContentClaw generates:

1. **💼 LinkedIn Post** — Long-form, professional
2. **🐦 X Thread** — 5-7 punchy tweets
3. **🔴 Reddit Post** — Discussion format
4. **📊 Tracking Entry** — Date, URL, status

## ⚠️ Known Limitations

- **YouTube IP Block:** AWS IPs blocked by YouTube
- **Workaround:** Manual transcript input OR use browser method
- **Future:** Proxy support for transcript API

## 💡 Pro Tips

1. **Best results:** Provide video URL + 3-5 key points manually
2. **Tone:** LinkedIn = professional, X = punchy, Reddit = casual
3. **Always humanize:** Run through humanizer before posting
4. **Track everything:** Update Google Sheets after posting

## 🔄 Workflow Integration

```
You: "Repurpose this: https://youtube.com/watch?v=..."
   ↓
ContentClaw:
   1. Extracts content (or uses fallback)
   2. Generates 3 platform versions
   3. Humanizes tone
   4. Logs to sheets
   5. Delivers ready-to-copy posts
   ↓
You: Copy → Paste → Post
```

## 📊 Tracking Columns

| Column | Description |
|--------|-------------|
| Date | When content created |
| Video_URL | Source YouTube URL |
| Title | Video title |
| Key_Insights | Extracted insights |
| LinkedIn_Post | Full LinkedIn text |
| X_Thread | Thread tweets |
| Reddit_Post | Reddit body |
| Platforms | Target platforms |
| Status | draft/posted |
| Links | Posted URLs |

---

*ContentClaw activated. Ready to repurpose! 🎥✨*
