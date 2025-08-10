export interface FreeAgentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate: string;
  age: number;
  location: {
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  hockeyInfo: {
    position: string;
    secondaryPosition?: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
    shoots: 'left' | 'right';
    experience: string; // e.g., "5 years", "10+ years"
    availability: {
      weekdays: boolean;
      weekends: boolean;
      mornings: boolean;
      evenings: boolean;
    };
    travelDistance: number; // miles willing to travel
  };
  usaHockeyId?: string;
  usaHockeyStatus?: 'active' | 'expired' | 'suspended' | 'not_verified';
  bio?: string;
  lookingFor: ('team' | 'pickup_games' | 'coaching' | 'training')[];
  isActive: boolean;
  rating?: number;
  reviews?: FreeAgentReview[];
  applications: TeamApplication[];
  createdAt: string;
  updatedAt: string;
}

export interface FreeAgentReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'coach' | 'captain' | 'teammate' | 'rink_admin';
  rating: number;
  comment: string;
  teamId?: string;
  teamName?: string;
  createdAt: string;
}

export interface TeamApplication {
  id: string;
  freeAgentId: string;
  teamId: string;
  teamName: string;
  rinkId?: string;
  rinkName?: string;
  appliedBy: string; // User ID who sent the application
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  message?: string;
  position?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface FreeAgentSearch {
  position?: string;
  skillLevel?: string;
  maxDistance?: number;
  location?: string;
  availability?: {
    weekdays?: boolean;
    weekends?: boolean;
    mornings?: boolean;
    evenings?: boolean;
  };
  minAge?: number;
  maxAge?: number;
  usaHockeyVerified?: boolean;
}