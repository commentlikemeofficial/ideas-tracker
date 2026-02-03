#!/usr/bin/env node
/**
 * DeepWiki MCP Client
 * Query GitHub repository documentation via DeepWiki MCP server
 */

const https = require('https');

const BASE_URL = 'https://deepwiki.com';

function httpGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'deepwiki.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DeepWiki-CLI/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function httpPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'deepwiki.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'User-Agent': 'DeepWiki-CLI/1.0',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function askQuestion(repo, question) {
  try {
    const result = await httpPost(`/api/ask`, { repo, question });
    console.log(result);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

async function getStructure(repo) {
  try {
    const result = await httpGet(`/api/structure?repo=${encodeURIComponent(repo)}`);
    console.log(result);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

async function getContents(repo, path) {
  try {
    const result = await httpGet(`/api/contents?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}`);
    console.log(result);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

function usage() {
  console.log(`
Usage: deepwiki.js <command> <owner/repo> [args]

Commands:
  ask <owner/repo> "question"     Ask a question about the repo
  structure <owner/repo>          Get wiki structure
  contents <owner/repo> <path>    Get contents of specific path

Examples:
  node deepwiki.js ask facebook/react "How does useEffect work?"
  node deepwiki.js structure vercel/next.js
  node deepwiki.js contents microsoft/vscode api
`);
}

async function main() {
  const [command, repo, ...rest] = process.argv.slice(2);

  if (!command || !repo) {
    usage();
    process.exit(1);
  }

  switch (command) {
    case 'ask':
      if (!rest.length) {
        console.error('Error: Question required');
        usage();
        process.exit(1);
      }
      await askQuestion(repo, rest.join(' '));
      break;
    case 'structure':
      await getStructure(repo);
      break;
    case 'contents':
      if (!rest.length) {
        console.error('Error: Path required');
        usage();
        process.exit(1);
      }
      await getContents(repo, rest.join(' '));
      break;
    default:
      console.error('Unknown command:', command);
      usage();
      process.exit(1);
  }
}

main();
