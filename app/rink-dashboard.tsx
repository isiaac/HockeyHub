import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chrome as Home, Users, Calendar, Settings, LogOut, Plus, Search, Filter, Bell, ChevronDown, Building, Trophy, UserCheck, RotateCcw, Eye, Star, Shield, MapPin, Mail, Phone } from 'lucide-react-native';
import { router } from 'expo-router';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { FreeAgentProfile } from '@/types/freeAgent';

const { width } = Dimensions.get('window');

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
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'matches', label: 'Matches', icon: Trophy },
    { id: 'schedule', label: 'Schedule', icon: Calendar, route: '/schedule' },
    { id: 'seasons', label: 'Current Seasons', icon: RotateCcw },
    { id: 'leaderboard', label: 'Rink Leaderboard', icon: Trophy },
    { id: 'management', label: 'User Management', icon: UserCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut, action: logout },
  ];

  const filteredFreeAgents = mockFreeAgents.filter(agent => {
    const matchesSearch = searchQuery === '' || 
      `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.hockeyInfo.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && agent.isActive;
  });

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

  return (
    <AuthGuard allowedRoles={['rink_admin', 'rink_owner']}>
      <View style={styles.container}>
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
            {/* Overview Stats */}
            <View style={styles.overviewSection}>
              <Text style={styles.sectionTitle}>Rink Overview</Text>
              <View style={styles.rinkStatsGrid}>
                {renderRinkStatsCard(
                  'Total Teams',
                  rinkStats.totalTeams.toString(),
                  'Active teams managed',
                  <Users size={20} color="#FFFFFF" />,
                  '#6366F1'
                )}
                {renderRinkStatsCard(
                  'Total Players',
                  rinkStats.totalPlayers.toString(),
                  'Registered players',
                  <Trophy size={20} color="#FFFFFF" />,
                  '#10B981'
                )}
                {renderRinkStatsCard(
                  'Games Played',
                  rinkStats.totalGames.toString(),
                  'This season',
                  <Calendar size={20} color="#FFFFFF" />,
                  '#F59E0B'
                )}
                {renderRinkStatsCard(
                  'Free Agents',
                  rinkStats.activeFreeAgents.toString(),
                  'Available players',
                  <UserCheck size={20} color="#FFFFFF" />,
                  '#8B5CF6'
                )}
              </View>
            </View>

            {/* Connected Teams Section */}
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
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.teamsContainer}>
                  {mockConnectedTeams.map(renderTeamCard)}
                </View>
              </ScrollView>
            </View>

            {/* Free Agents Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Free Agents</Text>
                <View style={styles.sectionActions}>
                  <TouchableOpacity style={styles.filterButton}>
                    <Filter size={16} color="#6B7280" />
                    <Text style={styles.filterText}>Filter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  <Search size={16} color="#6B7280" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, position, or location..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.agentsContainer}>
                  {filteredFreeAgents.slice(0, 8).map(renderFreeAgent)}
                </View>
              </ScrollView>
            </View>

            {/* Current Seasons Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Current Seasons</Text>
                <View style={styles.seasonActions}>
                  <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>Create Seasons</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.seasonsGrid}>
                {mockSeasons.map(renderSeasonCard)}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
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
    width: 280,
    backgroundColor: '#1F2937',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
  },
  logoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  sidebarMenu: {
    gap: 4,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  activeSidebarItem: {
    backgroundColor: '#6366F1',
  },
  sidebarText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  activeSidebarText: {
    color: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
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
    marginBottom: 40,
  },
  rinkStatsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  rinkStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 4,
  },
  rinkStatSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addTeamButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  addTeamText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  teamsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 20,
  },
  teamCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  teamFlag: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 28,
  },
  teamStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: '#10B981',
  },
  inactiveDot: {
    backgroundColor: '#EF4444',
  },
  teamTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 6,
  },
  teamDivision: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginBottom: 16,
  },
  teamStats: {
    marginBottom: 20,
    gap: 6,
  },
  teamRecord: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  teamPlayers: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  teamActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  manageButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
    gap: 6,
  },
  manageButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  agentsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
  },
  agentCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  availableDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    padding: 6,
    borderRadius: 8,
  },
  agentName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  agentPosition: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
    marginBottom: 12,
  },
  agentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  agentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ageText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  skillText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  rating: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#D97706',
  },
  agentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  contactText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  recruitButton: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
    gap: 6,
  },
  recruitText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  seasonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scheduleButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  seasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  seasonCard: {
    width: (width - 128) / 4,
    minWidth: 200,
    height: 160,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  seasonHeader: {
    marginBottom: 12,
  },
  seasonName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  seasonDivision: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  seasonDate: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  seasonStats: {
    gap: 6,
    marginBottom: 16,
  },
  seasonStat: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  seasonManageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  seasonManageText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});