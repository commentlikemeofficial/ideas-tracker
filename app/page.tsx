'use client';

import { useState } from 'react';
import { Lightbulb, Plus, Database } from 'lucide-react';
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Lightbulb className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaaS Ideas Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  Track, score, and validate your startup ideas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ideas.length === 0 && (
                <Button variant="outline" onClick={handleImportSample}>
                  <Database className="h-4 w-4 mr-2" />
                  Import Sample Data
                </Button>
              )}
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ideas.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No ideas yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start tracking your SaaS ideas by adding your first one. You can also import sample data to see how it works.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleImportSample}>
                <Database className="h-4 w-4 mr-2" />
                Import Sample Ideas
              </Button>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Idea
              </Button>
            </div>
          </div>
        ) : (
          <IdeasTable ideas={ideas} onIdeaClick={handleIdeaClick} />
        )}
      </main>

      {/* Footer Stats */}
      {ideas.length > 0 && (
        <footer className="border-t bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Total Ideas:</span>{' '}
                <span className="font-medium">{ideas.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Researching:</span>{' '}
                <span className="font-medium">
                  {ideas.filter((i) => i.status === 'Researching').length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Validating:</span>{' '}
                <span className="font-medium">
                  {ideas.filter((i) => i.status === 'Validating').length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Building:</span>{' '}
                <span className="font-medium">
                  {ideas.filter((i) => i.status === 'Building').length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Launched:</span>{' '}
                <span className="font-medium">
                  {ideas.filter((i) => i.status === 'Launched').length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Score:</span>{' '}
                <span className="font-medium">
                  {ideas.length > 0
                    ? (
                        ideas.reduce((acc, i) => acc + i.scores.marketSize + i.scores.competition + i.scores.technicalFeasibility + i.scores.personalFit, 0) /
                        ideas.length
                      ).toFixed(1)
                    : 0}
                  /40
                </span>
              </div>
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
