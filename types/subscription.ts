export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'team' | 'rink';
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    teams?: number;
    players?: number;
    games?: number;
    storage?: string;
  };
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  createdAt: string;
}

export interface FeatureAccess {
  canAccessStats: boolean;
  canManageLineups: boolean;
  canUseScorekeeper: boolean;
  canAccessChat: boolean;
  canManageStore: boolean;
  canAccessBadges: boolean;
  canImportTeams: boolean;
  canCreateMultipleTeams: boolean;
  canAccessAnalytics: boolean;
  canCustomizeBranding: boolean;
  canAccessAPI: boolean;
  maxTeams: number;
  maxPlayersPerTeam: number;
  maxGamesPerMonth: number;
  storageLimit: string;
}

// Subscription plans
export const TEAM_PLANS: SubscriptionPlan[] = [
  {
    id: 'team-free',
    name: 'Free',
    type: 'team',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Basic game scheduling',
      'Player check-in/out',
      'Up to 20 players',
      '5 games per month',
      'Basic stats tracking'
    ],
    limits: {
      teams: 1,
      players: 20,
      games: 5,
      storage: '100MB'
    }
  },
  {
    id: 'team-pro',
    name: 'Team Pro',
    type: 'team',
    price: { monthly: 19.99, yearly: 199.99 },
    features: [
      'Everything in Free',
      'Advanced lineup management',
      'Scorekeeper functionality',
      'Team chat & messaging',
      'Unlimited games',
      'Advanced statistics',
      'Badge system',
      'Up to 30 players'
    ],
    limits: {
      teams: 1,
      players: 30,
      games: -1, // unlimited
      storage: '1GB'
    },
    popular: true
  },
  {
    id: 'team-elite',
    name: 'Team Elite',
    type: 'team',
    price: { monthly: 39.99, yearly: 399.99 },
    features: [
      'Everything in Team Pro',
      'Team store functionality',
      'Custom branding',
      'Advanced analytics',
      'API access',
      'Priority support',
      'Up to 50 players'
    ],
    limits: {
      teams: 1,
      players: 50,
      games: -1,
      storage: '5GB'
    }
  }
];

export const RINK_PLANS: SubscriptionPlan[] = [
  {
    id: 'rink-starter',
    name: 'Rink Starter',
    type: 'rink',
    price: { monthly: 99.99, yearly: 999.99 },
    features: [
      'Manage up to 10 teams',
      'Centralized scheduling',
      'Player registration system',
      'Basic facility management',
      'Team import functionality',
      'Unified stats dashboard'
    ],
    limits: {
      teams: 10,
      players: 300,
      games: -1,
      storage: '10GB'
    }
  },
  {
    id: 'rink-professional',
    name: 'Rink Professional',
    type: 'rink',
    price: { monthly: 199.99, yearly: 1999.99 },
    features: [
      'Everything in Rink Starter',
      'Manage up to 25 teams',
      'Advanced analytics & reporting',
      'Custom branding for facility',
      'Automated tournament management',
      'Revenue tracking',
      'API access',
      'Priority support'
    ],
    limits: {
      teams: 25,
      players: 750,
      games: -1,
      storage: '50GB'
    },
    popular: true
  },
  {
    id: 'rink-enterprise',
    name: 'Rink Enterprise',
    type: 'rink',
    price: { monthly: 399.99, yearly: 3999.99 },
    features: [
      'Everything in Rink Professional',
      'Unlimited teams',
      'Multi-facility management',
      'White-label solution',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced security features',
      'Custom reporting'
    ],
    limits: {
      teams: -1, // unlimited
      players: -1, // unlimited
      games: -1,
      storage: 'Unlimited'
    }
  }
];

