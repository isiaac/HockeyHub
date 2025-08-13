import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chrome as Home, Users, Calendar, Settings, LogOut, Plus, Search, Filter, Bell, ChevronDown, Building, Trophy, UserCheck, RotateCcw, Eye, Star, Shield, MapPin, Mail, Phone, Play, Clock, ChartBar as BarChart3, TrendingUp, CircleAlert as AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { FreeAgentProfile } from '@/types/freeAgent';
import { LiveGame } from '@/types/gameStats';
import { GameStatsService } from '@/services/gamestatsService';

const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;
const isTablet = width >= 768;

interface ConnectedTeam {
  id: string;
  name: string;
  flag: string;
  country: string;
  players: number;
  status: 'active' | 'inactive';
  wins: number;
  losses: number;
  ties: number;
  goalsFor: number;
  goalsAgainst: number;
  lastGame: string;
  division: string;
}

interface Season {
  id: string;
  name: string;
  year: string;
  dateRange: string;
  type: 'hockey' | 'other';
  color: string;
  teamsCount: number;
  gamesPlayed: number;
  division: string;
}

interface RinkStats {
  totalTeams: number;
  totalPlayers: number;
  totalGames: number;
  activeFreeAgents: number;
  monthlyRevenue: number;
  utilizationRate: number;
}

const mockConnectedTeams: ConnectedTeam[] = [
  { 
    id: '1', 
    name: 'Ice Wolves', 
    flag: '🇨🇦', 
    country: 'Canada', 
    players: 18, 
    status: 'active',
    wins: 12,
    losses: 3,
    ties: 0,
    goalsFor: 68,
    goalsAgainst: 32,
    lastGame: '4-1 vs Thunder Hawks',
    division: 'Division A'
  },
  { 
    id: '2', 
    name: 'Thunder Hawks', 
    flag: '🇺🇸', 
    country: 'USA', 
    players: 20, 
    status: 'active',
    wins: 9,
    losses: 5,
    ties: 1,
    goalsFor: 55,
    goalsAgainst: 45,
    lastGame: '1-4 vs Ice Wolves',
    division: 'Division A'
  },
  { 
    id: '3', 
    name: 'Storm Riders', 
    flag: '🇨🇿', 
    country: 'Czech Republic', 
    players: 19, 
    status: 'active',
    wins: 11,
    losses: 4,
    ties: 0,
    goalsFor: 62,
    goalsAgainst: 38,
    lastGame: '3-2 vs Lightning',
    division: 'Division A'
  },
  { 
    id: '4', 
    name: 'Lightning Bolts', 
    flag: '🇫🇮', 
    country: 'Finland', 
    players: 17, 
    status: 'active',
    wins: 8,
    losses: 6,
    ties: 1,
    goalsFor: 48,
    goalsAgainst: 52,
    lastGame: '2-3 vs Storm Riders',
    division: 'Division B'
  },
];

const mockFreeAgents: FreeAgentProfile[] = [
  {
    id: '1',
    userId: 'user-1',
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@email.com',
    phone: '555-0123',
    birthDate: '1995-03-15',
    age: 29,
    location: {
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5V 3A8',
    },
    hockeyInfo: {
      position: 'Center',
      skillLevel: 'advanced',
      shoots: 'left',
      experience: '15+ years',
      availability: {
        weekdays: false,
        weekends: true,
        mornings: false,
        evenings: true,
      },
      travelDistance: 25,
    },
    usaHockeyId: '12345678',
    usaHockeyStatus: 'active',
    bio: 'Experienced center looking for competitive adult league.',
    lookingFor: ['team', 'pickup_games'],
    isActive: true,
    rating: 4.8,
    applications: [],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-10',
  },
  {
    id: '2',
    userId: 'user-2',
    firstName: 'Morgan',
    lastName: 'Davis',
    email: 'morgan.davis@email.com',
    phone: '555-0124',
    birthDate: '1992-07-22',
    age: 32,
    location: {
      city: 'Vancouver',
      state: 'BC',
      zipCode: 'V6B 1A1',
    },
    hockeyInfo: {
      position: 'Right Wing',
      skillLevel: 'intermediate',
      shoots: 'right',
      experience: '8 years',
      availability: {
        weekdays: true,
        weekends: true,
        mornings: true,
        evenings: false,
      },
      travelDistance: 15,
    },
    usaHockeyId: '87654321',
    usaHockeyStatus: 'active',
    bio: 'Reliable winger with good speed and shot.',
    lookingFor: ['team'],
    isActive: true,
    rating: 4.5,
    applications: [],
    createdAt: '2025-01-02',
    updatedAt: '2025-01-11',
  },
];

