#!/usr/bin/env python3
"""
ui-formatter: Transform responses into beautiful Telegram-friendly format
"""
import re
import sys
import argparse

# Emoji mappings for common terms
EMOJI_MAP = {
    # Status
    "active": "✅",
    "done": "✅",
    "complete": "✅",
    "success": "✅",
    "ready": "✅",
    "pending": "⏳",
    "waiting": "⏳",
    "error": "❌",
    "failed": "❌",
    "warning": "⚠️",
    "important": "🔴",
    "new": "🆕",
    "hot": "🔥",
    "cool": "❄️",
    
    # Actions
    "search": "🔍",
    "find": "🔍",
    "build": "🔨",
    "create": "✨",
    "add": "➕",
    "delete": "🗑️",
    "remove": "❌",
    "update": "🔄",
    "edit": "✏️",
    "write": "✍️",
    "read": "📖",
    "send": "📤",
    "get": "📥",
    "save": "💾",
    "load": "📂",
    
    # Categories
    "skill": "🎨",
    "tool": "🔧",
    "code": "💻",
    "api": "🔌",
    "data": "📊",
    "file": "📄",
    "folder": "📁",
    "link": "🔗",
    "url": "🌐",
    "web": "🕸️",
    "server": "🖥️",
    "cloud": "☁️",
    "database": "🗄️",
    "security": "🔒",
    "password": "🔑",
    "key": "🔑",
    "config": "⚙️",
    "setting": "⚙️",
    "test": "🧪",
    "bug": "🐛",
    "fix": "🔧",
    "idea": "💡",
    "tip": "💡",
    "note": "📝",
    "info": "ℹ️",
    "help": "❓",
    "question": "❓",
    "learn": "📚",
    "book": "📚",
    "money": "💰",
    "cost": "💵",
    "price": "💵",
    "time": "⏰",
    "date": "📅",
    "calendar": "📅",
    "schedule": "📅",
    "morning": "🌅",
    "night": "🌙",
    "day": "☀️",
    "week": "📆",
    "month": "🗓️",
    "year": "📅",
    
    # People
    "user": "👤",
    "person": "👤",
    "people": "👥",
    "team": "👥",
    "friend": "🤝",
    
    # Results
    "result": "📋",
    "output": "📤",
    "input": "📥",
    "summary": "📋",
    "list": "📃",
    "stats": "📊",
    "graph": "📈",
    "chart": "📊",
    "number": "🔢",
    "count": "🔢",
    "amount": "💰",
    "total": "🧮",
    "score": "🏆",
    "win": "🏆",
    "best": "⭐",
    "good": "👍",
    "bad": "👎",
    "yes": "✅",
    "no": "❌",
    "ok": "👌",
    
    # Arrows
    "next": "➡️",
    "prev": "⬅️",
    "up": "⬆️",
    "down": "⬇️",
    "arrow": "➡️",
    "start": "🚀",
    "begin": "🚀",
    "stop": "🛑",
    "end": "🏁",
    "finish": "🏁",
}

# Section headers with emojis
SECTION_HEADERS = {
    "summary": "📋 Summary",
    "overview": "📋 Overview",
    "result": "📊 Results",
    "results": "📊 Results",
    "output": "📤 Output",
    "input": "📥 Input",
    "status": "📊 Status",
    "info": "ℹ️ Info",
    "information": "ℹ️ Information",
    "detail": "📖 Details",
    "details": "📖 Details",
    "feature": "✨ Features",
    "features": "✨ Features",
    "usage": "📝 Usage",
    "example": "💡 Examples",
    "examples": "💡 Examples",
    "command": "⌨️ Commands",
    "commands": "⌨️ Commands",
    "option": "⚙️ Options",
    "options": "⚙️ Options",
    "setting": "⚙️ Settings",
    "config": "⚙️ Configuration",
    "tip": "💡 Tips",
    "tips": "💡 Tips",
    "warning": "⚠️ Warning",
    "error": "❌ Errors",
    "note": "📝 Notes",
    "note": "📝 Note",
    "step": "🪜 Steps",
    "steps": "🪜 Steps",
    "install": "📦 Installation",
    "setup": "🔧 Setup",
    "quick": "🚀 Quick Start",
    "start": "🚀 Getting Started",
    "link": "🔗 Links",
    "url": "🌐 URLs",
    "source": "📚 Sources",
    "ref": "📚 References",
    "reference": "📚 References",
}

