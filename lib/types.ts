export interface Idea {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  revenueModel: string;
  scores: {
    marketSize: number;
    competition: number;
    technicalFeasibility: number;
    personalFit: number;
  };
  status: 'Researching' | 'Validating' | 'Building' | 'Launched' | 'Archived';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const calculateTotalScore = (scores: Idea['scores']): number => {
  return scores.marketSize + scores.competition + scores.technicalFeasibility + scores.personalFit;
};

export const getScoreColor = (score: number): string => {
  if (score >= 32) return 'bg-green-500';
  if (score >= 24) return 'bg-yellow-500';
  if (score >= 16) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getStatusColor = (status: Idea['status']): string => {
  const colors: Record<Idea['status'], string> = {
    'Researching': 'bg-blue-500',
    'Validating': 'bg-purple-500',
    'Building': 'bg-yellow-500',
    'Launched': 'bg-green-500',
    'Archived': 'bg-gray-500',
  };
  return colors[status];
};
