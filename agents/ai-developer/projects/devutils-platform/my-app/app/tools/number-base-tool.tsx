'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, ArrowRightLeft, Binary } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function NumberBaseTool() {
  const [inputValue, setInputValue] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('16');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const bases = [
    { value: '2', label: 'Binary (2)', prefix: '0b' },
    { value: '8', label: 'Octal (8)', prefix: '0o' },
    { value: '10', label: 'Decimal (10)', prefix: '' },
    { value: '16', label: 'Hexadecimal (16)', prefix: '0x' },
    { value: '32', label: 'Base32 (32)', prefix: '' },
    { value: '36', label: 'Base36 (36)', prefix: '' },
    { value: '64', label: 'Base64 (64)', prefix: '' },
  ];

  const convert = () => {
    try {
      if (!inputValue.trim()) {
        setResult('');
        setError(null);
        return;
      }

      // Remove prefixes if present
      let cleanInput = inputValue.trim();
      if (cleanInput.toLowerCase().startsWith('0x')) {
        cleanInput = cleanInput.slice(2);
      } else if (cleanInput.toLowerCase().startsWith('0b')) {
        cleanInput = cleanInput.slice(2);
      } else if (cleanInput.toLowerCase().startsWith('0o')) {
        cleanInput = cleanInput.slice(2);
      }

      // Parse from source base
      const decimal = parseInt(cleanInput, parseInt(fromBase));
      
      if (isNaN(decimal)) {
        throw new Error(`Invalid number for base ${fromBase}`);
      }

      // Convert to target base
      const targetBase = parseInt(toBase);
      let converted: string;
      
      if (targetBase === 64) {
        // Base64 encoding
        const bytes = new TextEncoder().encode(decimal.toString());
        const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
        converted = btoa(binString);
      } else {
        converted = decimal.toString(targetBase).toUpperCase();
      }

      setResult(converted);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setResult('');
    }
  };

  // Auto-convert when inputs change
  useEffect(() => {
    convert();
  }, [inputValue, fromBase, toBase]);

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInputValue('');
    setResult('');
    setError(null);
  };

  const swapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
  };

  const addPrefix = (value: string, base: string): string => {
    const baseInfo = bases.find(b => b.value === base);
    if (baseInfo && baseInfo.prefix && value) {
      return baseInfo.prefix + value;
    }
    return value;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Binary className="h-6 w-6" />
          Number Base Converter
        </CardTitle>
        <CardDescription>
          Convert numbers between binary, decimal, hexadecimal, and other bases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">From Base</label>
            <Select value={fromBase} onValueChange={setFromBase}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bases.map((base) => (
                  <SelectItem key={base.value} value={base.value}>
                    {base.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={swapBases} className="mb-0.5">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-medium">To Base</label>
            <Select value={toBase} onValueChange={setToBase}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bases.map((base) => (
                  <SelectItem key={base.value} value={base.value}>
                    {base.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Input Value</label>
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          <Input
            placeholder={`Enter number in base ${fromBase}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="font-mono"
          />
        </div>

        {(result || error) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Result (Base {toBase})</label>
              <div className="flex gap-2">
                {error && <Badge variant="destructive">Error</Badge>}
                {result && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2">
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
            </div>
            <div className={`p-3 bg-muted rounded-lg font-mono text-sm break-all ${error ? 'text-red-500' : ''}`}>
              {error || result}
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="pt-4 border-t">
          <label className="text-sm font-medium">Quick Reference</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-muted rounded text-sm">
              <span className="font-medium">Binary (2):</span> 0-1
            </div>
            <div className="p-2 bg-muted rounded text-sm">
              <span className="font-medium">Octal (8):</span> 0-7
            </div>
            <div className="p-2 bg-muted rounded text-sm">
              <span className="font-medium">Decimal (10):</span> 0-9
            </div>
            <div className="p-2 bg-muted rounded text-sm">
              <span className="font-medium">Hex (16):</span> 0-9, A-F
            </div>
            <div className="p-2 bg-muted rounded text-sm">
              <span className="font-medium">Base32:</span> 0-9, A-V
            </div>
            <div className="p-2 bg-muted rounded text-sm">
              <span className="font-medium">Base36:</span> 0-9, A-Z
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