CTA_PHRASES = [
    "Need more details? Just ask! 💬",
    "Want me to dive deeper? 🏊",
    "Questions? I'm here! ❓",
    "Ready for the next step? 🚀",
    "What would you like to explore next? 🔍",
    "Anything else on your mind? 💭",
    "Should I explain anything further? 📚",
    "Hit me with your next request! 👊",
    "What's cooking? 🍳",
    "Ready when you are! ⚡",
]

NUMBER_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

def wrap_text(text, max_length=40):
    """Wrap text to max characters per line."""
    lines = []
    for paragraph in text.split('\n'):
        if not paragraph.strip():
            lines.append('')
            continue
        
        words = paragraph.split()
        current_line = []
        current_length = 0
        
        for word in words:
            word_length = len(word)
            if current_length + word_length + len(current_line) <= max_length:
                current_line.append(word)
                current_length += word_length
            else:
                lines.append(' '.join(current_line))
                current_line = [word]
                current_length = word_length
        
        if current_line:
            lines.append(' '.join(current_line))
    
    return '\n'.join(lines)

def convert_table_to_bullets(text):
    """Convert markdown tables to emoji bullets."""
    lines = text.split('\n')
    result = []
    in_table = False
    table_data = []
    
    for line in lines:
        # Detect table start
        if '|' in line and not in_table:
            in_table = True
            table_data = []
        
        if in_table:
            if '|' in line:
                # Skip separator lines (---|---)
                if '---' in line.replace(' ', ''):
                    continue
                
                # Parse table row
                cells = [cell.strip() for cell in line.split('|') if cell.strip()]
                if cells:
                    table_data.append(cells)
            else:
                # Table ended
                in_table = False
                # Convert table data to bullets
                if table_data:
                    headers = table_data[0] if table_data else []
                    for row in table_data[1:]:
                        if len(row) >= 2:
                            # Format: emoji name — value
                            name = row[0]
                            value = row[1] if len(row) > 1 else ""
                            emoji = get_emoji_for_term(name)
                            result.append(f"{emoji} {name} — {value}")
                        elif row:
                            emoji = get_emoji_for_term(row[0])
                            result.append(f"{emoji} {row[0]}")
                result.append('')  # Blank line after table
        else:
            result.append(line)
    
    # Handle table at end
    if in_table and table_data:
        for row in table_data[1:]:
            if len(row) >= 2:
                name = row[0]
                value = row[1] if len(row) > 1 else ""
                emoji = get_emoji_for_term(name)
                result.append(f"{emoji} {name} — {value}")
            elif row:
                emoji = get_emoji_for_term(row[0])
                result.append(f"{emoji} {row[0]}")
    
    return '\n'.join(result)

def get_emoji_for_term(term):
    """Get appropriate emoji for a term."""
    term_lower = term.lower()
    
    # Direct match
    if term_lower in EMOJI_MAP:
        return EMOJI_MAP[term_lower]
    
    # Check if term contains any keyword
    for keyword, emoji in EMOJI_MAP.items():
        if keyword in term_lower:
            return emoji
    
    # Default emoji
    return "•"

def add_emoji_to_headers(text):
    """Add emojis to section headers."""
    lines = text.split('\n')
    result = []
    
    for line in lines:
        # Check if line is a header (starts with # or is ALL CAPS or ends with :)
        is_header = False
        header_text = ""
        
        if line.startswith('#'):
            # Markdown header
            header_text = line.lstrip('#').strip()
            is_header = True
        elif line.isupper() and len(line) > 3 and len(line) < 50:
            # ALL CAPS header
            header_text = line
            is_header = True
        elif line.strip().endswith(':') and len(line) < 50:
            # Ends with colon
            header_text = line.strip().rstrip(':')
            is_header = True
        
        if is_header and header_text:
            header_lower = header_text.lower()
            if header_lower in SECTION_HEADERS:
                result.append(SECTION_HEADERS[header_lower])
            else:
                # Add generic emoji based on content
                emoji = get_emoji_for_term(header_text)
                result.append(f"{emoji} {header_text}")
        else:
            result.append(line)
    
    return '\n'.join(result)

