// Script to generate static data for the 2nd Brain app
const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

const KNOWLEDGE_PATHS = [
  "/home/ubuntu/clawd/.brv/canonical-memory",
  "/home/ubuntu/clawd/memory",
];

function getAllDocuments() {
  const documents = [];

  for (const basePath of KNOWLEDGE_PATHS) {
    try {
      if (!fs.existsSync(basePath)) continue;
      
      const files = glob.sync("**/*.md", { cwd: basePath, absolute: true });
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(file, "utf-8");
          const stat = fs.statSync(file);
          
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : path.basename(file, ".md");
          
          const linkMatches = content.match(/\[\[([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)/g) || [];
          const links = linkMatches.map(m => m.replace(/[\[\]()]/g, ""));
          
          const relativePath = path.relative(basePath, file);
          const category = relativePath.split("/")[0] || "general";
          
          documents.push({
            id: Buffer.from(file).toString("base64"),
            title,
            path: file,
            content,
            category,
            lastModified: stat.mtime.toISOString(),
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

  return documents.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
}

function buildGraphData(documents) {
  const nodes = documents.map(d => ({
    id: d.id,
    title: d.title,
    category: d.category,
    radius: Math.min(30, 10 + d.content.length / 1000),
  }));

  const links = [];
  const linkSet = new Set();

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

// Generate data
const allDocuments = getAllDocuments();
const journalEntries = allDocuments.filter(d => 
  d.path.includes("memory/") && 
  (d.title.match(/^\d{4}-\d{2}-\d{2}/) || d.path.match(/\d{4}-\d{2}-\d{2}/))
);
const graphData = buildGraphData(allDocuments);

// Write to JSON file
const outputDir = path.join(__dirname, "..", "lib");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, "data.json"),
  JSON.stringify({ allDocuments, journalEntries, graphData }, null, 2)
);

console.log(`Generated data for ${allDocuments.length} documents`);
console.log(`Journal entries: ${journalEntries.length}`);
console.log(`Graph nodes: ${graphData.nodes.length}`);
