#!/usr/bin/env node
/**
 * Prompt Log Extractor
 * Extract conversation transcripts from AI coding session logs
 * Supports: Clawdbot, Claude Code, Codex, Kimi
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: null,
    output: null,
    after: null,
    before: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' || args[i] === '-o') {
      options.output = args[++i];
    } else if (args[i] === '--after' || args[i] === '-a') {
      options.after = new Date(args[++i]);
    } else if (args[i] === '--before' || args[i] === '-b') {
      options.before = new Date(args[++i]);
    } else if (!options.input && !args[i].startsWith('-')) {
      options.input = args[i];
    }
  }

  return options;
}

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

function extractClawdbot(lines) {
  const messages = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'message' && entry.message) {
        const role = entry.message.role;
        const content = entry.message.content;
        let text = '';
        
        if (Array.isArray(content)) {
          for (const part of content) {
            if (part.type === 'text' && part.text) {
              text += part.text;
            } else if (part.thinking) {
              text += `[thinking: ${part.thinking.slice(0, 100)}...]`;
            }
          }
        } else if (typeof content === 'string') {
          text = content;
        }
        
        if (text) {
          messages.push({
            timestamp: entry.timestamp,
            role: role,
            content: text
          });
        }
      }
    } catch (e) {
      // Skip malformed lines
    }
  }
  return messages;
}

function extractKimi(lines) {
  const messages = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      // Kimi format varies, try common patterns
      if (entry.role && entry.content) {
        messages.push({
          timestamp: entry.timestamp || new Date().toISOString(),
          role: entry.role,
          content: typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content)
        });
      } else if (entry.messages) {
        for (const msg of entry.messages) {
          if (msg.role && msg.content) {
            messages.push({
              timestamp: entry.timestamp || new Date().toISOString(),
              role: msg.role,
              content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
            });
          }
        }
      }
    } catch (e) {
      // Skip malformed lines
    }
  }
  return messages;
}

function extractGeneric(lines) {
  // Try to detect format and extract
  const messages = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      
      // Try common patterns
      if (entry.message?.role && entry.message?.content) {
        messages.push({
          timestamp: entry.timestamp || entry.message.timestamp || new Date().toISOString(),
          role: entry.message.role,
          content: typeof entry.message.content === 'string' 
            ? entry.message.content 
            : JSON.stringify(entry.message.content)
        });
      } else if (entry.role && entry.content) {
        messages.push({
          timestamp: entry.timestamp || new Date().toISOString(),
          role: entry.role,
          content: typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content)
        });
      }
    } catch (e) {
      // Skip malformed lines
    }
  }
  return messages;
}

function extractTranscript(inputPath, options) {
  const content = fs.readFileSync(inputPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  
  if (lines.length === 0) {
    throw new Error('Empty session file');
  }
  
  // Detect format and extract
  let messages = extractClawdbot(lines);
  if (messages.length === 0) {
    messages = extractKimi(lines);
  }
  if (messages.length === 0) {
    messages = extractGeneric(lines);
  }
  
  // Apply time filters
  if (options.after) {
    messages = messages.filter(m => new Date(m.timestamp) >= options.after);
  }
  if (options.before) {
    messages = messages.filter(m => new Date(m.timestamp) <= options.before);
  }
  
  return messages;
}

function formatMarkdown(messages, inputPath) {
  const now = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  let md = `# Prompt Log Extract\n\n`;
  md += `- **Source:** \`${inputPath}\`\n`;
  md += `- **Extracted:** ${now}\n`;
  md += `- **Messages:** ${messages.length}\n\n`;
  md += `---\n\n`;
  
  for (const msg of messages) {
    const time = formatTimestamp(msg.timestamp);
    const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
    
    md += `**${role}** (${time}):\n\n`;
    md += msg.content.split('\n').map(l => '> ' + l).join('\n');
    md += '\n\n---\n\n';
  }
  
  return md;
}

function main() {
  const options = parseArgs();
  
  if (!options.input) {
    console.error(`
Usage: extract.js <session-file> [options]

Options:
  -o, --output <path>    Output file (default: .prompt-log/YYYY-MM-DD-HHMMSS.md)
  -a, --after <iso>      Filter messages after timestamp
  -b, --before <iso>     Filter messages before timestamp

Examples:
  extract.js ~/.kimi/sessions/session-abc.jsonl
  extract.js ~/.clawdbot/agents/main/sessions/123.jsonl -o transcript.md
  extract.js session.jsonl --after "2026-01-30T10:00:00"
`);
    process.exit(1);
  }
  
  if (!fs.existsSync(options.input)) {
    console.error(`Error: File not found: ${options.input}`);
    process.exit(1);
  }
  
  try {
    const messages = extractTranscript(options.input, options);
    
    if (messages.length === 0) {
      console.error('No messages found in session file');
      process.exit(1);
    }
    
    const markdown = formatMarkdown(messages, options.input);
    
    // Determine output path
    let outputPath = options.output;
    if (!outputPath) {
      const promptLogDir = path.join(process.cwd(), '.prompt-log');
      if (!fs.existsSync(promptLogDir)) {
        fs.mkdirSync(promptLogDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      outputPath = path.join(promptLogDir, `${timestamp}.md`);
    }
    
    fs.writeFileSync(outputPath, markdown);
    console.log(`✅ Extracted ${messages.length} messages to: ${outputPath}`);
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
