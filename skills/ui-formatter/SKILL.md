---
name: ui-formatter
description: Transform responses into beautiful Telegram-friendly format with emoji bullets, short lines, clear sections, and mobile-optimized layout. Use when formatting any output for Telegram display, creating readable mobile-friendly responses, or converting tables/lists to emoji format.
---

# UI Formatter

Beautiful Telegram responses. Mobile-first. Emoji-powered.

## Quick Use

```bash
# Format text
python3 /home/ubuntu/clawd/skills/ui-formatter/scripts/format.py --text "Your text here"

# Format file
python3 /home/ubuntu/clawd/skills/ui-formatter/scripts/format.py --file input.md

# Pipe input
echo "Your text" | python3 /home/ubuntu/clawd/skills/ui-formatter/scripts/format.py

# No CTA
python3 /home/ubuntu/clawd/skills/ui-formatter/scripts/format.py --text "Hello" --no-cta
```

## Formatting Rules

### 1. ❌ NO Tables → ✅ Emoji Bullets

**Before:**
```
| Skill | Status |
|-------|--------|
| humanizer | active |
```

**After:**
```
🎨 humanizer — Active
```

### 2. 📱 Short Lines (Max 40 chars)

Long lines wrap automatically for mobile readability.

### 3. ⬜ Clear Sections

Blank lines between sections for visual breathing room.

### 4. 🎨 Emoji Headers

Every section gets a relevant emoji:
- 📋 Summary
- 📊 Results
- 💡 Examples
- ⚙️ Options
- ✅ Status

### 5. **Bold Key Points**

CAPS words and important terms get **bold**.

### 6. 1️⃣ Numbered Lists

Regular numbers become emoji numbers:
- 1. → 1️⃣
- 2. → 2️⃣
- 3. → 3️⃣

### 7. 💬 End with CTA

Every response ends with a call-to-action:
- "Need more details? Just ask! 💬"
- "Want me to dive deeper? 🏊"
- "Questions? I'm here! ❓"

## Example Transformations

### Skills List

**Before:**
```
| Skill | Status | Description |
|-------|--------|-------------|
| humanizer | active | Text transformation |
| firecrawl | active | Web scraping |
```

**After:**
```
🎨 humanizer — Active
   Text transformation

🕸️ firecrawl — Active
   Web scraping

💡 Want me to use any skill?
Just ask!
```

### Status Update

**Before:**
```
Task Master: 3 tasks pending
Self-Improving: 2 lessons learned
Knowledge Graph: 10 entities
```

**After:**
```
📊 Status

✅ Task Master — 3 tasks pending
🧠 Self-Improving — 2 lessons learned
🕸️ Knowledge Graph — 10 entities

💬 Questions? I'm here!
```

### Command Output

**Before:**
```
1. Install dependencies
2. Configure settings
3. Run application
```

**After:**
```
🪜 Steps

1️⃣ Install dependencies
2️⃣ Configure settings
3️⃣ Run application

🚀 Ready when you are!
```

## Emoji Mappings

### Status Emojis
- ✅ Active/Done/Success/Yes
- ❌ Error/Failed/No
- ⏳ Pending/Waiting
- ⚠️ Warning
- 🔴 Important
- 🆕 New
- 🔥 Hot

### Category Emojis
- 🎨 Skill
- 🔧 Tool
- 💻 Code
- 🔌 API
- 📊 Data
- 🗄️ Database
- 🔒 Security
- ⚙️ Config
- 🧪 Test
- 🐛 Bug
- 💡 Idea/Tip
- 📚 Learn/Book

### Action Emojis
- 🔍 Search
- 🔨 Build
- ✨ Create
- ➕ Add
- ✏️ Edit
- 💾 Save
- 📤 Send
- 📥 Get
- 🔄 Update

See [references/emoji-guide.md](references/emoji-guide.md) for complete list.

## Integration

### With Other Skills

Pipe output through formatter:

```bash
# Format task list
python3 /home/ubuntu/clawd/skills/task-master/scripts/task_manager.py list | \
  python3 /home/ubuntu/clawd/skills/ui-formatter/scripts/format.py

# Format search results
python3 /home/ubuntu/clawd/skills/tavily-search/scripts/tavily.py search "AI" | \
  python3 /home/ubuntu/clawd/skills/ui-formatter/scripts/format.py
```

### In Scripts

```python
from ui_formatter.scripts.format import format_telegram

raw_text = get_some_output()
formatted = format_telegram(raw_text)
print(formatted)
```

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `--width` | 40 | Max characters per line |
| `--no-cta` | False | Skip call-to-action |

## Best Practices

1. **Always pipe through formatter** for Telegram output
2. **Use `--no-cta`** for multi-part responses (add CTA at end)
3. **Keep sections short** — mobile users scroll fast
4. **Lead with emoji** — catches the eye
5. **One idea per line** — easier to scan

## Why This Format?

| Problem | Solution |
|---------|----------|
| Tables break on mobile | Emoji bullets |
| Long lines hard to read | 40-char wrap |
| Walls of text | Section breaks |
| Boring headers | Emoji prefixes |
| Missed key points | **Bold** emphasis |
| Plain numbered lists | Emoji numbers |
| Abrupt endings | Friendly CTA |