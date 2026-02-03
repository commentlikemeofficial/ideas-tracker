#!/usr/bin/env python3
"""
ContentClaw - Multi-Framework Content Generator
Supports: Hormozi $100M Offers, Gary Vee Jab-Jab-Hook, Naval Ravikant, Storytelling, AIDA
"""

import json
from datetime import datetime

# Content Frameworks Library

FRAMEWORKS = {
    "hormozi": {
        "name": "Hormozi $100M Offers",
        "structure": [
            "🔥 Hook: Problem + Pain amplification",
            "💰 Offer: Solution + Value stack",
            "⚡ Urgency: Why now",
            "🎯 CTA: Clear action"
        ],
        "style": "Direct, value-focused, urgency-driven"
    },
    "garyvee": {
        "name": "Gary Vee Jab-Jab-Hook",
        "structure": [
            "👊 Jab 1: Free value/entertainment",
            "👊 Jab 2: More value/education", 
            "🥊 Hook: Soft pitch/ask",
            "💬 Engagement: Question to community"
        ],
        "style": "High energy, give-give-ask, community-first"
    },
    "naval": {
        "name": "Naval Ravikant Wisdom",
        "structure": [
            "💎 Insight: Profound observation",
            "🧠 Principle: Universal truth",
            "⚖️ Counter-thought: Challenge assumption",
            "🌊 Flow: Let it resonate"
        ],
        "style": "Philosophical, concise, tweet-storm style"
    },
    "storytelling": {
        "name": "Story Arc",
        "structure": [
            "🎭 Setup: Character + Situation",
            "⚡ Conflict: Problem arises",
            "🔥 Climax: Turning point",
            "🎁 Resolution: Lesson/CTA"
        ],
        "style": "Narrative, emotional, relatable"
    },
    "aida": {
        "name": "AIDA Classic",
        "structure": [
            "👀 Attention: Stop the scroll",
            "💡 Interest: Why should I care",
            "🔥 Desire: I want this",
            "🎯 Action: Here's what to do"
        ],
        "style": "Marketing classic, conversion-focused"
    }
}

def generate_hormozi_linkedin(insights, video_title, channel):
    """Hormozi-style LinkedIn post"""
    return f"""Most local businesses are bleeding $70K/year and don't even know it.

Not from bad service.
Not from bad products.
From missed calls.

Here's the math that changed how I think about AI automation:

❌ Human receptionist:
• $4,000/month
• 9-5 only
• Sick days, attitude, turnover
• Misses after-hours calls

✅ AI receptionist:
• $500/month
• 24/7/365
• Never calls in sick
• Books appointments while you sleep

ONE saved HVAC emergency call = $5,000 job.
Your $500 fee = paid for 10 months.

That's not a cost. That's an insurance policy that prints money.

The offer:
→ $1,000 setup (one-time)
→ $500/month (management)
→ Guarantee: If we don't save you 3x our fee in 90 days, you don't pay.

You're not buying AI.
You're buying peace of mind that Rebecca's 2 AM AC emergency gets handled INSTANTLY.

Not voicemail.
Not "we'll call back tomorrow."
An actual booking.

What would an extra 5-10 booked appointments per month mean for your business?

Comment "AI" and I'll send you the exact 5-step setup process I learned from {channel}.

#AI #Automation #BusinessGrowth #HormoziStyle"""

