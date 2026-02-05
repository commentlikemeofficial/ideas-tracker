## Relations
@project_management/identity_and_soul/steve_identity_and_soul.md
@project_management/operations/heartbeat_and_operations.md

## Raw Concept
**Task:**
Establish and document the agent hierarchy and communication rules

**Changes:**
- Formalized the Rajesh -> Steve -> Sub-Agents hierarchy
- Implemented filtering logic for agent communications

**Files:**
- IDENTITY.md
- HEARTBEAT.md
- .brv/canonical-memory/agents/registry.md

**Flow:**
Agent Task -> Report to Steve -> Steve Filters -> Rajesh Briefing (if actionable)

**Timestamp:** 2026-02-04

## Narrative
### Structure
- agents/contentclaw/IDENTITY.md
- agents/saas-research/IDENTITY.md
- agents/social-media-manager/IDENTITY.md
- agents/vercel-monitor/IDENTITY.md
- agents/code-reviewer/IDENTITY.md
- agents/ai-developer/IDENTITY.md
- agents/tech-architect/IDENTITY.md
- agents/idea-validator/IDENTITY.md (BD Bot context)

### Dependencies
- Primary: Rajesh Kalidandi (Human Authority)
- Central Node: Steve (Autonomous Coworker)
- Sub-Agents: 8 specialized agents (ContentClaw, Scout, Social Media Manager, Vercel Monitor, Code Reviewer, AI Developer, Tech Architect, BD Bot)
- Registry: Stored in .brv/canonical-memory/ (Agent profiles in respective IDENTITY.md files)

### Features
- Steve filters all agent reports before they reach Rajesh
- "Silent Ops": Routine or healthy status reports are handled by Steve without escalating
- "Execute First, Report After": Agents operate autonomously within their domains
- Escalation: Only critical issues (security, data loss, money) bypass the filter
