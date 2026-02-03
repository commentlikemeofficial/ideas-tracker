#!/usr/bin/env python3
"""
ContentClaw v2.0 - Framework-Specific Generator with Performance Tracking
One framework per run. Platform-optimized. Tracks viral performance.
"""

import json
import sys
from datetime import datetime

# Platform Limits
LIMITS = {
    "x": 280,           # Per tweet
    "linkedin": 1300,   # Above "see more" threshold
    "reddit": 3000      # Practical limit for readability
}

FRAMEWORKS = {
    "hormozi": {
        "name": "Hormozi $100M Offers",
        "emoji": "💰",
        "style": "Direct, value-stacking, urgency, risk reversal",
        "best_for": "Conversion, sales, offers"
    },
    "garyvee": {
        "name": "Gary Vee Jab-Jab-Hook", 
        "emoji": "👊",
        "style": "Give-give-ask, high energy, community",
        "best_for": "Engagement, building trust"
    },
    "naval": {
        "name": "Naval Ravikant Wisdom",
        "emoji": "🧠",
        "style": "Philosophical, concise, profound",
        "best_for": "Thought leadership, virality"
    },
    "storytelling": {
        "name": "Story Arc",
        "emoji": "📖",
        "style": "Narrative, emotional, relatable",
        "best_for": "Emotional connection, sharing"
    },
    "aida": {
        "name": "AIDA Classic",
        "emoji": "🎯",
        "style": "Attention-Interest-Desire-Action",
        "best_for": "Direct response, clarity"
    }
}

def truncate(text, limit, add_ellipsis=True):
    """Truncate text to platform limit"""
    if len(text) <= limit:
        return text
    if add_ellipsis:
        return text[:limit-3] + "..."
    return text[:limit]

def generate_hormozi(video_title, channel, key_points, platform):
    """Hormozi $100M Offers framework"""
    
    if platform == "linkedin":
        post = f"""Most local businesses are bleeding $70K/year and don't even know it.

Not from bad service.
From missed calls.

Here's the math:
❌ Human: $4,000/month + 9-5 only
✅ AI: $500/month + 24/7/365

ONE saved HVAC call = $5,000 job.
Your fee = paid for 10 months.

THE OFFER:
→ $1,000 setup
→ $500/month  
→ Guarantee: 3x ROI in 90 days or don't pay

You're not buying AI.
You're buying peace of mind.

What would 5-10 extra bookings/month mean?

#{channel.replace(' ', '')} #AI #BusinessGrowth"""
        return truncate(post, LIMITS["linkedin"])
    
    elif platform == "x":
        tweets = [
            "🧵 Most businesses bleed $70K/year from missed calls\n\nHere's the $100M Offer framework applied:\n\n1/ 🧵",
            "2/ THE PROBLEM\n\nSmall businesses lose $70K+ from missed calls\n\nNot bad service\nJust nobody answering at 7 PM",
            "3/ THE MATH\n\nHuman: $4K/month, 9-5, sick days\nAI: $500/month, 24/7, never sleeps\n\nOne HVAC emergency = $5K",
            "4/ THE OFFER\n\nSetup: $1,000\nMonthly: $500\n\nGuarantee: 3x ROI or don't pay\n\nRisk reversal = easy yes",
            "5/ THE VALUE STACK\n\n✅ 24/7 answering\n✅ Instant booking\n✅ SMS/WhatsApp\n✅ No sick days\n✅ Scales infinitely\n\n1/8th the cost",
            "6/ APPLICATION\n\nPick ONE niche:\n• HVAC (emergencies)\n• Dentists (appointments)\n• Lawyers (intake)\n\nGather 5 things, train, test, launch",
            "7/ THE IRON LAW\n\n\"People don't pay for technology\nThey pay for transformation\"\n\nYou're selling:\n→ Reliability\n→ Peace of mind\n→ Results",
            "8/ NEXT STEPS\n\nReply \"AI\" for the exact framework\n\nFollow for more breakdowns 👇"
        ]
        return [truncate(t, LIMITS["x"]) for t in tweets]
    
    elif platform == "reddit":
        post = f"""[Offer] AI Receptionist Service - $3,700/week model breakdown

**THE PROBLEM:**
Small businesses lose $70K/year from missed calls.

**THE MATH:**
• Human receptionist: $4,000/month + 9-5 limits
• AI receptionist: $500/month + 24/7/365

One saved HVAC emergency = $5,000 job.

**THE OFFER:**
- Setup: $1,000 (one-time)
- Management: $500/month
- Guarantee: 3x ROI in 90 days or don't pay

**WHAT THEY'RE BUYING:**
Not AI. Peace of mind that Rebecca's 2 AM emergency gets handled NOW.

**VALUE STACK:**
✅ 24/7 answering ✅ Instant booking ✅ SMS/WhatsApp ✅ No sick days

Want the full framework? Comment below.

#{channel.replace(' ', '')}"""
        return truncate(post, LIMITS["reddit"])

