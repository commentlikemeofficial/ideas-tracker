'use client';

import { useState, useEffect } from 'react';
import { Idea, calculateTotalScore } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Target, Users, Wrench, Heart, Sparkles } from 'lucide-react';

interface IdeaFormProps {
  idea?: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

type FormState = Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>;

const initialFormState: FormState = {
  title: '',
  description: '',
  problem: '',
  solution: '',
  targetMarket: '',
  revenueModel: '',
  scores: {
    marketSize: 5,
    competition: 5,
    technicalFeasibility: 5,
    personalFit: 5,
  },
  status: 'Researching',
  notes: '',
};

const scoreMetrics = [
  { key: 'marketSize', label: 'Market Size', icon: Target, description: 'How big is the addressable market?', color: 'from-blue-500 to-cyan-500' },
  { key: 'competition', label: 'Competition', icon: Users, description: 'How crowded is the space? (Higher = less competition)', color: 'from-green-500 to-emerald-500' },
  { key: 'technicalFeasibility', label: 'Technical Feasibility', icon: Wrench, description: 'Can you build this with current tech?', color: 'from-amber-500 to-orange-500' },
  { key: 'personalFit', label: 'Personal Fit', icon: Heart, description: 'Are YOU the right person to build this?', color: 'from-pink-500 to-rose-500' },
];

export function IdeaForm({ idea, isOpen, onClose, onSave }: IdeaFormProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [activeStep, setActiveStep] = useState(0);

  // Reset form when idea changes
  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title,
        description: idea.description,
        problem: idea.problem,
        solution: idea.solution,
        targetMarket: idea.targetMarket,
        revenueModel: idea.revenueModel,
        scores: idea.scores,
        status: idea.status,
        notes: idea.notes,
      });
    } else {
      setFormData(initialFormState);
    }
    setActiveStep(0);
  }, [idea, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(initialFormState);
    onClose();
  };

  const handleScoreChange = (key: keyof typeof formData.scores, value: number) => {
    setFormData((prev) => ({
      ...prev,
      scores: { ...prev.scores, [key]: value },
    }));
  };

  const totalScore = calculateTotalScore(formData.scores);
  const scorePercentage = (totalScore / 40) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 32) return 'text-green-400';
    if (score >= 24) return 'text-amber-400';
    if (score >= 16) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 32) return 'bg-green-500';
    if (score >= 24) return 'bg-amber-500';
    if (score >= 16) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-border/50">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="text-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            {idea ? 'Edit Idea' : 'New Idea'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Idea Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AI Content Repurposing SaaS"
                required
                className="h-12 glass-card border-border/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the idea..."
                className="w-full min-h-[100px] rounded-xl border border-border/50 bg-card/50 backdrop-blur px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <span className="text-red-400">!</span> Problem *
                </label>
                <textarea
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="What pain point does this solve?"
                  className="w-full min-h-[80px] rounded-xl border border-border/50 bg-card/50 backdrop-blur px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-all resize-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <span className="text-green-400">✓</span> Solution *
                </label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How does your product solve it?"
                  className="w-full min-h-[80px] rounded-xl border border-border/50 bg-card/50 backdrop-blur px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-all resize-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Market *</label>
                <Input
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  placeholder="e.g., Content creators"
                  required
                  className="h-12 glass-card border-border/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Revenue Model *</label>
                <Input
                  value={formData.revenueModel}
                  onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
                  placeholder="e.g., Subscription $29/month"
                  required
                  className="h-12 glass-card border-border/50"
                />
              </div>
            </div>
          </div>

          {/* Scoring Section */}
          <div className="glass-card rounded-2xl p-6 gradient-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Idea Scoring</h3>
                <p className="text-sm text-muted-foreground">Rate each dimension (1-10)</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore}
                  <span className="text-lg text-muted-foreground font-normal">/40</span>
                </div>
              </div>
            </div>

            {/* Total Progress */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-6">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getScoreBg(totalScore)}`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>

            {/* Individual Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {scoreMetrics.map((metric) => {
                const Icon = metric.icon;
                const value = formData.scores[metric.key as keyof typeof formData.scores];
                return (
                  <div key={metric.key} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={value}
                        onChange={(e) => handleScoreChange(metric.key as keyof typeof formData.scores, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${value * 10}%, rgba(255,255,255,0.1) ${value * 10}%, rgba(255,255,255,0.1) 100%)`
                        }}
                      />
                      <span className="text-lg font-bold w-10 text-center">{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Idea['status'] })}
                className="w-full h-12 rounded-xl border border-border/50 bg-card/50 backdrop-blur px-4 text-sm focus:border-primary/50 focus:outline-none transition-all cursor-pointer"
              >
                <option value="Researching">🔍 Researching</option>
                <option value="Validating">✅ Validating</option>
                <option value="Building">🚀 Building</option>
                <option value="Launched">🎉 Launched</option>
                <option value="Archived">📁 Archived</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional thoughts..."
                className="w-full min-h-[48px] rounded-xl border border-border/50 bg-card/50 backdrop-blur px-4 py-3 text-sm focus:border-primary/50 focus:outline-none transition-all resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/50">
            <Button type="button" variant="outline" onClick={onClose} className="glass-card">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-glow bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            >
              {idea ? '💾 Update Idea' : '✨ Create Idea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
