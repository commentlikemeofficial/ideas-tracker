'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, FileText, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MarkdownTool() {
  const [input, setInput] = useState('# Hello World\n\nThis is **bold** and *italic* text.\n\n## Lists\n\n- Item 1\n- Item 2\n- Item 3\n\n## Code\n\n```javascript\nconsole.log("Hello");\n```');
  const [copied, setCopied] = useState(false);

  // Simple Markdown parser
  const parseMarkdown = (text: string): string => {
    let html = text
      // Headers
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mb-2 mt-4">$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-base font-semibold mb-2 mt-4">$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6 class="text-sm font-semibold mb-2 mt-4">$1</h6>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">$1</code>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="p-4 bg-muted rounded-lg overflow-auto"><code class="text-sm font-mono">$2</code></pre>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="pl-4 border-l-4 border-muted italic my-4">$1</blockquote>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr class="my-6 border-t" />')
      // Unordered lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      // Line breaks
      .replace(/\n/g, '<br />');

    // Wrap lists
    html = html.replace(/(<li[^>]*>.*<\/li>)/g, '<ul class="list-disc my-4">$1</ul>');

    return html;
  };

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
  };

  const loadSample = () => {
    setInput(`# Markdown Preview

This is a **live** markdown preview tool.

## Features

- *Italic* and **bold** text
- Code blocks
- Lists and links

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> This is a blockquote

---

[Visit GitHub](https://github.com)`);
  };

  const cheatsheet = [
    { markdown: '# Heading', result: 'H1' },
    { markdown: '**bold**', result: 'Bold' },
    { markdown: '*italic*', result: 'Italic' },
    { markdown: '`code`', result: 'Code' },
    { markdown: '[link](url)', result: 'Link' },
    { markdown: '- item', result: 'List' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Markdown Preview
        </CardTitle>
        <CardDescription>
          Write markdown and see the rendered preview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={loadSample}>
            Load Sample
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Quick Reference */}
        <div className="flex flex-wrap gap-2">
          {cheatsheet.map((item) => (
            <Badge key={item.markdown} variant="outline" className="font-mono text-xs">
              {item.markdown} → {item.result}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="split" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="edit">Edit Only</TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-1" />
              Preview Only
            </TabsTrigger>
          </TabsList>

          <TabsContent value="split" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Markdown</label>
                <Textarea
                  placeholder="Enter markdown..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Preview</label>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(input)}>
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy Markdown
                  </Button>
                </div>
                <div 
                  className="min-h-[400px] p-4 border rounded-lg prose prose-sm max-w-none dark:prose-invert overflow-auto"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit">
            <div className="space-y-2">
              <label className="text-sm font-medium">Markdown</label>
              <Textarea
                placeholder="Enter markdown..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div 
              className="min-h-[500px] p-4 border rounded-lg prose max-w-none dark:prose-invert overflow-auto"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
