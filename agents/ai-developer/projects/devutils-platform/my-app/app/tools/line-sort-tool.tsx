'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, RefreshCw, Trash2, AlignLeft, ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LineSortTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    removeEmpty: true,
    removeDuplicates: false,
    reverse: false,
    caseSensitive: false,
  });

  const processLines = (action: 'sort' | 'reverse' | 'shuffle' | 'unique') => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let lines = input.split('\n');

    // Remove empty lines if option is set
    if (options.removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }

    switch (action) {
      case 'sort':
        lines.sort((a, b) => {
          if (!options.caseSensitive) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          }
          return a.localeCompare(b);
        });
        if (options.reverse) {
          lines.reverse();
        }
        break;
      
      case 'reverse':
        lines.reverse();
        break;
      
      case 'shuffle':
        lines = lines.sort(() => Math.random() - 0.5);
        break;
      
      case 'unique':
        if (options.caseSensitive) {
          lines = [...new Set(lines)];
        } else {
          const seen = new Set<string>();
          lines = lines.filter(line => {
            const key = line.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
        break;
    }

    setOutput(lines.join('\n'));
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
  };

  const loadSample = () => {
    setInput(`banana
apple
Cherry
apple
banana
date
Elderberry

fig
cherry`);
  };

  const stats = {
    input: input.split('\n').filter(l => l.trim()).length,
    output: output.split('\n').filter(l => l.trim()).length,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlignLeft className="h-6 w-6" />
          Line Sorter
        </CardTitle>
        <CardDescription>
          Sort, shuffle, reverse, and remove duplicate lines
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

        {/* Options */}
        <div className="p-3 bg-muted rounded-lg space-y-3">
          <Label className="text-sm font-medium">Options</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="removeEmpty"
                checked={options.removeEmpty}
                onCheckedChange={(checked) => setOptions({ ...options, removeEmpty: checked as boolean })}
              />
              <Label htmlFor="removeEmpty">Remove empty lines</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="caseSensitive"
                checked={options.caseSensitive}
                onCheckedChange={(checked) => setOptions({ ...options, caseSensitive: checked as boolean })}
              />
              <Label htmlFor="caseSensitive">Case-sensitive sort</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="reverse"
                checked={options.reverse}
                onCheckedChange={(checked) => setOptions({ ...options, reverse: checked as boolean })}
              />
              <Label htmlFor="reverse">Reverse order</Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Input Lines ({stats.input})</label>
            </div>
            <Textarea
              placeholder="Enter lines to process..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[250px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output ({stats.output})</label>
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
              placeholder="Result will appear here..."
              className="min-h-[250px] font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => processLines('sort')} className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort A-Z
          </Button>
          <Button onClick={() => processLines('reverse')} variant="outline" className="gap-2">
            Reverse Order
          </Button>
          <Button onClick={() => processLines('shuffle')} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Shuffle
          </Button>
          <Button onClick={() => processLines('unique')} variant="outline" className="gap-2">
            Remove Duplicates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
