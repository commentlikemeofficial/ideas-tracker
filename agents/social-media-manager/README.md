# 📱 Social Media Manager Agent

## Overview
Manages content distribution across LinkedIn, X (Twitter), and Reddit - curating and presenting final content for human approval.

## Philosophy
**NO AUTO-POSTING** - All content is presented to you for final approval before publishing.

## NEW: Just-in-Time Delivery
**Don't send early - user will forget!**

Send reminders **5 MINUTES BEFORE** optimal posting time with:
- ✅ Copy-paste ready content
- ✅ Generated image attached
- ✅ Direct Telegram delivery

## Posting Schedule (IST)

| Platform | Optimal Time | Reminder Time | Image Style |
|----------|--------------|---------------|-------------|
| **LinkedIn** | 11:00 AM | **10:55 AM** | Professional, clean, corporate |
| **X/Twitter** | 4:00 PM | **3:55 PM** | Bold, punchy, high contrast |
| **Reddit** | 7:00 PM | **6:55 PM** | Informative, discussion-focused |

## Daily Workflow

### Morning Preparation (9:15 AM IST)
1. Check ContentClaw output from 9 AM run
2. Review and rank all generated posts
3. Select top 3 posts for the day
4. **Generate images** for each platform
5. **Schedule reminders** - DO NOT send yet!

### Reminder Delivery (Just-in-Time)
- **10:55 AM** → Send LinkedIn post + image
- **3:55 PM** → Send X post + image  
- **6:55 PM** → Send Reddit post + image

### Evening Preparation (9:15 PM IST)
1. Check ContentClaw output from 9 PM run
2. Prepare next day's content
3. Generate images
4. Schedule reminders

## Image Generation

Each post gets a custom image:

### LinkedIn Images
- Professional, minimalist design
- Single concept visualization
- Clean typography
- Blue/purple color scheme

### X/Twitter Images
- Bold, high contrast
- Attention-grabbing headlines
- Square format (1200x1200)
- Meme-style or infographic

### Reddit Images
- Educational diagrams
- Screenshot-friendly
- Clear, readable text
- Informative graphics

## Output Format (What User Receives)

### Telegram Message + Image

```
🚨 POST IN 5 MINUTES! 🚨

🟦 LINKEDIN POST (11:00 AM)
Copy this now 👇

---
I finally understand neural networks...
[full post text]
---

📎 Image attached - use this!

⏰ Post at exactly 11:00 AM IST for max engagement

#LinkedIn #AI #ContentReady
```

**+ Attached Image**

## Integration Flow

```
ContentClaw generates content
    ↓
Social Media Manager curates (9:15 AM)
    ↓
Generate images for each platform
    ↓
Schedule 3 reminder messages
    ↓
10:55 AM → Send LinkedIn reminder + image
3:55 PM → Send X reminder + image  
6:55 PM → Send Reddit reminder + image
    ↓
User copies & posts immediately
```

## Image Prompts Template

### For LinkedIn (Professional)
```
Create a professional LinkedIn header image for a post about:
[TOPIC]

Style: Clean, minimalist, corporate
Colors: Blue, white, subtle gradients
Elements: Abstract tech visualization, professional typography
No text in image - just visuals
Format: 1200x627px (LinkedIn optimal)
```

### For X/Twitter (Bold)
```
Create a bold Twitter/X image for a post about:
[TOPIC]

Style: High contrast, attention-grabbing, modern
Colors: Dark background, bright accent colors
Elements: Single striking visual, meme-worthy
Format: 1200x1200px (square)
```

### For Reddit (Informative)
```
Create an informative image for a Reddit post about:
[TOPIC]

Style: Educational, diagram-style, clear
Colors: Neutral, easy to read
Elements: Infographic elements, icons, clean layout
Format: 1200x800px (readable)
```

## Commands

```bash
# Generate daily content package (morning)
./scripts/generate-daily-package.sh

# Generate images for today's content
./scripts/generate-images.sh

# Send reminder (called by cron at specific times)
./scripts/send-reminder.sh linkedin
./scripts/send-reminder.sh x
./scripts/send-reminder.sh reddit

# Check posting schedule
./scripts/show-schedule.sh

# Review performance
./scripts/performance-report.sh
```

## Cron Schedule

```cron
# Morning preparation (after ContentClaw runs)
15 9 * * * cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/generate-daily-package.sh && ./scripts/generate-images.sh

# LinkedIn reminder (10:55 AM IST = 5:25 AM UTC)
25 5 * * * cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/send-reminder.sh linkedin

# X/Twitter reminder (3:55 PM IST = 10:25 AM UTC)
25 10 * * * cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/send-reminder.sh x

# Reddit reminder (6:55 PM IST = 1:25 PM UTC)
25 13 * * * cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/send-reminder.sh reddit

# Evening preparation
15 21 * * * cd /home/ubuntu/clawd/agents/social-media-manager && ./scripts/generate-daily-package.sh && ./scripts/generate-images.sh
```

## Files Managed

- `content-calendar.md` - Weekly/monthly content plan
- `performance-tracking.md` - Engagement metrics
- `best-performing-posts.md` - Top content archive
- `daily-packages/` - Daily content ready for approval
- `images/` - Generated images for each platform
- `scheduled-reminders.json` - Reminder schedule tracking
