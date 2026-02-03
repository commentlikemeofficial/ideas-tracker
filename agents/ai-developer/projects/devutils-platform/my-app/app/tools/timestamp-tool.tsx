'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Clock, Calendar, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TimestampTool() {
  const [timestamp, setTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [now, setNow] = useState<Date | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (content: string, type: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const timestampToDate = () => {
    if (!timestamp) return '';
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return 'Invalid timestamp';
    // Handle both seconds and milliseconds
    const date = ts > 10000000000 ? new Date(ts) : new Date(ts * 1000);
    if (isNaN(date.getTime())) return 'Invalid timestamp';
    return date.toISOString();
  };

  const dateToTimestamp = () => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return Math.floor(date.getTime() / 1000).toString();
  };

  const clearAll = () => {
    setTimestamp('');
    setDateString('');
  };

  const useNow = () => {
    if (now) {
      setTimestamp(Math.floor(now.getTime() / 1000).toString());
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Timestamp Converter
        </CardTitle>
        <CardDescription>
          Convert between Unix timestamps and human-readable dates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {now && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Current Time:</span>
              <span className="font-mono">{now.toISOString()}</span>
              <Badge variant="secondary" className="font-mono">
                {Math.floor(now.getTime() / 1000)}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={useNow}>
              Use Now
            </Button>
          </div>
        )}

        <Tabs defaultValue="to-date" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="to-date">Timestamp to Date</TabsTrigger>
            <TabsTrigger value="to-timestamp">Date to Timestamp</TabsTrigger>
          </TabsList>
          
          <TabsContent value="to-date" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Unix Timestamp</label>
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              <Input
                placeholder="Enter timestamp (seconds or milliseconds)..."
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="font-mono"
              />
            </div>
            {timestamp && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Date</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(timestampToDate(), 'date')} 
                    className="h-8 px-2"
                  >
                    {copied === 'date' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                  {timestampToDate()}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="to-timestamp" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Date (ISO 8601)</label>
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              <Input
                placeholder="2024-01-01T00:00:00Z"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                className="font-mono"
              />
            </div>
            {dateString && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Unix Timestamp</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(dateToTimestamp(), 'timestamp')} 
                    className="h-8 px-2"
                  >
                    {copied === 'timestamp' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                  {dateToTimestamp()}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">1 minute</span>
            <br />60 seconds
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">1 hour</span>
            <br />3,600 seconds
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">1 day</span>
            <br />86,400 seconds
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">1 week</span>
            <br />604,800 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
