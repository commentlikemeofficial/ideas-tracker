'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Base64Tool() {
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper functions for Unicode-safe Base64 encoding/decoding
  const utf8ToBase64 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
    return btoa(binString);
  };

  const base64ToUtf8 = (base64: string): string => {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
  };

  const encode = () => {
    try {
      if (!text) {
        setBase64('');
        setError(null);
        return;
      }
      const encoded = utf8ToBase64(text);
      setBase64(encoded);
      setError(null);
    } catch (e) {
      setError('Error encoding: ' + (e as Error).message);
    }
  };

  const decode = () => {
    try {
      if (!base64) {
        setText('');
        setError(null);
        return;
      }
      const decoded = base64ToUtf8(base64);
      setText(decoded);
      setError(null);
    } catch (e) {
      setError('Error decoding: Invalid Base64 string');
    }
  };

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setText('');
    setBase64('');
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">64</span>
          Base64 Encoder/Decoder
        </CardTitle>
        <CardDescription>
          Encode text to Base64 or decode Base64 to text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
            <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encode" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Plain Text</label>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter text to encode..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Base64 Encoded</label>
                  {base64 && (
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(base64)} className="h-8 px-2">
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  readOnly
                  value={base64}
                  placeholder="Result will appear here..."
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
            </div>
            <Button onClick={encode} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Encode
            </Button>
          </TabsContent>

          <TabsContent value="decode" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Base64 Encoded</label>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter Base64 to decode..."
                  value={base64}
                  onChange={(e) => setBase64(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Plain Text</label>
                  <div className="flex gap-2">
                    {error && <Badge variant="destructive">Error</Badge>}
                    {text && (
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(text)} className="h-8 px-2">
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  readOnly
                  value={error || text}
                  placeholder="Result will appear here..."
                  className={`min-h-[250px] font-mono text-sm ${error ? 'text-red-500' : ''}`}
                />
              </div>
            </div>
            <Button onClick={decode} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Decode
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
