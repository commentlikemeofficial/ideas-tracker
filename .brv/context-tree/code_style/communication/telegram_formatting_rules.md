## Relations
@project_management/agent_architecture/agent_hierarchy_and_communication.md

## Raw Concept
**Task:**
Document mandatory Telegram formatting rules for all agent communications

**Changes:**
- Standardized all outgoing Telegram notifications to a mobile-first, table-free format

**Files:**
- HEARTBEAT.md

**Flow:**
Generate Report -> Apply Telegram Formatting Rules -> Send via Steve Filter

**Timestamp:** 2026-02-04

## Narrative
### Structure
- Guidelines: .brv/context-tree/code_style/communication/telegram_formatting.md

### Dependencies
- Platform: Telegram
- Viewport: Mobile-first (narrow width)
- Formatting: Plain text with specific hierarchy markers

### Features
- No ASCII tables (use bullet lists instead)
- Max 1 emoji per section title
- Short, scannable lines (max 40-50 chars recommended)
- Status indicators: Text-based (e.g., Active, Idle, Blocked) instead of icons
- Visual Hierarchy: Title -> Divider (---) -> Bullet points
