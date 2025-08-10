export interface ChatPoll {
  id: string;
  chatRoomId: string;
  createdBy: string;
  creatorName: string;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  anonymous: boolean;
  totalVotes: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[]; // User IDs who voted for this option
}

export interface PollVote {
  id: string;
  pollId: string;
  userId: string;
  optionIds: string[]; // Array to support multiple selections
  votedAt: string;
}

export interface PollAnalytics {
  pollId: string;
  totalParticipants: number;
  participationRate: number; // percentage of chat members who voted
  averageResponseTime: number; // minutes
  optionBreakdown: {
    optionId: string;
    optionText: string;
    votes: number;
    percentage: number;
  }[];
  demographicBreakdown?: {
    byRole: { [role: string]: number };
    byAge: { [ageRange: string]: number };
  };
}