export function getFeatureAccess(planId: string): FeatureAccess {
  const plan = [...TEAM_PLANS, ...RINK_PLANS].find(p => p.id === planId);
  
  if (!plan) {
    // Default free access
    return {
      canAccessStats: true,
      canManageLineups: true,
      canUseScorekeeper: false,
      canAccessChat: false,
      canManageStore: false,
      canAccessBadges: false,
      canImportTeams: false,
      canCreateMultipleTeams: false,
      canAccessAnalytics: false,
      canCustomizeBranding: false,
      canAccessAPI: false,
      maxTeams: 1,
      maxPlayersPerTeam: 20,
      maxGamesPerMonth: 5,
      storageLimit: '100MB'
    };
  }

  // Team plans
  if (plan.type === 'team') {
    switch (plan.id) {
      case 'team-free':
        return {
          canAccessStats: true,
          canManageLineups: true,
          canUseScorekeeper: false,
          canAccessChat: false,
          canManageStore: false,
          canAccessBadges: false,
          canImportTeams: false,
          canCreateMultipleTeams: false,
          canAccessAnalytics: false,
          canCustomizeBranding: false,
          canAccessAPI: false,
          maxTeams: 1,
          maxPlayersPerTeam: 20,
          maxGamesPerMonth: 5,
          storageLimit: '100MB'
        };
      case 'team-pro':
        return {
          canAccessStats: true,
          canManageLineups: true,
          canUseScorekeeper: true,
          canAccessChat: true,
          canManageStore: false,
          canAccessBadges: true,
          canImportTeams: false,
          canCreateMultipleTeams: false,
          canAccessAnalytics: true,
          canCustomizeBranding: false,
          canAccessAPI: false,
          maxTeams: 1,
          maxPlayersPerTeam: 30,
          maxGamesPerMonth: -1,
          storageLimit: '1GB'
        };
      case 'team-elite':
        return {
          canAccessStats: true,
          canManageLineups: true,
          canUseScorekeeper: true,
          canAccessChat: true,
          canManageStore: true,
          canAccessBadges: true,
          canImportTeams: false,
          canCreateMultipleTeams: false,
          canAccessAnalytics: true,
          canCustomizeBranding: true,
          canAccessAPI: true,
          maxTeams: 1,
          maxPlayersPerTeam: 50,
          maxGamesPerMonth: -1,
          storageLimit: '5GB'
        };
    }
  }

  // Rink plans
  if (plan.type === 'rink') {
    switch (plan.id) {
      case 'rink-starter':
        return {
          canAccessStats: true,
          canManageLineups: true,
          canUseScorekeeper: true,
          canAccessChat: true,
          canManageStore: true,
          canAccessBadges: true,
          canImportTeams: true,
          canCreateMultipleTeams: true,
          canAccessAnalytics: true,
          canCustomizeBranding: false,
          canAccessAPI: false,
          maxTeams: 10,
          maxPlayersPerTeam: 30,
          maxGamesPerMonth: -1,
          storageLimit: '10GB'
        };
      case 'rink-professional':
        return {
          canAccessStats: true,
          canManageLineups: true,
          canUseScorekeeper: true,
          canAccessChat: true,
          canManageStore: true,
          canAccessBadges: true,
          canImportTeams: true,
          canCreateMultipleTeams: true,
          canAccessAnalytics: true,
          canCustomizeBranding: true,
          canAccessAPI: true,
          maxTeams: 25,
          maxPlayersPerTeam: 30,
          maxGamesPerMonth: -1,
          storageLimit: '50GB'
        };
      case 'rink-enterprise':
        return {
          canAccessStats: true,
          canManageLineups: true,
          canUseScorekeeper: true,
          canAccessChat: true,
          canManageStore: true,
          canAccessBadges: true,
          canImportTeams: true,
          canCreateMultipleTeams: true,
          canAccessAnalytics: true,
          canCustomizeBranding: true,
          canAccessAPI: true,
          maxTeams: -1,
          maxPlayersPerTeam: -1,
          maxGamesPerMonth: -1,
          storageLimit: 'Unlimited'
        };
    }
  }

  // Fallback
  return {
    canAccessStats: false,
    canManageLineups: false,
    canUseScorekeeper: false,
    canAccessChat: false,
    canManageStore: false,
    canAccessBadges: false,
    canImportTeams: false,
    canCreateMultipleTeams: false,
    canAccessAnalytics: false,
    canCustomizeBranding: false,
    canAccessAPI: false,
    maxTeams: 0,
    maxPlayersPerTeam: 0,
    maxGamesPerMonth: 0,
    storageLimit: '0MB'
  };
}