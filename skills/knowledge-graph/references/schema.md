# Knowledge Graph Schema

## Storage

File: `/home/ubuntu/clawd/memory/knowledge_graph.json`

## Structure

```json
{
  "nodes": {
    "abc123def456": {
      "id": "abc123def456",
      "name": "Docker",
      "type": "technology",
      "properties": {},
      "created_at": "2026-01-28T18:00:00",
      "mentions": 5,
      "last_mentioned": "2026-01-28T19:00:00",
      "contexts": ["Using Docker for deployment"]
    }
  },
  "edges": [
    {
      "source": "abc123def456",
      "target": "def789abc012",
      "relation": "uses",
      "context": "Project X uses Docker",
      "created_at": "2026-01-28T18:00:00",
      "weight": 3
    }
  ],
  "next_id": 100
}
```

## Entity Types

| Type | Description | Examples |
|------|-------------|----------|
| `person` | People, usernames | Rajesh Kalidandi, @iamkrish_11 |
| `technology` | Tools, frameworks, languages | Python, Docker, AWS, React |
| `project` | Projects, products | TaskMaster, KnowledgeGraph |
| `organization` | Companies, teams | Amazon, Google, Stripe |
| `concept` | Abstract concepts | DevOps, Microservices, SaaS |

## Relationship Types

| Relation | Meaning |
|----------|---------|
| `created_by` | Authorship |
| `uses` | Technology adoption |
| `part_of` | Composition |
| `depends_on` | Dependency |
| `related_to` | General association |
| `works_with` | Collaboration |
| `maintains` | Ownership/maintenance |

## Query Patterns

- **By type**: All technologies, all people
- **By connection**: What uses Docker?
- **By mention frequency**: Most discussed topics
- **By path**: How is X connected to Y?
- **By time**: Recently added entities