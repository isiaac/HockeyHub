import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Target, Clock, Award, Users, Trophy, Medal, Crown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface PlayerStats {
  id: string;
  name: string;
  position: string;
  team: string;
  games: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  shootingPercentage: number;
}

interface TeamStats {
  wins: number;
  losses: number;
  ties: number;
  goalsFor: number;
  goalsAgainst: number;
  powerPlayPercent: number;
  penaltyKillPercent: number;
  shotsFor: number;
  shotsAgainst: number;
  faceoffPercent: number;
}

interface LeagueTeam {
  id: string;
  name: string;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifferential: number;
  gamesPlayed: number;
  streak: string;
  lastGame: string;
}

interface LeaguePlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  points: number;
  goals: number;
  assists: number;
  gamesPlayed: number;
  pointsPerGame: number;
  penaltyMinutes: number;
  savePercentage?: number;
  saves?: number;
  shotsAgainst?: number;
}

const mockPlayerStats: PlayerStats[] = [
  { id: '1', name: 'Alex Chen', position: 'C', team: 'Ice Wolves', games: 15, goals: 12, assists: 18, points: 30, plusMinus: 8, pim: 6, shootingPercentage: 26.7 },
  { id: '2', name: 'Morgan Davis', position: 'RW', team: 'Ice Wolves', games: 15, goals: 8, assists: 12, points: 20, plusMinus: 5, pim: 12, shootingPercentage: 22.2 },
  { id: '3', name: 'Jordan Smith', position: 'D', team: 'Ice Wolves', games: 14, goals: 3, assists: 15, points: 18, plusMinus: 12, pim: 8, shootingPercentage: 15.8 },
  { id: '4', name: 'Casey Brown', position: 'G', team: 'Ice Wolves', games: 10, goals: 0, assists: 2, points: 2, plusMinus: 0, pim: 0, shootingPercentage: 0 },
  { id: '5', name: 'Sam Wilson', position: 'LW', team: 'Ice Wolves', games: 13, goals: 7, assists: 9, points: 16, plusMinus: 3, pim: 4, shootingPercentage: 19.4 },
];

const teamStats: TeamStats = {
  wins: 12,
  losses: 3,
  ties: 0,
  goalsFor: 68,
  goalsAgainst: 32,
  powerPlayPercent: 24.5,
  penaltyKillPercent: 87.3,
  shotsFor: 456,
  shotsAgainst: 378,
  faceoffPercent: 52.8,
};

const mockLeagueTeams: LeagueTeam[] = [
  { id: '1', name: 'Ice Wolves', wins: 12, losses: 3, ties: 0, points: 24, goalsFor: 68, goalsAgainst: 32, goalDifferential: 36, gamesPlayed: 15, streak: 'W3', lastGame: '4-1 vs Thunder Hawks' },
  { id: '2', name: 'Storm Riders', wins: 11, losses: 4, ties: 0, points: 22, goalsFor: 62, goalsAgainst: 38, goalDifferential: 24, gamesPlayed: 15, streak: 'W1', lastGame: '3-2 vs Lightning' },
  { id: '3', name: 'Thunder Hawks', wins: 9, losses: 5, ties: 1, points: 19, goalsFor: 55, goalsAgainst: 45, goalDifferential: 10, gamesPlayed: 15, streak: 'L2', lastGame: '1-4 vs Ice Wolves' },
  { id: '4', name: 'Lightning Bolts', wins: 8, losses: 6, ties: 1, points: 17, goalsFor: 48, goalsAgainst: 52, goalDifferential: -4, gamesPlayed: 15, streak: 'L1', lastGame: '2-3 vs Storm Riders' },
  { id: '5', name: 'Frost Giants', wins: 6, losses: 8, ties: 1, points: 13, goalsFor: 42, goalsAgainst: 58, goalDifferential: -16, gamesPlayed: 15, streak: 'W1', lastGame: '3-1 vs Fire Hawks' },
  { id: '6', name: 'Fire Hawks', wins: 4, losses: 10, ties: 1, points: 9, goalsFor: 35, goalsAgainst: 65, goalDifferential: -30, gamesPlayed: 15, streak: 'L4', lastGame: '1-3 vs Frost Giants' },
];

