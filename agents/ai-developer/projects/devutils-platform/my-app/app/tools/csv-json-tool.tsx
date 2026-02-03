'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, ArrowRightLeft, FileJson, Table } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function CsvJsonTool() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    firstRowHeaders: true,
    prettyPrint: true,
  });

  const parseCSV = (csv: string): string[][] => {
    const lines = csv.trim().split('\n');
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const convertCsvToJson = () => {
    try {
      if (!csvInput.trim()) {
        setJsonInput('');
        setError(null);
        return;
      }

      const rows = parseCSV(csvInput);
      if (rows.length === 0) {
        setJsonInput('[]');
        return;
      }

      let result: object[];
      
      if (options.firstRowHeaders) {
        const headers = rows[0];
        result = rows.slice(1).map(row => {
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
      } else {
        result = rows.map(row => {
          const obj: Record<string, string> = {};
          row.forEach((value, index) => {
            obj[`column${index + 1}`] = value;
          });
          return obj;
        });
      }

      setJsonInput(options.prettyPrint ? JSON.stringify(result, null, 2) : JSON.stringify(result));
      setError(null);
    } catch (e) {
      setError('Error converting CSV to JSON: ' + (e as Error).message);
      setJsonInput('');
    }
  };

  const convertJsonToCsv = () => {
    try {
      if (!jsonInput.trim()) {
        setCsvInput('');
        setError(null);
        return;
      }

      const data = JSON.parse(jsonInput);
      
      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of objects');
      }

      if (data.length === 0) {
        setCsvInput('');
        return;
      }

      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Convert each object to CSV row
      const rows = data.map(obj => {
        return headers.map(header => {
          const value = String((obj as Record<string, unknown>)[header] ?? '');
          // Escape values containing commas, quotes, or newlines
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',');
      });

      setCsvInput([headers.join(','), ...rows].join('\n'));
      setError(null);
    } catch (e) {
      setError('Error converting JSON to CSV: ' + (e as Error).message);
      setCsvInput('');
    }
  };

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setCsvInput('');
    setJsonInput('');
    setError(null);
  };

  const loadSample = () => {
    const sampleCsv = `Name,Age,City,Email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com`;
    setCsvInput(sampleCsv);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-6 w-6" />
          CSV {'<>'} JSON Converter
        </CardTitle>
        <CardDescription>
          Convert between CSV and JSON formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={loadSample}>
            Load Sample CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>

        {/* Options */}
        <div className="flex gap-4 flex-wrap p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Checkbox
              id="headers"
              checked={options.firstRowHeaders}
              onCheckedChange={(checked) => setOptions({ ...options, firstRowHeaders: checked as boolean })}
            />
            <Label htmlFor="headers">First row as headers</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="pretty"
              checked={options.prettyPrint}
              onCheckedChange={(checked) => setOptions({ ...options, prettyPrint: checked as boolean })}
            />
            <Label htmlFor="pretty">Pretty print JSON</Label>
          </div>
        </div>

        <Tabs defaultValue="csv-to-json" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv-to-json">
              <Table className="h-4 w-4 mr-2" />
              CSV to JSON
            </TabsTrigger>
            <TabsTrigger value="json-to-csv">
              <FileJson className="h-4 w-4 mr-2" />
              JSON to CSV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv-to-json" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CSV Input</label>
                <Textarea
                  placeholder={`Name,Age,Email\nJohn,30,john@example.com\nJane,25,jane@example.com`}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">JSON Output</label>
                  <div className="flex gap-2">
                    {error && <Badge variant="destructive">Error</Badge>}
                    {jsonInput && (
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(jsonInput)}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  readOnly
                  value={jsonInput}
                  placeholder="JSON output will appear here..."
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
            </div>
            <Button onClick={convertCsvToJson} className="gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Convert to JSON
            </Button>
          </TabsContent>

          <TabsContent value="json-to-csv" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">JSON Input</label>
                <Textarea
                  placeholder={`[\n  {\n    "name": "John",\n    "age": 30\n  }\n]`}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">CSV Output</label>
                  <div className="flex gap-2">
                    {error && <Badge variant="destructive">Error</Badge>}
                    {csvInput && (
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(csvInput)}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  readOnly
                  value={csvInput}
                  placeholder="CSV output will appear here..."
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
            </div>
            <Button onClick={convertJsonToCsv} className="gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Convert to CSV
            </Button>
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