def generate_hormozi_x(insights, video_title, channel):
    """Hormozi-style X thread"""
    return [
        """🧵 Most businesses bleed $70K/year from one invisible problem:

Missed calls.

I just watched @{channel}'s breakdown on AI automation.

Here's the $100M Offer framework applied to AI receptionists:

🧵""",
        """1/ THE PROBLEM

Small businesses lose $70K+ annually from missed calls.

Not bad service.
Not bad products.

Just... nobody answering the phone at 7 PM.""",
        """2/ THE MATH

Human receptionist:
→ $4,000/month
→ 9-5 only
→ Sick days + turnover

AI receptionist:
→ $500/month
→ 24/7/365
→ Never misses a call

One saved HVAC emergency = $5,000 job.
Fee paid for 10 months.""",
        """3/ THE OFFER STRUCTURE

Setup: $1,000 (one-time)
Management: $500/month

Guarantee: Save 3x our fee in 90 days or don't pay.

Risk reversal = easy yes.""",
        """4/ WHAT THEY'RE REALLY BUYING

Not AI.
Not technology.

Peace of mind that Rebecca's 2 AM AC emergency gets handled NOW.

Not voicemail.
Not "call back tomorrow."

An actual booking while they sleep.""",
        """5/ THE VALUE STACK

✅ 24/7 answering
✅ Instant booking
✅ SMS + WhatsApp
✅ FAQ handling
✅ No sick days
✅ No attitude
✅ Scales infinitely

All for 1/8th the cost of Becky who shows up hungover.""",
        """6/ APPLICATION

Pick ONE niche:
• HVAC (high-ticket emergencies)
• Dentists (appointments)
• Lawyers (intake urgency)

Gather 5 things:
Services, pricing, hours, FAQs, booking link.

Train. Test. Launch.""",
        """7/ THE IRON LAW

"People don't pay for technology.
They pay for transformation."

You're not selling AI.
You're selling:
→ Reliability
→ Responsiveness  
→ Peace of mind

That's the $100M offer.""",
        """8/ NEXT STEPS

Want the exact 5-step process?

Reply "AI" and I'll DM you the framework.

(Based on @{channel}'s content - full credit)

Follow for more AI monetization breakdowns."""
    ]

def generate_garyvee_linkedin(insights, video_title, channel):
    """Gary Vee-style LinkedIn post"""
    return f"""👊 FREE VALUE DROP 👊

Just spent 18 minutes watching {channel} break down how to make $3,700/week with AI receptionists.

Here are the 3 BIGGEST takeaways:

1️⃣ JAB: Give massive value first
Small businesses lose $70K/year from missed calls. Not because they're bad at what they do—because they're juggling everything and the phone rings at 7 PM when they're burnt out.

Your move: Show them the EXACT cost of missed calls. Make it hurt.

2️⃣ JAB: Education over selling  
Don't pitch "AI technology."

Teach them:
→ Human: $4K/month, 9-5, sick days
→ AI: $500/month, 24/7, never sleeps

Let THEM do the math.

3️⃣ HOOK: The soft offer
"Want me to set up a 24/7 receptionist that books appointments while you sleep?"

No hard sell.
No pressure.
Just: "Here's what I can do. Interested?"

🎯 BONUS INSIGHT:

The best lead gen isn't ads.
It's not cold calls.
It's not SEO.

It's Bob the plumber telling Todd the HVAC guy:

"Johnny made me $15K last month from calls I would've missed. Here's his number."

Word of mouth.
Trust already established.
No selling required.

👇 YOUR TURN:

What's ONE way you're providing value before asking for anything?

Drop it in the comments. I read every single one.

And if you want the full 18-minute breakdown from {channel}, link in comments.

#GaryVeeStyle #JabJabHook #ContentStrategy #BuildingInPublic"""

def generate_garyvee_x(insights, video_title, channel):
    """Gary Vee-style X thread"""
    return [
        """👊 JAB 1:

Most local businesses are leaving $70K on the table.

Not from bad service.
From missed calls at 7 PM.

Here's how to help them (and get paid) 🧵""",
        """👊 JAB 2:

Don't sell "AI technology."

Teach the comparison:

Human receptionist:
❌ $4K/month
❌ 9-5 only  
❌ Sick days

AI receptionist:
✅ $500/month
✅ 24/7/365
✅ Never sleeps

Let them do the math.""",
        """🥊 THE HOOK:

"Want me to set up a 24/7 receptionist that books while you sleep?"

No hard pitch.
Just value first.

Interested?""",
        """💬 ENGAGEMENT:

Best lead gen isn't ads.
It's not SEO.
It's not cold calls.

It's Bob telling Todd:
"Johnny made me $15K from missed calls. Here's his number."

Word of mouth > Everything

What's your best lead gen channel? 👇"""
    ]

