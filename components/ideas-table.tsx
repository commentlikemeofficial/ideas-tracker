'use client';

import { useState, useMemo } from 'react';
import { Idea, calculateTotalScore, getScoreColor, getStatusColor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, Search, Sparkles, Target, TrendingUp } from 'lucide-react';

type SortKey = 'title' | 'score' | 'status' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface IdeasTableProps {
  ideas: Idea[];
  onIdeaClick: (idea: Idea) => void;
}

export function IdeasTable({ ideas, onIdeaClick }: IdeasTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Idea['status'] | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSortedIdeas = useMemo(() => {
    let result = [...ideas];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(query) ||
          idea.description.toLowerCase().includes(query) ||
          idea.targetMarket.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((idea) => idea.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'score':
          comparison = calculateTotalScore(a.scores) - calculateTotalScore(b.scores);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [ideas, searchQuery, statusFilter, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ideas.length };
    ideas.forEach((idea) => {
      counts[idea.status] = (counts[idea.status] || 0) + 1;
    });
    return counts;
  }, [ideas]);

  const getScoreBadge = (score: number) => {
    if (score >= 32) return { icon: Sparkles, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (score >= 24) return { icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    if (score >= 16) return { icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    return { icon: Target, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search ideas by title, description, or market..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 glass-card border-transparent focus:border-primary/50 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Idea['status'] | 'all')}
          className="h-12 rounded-xl border border-border/50 bg-card/50 backdrop-blur px-4 text-sm focus:border-primary/50 focus:outline-none transition-all cursor-pointer hover:bg-card"
        >
          <option value="all">🌟 All Ideas ({statusCounts.all || 0})</option>
          <option value="Researching">🔍 Researching ({statusCounts.Researching || 0})</option>
          <option value="Validating">✅ Validating ({statusCounts.Validating || 0})</option>
          <option value="Building">🚀 Building ({statusCounts.Building || 0})</option>
          <option value="Launched">🎉 Launched ({statusCounts.Launched || 0})</option>
          <option value="Archived">📁 Archived ({statusCounts.Archived || 0})</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-2">
                  Idea
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary transition-colors w-32" onClick={() => handleSort('score')}>
                <div className="flex items-center gap-2">
                  Score
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary transition-colors w-40" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead>Target Market</TableHead>
              <TableHead className="cursor-pointer hover:text-primary transition-colors w-32" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-2">
                  Created
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedIdeas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No ideas found matching your filters.</p>
                    <Button variant="ghost" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedIdeas.map((idea, idx) => {
                const score = calculateTotalScore(idea.scores);
                const scoreBadge = getScoreBadge(score);
                const ScoreIcon = scoreBadge.icon;
                return (
                  <TableRow
                    key={idea.id}
                    className="cursor-pointer border-border/30 hover:bg-primary/5 transition-all duration-200 group"
                    onClick={() => onIdeaClick(idea)}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <span className="text-lg">💡</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate group-hover:text-primary transition-colors">{idea.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {idea.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${scoreBadge.bg} ${scoreBadge.border}`}>
                        <ScoreIcon className={`h-3.5 w-3.5 ${scoreBadge.color}`} />
                        <span className={`font-semibold ${scoreBadge.color}`}>{score}</span>
                        <span className="text-xs text-muted-foreground">/40</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(idea.status)} status-${idea.status.toLowerCase()}`}>
                        {idea.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="text-muted-foreground">{idea.targetMarket}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(idea.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: new Date(idea.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredAndSortedIdeas.length}</span> of{' '}
          <span className="font-medium text-foreground">{ideas.length}</span> ideas
        </p>
        {filteredAndSortedIdeas.length !== ideas.length && (
          <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );
}
