#!/usr/bin/env python3
"""
Enterprise Idea Scoring Matrix
Track and score ideas over 7-day monitoring period
"""

import json
from datetime import datetime

IDEAS = {
    "dpdpa-compliance": {
        "name": "DPDPA AI Compliance Agent",
        "category": "Regulatory Tech",
        "scores": {
            "market_size": 0,      # TAM/SAM/SOM
            "competitive_moat": 0,  # 1-10
            "technical_feasibility": 0,  # 1-10
            "regulatory_risk": 0,   # 1-10 (lower = better)
            "india_fit": 0,         # 1-10
            "monetization_clarity": 0,  # 1-10
        },
        "daily_data": [],
        "sources": []
    },
    "ai-accounting": {
        "name": "AI Accounting/GST Agent",
        "category": "Fintech",
        "scores": {},
        "daily_data": [],
        "sources": []
    },
    "content-whatsapp": {
        "name": "Telegram/WhatsApp Content AI",
        "category": "Content Tech",
        "scores": {},
        "daily_data": [],
        "sources": []
    },
    "vibe-coder": {
        "name": "Vibe Coder for India",
        "category": "Dev Tools",
        "scores": {},
        "daily_data": [],
        "sources": []
    },
    "qtc-agent": {
        "name": "QTC Agent for Indian Enterprises",
        "category": "Enterprise AI",
        "scores": {},
        "daily_data": [],
        "sources": []
    }
}

WEIGHTS = {
    "market_size": 0.25,
    "competitive_moat": 0.20,
    "technical_feasibility": 0.15,
    "regulatory_risk": 0.15,  # Inverted
    "india_fit": 0.15,
    "monetization_clarity": 0.10
}

def calculate_weighted_score(idea_scores):
    """Calculate weighted score for an idea"""
    total = 0
    for metric, weight in WEIGHTS.items():
        score = idea_scores.get(metric, 5)
        if metric == "regulatory_risk":
            score = 10 - score  # Invert: lower risk = higher score
        total += score * weight
    return round(total, 2)

def log_daily_data(idea_id, day, data):
    """Log daily monitoring data"""
    entry = {
        "day": day,
        "date": datetime.now().isoformat(),
        "ph_upvotes": data.get("ph_upvotes", 0),
        "ph_comments": data.get("ph_comments", 0),
        "x_mentions": data.get("x_mentions", 0),
        "reddit_posts": data.get("reddit_posts", 0),
        "competitor_moves": data.get("competitor_moves", []),
        "sentiment": data.get("sentiment", "neutral"),
        "notes": data.get("notes", "")
    }
    IDEAS[idea_id]["daily_data"].append(entry)

def generate_weekly_report():
    """Generate final 7-day report"""
    results = []
    
    for idea_id, idea in IDEAS.items():
        weighted_score = calculate_weighted_score(idea["scores"])
        
        # Calculate trend from daily data
        if len(idea["daily_data"]) >= 2:
            first_day = idea["daily_data"][0]
            last_day = idea["daily_data"][-1]
            momentum = "📈" if last_day["ph_upvotes"] > first_day["ph_upvotes"] else "📉" if last_day["ph_upvotes"] < first_day["ph_upvotes"] else "➡️"
        else:
            momentum = "⏳"
        
        results.append({
            "rank": 0,  # Will be sorted
            "idea_id": idea_id,
            "name": idea["name"],
            "category": idea["category"],
            "weighted_score": weighted_score,
            "momentum": momentum,
            "scores": idea["scores"],
            "days_tracked": len(idea["daily_data"])
        })
    
    # Sort by weighted score
    results.sort(key=lambda x: x["weighted_score"], reverse=True)
    
    # Assign ranks
    for i, result in enumerate(results, 1):
        result["rank"] = i
    
    return results

if __name__ == "__main__":
    # Example: Generate report
    report = generate_weekly_report()
    print(json.dumps(report, indent=2))