def convert_numbered_lists(text):
    """Convert numbered lists to emoji numbers."""
    lines = text.split('\n')
    result = []
    
    for line in lines:
        # Match patterns like "1. " or "1) " at start of line
        match = re.match(r'^(\d+)\.[\s\t]+(.+)$', line)
        if match:
            num = int(match.group(1))
            content = match.group(2)
            if 1 <= num <= 10:
                emoji = NUMBER_EMOJIS[num - 1]
                result.append(f"{emoji} {content}")
            else:
                result.append(line)
        else:
            result.append(line)
    
    return '\n'.join(result)

def add_blank_lines(text):
    """Add blank lines between sections for clarity."""
    lines = text.split('\n')
    result = []
    prev_was_header = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Check if this is a header (has emoji or specific patterns)
        is_header = bool(re.match(r'^[📋📊📤📥ℹ️📖✨📝💡⌨️⚙️🔧🚀🔗📚⚠️❌🔍💰📅🔢🎨🔧💻🕸️🌐🔌📊📄📁☁️🗄️🔒🔑⚙️🧪🐛💡📝ℹ️❓📚💰💵⏰📅📆🗓️🌅🌙☀️📆👤👥🤝📋📤📥📃📊📈🔢🧮🏆⭐👍👎✅❌👌➡️⬅️⬆️⬇️🚀🛑🏁]', stripped))
        
        # Add blank line before headers (except first line)
        if is_header and i > 0 and not prev_was_header and result and result[-1].strip():
            result.append('')
        
        result.append(line)
        prev_was_header = is_header
    
    return '\n'.join(result)

def bold_key_points(text):
    """Bold important phrases."""
    # Bold patterns like "Note:", "Important:", "Warning:"
    text = re.sub(r'^(Note|Important|Warning|Tip|Key|Critical|Alert):', r'**\1:**', text, flags=re.MULTILINE)
    
    # Bold CAPS words (3-15 chars)
    def bold_caps(match):
        word = match.group(0)
        if len(word) >= 3 and len(word) <= 15:
            return f"**{word}**"
        return word
    
    text = re.sub(r'\b[A-Z]{3,15}\b', bold_caps, text)
    
    return text

def add_cta(text):
    """Add call-to-action at end."""
    import random
    cta = random.choice(CTA_PHRASES)
    
    # Check if text already ends with CTA-like phrase
    if any(phrase.split()[0] in text[-100:].lower() for phrase in CTA_PHRASES):
        return text
    
    # Add blank line if needed
    if not text.endswith('\n'):
        text += '\n'
    
    return text + '\n' + cta

def format_telegram(text, add_cta_flag=True, max_line_length=40):
    """Apply all Telegram formatting rules."""
    # 1. Convert tables to bullets
    text = convert_table_to_bullets(text)
    
    # 2. Add emoji headers
    text = add_emoji_to_headers(text)
    
    # 3. Convert numbered lists
    text = convert_numbered_lists(text)
    
    # 4. Bold key points
    text = bold_key_points(text)
    
    # 5. Add blank lines between sections
    text = add_blank_lines(text)
    
    # 6. Wrap text
    text = wrap_text(text, max_line_length)
    
    # 7. Add CTA
    if add_cta_flag:
        text = add_cta(text)
    
    return text

def main():
    parser = argparse.ArgumentParser(description="Format text for Telegram")
    parser.add_argument("--file", "-f", help="Input file")
    parser.add_argument("--text", "-t", help="Input text")
    parser.add_argument("--no-cta", action="store_true", help="Skip CTA")
    parser.add_argument("--width", "-w", type=int, default=40, help="Max line width")
    
    args = parser.parse_args()
    
    # Get input
    if args.file:
        with open(args.file) as f:
            text = f.read()
    elif args.text:
        text = args.text
    else:
        text = sys.stdin.read()
    
    # Format
    formatted = format_telegram(text, not args.no_cta, args.width)
    
    # Output
    print(formatted)

if __name__ == "__main__":
    main()