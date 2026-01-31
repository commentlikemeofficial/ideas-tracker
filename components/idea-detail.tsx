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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{idea.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Created {new Date(idea.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Idea Score</h3>
              <div className={`text-2xl font-bold ${scoreColor.replace('bg-', 'text-')}`}>
                {totalScore}/40
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={`${scoreColor} h-2 rounded-full transition-all`}
                style={{ width: `${(totalScore / 40) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Size</span>
                <span className="font-medium">{idea.scores.marketSize}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Competition</span>
                <span className="font-medium">{idea.scores.competition}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Technical Feasibility</span>
                <span className="font-medium">{idea.scores.technicalFeasibility}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personal Fit</span>
                <span className="font-medium">{idea.scores.personalFit}/10</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{idea.description}</p>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Problem</h3>
              <p className="text-sm">{idea.problem}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Solution</h3>
              <p className="text-sm">{idea.solution}</p>
            </div>
          </div>

          {/* Market & Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Target Market</h3>
              <p className="text-sm text-muted-foreground">{idea.targetMarket}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Revenue Model</h3>
              <p className="text-sm text-muted-foreground">{idea.revenueModel}</p>
            </div>
          </div>

          {/* Notes */}
          {idea.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Notes</h3>
              <p className="text-sm whitespace-pre-wrap">{idea.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={onEdit} className="flex-1">
              Edit Idea
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
