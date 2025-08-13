export interface SubstitutePlayer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  age: number;
  position: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  shoots: 'left' | 'right';
  usaHockeyId: string;
  usaHockeyStatus: 'active' | 'expired' | 'suspended' | 'not_verified';
  registeredDivision: string;
  isAvailable: boolean;
  rinkId: string;
  rating?: number;
  gamesPlayed: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameSubstitute {
  id: string;
  gameId: string;
  substituteId: string;
  teamId: string;
  position: string;
  replacingPlayerId?: string;
  status: 'pending' | 'approved' | 'rejected';
  addedBy: string;
  addedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface RingerCheck {
  playerId: string;
  playerName: string;
  registeredDivision: string;
  requestedDivision: string;
  riskLevel: 'low' | 'medium' | 'high';
  warnings: string[];
  recommendations: string[];
  requiresApproval: boolean;
  checkedAt: string;
}

export interface SubstituteSearch {
  query?: string;
  position?: string;
  skillLevel?: string;
  availableOnly?: boolean;
  usaHockeyVerified?: boolean;
  maxDistance?: number;
  rinkId?: string;
}

export interface SubstituteRequest {
  id: string;
  gameId: string;
  teamId: string;
  requestedBy: string;
  position: string;
  urgency: 'low' | 'medium' | 'high';
  gameDate: string;
  gameTime: string;
  notes?: string;
  status: 'open' | 'filled' | 'cancelled';
  responses: SubstituteResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SubstituteResponse {
  id: string;
  requestId: string;
  substituteId: string;
  substituteName: string;
  status: 'interested' | 'confirmed' | 'declined';
  message?: string;
  respondedAt: string;
}