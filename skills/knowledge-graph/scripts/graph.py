#!/usr/bin/env python3
"""
knowledge-graph: Extract entities, relationships, and build a persistent graph database
"""
import json
import sys
import re
from datetime import datetime
from pathlib import Path
from collections import defaultdict
import hashlib

GRAPH_FILE = Path("/home/ubuntu/clawd/memory/knowledge_graph.json")

# Entity type patterns (basic extraction)
ENTITY_PATTERNS = {
    "person": [
        r'@\w+',  # Usernames @name
        r'\b(?:Steve|Rajesh)\b',  # Known people
    ],
    "technology": [
        r'\b(?:Python|JavaScript|TypeScript|React|Node\.js|Nodejs|Docker|Kubernetes|AWS|GCP|Azure|Linux|Ubuntu|PostgreSQL|MongoDB|Redis|GraphQL|REST|API|CLI|npm|pip|git|GitHub|GitLab|Terraform|Ansible|JSON|SQLite|HTML|CSS|HTTP|HTTPS|SSL|SSH)\b',
    ],
    "project": [
        r'\b(?:TaskMaster|KnowledgeGraph|Humanizer|SelfImproving|SysadminToolbox|Clawdbot)\b',
    ],
    "organization": [
        r'\b(?:Google|Amazon|Microsoft|Apple|Meta|Netflix|Uber|Airbnb|Stripe|Shopify|Vercel|OpenAI|Anthropic)\b',
    ],
    "concept": [
        r'\b(?:AI|ML|DevOps|SRE|Backend|Frontend|Full.?stack|SaaS|PaaS|IaaS|Serverless|Microservices|Monolith|Graph|Database|Knowledge Graph)\b',
    ],
}

# Relationship indicators
RELATIONSHIP_INDICATORS = {
    "created_by": ["created by", "built by", "made by", "authored by", "developed by"],
    "uses": ["uses", "using", "built with", "powered by", "runs on", "deployed on"],
    "part_of": ["part of", "component of", "module of", "belongs to"],
    "depends_on": ["depends on", "requires", "needs", "relies on"],
    "related_to": ["related to", "associated with", "connected to", "linked to"],
    "works_with": ["works with", "collaborates with", "partners with"],
    "maintains": ["maintains", "manages", "owns", "supports"],
}

def load_graph():
    """Load the knowledge graph."""
    if GRAPH_FILE.exists():
        with open(GRAPH_FILE) as f:
            return json.load(f)
    return {
        "nodes": {},  # id -> {type, name, properties, created_at, mentions}
        "edges": [],  # {source, target, relation, context, created_at}
        "next_id": 1,
    }

