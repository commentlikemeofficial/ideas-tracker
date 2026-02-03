# ContentClaw v2.0 - Multi-Framework Content Generator

**Status:** ✅ ACTIVE | **Mode:** ONE framework per run | **Tracking:** Performance enabled

## 🎯 What's New in v2.0

### 1. One Framework Per Run
- Pick ONE framework per video
- Test performance individually
- Compare which gets better reach/engagement

### 2. Platform Character Limits Enforced
| Platform | Limit | Notes |
|----------|-------|-------|
| **X/Twitter** | 280 chars/tweet | Auto-truncated if needed |
| **LinkedIn** | 1,300 chars | Above "see more" threshold |
| **Reddit** | 3,000 chars | Practical readability limit |

### 3. Performance Tracking
Every run is logged with:
- Framework used
- Platform performance metrics
- Viral flag (when content performs well)
- Comparison data across frameworks

## 🎨 Available Frameworks

| Framework | Emoji | Style | Best For |
|-----------|-------|-------|----------|
| **hormozi** | 💰 | $100M Offers, value-stacking, risk reversal | Conversion, sales |
| **garyvee** | 👊 | Jab-Jab-Hook, give-give-ask | Engagement, community |
| **naval** | 🧠 | Philosophical, concise wisdom | Thought leadership |
| **storytelling** | 📖 | Story arc, emotional narrative | Relatability, sharing |
| **aida** | 🎯 | Attention-Interest-Desire-Action | Direct response |

## 🚀 Usage

### Generate Content (One Framework)
```bash
python3 /home/ubuntu/clawd/agents/contentclaw/scripts/contentclaw_v2.py \
  "Video Title" \
  "Channel Name" \
  <framework>

# Examples:
python3 contentclaw_v2.py "AI Business" "JohnnyTube" hormozi
python3 contentclaw_v2.py "AI Business" "JohnnyTube" garyvee
python3 contentclaw_v2.py "AI Business" "JohnnyTube" naval
```

### Output
- ✅ LinkedIn post (1,300 char limit)
- ✅ X thread (280 chars/tweet)
- ✅ Reddit post (3,000 char limit)
- ✅ Saved to memory/
- ✅ Tracked for performance

## 📊 Testing Strategy (A/B/C/D/E Test)

**Week 1:** Use `hormozi` framework for all videos
**Week 2:** Use `garyvee` framework for all videos  
**Week 3:** Use `naval` framework for all videos
**Week 4:** Use `storytelling` framework for all videos

**Track:**
- Engagement rates per framework
- Which gets more LinkedIn views
- Which X threads get most impressions
- Which Reddit posts get most upvotes

**Winner = Your default framework going forward**

## 📁 Files

```
/home/ubuntu/clawd/agents/contentclaw/
├── scripts/
│   ├── contentclaw_v2.py       # Main generator
│   └── frameworks.py           # All framework templates
├── memory/
│   ├── hormozi_20260130.json   # Hormozi outputs
│   ├── garyvee_20260130.json   # Gary Vee outputs
│   ├── tracking.jsonl          # Performance log
│   └── viral_posts.json        # Best performers
└── FRAMEWORKS.md               # This file
```

## 🏆 Performance Tracking Format

```json
{
  "date": "2026-01-30",
  "video_title": "AI Business Automation",
  "framework": "hormozi",
  "platforms": ["linkedin", "x", "reddit"],
  "performance": {
    "linkedin_views": 1240,
    "linkedin_engagement": 45,
    "x_impressions": 8900,
    "x_engagement": 234,
    "reddit_upvotes": 89,
    "viral": true
  }
}
```

## 🎯 Goal

Find your **best-performing framework** through systematic testing, then double down on what works!

---

*ContentClaw v2.0 - Framework optimization mode activated* 🎯
