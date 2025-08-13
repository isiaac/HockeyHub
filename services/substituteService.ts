import { SubstitutePlayer, GameSubstitute, RingerCheck, SubstituteSearch } from '@/types/substitute';

export class SubstituteService {
  static async searchSubstitutes(rinkId: string, searchParams: SubstituteSearch): Promise<SubstitutePlayer[]> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock substitute players data
      const mockSubstitutes: SubstitutePlayer[] = [
        {
          id: 'sub-1',
          userId: 'user-sub-1',
          firstName: 'Jamie',
          lastName: 'Wilson',
          email: 'jamie.wilson@email.com',
          phone: '555-0199',
          age: 26,
          position: 'Center',
          skillLevel: 'intermediate',
          shoots: 'left',
          usaHockeyId: '98765432',
          usaHockeyStatus: 'active',
          registeredDivision: 'Adult Rec A',
          isAvailable: true,
          rinkId: rinkId,
          rating: 4.3,
          gamesPlayed: 12,
          lastActive: '2025-01-14',
          createdAt: '2024-09-01',
          updatedAt: '2025-01-14',
        },
        {
          id: 'sub-2',
          userId: 'user-sub-2',
          firstName: 'Taylor',
          lastName: 'Martinez',
          email: 'taylor.martinez@email.com',
          phone: '555-0188',
          age: 24,
          position: 'Right Wing',
          skillLevel: 'advanced',
          shoots: 'right',
          usaHockeyId: '55555555',
          usaHockeyStatus: 'active',
          registeredDivision: 'Adult Rec B',
          isAvailable: true,
          rinkId: rinkId,
          rating: 4.7,
          gamesPlayed: 8,
          lastActive: '2025-01-13',
          createdAt: '2024-10-15',
          updatedAt: '2025-01-13',
        },
        {
          id: 'sub-3',
          userId: 'user-sub-3',
          firstName: 'Casey',
          lastName: 'Thompson',
          email: 'casey.thompson@email.com',
          phone: '555-0177',
          age: 29,
          position: 'Goalie',
          skillLevel: 'expert',
          shoots: 'left',
          usaHockeyId: '33333333',
          usaHockeyStatus: 'expired',
          registeredDivision: 'Adult Rec A',
          isAvailable: false,
          rinkId: rinkId,
          rating: 4.9,
          gamesPlayed: 15,
          lastActive: '2025-01-10',
          createdAt: '2024-08-01',
          updatedAt: '2025-01-10',
        },
      ];

      // Filter based on search parameters
      return mockSubstitutes.filter(sub => {
        const matchesQuery = !searchParams.query || 
          sub.firstName.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          sub.lastName.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          sub.position.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          sub.usaHockeyId.includes(searchParams.query);
        
        const matchesAvailability = !searchParams.availableOnly || sub.isAvailable;
        const matchesVerification = !searchParams.usaHockeyVerified || sub.usaHockeyStatus === 'active';
        
        return matchesQuery && matchesAvailability && matchesVerification;
      });
    } catch (error) {
      throw new Error('Failed to search substitutes');
    }
  }

  static async performRingerCheck(substitute: SubstitutePlayer, gameDivision: string): Promise<RingerCheck> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const warnings: string[] = [];
      const recommendations: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      let requiresApproval = false;

      // Check skill level vs division
      if (substitute.skillLevel === 'expert' && gameDivision.includes('Rec')) {
        warnings.push('Player skill level (Expert) may be too high for recreational division');
        riskLevel = 'high';
        requiresApproval = true;
      } else if (substitute.skillLevel === 'advanced' && gameDivision.includes('Beginner')) {
        warnings.push('Player skill level (Advanced) may be too high for beginner division');
        riskLevel = 'medium';
        recommendations.push('Consider moving to appropriate skill division');
      }

      // Check USA Hockey status
      if (substitute.usaHockeyStatus !== 'active') {
        warnings.push('USA Hockey registration is not active');
        riskLevel = 'high';
        requiresApproval = true;
      }

      // Check division compatibility
      if (substitute.registeredDivision !== gameDivision) {
        if (substitute.registeredDivision.includes('Youth') && gameDivision.includes('Adult')) {
          warnings.push('Player is registered in youth division but playing in adult division');
          riskLevel = 'medium';
        }
        recommendations.push(`Player registered in ${substitute.registeredDivision}, playing in ${gameDivision}`);
      }

      // Age considerations
      if (substitute.age < 18 && gameDivision.includes('Adult')) {
        warnings.push('Minor player in adult division - verify parental consent');
        riskLevel = 'medium';
        requiresApproval = true;
      }

      return {
        playerId: substitute.id,
        playerName: `${substitute.firstName} ${substitute.lastName}`,
        registeredDivision: substitute.registeredDivision,
        requestedDivision: gameDivision,
        riskLevel,
        warnings,
        recommendations,
        requiresApproval,
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Failed to perform ringer check');
    }
  }

  static async addSubstituteToGame(
    gameId: string,
    substituteId: string,
    teamId: string,
    position: string,
    replacingPlayerId?: string,
    notes?: string
  ): Promise<GameSubstitute> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const gameSubstitute: GameSubstitute = {
        id: `game-sub-${Date.now()}`,
        gameId,
        substituteId,
        teamId,
        position,
        replacingPlayerId,
        status: 'approved', // In production, might be 'pending' based on rink settings
        addedBy: 'current-user-id',
        addedAt: new Date().toISOString(),
        approvedBy: 'rink-admin-id',
        approvedAt: new Date().toISOString(),
        notes,
      };

      // In production, this would:
      // 1. Add substitute to the game roster
      // 2. Send notifications to relevant parties
      // 3. Update game lineup
      // 4. Log the substitution event

      return gameSubstitute;
    } catch (error) {
      throw new Error('Failed to add substitute to game');
    }
  }

  static async getSubstituteHistory(rinkId: string, limit: number = 50): Promise<GameSubstitute[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock substitute history
      return [
        {
          id: 'game-sub-1',
          gameId: 'game-1',
          substituteId: 'sub-1',
          teamId: 'team-1',
          position: 'Center',
          status: 'approved',
          addedBy: 'coach-1',
          addedAt: '2025-01-14T18:00:00Z',
          approvedBy: 'rink-admin-1',
          approvedAt: '2025-01-14T18:05:00Z',
          notes: 'Regular player injured',
        },
      ];
    } catch (error) {
      throw new Error('Failed to fetch substitute history');
    }
  }
}