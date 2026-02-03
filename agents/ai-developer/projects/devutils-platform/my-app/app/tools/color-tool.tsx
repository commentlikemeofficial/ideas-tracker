'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Trash2, Palette, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ColorTool() {
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const rgbValue = hexToRgb(newHex);
    if (rgbValue) {
      setRgb(rgbValue);
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
    }
  };

  const updateFromRgb = (newRgb: typeof rgb) => {
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const updateFromHsl = (newHsl: typeof hsl) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = async (value: string, type: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    updateFromHex(randomHex);
  };

  const presetColors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6',
    '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
    '#F43F5E', '#78716C', '#374151', '#1F2937', '#000000',
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-6 w-6" />
          Color Converter
        </CardTitle>
        <CardDescription>
          Convert between HEX, RGB, and HSL color formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Preview */}
        <div 
          className="h-24 rounded-lg border-2 border-border shadow-sm"
          style={{ backgroundColor: hex }}
        />

        {/* Preset Colors */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Preset Colors</label>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => updateFromHex(color)}
                className="w-8 h-8 rounded-md border border-border shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={generateRandomColor} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Random Color
          </Button>
        </div>

        <Tabs defaultValue="hex" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hex">HEX</TabsTrigger>
            <TabsTrigger value="rgb">RGB</TabsTrigger>
            <TabsTrigger value="hsl">HSL</TabsTrigger>
          </TabsList>

          <TabsContent value="hex" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">HEX Color</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(hex, 'hex')}
                >
                  {copied === 'hex' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="font-mono"
                />
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rgb" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">RGB Values</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                >
                  {copied === 'rgb' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">R</label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => updateFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">G</label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => updateFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">B</label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => updateFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hsl" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">HSL Values</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                >
                  {copied === 'hsl' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copy
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">H</label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => updateFromHsl({ ...hsl, h: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">S</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => updateFromHsl({ ...hsl, s: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">L</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => updateFromHsl({ ...hsl, l: parseInt(e.target.value) || 0 })}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Output Formats */}
        <div className="space-y-2 pt-4 border-t">
          <label className="text-sm font-medium">All Formats</label>
          <div className="grid gap-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <code className="text-sm font-mono">{hex}</code>
              <span className="text-xs text-muted-foreground">HEX</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <code className="text-sm font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
              <span className="text-xs text-muted-foreground">RGB</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <code className="text-sm font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
              <span className="text-xs text-muted-foreground">HSL</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
