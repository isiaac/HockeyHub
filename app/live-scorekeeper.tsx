import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Minus, Clock, Users, Target, TriangleAlert as AlertTriangle, Save, Play, Pause, Square } from 'lucide-react-native';
import { LiveGame, GamePlayer, StatUpdate } from '@/types/gameStats';
import { GameStatsService } from '@/services/gamestatsService';

export default function LiveScorekeeperScreen() {
  const { gameId } = useLocalSearchParams();
  const [game, setGame] = useState<LiveGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<GamePlayer | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  useEffect(() => {
    return () => {
      if (gameTimer) {
        clearInterval(gameTimer);
      }
    };
  }, [gameTimer]);

  const loadGame = async () => {
    try {
      if (typeof gameId === 'string') {
        const gameData = await GameStatsService.getGameById(gameId);
        if (gameData) {
          setGame(gameData);
          setIsTimerRunning(gameData.status === 'in_progress');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerStat = async (playerId: string, statType: StatUpdate['statType'], value: number, penaltyMinutes?: number) => {
    if (!game) return;

    try {
      const update: StatUpdate = {
        playerId,
        statType,
        value,
        penaltyMinutes,
      };

      const updatedGame = await GameStatsService.updatePlayerStat(game.id, update);
      setGame(updatedGame);
      
      // Show feedback for the update
      const player = game.players.find(p => p.id === playerId);
      if (player && value > 0) {
        const statName = statType === 'goal' ? 'Goal' : 
                        statType === 'assist' ? 'Assist' : 
                        statType === 'penalty' ? 'Penalty' : 
                        statType.charAt(0).toUpperCase() + statType.slice(1);
        console.log(`${statName} added for ${player.name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update player stat');
    }
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      if (gameTimer) {
        clearInterval(gameTimer);
        setGameTimer(null);
      }
      setIsTimerRunning(false);
    } else {
      const timer = setInterval(() => {
        setGame(prev => {
          if (!prev) return prev;
          
          const [minutes, seconds] = prev.timeRemaining.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds;
          
          if (totalSeconds <= 1) {
            // Period ended
            clearInterval(timer);
            setIsTimerRunning(false);
            Alert.alert('Period Ended', 'The period has ended. Start the next period or end the game.');
            return prev;
          }
          
          const newTotalSeconds = totalSeconds - 1;
          const newMinutes = Math.floor(newTotalSeconds / 60);
          const newSeconds = newTotalSeconds % 60;
          
          return {
            ...prev,
            timeRemaining: `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`
          };
        });
      }, 1000);
      
      setGameTimer(timer);
      setIsTimerRunning(true);
    }
  };

  const nextPeriod = () => {
    if (!game) return;

    if (game.period >= 3) {
      Alert.alert(
        'End Game',
        'This will end the game and save all stats. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'End Game', style: 'destructive', onPress: endGame }
        ]
      );
    } else {
      setGame(prev => prev ? {
        ...prev,
        period: prev.period + 1,
        timeRemaining: '20:00',
        status: 'intermission'
      } : null);
      
      if (gameTimer) {
        clearInterval(gameTimer);
        setGameTimer(null);
      }
      setIsTimerRunning(false);
    }
  };

  const endGame = async () => {
    if (!game) return;

    try {
      await GameStatsService.finalizeGame(game.id);
      Alert.alert(
        'Game Completed',
        'Game stats have been saved and updated in the system.',
        [{ text: 'OK', onPress: () => router.replace('/rink-dashboard') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to finalize game');
    }
  };

  const openPlayerModal = (player: GamePlayer) => {
    setSelectedPlayer(player);
    setShowPlayerModal(true);
  };

  const closePlayerModal = () => {
    setSelectedPlayer(null);
    setShowPlayerModal(false);
    setSearchQuery('');
  };

  const filteredPlayers = game?.players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.jerseyNumber.toString().includes(searchQuery)
  ) || [];

  const renderPlayerStatButton = (label: string, statType: StatUpdate['statType'], value: number, penaltyMinutes?: number) => (
    <View style={styles.statButtonGroup}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statControls}>
        <TouchableOpacity
          style={styles.statButton}
          onPress={() => selectedPlayer && updatePlayerStat(selectedPlayer.id, statType, -1, penaltyMinutes ? -penaltyMinutes : undefined)}
        >
          <Minus size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.statValue}>{value}</Text>
        <TouchableOpacity
          style={styles.statButton}
          onPress={() => selectedPlayer && updatePlayerStat(selectedPlayer.id, statType, 1, penaltyMinutes)}
        >
          <Plus size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPlayerRow = (player: GamePlayer) => (
    <TouchableOpacity
      key={player.id}
      style={[styles.playerRow, player.team === 'home' ? styles.homePlayerRow : styles.awayPlayerRow]}
      onPress={() => openPlayerModal(player)}
    >
      <View style={styles.playerInfo}>
        <Text style={styles.playerNumber}>#{player.jerseyNumber}</Text>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerPosition}>{player.position}</Text>
        </View>
      </View>
      
      <View style={styles.playerStats}>
        <Text style={styles.quickStat}>{player.stats.goals}G</Text>
        <Text style={styles.quickStat}>{player.stats.assists}A</Text>
        <Text style={styles.quickStat}>{player.stats.points}P</Text>
        <Text style={styles.quickStat}>{player.stats.penaltyMinutes}PIM</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPlayerModal = () => {
    if (!selectedPlayer) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.playerModal}>
          <View style={styles.modalHeader}>
            <View style={styles.modalPlayerInfo}>
              <Text style={styles.modalPlayerName}>#{selectedPlayer.jerseyNumber} {selectedPlayer.name}</Text>
              <Text style={styles.modalPlayerTeam}>
                {selectedPlayer.team === 'home' ? game?.homeTeam.name : game?.awayTeam.name} • {selectedPlayer.position}
              </Text>
            </View>
            <TouchableOpacity onPress={closePlayerModal}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>Scoring</Text>
              {renderPlayerStatButton('Goals', 'goal', selectedPlayer.stats.goals)}
              {renderPlayerStatButton('Assists', 'assist', selectedPlayer.stats.assists)}
            </View>

            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>Penalties</Text>
              {renderPlayerStatButton('Minor Penalty (2 min)', 'penalty', Math.floor(selectedPlayer.stats.penaltyMinutes / 2), 2)}
              {renderPlayerStatButton('Major Penalty (5 min)', 'penalty', Math.floor(selectedPlayer.stats.penaltyMinutes / 5), 5)}
            </View>

            <View style={styles.statSection}>
              <Text style={styles.statSectionTitle}>Other Stats</Text>
              {renderPlayerStatButton('Shots', 'shot', selectedPlayer.stats.shots)}
              {renderPlayerStatButton('Hits', 'hit', selectedPlayer.stats.hits)}
              {renderPlayerStatButton('Blocked Shots', 'block', selectedPlayer.stats.blockedShots)}
              {selectedPlayer.position === 'G' && renderPlayerStatButton('Saves', 'save', selectedPlayer.stats.saves || 0)}
            </View>

            <View style={styles.currentStats}>
              <Text style={styles.currentStatsTitle}>Current Game Stats</Text>
              <View style={styles.currentStatsGrid}>
                <View style={styles.currentStatItem}>
                  <Text style={styles.currentStatValue}>{selectedPlayer.stats.points}</Text>
                  <Text style={styles.currentStatLabel}>Points</Text>
                </View>
                <View style={styles.currentStatItem}>
                  <Text style={styles.currentStatValue}>{selectedPlayer.stats.goals}</Text>
                  <Text style={styles.currentStatLabel}>Goals</Text>
                </View>
                <View style={styles.currentStatItem}>
                  <Text style={styles.currentStatValue}>{selectedPlayer.stats.assists}</Text>
                  <Text style={styles.currentStatLabel}>Assists</Text>
                </View>
                <View style={styles.currentStatItem}>
                  <Text style={styles.currentStatValue}>{selectedPlayer.stats.penaltyMinutes}</Text>
                  <Text style={styles.currentStatLabel}>PIM</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Game not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Scorekeeper</Text>
        <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert('Saved', 'Game progress saved')}>
          <Save size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameTitle}>{game.homeTeam.name} vs {game.awayTeam.name}</Text>
          <View style={[styles.gameStatus, game.status === 'in_progress' ? styles.liveStatus : styles.pausedStatus]}>
            <Text style={styles.gameStatusText}>{game.status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.periodInfo}>
          <Text style={styles.periodText}>Period {game.period}</Text>
          <View style={styles.timerContainer}>
            <Clock size={20} color="#0EA5E9" />
            <Text style={styles.timerText}>{game.timeRemaining}</Text>
            <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
              {isTimerRunning ? <Pause size={16} color="#FFFFFF" /> : <Play size={16} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{game.homeTeam.name}</Text>
          <Text style={styles.teamLabel}>HOME</Text>
          <Text style={styles.teamScore}>{game.homeTeam.score}</Text>
          <Text style={styles.teamShots}>{game.shots.home} shots</Text>
        </View>

        <View style={styles.divider}>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.penaltyInfo}>
            <Text style={styles.penaltyText}>Penalties</Text>
            <Text style={styles.penaltyCount}>{game.penalties.home} - {game.penalties.away}</Text>
          </View>
        </View>

        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{game.awayTeam.name}</Text>
          <Text style={styles.teamLabel}>AWAY</Text>
          <Text style={styles.teamScore}>{game.awayTeam.score}</Text>
          <Text style={styles.teamShots}>{game.shots.away} shots</Text>
        </View>
      </View>

      {/* Player Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search players by name or number..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Players List */}
      <ScrollView style={styles.playersContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.teamPlayersSection}>
          <Text style={styles.teamPlayersTitle}>{game.homeTeam.name} (Home)</Text>
          <View style={styles.playersList}>
            {filteredPlayers
              .filter(p => p.team === 'home')
              .sort((a, b) => a.jerseyNumber - b.jerseyNumber)
              .map(renderPlayerRow)}
          </View>
        </View>

        <View style={styles.teamPlayersSection}>
          <Text style={styles.teamPlayersTitle}>{game.awayTeam.name} (Away)</Text>
          <View style={styles.playersList}>
            {filteredPlayers
              .filter(p => p.team === 'away')
              .sort((a, b) => a.jerseyNumber - b.jerseyNumber)
              .map(renderPlayerRow)}
          </View>
        </View>
      </ScrollView>

      {/* Game Controls */}
      <View style={styles.gameControls}>
        <TouchableOpacity style={styles.nextPeriodButton} onPress={nextPeriod}>
          <Text style={styles.nextPeriodText}>
            {game.period < 3 ? `Start Period ${game.period + 1}` : 'End Game'}
          </Text>
        </TouchableOpacity>
      </View>

      {showPlayerModal && renderPlayerModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F172A',
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  gameInfo: {
    backgroundColor: '#334155',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    flex: 1,
  },
  gameStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveStatus: {
    backgroundColor: '#EF4444',
  },
  pausedStatus: {
    backgroundColor: '#F59E0B',
  },
  gameStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  periodInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  timerButton: {
    backgroundColor: '#475569',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreboard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#1E293B',
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 8,
  },
  teamScore: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  teamShots: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  divider: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    gap: 12,
  },
  vsText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  penaltyInfo: {
    alignItems: 'center',
  },
  penaltyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginBottom: 4,
  },
  penaltyCount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  searchSection: {
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    backgroundColor: '#475569',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  playersContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  teamPlayersSection: {
    marginBottom: 24,
  },
  teamPlayersTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#334155',
  },
  playersList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  homePlayerRow: {
    borderLeftColor: '#0EA5E9',
  },
  awayPlayerRow: {
    borderLeftColor: '#EF4444',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    minWidth: 40,
  },
  playerDetails: {
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  playerPosition: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  playerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStat: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    minWidth: 24,
    textAlign: 'center',
  },
  gameControls: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  nextPeriodButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextPeriodText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  playerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalPlayerInfo: {
    flex: 1,
  },
  modalPlayerName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  modalPlayerTeam: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  closeButton: {
    fontSize: 24,
    color: '#64748B',
    padding: 8,
  },
  modalContent: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statSection: {
    marginBottom: 24,
  },
  statSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  statButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
  },
  statControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statButton: {
    backgroundColor: '#0EA5E9',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    minWidth: 32,
    textAlign: 'center',
  },
  currentStats: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  currentStatsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  currentStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  currentStatItem: {
    alignItems: 'center',
  },
  currentStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  currentStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});