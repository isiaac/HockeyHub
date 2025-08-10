import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Star, Target, Zap, Shield, Crown } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  requirement?: string;
}

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Hat Trick Hero',
    description: 'Score 3 goals in a single game',
    icon: <Target size={32} color="#FFFFFF" />,
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    earned: true,
    earnedDate: '2025-01-10',
  },
  {
    id: '2',
    name: 'Assist Master',
    description: 'Record 10 assists in a season',
    icon: <Star size={32} color="#FFFFFF" />,
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    earned: true,
    earnedDate: '2025-01-08',
  },
  {
    id: '3',
    name: 'Iron Wall',
    description: 'Record 3 shutouts as a goalie',
    icon: <Shield size={32} color="#FFFFFF" />,
    color: '#8B5CF6',
    backgroundColor: '#F3E8FF',
    earned: false,
    progress: 66,
    requirement: '2/3 shutouts',
  },
  {
    id: '4',
    name: 'Speed Demon',
    description: 'Score within first 30 seconds of a period',
    icon: <Zap size={32} color="#FFFFFF" />,
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    earned: false,
    progress: 0,
    requirement: 'Score early goal',
  },
  {
    id: '5',
    name: 'Team Captain',
    description: 'Lead your team to 10 victories',
    icon: <Crown size={32} color="#FFFFFF" />,
    color: '#0EA5E9',
    backgroundColor: '#DBEAFE',
    earned: false,
    progress: 80,
    requirement: '8/10 victories',
  },
  {
    id: '6',
    name: 'Perfect Game',
    description: 'Win a game without any penalties',
    icon: <Trophy size={32} color="#FFFFFF" />,
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    earned: false,
    progress: 25,
    requirement: 'Clean game needed',
  },
];

export default function BadgesScreen() {
  const [badges] = useState<Badge[]>(mockBadges);
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'available'>('all');

  const filteredBadges = badges.filter(badge => {
    if (filterType === 'earned') return badge.earned;
    if (filterType === 'available') return !badge.earned;
    return true;
  });

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;

  const renderBadge = (badge: Badge) => (
    <TouchableOpacity key={badge.id} style={[styles.badgeCard, isTablet && styles.tabletBadgeCard]}>
      <View style={[styles.badgeIcon, { backgroundColor: badge.color }, !badge.earned && styles.unearnedBadge]}>
        {badge.icon}
      </View>
      
      <View style={styles.badgeContent}>
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
        
        {badge.earned ? (
          <View style={styles.earnedContainer}>
            <Text style={styles.earnedText}>Earned on {badge.earnedDate}</Text>
          </View>
        ) : (
          <View style={styles.progressContainer}>
            {badge.progress !== undefined && badge.progress > 0 && (
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${badge.progress}%` }]} />
              </View>
            )}
            <Text style={styles.requirementText}>{badge.requirement}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <View style={styles.progressSummary}>
          <Text style={styles.progressText}>{earnedCount}/{totalCount}</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'earned', 'available'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, filterType === filter && styles.activeFilter]}
            onPress={() => setFilterType(filter)}
          >
            <Text style={[styles.filterText, filterType === filter && styles.activeFilterText]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={isTablet ? styles.badgesGrid : styles.badgesList}>
          {filteredBadges.map(renderBadge)}
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
  progressSummary: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#0EA5E9',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  badgesList: {
    gap: 16,
    paddingBottom: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 20,
  },
  badgeCard: {
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
    width: '100%',
  },
  tabletBadgeCard: {
    width: (width - 60) / 2,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  unearnedBadge: {
    opacity: 0.4,
  },
  badgeContent: {
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  earnedContainer: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  earnedText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 3,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
});