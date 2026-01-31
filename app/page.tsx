'use client';

import { useState } from 'react';
import { Lightbulb, Plus, Database, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIdeas } from '@/lib/use-ideas';
import { sampleIdeas } from '@/lib/sample-data';
import { Idea } from '@/lib/types';
import { IdeasTable } from '@/components/ideas-table';
import { IdeaForm } from '@/components/idea-form';
import { IdeaDetail } from '@/components/idea-detail';

export default function Home() {
  const { ideas, isLoaded, addIdea, updateIdea, deleteIdea, importSampleData } = useIdeas();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsDetailOpen(true);
  };

  const handleEdit = () => {
    if (selectedIdea) {
      setEditingIdea(selectedIdea);
      setIsDetailOpen(false);
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedIdea) {
      deleteIdea(selectedIdea.id);
      setIsDetailOpen(false);
      setSelectedIdea(null);
    }
  };

  const handleFormSubmit = (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingIdea) {
      updateIdea(editingIdea.id, ideaData);
      setEditingIdea(null);
    } else {
      addIdea(ideaData);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingIdea(null);
  };

  const handleImportSample = () => {
    importSampleData(sampleIdeas);
  };

  // Calculate stats
  const stats = {
    total: ideas.length,
    researching: ideas.filter((i) => i.status === 'Researching').length,
    validating: ideas.filter((i) => i.status === 'Validating').length,
    building: ideas.filter((i) => i.status === 'Building').length,
    launched: ideas.filter((i) => i.status === 'Launched').length,
    avgScore: ideas.length > 0
      ? (ideas.reduce((acc, i) => acc + i.scores.marketSize + i.scores.competition + i.scores.technicalFeasibility + i.scores.personalFit, 0) / ideas.length).toFixed(1)
      : '0',
    highPotential: ideas.filter((i) => {
      const score = i.scores.marketSize + i.scores.competition + i.scores.technicalFeasibility + i.scores.personalFit;
      return score >= 32;
    }).length,
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading your ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-xl bg-background/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
                <div className="relative bg-gradient-to-br from-primary to-purple-600 p-3 rounded-2xl animate-float">
                  <Lightbulb className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Ideas Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  Turn shower thoughts into unicorns 🦄
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {ideas.length === 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleImportSample}
                  className="hidden sm:flex glass-card hover-lift"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Load Samples
                </Button>
              )}
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="btn-glow bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover-lift"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      {ideas.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Ideas', value: stats.total, icon: Lightbulb, color: 'text-primary', delay: 'stagger-1' },
              { label: 'Researching', value: stats.researching, icon: Target, color: 'text-blue-400', delay: 'stagger-2' },
              { label: 'Validating', value: stats.validating, icon: Sparkles, color: 'text-green-400', delay: 'stagger-3' },
              { label: 'Building', value: stats.building, icon: Zap, color: 'text-amber-400', delay: 'stagger-4' },
              { label: 'Launched', value: stats.launched, icon: TrendingUp, color: 'text-pink-400', delay: 'stagger-5' },
              { label: 'Avg Score', value: `${stats.avgScore}/40`, icon: Target, color: 'text-cyan-400', delay: 'stagger-1' },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className={`glass-card rounded-xl p-4 hover-lift animate-slide-up ${stat.delay}`}
                style={{ opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {ideas.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-br from-muted/50 to-muted rounded-3xl p-8">
                <Lightbulb className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">No ideas yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your next million-dollar idea is one shower away. Start tracking it now!
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={handleImportSample}
                className="glass-card hover-lift"
              >
                <Database className="h-4 w-4 mr-2" />
                Try with Samples
              </Button>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="btn-glow bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover-lift"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Idea
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <IdeasTable ideas={ideas} onIdeaClick={handleIdeaClick} />
          </div>
        )}
      </main>

      {/* Footer Stats */}
      {ideas.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 backdrop-blur-xl bg-background/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-6">
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{ideas.length}</span> ideas tracked
                </span>
                {stats.highPotential > 0 && (
                  <span className="text-green-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {stats.highPotential} high potential
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                💡 Pro tip: Score 32+ means it's time to validate!
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <IdeaForm
        idea={editingIdea}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSubmit}
      />

      <IdeaDetail
        idea={selectedIdea}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
