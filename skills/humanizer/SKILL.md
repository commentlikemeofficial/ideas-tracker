---
name: humanizer
description: Transform AI-generated text into natural, human-sounding prose. Use when the user wants text rewritten to sound less robotic, more conversational, or with specific personality (casual, professional, enthusiastic, blunt). Triggers include "humanize", "make this sound natural", "rewrite less robotic", "add personality", "casual tone".
---

# Humanizer

Transform stiff AI text into prose that sounds like it came from a real person.

## Quick Use

```bash
# Basic humanization (casual tone)
python3 /home/ubuntu/clawd/skills/humanizer/scripts/humanize.py "Your text here"

# Specific tone
python3 /home/ubuntu/clawd/skills/humanizer/scripts/humanize.py "Your text" --tone enthusiastic

# From file
python3 /home/ubuntu/clawd/skills/humanizer/scripts/humanize.py /path/to/text.txt
```

## Tones

- **casual** (default): Conversational, varied sentences, occasional fillers
- **professional**: Polished but natural, fewer contractions
- **enthusiastic**: High energy, exclamations, more fillers
- **blunt**: Direct, minimal fluff, gets to the point

## What It Does

1. **Removes robo-phrases**: "It is important to note", "Let's dive in", etc.
2. **Loosens transitions**: "Furthermore" → "Plus", "However" → "But"
3. **Adds contractions**: "do not" → "don't", "it is" → "it's"
4. **Varies sentence length**: Breaks up monotonous rhythm
5. **Inserts fillers** (casual): "honestly", "I mean", "basically"
6. **Adds imperfections**: Occasional lowercase starts, ellipsis

## Examples

**Input:**
> "Furthermore, it is important to note that the implementation does not support asynchronous operations. However, this limitation can be overcome by utilizing a worker thread."

**Output (casual):**
> "Plus, the implementation doesn't support async operations. But honestly, you can work around that with a worker thread."

**Output (blunt):**
> "Implementation doesn't do async. Use a worker thread."

## When to Use

- Before publishing AI-drafted content
- Making responses feel less corporate
- Adapting tone for different audiences
- Breaking repetitive AI patterns