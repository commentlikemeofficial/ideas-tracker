'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, RefreshCw, Trash2, Type, AlignLeft } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LoremTool() {
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    type: 'paragraphs' as 'words' | 'sentences' | 'paragraphs',
    count: 3,
    html: false,
    startWithLorem: true,
  });

  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
    'a', 'ac', 'accumsan', 'aenean', 'ante', 'aptent', 'arcu', 'at', 'auctor',
    'bibendum', 'blandit', 'class', 'commodo', 'condimentum', 'congue', 'consequat',
    'conubia', 'convallis', 'cras', 'cubilia', 'curabitur', 'curae', 'dapibus',
    'diam', 'dictum', 'dictumst', 'dignissim', 'dis', 'donec', 'dui', 'egestas',
    'eleifend', 'elementum', 'erat', 'eros', 'facilisi', 'facilisis', 'fames',
    'faucibus', 'felis', 'fermentum', 'feugiat', 'finibus', 'fringilla', 'fusce',
    'gravida', 'habitant', 'habitasse', 'hac', 'hendrerit', 'himenaeos', 'iaculis',
    'imperdiet', 'inceptos', 'integer', 'interdum', 'justo', 'lacinia', 'lacus',
    'laoreet', 'lectus', 'leo', 'libero', 'ligula', 'lobortis', 'luctus', 'maecenas',
    'magna', 'magnis', 'malesuada', 'massa', 'mattis', 'mauris', 'maximus', 'metus',
    'mi', 'molestie', 'mollis', 'montes', 'morbi', 'mus', 'nam', 'nascetur',
    'natoque', 'nec', 'neque', 'netus', 'nibh', 'nisl', 'nunc', 'odio', 'orci',
    'ornare', 'parturient', 'pellentesque', 'penatibus', 'per', 'pharetra',
    'phasellus', 'placerat', 'platea', 'porta', 'porttitor', 'posuere', 'potenti',
    'praesent', 'pretium', 'primis', 'pulvinar', 'purus', 'quam', 'quisque', 'rhoncus',
    'ridiculus', 'risus', 'rutrum', 'sagittis', 'sapien', 'scelerisque', 'sem',
    'semper', 'senectus', 'sociosqu', 'sodales', 'sollicitudin', 'suscipit',
    'suspendisse', 'taciti', 'tellus', 'tempus', 'tincidunt', 'torquent', 'tortor',
    'tristique', 'turpis', 'ullamcorper', 'ultrices', 'ultricies', 'urna', 'varius',
    'vehicula', 'vel', 'venenatis', 'vestibulum', 'vitae', 'vivamus', 'viverra',
    'volutpat', 'vulputate'
  ];

  const generateWord = (): string => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const generateSentence = (minWords = 8, maxWords = 15): string => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const sentenceWords: string[] = [];
    
    for (let i = 0; i < wordCount; i++) {
      sentenceWords.push(generateWord());
    }
    
    // Capitalize first letter and add period
    let sentence = sentenceWords.join(' ');
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    return sentence;
  };

  const generateParagraph = (minSentences = 3, maxSentences = 7): string => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  const generate = () => {
    let result = '';
    
    switch (options.type) {
      case 'words':
        const wordList: string[] = [];
        for (let i = 0; i < options.count; i++) {
          wordList.push(generateWord());
        }
        result = wordList.join(' ');
        if (options.startWithLorem) {
          result = 'Lorem ipsum ' + result;
        }
        break;
        
      case 'sentences':
        const sentences: string[] = [];
        for (let i = 0; i < options.count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        if (options.startWithLorem && options.count > 0) {
          result = 'Lorem ipsum dolor sit amet. ' + result;
        }
        break;
        
      case 'paragraphs':
        const paragraphs: string[] = [];
        for (let i = 0; i < options.count; i++) {
          paragraphs.push(generateParagraph());
        }
        if (options.html) {
          result = paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
        } else {
          result = paragraphs.join('\n\n');
        }
        if (options.startWithLorem && options.count > 0) {
          const firstPara = paragraphs[0];
          if (!firstPara.toLowerCase().startsWith('lorem ipsum')) {
            result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + result;
          }
        }
        break;
    }
    
    setOutput(result);
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setOutput('');
  };

  const getCountLabel = () => {
    switch (options.type) {
      case 'words': return 'words';
      case 'sentences': return 'sentences';
      case 'paragraphs': return 'paragraphs';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-6 w-6" />
          Lorem Ipsum Generator
        </CardTitle>
        <CardDescription>
          Generate placeholder text for your designs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div className="space-y-2">
            <Label>Generate</Label>
            <Select 
              value={options.type} 
              onValueChange={(value) => setOptions({ ...options, type: value as typeof options.type })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="sentences">Sentences</SelectItem>
                <SelectItem value="paragraphs">Paragraphs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Count: {options.count} {getCountLabel()}</Label>
            </div>
            <Slider
              value={[options.count]}
              onValueChange={(value) => setOptions({ ...options, count: value[0] })}
              min={1}
              max={options.type === 'words' ? 100 : options.type === 'sentences' ? 20 : 10}
              step={1}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="startWithLorem"
                checked={options.startWithLorem}
                onCheckedChange={(checked) => setOptions({ ...options, startWithLorem: checked as boolean })}
              />
              <Label htmlFor="startWithLorem">Start with "Lorem ipsum..."</Label>
            </div>
            {options.type === 'paragraphs' && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="html"
                  checked={options.html}
                  onCheckedChange={(checked) => setOptions({ ...options, html: checked as boolean })}
                />
                <Label htmlFor="html">Wrap in HTML {'<p>'} tags</Label>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={generate} className="gap-2 flex-1">
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {output.split(/\s+/).filter(w => w.trim()).length} words
              </Badge>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className={`p-4 bg-muted rounded-lg ${options.html ? 'font-mono text-sm' : ''}`}>
              {options.html ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="leading-relaxed">{output}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