def save_graph(data):
    """Save the knowledge graph."""
    GRAPH_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(GRAPH_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def generate_id(name, type_):
    """Generate a stable ID for an entity."""
    return hashlib.md5(f"{type_}:{name.lower()}".encode()).hexdigest()[:12]

def add_node(name, type_, properties=None, context=""):
    """Add a node to the graph."""
    data = load_graph()
    node_id = generate_id(name, type_)
    
    if node_id in data["nodes"]:
        # Update existing node
        data["nodes"][node_id]["mentions"] = data["nodes"][node_id].get("mentions", 0) + 1
        data["nodes"][node_id]["last_mentioned"] = datetime.now().isoformat()
        if context and context not in data["nodes"][node_id].get("contexts", []):
            data["nodes"][node_id].setdefault("contexts", []).append(context[:200])
    else:
        # Create new node
        data["nodes"][node_id] = {
            "id": node_id,
            "name": name,
            "type": type_,
            "properties": properties or {},
            "created_at": datetime.now().isoformat(),
            "mentions": 1,
            "last_mentioned": datetime.now().isoformat(),
            "contexts": [context[:200]] if context else [],
        }
    
    save_graph(data)
    return node_id

def add_edge(source_id, target_id, relation, context=""):
    """Add a relationship between two nodes."""
    data = load_graph()
    
    # Check if edge already exists
    for edge in data["edges"]:
        if edge["source"] == source_id and edge["target"] == target_id and edge["relation"] == relation:
            edge["weight"] = edge.get("weight", 1) + 1
            edge["last_seen"] = datetime.now().isoformat()
            save_graph(data)
            return edge
    
    # Create new edge
    edge = {
        "source": source_id,
        "target": target_id,
        "relation": relation,
        "context": context[:300],
        "created_at": datetime.now().isoformat(),
        "weight": 1,
    }
    data["edges"].append(edge)
    save_graph(data)
    return edge

def extract_entities(text):
    """Extract entities from text using patterns."""
    entities = []
    
    for type_, patterns in ENTITY_PATTERNS.items():
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                name = match.group(0)
                # Skip common false positives
                if len(name) < 2 or name.lower() in ["the", "this", "that", "with", "from"]:
                    continue
                entities.append({
                    "name": name,
                    "type": type_,
                    "position": match.start(),
                })
    
    # Deduplicate
    seen = set()
    unique = []
    for e in entities:
        key = (e["name"].lower(), e["type"])
        if key not in seen:
            seen.add(key)
            unique.append(e)
    
    return unique

def extract_relationships(text, entities):
    """Extract relationships between entities."""
    relationships = []
    text_lower = text.lower()
    
    for i, ent1 in enumerate(entities):
        for ent2 in entities[i+1:]:
            # Check proximity (within 100 chars)
            if abs(ent1["position"] - ent2["position"]) > 200:
                continue
            
            # Check for relationship indicators between them
            start = min(ent1["position"], ent2["position"])
            end = max(ent1["position"], ent2["position"])
            between = text_lower[start:end]
            
            for rel_type, indicators in RELATIONSHIP_INDICATORS.items():
                for indicator in indicators:
                    if indicator in between:
                        relationships.append({
                            "source": ent1,
                            "target": ent2,
                            "relation": rel_type,
                        })
                        break
    
    return relationships

def process_text(text, context=""):
    """Process text to extract entities and relationships."""
    entities = extract_entities(text)
    relationships = extract_relationships(text, entities)
    
    # Add nodes
    node_ids = {}
    for ent in entities:
        node_id = add_node(ent["name"], ent["type"], context=context)
        node_ids[ent["name"]] = node_id
    
    # Add edges
    for rel in relationships:
        source_name = rel["source"]["name"]
        target_name = rel["target"]["name"]
        if source_name in node_ids and target_name in node_ids:
            add_edge(node_ids[source_name], node_ids[target_name], rel["relation"], context)
    
    return {
        "entities_added": len(entities),
        "relationships_added": len(relationships),
        "entities": [e["name"] for e in entities],
    }

def get_node(node_id):
    """Get a node by ID."""
    data = load_graph()
    return data["nodes"].get(node_id)

def find_node(name):
    """Find a node by name (case insensitive)."""
    data = load_graph()
    name_lower = name.lower()
    for node_id, node in data["nodes"].items():
        if node["name"].lower() == name_lower:
            return node
    return None

def get_relationships(node_id, direction="both"):
    """Get relationships for a node."""
    data = load_graph()
    results = []
    
    for edge in data["edges"]:
        if direction in ["out", "both"] and edge["source"] == node_id:
            target = data["nodes"].get(edge["target"])
            results.append({
                "direction": "->",
                "relation": edge["relation"],
                "node": target,
                "weight": edge.get("weight", 1),
            })
        if direction in ["in", "both"] and edge["target"] == node_id:
            source = data["nodes"].get(edge["source"])
            results.append({
                "direction": "<-",
                "relation": edge["relation"],
                "node": source,
                "weight": edge.get("weight", 1),
            })
    
    return results

def query_graph(query_type, **kwargs):
    """Query the graph."""
    data = load_graph()
    
    if query_type == "nodes_by_type":
        type_ = kwargs.get("type")
        return [n for n in data["nodes"].values() if n["type"] == type_]
    
    elif query_type == "connected":
        node_id = kwargs.get("node_id")
        return get_relationships(node_id)
    
    elif query_type == "path":
        source = kwargs.get("source")
        target = kwargs.get("target")
        # Simple BFS for path finding
        visited = set()
        queue = [(source, [source])]
        while queue:
            current, path = queue.pop(0)
            if current == target:
                return path
            if current in visited:
                continue
            visited.add(current)
            for edge in data["edges"]:
                if edge["source"] == current and edge["target"] not in visited:
                    queue.append((edge["target"], path + [edge["target"]]))
        return None
    
    elif query_type == "most_mentioned":
        limit = kwargs.get("limit", 10)
        nodes = sorted(data["nodes"].values(), key=lambda x: x.get("mentions", 0), reverse=True)
        return nodes[:limit]
    
    return []

def format_graph_stats():
    """Get statistics about the graph."""
    data = load_graph()
    stats = {
        "total_nodes": len(data["nodes"]),
        "total_edges": len(data["edges"]),
        "by_type": defaultdict(int),
    }
    
    for node in data["nodes"].values():
        stats["by_type"][node["type"]] += 1
    
    return stats

def export_dot(output_file="graph.dot"):
    """Export graph to Graphviz DOT format."""
    data = load_graph()
    lines = ["digraph KnowledgeGraph {"]
    lines.append('  rankdir=LR;')
    lines.append('  node [shape=box];')
    
    # Color by type
    colors = {
        "person": "lightblue",
        "technology": "lightgreen",
        "project": "lightyellow",
        "organization": "lightcoral",
        "concept": "plum",
    }
    
    for node_id, node in data["nodes"].items():
        color = colors.get(node["type"], "white")
        label = node["name"].replace('"', '\\"')
        lines.append(f'  "{node_id}" [label="{label}", fillcolor={color}, style=filled];')
    
    for edge in data["edges"]:
        label = edge["relation"]
        weight = edge.get("weight", 1)
        lines.append(f'  "{edge["source"]}" -> "{edge["target"]}" [label="{label}", penwidth={min(weight, 5)}];')
    
    lines.append("}")
    
    with open(output_file, 'w') as f:
        f.write("\n".join(lines))
    
    return output_file

def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h"):
        print("Usage: graph.py <command> [args]")
        print("Commands: process, show, find, related, stats, export")
        print("\nExamples:")
        print("  graph.py process 'Extract entities from this text'")
        print("  graph.py show Python")
        print("  graph.py stats")
        sys.exit(0 if sys.argv[1] in ("--help", "-h") else 1)
    
    cmd = sys.argv[1]
    
    if cmd == "process":
        text = sys.argv[2] if len(sys.argv) > 2 else sys.stdin.read()
        result = process_text(text)
        print(f"Extracted {result['entities_added']} entities, {result['relationships_added']} relationships")
        if result['entities']:
            print(f"Entities: {', '.join(result['entities'][:10])}")
    
    elif cmd == "add":
        if len(sys.argv) < 5:
            print("Usage: add <name> <type> [context]")
            sys.exit(1)
        node_id = add_node(sys.argv[2], sys.argv[3], context=sys.argv[4] if len(sys.argv) > 4 else "")
        print(f"Added node: {node_id}")
    
    elif cmd == "relate":
        if len(sys.argv) < 5:
            print("Usage: relate <source_name> <target_name> <relation>")
            sys.exit(1)
        source = find_node(sys.argv[2])
        target = find_node(sys.argv[3])
        if source and target:
            add_edge(source["id"], target["id"], sys.argv[4])
            print(f"Added relationship: {sys.argv[2]} -> {sys.argv[4]} -> {sys.argv[3]}")
        else:
            print("Node not found")
    
    elif cmd == "show":
        if len(sys.argv) < 3:
            print("Usage: show <name>")
            sys.exit(1)
        node = find_node(sys.argv[2])
        if node:
            print(f"{node['name']} ({node['type']})")
            print(f"  Mentions: {node.get('mentions', 0)}")
            print(f"  Created: {node['created_at'][:10]}")
            rels = get_relationships(node["id"])
            if rels:
                print("  Relationships:")
                for r in rels:
                    print(f"    {r['direction']} {r['node']['name']} ({r['relation']})")
        else:
            print("Node not found")
    
    elif cmd == "find":
        if len(sys.argv) < 3:
            print("Usage: find <name>")
            sys.exit(1)
        node = find_node(sys.argv[2])
        if node:
            print(f"Found: {node['name']} ({node['type']}) - ID: {node['id']}")
        else:
            print("Not found")
    
    elif cmd == "type":
        if len(sys.argv) < 3:
            print("Usage: type <entity_type>")
            sys.exit(1)
        nodes = query_graph("nodes_by_type", type=sys.argv[2])
        for node in nodes:
            print(f"  {node['name']} (mentioned {node.get('mentions', 0)}x)")
    
    elif cmd == "stats":
        stats = format_graph_stats()
        print(f"Total nodes: {stats['total_nodes']}")
        print(f"Total edges: {stats['total_edges']}")
        print("By type:")
        for t, count in stats["by_type"].items():
            print(f"  {t}: {count}")
    
    elif cmd == "export":
        filename = export_dot()
        print(f"Exported to {filename}")
        print("Convert with: dot -Tpng graph.dot -o graph.png")
    
    else:
        print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()