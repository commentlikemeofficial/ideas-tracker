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

export function IdeaForm({ idea, isOpen, onClose, onSave }: IdeaFormProps) {
  const [formData, setFormData] = useState(initialFormState);

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
  }, [idea]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{idea ? 'Edit Idea' : 'New Idea'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., AI Content Repurposing SaaS"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the idea..."
              className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Problem</label>
              <textarea
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="What pain point does this solve?"
                className="w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Solution</label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="How does your product solve it?"
                className="w-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Target Market</label>
              <Input
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                placeholder="e.g., Content creators"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Revenue Model</label>
              <Input
                value={formData.revenueModel}
                onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
                placeholder="e.g., Subscription $29/month"
                required
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Scoring (1-10 each)</h3>
              <div className="text-lg font-bold">
                Total: <span className={totalScore >= 32 ? 'text-green-500' : totalScore >= 24 ? 'text-yellow-500' : 'text-red-500'}>{totalScore}/40</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.scores).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={value}
                      onChange={(e) => handleScoreChange(key as keyof typeof formData.scores, parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-6">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Idea['status'] })}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            >
              <option value="Researching">🔍 Researching</option>
              <option value="Validating">✅ Validating</option>
              <option value="Building">🚀 Building</option>
              <option value="Launched">🎉 Launched</option>
              <option value="Archived">📁 Archived</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional thoughts, validation results, etc."
              className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{idea ? 'Update' : 'Create'} Idea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
