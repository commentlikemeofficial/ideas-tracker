'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, Unlock, Shield } from 'lucide-react';

export function JwtTool() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{ header: Record<string, unknown>; payload: Record<string, unknown>; signature: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const decodeJwt = () => {
    try {
      if (!token.trim()) {
        setDecoded(null);
        setError(null);
        return;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format: expected 3 parts separated by dots');
      }

      const base64UrlToBase64 = (input: string) => {
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return base64;
      };

      const decodeBase64 = (base64: string) => {
        const json = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(json);
      };

      const header = decodeBase64(base64UrlToBase64(parts[0]));
      const payload = decodeBase64(base64UrlToBase64(parts[1]));
      const signature = parts[2];

      setDecoded({ header, payload, signature });
      setError(null);
    } catch (e) {
      setError('Invalid JWT: ' + (e as Error).message);
      setDecoded(null);
    }
  };

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setToken('');
    setDecoded(null);
    setError(null);
  };

  const loadSample = () => {
    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setToken(sampleToken);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toISOString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Unlock className="h-6 w-6" />
          JWT Decoder
        </CardTitle>
        <CardDescription>
          Decode and inspect JSON Web Tokens
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
          <label className="text-sm font-medium">JWT Token</label>
          <Textarea
            placeholder="Paste your JWT token here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="min-h-[100px] font-mono text-sm break-all"
          />
        </div>

        <Button onClick={decodeJwt} className="gap-2">
          <Shield className="h-4 w-4" />
          Decode Token
        </Button>

        {error && (
          <Badge variant="destructive" className="w-full justify-center py-2">
            {error}
          </Badge>
        )}

        {decoded && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Header (Algorithm)</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2))}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="p-3 bg-muted rounded-lg text-sm overflow-auto font-mono">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Payload (Claims)</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2))}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="p-3 bg-muted rounded-lg text-sm overflow-auto font-mono">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
              
              {/* Show claim explanations */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {typeof decoded.payload.exp === 'number' && (
                  <div className="p-2 bg-muted rounded">
                    <span className="font-medium">exp (Expires):</span>
                    <br />
                    {formatDate(decoded.payload.exp)}
                  </div>
                )}
                {typeof decoded.payload.iat === 'number' && (
                  <div className="p-2 bg-muted rounded">
                    <span className="font-medium">iat (Issued At):</span>
                    <br />
                    {formatDate(decoded.payload.iat)}
                  </div>
                )}
                {typeof decoded.payload.nbf === 'number' && (
                  <div className="p-2 bg-muted rounded">
                    <span className="font-medium">nbf (Not Before):</span>
                    <br />
                    {formatDate(decoded.payload.nbf)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Signature</label>
              <div className="p-3 bg-muted rounded-lg text-sm font-mono break-all">
                {decoded.signature}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
