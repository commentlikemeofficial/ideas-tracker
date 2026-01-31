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
import { ArrowUpDown, Search } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Idea['status'] | 'all')}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        >
          <option value="all">All Status ({statusCounts.all || 0})</option>
          <option value="Researching">🔍 Researching ({statusCounts.Researching || 0})</option>
          <option value="Validating">✅ Validating ({statusCounts.Validating || 0})</option>
          <option value="Building">🚀 Building ({statusCounts.Building || 0})</option>
          <option value="Launched">🎉 Launched ({statusCounts.Launched || 0})</option>
          <option value="Archived">📁 Archived ({statusCounts.Archived || 0})</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-1">
                  Title
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('score')}>
                <div className="flex items-center gap-1">
                  Score
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Target Market</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1">
                  Created
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedIdeas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No ideas found. Create your first idea to get started!
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedIdeas.map((idea) => {
                const score = calculateTotalScore(idea.scores);
                const scoreColor = getScoreColor(score);
                return (
                  <TableRow
                    key={idea.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onIdeaClick(idea)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{idea.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {idea.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${scoreColor}`} />
                        <span className="font-medium">{score}</span>
                        <span className="text-xs text-muted-foreground">/40</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {idea.targetMarket}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedIdeas.length} of {ideas.length} ideas
      </div>
    </div>
  );
}