def generate_garyvee(video_title, channel, key_points, platform):
    """Gary Vee Jab-Jab-Hook framework"""
    
    if platform == "linkedin":
        post = f"""👊 FREE VALUE DROP 👊

Just watched {channel} break down $3,700/week with AI.

Here are 3 JABS before the hook:

JAB 1️⃣: Show the pain
Small businesses lose $70K/year from missed calls. Not because they're bad—because they're juggling everything and the phone rings at 7 PM when they're burnt out.

JAB 2️⃣: Education over selling
Don't pitch "AI." Teach the comparison:
→ Human: $4K/month, 9-5, sick days
→ AI: $500/month, 24/7, never sleeps

Let THEM do the math.

HOOK 3️⃣: Soft ask
"Want me to set up a 24/7 receptionist?"

No pressure. Just value first.

💬 What's ONE way you provide value before asking?

#JabJabHook #ContentStrategy"""
        return truncate(post, LIMITS["linkedin"])
    
    elif platform == "x":
        tweets = [
            "👊 JAB 1: Show the pain\n\nMost businesses lose $70K/year\n\nNot from bad service\nFrom missed calls at 7 PM\n\n🧵",
            "👊 JAB 2: Education\n\nDon't sell \"AI\"\n\nTeach:\n❌ Human: $4K/mo, 9-5\n✅ AI: $500/mo, 24/7\n\nLet them do math",
            "🥊 THE HOOK:\n\n\"Want a 24/7 receptionist?\"\n\nNo hard sell\nJust value first\n\nInterested?",
            "💬 ENGAGE:\n\nBest lead gen?\n\nBob → Todd:\n\"Johnny made me $15K\nHere's his number\"\n\nWord of mouth wins\n\nYour best channel? 👇"
        ]
        return [truncate(t, LIMITS["x"]) for t in tweets]
    
    elif platform == "reddit":
        post = f"""[Strategy] The Jab-Jab-Hook method for selling AI services

**JAB 1: Give value first**
Show businesses exactly how much missed calls cost them. Make it hurt. $70K/year is real.

**JAB 2: Educate, don't pitch**
Don't say "buy my AI." Teach them:
- Human costs: $4K + limitations
- AI costs: $500 + 24/7 availability

Let them draw conclusions.

**THE HOOK: Soft ask**
"Want me to set up a 24/7 receptionist that books while you sleep?"

No pressure. No hard close. Just an invitation.

**RESULT:**
Bob tells Todd. Trust transfers. No cold calls needed.

What's your go-to value-first strategy?"""
        return truncate(post, LIMITS["reddit"])

