#!/usr/bin/env python3
"""
humanizer: Transform AI-generated text into natural human-sounding prose
"""
import sys
import re
import random

# Humanization patterns
FILLERS = ["honestly", "look", "basically", "honestly", "I mean", "sort of", "kind of", "you know"]
CONTRACTIONS = {
    "do not": "don't", "does not": "doesn't", "did not": "didn't",
    "is not": "isn't", "are not": "aren't", "was not": "wasn't", "were not": "weren't",
    "cannot": "can't", "could not": "couldn't", "would not": "wouldn't",
    "should not": "shouldn't", "will not": "won't", "shall not": "shan't",
    "it is": "it's", "that is": "that's", "there is": "there's", "what is": "what's",
    "they are": "they're", "you are": "you're", "we are": "we're",
    "I am": "I'm", "I will": "I'll", "I would": "I'd",
}
ROBOTIC_TRANSITIONS = [
    (r"Furthermore[,;]?", "Plus"),
    (r"Moreover[,;]?", "Also"),
    (r"Additionally[,;]?", "On top of that"),
    (r"However[,;]?", "But"),
    (r"Nevertheless[,;]?", "Still"),
    (r"Therefore[,;]?", "So"),
    (r"Consequently[,;]?", "That's why"),
    (r"As a result[,;]?", "So"),
    (r"In conclusion[,;]?", "Bottom line"),
    (r"To summarize[,;]?", "TL;DR"),
    (r"First[ly]?[,;]?", "First off"),
    (r"Secondly[,;]?", "Next"),
    (r"Finally[,;]?", "Last thing"),
]

def add_fillers(text, density=0.1):
    """Insert occasional conversational fillers."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    result = []
    for sent in sentences:
        if random.random() < density and len(sent) > 20:
            filler = random.choice(FILLERS)
            if sent[0].isupper():
                sent = f"{filler}, {sent[0].lower()}{sent[1:]}"
        result.append(sent)
    return ' '.join(result)

def apply_contractions(text):
    """Convert formal phrases to contractions."""
    for formal, contraction in CONTRACTIONS.items():
        text = re.sub(rf'\b{formal}\b', contraction, text, flags=re.IGNORECASE)
    return text

def loosen_transitions(text):
    """Replace robotic transitions with casual ones."""
    for pattern, replacement in ROBOTIC_TRANSITIONS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text

def vary_sentence_length(text):
    """Break long sentences, combine short ones occasionally."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    result = []
    i = 0
    while i < len(sentences):
        sent = sentences[i]
        words = sent.split()
        # Break very long sentences
        if len(words) > 25 and ',' in sent:
            parts = sent.split(', ', 1)
            if len(parts) == 2:
                result.append(parts[0] + '.')
                result.append(parts[1])
                i += 1
                continue
        # Occasionally combine short sentences
        if len(words) < 5 and i + 1 < len(sentences) and random.random() < 0.2:
            next_sent = sentences[i + 1]
            result.append(f"{sent[:-1]} — {next_sent}")
            i += 2
            continue
        result.append(sent)
        i += 1
    return ' '.join(result)

def remove_robo_phrases(text):
    """Strip overly formal/AI-sounding phrases."""
    robo_patterns = [
        r"It is important to note that\s*",
        r"It should be noted that\s*",
        r"As mentioned previously[,\s]*",
        r"In today's [\w\s]+[,\s]*",
        r"Let's dive in[.\s]*",
        r"Let's get started[.\s]*",
        r"Without further ado[.\s]*",
        r"Please be advised that\s*",
        r"Please note that\s*",
    ]
    for pattern in robo_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    return text

def add_imperfection(text, level='medium'):
    """Add subtle human imperfections."""
    if level == 'high':
        # Occasionally start with lowercase
        if random.random() < 0.1:
            text = text[0].lower() + text[1:]
        # Add occasional ellipsis
        text = re.sub(r'\.\s+(?=[A-Z])', lambda m: '... ' if random.random() < 0.05 else m.group(), text)
    return text

def humanize(text, tone='casual', imperfection='medium'):
    """
    Main humanization pipeline.
    
    Tones: casual, professional, enthusiastic, blunt
    """
    original = text.strip()
    
    # Don't humanize very short text
    if len(original) < 20:
        return original
    
    result = original
    
    # Core transformations
    result = remove_robo_phrases(result)
    result = loosen_transitions(result)
    result = apply_contractions(result)
    
    if tone == 'casual':
        result = add_fillers(result, density=0.15)
        result = vary_sentence_length(result)
    elif tone == 'enthusiastic':
        result = add_fillers(result, density=0.2)
        result = re.sub(r'!\s+', '! ', result)  # More exclamation
        result = result.replace('.', '!') if random.random() < 0.1 else result
    elif tone == 'blunt':
        result = add_fillers(result, density=0.05)
        # Remove fluff words
        result = re.sub(r'\b(very|really|quite|rather)\s+', '', result, flags=re.IGNORECASE)
    
    result = add_imperfection(result, imperfection)
    
    # Cleanup
    result = re.sub(r'\s+', ' ', result).strip()
    result = re.sub(r'\s+([.,!?])', r'\1', result)
    
    return result

def main():
    if len(sys.argv) < 2:
        print("Usage: humanize.py <text> [--tone casual|professional|enthusiastic|blunt]")
        sys.exit(1)
    
    text = sys.argv[1]
    tone = 'casual'
    
    if '--tone' in sys.argv:
        idx = sys.argv.index('--tone')
        if idx + 1 < len(sys.argv):
            tone = sys.argv[idx + 1]
    
    # If text is a file path, read it
    if text.endswith('.txt') and len(text) < 200:
        try:
            with open(text) as f:
                text = f.read()
        except:
            pass
    
    result = humanize(text, tone)
    print(result)

if __name__ == "__main__":
    main()