const mockLeaguePlayers: LeaguePlayer[] = [
  { id: '1', name: 'Alex Chen', team: 'Ice Wolves', position: 'C', points: 30, goals: 12, assists: 18, gamesPlayed: 15, pointsPerGame: 2.0, penaltyMinutes: 6 },
  { id: '2', name: 'Mike Johnson', team: 'Storm Riders', position: 'LW', points: 28, goals: 15, assists: 13, gamesPlayed: 15, pointsPerGame: 1.87, penaltyMinutes: 12 },
  { id: '3', name: 'Sarah Lee', team: 'Thunder Hawks', position: 'C', points: 25, goals: 11, assists: 14, gamesPlayed: 15, pointsPerGame: 1.67, penaltyMinutes: 8 },
  { id: '4', name: 'Tom Anderson', team: 'Lightning Bolts', position: 'RW', points: 23, goals: 13, assists: 10, gamesPlayed: 15, pointsPerGame: 1.53, penaltyMinutes: 4 },
  { id: '5', name: 'Morgan Davis', team: 'Ice Wolves', position: 'RW', points: 20, goals: 8, assists: 12, gamesPlayed: 15, pointsPerGame: 1.33, penaltyMinutes: 2 },
  { id: '6', name: 'Lisa Park', team: 'Storm Riders', position: 'D', points: 19, goals: 4, assists: 15, gamesPlayed: 15, pointsPerGame: 1.27, penaltyMinutes: 18 },
  { id: '7', name: 'Chris Taylor', team: 'Thunder Hawks', position: 'LW', points: 18, goals: 9, assists: 9, gamesPlayed: 14, pointsPerGame: 1.29, penaltyMinutes: 14 },
  { id: '8', name: 'Jordan Smith', team: 'Ice Wolves', position: 'D', points: 18, goals: 3, assists: 15, gamesPlayed: 14, pointsPerGame: 1.29, penaltyMinutes: 10 },
  { id: '9', name: 'Casey Brown', team: 'Ice Wolves', position: 'G', points: 2, goals: 0, assists: 2, gamesPlayed: 12, pointsPerGame: 0.17, penaltyMinutes: 0, savePercentage: 92.5, saves: 342, shotsAgainst: 370 },
  { id: '10', name: 'Jamie Wilson', team: 'Thunder Hawks', position: 'G', points: 1, goals: 0, assists: 1, gamesPlayed: 10, pointsPerGame: 0.1, penaltyMinutes: 2, savePercentage: 89.8, saves: 298, shotsAgainst: 332 },
  { id: '11', name: 'Pat Martinez', team: 'Storm Riders', position: 'G', points: 0, goals: 0, assists: 0, gamesPlayed: 8, pointsPerGame: 0, penaltyMinutes: 0, savePercentage: 91.2, saves: 256, shotsAgainst: 281 },
  { id: '12', name: 'Danny Torres', team: 'Lightning Bolts', position: 'RW', points: 16, goals: 7, assists: 9, gamesPlayed: 13, pointsPerGame: 1.23, penaltyMinutes: 22 },
];

