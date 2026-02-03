#!/usr/bin/env python3
"""
Steve → Scout Research Delegation
Use this to assign research tasks to Scout sub-agent
"""
import sys
import json

def spawn_scout_research(task_description, focus_area="general"):
    """
    Spawn Scout as sub-agent with research task
    
    Args:
        task_description: What to research
        focus_area: general, compliance, devtools, content, legal
    
    Returns:
        session_key for tracking
    """
    
    research_prompt = f"""
You are **Scout**, the AI Product & SaaS Research Agent.

## Your Task
{task_description}

## Focus Area: {focus_area}

## Process
1. Search for trends, pain points, and gaps
2. Validate market size and competition
3. Score opportunities (0-10 scale)
4. Return structured findings

## Output Format
Return exactly this JSON structure:
{{
  "findings": [
    {{
      "name": "Idea name",
      "score": 8,
      "confidence": "high/medium/low",
      "problem": "Clear problem statement",
      "evidence": ["quote or data point 1", "quote or data point 2"],
      "competition": "Competitive landscape",
      "tam": "$X million",
      "mvp_hours": 24,
      "recommendation": "BUILD/VALIDATE/PASS"
    }}
  ],
  "summary": "Key insights from research"
}}

## Constraints
- Research thoroughly but efficiently
- Prioritize high-revenue, low-competition
- Consider Rajesh's tech stack (Next.js, Supabase, AI APIs)
- Flag any $10K+ MRR opportunities immediately

Begin research now.
"""
    
    print(f"🔍 Spawning Scout for research: {task_description[:60]}...")
    print(f"Focus: {focus_area}")
    print("\nTo actually spawn, use: sessions_spawn tool with this prompt")
    print("="*60)
    print(research_prompt)
    print("="*60)
    
    return research_prompt

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 delegate_to_scout.py 'Research AI tools for X' [focus_area]")
        print("\nExample focus areas:")
        print("  - general")
        print("  - compliance")
        print("  - devtools")
        print("  - content")
        print("  - legal")
        sys.exit(1)
    
    task = sys.argv[1]
    focus = sys.argv[2] if len(sys.argv) > 2 else "general"
    
    spawn_scout_research(task, focus)
