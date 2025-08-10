export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'nhl' | 'rules' | 'history' | 'players' | 'teams' | 'general';
  releaseDate: string;
  expiresAt: string;
  badge?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  createdAt: string;
}

export interface TriviaAnswer {
  id: string;
  userId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  answeredAt: string;
  timeToAnswer: number; // seconds
}

export interface TriviaStats {
  userId: string;
  totalAnswered: number;
  correctAnswers: number;
  accuracy: number;
  streak: number;
  longestStreak: number;
  badgesEarned: number;
  averageTime: number;
  categoryStats: {
    [category: string]: {
      answered: number;
      correct: number;
      accuracy: number;
    };
  };
}

export interface DailyTriviaChallenge {
  id: string;
  date: string;
  questionId: string;
  participantCount: number;
  completionRate: number;
  averageScore: number;
  leaderboard: {
    userId: string;
    userName: string;
    score: number;
    timeToAnswer: number;
  }[];
}