def generate_naval_x(insights, video_title, channel):
    """Naval-style X thread (philosophical, concise)"""
    return [
        """On leverage:

One person with AI can now do the work of ten.

The question isn't "Will AI replace jobs?"

It's "Will you be the one using AI, or replaced by someone who is?"
""",
        """On business:

The best businesses solve painful, frequent, valuable problems.

Missed calls = painful (customer lost)
Missed calls = frequent (happens daily)  
Missed calls = valuable ($5K HVAC job)

AI receptionists check all three boxes.""",
        """On wealth:

Wealth is created by solving problems at scale.

The internet let us scale information.
AI lets us scale expertise and execution.

The 24/7 AI receptionist is just the beginning.""",
        """On value:

"You're not selling AI. You're selling peace of mind."

The technology doesn't matter.
The transformation does.

Customers pay for outcomes, not features.""",
        """On timing:

The best time to adopt new technology:

Right before the masses catch on.

Too early = you educate the market (expensive)
Too late = you're a commodity (race to bottom)

Right now = AI receptionists for local business""",
        """On specific knowledge:

The combination of:
• AI tools (general)
• Industry expertise (specific)
• Business model understanding (rare)

Is worth millions.

Most people have 1/3.
Some have 2/3.
Few master all three.""",
        """On compounding:

One client → Referral → Two clients → Referrals

Word of mouth compounds faster than ads.
Trust removes friction.
Results create evangelists.

Do great work.
Tell stories.
Let your customers sell for you."""
    ]

def generate_storytelling_linkedin(insights, video_title, channel):
    """Story arc LinkedIn post"""
    return f"""It was 107°F in Phoenix.

Rebecca's AC died at 3 PM.
Her baby was screaming.
Everyone was sweating.

She called the first HVAC company.
No answer. Voicemail.

She called the second.
Same thing.

The third?
An AI receptionist answered instantly:

"Hi Rebecca, I see you're in Phoenix. Emergency AC repair is our specialty. I can have someone there within 2 hours. May I confirm your address?"

Rebecca cried with relief.

Two hours later, cool air flowed.
Baby stopped screaming.
Mom could finally breathe.

That HVAC company?
They just made $5,000 from a call they would've missed at 7 PM.

The other two?
Still wondering why they're struggling.

☕ THE LESSON:

Small businesses don't lose customers from bad service.
They lose them from missed calls.

$70,000+ per year. Gone. Because nobody answered the phone after hours.

Here's the wild part:

An AI receptionist costs $500/month.
A human receptionist costs $4,000/month.

The AI:
✅ Answers 24/7/365
✅ Books appointments
✅ Never calls in sick
✅ Handles FAQs

The human:
❌ 9-5 only
❌ Sick days, vacation
❌ Attitude problems
❌ $3,500 MORE per month

One saved emergency call = $5,000 job.

Your $500 investment = paid for 10 months.

💭 THE QUESTION:

Are you the HVAC company with the AI receptionist?

Or are you the one sending Rebecca to voicemail?

Based on insights from {channel}'s content.

#Storytelling #BusinessGrowth #AI #CustomerService"""

def generate_all_frameworks(video_title, channel, insights):
    """Generate content using ALL frameworks"""
    
    output = {
        "meta": {
            "video": video_title,
            "channel": channel,
            "generated_at": datetime.now().isoformat(),
            "frameworks_used": list(FRAMEWORKS.keys())
        },
        "frameworks": {}
    }
    
    # Hormozi
    output["frameworks"]["hormozi"] = {
        "linkedin": generate_hormozi_linkedin(insights, video_title, channel),
        "x_thread": generate_hormozi_x(insights, video_title, channel)
    }
    
    # Gary Vee
    output["frameworks"]["garyvee"] = {
        "linkedin": generate_garyvee_linkedin(insights, video_title, channel),
        "x_thread": generate_garyvee_x(insights, video_title, channel)
    }
    
    # Naval
    output["frameworks"]["naval"] = {
        "x_thread": generate_naval_x(insights, video_title, channel)
    }
    
    # Storytelling
    output["frameworks"]["storytelling"] = {
        "linkedin": generate_storytelling_linkedin(insights, video_title, channel)
    }
    
    return output

def main():
    """Test all frameworks"""
    insights = [
        "Small businesses lose $70K/year from missed calls",
        "AI receptionist costs $500 vs human $4000/month",
        "One saved HVAC call = $5000 job",
        "Word of mouth beats ads for lead gen"
    ]
    
    results = generate_all_frameworks(
        "How To Make $3700 Per Week With AI",
        "JohnnyTube",
        insights
    )
    
    # Save
    filename = f"/home/ubuntu/clawd/agents/contentclaw/memory/frameworks_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"✅ Generated content using {len(FRAMEWORKS)} frameworks")
    print(f"💾 Saved to: {filename}")
    
    # Print summary
    print("\n📊 Frameworks Available:")
    for key, fw in FRAMEWORKS.items():
        print(f"  • {fw['name']}: {len(results['frameworks'].get(key, {}))} outputs")

if __name__ == "__main__":
    main()
