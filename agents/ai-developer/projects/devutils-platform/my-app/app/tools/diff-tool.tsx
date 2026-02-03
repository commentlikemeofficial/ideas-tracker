'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, FileText, Trash2 } from 'lucide-react';

export function DiffTool() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [copied, setCopied] = useState(false);

  const diff = useMemo(() => {
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    
    const result: { type: 'same' | 'removed' | 'added'; left?: string; right?: string; lineNum: number }[] = [];
    
    let i = 0, j = 0;
    const maxLen = Math.max(leftLines.length, rightLines.length);
    
    while (i < leftLines.length || j < rightLines.length) {
      const leftLine = leftLines[i];
      const rightLine = rightLines[j];
      
      if (i >= leftLines.length) {
        result.push({ type: 'added', right: rightLine, lineNum: j + 1 });
        j++;
      } else if (j >= rightLines.length) {
        result.push({ type: 'removed', left: leftLine, lineNum: i + 1 });
        i++;
      } else if (leftLine === rightLine) {
        result.push({ type: 'same', left: leftLine, right: rightLine, lineNum: i + 1 });
        i++;
        j++;
      } else {
        // Simple diff - mark both as different
        result.push({ type: 'removed', left: leftLine, lineNum: i + 1 });
        result.push({ type: 'added', right: rightLine, lineNum: j + 1 });
        i++;
        j++;
      }
    }
    
    return result;
  }, [leftText, rightText]);

  const stats = useMemo(() => {
    const same = diff.filter(d => d.type === 'same').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const added = diff.filter(d => d.type === 'added').length;
    return { same, removed, added };
  }, [diff]);

  const copyDiff = async () => {
    const diffText = diff.map(d => {
      if (d.type === 'same') return `  ${d.left}`;
      if (d.type === 'removed') return `- ${d.left}`;
      if (d.type === 'added') return `+ ${d.right}`;
      return '';
    }).join('\n');
    
    await navigator.clipboard.writeText(diffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setLeftText('');
    setRightText('');
  };

  const loadSample = () => {
    setLeftText(`function greet(name) {
  console.log("Hello, " + name);
  return "Hello, " + name;
}

greet("World");`);
    setRightText(`function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

greet("Universe");`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Diff Checker
        </CardTitle>
        <CardDescription>
          Compare two texts and see the differences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={loadSample}>
            Load Sample
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Original Text
            </label>
            <Textarea
              placeholder="Paste original text here..."
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              Modified Text
            </label>
            <Textarea
              placeholder="Paste modified text here..."
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>

        {(leftText || rightText) && (
          <>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                {stats.same} same
              </Badge>
              <Badge variant="destructive" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                {stats.removed} removed
              </Badge>
              <Badge variant="default" className="gap-1 bg-green-600">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                {stats.added} added
              </Badge>
              <Button variant="ghost" size="sm" onClick={copyDiff} className="ml-auto">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copy Diff
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
                Diff View
              </div>
              <div className="max-h-[400px] overflow-auto">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`flex text-sm font-mono ${
                      line.type === 'removed'
                        ? 'bg-red-50 dark:bg-red-950/30'
                        : line.type === 'added'
                        ? 'bg-green-50 dark:bg-green-950/30'
                        : ''
                    }`}
                  >
                    <span className="w-12 px-2 py-1 text-right text-muted-foreground border-r bg-muted/50 select-none">
                      {line.lineNum}
                    </span>
                    <span className="w-8 px-2 py-1 text-center border-r select-none">
                      {line.type === 'same' && ' '}
                      {line.type === 'removed' && (
                        <span className="text-red-600 dark:text-red-400 font-bold">−</span>
                      )}
                      {line.type === 'added' && (
                        <span className="text-green-600 dark:text-green-400 font-bold">+</span>
                      )}
                    </span>
                    <span className="flex-1 px-2 py-1 whitespace-pre">
                      {line.type === 'same' && line.left}
                      {line.type === 'removed' && (
                        <span className="text-red-700 dark:text-red-300">{line.left}</span>
                      )}
                      {line.type === 'added' && (
                        <span className="text-green-700 dark:text-green-300">{line.right}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
