'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Clock, Trash2, HelpCircle } from 'lucide-react';

export function CronTool() {
  const [expression, setExpression] = useState('0 9 * * 1');
  const [description, setDescription] = useState<string | null>(null);
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const parseCron = (expr: string) => {
    try {
      if (!expr.trim()) {
        setDescription(null);
        setNextRuns([]);
        setError(null);
        return;
      }

      const parts = expr.trim().split(/\s+/);
      
      if (parts.length !== 5 && parts.length !== 6) {
        throw new Error('Cron expression must have 5 or 6 fields');
      }

      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts.slice(0, 5);
      
      // Build human-readable description
      let desc = '';
      
      // Minute
      if (minute === '*') desc += 'Every minute';
      else if (minute === '*/5') desc += 'Every 5 minutes';
      else if (minute === '*/10') desc += 'Every 10 minutes';
      else if (minute === '*/15') desc += 'Every 15 minutes';
      else if (minute === '*/30') desc += 'Every 30 minutes';
      else desc += `At minute ${minute}`;
      
      // Hour
      if (hour === '*') desc += ' of every hour';
      else if (hour.includes('/')) desc += '';
      else {
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        desc += ` past ${displayHour} ${ampm}`;
      }
      
      // Day of month
      if (dayOfMonth !== '*') {
        if (dayOfMonth === 'L') desc += ' on the last day of the month';
        else desc += ` on day ${dayOfMonth} of the month`;
      }
      
      // Month
      const months: Record<string, string> = {
        '1': 'January', '2': 'February', '3': 'March', '4': 'April',
        '5': 'May', '6': 'June', '7': 'July', '8': 'August',
        '9': 'September', '10': 'October', '11': 'November', '12': 'December'
      };
      if (month !== '*') {
        const monthNames = month.split(',').map(m => months[m] || m).join(', ');
        desc += ` in ${monthNames}`;
      }
      
      // Day of week
      const days: Record<string, string> = {
        '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
        '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'
      };
      if (dayOfWeek !== '*') {
        const dayNames = dayOfWeek.split(',').map(d => days[d] || d).join(', ');
        desc += ` on ${dayNames}`;
      }
      
      setDescription(desc);
      
      // Calculate next 5 runs (simplified - doesn't handle all cron features)
      const runs: Date[] = [];
      let current = new Date();
      current.setSeconds(0, 0);
      
      // Simple simulation for common patterns
      for (let i = 0; i < 5 && runs.length < 5; i++) {
        const test = new Date(current.getTime() + i * 60000);
        
        // Very basic check - just for demonstration
        // A real implementation would need a proper cron parser
        if (matchesCron(test, parts)) {
          runs.push(new Date(test));
        }
        
        if (i > 10000) break; // Safety limit
      }
      
      setNextRuns(runs);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setDescription(null);
      setNextRuns([]);
    }
  };

  const matchesCron = (date: Date, parts: string[]): boolean => {
    // Simplified matching - just for demonstration
    const minute = date.getMinutes().toString();
    const hour = date.getHours().toString();
    const dayOfMonth = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const dayOfWeek = date.getDay().toString();
    
    return parts[0] === '*' || parts[0] === minute;
  };

  const copyToClipboard = async () => {
    if (description) {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setExpression('');
    setDescription(null);
    setNextRuns([]);
    setError(null);
  };

  const commonPatterns = [
    { name: 'Every minute', value: '* * * * *' },
    { name: 'Every 5 minutes', value: '*/5 * * * *' },
    { name: 'Every 15 minutes', value: '*/15 * * * *' },
    { name: 'Every hour', value: '0 * * * *' },
    { name: 'Every day at midnight', value: '0 0 * * *' },
    { name: 'Every day at 9am', value: '0 9 * * *' },
    { name: 'Every Monday at 9am', value: '0 9 * * 1' },
    { name: 'Every Friday at 5pm', value: '0 17 * * 5' },
    { name: '1st of month at midnight', value: '0 0 1 * *' },
    { name: 'Every 6 hours', value: '0 */6 * * *' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Cron Expression Parser
        </CardTitle>
        <CardDescription>
          Parse and understand cron expressions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Patterns */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Common Patterns</label>
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((pattern) => (
              <Button
                key={pattern.value}
                variant="outline"
                size="sm"
                onClick={() => {
                  setExpression(pattern.value);
                  parseCron(pattern.value);
                }}
              >
                {pattern.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Cron Expression</label>
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="* * * * *"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="font-mono"
            />
            <Button onClick={() => parseCron(expression)}>
              Parse
            </Button>
          </div>
        </div>

        {/* Field Reference */}
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          <div className="p-2 bg-muted rounded">
            <div className="font-medium">Minute</div>
            <div className="text-muted-foreground">0-59</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="font-medium">Hour</div>
            <div className="text-muted-foreground">0-23</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="font-medium">Day</div>
            <div className="text-muted-foreground">1-31</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="font-medium">Month</div>
            <div className="text-muted-foreground">1-12</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="font-medium">Weekday</div>
            <div className="text-muted-foreground">0-6</div>
          </div>
        </div>

        {description && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Description</label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copy
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg">{description}</p>
            </div>
          </div>
        )}

        {error && (
          <Badge variant="destructive" className="w-full justify-center py-2">
            {error}
          </Badge>
        )}

        {/* Special Characters Reference */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Special Characters</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-muted rounded">
              <code className="font-mono">*</code> - Any value
            </div>
            <div className="p-2 bg-muted rounded">
              <code className="font-mono">,</code> - Value list separator
            </div>
            <div className="p-2 bg-muted rounded">
              <code className="font-mono">-</code> - Range of values
            </div>
            <div className="p-2 bg-muted rounded">
              <code className="font-mono">/</code> - Step values
            </div>
            <div className="p-2 bg-muted rounded">
              <code className="font-mono">L</code> - Last (day of month)
            </div>
            <div className="p-2 bg-muted rounded">
              <code className="font-mono">#</code> - Nth weekday
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
