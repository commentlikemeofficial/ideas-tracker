'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, Code2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function StringEscapeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'json' | 'javascript' | 'python' | 'java' | 'csharp' | 'regex'>('json');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const escapeString = () => {
    try {
      if (!input) {
        setOutput('');
        setError(null);
        return;
      }

      let result = input;

      switch (language) {
        case 'json':
        case 'javascript':
          result = JSON.stringify(input).slice(1, -1);
          break;
        case 'python':
          result = input
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
          break;
        case 'java':
        case 'csharp':
          result = input
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
          break;
        case 'regex':
          result = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          break;
      }

      setOutput(result);
      setError(null);
    } catch (e) {
      setError('Error escaping string: ' + (e as Error).message);
      setOutput('');
    }
  };

  const unescapeString = () => {
    try {
      if (!input) {
        setOutput('');
        setError(null);
        return;
      }

      let result = input;

      switch (language) {
        case 'json':
        case 'javascript':
          result = JSON.parse('"' + input + '"');
          break;
        case 'python':
          result = input
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
          break;
        case 'java':
        case 'csharp':
          result = input
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
          break;
        case 'regex':
          result = input.replace(/\\([.*+?^${}()|[\]\\])/g, '$1');
          break;
      }

      setOutput(result);
      setError(null);
    } catch (e) {
      setError('Error unescaping string: ' + (e as Error).message);
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const loadSample = () => {
    if (language === 'json') {
      setInput('Hello\nWorld\t"Test"\\Path\\');
    } else if (language === 'regex') {
      setInput('Hello.world*test+');
    } else {
      setInput('Line 1\nLine 2\tTabbed "quoted" text\\');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          String Escape/Unescape
        </CardTitle>
        <CardDescription>
          Escape and unescape strings for various programming languages
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Target Language</label>
          <Select value={language} onValueChange={(v) => setLanguage(v as typeof language)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON / JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="regex">Regular Expression</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="escape" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="escape">
              <ArrowRight className="h-4 w-4 mr-1" />
              Escape
            </TabsTrigger>
            <TabsTrigger value="unescape">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Unescape
            </TabsTrigger>
          </TabsList>

          <TabsContent value="escape" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plain Text</label>
                <Textarea
                  placeholder="Enter text to escape..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Escaped</label>
                  {output && (
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  readOnly
                  value={output}
                  placeholder="Escaped result..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </div>
            <Button onClick={escapeString} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Escape for {language}
            </Button>
          </TabsContent>

          <TabsContent value="unescape" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Escaped Text</label>
                <Textarea
                  placeholder={`Enter escaped text...\\nFor example: Hello\\nWorld`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Plain Text</label>
                  <div className="flex gap-2">
                    {error && <Badge variant="destructive">Error</Badge>}
                    {output && (
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  readOnly
                  value={error || output}
                  placeholder="Unescaped result..."
                  className={`min-h-[200px] font-mono text-sm ${error ? 'text-red-500' : ''}`}
                />
              </div>
            </div>
            <Button onClick={unescapeString} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Unescape from {language}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Escape Sequences Reference */}
        <div className="pt-4 border-t">
          <label className="text-sm font-medium">Common Escape Sequences</label>
          <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
            <div className="p-2 bg-muted rounded font-mono">\\n - New line</div>
            <div className="p-2 bg-muted rounded font-mono">\\t - Tab</div>
            <div className="p-2 bg-muted rounded font-mono">\\r - Carriage return</div>
            <div className="p-2 bg-muted rounded font-mono">\\" - Double quote</div>
            <div className="p-2 bg-muted rounded font-mono">\\' - Single quote</div>
            <div className="p-2 bg-muted rounded font-mono">\\\\ - Backslash</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
