import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, MapPin, Clock, Calendar, Users, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { User, Team, Rink } from '@/types/auth';
import { getFeatureAccess, UserSubscription } from '@/types/subscription';
import { SubscriptionGate } from '@/components/SubscriptionGate';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface Player {
  id: string;
  name: string;
  position: 'LW' | 'C' | 'RW' | 'LD' | 'RD' | 'G';
  line: 1 | 2 | 3 | 4;
  checkedIn: boolean;
  userId: string; // For authentication
  jerseyNumber?: number;
  preferredPosition?: string;
  phone?: string;
  email?: string;
}

interface Game extends Team {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  homeScore?: number;
  awayScore?: number;
  lineup?: Player[];
  createdBy: string; // Team creator
  managedBy?: string; // Rink ID if managed by rink
  rinkId?: string;
  isIndependent: boolean;
  permissions: {
    canEditPlayers: string[];
    canManageGames: string[];
  };
}

// Mock current user and rink data
const currentUser: User = {
  id: 'user-1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  role: 'player', // Change to 'rink_admin' or 'coach' to test permissions
  teamId: 'team-1',
  rinkId: 'rink-1',
  createdAt: '2025-01-01',
};

// Mock subscription data
const currentSubscription: UserSubscription = {
  id: 'sub-1',
  userId: 'user-1',
  planId: 'team-free', // Change to test different plans: 'team-pro', 'team-elite', 'rink-starter', etc.
  status: 'active',
  currentPeriodStart: '2025-01-01',
  currentPeriodEnd: '2025-02-01',
  cancelAtPeriodEnd: false,
  createdAt: '2025-01-01',
};

const mockRink: Rink = {
  id: 'rink-1',
  name: 'Central Ice Complex',
  address: '123 Hockey Lane',
  ownerId: 'rink-owner-1',
  adminIds: ['rink-admin-1', 'rink-admin-2'],
  teamsManaged: ['team-1'],
  canCreateTeams: true,
  canImportTeams: true,
  settings: {
    requireApproval: true,
    autoAssignDivisions: true,
    centralizedStats: true,
  },
  createdAt: '2024-01-01',
};

const mockLineup: Player[] = [
  // Line 1
  { id: '1', name: 'Alex Chen', position: 'LW', line: 1, checkedIn: true, userId: 'user-1', jerseyNumber: 12, preferredPosition: 'C', phone: '555-0101', email: 'alex@example.com' },
  { id: '2', name: 'Morgan Davis', position: 'C', line: 1, checkedIn: true, userId: 'user-2', jerseyNumber: 9, phone: '555-0102', email: 'morgan@example.com' },
  { id: '3', name: 'Jordan Smith', position: 'RW', line: 1, checkedIn: false, userId: 'user-3', jerseyNumber: 15, phone: '555-0103', email: 'jordan@example.com' },
  
  // Line 2
  { id: '4', name: 'Casey Brown', position: 'LW', line: 2, checkedIn: true, userId: 'user-4', jerseyNumber: 7, phone: '555-0104', email: 'casey@example.com' },
  { id: '5', name: 'Sam Wilson', position: 'C', line: 2, checkedIn: false, userId: 'user-5', jerseyNumber: 11, phone: '555-0105', email: 'sam@example.com' },
  { id: '6', name: 'Taylor Johnson', position: 'RW', line: 2, checkedIn: true, userId: 'user-6', jerseyNumber: 23, phone: '555-0106', email: 'taylor@example.com' },
  
  // Line 3
  { id: '7', name: 'Riley Parker', position: 'LW', line: 3, checkedIn: false, userId: 'user-7', jerseyNumber: 18, phone: '555-0107', email: 'riley@example.com' },
  { id: '8', name: 'Avery Martinez', position: 'C', line: 3, checkedIn: true, userId: 'user-8', jerseyNumber: 14, phone: '555-0108', email: 'avery@example.com' },
  { id: '9', name: 'Blake Thompson', position: 'RW', line: 3, checkedIn: false, userId: 'user-9', jerseyNumber: 21, phone: '555-0109', email: 'blake@example.com' },
  
  // Line 4
  { id: '10', name: 'Cameron Lee', position: 'LW', line: 4, checkedIn: true, userId: 'user-10', jerseyNumber: 6, phone: '555-0110', email: 'cameron@example.com' },
  { id: '11', name: 'Drew Anderson', position: 'C', line: 4, checkedIn: false, userId: 'user-11', jerseyNumber: 19, phone: '555-0111', email: 'drew@example.com' },
  { id: '12', name: 'Emery Clark', position: 'RW', line: 4, checkedIn: true, userId: 'user-12', jerseyNumber: 8, phone: '555-0112', email: 'emery@example.com' },
  
  // Defense
  { id: '13', name: 'Finley Rodriguez', position: 'LD', line: 1, checkedIn: true, userId: 'user-13', jerseyNumber: 3, phone: '555-0113', email: 'finley@example.com' },
  { id: '14', name: 'Harper White', position: 'RD', line: 1, checkedIn: false, userId: 'user-14', jerseyNumber: 4, phone: '555-0114', email: 'harper@example.com' },
  { id: '15', name: 'Sage Miller', position: 'LD', line: 2, checkedIn: true, userId: 'user-15', jerseyNumber: 5, phone: '555-0115', email: 'sage@example.com' },
  { id: '16', name: 'River Garcia', position: 'RD', line: 2, checkedIn: false, userId: 'user-16', jerseyNumber: 2, phone: '555-0116', email: 'river@example.com' },
  
  // Goalies
  { id: '17', name: 'Phoenix Taylor', position: 'G', line: 1, checkedIn: true, userId: 'user-17', jerseyNumber: 1, phone: '555-0117', email: 'phoenix@example.com' },
  { id: '18', name: 'Skyler Wilson', position: 'G', line: 2, checkedIn: false, userId: 'user-18', jerseyNumber: 30, phone: '555-0118', email: 'skyler@example.com' },
];