const mockSeasons: Season[] = [
  { 
    id: '1', 
    name: 'Winter League 2024', 
    year: '2024', 
    dateRange: '25.07.2023 to 25.08.2023', 
    type: 'hockey', 
    color: '#EF4444',
    teamsCount: 8,
    gamesPlayed: 45,
    division: 'Division A'
  },
  { 
    id: '2', 
    name: 'Summer League 2024', 
    year: '2024', 
    dateRange: '25.07.2023 to 25.08.2023', 
    type: 'hockey', 
    color: '#3B82F6',
    teamsCount: 6,
    gamesPlayed: 32,
    division: 'Division B'
  },
];

const rinkStats: RinkStats = {
  totalTeams: 30,
  totalPlayers: 540,
  totalGames: 157,
  activeFreeAgents: 23,
  monthlyRevenue: 45600,
  utilizationRate: 87,
};

export default function RinkDashboard() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [loadingLiveGames, setLoadingLiveGames] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    loadLiveGames();
  }, []);

  const loadLiveGames = async () => {
    setError(null);
    try {
      const games = await GameStatsService.getLiveGames('rink-1');
      setLiveGames(games);
    } catch (error) {
      console.error('Failed to load live games:', error);
      setError('Failed to load live games. Please try again.');
    } finally {
      setLoadingLiveGames(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'substitutes', label: 'Substitutes', icon: UserCheck },
    { id: 'live-games', label: 'Live Games', icon: Play },
    { id: 'payments', label: 'Payments', icon: DollarSign, route: '/payments' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, route: '/schedule' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderSidebarItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.sidebarItem, activeSection === item.id && styles.activeSidebarItem]}
      onPress={() => {
        if (item.action) {
          item.action();
        } else if (item.route) {
          router.push(item.route);
        } else {
          setActiveSection(item.id);
        }
      }}
    >
      <item.icon size={18} color={activeSection === item.id ? '#FFFFFF' : '#9CA3AF'} />
      <Text style={[styles.sidebarText, activeSection === item.id && styles.activeSidebarText]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderTeamCard = (team: ConnectedTeam) => (
    <View key={team.id} style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <View style={styles.teamFlag}>
          <Text style={styles.flagEmoji}>{team.flag}</Text>
        </View>
        <View style={styles.teamStatus}>
          <View style={[styles.statusDot, team.status === 'active' ? styles.activeDot : styles.inactiveDot]} />
        </View>
      </View>
      
      <Text style={styles.teamTitle}>{team.name}</Text>
      <Text style={styles.teamDivision}>{team.division}</Text>
      
      <View style={styles.teamStats}>
        <Text style={styles.teamRecord}>{team.wins}W-{team.losses}L-{team.ties}T</Text>
        <Text style={styles.teamPlayers}>{team.players} players</Text>
      </View>
      
      <View style={styles.teamActions}>
        <TouchableOpacity style={styles.viewButton}>
          <Eye size={14} color="#FFFFFF" />
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.manageButton}>
          <Settings size={14} color="#6366F1" />
          <Text style={styles.manageButtonText}>Manage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFreeAgent = (agent: FreeAgentProfile) => (
    <View key={agent.id} style={styles.agentCard}>
      <View style={styles.agentHeader}>
        <View style={styles.agentAvatar}>
          <Text style={styles.avatarText}>
            {agent.firstName[0]}{agent.lastName[0]}
          </Text>
          {agent.isActive && <View style={styles.availableDot} />}
        </View>
        {agent.usaHockeyStatus === 'active' && (
          <View style={styles.verifiedBadge}>
            <Shield size={12} color="#10B981" />
          </View>
        )}
      </View>
      
      <TouchableOpacity onPress={() => router.push(`/player-profile?playerId=${agent.userId}`)}>
        <Text style={styles.agentName}>{agent.firstName} {agent.lastName}</Text>
      </TouchableOpacity>
      <Text style={styles.agentPosition}>{agent.hockeyInfo.position}</Text>
      
      <View style={styles.agentLocation}>
        <MapPin size={12} color="#6B7280" />
        <Text style={styles.locationText}>{agent.location.city}, {agent.location.state}</Text>
      </View>
      
      <View style={styles.agentMeta}>
        <Text style={styles.ageText}>{agent.age} yrs</Text>
        <Text style={styles.skillText}>{agent.hockeyInfo.skillLevel}</Text>
        {agent.rating && (
          <View style={styles.ratingContainer}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{agent.rating}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.agentActions}>
        <TouchableOpacity style={styles.contactButton}>
          <Mail size={12} color="#FFFFFF" />
          <Text style={styles.contactText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recruitButton}>
          <Users size={12} color="#6366F1" />
          <Text style={styles.recruitText}>Recruit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSeasonCard = (season: Season) => (
    <View key={season.id} style={[styles.seasonCard, { backgroundColor: season.color }]}>
      <View style={styles.seasonHeader}>
        <Text style={styles.seasonName}>{season.name}</Text>
        <Text style={styles.seasonDivision}>{season.division}</Text>
      </View>
      <Text style={styles.seasonDate}>{season.dateRange}</Text>
      <View style={styles.seasonStats}>
        <Text style={styles.seasonStat}>{season.teamsCount} teams</Text>
        <Text style={styles.seasonStat}>{season.gamesPlayed} games</Text>
      </View>
      <TouchableOpacity style={styles.seasonManageButton}>
        <Text style={styles.seasonManageText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRinkStatsCard = (title: string, value: string, subtitle: string, icon: React.ReactNode, color: string) => (
    <View style={styles.rinkStatCard}>
      <View style={[styles.rinkStatIcon, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.rinkStatContent}>
        <Text style={styles.rinkStatValue}>{value}</Text>
        <Text style={styles.rinkStatTitle}>{title}</Text>
        <Text style={styles.rinkStatSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  const renderLiveGame = (game: LiveGame) => (
    <TouchableOpacity 
      key={game.id} 
      style={styles.liveGameCard}
      onPress={() => router.push(`/live-scorekeeper?gameId=${game.id}`)}
    >
      <View style={styles.liveGameHeader}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.liveGamePeriod}>Period {game.period}</Text>
      </View>
      
      <View style={styles.liveGameTeams}>
        <View style={styles.liveTeamSection}>
          <Text style={styles.liveTeamName}>{game.homeTeam.name}</Text>
          <Text style={styles.liveTeamScore}>{game.homeTeam.score}</Text>
        </View>
        <Text style={styles.liveVs}>VS</Text>
        <View style={styles.liveTeamSection}>
          <Text style={styles.liveTeamName}>{game.awayTeam.name}</Text>
          <Text style={styles.liveTeamScore}>{game.awayTeam.score}</Text>
        </View>
      </View>
      
      <View style={styles.liveGameInfo}>
        <View style={styles.liveGameTime}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.liveTimeText}>{game.timeRemaining}</Text>
        </View>
        <Text style={styles.liveVenue}>{game.venue}</Text>
      </View>
      
      <View style={styles.liveGameActions}>
        <View style={styles.liveGameStats}>
          <Text style={styles.liveStatText}>Shots: {game.shots.home}-{game.shots.away}</Text>
          <Text style={styles.liveStatText}>Penalties: {game.penalties.home}-{game.penalties.away}</Text>
        </View>
        <TouchableOpacity style={styles.scorekeeperButton}>
          <Text style={styles.scorekeeperButtonText}>Open Scorekeeper</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <AuthGuard allowedRoles={['rink_admin', 'rink_owner']}>
      <SafeAreaView style={styles.container}>
        {/* Dark Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoText}>🏒</Text>
            </View>
            <Text style={styles.logoTitle}>IceRink Pro</Text>
          </View>
          
          <View style={styles.sidebarMenu}>
            {sidebarItems.map(renderSidebarItem)}
            
            <View style={styles.sidebarDivider} />
            
            <TouchableOpacity
              style={[styles.sidebarItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <LogOut size={18} color="#EF4444" />
              <Text style={[styles.sidebarText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Top Header */}
          <View style={styles.topHeader}>
            <Text style={styles.welcomeText}>Welcome John Smith</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Bell size={20} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>3</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.userProfile}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>JS</Text>
                </View>
                <Text style={styles.userName}>John Smith</Text>
                <ChevronDown size={16} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Live Games Section */}
            {activeSection === 'home' && (
              <>
                {/* Overview Stats */}
                <View style={styles.overviewSection}>
                  <Text style={styles.sectionTitle}>Rink Overview</Text>
                  <View style={styles.rinkStatsGrid}>
                    {renderRinkStatsCard(
                      'Total Teams',
                      rinkStats.totalTeams.toString(),
                      'Active teams managed',
                      <Users size={24} color="#FFFFFF" />,
                      '#6366F1'
                    )}
                    {renderRinkStatsCard(
                      'Total Players',
                      rinkStats.totalPlayers.toString(),
                      'Registered players',
                      <Trophy size={24} color="#FFFFFF" />,
                      '#10B981'
                    )}
                    {renderRinkStatsCard(
                      'Monthly Revenue',
                      `$${rinkStats.monthlyRevenue.toLocaleString()}`,
                      'This month',
                      <TrendingUp size={24} color="#FFFFFF" />,
                      '#F59E0B'
                    )}
                    {renderRinkStatsCard(
                      'Utilization',
                      `${rinkStats.utilizationRate}%`,
                      'Ice time booked',
                      <BarChart3 size={24} color="#FFFFFF" />,
                      '#8B5CF6'
                    )}
                  </View>
                </View>

                {/* Live Games */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Live Games</Text>
                    <TouchableOpacity style={styles.refreshButton} onPress={loadLiveGames}>
                      <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {error && (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={20} color="#EF4444" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}
                  
                  {loadingLiveGames ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.loadingText}>Loading live games...</Text>
                    </View>
                  ) : liveGames.length > 0 ? (
                    <View style={styles.liveGamesGrid}>
                      {liveGames.map(renderLiveGame)}
                    </View>
                  ) : (
                    <View style={styles.noLiveGames}>
                      <Text style={styles.noLiveGamesText}>No live games currently in progress</Text>
                    </View>
                  )}
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                  <Text style={styles.sectionTitle}>Quick Actions</Text>
                  <View style={styles.quickActionsGrid}>
                    <TouchableOpacity 
                      style={styles.quickActionCard}
                      onPress={() => router.push('/schedule')}
                    >
                      <Calendar size={32} color="#0EA5E9" />
                      <Text style={styles.quickActionTitle}>View Schedule</Text>
                      <Text style={styles.quickActionSubtitle}>Manage ice time</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.quickActionCard}
                      onPress={() => setActiveSection('teams')}
                    >
                      <Users size={32} color="#16A34A" />
                      <Text style={styles.quickActionTitle}>Manage Teams</Text>
                      <Text style={styles.quickActionSubtitle}>View all teams</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.quickActionCard}
                      onPress={() => router.push('/broadcast')}
                    >
                      <Bell size={32} color="#F59E0B" />
                      <Text style={styles.quickActionTitle}>Broadcast</Text>
                      <Text style={styles.quickActionSubtitle}>Send messages</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.quickActionCard}
                      onPress={() => router.push('/booking-request')}
                    >
                      <Plus size={32} color="#8B5CF6" />
                      <Text style={styles.quickActionTitle}>Book Ice Time</Text>
                      <Text style={styles.quickActionSubtitle}>New booking</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.quickActionCard}
                      onPress={() => setActiveSection('substitutes')}
                    >
                      <UserCheck size={32} color="#EF4444" />
                      <Text style={styles.quickActionTitle}>Manage Substitutes</Text>
                      <Text style={styles.quickActionSubtitle}>Player database</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {activeSection === 'live-games' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Live Games</Text>
                  <TouchableOpacity style={styles.refreshButton} onPress={loadLiveGames}>
                    <Text style={styles.refreshText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
                
                {loadingLiveGames ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading live games...</Text>
                  </View>
                ) : liveGames.length > 0 ? (
                  <View style={styles.liveGamesGrid}>
                    {liveGames.map(renderLiveGame)}
                  </View>
                ) : (
                  <View style={styles.noLiveGames}>
                    <Text style={styles.noLiveGamesText}>No live games currently in progress</Text>
                  </View>
                )}
              </View>
            )}

            {/* Connected Teams Section */}
            {activeSection === 'teams' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Connected Teams</Text>
                  <View style={styles.sectionActions}>
                    <TouchableOpacity style={styles.addTeamButton}>
                      <Plus size={16} color="#FFFFFF" />
                      <Text style={styles.addTeamText}>Add Team</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.scheduleButton}
                      onPress={() => router.push('/schedule')}
                    >
                      <Calendar size={16} color="#FFFFFF" />
                      <Text style={styles.scheduleButtonText}>View Schedule</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.teamsGrid}>
                  {mockConnectedTeams.map(renderTeamCard)}
                </View>
              </View>
            )}

            {/* Substitutes Section */}
            {activeSection === 'substitutes' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Substitute Players Database</Text>
                  <TouchableOpacity 
                    style={styles.addSubstituteButton}
                    onPress={() => router.push('/substitute-manager')}
                  >
                    <UserCheck size={16} color="#FFFFFF" />
                    <Text style={styles.addSubstituteText}>Search & Add</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.substituteStats}>
                  <View style={styles.substituteStatCard}>
                    <Text style={styles.substituteStatValue}>47</Text>
                    <Text style={styles.substituteStatLabel}>Registered Substitutes</Text>
                  </View>
                  <View style={styles.substituteStatCard}>
                    <Text style={styles.substituteStatValue}>23</Text>
                    <Text style={styles.substituteStatLabel}>Available Today</Text>
                  </View>
                  <View style={styles.substituteStatCard}>
                    <Text style={styles.substituteStatValue}>42</Text>
                    <Text style={styles.substituteStatLabel}>USA Hockey Verified</Text>
                  </View>
                  <View style={styles.substituteStatCard}>
                    <Text style={styles.substituteStatValue}>156</Text>
                    <Text style={styles.substituteStatLabel}>Total Penalty Minutes</Text>
                  </View>
                </View>

                <View style={styles.recentSubstitutes}>
                  <Text style={styles.recentSubstitutesTitle}>Recent Substitute Activity</Text>
                  <View style={styles.recentSubstitutesList}>
                    <View style={styles.recentSubstituteItem}>
                      <View style={styles.recentSubstituteInfo}>
                        <Text style={styles.recentSubstituteName}>Jamie Wilson</Text>
                        <Text style={styles.recentSubstituteDetails}>Added to Ice Wolves vs Thunder Hawks</Text>
                        <Text style={styles.recentSubstituteTime}>2 hours ago</Text>
                      </View>
                      <View style={styles.recentSubstituteStatus}>
                        <Text style={styles.approvedStatus}>APPROVED</Text>
                      </View>
                    </View>
                    
                    <View style={styles.recentSubstituteItem}>
                      <View style={styles.recentSubstituteInfo}>
                        <Text style={styles.recentSubstituteName}>Taylor Martinez</Text>
                        <Text style={styles.recentSubstituteDetails}>Added to Storm Riders practice</Text>
                        <Text style={styles.recentSubstituteTime}>5 hours ago</Text>
                      </View>
                      <View style={styles.recentSubstituteStatus}>
                        <Text style={styles.pendingStatus}>PENDING</Text>
                      </View>
                    </View>
                    
                    <View style={styles.recentSubstituteItem}>
                      <View style={styles.recentSubstituteInfo}>
                        <Text style={styles.recentSubstituteName}>Casey Thompson</Text>
                        <Text style={styles.recentSubstituteDetails}>Rejected - USA Hockey expired</Text>
                        <Text style={styles.recentSubstituteTime}>1 day ago</Text>
                      </View>
                      <View style={styles.recentSubstituteStatus}>
                        <Text style={styles.rejectedStatus}>REJECTED</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rink Settings</Text>
                <View style={styles.settingsGrid}>
                  <View style={styles.settingsCard}>
                    <Building size={32} color="#6366F1" />
                    <Text style={styles.settingsTitle}>Facility Management</Text>
                    <Text style={styles.settingsSubtitle}>Manage rink surfaces and equipment</Text>
                  </View>
                  <View style={styles.settingsCard}>
                    <Users size={32} color="#10B981" />
                    <Text style={styles.settingsTitle}>Team Permissions</Text>
                    <Text style={styles.settingsSubtitle}>Control team access and features</Text>
                  </View>
                  <View style={styles.settingsCard}>
                    <Bell size={32} color="#F59E0B" />
                    <Text style={styles.settingsTitle}>Notifications</Text>
                    <Text style={styles.settingsSubtitle}>Configure alerts and messages</Text>
                  </View>
                  <View style={styles.settingsCard}>
                    <BarChart3 size={32} color="#8B5CF6" />
                    <Text style={styles.settingsTitle}>Reports & Analytics</Text>
                    <Text style={styles.settingsSubtitle}>View usage and revenue reports</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#1F2937',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  logoIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#6366F1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
  },
  logoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  sidebarMenu: {
    gap: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 16,
  },
  activeSidebarItem: {
    backgroundColor: '#6366F1',
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  logoutItem: {
    marginTop: 8,
  },
  sidebarText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  activeSidebarText: {
    color: '#FFFFFF',
  },
  logoutText: {
    color: '#EF4444',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    backgroundColor: '#6366F1',
    paddingHorizontal: isDesktop ? 40 : 24,
    paddingVertical: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: isDesktop ? 32 : 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitials: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  overviewSection: {
    marginBottom: 48,
  },
  rinkStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  rinkStatCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  rinkStatIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  rinkStatContent: {
    flex: 1,
  },
  rinkStatValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  rinkStatTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 6,
  },
  rinkStatSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    marginBottom: 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  addTeamButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  addTeamText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  filterText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  viewAllButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  searchContainer: {
    marginBottom: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  teamCard: {
    flex: 1,
    minWidth: 240,
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  teamFlag: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 32,
  },
  teamStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  activeDot: {
    backgroundColor: '#10B981',
  },
  inactiveDot: {
    backgroundColor: '#EF4444',
  },
  teamTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  teamDivision: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginBottom: 20,
  },
  teamStats: {
    marginBottom: 24,
    gap: 8,
  },
  teamRecord: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  teamPlayers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  teamActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  manageButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
    gap: 8,
  },
  manageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  settingsCard: {
    flex: 1,
    minWidth: 200,
    maxWidth: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  settingsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  scheduleButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  liveGamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  liveGameCard: {
    flex: 1,
    minWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  liveGameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
  },
  liveText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  liveGamePeriod: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  liveGameTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  liveTeamSection: {
    flex: 1,
    alignItems: 'center',
  },
  liveTeamName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  liveTeamScore: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  liveVs: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
    marginHorizontal: 20,
  },
  liveGameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveGameTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveTimeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  liveVenue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  liveGameActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveGameStats: {
    gap: 6,
  },
  liveStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  scorekeeperButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scorekeeperButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  refreshButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  refreshText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  noLiveGames: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noLiveGamesText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickActionsSection: {
    marginBottom: 48,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  quickActionCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  quickActionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  addSubstituteButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  addSubstituteText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  substituteStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 32,
  },
  substituteStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  substituteStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  substituteStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  recentSubstitutes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentSubstitutesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  recentSubstitutesList: {
    gap: 16,
  },
  recentSubstituteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  recentSubstituteInfo: {
    flex: 1,
  },
  recentSubstituteName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  recentSubstituteDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  recentSubstituteTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  recentSubstituteStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  approvedStatus: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingStatus: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rejectedStatus: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  agentCard: {
    width: isDesktop ? 220 : 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  availableDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: '#10B981',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 10,
  },
  agentName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 6,
  },
  agentPosition: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
    marginBottom: 16,
  },
  agentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  agentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ageText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#D97706',
  },
  agentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  contactText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  recruitButton: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6366F1',
    gap: 8,
  },
  recruitText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  seasonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  createButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  seasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isDesktop ? 32 : 20,
  },
  seasonCard: {
    width: isDesktop ? 240 : 200,
    height: 180,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  seasonHeader: {
    marginBottom: 16,
  },
  seasonName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  seasonDivision: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  seasonDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  seasonStats: {
    gap: 8,
    marginBottom: 20,
  },
  seasonStat: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  seasonManageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  seasonManageText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});