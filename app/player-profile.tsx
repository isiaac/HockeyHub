import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Shield, Trophy, Edit3, Save, X, CheckCircle, AlertCircle, Building, Users, MapPin, Calendar, MessageSquare, Star, Target, Zap, Crown } from 'lucide-react-native';
import { PlayerProfile, PlayerStats, PlayerSeasonHistory, ValidationResult } from '@/types/player';
import { USAHockeyService } from '@/services/usaHockeyService';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
  earnedDate?: string;
  featured: boolean;
}

const mockPlayerProfile: PlayerProfile = {
  id: 'player-1',
  usaHockeyId: '12345678',
  firstName: 'Alex',
  lastName: 'Chen',
  email: 'alex.chen@email.com',
  phone: '555-0123',
  birthDate: '1995-03-15',
  emergencyContact: {
    name: 'Sarah Chen',
    phone: '555-0124',
    relationship: 'Spouse'
  },
  currentTeamId: 'team-1',
  currentRinkId: 'rink-1',
  skillLevel: 'advanced',
  preferredPosition: 'Center',
  shoots: 'left',
  height: '6\'0"',
  weight: '180 lbs',
  jerseyNumber: 12,
  createdAt: '2024-01-15',
  updatedAt: '2025-01-10'
};

const mockCurrentStats: PlayerStats = {
  id: 'stats-current',
  playerId: 'player-1',
  season: '2024-25',
  teamId: 'team-1',
  rinkId: 'rink-1',
  division: 'Adult Rec A',
  gamesPlayed: 15,
  goals: 12,
  assists: 18,
  points: 30,
  plusMinus: 8,
  penaltyMinutes: 6,
  powerPlayGoals: 3,
  shortHandedGoals: 1,
  gameWinningGoals: 2,
  shots: 45,
  shootingPercentage: 26.7,
  faceoffWins: 89,
  faceoffAttempts: 156,
  hits: 23,
  blockedShots: 12,
  createdAt: '2024-09-01',
  updatedAt: '2025-01-10'
};

const mockFeaturedBadges: Badge[] = [
  {
    id: '1',
    name: 'Hat Trick Hero',
    description: 'Score 3 goals in a single game',
    icon: <Target size={24} color="#FFFFFF" />,
    color: '#EF4444',
    earned: true,
    earnedDate: '2025-01-10',
    featured: true,
  },
  {
    id: '2',
    name: 'Assist Master',
    description: 'Record 10 assists in a season',
    icon: <Star size={24} color="#FFFFFF" />,
    color: '#F59E0B',
    earned: true,
    earnedDate: '2025-01-08',
    featured: true,
  },
  {
    id: '3',
    name: 'Team Captain',
    description: 'Lead your team to 10 victories',
    icon: <Crown size={24} color="#FFFFFF" />,
    color: '#0EA5E9',
    earned: true,
    earnedDate: '2025-01-05',
    featured: true,
  },
];

const mockSeasonHistory: PlayerSeasonHistory[] = [
  {
    season: '2024-25',
    teamName: 'Ice Wolves',
    rinkName: 'Central Ice Complex',
    division: 'Adult Rec A',
    stats: mockCurrentStats
  },
  {
    season: '2023-24',
    teamName: 'Storm Riders',
    rinkName: 'Central Ice Complex',
    division: 'Adult Rec A',
    stats: {
      id: 'stats-2',
      playerId: 'player-1',
      season: '2023-24',
      teamId: 'team-2',
      rinkId: 'rink-1',
      division: 'Adult Rec A',
      gamesPlayed: 20,
      goals: 8,
      assists: 12,
      points: 20,
      plusMinus: 5,
      penaltyMinutes: 12,
      powerPlayGoals: 2,
      shortHandedGoals: 0,
      gameWinningGoals: 1,
      shots: 38,
      shootingPercentage: 21.1,
      createdAt: '2023-09-01',
      updatedAt: '2024-04-30'
    }
  },
];

