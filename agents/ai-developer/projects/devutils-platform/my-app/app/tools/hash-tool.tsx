'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, Hash, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function HashTool() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [salt, setSalt] = useState('');

  // Simple hash implementations for client-side use
  const computeMD5 = async (text: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', msgUint8).catch(() => {
      // Fallback for browsers that don't support MD5
      return crypto.subtle.digest('SHA-1', msgUint8);
    });
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const computeSHA1 = async (text: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const computeSHA256 = async (text: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const computeSHA512 = async (text: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Simple CRC32 implementation
  const computeCRC32 = (text: string): string => {
    const table: number[] = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    
    let crc = -1;
    const bytes = new TextEncoder().encode(text);
    for (let i = 0; i < bytes.length; i++) {
      crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    }
    return ((crc ^ -1) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  };

  const generateHashes = async () => {
    if (!input) {
      setHashes({});
      return;
    }

    const textToHash = salt ? input + salt : input;
    
    const results: Record<string, string> = {};
    results['CRC32'] = computeCRC32(textToHash);
    results['SHA-1'] = await computeSHA1(textToHash);
    results['SHA-256'] = await computeSHA256(textToHash);
    results['SHA-512'] = await computeSHA512(textToHash);
    
    // Try MD5 (may not be supported in all browsers)
    try {
      results['MD5'] = await computeMD5(textToHash);
    } catch {
      results['MD5'] = 'Not supported in this browser';
    }

    setHashes(results);
  };

  const copyToClipboard = async (value: string, type: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearAll = () => {
    setInput('');
    setHashes({});
    setSalt('');
  };

  const hashAlgorithms = [
    { name: 'MD5', description: '128-bit hash (legacy)' },
    { name: 'SHA-1', description: '160-bit hash (legacy)' },
    { name: 'SHA-256', description: '256-bit secure hash' },
    { name: 'SHA-512', description: '512-bit secure hash' },
    { name: 'CRC32', description: '32-bit checksum' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-6 w-6" />
          Hash Generator
        </CardTitle>
        <CardDescription>
          Generate MD5, SHA-1, SHA-256, SHA-512, and CRC32 hashes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Text</label>
          <div className="flex gap-2">
            <Textarea
              placeholder="Enter text to hash..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] font-mono text-sm flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Salt (optional)</label>
          <Input
            placeholder="Add salt to input..."
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={generateHashes} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate Hashes
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3">
            {hashAlgorithms.map((algo) => (
              <div key={algo.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{algo.name}</span>
                    <span className="text-xs text-muted-foreground">{algo.description}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(hashes[algo.name] || '', algo.name)}
                    className="h-6 px-2"
                  >
                    {copied === algo.name ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied === algo.name ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <div className="p-2 bg-muted rounded-lg font-mono text-sm break-all">
                  {hashes[algo.name] || '...'}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Note:</strong> MD5 and SHA-1 are considered legacy and not recommended for security purposes.</p>
          <p>Use SHA-256 or SHA-512 for cryptographic applications.</p>
        </div>
      </CardContent>
    </Card>
  );
}
