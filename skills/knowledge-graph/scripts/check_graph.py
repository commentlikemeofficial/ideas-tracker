#!/usr/bin/env python3
"""
Extract and summarize knowledge from recent conversations
"""
import json
import sys
from pathlib import Path
from datetime import datetime, timedelta

GRAPH_FILE = Path("/home/ubuntu/clawd/memory/knowledge_graph.json")

def load_graph():
    if GRAPH_FILE.exists():
        with open(GRAPH_FILE) as f:
            return json.load(f)
    return {"nodes": {}, "edges": []}

def get_recent_additions(hours=24):
    """Get entities added in the last N hours."""
    data = load_graph()
    cutoff = datetime.now() - timedelta(hours=hours)
    
    recent = []
    for node in data["nodes"].values():
        created = datetime.fromisoformat(node["created_at"])
        if created > cutoff:
            recent.append(node)
    
    return recent

def get_active_connections(min_weight=2):
    """Get strong relationships (frequently mentioned)."""
    data = load_graph()
    strong = [e for e in data["edges"] if e.get("weight", 1) >= min_weight]
    return sorted(strong, key=lambda x: -x.get("weight", 1))[:10]

if __name__ == "__main__":
    # Handle --help
    if len(sys.argv) > 1 and sys.argv[1] in ("--help", "-h"):
        print("Usage: check_graph.py")
        print("")
        print("Check for recent additions and strong connections in knowledge graph.")
        print("")
        print("Examples:")
        print("  check_graph.py")
        sys.exit(0)
    
    try:
        recent = get_recent_additions()
        strong = get_active_connections()
        
        output = []
        
        if recent:
            output.append("🆕 RECENT ENTITIES:")
            by_type = {}
            for node in recent:
                by_type.setdefault(node["type"], []).append(node["name"])
            for t, names in by_type.items():
                output.append(f"  {t}: {', '.join(names[:5])}")
        
        if strong:
            output.append("\n🔗 STRONG CONNECTIONS:")
            data = load_graph()
            for edge in strong[:5]:
                source = data["nodes"].get(edge["source"], {}).get("name", "?")
                target = data["nodes"].get(edge["target"], {}).get("name", "?")
                output.append(f"  {source} --{edge['relation']}--> {target} ({edge.get('weight', 1)}x)")
        
        if output:
            print("\n".join(output))
    except Exception as e:
        print(f"Error checking graph: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Always exit 0 - empty output just means no recent additions (not an error)
    sys.exit(0)