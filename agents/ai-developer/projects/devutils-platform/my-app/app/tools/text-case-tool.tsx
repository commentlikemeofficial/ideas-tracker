'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, Type } from 'lucide-react';

export function TextCaseTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (content: string, type: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearAll = () => {
    setInput('');
  };

  const conversions = [
    {
      name: 'Original',
      transform: (text: string) => text,
      id: 'original'
    },
    {
      name: 'UPPERCASE',
      transform: (text: string) => text.toUpperCase(),
      id: 'uppercase'
    },
    {
      name: 'lowercase',
      transform: (text: string) => text.toLowerCase(),
      id: 'lowercase'
    },
    {
      name: 'Title Case',
      transform: (text: string) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      id: 'title'
    },
    {
      name: 'Sentence case',
      transform: (text: string) => text.toLowerCase().replace(/(^")|\. +[a-z]/g, match => match.toUpperCase()),
      id: 'sentence'
    },
    {
      name: 'camelCase',
      transform: (text: string) => text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, ''),
      id: 'camel'
    },
    {
      name: 'PascalCase',
      transform: (text: string) => text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
        .replace(/\s+/g, ''),
      id: 'pascal'
    },
    {
      name: 'snake_case',
      transform: (text: string) => text
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_')
        .replace(/^_+|_+$/g, ''),
      id: 'snake'
    },
    {
      name: 'kebab-case',
      transform: (text: string) => text
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-')
        .replace(/^-+|-+$/g, ''),
      id: 'kebab'
    },
    {
      name: 'CONSTANT_CASE',
      transform: (text: string) => text
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toUpperCase())
        .join('_')
        .replace(/^_+|_+$/g, ''),
      id: 'constant'
    },
    {
      name: 'dot.case',
      transform: (text: string) => text
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('.')
        .replace(/^\.+|\.+$/g, ''),
      id: 'dot'
    },
    {
      name: 'Path/Case',
      transform: (text: string) => text
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('/')
        .replace(/^\/+|\/+$/g, ''),
      id: 'path'
    },
    {
      name: 'Slugs-case',
      transform: (text: string) => text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      id: 'slug'
    },
    {
      name: 'StudlyCaps',
      transform: (text: string) => text
        .replace(/\W+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(''),
      id: 'studly'
    },
  ];

  const stats = {
    chars: input.length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    lines: input ? input.split('\n').length : 0,
    bytes: new Blob([input]).size,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-6 w-6" />
          Text Case Converter
        </CardTitle>
        <CardDescription>
          Convert text between different case formats: camelCase, snake_case, kebab-case, and more
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input Text</label>
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          <Textarea
            placeholder="Enter text to convert..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
        </div>

        {/* Stats */}
        {input && (
          <div className="flex gap-4 flex-wrap">
            <Badge variant="secondary">{stats.chars} characters</Badge>
            <Badge variant="secondary">{stats.words} words</Badge>
            <Badge variant="secondary">{stats.lines} lines</Badge>
            <Badge variant="secondary">{stats.bytes} bytes</Badge>
          </div>
        )}

        {/* Conversions */}
        {input && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Conversions</label>
            <div className="grid gap-2">
              {conversions.map((conv) => {
                const result = conv.transform(input);
                if (!result && conv.id !== 'original') return null;
                
                return (
                  <div key={conv.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground w-28 shrink-0">{conv.name}</span>
                      <code className="text-sm font-mono break-all">{result}</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result, conv.id)}
                      className="h-8 w-8 p-0 ml-2 shrink-0"
                    >
                      {copied === conv.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
