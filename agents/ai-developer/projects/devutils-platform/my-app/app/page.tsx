'use client';

import { useState, useEffect } from 'react';
import { JsonFormatter } from './tools/json-formatter';
import { Base64Tool } from './tools/base64-tool';
import { UrlTool } from './tools/url-tool';
import { TimestampTool } from './tools/timestamp-tool';
import { RegexTool } from './tools/regex-tool';
import { DiffTool } from './tools/diff-tool';
import { JwtTool } from './tools/jwt-tool';
import { HashTool } from './tools/hash-tool';
import { ColorTool } from './tools/color-tool';
import { UuidTool } from './tools/uuid-tool';
import { PasswordTool } from './tools/password-tool';
import { HtmlEntityTool } from './tools/html-entity-tool';
import { NumberBaseTool } from './tools/number-base-tool';
import { TextCaseTool } from './tools/text-case-tool';
import { CsvJsonTool } from './tools/csv-json-tool';
import { LineSortTool } from './tools/line-sort-tool';
import { CronTool } from './tools/cron-tool';
import { LoremTool } from './tools/lorem-tool';
import { MarkdownTool } from './tools/markdown-tool';
import { QueryStringTool } from './tools/query-string-tool';
import { StringEscapeTool } from './tools/string-escape-tool';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Code2, Github } from 'lucide-react';

type Tool = {
  id: string;
  label: string;
  icon: string;
  component: React.ReactNode;
};

const tools: Tool[] = [
  // Data Formatters
  { id: 'json', label: 'JSON', icon: '{}', component: <JsonFormatter /> },
  { id: 'csv-json', label: 'CSV/JSON', icon: '⇄', component: <CsvJsonTool /> },
  { id: 'markdown', label: 'Markdown', icon: '📝', component: <MarkdownTool /> },

  // Encoders/Decoders
  { id: 'base64', label: 'Base64', icon: '64', component: <Base64Tool /> },
  { id: 'url', label: 'URL', icon: '🔗', component: <UrlTool /> },
  { id: 'jwt', label: 'JWT', icon: '🔐', component: <JwtTool /> },
  { id: 'html-entity', label: 'HTML', icon: '🌐', component: <HtmlEntityTool /> },
  { id: 'escape', label: 'Escape', icon: '⧵', component: <StringEscapeTool /> },

  // Generators
  { id: 'uuid', label: 'UUID', icon: '🆔', component: <UuidTool /> },
  { id: 'password', label: 'Password', icon: '🔑', component: <PasswordTool /> },
  { id: 'lorem', label: 'Lorem', icon: '📄', component: <LoremTool /> },
  { id: 'hash', label: 'Hash', icon: '🔒', component: <HashTool /> },

  // Converters
  { id: 'timestamp', label: 'Time', icon: '⏱', component: <TimestampTool /> },
  { id: 'color', label: 'Color', icon: '🎨', component: <ColorTool /> },
  { id: 'base', label: 'Number', icon: '🔢', component: <NumberBaseTool /> },
  { id: 'text-case', label: 'Case', icon: '🔤', component: <TextCaseTool /> },

  // Utilities
  { id: 'regex', label: 'Regex', icon: '.*', component: <RegexTool /> },
  { id: 'diff', label: 'Diff', icon: '⚖️', component: <DiffTool /> },
  { id: 'sort', label: 'Sort', icon: '📋', component: <LineSortTool /> },
  { id: 'cron', label: 'Cron', icon: '⏰', component: <CronTool /> },
  { id: 'query', label: 'Query', icon: '❓', component: <QueryStringTool /> },
];

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DevUtils</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Essential developer tools
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Github className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7 mb-8 h-auto">
            {tools.map((tool) => (
              <TabsTrigger
                key={tool.id}
                value={tool.id}
                className="flex items-center gap-1 py-2 px-1"
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="hidden sm:inline text-xs md:text-sm truncate">{tool.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tools.map((tool) => (
            <TabsContent key={tool.id} value={tool.id} className="mt-0">
              {tool.component}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Tailwind CSS & shadcn/ui
            </p>
            <p className="text-sm text-muted-foreground">
              All processing happens client-side — your data never leaves your browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
