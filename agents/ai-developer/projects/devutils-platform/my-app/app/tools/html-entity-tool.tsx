'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ArrowRight, ArrowLeft, Trash2, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function HtmlEntityTool() {
  const [text, setText] = useState('');
  const [encoded, setEncoded] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    ' ': '&nbsp;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '¢': '&cent;',
    '§': '&sect;',
    '¶': '&para;',
    '•': '&bull;',
    '…': '&hellip;',
    '′': '&prime;',
    '″': '&Prime;',
    '–': '&ndash;',
    '—': '&mdash;',
    '‘': '&lsquo;',
    '’': '&rsquo;',
    '“': '&ldquo;',
    '”': '&rdquo;',
    '«': '&laquo;',
    '»': '&raquo;',
    '¡': '&iexcl;',
    '¿': '&iquest;',
    '°': '&deg;',
    '±': '&plusmn;',
    '÷': '&divide;',
    '×': '&times;',
    '¼': '&frac14;',
    '½': '&frac12;',
    '¾': '&frac34;',
    '∞': '&infin;',
    '≠': '&ne;',
    '≈': '&asymp;',
    '≤': '&le;',
    '≥': '&ge;',
    '√': '&radic;',
    '∑': '&sum;',
    '∏': '&prod;',
    '∫': '&int;',
    'α': '&alpha;',
    'β': '&beta;',
    'π': '&pi;',
    'µ': '&micro;',
    'Ω': '&Omega;',
    '←': '&larr;',
    '↑': '&uarr;',
    '→': '&rarr;',
    '↓': '&darr;',
    '↔': '&harr;',
    '⇐': '&lArr;',
    '⇑': '&uArr;',
    '⇒': '&rArr;',
    '⇓': '&dArr;',
    '⇔': '&hArr;',
    '♠': '&spades;',
    '♣': '&clubs;',
    '♥': '&hearts;',
    '♦': '&diams;',
  };

  const encodeHtml = () => {
    try {
      if (!text) {
        setEncoded('');
        setError(null);
        return;
      }
      // Use browser's built-in encoder for standard entities
      const textarea = document.createElement('textarea');
      textarea.textContent = text;
      setEncoded(textarea.innerHTML);
      setError(null);
    } catch (e) {
      setError('Error encoding HTML entities');
    }
  };

  const decodeHtml = () => {
    try {
      if (!encoded) {
        setText('');
        setError(null);
        return;
      }
      // Use browser's built-in decoder
      const textarea = document.createElement('textarea');
      textarea.innerHTML = encoded;
      setText(textarea.textContent || '');
      setError(null);
    } catch (e) {
      setError('Error decoding HTML entities');
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

  const commonEntities = [
    { char: '&', entity: '&amp;' },
    { char: '<', entity: '&lt;' },
    { char: '>', entity: '&gt;' },
    { char: '"', entity: '&quot;' },
    { char: "'", entity: '&#x27;' },
    { char: ' ', entity: '&nbsp;' },
    { char: '©', entity: '&copy;' },
    { char: '®', entity: '&reg;' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          HTML Entity Encoder/Decoder
        </CardTitle>
        <CardDescription>
          Encode special characters to HTML entities and decode them back
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Entities Reference */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Common Entities</label>
          <div className="flex flex-wrap gap-2">
            {commonEntities.map((e) => (
              <Badge key={e.char} variant="outline" className="font-mono">
                {e.char} = {e.entity}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode to Entities</TabsTrigger>
            <TabsTrigger value="decode">Decode from Entities</TabsTrigger>
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
                  placeholder="Enter text with special characters..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">HTML Entities</label>
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
                  placeholder="Encoded result will appear here..."
                  className="min-h-[200px] font-mono text-sm break-all"
                />
              </div>
            </div>
            <Button onClick={encodeHtml} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Encode
            </Button>
          </TabsContent>

          <TabsContent value="decode" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">HTML Entities</label>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter HTML entities..."
                  value={encoded}
                  onChange={(e) => setEncoded(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
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
                  placeholder="Decoded result will appear here..."
                  className={`min-h-[200px] font-mono text-sm ${error ? 'text-red-500' : ''}`}
                />
              </div>
            </div>
            <Button onClick={decodeHtml} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Decode
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
