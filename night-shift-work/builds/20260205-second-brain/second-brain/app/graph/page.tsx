"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";
import { graphData } from "@/lib/data";

interface GraphNode {
  id: string;
  title: string;
  category: string;
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

export default function GraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use static data
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (!svgRef.current || loading) return;

    const { nodes, links } = graphData as { nodes: GraphNode[], links: GraphLink[] };
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Color scale for categories
    const categories = [...new Set(nodes.map(n => n.category))];
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]);

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 5));

    // Create container with zoom
    const container = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Draw links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#374151")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.4);

    // Draw nodes
    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Node circles
    node.append("circle")
      .attr("r", (d: GraphNode) => d.radius)
      .attr("fill", (d: GraphNode) => colorScale(d.category) as string)
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8);

    // Node labels
    node.append("text")
      .text((d: GraphNode) => d.title.length > 20 ? d.title.slice(0, 20) + "..." : d.title)
      .attr("x", (d: GraphNode) => d.radius + 5)
      .attr("y", 4)
      .attr("font-size", "10px")
      .attr("fill", "#9ca3af")
      .attr("pointer-events", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => (d.source as GraphNode).x!)
        .attr("y1", (d: any) => (d.source as GraphNode).y!)
        .attr("x2", (d: any) => (d.target as GraphNode).x!)
        .attr("y2", (d: any) => (d.target as GraphNode).y!);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Click background to deselect
    svg.on("click", () => setSelectedNode(null));

    return () => {
      simulation.stop();
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const { nodes } = graphData as { nodes: GraphNode[] };

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 pointer-events-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Graph</h1>
            <p className="text-sm text-gray-400">
              {nodes.length} documents • Drag to rearrange • Scroll to zoom
            </p>
          </div>
        </div>
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: "600px" }}
      />

      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 bg-gray-900 border border-gray-800 rounded-lg p-4 max-w-sm">
          <h3 className="font-semibold mb-1">{selectedNode.title}</h3>
          <p className="text-xs text-gray-500 mb-3 capitalize">
            Category: {selectedNode.category}
          </p>
          <Link
            href={`/doc/${encodeURIComponent(selectedNode.id)}`}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            View document →
          </Link>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900 border border-gray-800 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-2">Categories</p>
        <div className="space-y-1">
          {[...new Set(nodes.map((d: GraphNode) => d.category))].slice(0, 6).map((cat, i) => (
            <div key={cat} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"][i] }}
              />
              <span className="capitalize">{String(cat).replace(/-/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