export default function PlayerProfileScreen() {
  const { playerId } = useLocalSearchParams();
  const [profile, setProfile] = useState<PlayerProfile>(mockPlayerProfile);
  const [currentStats] = useState<PlayerStats>(mockCurrentStats);
  const [featuredBadges] = useState<Badge[]>(mockFeaturedBadges);
  const [seasonHistory] = useState<PlayerSeasonHistory[]>(mockSeasonHistory);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [validatingUSAHockey, setValidatingUSAHockey] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [messageText, setMessageText] = useState('');

  const validateUSAHockeyId = async (registrationNumber: string) => {
    if (!USAHockeyService.isValidFormat(registrationNumber)) {
      setValidationResult({
        isValid: false,
        status: 'not_found',
        message: 'USA Hockey registration must be 8 digits'
      });
      return;
    }

    setValidatingUSAHockey(true);
    try {
      const result = await USAHockeyService.validateRegistration(registrationNumber);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        isValid: false,
        status: 'not_found',
        message: 'Unable to validate registration. Please try again.'
      });
    } finally {
      setValidatingUSAHockey(false);
    }
  };

  const handleUSAHockeyChange = (value: string) => {
    const formatted = USAHockeyService.formatRegistrationNumber(value);
    setEditForm(prev => ({ ...prev, usaHockeyId: formatted }));
    
    if (formatted.length === 8) {
      validateUSAHockeyId(formatted);
    } else {
      setValidationResult(null);
    }
  };

  const saveProfile = () => {
    if (editForm.usaHockeyId && !validationResult?.isValid) {
      Alert.alert('Invalid Registration', 'Please enter a valid USA Hockey registration number.');
      return;
    }
    
    setProfile(editForm);
    setIsEditing(false);
    setValidationResult(null);
  };

  const cancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
    setValidationResult(null);
  };

  const sendMessage = () => {
    if (!messageText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    
    Alert.alert(
      'Message Sent',
      `Your message has been sent to ${profile.firstName} ${profile.lastName}`,
      [{ text: 'OK', onPress: () => setMessageText('') }]
    );
  };

  const renderStatCard = (title: string, value: string | number, subtitle?: string, color?: string) => (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, color && { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderFeaturedBadge = (badge: Badge) => (
    <View key={badge.id} style={styles.featuredBadge}>
      <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
        {badge.icon}
      </View>
      <View style={styles.badgeInfo}>
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
        {badge.earnedDate && (
          <Text style={styles.badgeEarnedDate}>Earned {badge.earnedDate}</Text>
        )}
      </View>
    </View>
  );

  const renderSeasonHistory = (season: PlayerSeasonHistory) => (
    <View key={season.season} style={styles.seasonCard}>
      <View style={styles.seasonHeader}>
        <View style={styles.seasonTitleContainer}>
          <Text style={styles.seasonTitle}>{season.season} Season</Text>
          <Text style={styles.divisionText}>{season.division}</Text>
        </View>
        <View style={styles.teamRinkContainer}>
          <View style={styles.teamInfo}>
            <Users size={16} color="#0EA5E9" />
            <Text style={styles.teamName}>{season.teamName}</Text>
          </View>
          {season.rinkName && (
            <View style={styles.rinkInfo}>
              <Building size={14} color="#64748B" />
              <Text style={styles.rinkName}>{season.rinkName}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.seasonStats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>GP: {season.stats.gamesPlayed}</Text>
          <Text style={styles.statLabel}>G: {season.stats.goals}</Text>
          <Text style={styles.statLabel}>A: {season.stats.assists}</Text>
          <Text style={styles.statLabel}>P: {season.stats.points}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>+/-: {season.stats.plusMinus}</Text>
          <Text style={styles.statLabel}>PIM: {season.stats.penaltyMinutes}</Text>
          <Text style={styles.statLabel}>S%: {season.stats.shootingPercentage}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? saveProfile() : setIsEditing(true)}
        >
          {isEditing ? (
            <Save size={20} color="#0EA5E9" />
          ) : (
            <Edit3 size={20} color="#64748B" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Player Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              {isEditing ? (
                <View style={styles.editSection}>
                  <View style={styles.nameRow}>
                    <TextInput
                      style={[styles.editInput, styles.nameInput]}
                      value={editForm.firstName}
                      onChangeText={(text) => setEditForm(prev => ({ ...prev, firstName: text }))}
                      placeholder="First Name"
                    />
                    <TextInput
                      style={[styles.editInput, styles.nameInput]}
                      value={editForm.lastName}
                      onChangeText={(text) => setEditForm(prev => ({ ...prev, lastName: text }))}
                      placeholder="Last Name"
                    />
                  </View>
                </View>
              ) : (
                <Text style={styles.playerName}>{profile.firstName} {profile.lastName}</Text>
              )}
              
              <Text style={styles.skillLevel}>{profile.skillLevel.toUpperCase()} • {profile.preferredPosition}</Text>
              {profile.jerseyNumber && (
                <Text style={styles.jerseyNumber}>#{profile.jerseyNumber}</Text>
              )}
            </View>
          </View>

          {/* USA Hockey Registration Section */}
          <View style={styles.registrationSection}>
            <View style={styles.registrationHeader}>
              <Shield size={20} color="#0EA5E9" />
              <Text style={styles.registrationTitle}>USA Hockey Registration</Text>
            </View>
            
            {isEditing ? (
              <View style={styles.registrationEdit}>
                <TextInput
                  style={styles.registrationInput}
                  value={editForm.usaHockeyId || ''}
                  onChangeText={handleUSAHockeyChange}
                  placeholder="Enter 8-digit USA Hockey ID"
                  keyboardType="numeric"
                  maxLength={8}
                />
                
                {validatingUSAHockey && (
                  <Text style={styles.validatingText}>Validating...</Text>
                )}
                
                {validationResult && (
                  <View style={[
                    styles.validationResult,
                    validationResult.isValid ? styles.validResult : styles.invalidResult
                  ]}>
                    {validationResult.isValid ? (
                      <CheckCircle size={16} color="#16A34A" />
                    ) : (
                      <AlertCircle size={16} color="#EF4444" />
                    )}
                    <Text style={[
                      styles.validationText,
                      validationResult.isValid ? styles.validText : styles.invalidText
                    ]}>
                      {validationResult.message}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.registrationDisplay}>
                {profile.usaHockeyId ? (
                  <View style={styles.registrationValid}>
                    <CheckCircle size={16} color="#16A34A" />
                    <Text style={styles.registrationNumber}>#{profile.usaHockeyId}</Text>
                    <Text style={styles.registrationStatus}>VERIFIED</Text>
                  </View>
                ) : (
                  <View style={styles.registrationMissing}>
                    <AlertCircle size={16} color="#F59E0B" />
                    <Text style={styles.registrationMissingText}>No USA Hockey registration on file</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Contact Information */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {isEditing ? (
              <View style={styles.editSection}>
                <TextInput
                  style={styles.editInput}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                  placeholder="Email"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.editInput}
                  value={editForm.phone || ''}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <View style={styles.contactInfo}>
                <Text style={styles.contactText}>{profile.email}</Text>
                {profile.phone && <Text style={styles.contactText}>{profile.phone}</Text>}
              </View>
            )}
          </View>

          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <X size={16} color="#64748B" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Featured Badges */}
        <View style={styles.badgesCard}>
          <View style={styles.badgesHeader}>
            <View style={styles.badgesHeaderLeft}>
              <Trophy size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Featured Badges</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllBadgesButton}
              onPress={() => router.push('/(tabs)/badges')}
            >
              <Text style={styles.viewAllBadgesText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.featuredBadgesList}>
            {featuredBadges.map(renderFeaturedBadge)}
          </View>
        </View>

        {/* Current Season Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Current Season Stats</Text>
          <Text style={styles.statsSubtitle}>2024-25 Season • Ice Wolves • Adult Rec A</Text>
          
          <View style={styles.statsGrid}>
            {renderStatCard('Points', currentStats.points, `${currentStats.goals}G + ${currentStats.assists}A`, '#0EA5E9')}
            {renderStatCard('Goals', currentStats.goals, `${currentStats.shootingPercentage}% shooting`, '#EF4444')}
            {renderStatCard('Assists', currentStats.assists, 'Season total', '#16A34A')}
            {renderStatCard('Games', currentStats.gamesPlayed, 'Played', '#64748B')}
            {renderStatCard('+/-', currentStats.plusMinus > 0 ? `+${currentStats.plusMinus}` : currentStats.plusMinus.toString(), 'Plus/Minus', currentStats.plusMinus > 0 ? '#16A34A' : '#EF4444')}
            {renderStatCard('PIM', currentStats.penaltyMinutes, 'Penalty minutes', '#F59E0B')}
          </View>

          <View style={styles.advancedStats}>
            <Text style={styles.advancedStatsTitle}>Advanced Stats</Text>
            <View style={styles.advancedStatsGrid}>
              <View style={styles.advancedStatItem}>
                <Text style={styles.advancedStatLabel}>Power Play Goals</Text>
                <Text style={styles.advancedStatValue}>{currentStats.powerPlayGoals}</Text>
              </View>
              <View style={styles.advancedStatItem}>
                <Text style={styles.advancedStatLabel}>Game Winners</Text>
                <Text style={styles.advancedStatValue}>{currentStats.gameWinningGoals}</Text>
              </View>
              <View style={styles.advancedStatItem}>
                <Text style={styles.advancedStatLabel}>Shots</Text>
                <Text style={styles.advancedStatValue}>{currentStats.shots}</Text>
              </View>
              <View style={styles.advancedStatItem}>
                <Text style={styles.advancedStatLabel}>Faceoff %</Text>
                <Text style={styles.advancedStatValue}>
                  {currentStats.faceoffWins && currentStats.faceoffAttempts 
                    ? Math.round((currentStats.faceoffWins / currentStats.faceoffAttempts) * 100)
                    : 0}%
                </Text>
              </View>
              <View style={styles.advancedStatItem}>
                <Text style={styles.advancedStatLabel}>Hits</Text>
                <Text style={styles.advancedStatValue}>{currentStats.hits}</Text>
              </View>
              <View style={styles.advancedStatItem}>
                <Text style={styles.advancedStatLabel}>Blocked Shots</Text>
                <Text style={styles.advancedStatValue}>{currentStats.blockedShots}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Message Player */}
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <MessageSquare size={20} color="#0EA5E9" />
            <Text style={styles.sectionTitle}>Send Message</Text>
          </View>
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              value={messageText}
              onChangeText={setMessageText}
              placeholder={`Send a message to ${profile.firstName}...`}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <MessageSquare size={16} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Season History */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Season History</Text>
            <Text style={styles.historySubtitle}>
              {seasonHistory.length} seasons • {new Set(seasonHistory.map(s => s.rinkName)).size} rinks
            </Text>
          </View>
          <View style={styles.historyList}>
            {seasonHistory.map(renderSeasonHistory)}
          </View>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  skillLevel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  jerseyNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  registrationSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  registrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  registrationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  registrationEdit: {
    gap: 12,
  },
  registrationInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    letterSpacing: 2,
  },
  validatingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  validationResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  validResult: {
    backgroundColor: '#F0FDF4',
  },
  invalidResult: {
    backgroundColor: '#FEF2F2',
  },
  validationText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  validText: {
    color: '#16A34A',
  },
  invalidText: {
    color: '#EF4444',
  },
  registrationDisplay: {
    alignItems: 'center',
  },
  registrationValid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  registrationNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    letterSpacing: 1,
  },
  registrationStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  registrationMissing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  registrationMissingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  contactSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  editSection: {
    gap: 12,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  editInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  contactInfo: {
    gap: 8,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  badgesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewAllBadgesButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAllBadgesText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  featuredBadgesList: {
    gap: 12,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  badgeEarnedDate: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    minWidth: 80,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  advancedStats: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  advancedStatsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  advancedStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  advancedStatItem: {
    alignItems: 'center',
    width: '30%',
    minWidth: 80,
  },
  advancedStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  advancedStatValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  messageInputContainer: {
    gap: 12,
  },
  messageInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyHeader: {
    marginBottom: 16,
  },
  historySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  historyList: {
    gap: 16,
  },
  seasonCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  seasonHeader: {
    gap: 12,
    marginBottom: 8,
  },
  seasonTitleContainer: {
    gap: 4,
  },
  seasonTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  divisionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
  teamRinkContainer: {
    gap: 8,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamName: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  rinkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rinkName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  seasonStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
});