def generate_naval(video_title, channel, key_points, platform):
    """Naval Ravikant wisdom framework"""
    
    if platform == "x":
        tweets = [
            "On leverage:\n\nOne person with AI = work of ten\n\nQuestion isn't \"Will AI replace jobs?\"\n\nIt's:\n\"Will you use AI, or be replaced by someone who does?\"",
            "On business:\n\nBest businesses solve:\n• Painful problems\n• Frequent problems  \n• Valuable problems\n\nMissed calls = all three\n\n$5K HVAC job, daily occurrence",
            "On value:\n\n\"You're not selling AI\nYou're selling peace of mind\"\n\nTechnology doesn't matter\nTransformation does\n\nCustomers pay for outcomes",
            "On timing:\n\nBest time to adopt tech:\nRight before masses catch on\n\nToo early = expensive education\nToo late = commodity\n\nRight now = AI receptionists",
            "On compounding:\n\nOne client → Referral → Two clients\n\nWord of mouth compounds\nTrust removes friction\nResults create evangelists\n\nDo great work\nLet customers sell for you"
        ]
        return [truncate(t, LIMITS["x"]) for t in tweets]
    
    elif platform == "linkedin":
        post = f"""On leverage, timing, and the AI opportunity:

One person with AI can now do the work of ten.

The question isn't "Will AI replace jobs?"

It's: "Will you be the one using AI, or replaced by someone who is?"

—

**On business:**

The best businesses solve painful, frequent, valuable problems.

Missed calls check all three boxes:
• Painful: $5K HVAC job lost
• Frequent: Happens daily  
• Valuable: Customer gone forever

**On value:**

"You're not selling AI. You're selling peace of mind."

The technology doesn't matter. The transformation does.

**On timing:**

Best time to adopt: Right before the masses catch on.

Too early = expensive education
Too late = commodity

Right now = AI receptionists for local business

—

Specific knowledge + AI tools + Business understanding = Millions

Most have 1/3. Few master all three.

#NavalWisdom #AI #Leverage"""
        return truncate(post, LIMITS["linkedin"])
    
    elif platform == "reddit":
        post = f"""[Philosophy] Naval-style insights on AI business opportunities

**On leverage:**
One person with AI = work of ten.

Question isn't "Will AI take jobs?"
It's "Will you use AI or be replaced?"

**On business:**
Best opportunities solve:
- Painful problems (lost customers hurt)
- Frequent problems (daily occurrence)  
- Valuable problems ($5K per incident)

**On timing:**
Too early = expensive education
Too late = commodity
Right now = before masses catch on

**On compounding:**
Results → Trust → Referrals → More results

Do great work. Let customers sell for you.

What's your leverage strategy?"""
        return truncate(post, LIMITS["reddit"])

def generate_storytelling(video_title, channel, key_points, platform):
    """Story Arc framework"""
    
    if platform == "linkedin":
        post = f"""It was 107°F in Phoenix.

Rebecca's AC died at 3 PM. Her baby screaming. Everyone sweating.

She called the first HVAC company.
No answer. Voicemail.

The second. Same thing.

The third?

"Hi Rebecca, I see you're in Phoenix. Emergency AC is our specialty. Someone there in 2 hours. May I confirm your address?"

Rebecca cried with relief.

Two hours later, cool air flowed. Baby stopped screaming. Mom could breathe.

That company made $5,000 from a call they'd have missed at 7 PM.

The other two? Still wondering why they're struggling.

☕ **THE LESSON:**

Small businesses don't lose customers from bad service.
They lose them from missed calls.

$70,000+ per year. Gone.

An AI receptionist: $500/month
A human receptionist: $4,000/month

Which one answers at 2 AM?

#Storytelling #Business #AI"""
        return truncate(post, LIMITS["linkedin"])
    
    elif platform == "x":
        tweets = [
            "It was 107°F in Phoenix\n\nRebecca's AC died\nBaby screaming\nEveryone sweating\n\nShe called 3 HVAC companies\n\n🧵",
            "First company:\nVoicemail ❌\n\nSecond company:\nNo answer ❌\n\nThird company:\nAI receptionist answered ✅\n\n\"Someone there in 2 hours\"",
            "Rebecca cried with relief\n\n2 hours later:\n✅ Cool air flowed\n✅ Baby stopped crying\n✅ Mom could breathe\n\nCompany made $5K",
            "The other two companies?\n\nStill wondering why\nthey're struggling\n\nThe difference:\nOne answered at 7 PM",
            "Small businesses lose $70K/year\n\nNot from bad service\nFrom missed calls\n\nAI receptionist: $500/mo\nHuman: $4,000/mo\n\nWhich answers at 2 AM?"
        ]
        return [truncate(t, LIMITS["x"]) for t in tweets]
    
    elif platform == "reddit":
        post = f"""[Story] The $5,000 phone call that changed how I think about AI

**SETUP:**
107°F Phoenix summer. Rebecca's AC dies at 3 PM. Baby screaming. Family suffering.

**CONFLICT:**
First HVAC company: Voicemail
Second HVAC company: No answer

**CLIMAX:**
Third company: AI receptionist answers instantly
"Emergency AC is our specialty. 2 hours. Confirm your address?"

**RESOLUTION:**
Rebecca cries with relief. Cool air flows. Company makes $5,000.

**THE LESSON:**
Other two companies? Still struggling.

Difference: One answered at 7 PM.

**THE MATH:**
AI receptionist: $500/month, 24/7
Human receptionist: $4,000/month, 9-5

Small businesses lose $70K/year from missed calls.

Are you the company that answers?"""
        return truncate(post, LIMITS["reddit"])

