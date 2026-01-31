'use client';

import { Idea, calculateTotalScore, getScoreColor, getStatusColor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit2, Trash2, Target, Users, Wrench, Heart, Calendar, Lightbulb } from 'lucide-react';

interface IdeaDetailProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function IdeaDetail({ idea, isOpen, onClose, onEdit, onDelete }: IdeaDetailProps) {
  if (!idea) return null;

  const totalScore = calculateTotalScore(idea.scores);
  const scoreColor = getScoreColor(totalScore);
  const scorePercentage = (totalScore / 40) * 100;

  const scoreMetrics = [
    { key: 'marketSize', label: 'Market Size', icon: Target, value: idea.scores.marketSize, color: 'from-blue-500 to-cyan-500' },
    { key: 'competition', label: 'Competition', icon: Users, value: idea.scores.competition, color: 'from-green-500 to-emerald-500' },
    { key: 'technicalFeasibility', label: 'Technical Feasibility', icon: Wrench, value: idea.scores.technicalFeasibility, color: 'from-amber-500 to-orange-500' },
    { key: 'personalFit', label: 'Personal Fit', icon: Heart, value: idea.scores.personalFit, color: 'from-pink-500 to-rose-500' },
  ];

  const getScoreLabel = (score: number) => {
    if (score >= 32) return { text: 'Go Build This! 🚀', color: 'text-green-400' };
    if (score >= 24) return { text: 'Promising 💎', color: 'text-amber-400' };
    if (score >= 16) return { text: 'Needs Work 🔧', color: 'text-orange-400' };
    return { text: 'Probably Skip ❌', color: 'text-red-400' };
  };

  const scoreLabel = getScoreLabel(totalScore);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card border-border/50">
        <DialogHeader className="pb-4 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center shrink-0">
                <Lightbulb className="h-7 w-7 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold leading-tight">{idea.title}</DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={`${getStatusColor(idea.status)} status-${idea.status.toLowerCase()}`}>
                    {idea.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Created {new Date(idea.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Card */}
          <div className="glass-card rounded-2xl p-6 gradient-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Idea Score</h3>
                <p className={`text-sm mt-1 ${scoreLabel.color}`}>{scoreLabel.text}</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${scoreColor.replace('bg-', 'text-')}`}>
                  {totalScore}
                  <span className="text-lg text-muted-foreground font-normal">/40</span>
                </div>
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-6">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${scoreColor}`}
                style={{ width: `${scorePercentage}%` }}
              />
              <div className="absolute inset-0 animate-shimmer" />
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              {scoreMetrics.map((metric) => {
                const Icon = metric.icon;
                const percentage = (metric.value / 10) * 100;
                return (
                  <div key={metric.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{metric.label}</span>
                      </div>
                      <span className="font-semibold">{metric.value}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold mb-3 text-primary">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{idea.description}</p>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500/50">
              <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-sm">!</span>
                Problem
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{idea.problem}</p>
            </div>
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-green-500/50">
              <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-sm">✓</span>
                Solution
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{idea.solution}</p>
            </div>
          </div>

          {/* Market & Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Target Market
              </h3>
              <p className="text-muted-foreground">{idea.targetMarket}</p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-primary">💰</span>
                Revenue Model
              </h3>
              <p className="text-muted-foreground">{idea.revenueModel}</p>
            </div>
          </div>

          {/* Notes */}
          {idea.notes && (
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-amber-500/50">
              <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <span className="text-lg">📝</span>
                Notes
              </h3>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{idea.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button 
              onClick={onEdit} 
              className="flex-1 btn-glow bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Idea
            </Button>
            <Button 
              variant="outline" 
              onClick={onDelete}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
