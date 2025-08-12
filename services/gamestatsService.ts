import { LiveGame, GamePlayer, GameEvent, StatUpdate } from '@/types/gameStats';

export class GameStatsService {
  private static games: Map<string, LiveGame> = new Map();

  static async getLiveGames(rinkId: string): Promise<LiveGame[]> {
    try {
      // In production, fetch from database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock live games for the rink
      const mockLiveGame: LiveGame = {
        id: 'game-live-1',
        homeTeam: { id: 'team-1', name: 'Ice Wolves', score: 2 },
        awayTeam: { id: 'team-2', name: 'Thunder Hawks', score: 1 },
        period: 2,
        timeRemaining: '12:45',
        status: 'in_progress',
        venue: 'Central Ice Arena - Rink 1',
        startTime: '19:00',
        players: this.getMockPlayers(),
        events: [],
        penalties: { home: 1, away: 0 },
        shots: { home: 18, away: 14 },
        rinkId: rinkId,
        createdAt: '2025-01-15T19:00:00Z',
        updatedAt: new Date().toISOString(),
      };

      this.games.set(mockLiveGame.id, mockLiveGame);
      return [mockLiveGame];
    } catch (error) {
      throw new Error('Failed to fetch live games');
    }
  }

  static async getGameById(gameId: string): Promise<LiveGame | null> {
    try {
      // Check local cache first
      if (this.games.has(gameId)) {
        return this.games.get(gameId)!;
      }

      // In production, fetch from database
      await new Promise(resolve => setTimeout(resolve, 300));
      return null;
    } catch (error) {
      return null;
    }
  }

  static async updatePlayerStat(gameId: string, update: StatUpdate): Promise<LiveGame> {
    try {
      const game = this.games.get(gameId);
      if (!game) {
        throw new Error('Game not found');
      }

      // Update player stats
      const updatedPlayers = game.players.map(player => {
        if (player.id === update.playerId) {
          const newStats = { ...player.stats };
          
          switch (update.statType) {
            case 'goal':
              newStats.goals = Math.max(0, newStats.goals + update.value);
              newStats.points = newStats.goals + newStats.assists;
              // Update team score
              if (update.value > 0) {
                if (player.team === 'home') {
                  game.homeTeam.score++;
                } else {
                  game.awayTeam.score++;
                }
              } else if (update.value < 0) {
                if (player.team === 'home') {
                  game.homeTeam.score = Math.max(0, game.homeTeam.score - 1);
                } else {
                  game.awayTeam.score = Math.max(0, game.awayTeam.score - 1);
                }
              }
              break;
            case 'assist':
              newStats.assists = Math.max(0, newStats.assists + update.value);
              newStats.points = newStats.goals + newStats.assists;
              break;
            case 'penalty':
              newStats.penaltyMinutes = Math.max(0, newStats.penaltyMinutes + (update.penaltyMinutes || 2));
              break;
            case 'shot':
              newStats.shots = Math.max(0, newStats.shots + update.value);
              break;
            case 'hit':
              newStats.hits = Math.max(0, newStats.hits + update.value);
              break;
            case 'block':
              newStats.blockedShots = Math.max(0, newStats.blockedShots + update.value);
              break;
            case 'save':
              if (player.position === 'G') {
                newStats.saves = Math.max(0, (newStats.saves || 0) + update.value);
              }
              break;
          }

          return { ...player, stats: newStats };
        }
        return player;
      });

      // Create game event
      const event: GameEvent = {
        id: `event-${Date.now()}`,
        gameId: gameId,
        type: update.statType,
        playerId: update.playerId,
        playerName: game.players.find(p => p.id === update.playerId)?.name || '',
        team: game.players.find(p => p.id === update.playerId)?.team || 'home',
        period: game.period,
        time: game.timeRemaining,
        penaltyMinutes: update.penaltyMinutes,
        assistedBy: update.assistedBy,
        createdAt: new Date().toISOString(),
      };

      const updatedGame: LiveGame = {
        ...game,
        players: updatedPlayers,
        events: [...game.events, event],
        updatedAt: new Date().toISOString(),
      };

      this.games.set(gameId, updatedGame);
      return updatedGame;
    } catch (error) {
      throw error;
    }
  }

