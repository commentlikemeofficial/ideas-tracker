'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Wand2, Trash2 } from 'lucide-react';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{ }</span>
          JSON Formatter
        </CardTitle>
        <CardDescription>
          Format, validate, and minify JSON data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Input JSON</label>
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output</label>
              <div className="flex gap-2">
                {error && <Badge variant="destructive">Error</Badge>}
                {output && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2">
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              readOnly
              value={error || output}
              className={`min-h-[300px] font-mono text-sm ${error ? 'text-red-500' : ''}`}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={formatJson} className="gap-2">
            <Wand2 className="h-4 w-4" />
            Format (Pretty Print)
          </Button>
          <Button onClick={minifyJson} variant="outline" className="gap-2">
            Minify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
