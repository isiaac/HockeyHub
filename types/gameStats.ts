export interface GamePlayer {
  id: string;
  userId: string;
  name: string;
  jerseyNumber: number;
  position: 'LW' | 'C' | 'RW' | 'LD' | 'RD' | 'G';
  team: 'home' | 'away';
  isActive: boolean;
  stats: {
    goals: number;
    assists: number;
    points: number;
    penaltyMinutes: number;
    plusMinus: number;
    shots: number;
    hits: number;
    blockedShots: number;
    faceoffWins?: number;
    faceoffAttempts?: number;
    saves?: number;
    shotsAgainst?: number;
  };
}

export interface GameEvent {
  id: string;
  gameId: string;
  type: 'goal' | 'assist' | 'penalty' | 'shot' | 'hit' | 'block' | 'faceoff' | 'save';
  playerId: string;
  playerName: string;
  team: 'home' | 'away';
  period: number;
  time: string;
  description?: string;
  penaltyType?: 'minor' | 'major' | 'misconduct' | 'game_misconduct';
  penaltyMinutes?: number;
  assistedBy?: string[]; // Player IDs for assists on goals
  createdAt: string;
}

export interface LiveGame {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    score: number;
  };
  awayTeam: {
    id: string;
    name: string;
    score: number;
  };
  period: number;
  timeRemaining: string;
  status: 'not_started' | 'in_progress' | 'intermission' | 'completed';
  venue: string;
  startTime: string;
  players: GamePlayer[];
  events: GameEvent[];
  penalties: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  rinkId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatUpdate {
  playerId: string;
  statType: 'goal' | 'assist' | 'penalty' | 'shot' | 'hit' | 'block' | 'save';
  value: number; // +1 or -1
  penaltyMinutes?: number;
  assistedBy?: string[];
}