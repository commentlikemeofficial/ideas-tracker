'use client';

import { useState, useEffect } from 'react';
import { Idea } from './types';

const STORAGE_KEY = 'saas-ideas-tracker-data';

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIdeas(parsed);
      } catch (e) {
        console.error('Failed to parse stored ideas:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    }
  }, [ideas, isLoaded]);

  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIdea: Idea = {
      ...idea,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIdeas((prev) => [newIdea, ...prev]);
    return newIdea;
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? { ...idea, ...updates, updatedAt: new Date().toISOString() }
          : idea
      )
    );
  };

  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const importSampleData = (sampleData: Idea[]) => {
    setIdeas(sampleData);
  };

  return {
    ideas,
    isLoaded,
    addIdea,
    updateIdea,
    deleteIdea,
    importSampleData,
  };
}
