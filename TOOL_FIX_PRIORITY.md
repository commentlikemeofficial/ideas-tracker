# Tool Fix Priority List

## High Priority (Fix First)
1. task-master/scripts/task_manager.py - Core task tracking
2. self-improving/scripts/learner.py - Lesson capture
3. execution-governor/scripts/governor.py - Initiative tracking
4. tavily-search/scripts/tavily.py - Search functionality
5. firecrawl/scripts/firecrawl.py - Web scraping

## Medium Priority
6. google-sheets/scripts/sheets.py - Sheets integration
7. knowledge-graph/scripts/graph.py - Entity tracking
8. linkedin-monitor/scripts/*.py - LinkedIn automation
9. morning-brief/scripts/generate_brief.py - Daily briefs
10. humanizer/scripts/humanize.py - Text humanization

## Lower Priority
11. All other skill scripts
12. Agent scripts

## Testing Command
```bash
python3 /home/ubuntu/clawd/skills/steve-diagnostics/scripts/test-tools.py
```

## Goal
All tools must:
- Exit with code 0 on success
- Handle errors gracefully
- Have --help support
- Be fully functional (not placeholders)