def generate_aida(video_title, channel, key_points, platform):
    """AIDA classic framework"""
    
    if platform == "linkedin":
        post = f"""👀 **ATTENTION:**
Your business is bleeding $70,000 per year.

Not from bad service. From missed phone calls.

💡 **INTEREST:**
Here's what happens:
• HVAC emergency at 7 PM → You miss it → $5,000 job lost
• Dental inquiry at 8 PM → Voicemail → $300 appointment gone  
• Legal consultation → No answer → Client calls competitor

Every missed call = money walking out the door.

🔥 **DESIRE:**
Imagine:
✅ Every call answered instantly
✅ Appointments booked while you sleep
✅ 24/7/365 coverage
✅ Zero sick days, zero attitude

Cost? $500/month.

Compare to Becky who shows up hungover for $4,000/month.

🎯 **ACTION:**
Setup: $1,000 (one-time)
Monthly: $500
Guarantee: 3x ROI or don't pay

Comment \"AI\" and I'll send you the exact setup process.

#AIDA #BusinessGrowth #AI"""
        return truncate(post, LIMITS["linkedin"])
    
    elif platform == "x":
        tweets = [
            "👀 ATTENTION:\n\nYour business bleeds $70K/year\n\nNot from bad service\nFrom missed calls\n\n🧵",
            "💡 INTEREST:\n\n7 PM HVAC emergency\n→ You miss it\n→ $5,000 lost\n\nEvery missed call = money walking out",
            "🔥 DESIRE:\n\nImagine:\n✅ Every call answered\n✅ Bookings while you sleep\n✅ 24/7 coverage\n✅ Zero sick days\n\nCost: $500/mo",
            "🎯 ACTION:\n\nSetup: $1,000\nMonthly: $500\n\nGuarantee: 3x ROI or don't pay\n\nReply \"AI\" for the process"
        ]
        return [truncate(t, LIMITS["x"]) for t in tweets]
    
    elif platform == "reddit":
        post = f"""[AIDA Method] How to sell AI receptionists using classic marketing

**ATTENTION:**
Your business is bleeding $70K/year from missed calls.

**INTEREST:**
7 PM HVAC emergency → You miss it → $5,000 gone
Dental inquiry → Voicemail → $300 lost
Legal consultation → No answer → Client lost

**DESIRE:**
Imagine every call answered instantly, 24/7/365, while you sleep.

AI receptionist: $500/month
Human receptionist: $4,000/month

Zero sick days. Zero attitude. Infinite scale.

**ACTION:**
Setup: $1,000 (one-time)
Monthly: $500  
Guarantee: 3x ROI in 90 days or don't pay

Ready to stop bleeding money? Comment below."""
        return truncate(post, LIMITS["reddit"])

