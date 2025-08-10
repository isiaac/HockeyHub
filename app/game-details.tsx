import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Users, Calendar, Trophy } from 'lucide-react-native';

interface GameDetail {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  homeScore?: number;
  awayScore?: number;
  homeRoster: string[];
  awayRoster: string[];
  referee: string;
  division: string;
}

const mockGameDetail: GameDetail = {
  id: '1',
  homeTeam: 'Ice Wolves',
  awayTeam: 'Thunder Hawks',
  date: '2025-01-15',
  time: '7:00 PM',
  venue: 'Central Ice Arena',
  status: 'live',
  homeScore: 2,
  awayScore: 1,
  homeRoster: ['Alex Chen (C)', 'Morgan Davis (RW)', 'Jordan Smith (D)', 'Casey Brown (G)', 'Sam Wilson (LW)'],
  awayRoster: ['Mike Johnson (C)', 'Sarah Lee (RW)', 'Tom Anderson (D)', 'Lisa Park (G)', 'Chris Taylor (LW)'],
  referee: 'John Martinez',
  division: 'Division A',
};

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [gameDetail] = useState<GameDetail>(mockGameDetail);

  const renderRoster = (roster: string[], teamName: string) => (
    <View style={styles.rosterSection}>
      <Text style={styles.rosterTitle}>{teamName} Roster</Text>
      <View style={styles.rosterList}>
        {roster.map((player, index) => (
          <View key={index} style={styles.playerItem}>
            <Text style={styles.playerName}>{player}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <View style={[styles.statusBadge, styles[`${gameDetail.status}Badge`]]}>
              <Text style={[styles.statusText, styles[`${gameDetail.status}Text`]]}>
                {gameDetail.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.division}>{gameDetail.division}</Text>
          </View>

          <View style={styles.teamsContainer}>
            <View style={styles.teamSection}>
              <Text style={styles.teamName}>{gameDetail.homeTeam}</Text>
              <Text style={styles.teamLabel}>HOME</Text>
              {gameDetail.homeScore !== undefined && (
                <Text style={styles.score}>{gameDetail.homeScore}</Text>
              )}
            </View>
            
            <Text style={styles.vs}>VS</Text>
            
            <View style={styles.teamSection}>
              <Text style={styles.teamName}>{gameDetail.awayTeam}</Text>
              <Text style={styles.teamLabel}>AWAY</Text>
              {gameDetail.awayScore !== undefined && (
                <Text style={styles.score}>{gameDetail.awayScore}</Text>
              )}
            </View>
          </View>

          <View style={styles.gameMetaData}>
            <View style={styles.metaRow}>
              <Calendar size={20} color="#64748B" />
              <Text style={styles.metaText}>{gameDetail.date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Clock size={20} color="#64748B" />
              <Text style={styles.metaText}>{gameDetail.time}</Text>
            </View>
            <View style={styles.metaRow}>
              <MapPin size={20} color="#64748B" />
              <Text style={styles.metaText}>{gameDetail.venue}</Text>
            </View>
            <View style={styles.metaRow}>
              <Users size={20} color="#64748B" />
              <Text style={styles.metaText}>Referee: {gameDetail.referee}</Text>
            </View>
          </View>

          {gameDetail.status === 'live' && (
            <TouchableOpacity
              style={styles.scorekeeperButton}
              onPress={() => router.push(`/scorekeeper?gameId=${gameDetail.id}`)}
            >
              <Trophy size={20} color="#FFFFFF" />
              <Text style={styles.scorekeeperText}>Open Scorekeeper</Text>
            </TouchableOpacity>
          )}
        </View>

        {renderRoster(gameDetail.homeRoster, gameDetail.homeTeam)}
        {renderRoster(gameDetail.awayRoster, gameDetail.awayTeam)}
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
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  division: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 12,
  },
  score: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  vs: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
    marginHorizontal: 20,
  },
  gameMetaData: {
    gap: 12,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  scorekeeperButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  scorekeeperText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  rosterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rosterTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  rosterList: {
    gap: 12,
  },
  playerItem: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
});