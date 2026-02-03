'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, Play } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    testRegex();
  }, [pattern, flags, text]);

  const testRegex = () => {
    if (!pattern || !text) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results = text.match(regex);
      setMatches(results || []);
      setError(null);
    } catch (e) {
      setError('Invalid regex pattern: ' + (e as Error).message);
      setMatches([]);
    }
  };

  const copyToClipboard = async () => {
    const fullPattern = `/${pattern}/${flags}`;
    await navigator.clipboard.writeText(fullPattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setPattern('');
    setText('');
    setMatches([]);
    setError(null);
  };

  const highlightMatches = () => {
    if (!pattern || !text || error) return text;
    
    try {
      const regex = new RegExp(`(${pattern})`, flags.includes('g') ? flags : flags + 'g');
      return text.split(regex).map((part, i) => {
        if (i % 2 === 1) {
          return <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">{part}</mark>;
        }
        return part;
      });
    } catch {
      return text;
    }
  };

  const commonPatterns = [
    { name: 'Email', pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$', flags: '' },
    { name: 'URL', pattern: 'https?://[^\\s]+', flags: 'i' },
    { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: '' },
    { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', flags: '' },
    { name: 'Hex Color', pattern: '#[a-fA-F0-9]{6}', flags: '' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', flags: '' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">.*</span>
          Regex Tester
        </CardTitle>
        <CardDescription>
          Test regular expressions with live matching and highlighting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Common Patterns</label>
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((p) => (
              <Button
                key={p.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  setPattern(p.pattern);
                  setFlags(p.flags);
                }}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Pattern</label>
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center text-muted-foreground">/</span>
              <Input
                placeholder="Enter regex pattern..."
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="font-mono flex-1"
              />
              <span className="flex items-center text-muted-foreground">/</span>
              <Input
                placeholder="flags"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="font-mono w-20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Flags</label>
            <div className="flex flex-wrap gap-1">
              {['g', 'i', 'm', 's', 'u'].map((f) => (
                <Button
                  key={f}
                  variant={flags.includes(f) ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (flags.includes(f)) {
                      setFlags(flags.replace(f, ''));
                    } else {
                      setFlags(flags + f);
                    }
                  }}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Test Text</label>
          <Textarea
            placeholder="Enter text to test against..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        {text && pattern && !error && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Highlighted Matches</label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copy Pattern
              </Button>
            </div>
            <div className="p-3 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap">
              {highlightMatches()}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Matches</label>
            {error ? (
              <Badge variant="destructive">{error}</Badge>
            ) : (
              <Badge variant={matches.length > 0 ? 'default' : 'secondary'}>
                {matches.length} match{matches.length !== 1 ? 'es' : ''}
              </Badge>
            )}
          </div>
          <div className="p-3 bg-muted rounded-lg">
            {matches.length > 0 ? (
              <ul className="space-y-1">
                {matches.map((match, i) => (
                  <li key={i} className="font-mono text-sm">
                    <span className="text-muted-foreground">{i + 1}:</span> {match}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No matches found</p>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Flags:</strong> g (global), i (ignore case), m (multiline), s (dotAll), u (unicode)</p>
        </div>
      </CardContent>
    </Card>
  );
}