  static async finalizeGame(gameId: string): Promise<void> {
    try {
      const game = this.games.get(gameId);
      if (!game) {
        throw new Error('Game not found');
      }

      // Mark game as completed
      const finalGame: LiveGame = {
        ...game,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };

      this.games.set(gameId, finalGame);

      // In production, this would:
      // 1. Save final stats to database
      // 2. Update player season totals
      // 3. Update team records
      // 4. Generate game report
      // 5. Send notifications to teams

      await this.saveGameToDatabase(finalGame);
    } catch (error) {
      throw error;
    }
  }

  private static async saveGameToDatabase(game: LiveGame): Promise<void> {
    // In production, save to Supabase or your database
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Game saved to database:', game.id);
  }

  private static getMockPlayers(): GamePlayer[] {
    return [
      // Home Team (Ice Wolves)
      {
        id: 'player-1',
        userId: 'user-1',
        name: 'Alex Chen',
        jerseyNumber: 12,
        position: 'C',
        team: 'home',
        isActive: true,
        stats: { goals: 1, assists: 1, points: 2, penaltyMinutes: 0, plusMinus: 1, shots: 4, hits: 2, blockedShots: 0 }
      },
      {
        id: 'player-2',
        userId: 'user-2',
        name: 'Morgan Davis',
        jerseyNumber: 9,
        position: 'RW',
        team: 'home',
        isActive: true,
        stats: { goals: 1, assists: 0, points: 1, penaltyMinutes: 2, plusMinus: 0, shots: 3, hits: 1, blockedShots: 0 }
      },
      {
        id: 'player-3',
        userId: 'user-3',
        name: 'Jordan Smith',
        jerseyNumber: 4,
        position: 'LD',
        team: 'home',
        isActive: true,
        stats: { goals: 0, assists: 2, points: 2, penaltyMinutes: 0, plusMinus: 2, shots: 1, hits: 5, blockedShots: 3 }
      },
      {
        id: 'player-4',
        userId: 'user-4',
        name: 'Casey Brown',
        jerseyNumber: 1,
        position: 'G',
        team: 'home',
        isActive: true,
        stats: { goals: 0, assists: 0, points: 0, penaltyMinutes: 0, plusMinus: 0, shots: 0, hits: 0, blockedShots: 0, saves: 13, shotsAgainst: 14 }
      },
      // Away Team (Thunder Hawks)
      {
        id: 'player-5',
        userId: 'user-5',
        name: 'Mike Johnson',
        jerseyNumber: 11,
        position: 'C',
        team: 'away',
        isActive: true,
        stats: { goals: 1, assists: 0, points: 1, penaltyMinutes: 0, plusMinus: -1, shots: 5, hits: 3, blockedShots: 1 }
      },
      {
        id: 'player-6',
        userId: 'user-6',
        name: 'Sarah Lee',
        jerseyNumber: 7,
        position: 'LW',
        team: 'away',
        isActive: true,
        stats: { goals: 0, assists: 1, points: 1, penaltyMinutes: 0, plusMinus: 0, shots: 2, hits: 1, blockedShots: 0 }
      },
      {
        id: 'player-7',
        userId: 'user-7',
        name: 'Tom Anderson',
        jerseyNumber: 3,
        position: 'RD',
        team: 'away',
        isActive: true,
        stats: { goals: 0, assists: 0, points: 0, penaltyMinutes: 0, plusMinus: -1, shots: 1, hits: 4, blockedShots: 2 }
      },
      {
        id: 'player-8',
        userId: 'user-8',
        name: 'Lisa Park',
        jerseyNumber: 30,
        position: 'G',
        team: 'away',
        isActive: true,
        stats: { goals: 0, assists: 0, points: 0, penaltyMinutes: 0, plusMinus: 0, shots: 0, hits: 0, blockedShots: 0, saves: 16, shotsAgainst: 18 }
      },
    ];
  }
}