'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, RefreshCw, KeyRound, Shield, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function PasswordTool() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  const generatePassword = () => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    const similar = '0O1lI';
    const ambiguous = '{}[]()/\\\'"`~,;:.<>|\\';

    let charset = '';
    if (options.uppercase) charset += chars.uppercase;
    if (options.lowercase) charset += chars.lowercase;
    if (options.numbers) charset += chars.numbers;
    if (options.symbols) charset += chars.symbols;

    if (options.excludeSimilar) {
      charset = charset.split('').filter(c => !similar.includes(c)).join('');
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(c => !ambiguous.includes(c)).join('');
    }

    if (charset === '') {
      charset = chars.lowercase;
    }

    const newPasswords: string[] = [];
    for (let p = 0; p < count; p++) {
      let password = '';
      // Ensure at least one of each selected type
      if (options.uppercase) password += chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
      if (options.lowercase) password += chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
      if (options.numbers) password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
      if (options.symbols) password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];

      // Fill the rest
      for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
      }

      // Shuffle
      password = password.split('').sort(() => Math.random() - 0.5).join('');
      newPasswords.push(password);
    }

    setPasswords(newPasswords);
  };

  const copyToClipboard = async (password: string, index: number) => {
    await navigator.clipboard.writeText(password);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const calculateStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengthMap: Record<number, { label: string; color: string }> = {
      0: { label: 'Very Weak', color: 'bg-red-600' },
      1: { label: 'Weak', color: 'bg-red-500' },
      2: { label: 'Fair', color: 'bg-yellow-500' },
      3: { label: 'Good', color: 'bg-blue-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-green-600' },
      6: { label: 'Excellent', color: 'bg-emerald-600' },
    };

    return { score, ...strengthMap[Math.min(score, 6)] };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-6 w-6" />
          Password Generator
        </CardTitle>
        <CardDescription>
          Generate secure random passwords
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Length: {length}</Label>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={4}
              max={64}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Quantity: {count}</Label>
            </div>
            <Slider
              value={[count]}
              onValueChange={(value) => setCount(value[0])}
              min={1}
              max={20}
              step={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked) => setOptions({ ...options, uppercase: checked as boolean })}
              />
              <Label htmlFor="uppercase">A-Z</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked) => setOptions({ ...options, lowercase: checked as boolean })}
              />
              <Label htmlFor="lowercase">a-z</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked) => setOptions({ ...options, numbers: checked as boolean })}
              />
              <Label htmlFor="numbers">0-9</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="symbols"
                checked={options.symbols}
                onCheckedChange={(checked) => setOptions({ ...options, symbols: checked as boolean })}
              />
              <Label htmlFor="symbols">!@#$</Label>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Checkbox
                id="excludeSimilar"
                checked={options.excludeSimilar}
                onCheckedChange={(checked) => setOptions({ ...options, excludeSimilar: checked as boolean })}
              />
              <Label htmlFor="excludeSimilar">Exclude similar (0, O, 1, l, I)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="excludeAmbiguous"
                checked={options.excludeAmbiguous}
                onCheckedChange={(checked) => setOptions({ ...options, excludeAmbiguous: checked as boolean })}
              />
              <Label htmlFor="excludeAmbiguous">Exclude ambiguous ({`{}[]()/'"`})</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={generatePassword} className="gap-2 flex-1">
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((password, index) => {
              const strength = calculateStrength(password);
              return (
                <div key={index} className="space-y-1">
                  <div
                    className="flex items-center justify-between p-3 bg-muted rounded font-mono text-sm"
                  >
                    <span className={`break-all ${showPassword ? '' : 'blur-sm select-none'}`}>
                      {showPassword ? password : '•'.repeat(password.length)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(password, index)}
                      className="h-8 w-8 p-0 ml-2 shrink-0"
                    >
                      {copied === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all`}
                        style={{ width: `${(strength.score / 6) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs ${strength.score >= 4 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <p>All passwords are generated locally in your browser.</p>
        </div>
      </CardContent>
    </Card>
  );
}
