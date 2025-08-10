export interface USAHockeyRegistration {
  id: string;
  registrationNumber: string;
  playerId: string;
  season: string; // e.g., "2024-25"
  status: 'active' | 'expired' | 'suspended' | 'pending';
  expirationDate: string;
  division: string;
  birthYear: number;
  lastValidated: string;
  validationSource: 'usa_hockey_api' | 'manual' | 'import';
}

export interface PlayerProfile {
  id: string;
  usaHockeyId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  currentTeamId?: string;
  currentRinkId?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  preferredPosition: string;
  shoots: 'left' | 'right';
  height?: string;
  weight?: string;
  jerseyNumber?: number;
  medicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerStats {
  id: string;
  playerId: string;
  season: string;
  teamId: string;
  rinkId?: string;
  division: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  powerPlayGoals: number;
  shortHandedGoals: number;
  gameWinningGoals: number;
  shots: number;
  shootingPercentage: number;
  faceoffWins?: number;
  faceoffAttempts?: number;
  hits?: number;
  blockedShots?: number;
  // Goalie specific stats
  wins?: number;
  losses?: number;
  ties?: number;
  saves?: number;
  shotsAgainst?: number;
  savePercentage?: number;
  goalsAgainst?: number;
  goalsAgainstAverage?: number;
  shutouts?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerSeasonHistory {
  season: string;
  teamName: string;
  rinkName?: string;
  division: string;
  stats: PlayerStats;
}

export interface ValidationResult {
  isValid: boolean;
  status: 'active' | 'expired' | 'suspended' | 'not_found';
  expirationDate?: string;
  division?: string;
  message: string;
}