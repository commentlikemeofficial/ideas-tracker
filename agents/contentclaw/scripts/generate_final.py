#!/usr/bin/env python3
"""
ContentClaw - Generate content from ACTUAL video transcript
"""

import json
from datetime import datetime

def generate_linkedin_post():
    return """Just watched an 18-minute masterclass on monetizing AI agents for local businesses.

The thesis is simple: Small businesses lose $70K+/year from missed calls.

HVAC contractor misses a call at 7 PM? That's a $5,000 job gone.
Dentist doesn't respond? $300 appointment lost.
Lawyer unavailable? Client calls competitor.

The solution: AI receptionists that handle SMS/WhatsApp 24/7.

The business model:
→ $1,000 setup fee
→ $500/month management
→ One saved call = service pays for itself 10x over

What hit me: "You're not selling AI. You're selling peace of mind."

Business owners don't care about the tech stack. They care that Rebecca's AC emergency at 2 AM gets a response INSTANTLY—not a voicemail, not a callback tomorrow. A real answer that books the appointment.

The math is brutal:
• Human receptionist: $4,000/month + sick days + attitude + 9-5 only
• AI receptionist: $500/month + 24/7/365 + never calls in sick

Niche down. Pick ONE:
• HVAC/plumbers (high-ticket, emergency-driven)
• Dentists (appointments, insurance questions)
• Lawyers (intake, urgency)

Train the bot on 5 things:
1. Services offered
2. Pricing
3. Hours
4. FAQs
5. Booking link (CRITICAL)

Then test. Triple-check the booking link. One broken link = lost trust.

The opportunity? Word of mouth is your best lead gen.

Bob the plumber tells Todd the HVAC guy. Trust barrier already gone. No cold calls. No ads. Just results.

This is exactly what I'm exploring with AI-powered workflows—taking repetitive tasks off human plates so businesses can focus on what they do best.

If you're building with AI agents, what's your monetization model?

#AI #Automation #SaaS #BuildingInPublic #Entrepreneurship

🎥 Source: JohnnyTube's Clawdbot Monetization Course"""

def generate_x_thread():
    return [
        """🧵 I just watched an 18-min breakdown on making $3,700/week with AI agents.

The model? AI receptionists for local businesses.

Here's why it works: A single missed HVAC call = $5,000 lost.

Let me break it down: 🧵""",
        
        """1/ Small businesses lose $70K+/year from missed calls.

Not from bad service.
From being too busy to respond.

Business owners juggle operations, marketing, customer care.
By 7 PM? They're burnt out.""",
        
        """2/ The math is brutal:

Human receptionist:
→ $4,000/month
→ Sick days
→ 9-5 only
→ Attitude

AI receptionist:
→ $500/month  
→ 24/7/365
→ Never calls in sick
→ Instant response""",
        
        """3/ The business model:
• $1,000 setup fee
• $500/month management
• One saved call = 10x ROI

Charge based on what a missed call costs THEM.

HVAC emergency? $5-10K job.
Your $500 fee is nothing.""",
        
        """4/ "You're not selling AI. You're selling peace of mind."

Business owners don't care about LLMs.
They care that Rebecca's AC emergency gets answered at 2 AM.

Not voicemail. Not callback tomorrow.
Instant booking.""",
        
        """5/ The 5-step setup:
1. Pick ONE niche (HVAC, dentists, lawyers)
2. Gather 5 info pieces (services, pricing, FAQs, booking link)
3. Connect AI to SMS/WhatsApp
4. Train with real answers
5. Test obsessively (especially that booking link)""",
        
        """6/ The real value? Word of mouth.

Bob the plumber tells Todd the HVAC guy.
Trust already established.
No cold calls. No ads.

Results → Referrals → More clients.""",
        
        """7/ "One post, one phone call, one client gained is better than an idea any day."

Stop researching. Start building.

What's your AI monetization model? 👇

Source: JohnnyTube's Clawdbot course"""
    ]

def generate_reddit_post():
    return """[Discussion] I just watched a detailed breakdown on monetizing AI agents for local businesses—here's what I learned

**The Problem:**
Small businesses lose $70,000+ annually from missed calls. Not from bad service—from being too busy to respond.

**The Real Cost:**
• HVAC contractor misses 7 PM call = $5,000 job lost
• Dentist doesn't respond = $300 appointment gone  
• Lawyer unavailable = client calls competitor

**The Solution:**
AI receptionists handling SMS/WhatsApp 24/7.

**The Business Model:**
- $1,000 setup fee
- $500/month management
- One saved emergency call = 10x ROI

**Why It Works:**
Human receptionist: $4,000/month + sick days + 9-5 limits
AI receptionist: $500/month + 24/7/365 + never calls in sick

**The 5-Step Process:**
1. Pick ONE niche (HVAC, dentists, lawyers—don't hop around)
2. Gather 5 info pieces: services, pricing, hours, FAQs, booking link
3. Connect AI to SMS/WhatsApp
4. Train with real business answers (not templates)
5. Test obsessively—triple-check that booking link

**The Key Insight:**
"You're not selling AI. You're selling peace of mind."

Business owners don't care about LLMs. They care that Rebecca's AC emergency at 2 AM gets an instant response—not voicemail, not callback tomorrow. An actual booking.

**Best Lead Gen:**
Word of mouth. Bob the plumber tells Todd the HVAC guy. Trust barrier already gone. No cold calls needed.

**Questions for the community:**
- Are you monetizing AI agents yet?
- What niches have you found work best?
- How do you handle the "AI trust barrier" with traditional businesses?

Source: JohnnyTube's Clawdbot Monetization Course (18-min video)"""

def main():
    linkedin = generate_linkedin_post()
    thread = generate_x_thread()
    reddit = generate_reddit_post()
    
    print("=" * 60)
    print("💼 LINKEDIN POST")
    print("=" * 60)
    print(linkedin)
    print("\n")
    
    print("=" * 60)
    print("🐦 X THREAD")
    print("=" * 60)
    for i, tweet in enumerate(thread, 1):
        print(f"\n--- Tweet {i} ---")
        print(tweet)
    print("\n")
    
    print("=" * 60)
    print("🔴 REDDIT POST")
    print("=" * 60)
    print(reddit)
    print("\n")
    
    # Save
    output = {
        "date": datetime.now().isoformat(),
        "video_url": "https://youtu.be/o0ZDDkNd1Ns",
        "video_id": "o0ZDDkNd1Ns",
        "title": "How To Make $3700 Per Week With Clawdbot/Moltbot (Full Course)",
        "channel": "JohnnyTube",
        "linkedin": linkedin,
        "x_thread": thread,
        "reddit": reddit,
        "status": "draft"
    }
    
    filename = f"/home/ubuntu/clawd/agents/contentclaw/memory/content_o0ZDDkNd1Ns_FINAL.json"
    with open(filename, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"💾 Saved to: {filename}")
    print("\n✅ ContentClaw: REAL content generated from actual transcript!")

if __name__ == "__main__":
    main()
