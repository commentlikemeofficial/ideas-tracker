import fs from "fs/promises";
import path from "path";
import { glob } from "glob";

export interface Document {
  id: string;
  title: string;
  path: string;
  content: string;
  category: string;
  lastModified: Date;
  links: string[];
}

const KNOWLEDGE_PATHS = [
  "/home/ubuntu/clawd/.brv/canonical-memory",
  "/home/ubuntu/clawd/memory",
];

export async function getAllDocuments(): Promise<Document[]> {
  const documents: Document[] = [];

  for (const basePath of KNOWLEDGE_PATHS) {
    try {
      const files = await glob("**/*.md", { cwd: basePath, absolute: true });
      
      for (const file of files) {
        try {
          const content = await fs.readFile(file, "utf-8");
          const stat = await fs.stat(file);
          
          // Extract title from first h1 or filename
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : path.basename(file, ".md");
          
          // Extract links [[...]] or [...](...)
          const linkMatches = content.match(/\[\[([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)/g) || [];
          const links = linkMatches.map(m => m.replace(/[\[\]()]/g, ""));
          
          // Determine category from path
          const relativePath = path.relative(basePath, file);
          const category = relativePath.split("/")[0] || "general";
          
          documents.push({
            id: Buffer.from(file).toString("base64"),
            title,
            path: file,
            content,
            category,
            lastModified: stat.mtime,
            links,
          });
        } catch (e) {
          console.error(`Error reading ${file}:`, e);
        }
      }
    } catch (e) {
      console.error(`Error scanning ${basePath}:`, e);
    }
  }

  return documents.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const documents = await getAllDocuments();
  return documents.find(d => d.id === id) || null;
}

export async function getDocumentsByCategory(category: string): Promise<Document[]> {
  const documents = await getAllDocuments();
  return documents.filter(d => d.category === category);
}

export async function getJournalEntries(): Promise<Document[]> {
  const documents = await getAllDocuments();
  return documents
    .filter(d => 
      d.path.includes("memory/") && 
      (d.title.match(/^\d{4}-\d{2}-\d{2}/) || d.path.match(/\d{4}-\d{2}-\d{2}/))
    )
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export function buildGraphData(documents: Document[]) {
  const nodes = documents.map(d => ({
    id: d.id,
    title: d.title,
    category: d.category,
    radius: Math.min(30, 10 + d.content.length / 1000),
  }));

  const links: { source: string; target: string }[] = [];
  const linkSet = new Set<string>();

  for (const doc of documents) {
    for (const link of doc.links) {
      const target = documents.find(d => 
        d.title.toLowerCase() === link.toLowerCase() ||
        d.path.toLowerCase().includes(link.toLowerCase())
      );
      if (target && target.id !== doc.id) {
        const linkKey = [doc.id, target.id].sort().join("-");
        if (!linkSet.has(linkKey)) {
          linkSet.add(linkKey);
          links.push({ source: doc.id, target: target.id });
        }
      }
    }
  }

  return { nodes, links };
}