def generate_content(video_title, channel, framework, platform):
    """Generate content using specific framework for specific platform"""
    
    generators = {
        "hormozi": generate_hormozi,
        "garyvee": generate_garyvee,
        "naval": generate_naval,
        "storytelling": generate_storytelling,
        "aida": generate_aida
    }
    
    if framework not in generators:
        return None
    
    return generators[framework](video_title, channel, [], platform)

def save_to_tracking(video_title, channel, framework, platforms_generated, output_dir="/home/ubuntu/clawd/agents/contentclaw/memory"):
    """Save to tracking for performance analysis"""
    entry = {
        "date": datetime.now().isoformat(),
        "video_title": video_title,
        "channel": channel,
        "framework_used": framework,
        "framework_name": FRAMEWORKS.get(framework, {}).get("name", framework),
        "platforms": platforms_generated,
        "status": "generated",
        "performance": {
            "linkedin_views": None,
            "linkedin_engagement": None,
            "x_impressions": None,
            "x_engagement": None,
            "reddit_upvotes": None,
            "viral": False
        }
    }
    
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    with open(f"{output_dir}/tracking.jsonl", "a") as f:
        f.write(json.dumps(entry) + "\n")
    
    return entry

def main():
    if len(sys.argv) < 4:
        print("🎥 ContentClaw v2.0 - Framework Generator")
        print("\nUsage:")
        print("  python3 contentclaw_v2.py <video_title> <channel> <framework>")
        print("\nFrameworks:")
        for key, fw in FRAMEWORKS.items():
            print(f"  {fw['emoji']} {key:<15} - {fw['name']}")
        print("\nExample:")
        print("  python3 contentclaw_v2.py 'AI Business' 'JohnnyTube' hormozi")
        sys.exit(1)
    
    video_title = sys.argv[1]
    channel = sys.argv[2]
    framework = sys.argv[3].lower()
    
    if framework not in FRAMEWORKS:
        print(f"❌ Unknown framework: {framework}")
        print(f"Available: {', '.join(FRAMEWORKS.keys())}")
        sys.exit(1)
    
    fw_info = FRAMEWORKS[framework]
    print(f"\n{fw_info['emoji']} Generating with {fw_info['name']}")
    print(f"   Style: {fw_info['style']}\n")
    
    # Generate for all platforms
    platforms = ["linkedin", "x", "reddit"]
    results = {}
    
    for platform in platforms:
        print(f"📝 {platform.upper()}...")
        content = generate_content(video_title, channel, framework, platform)
        results[platform] = content
    
    # Display results
    print("\n" + "="*60)
    print(f"💼 LINKEDIN (Limit: {LIMITS['linkedin']} chars)")
    print("="*60)
    print(results["linkedin"])
    print(f"\n📊 Character count: {len(results['linkedin'])}")
    
    print("\n" + "="*60)
    print(f"🐦 X/THREAD (Limit: {LIMITS['x']} chars per tweet)")
    print("="*60)
    for i, tweet in enumerate(results["x"], 1):
        print(f"\n--- Tweet {i} ({len(tweet)} chars) ---")
        print(tweet)
    
    print("\n" + "="*60)
    print(f"🔴 REDDIT (Limit: {LIMITS['reddit']} chars)")
    print("="*60)
    print(results["reddit"])
    print(f"\n📊 Character count: {len(results['reddit'])}")
    
    # Save
    output = {
        "meta": {
            "generated_at": datetime.now().isoformat(),
            "video_title": video_title,
            "channel": channel,
            "framework": framework,
            "framework_info": fw_info
        },
        "content": results
    }
    
    filename = f"/home/ubuntu/clawd/agents/contentclaw/memory/{framework}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w') as f:
        json.dump(output, f, indent=2)
    
    # Track
    save_to_tracking(video_title, channel, framework, platforms)
    
    print(f"\n💾 Saved to: {filename}")
    print("📊 Tracked for performance analysis")
    print(f"\n✅ {fw_info['name']} content complete!")
    print(f"\n💡 Next: Test this framework, then try another to compare!")

if __name__ == "__main__":
    main()
