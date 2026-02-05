## Relations
@project_management/operations/heartbeat_and_operations.md
@project_management/agent_architecture/agent_hierarchy_and_communication.md

## Raw Concept
**Task:**
Establish skill utilization strategy and tracking system

**Changes:**
- Implemented "Skill Utilization Mandate" requiring 90-100% capacity usage of all tools.
- Defined a 3-week activation roadmap for pending skills (Notion, Google Sheets, Knowledge Graph).

**Files:**
- skills-utilization-tracker.md

**Flow:**
Task -> Query byteover -> Execute with specialized skills -> Log to Notion/Sheets -> Extract entities to Knowledge Graph

**Timestamp:** 2026-02-05

## Narrative
### Structure
- Registry: skills-utilization-tracker.md
- Schedule: 3-week activation plan (Feb 2026)
- Domains: Research, Development, Automation, Content, Monitoring, Integration

### Dependencies
- Mandate: 90-100% capacity utilization of all skills.
- Active Integrations: X/Twitter (bird), Reddit (reddit-cli).
- Hardware/API Dependencies: Nano Banana Pro (requires GEMINI_API_KEY).
- Monitoring: Weekly diagnostics and monthly security audits.

### Features
- Research: web_search, firecrawl (daily), reddit/bird monitoring, deepwiki/context7 for dev.
- Development: coding-agent, github, notion (project logging), google-sheets (metrics).
- Automation: cron, byteover (pre-task query), knowledge-graph (entity extraction).
- Content: nano-banana-pro (images), tts, humanizer, ui-formatter (Telegram).