const mockGames: Game[] = [
  {
    id: '1',
    homeTeam: 'Ice Wolves',
    awayTeam: 'Thunder Hawks',
    date: '2025-01-15',
    time: '7:00 PM',
    venue: 'Central Ice Arena',
    status: 'live',
    homeScore: 2,
    awayScore: 1,
    lineup: mockLineup,
    createdBy: 'user-1', // Team creator
    managedBy: 'rink-1', // Managed by Central Ice Complex
    rinkId: 'rink-1',
    isIndependent: false,
    permissions: {
      canEditPlayers: ['user-1', 'rink-admin-1'], // Creator + rink admin
      canManageGames: ['user-1', 'rink-admin-1'],
    },
    name: 'Ice Wolves',
    division: 'Division A',
  },
  {
    id: '2',
    homeTeam: 'Lightning Bolts',
    awayTeam: 'Frost Giants',
    date: '2025-01-16',
    time: '8:30 PM',
    venue: 'North Rink',
    status: 'upcoming',
    lineup: mockLineup,
    createdBy: 'user-2',
    managedBy: undefined, // Independent team
    rinkId: undefined,
    isIndependent: true,
    permissions: {
      canEditPlayers: ['user-2'], // Only creator
      canManageGames: ['user-2'],
    },
    name: 'Lightning Bolts',
    division: 'Division B',
  },
  {
    id: '3',
    homeTeam: 'Storm Riders',
    awayTeam: 'Ice Wolves',
    date: '2025-01-12',
    time: '6:00 PM',
    venue: 'East Arena',
    status: 'completed',
    homeScore: 1,
    awayScore: 4,
    lineup: mockLineup,
    createdBy: 'user-3',
    managedBy: 'rink-1',
    rinkId: 'rink-1',
    isIndependent: false,
    permissions: {
      canEditPlayers: ['user-3', 'rink-admin-1'],
      canManageGames: ['user-3', 'rink-admin-1'],
    },
    name: 'Storm Riders',
    division: 'Division A',
  },
];

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [expandedGame, setExpandedGame] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    jerseyNumber: '',
    preferredPosition: '',
    phone: '',
    email: '',
  });
  
  const featureAccess = getFeatureAccess(currentSubscription.planId);

  const canCheckInPlayer = (player: Player, game: Game) => {
    // Player can check themselves in/out, team creator, or rink admin can check anyone
    return (
      player.userId === currentUser.id || 
      game.permissions.canManageGames.includes(currentUser.id) ||
      currentUser.role === 'rink_admin' ||
      currentUser.role === 'rink_owner'
    );
  };

  const canEditPlayer = (player: Player, game: Game) => {
    // Only team creator, rink admin, or rink owner can edit player details
    return (
      game.permissions.canEditPlayers.includes(currentUser.id) ||
      currentUser.role === 'rink_admin' ||
      currentUser.role === 'rink_owner'
    );
  };

  const canManageTeam = (game: Game) => {
    // Check if user can manage the team
    return (
      game.permissions.canManageGames.includes(currentUser.id) ||
      currentUser.role === 'rink_admin' ||
      currentUser.role === 'rink_owner'
    );
  };

  const togglePlayerCheckIn = (gameId: string, playerId: string) => {
    const game = games.find(g => g.id === gameId);
    const player = game?.lineup?.find(p => p.id === playerId);
    
    if (!game || !player || !canCheckInPlayer(player, game)) {
      return; // Not authorized to check in this player
    }

    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? {
              ...game,
              lineup: game.lineup?.map(player =>
                player.id === playerId
                  ? { ...player, checkedIn: !player.checkedIn }
                  : player
              )
            }
          : game
      )
    );
  };

  const startEditingPlayer = (player: Player) => {
    setEditingPlayer(player.id);
    setEditForm({
      jerseyNumber: player.jerseyNumber?.toString() || '',
      preferredPosition: player.preferredPosition || '',
      phone: player.phone || '',
      email: player.email || '',
    });
  };

  const savePlayerEdit = (gameId: string, playerId: string) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? {
              ...game,
              lineup: game.lineup?.map(player =>
                player.id === playerId
                  ? { 
                      ...player, 
                      jerseyNumber: editForm.jerseyNumber ? parseInt(editForm.jerseyNumber) : undefined,
                      preferredPosition: editForm.preferredPosition || undefined,
                      phone: editForm.phone || undefined,
                      email: editForm.email || undefined,
                    }
                  : player
              )
            }
          : game
      )
    );
    setEditingPlayer(null);
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
    setEditForm({ jerseyNumber: '', preferredPosition: '', phone: '', email: '' });
  };
  const getCheckedInCount = (lineup?: Player[]) => {
    return lineup?.filter(player => player.checkedIn).length || 0;
  };

  const groupPlayersByPosition = (lineup: Player[]) => {
    const forwards = lineup.filter(p => ['LW', 'C', 'RW'].includes(p.position));
    const defense = lineup.filter(p => ['LD', 'RD'].includes(p.position));
    const goalies = lineup.filter(p => p.position === 'G');

    const forwardLines = [1, 2, 3, 4].map(lineNum => 
      forwards.filter(p => p.line === lineNum)
    );

    const defenseLines = [1, 2].map(lineNum => 
      defense.filter(p => p.line === lineNum)
    );

    return { forwardLines, defenseLines, goalies };
  };

  const renderPlayer = (player: Player, gameId: string) => {
    const canCheck = canCheckInPlayer(player, games.find(g => g.id === gameId)!);
    const canEdit = canEditPlayer(player, games.find(g => g.id === gameId)!);
    const isCurrentUser = player.userId === currentUser.id;
    
    return (
      <TouchableOpacity 
        key={player.id} 
        style={[
          styles.playerRow, 
          player.checkedIn && styles.checkedInRow,
          !canCheck && styles.disabledRow
        ]}
        onPress={() => canCheck && togglePlayerCheckIn(gameId, player.id)}
        disabled={!canCheck}
      >
        <View style={styles.playerInfo}>
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{player.position}</Text>
          </View>
          <View style={styles.playerDetails}>
            <TouchableOpacity 
              onPress={() => router.push(`/player-profile?playerId=${player.userId}`)}
              style={styles.playerNameContainer}
            >
              <View style={styles.playerNameRow}>
                {player.jerseyNumber && (
                  <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
                )}
                <Text style={[
                  styles.playerName, 
                  player.checkedIn && styles.checkedInPlayerName,
                  isCurrentUser && styles.currentUserName
                ]}>
                  {player.name} {isCurrentUser && '(You)'}
                </Text>
              </View>
              {player.preferredPosition && player.preferredPosition !== player.position && (
                <Text style={styles.preferredPosition}>Prefers {player.preferredPosition}</Text>
              )}
            </TouchableOpacity>
            {canEdit && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => startEditingPlayer(player)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.checkInControls}>
          <View style={[
            styles.checkInIndicator, 
            player.checkedIn ? styles.checkedInIndicator : styles.checkedOutIndicator
          ]}>
            {player.checkedIn ? (
              <CheckCircle size={16} color="#FFFFFF" />
            ) : (
              <XCircle size={16} color="#94A3B8" />
            )}
          </View>
          <View style={[
            styles.statusBadgeSmall, 
            player.checkedIn ? styles.checkedInBadge : styles.checkedOutBadge
          ]}>
            <Text style={[
              styles.statusBadgeText, 
              player.checkedIn ? styles.checkedInBadgeText : styles.checkedOutBadgeText
            ]}>
              {player.checkedIn ? 'IN' : 'OUT'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLineup = (game: Game) => {
    if (!game.lineup) return null;
    
    // Check if user has access to lineup management
    if (!featureAccess.canManageLineups) {
      return (
        <SubscriptionGate
          feature="Advanced Lineup Management"
          requiredPlan="Team Pro"
          onUpgrade={() => router.push('/subscription')}
        >
          <View style={styles.lineupPreview}>
            <Text style={styles.previewText}>Lineup management available with Team Pro</Text>
          </View>
        </SubscriptionGate>
      );
    }
    
    const { forwardLines, defenseLines, goalies } = groupPlayersByPosition(game.lineup);
    
    return (
      <View style={styles.lineupSection}>
        <TouchableOpacity
          style={styles.lineupHeader}
          onPress={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
        >
          <View style={styles.lineupInfo}>
            <Users size={20} color="#0EA5E9" />
            <Text style={styles.lineupTitle}>Player Lineup</Text>
            <Text style={styles.checkedInCount}>
              {getCheckedInCount(game.lineup)}/{game.lineup.length} checked in
            </Text>
          </View>
          <Text style={styles.expandIcon}>
            {expandedGame === game.id ? '−' : '+'}
          </Text>
        </TouchableOpacity>

        {expandedGame === game.id && (
          <View style={styles.lineupList}>
            {/* Forward Lines */}
            {forwardLines.map((line, index) => (
              line.length > 0 && (
                <View key={`forward-line-${index + 1}`} style={styles.lineSection}>
                  <Text style={styles.lineTitle}>Line {index + 1}</Text>
                  <View style={styles.lineGroup}>
                    {line.map(player => renderPlayer(player, game.id))}
                  </View>
                </View>
              )
            ))}
            
            {/* Defense Lines */}
            {defenseLines.map((line, index) => (
              line.length > 0 && (
                <View key={`defense-line-${index + 1}`} style={styles.lineSection}>
                  <Text style={styles.lineTitle}>Defense Pair {index + 1}</Text>
                  <View style={styles.lineGroup}>
                    {line.map(player => renderPlayer(player, game.id))}
                  </View>
                </View>
              )
            ))}
            
            {/* Goalies */}
            {goalies.length > 0 && (
              <View style={styles.lineSection}>
                <Text style={styles.lineTitle}>Goalies</Text>
                <View style={styles.lineGroup}>
                  {goalies.map(player => renderPlayer(player, game.id))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderGame = (game: Game) => (
    <View
      key={game.id}
      style={[styles.gameCard, game.status === 'live' && styles.liveGame]}
    >
      <TouchableOpacity 
        style={styles.gameHeader}
        onPress={() => router.push(`/game-details?id=${game.id}`)}
      >
        <View style={[styles.statusBadge, styles[`${game.status}Badge`]]}>
          <Text style={[styles.statusText, styles[`${game.status}Text`]]}>
            {game.status.toUpperCase()}
          </Text>
        </View>
        <View style={styles.gameInfo}>
          <View style={styles.infoRow}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.infoText}>{game.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.infoText}>{game.time}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.teamsContainer}
        onPress={() => router.push(`/game-details?id=${game.id}`)}
      >
        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{game.homeTeam}</Text>
          {game.homeScore !== undefined && (
            <Text style={styles.score}>{game.homeScore}</Text>
          )}
        </View>
        
        <Text style={styles.vs}>VS</Text>
        
        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{game.awayTeam}</Text>
          {game.awayScore !== undefined && (
            <Text style={styles.score}>{game.awayScore}</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.venueRow}
        onPress={() => router.push(`/game-details?id=${game.id}`)}
      >
        <MapPin size={16} color="#64748B" />
        <Text style={styles.venueText}>{game.venue}</Text>
      </TouchableOpacity>

      {renderLineup(game)}

      {game.status === 'live' && (
        featureAccess.canUseScorekeeper ? (
          <TouchableOpacity
            style={styles.scorekeeperButton}
            onPress={() => router.push(`/scorekeeper?gameId=${game.id}`)}
          >
            <Text style={styles.scorekeeperText}>Open Scorekeeper</Text>
          </TouchableOpacity>
        ) : (
          <SubscriptionGate
            feature="Scorekeeper"
            requiredPlan="Team Pro"
            onUpgrade={() => router.push('/subscription')}
          />
        )
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Games</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.rinkButton}
            onPress={() => router.push('/rink-dashboard')}
          >
            <Text style={styles.rinkButtonText}>Rink Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/schedule-game')}
          >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gamesGrid}>
          {games.map(renderGame)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#0EA5E9',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gamesGrid: {
    gap: 16,
    paddingBottom: 20,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  liveGame: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upcomingBadge: {
    backgroundColor: '#F1F5F9',
  },
  liveBadge: {
    backgroundColor: '#FEF2F2',
  },
  completedBadge: {
    backgroundColor: '#F0FDF4',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  upcomingText: {
    color: '#475569',
  },
  liveText: {
    color: '#EF4444',
  },
  completedText: {
    color: '#16A34A',
  },
  gameInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  vs: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginHorizontal: 20,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  venueText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  lineupSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  lineupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lineupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lineupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  checkedInCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  expandIcon: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  lineupList: {
    gap: 16,
  },
  lineSection: {
    marginBottom: 8,
  },
  lineTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#475569',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  lineGroup: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    gap: 2,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
  },
  checkedInRow: {
    backgroundColor: '#F0F9FF',
    borderLeftColor: '#0EA5E9',
  },
  disabledRow: {
    opacity: 0.6,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionBadge: {
    backgroundColor: '#475569',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  positionText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  checkedInPlayerName: {
    color: '#0EA5E9',
  },
  currentUserName: {
    fontFamily: 'Inter-Bold',
  },
  checkInControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkInIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedInIndicator: {
    backgroundColor: '#0EA5E9',
  },
  checkedOutIndicator: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 36,
    alignItems: 'center',
  },
  checkedInBadge: {
    backgroundColor: '#0EA5E9',
  },
  checkedOutBadge: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  checkedInBadgeText: {
    color: '#FFFFFF',
  },
  checkedOutBadgeText: {
    color: '#64748B',
  },
  scorekeeperButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  scorekeeperText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  rinkManagedHeader: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  rinkManagedHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
    textAlign: 'center',
  },
  rinkManagedBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  rinkManagedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  managementInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  managementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  managementText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 16,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jerseyNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
    minWidth: 24,
  },
  preferredPosition: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
  },
  editPanel: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  editRow: {
    marginBottom: 12,
  },
  editLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  lineupPreview: {
    padding: 20,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  lineupSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  lineupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lineupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lineupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  checkedInCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  expandIcon: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  lineupList: {
    gap: 16,
  },
  lineSection: {
    marginBottom: 8,
  },
  lineTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#475569',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  lineGroup: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    gap: 2,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
  },
  checkedInRow: {
    backgroundColor: '#F0F9FF',
    borderLeftColor: '#0EA5E9',
  },
  disabledRow: {
    opacity: 0.6,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionBadge: {
    backgroundColor: '#475569',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  positionText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  checkedInPlayerName: {
    color: '#0EA5E9',
  },
  currentUserName: {
    fontFamily: 'Inter-Bold',
  },
  checkInControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkInIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedInIndicator: {
    backgroundColor: '#0EA5E9',
  },
  checkedOutIndicator: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 36,
    alignItems: 'center',
  },
  checkedInBadge: {
    backgroundColor: '#0EA5E9',
  },
  checkedOutBadge: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  checkedInBadgeText: {
    color: '#FFFFFF',
  },
  checkedOutBadgeText: {
    color: '#64748B',
  },
  playerNameContainer: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jerseyNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
    minWidth: 24,
  },
  preferredPosition: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
  },
  editPanel: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  editRow: {
    marginBottom: 12,
  },
  editLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});