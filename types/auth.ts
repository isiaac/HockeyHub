export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'player' | 'coach' | 'captain' | 'rink_admin' | 'rink_owner';
  teamId?: string;
  rinkId?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  division: string;
  createdBy: string; // User ID of team creator
  managedBy?: string; // Rink ID if managed by rink
  rinkId?: string; // Associated rink
  isIndependent: boolean; // True if standalone, false if rink-managed
  permissions: {
    canEditPlayers: string[]; // User IDs with edit permissions
    canManageGames: string[]; // User IDs with game management permissions
  };
  createdAt: string;
}

export interface Rink {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  adminIds: string[];
  teamsManaged: string[]; // Team IDs under rink management
  canCreateTeams: boolean;
  canImportTeams: boolean;
  settings: {
    requireApproval: boolean;
    autoAssignDivisions: boolean;
    centralizedStats: boolean;
  };
  createdAt: string;
}

export interface TeamImportRequest {
  id: string;
  teamId: string;
  rinkId: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  permissions: {
    retainCoachControl: boolean;
    retainPlayerEdit: boolean;
  };
  createdAt: string;
}