export default function StatsScreen() {
  const [activeView, setActiveView] = useState<'team' | 'player' | 'league'>('team');
  const [playerStats] = useState<PlayerStats[]>(mockPlayerStats);
  const [leagueTeams] = useState<LeagueTeam[]>(mockLeagueTeams);
  const [leaguePlayers] = useState<LeaguePlayer[]>(mockLeaguePlayers);
  const [leagueView, setLeagueView] = useState<'standings' | 'scoring'>('standings');
  const [scoringCategory, setScoringCategory] = useState<'points' | 'goals' | 'assists' | 'penalties' | 'goalies'>('points');
  const [playerSortBy, setPlayerSortBy] = useState<'points' | 'goals' | 'assists' | 'games' | 'name'>('points');
  const [playerSortOrder, setPlayerSortOrder] = useState<'asc' | 'desc'>('desc');
  const [teamSortBy, setTeamSortBy] = useState<'points' | 'wins' | 'goalDiff' | 'name'>('points');
  const [teamSortOrder, setTeamSortOrder] = useState<'asc' | 'desc'>('desc');

  const winPercentage = Math.round((teamStats.wins / (teamStats.wins + teamStats.losses + teamStats.ties)) * 100);
  const currentTeam = leagueTeams.find(team => team.name === 'Ice Wolves');
  const currentRank = leagueTeams.findIndex(team => team.name === 'Ice Wolves') + 1;

  const sortPlayerStats = (stats: PlayerStats[]) => {
    return [...stats].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (playerSortBy) {
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'goals':
          aValue = a.goals;
          bValue = b.goals;
          break;
        case 'assists':
          aValue = a.assists;
          bValue = b.assists;
          break;
        case 'games':
          aValue = a.games;
          bValue = b.games;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          aValue = a.points;
          bValue = b.points;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return playerSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return playerSortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });
  };

  const sortLeagueTeams = (teams: LeagueTeam[]) => {
    return [...teams].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (teamSortBy) {
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'wins':
          aValue = a.wins;
          bValue = b.wins;
          break;
        case 'goalDiff':
          aValue = a.goalDifferential;
          bValue = b.goalDifferential;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          aValue = a.points;
          bValue = b.points;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return teamSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return teamSortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });
  };

  const togglePlayerSort = (sortBy: typeof playerSortBy) => {
    if (playerSortBy === sortBy) {
      setPlayerSortOrder(playerSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setPlayerSortBy(sortBy);
      setPlayerSortOrder('desc');
    }
  };

  const toggleTeamSort = (sortBy: typeof teamSortBy) => {
    if (teamSortBy === sortBy) {
      setTeamSortOrder(teamSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setTeamSortBy(sortBy);
      setTeamSortOrder('desc');
    }
  };

  const getSortIcon = (currentSort: string, targetSort: string, order: 'asc' | 'desc') => {
    if (currentSort !== targetSort) {
      return <ArrowUpDown size={14} color="#94A3B8" />;
    }
    return order === 'asc' ? <ArrowUp size={14} color="#0EA5E9" /> : <ArrowDown size={14} color="#0EA5E9" />;
  };
  const renderStatCard = (icon: React.ReactNode, title: string, value: string, subtitle?: string, color?: string) => (
    <View style={[styles.statCard, isTablet && styles.tabletStatCard]}>
      <View style={[styles.statIcon, color && { backgroundColor: color }]}>{icon}</View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderPlayerRow = (player: PlayerStats, index: number) => (
    <View key={player.id} style={[styles.playerRow, index === 0 && styles.topPlayer]}>
      <View style={styles.playerRank}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <TouchableOpacity 
        style={styles.playerInfo}
        onPress={() => router.push(`/player-profile?playerId=${player.id}`)}
      >
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerPosition}>{player.position}</Text>
      </TouchableOpacity>
      <View style={styles.playerStatsRow}>
        <Text style={styles.playerStat}>{player.goals}G</Text>
        <Text style={styles.playerStat}>{player.assists}A</Text>
        <Text style={[styles.playerStat, styles.pointsStat]}>{player.points}P</Text>
        <Text style={styles.playerStat}>{player.shootingPercentage}%</Text>
      </View>
    </View>
  );

  const renderLeagueTeamRow = (team: LeagueTeam, index: number) => (
    <View key={team.id} style={[styles.leagueRow, team.name === 'Ice Wolves' && styles.currentTeamRow]}>
      <View style={styles.rankContainer}>
        {index < 3 && (
          <View style={[styles.medalIcon, index === 0 && styles.goldMedal, index === 1 && styles.silverMedal, index === 2 && styles.bronzeMedal]}>
            {index === 0 ? <Crown size={16} color="#FFFFFF" /> : <Medal size={16} color="#FFFFFF" />}
          </View>
        )}
        <Text style={[styles.rankNumber, team.name === 'Ice Wolves' && styles.currentTeamRank]}>{index + 1}</Text>
      </View>
      <View style={styles.teamInfo}>
        <Text style={[styles.teamName, team.name === 'Ice Wolves' && styles.currentTeamName]}>{team.name}</Text>
        <Text style={styles.teamRecord}>{team.wins}W-{team.losses}L-{team.ties}T</Text>
      </View>
      <View style={styles.teamStatsRow}>
        <Text style={styles.teamStat}>{team.points}pts</Text>
        <Text style={styles.teamStat}>{team.goalDifferential > 0 ? '+' : ''}{team.goalDifferential}</Text>
        <Text style={[styles.teamStat, team.streak.startsWith('W') ? styles.winStreak : styles.loseStreak]}>
          {team.streak}
        </Text>
      </View>
    </View>
  );

  const renderLeaguePlayerRow = (player: LeaguePlayer, index: number) => (
    <View key={player.id} style={[styles.leagueRow, player.team === 'Ice Wolves' && styles.currentTeamRow]}>
      <View style={styles.rankContainer}>
        {index < 3 && (
          <View style={[styles.medalIcon, index === 0 && styles.goldMedal, index === 1 && styles.silverMedal, index === 2 && styles.bronzeMedal]}>
            {index === 0 ? <Crown size={16} color="#FFFFFF" /> : <Medal size={16} color="#FFFFFF" />}
          </View>
        )}
        <Text style={[styles.rankNumber, player.team === 'Ice Wolves' && styles.currentTeamRank]}>{index + 1}</Text>
      </View>
      <TouchableOpacity 
        style={styles.playerInfo}
        onPress={() => router.push(`/player-profile?playerId=${player.id}`)}
      >
        <Text style={[styles.playerName, player.team === 'Ice Wolves' && styles.currentTeamName]}>{player.name}</Text>
        <Text style={styles.playerTeam}>{player.team} • {player.position}</Text>
      </TouchableOpacity>
      <View style={styles.playerStatsRow}>
        {scoringCategory === 'points' && (
          <>
            <Text style={styles.playerStat}>{player.goals}G</Text>
            <Text style={styles.playerStat}>{player.assists}A</Text>
            <Text style={[styles.playerStat, styles.pointsStat]}>{player.points}P</Text>
            <Text style={styles.playerStat}>{player.pointsPerGame.toFixed(2)}</Text>
          </>
        )}
        {scoringCategory === 'goals' && (
          <>
            <Text style={[styles.playerStat, styles.pointsStat]}>{player.goals}</Text>
            <Text style={styles.playerStat}>Goals</Text>
            <Text style={styles.playerStat}>{player.gamesPlayed}GP</Text>
            <Text style={styles.playerStat}>{(player.goals / player.gamesPlayed).toFixed(2)}</Text>
          </>
        )}
        {scoringCategory === 'assists' && (
          <>
            <Text style={[styles.playerStat, styles.pointsStat]}>{player.assists}</Text>
            <Text style={styles.playerStat}>Assists</Text>
            <Text style={styles.playerStat}>{player.gamesPlayed}GP</Text>
            <Text style={styles.playerStat}>{(player.assists / player.gamesPlayed).toFixed(2)}</Text>
          </>
        )}
        {scoringCategory === 'penalties' && (
          <>
            <Text style={[styles.playerStat, styles.pointsStat]}>{player.penaltyMinutes}</Text>
            <Text style={styles.playerStat}>PIM</Text>
            <Text style={styles.playerStat}>{player.gamesPlayed}GP</Text>
            <Text style={styles.playerStat}>{(player.penaltyMinutes / player.gamesPlayed).toFixed(1)}</Text>
          </>
        )}
        {scoringCategory === 'goalies' && player.savePercentage && (
          <>
            <Text style={[styles.playerStat, styles.pointsStat]}>{player.savePercentage}%</Text>
            <Text style={styles.playerStat}>{player.saves}SV</Text>
            <Text style={styles.playerStat}>{player.shotsAgainst}SA</Text>
            <Text style={styles.playerStat}>{player.gamesPlayed}GP</Text>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeView === 'team' && styles.activeTab]}
          onPress={() => setActiveView('team')}
        >
          <TrendingUp size={20} color={activeView === 'team' ? '#0EA5E9' : '#64748B'} />
          <Text style={[styles.tabText, activeView === 'team' && styles.activeTabText]}>Team Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeView === 'player' && styles.activeTab]}
          onPress={() => setActiveView('player')}
        >
          <Award size={20} color={activeView === 'player' ? '#0EA5E9' : '#64748B'} />
          <Text style={[styles.tabText, activeView === 'player' && styles.activeTabText]}>Player Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeView === 'league' && styles.activeTab]}
          onPress={() => setActiveView('league')}
        >
          <Trophy size={20} color={activeView === 'league' ? '#0EA5E9' : '#64748B'} />
          <Text style={[styles.tabText, activeView === 'league' && styles.activeTabText]}>League Rankings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeView === 'team' && (
          <>
            <View style={styles.recordCard}>
              <Text style={styles.recordTitle}>Season Record</Text>
              <Text style={styles.recordText}>{teamStats.wins}W - {teamStats.losses}L - {teamStats.ties}T</Text>
              <Text style={styles.winPercentage}>{winPercentage}% Win Rate</Text>
              {currentTeam && (
                <View style={styles.leaguePosition}>
                  <Trophy size={16} color="#F59E0B" />
                  <Text style={styles.leaguePositionText}>#{currentRank} in Division A</Text>
                </View>
              )}
            </View>

            <View style={isTablet ? styles.statsGrid : styles.statsColumn}>
              {renderStatCard(
                <Target size={24} color="#FFFFFF" />,
                'Goals For',
                teamStats.goalsFor.toString(),
                `${(teamStats.goalsFor / (teamStats.wins + teamStats.losses)).toFixed(1)} per game`,
                '#0EA5E9'
              )}
              {renderStatCard(
                <Target size={24} color="#FFFFFF" />,
                'Goals Against',
                teamStats.goalsAgainst.toString(),
                `${(teamStats.goalsAgainst / (teamStats.wins + teamStats.losses)).toFixed(1)} per game`,
                '#EF4444'
              )}
              {renderStatCard(
                <TrendingUp size={24} color="#FFFFFF" />,
                'Power Play',
                `${teamStats.powerPlayPercent}%`,
                'Success Rate',
                '#16A34A'
              )}
              {renderStatCard(
                <Award size={24} color="#FFFFFF" />,
                'Penalty Kill',
                `${teamStats.penaltyKillPercent}%`,
                'Success Rate',
                '#7C3AED'
              )}
              {renderStatCard(
                <Target size={24} color="#FFFFFF" />,
                'Shot Differential',
                `+${teamStats.shotsFor - teamStats.shotsAgainst}`,
                `${teamStats.shotsFor} for, ${teamStats.shotsAgainst} against`,
                '#F59E0B'
              )}
              {renderStatCard(
                <Users size={24} color="#FFFFFF" />,
                'Faceoff %',
                `${teamStats.faceoffPercent}%`,
                'Win Percentage',
                '#8B5CF6'
              )}
            </View>
          </>
        )}

        {activeView === 'player' && (
          <View style={styles.playerStatsContainer}>
            <Text style={styles.sectionTitle}>Team Player Statistics</Text>
            <View style={styles.sortControls}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <TouchableOpacity 
                style={[styles.sortButton, playerSortBy === 'points' && styles.activeSortButton]}
                onPress={() => togglePlayerSort('points')}
              >
                <Text style={[styles.sortButtonText, playerSortBy === 'points' && styles.activeSortButtonText]}>Points</Text>
                {getSortIcon(playerSortBy, 'points', playerSortOrder)}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortButton, playerSortBy === 'goals' && styles.activeSortButton]}
                onPress={() => togglePlayerSort('goals')}
              >
                <Text style={[styles.sortButtonText, playerSortBy === 'goals' && styles.activeSortButtonText]}>Goals</Text>
                {getSortIcon(playerSortBy, 'goals', playerSortOrder)}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortButton, playerSortBy === 'assists' && styles.activeSortButton]}
                onPress={() => togglePlayerSort('assists')}
              >
                <Text style={[styles.sortButtonText, playerSortBy === 'assists' && styles.activeSortButtonText]}>Assists</Text>
                {getSortIcon(playerSortBy, 'assists', playerSortOrder)}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortButton, playerSortBy === 'name' && styles.activeSortButton]}
                onPress={() => togglePlayerSort('name')}
              >
                <Text style={[styles.sortButtonText, playerSortBy === 'name' && styles.activeSortButtonText]}>Name</Text>
                {getSortIcon(playerSortBy, 'name', playerSortOrder)}
              </TouchableOpacity>
            </View>
            <View style={styles.playersList}>
              <View style={styles.statsHeader}>
                <Text style={styles.headerText}>Player</Text>
                <Text style={styles.headerText}>Stats</Text>
              </View>
              {sortPlayerStats(playerStats)
                .map((player, index) => renderPlayerRow(player, index))}
            </View>
          </View>
        )}

        {activeView === 'league' && (
          <>
            <View style={styles.leagueHeader}>
              <Text style={styles.sectionTitle}>Division A Rankings</Text>
              <View style={styles.leagueToggle}>
                <TouchableOpacity
                  style={[styles.toggleButton, leagueView === 'standings' && styles.activeToggle]}
                  onPress={() => setLeagueView('standings')}
                >
                  <Text style={[styles.toggleText, leagueView === 'standings' && styles.activeToggleText]}>
                    Standings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, leagueView === 'scoring' && styles.activeToggle]}
                  onPress={() => setLeagueView('scoring')}
                >
                  <Text style={[styles.toggleText, leagueView === 'scoring' && styles.activeToggleText]}>
                    Player Leaders
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {leagueView === 'scoring' && (
              <View style={styles.scoringCategories}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryButtons}>
                    <TouchableOpacity
                      style={[styles.categoryButton, scoringCategory === 'points' && styles.activeCategoryButton]}
                      onPress={() => setScoringCategory('points')}
                    >
                      <Text style={[styles.categoryButtonText, scoringCategory === 'points' && styles.activeCategoryButtonText]}>
                        Points
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.categoryButton, scoringCategory === 'goals' && styles.activeCategoryButton]}
                      onPress={() => setScoringCategory('goals')}
                    >
                      <Text style={[styles.categoryButtonText, scoringCategory === 'goals' && styles.activeCategoryButtonText]}>
                        Goals
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.categoryButton, scoringCategory === 'assists' && styles.activeCategoryButton]}
                      onPress={() => setScoringCategory('assists')}
                    >
                      <Text style={[styles.categoryButtonText, scoringCategory === 'assists' && styles.activeCategoryButtonText]}>
                        Assists
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.categoryButton, scoringCategory === 'penalties' && styles.activeCategoryButton]}
                      onPress={() => setScoringCategory('penalties')}
                    >
                      <Text style={[styles.categoryButtonText, scoringCategory === 'penalties' && styles.activeCategoryButtonText]}>
                        Penalty Minutes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.categoryButton, scoringCategory === 'goalies' && styles.activeCategoryButton]}
                      onPress={() => setScoringCategory('goalies')}
                    >
                      <Text style={[styles.categoryButtonText, scoringCategory === 'goalies' && styles.activeCategoryButtonText]}>
                        Goalie Leaders
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}
            {leagueView === 'standings' ? (
              <View style={styles.standingsContainer}>
                <View style={styles.sortControls}>
                  <Text style={styles.sortLabel}>Sort by:</Text>
                  <TouchableOpacity 
                    style={[styles.sortButton, teamSortBy === 'points' && styles.activeSortButton]}
                    onPress={() => toggleTeamSort('points')}
                  >
                    <Text style={[styles.sortButtonText, teamSortBy === 'points' && styles.activeSortButtonText]}>Points</Text>
                    {getSortIcon(teamSortBy, 'points', teamSortOrder)}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sortButton, teamSortBy === 'wins' && styles.activeSortButton]}
                    onPress={() => toggleTeamSort('wins')}
                  >
                    <Text style={[styles.sortButtonText, teamSortBy === 'wins' && styles.activeSortButtonText]}>Wins</Text>
                    {getSortIcon(teamSortBy, 'wins', teamSortOrder)}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sortButton, teamSortBy === 'goalDiff' && styles.activeSortButton]}
                    onPress={() => toggleTeamSort('goalDiff')}
                  >
                    <Text style={[styles.sortButtonText, teamSortBy === 'goalDiff' && styles.activeSortButtonText]}>Goal Diff</Text>
                    {getSortIcon(teamSortBy, 'goalDiff', teamSortOrder)}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sortButton, teamSortBy === 'name' && styles.activeSortButton]}
                    onPress={() => toggleTeamSort('name')}
                  >
                    <Text style={[styles.sortButtonText, teamSortBy === 'name' && styles.activeSortButtonText]}>Name</Text>
                    {getSortIcon(teamSortBy, 'name', teamSortOrder)}
                  </TouchableOpacity>
                </View>
                <View style={styles.standingsHeader}>
                  <Text style={styles.standingsHeaderText}>Team</Text>
                  <Text style={styles.standingsHeaderText}>Record</Text>
                  <Text style={styles.standingsHeaderText}>Stats</Text>
                </View>
                <View style={styles.standingsList}>
                  {sortLeagueTeams(mockLeagueTeams).map((team, index) => renderLeagueTeamRow(team, index))}
                </View>
              </View>
            ) : (
              <View style={styles.scoringContainer}>
                <View style={styles.scoringHeader}>
                  <Text style={styles.scoringHeaderText}>Player</Text>
                  <Text style={styles.scoringHeaderText}>
                    {scoringCategory === 'points' && 'Stats'}
                    {scoringCategory === 'goals' && 'Goals'}
                    {scoringCategory === 'assists' && 'Assists'}
                    {scoringCategory === 'penalties' && 'PIM'}
                    {scoringCategory === 'goalies' && 'Save %'}
                  </Text>
                </View>
                <View style={styles.scoringList}>
                  {mockLeaguePlayers
                    .filter(player => {
                      if (scoringCategory === 'goalies') {
                        return player.position === 'G' && player.savePercentage;
                      }
                      return scoringCategory !== 'goalies';
                    })
                    .sort((a, b) => {
                      switch (scoringCategory) {
                        case 'goals':
                          return b.goals - a.goals;
                        case 'assists':
                          return b.assists - a.assists;
                        case 'penalties':
                          return b.penaltyMinutes - a.penaltyMinutes;
                        case 'goalies':
                          return (b.savePercentage || 0) - (a.savePercentage || 0);
                        default:
                          return b.points - a.points;
                      }
                    })
                    .map((player, index) => renderLeaguePlayerRow(player, index))}
                </View>
              </View>
            )}
          </>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeTabText: {
    color: '#0EA5E9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recordTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 8,
  },
  recordText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  winPercentage: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
    marginBottom: 8,
  },
  leaguePosition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  leaguePositionText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#D97706',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statsColumn: {
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  tabletStatCard: {
    width: (width - 60) / 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#64748B',
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  playerStatsContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  playersList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#475569',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topPlayer: {
    backgroundColor: '#FEF3C7',
  },
  playerRank: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  playerTeam: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  playerStatsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  playerStat: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    minWidth: 32,
    textAlign: 'center',
  },
  pointsStat: {
    color: '#0EA5E9',
    fontSize: 16,
  },
  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leagueToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeToggleText: {
    color: '#1E293B',
  },
  standingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  standingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  standingsHeaderText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#475569',
  },
  standingsList: {
    paddingBottom: 8,
  },
  scoringContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  scoringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scoringHeaderText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#475569',
  },
  scoringList: {
    paddingBottom: 8,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  currentTeamRow: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  rankContainer: {
    width: 48,
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  medalIcon: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldMedal: {
    backgroundColor: '#F59E0B',
  },
  silverMedal: {
    backgroundColor: '#6B7280',
  },
  bronzeMedal: {
    backgroundColor: '#92400E',
  },
  currentTeamRank: {
    color: '#0EA5E9',
    fontSize: 18,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  currentTeamName: {
    color: '#0EA5E9',
    fontFamily: 'Inter-Bold',
  },
  teamRecord: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  teamStatsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  teamStat: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    minWidth: 40,
    textAlign: 'center',
  },
  winStreak: {
    color: '#16A34A',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  loseStreak: {
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoringCategories: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCategoryButton: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  sortControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    gap: 4,
  },
  activeSortButton: {
    backgroundColor: '#0EA5E9',
  },
  sortButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
});