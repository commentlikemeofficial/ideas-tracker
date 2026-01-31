#!/bin/bash
# update-calendar.sh - Update content calendar

echo "🗓️  Content Calendar Update"
echo "=========================="
echo ""

CALENDAR_FILE="/home/ubuntu/clawd/agents/social-media-manager/content-calendar.md"

# Create calendar if doesn't exist
if [ ! -f "$CALENDAR_FILE" ]; then
    cat > "$CALENDAR_FILE" << 'EOF'
# 📅 Content Calendar

## Week of $(date +%Y-W%V)

| Date | Platform | Content Type | Topic | Status |
|------|----------|--------------|-------|--------|
| Mon | LinkedIn | Motivation | Week goals | ⏳ |
| Mon | X | Insight | Quick tip | ⏳ |
| Tue | LinkedIn | Educational | AI/Tech | ⏳ |
| Tue | X | Thread | Deep dive | ⏳ |
| Wed | LinkedIn | Thought Leadership | Industry trends | ⏳ |
| Wed | Reddit | Discussion | Ask community | ⏳ |
| Thu | LinkedIn | Case Study | Project showcase | ⏳ |
| Thu | X | Hot Take | Controversial opinion | ⏳ |
| Fri | LinkedIn | Achievement | Week recap | ⏳ |
| Sat | Reddit | Educational | Weekend read | ⏳ |
| Sun | - | - | Rest day | ✅ |

## Monthly Themes

- Week 1: AI & Technology
- Week 2: Entrepreneurship & Business
- Week 3: Personal Growth & Productivity
- Week 4: Community & Networking

## Content Pillars

1. **Educational** (40%) - Teach what you know
2. **Thought Leadership** (30%) - Share opinions
3. **Personal** (20%) - Behind the scenes
4. **Promotional** (10%) - Your projects
EOF
    echo "✅ Created new calendar: $CALENDAR_FILE"
else
    echo "📄 Calendar exists: $CALENDAR_FILE"
    echo ""
    echo "Current calendar:"
    echo "==============="
    cat "$CALENDAR_FILE"
fi
