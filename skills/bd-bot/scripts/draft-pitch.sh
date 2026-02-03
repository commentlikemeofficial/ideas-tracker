#!/bin/bash
# Draft Pitch - Generate personalized pitch

COMPANY="${1:-}"

if [ -z "$COMPANY" ]; then
    echo "Usage: ./draft-pitch.sh 'Company Name'"
    echo ""
    echo "Generates a personalized pitch using your consently.in case study"
    exit 1
fi

cat << 'EOF'

📧 PITCH TEMPLATE
================

Hi [Name],

Saw you're building at COMPANY and looking for [Role/Help]. 

I recently solo-built consently.in — a DPDPA 2023 compliance platform now in beta with 15+ users, processed 500+ documents. Built entirely with Next.js + Supabase + AI APIs.

What I shipped solo:
• Full auth + RBAC system
• AI document analysis pipeline  
• Real-time compliance scoring
• Production deployment + monitoring

Instead of going through hiring cycles, I can jump in and deliver production features immediately. Open to a quick chat about what you're building?

Quick stats:
• 60+ GitHub repos, 30+ stars
• 20+ projects shipped in 2 months
• Patent holder (Steve - smart blind stick)
• Built + launched CommentLikeMe (Chrome extension)

Best,
Rajesh Kalidandi
📧 rajeshkalidandi11@gmail.com
🔗 linkedin.com/in/rajeshkalidandi
🐙 github.com/rajeshkalidandi

---

📱 FOLLOW-UP (3-4 days later):

Hi [Name],

Quick follow-up on my note about COMPANY. Still open to exploring how I can help with [specific challenge]?

If timing's off, no worries — happy to reconnect later.

Rajesh

EOF

echo ""
echo "💡 Customize: Replace [Name], [Role/Help], and COMPANY above"
echo "📤 Send via: LinkedIn DM, Email, or Twitter"
