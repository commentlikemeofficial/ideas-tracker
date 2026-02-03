'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function UrlTool() {
  const [text, setText] = useState('');
  const [encoded, setEncoded] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      if (!text) {
        setEncoded('');
        setError(null);
        return;
      }
      const result = encodeURIComponent(text);
      setEncoded(result);
      setError(null);
    } catch (e) {
      setError('Error encoding URL');
    }
  };

  const decode = () => {
    try {
      if (!encoded) {
        setText('');
        setError(null);
        return;
      }
      const result = decodeURIComponent(encoded);
      setText(result);
      setError(null);
    } catch (e) {
      setError('Error decoding: Invalid URL encoding');
    }
  };

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setText('');
    setEncoded('');
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">%20</span>
          URL Encoder/Decoder
        </CardTitle>
        <CardDescription>
          Encode or decode URL components and query strings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode URL</TabsTrigger>
            <TabsTrigger value="decode">Decode URL</TabsTrigger>
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
                  <label className="text-sm font-medium">URL Encoded</label>
                  {encoded && (
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(encoded)} className="h-8 px-2">
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  readOnly
                  value={encoded}
                  placeholder="Result will appear here..."
                  className="min-h-[250px] font-mono text-sm break-all"
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
                  <label className="text-sm font-medium">URL Encoded</label>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter encoded URL..."
                  value={encoded}
                  onChange={(e) => setEncoded(e.target.value)}
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
