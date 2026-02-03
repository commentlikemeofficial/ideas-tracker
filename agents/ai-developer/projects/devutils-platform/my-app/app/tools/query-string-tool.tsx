'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, Link2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function QueryStringTool() {
  const [url, setUrl] = useState('');
  const [params, setParams] = useState<Record<string, string>>({});
  const [paramInput, setParamInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const parseQueryString = () => {
    try {
      if (!url.trim()) {
        setParams({});
        setError(null);
        return;
      }

      let queryString = url;
      
      // Extract query string from URL if full URL provided
      const urlMatch = url.match(/\?(.+)$/);
      if (urlMatch) {
        queryString = urlMatch[1];
      }

      const parsed = new URLSearchParams(queryString);
      const result: Record<string, string> = {};
      
      parsed.forEach((value, key) => {
        result[key] = value;
      });

      setParams(result);
      setError(null);
    } catch (e) {
      setError('Invalid query string format');
      setParams({});
    }
  };

  const buildQueryString = () => {
    try {
      const lines = paramInput.trim().split('\n');
      const params = new URLSearchParams();
      
      lines.forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          params.append(key.trim(), valueParts.join('=').trim());
        }
      });

      setUrl(params.toString());
      setError(null);
    } catch (e) {
      setError('Error building query string');
    }
  };

  const copyToClipboard = async (content: string, type: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearAll = () => {
    setUrl('');
    setParams({});
    setParamInput('');
    setError(null);
  };

  const loadSample = () => {
    setUrl('https://example.com/search?q=hello+world&category=tools&page=1&sort=desc');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-6 w-6" />
          Query String Parser
        </CardTitle>
        <CardDescription>
          Parse and build URL query strings
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

        <Tabs defaultValue="parse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parse">
              <ArrowRight className="h-4 w-4 mr-1" />
              Parse URL
            </TabsTrigger>
            <TabsTrigger value="build">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Build URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parse" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL or Query String</label>
              <Textarea
                placeholder="https://example.com?key=value&foo=bar"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="min-h-[100px] font-mono text-sm"
              />
            </div>

            <Button onClick={parseQueryString} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Parse
            </Button>

            {Object.keys(params).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Parameters ({Object.keys(params).length})</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(JSON.stringify(params, null, 2), 'json')}
                  >
                    {copied === 'json' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy JSON
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Key</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Value</th>
                        <th className="px-4 py-2 text-right text-sm font-medium w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(params).map(([key, value]) => (
                        <tr key={key} className="border-t">
                          <td className="px-4 py-2 font-mono text-sm">{key}</td>
                          <td className="px-4 py-2 font-mono text-sm break-all">{value}</td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => copyToClipboard(value, key)}
                            >
                              {copied === key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="build" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Parameters (key=value per line)</label>
              <Textarea
                placeholder={`search=hello world\ncategory=tools\npage=1`}
                value={paramInput}
                onChange={(e) => setParamInput(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            <Button onClick={buildQueryString} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Build Query String
            </Button>

            {url && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Result</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(url, 'url')}
                  >
                    {copied === 'url' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {url}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {error && (
          <Badge variant="destructive" className="w-full justify-center py-2">
            {error}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
