---
name: knowledge-graph
description: Extract entities, relationships, and concepts from conversations to build a persistent graph database of people, projects, technologies, and their connections. Use when identifying key entities in discussions, mapping relationships between concepts, building semantic context, or querying connections between topics.
---

# Knowledge Graph

Extract entities and build relationships. Your conversation's semantic backbone.

## Quick Commands

```bash
# Process text to extract entities
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py process "Steve is building a knowledge graph skill using Python and JSON storage"

# Add entity manually
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py add "Kubernetes" technology "Container orchestration platform"

# Create relationship
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py relate "Docker" "Kubernetes" "part_of"

# Show entity details
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py show "Docker"

# List by type
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py type technology

# Graph statistics
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py stats

# Export to Graphviz
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py export
```

## Entity Types

| Type | Extracts | Example |
|------|----------|---------|
| `person` | Names, @handles | Rajesh Kalidandi, @iamkrish_11 |
| `technology` | Tools, languages, platforms | Python, Docker, AWS, React |
| `project` | Products, codebases | TaskMaster, KnowledgeGraph |
| `organization` | Companies, teams | Amazon, Stripe, Vercel |
| `concept` | Ideas, methodologies | DevOps, Microservices, SaaS |

## Relationship Types

- **created_by**: Who built what
- **uses**: Technology adoption
- **part_of**: Composition/containment
- **depends_on**: Dependencies
- **related_to**: General association
- **works_with**: Collaboration
- **maintains**: Ownership

## Usage Patterns

**After conversations, extract key entities:**
```bash
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py process \
  "We're deploying the new API to AWS using Terraform and Docker"
```

**Query connections:**
```bash
# What technologies does Steve use?
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py show "Steve"

# Find all projects
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py type project

# Most mentioned topics
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py stats
```

**Manual relationship building:**
```bash
# When auto-extraction misses something
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py relate \
  "TaskMaster" "Python" "built_with"
```

## Data Schema

See [references/schema.md](references/schema.md) for full structure.

Storage: `/home/ubuntu/clawd/memory/knowledge_graph.json`

Nodes track:
- Name, type, properties
- Mention count (popularity)
- Creation and last mention timestamps
- Context snippets

Edges track:
- Source/target node IDs
- Relationship type
- Context of the relationship
- Weight (frequency of mention)

## Visualization

Export to Graphviz DOT format:
```bash
python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py export
# Creates graph.dot

# Convert to image
dot -Tpng graph.dot -o knowledge_graph.png
```

Nodes are color-coded by type:
- Blue: People
- Green: Technologies
- Yellow: Projects
- Red: Organizations
- Purple: Concepts

## Integration

**During conversations:**
I can automatically process text and suggest adding entities:

> "I noticed you mentioned 'Kubernetes' and 'Docker' — should I track these as related technologies?"

**During heartbeats:**
The check_graph.py script surfaces recent entities and strong connections.

## Examples

**Extract from paragraph:**
```
Input: "Rajesh is building TaskMaster with Python and deploying on AWS"

Extracted:
  - Person: Rajesh
  - Project: TaskMaster
  - Technology: Python
  - Technology: AWS
  - Relation: Rajesh --created_by--> TaskMaster
  - Relation: TaskMaster --uses--> Python
  - Relation: TaskMaster --deployed_on--> AWS
```

**Query results:**
```bash
$ python3 /home/ubuntu/clawd/skills/knowledge-graph/scripts/graph.py show Python
Python (technology)
  Mentions: 12
  Created: 2026-01-28
  Relationships:
    -> Docker (uses)
    <- TaskMaster (built_with)
    <- Steve (prefers)
```

## Notes

- Extraction uses pattern matching (regex), not NLP
- False positives possible — review and clean periodically
- Relationships are bidirectional in meaning but stored unidirectionally
- Use `weight` to identify strongest connections
- Contexts preserve where/how entities were mentioned