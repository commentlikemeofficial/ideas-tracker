'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, RefreshCw, Fingerprint, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function UuidTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<number | null>(null);
  const [format, setFormat] = useState<'standard' | 'braces' | 'no-dashes'>('standard');
  const [uppercase, setUppercase] = useState(false);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const formatUUID = (uuid: string) => {
    let formatted = uuid;
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    switch (format) {
      case 'braces':
        return `{${formatted}}`;
      case 'no-dashes':
        return formatted.replace(/-/g, '');
      default:
        return formatted;
    }
  };

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(formatUUID(generateUUID()));
    }
    setUuids(newUuids);
  };

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    if (uuids.length > 0) {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopied(-1);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // Generate one on load
  useState(() => {
    generate();
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-6 w-6" />
          UUID Generator
        </CardTitle>
        <CardDescription>
          Generate random UUIDs (Universally Unique Identifiers)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Quantity: {count}</Label>
            </div>
            <Slider
              value={[count]}
              onValueChange={(value) => setCount(value[0])}
              min={1}
              max={50}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={format === 'standard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('standard')}
              >
                Standard
              </Button>
              <Button
                variant={format === 'braces' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('braces')}
              >
                With Braces
              </Button>
              <Button
                variant={format === 'no-dashes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('no-dashes')}
              >
                No Dashes
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="uppercase"
              checked={uppercase}
              onCheckedChange={(checked) => setUppercase(checked as boolean)}
            />
            <Label htmlFor="uppercase">Uppercase</Label>
          </div>
        </div>

        <Button onClick={generate} className="gap-2 w-full">
          <RefreshCw className="h-4 w-4" />
          Generate {count > 1 ? `${count} UUIDs` : 'UUID'}
        </Button>

        {uuids.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{uuids.length} generated</Badge>
              <Button variant="ghost" size="sm" onClick={copyAll}>
                {copied === -1 ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copy All
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded font-mono text-sm"
                >
                  <span className="break-all">{uuid}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(uuid, index)}
                    className="h-8 w-8 p-0 ml-2 shrink-0"
                  >
                    {copied === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground">
          <p>UUIDs are generated using the UUID v4 algorithm (random).</p>
          <p>All generation happens client-side in your browser.</p>
        </div>
      </CardContent>
    </Card>
  );
}
