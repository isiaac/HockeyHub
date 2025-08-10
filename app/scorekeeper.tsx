import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus, Minus, Clock, Users, ArrowLeft } from 'lucide-react-native';

interface GameState {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  period: number;
  timeRemaining: string;
  homePenalties: number;
  awayPenalties: number;
}

export default function ScorekeeperScreen() {
  const { gameId } = useLocalSearchParams();
  const [gameState, setGameState] = useState<GameState>({
    homeTeam: 'Ice Wolves',
    awayTeam: 'Thunder Hawks',
    homeScore: 2,
    awayScore: 1,
    period: 2,
    timeRemaining: '12:45',
    homePenalties: 1,
    awayPenalties: 0,
  });

  const updateScore = (team: 'home' | 'away', change: number) => {
    setGameState(prev => ({
      ...prev,
      [team === 'home' ? 'homeScore' : 'awayScore']: Math.max(0, prev[team === 'home' ? 'homeScore' : 'awayScore'] + change)
    }));
  };

  const updatePenalty = (team: 'home' | 'away', change: number) => {
    setGameState(prev => ({
      ...prev,
      [team === 'home' ? 'homePenalties' : 'awayPenalties']: Math.max(0, prev[team === 'home' ? 'homePenalties' : 'awayPenalties'] + change)
    }));
  };

  const nextPeriod = () => {
    if (gameState.period < 3) {
      setGameState(prev => ({
        ...prev,
        period: prev.period + 1,
        timeRemaining: '20:00'
      }));
    } else {
      Alert.alert('Game Over', 'This game has ended. Final score will be recorded.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scorekeeper</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.periodInfo}>
          <Text style={styles.periodLabel}>Period {gameState.period}</Text>
          <View style={styles.timeContainer}>
            <Clock size={20} color="#0EA5E9" />
            <Text style={styles.timeText}>{gameState.timeRemaining}</Text>
          </View>
        </View>
      </View>

      <View style={styles.scoreboard}>
        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{gameState.homeTeam}</Text>
          <Text style={styles.homeLabel}>HOME</Text>
          
          <View style={styles.scoreContainer}>
            <TouchableOpacity 
              style={styles.scoreButton}
              onPress={() => updateScore('home', -1)}
            >
              <Minus size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.score}>{gameState.homeScore}</Text>
            
            <TouchableOpacity 
              style={styles.scoreButton}
              onPress={() => updateScore('home', 1)}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.penaltySection}>
            <Text style={styles.penaltyLabel}>Penalties</Text>
            <View style={styles.penaltyControls}>
              <TouchableOpacity 
                style={styles.penaltyButton}
                onPress={() => updatePenalty('home', -1)}
              >
                <Minus size={16} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.penaltyCount}>{gameState.homePenalties}</Text>
              <TouchableOpacity 
                style={styles.penaltyButton}
                onPress={() => updatePenalty('home', 1)}
              >
                <Plus size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{gameState.awayTeam}</Text>
          <Text style={styles.awayLabel}>AWAY</Text>
          
          <View style={styles.scoreContainer}>
            <TouchableOpacity 
              style={styles.scoreButton}
              onPress={() => updateScore('away', -1)}
            >
              <Minus size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.score}>{gameState.awayScore}</Text>
            
            <TouchableOpacity 
              style={styles.scoreButton}
              onPress={() => updateScore('away', 1)}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.penaltySection}>
            <Text style={styles.penaltyLabel}>Penalties</Text>
            <View style={styles.penaltyControls}>
              <TouchableOpacity 
                style={styles.penaltyButton}
                onPress={() => updatePenalty('away', -1)}
              >
                <Minus size={16} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.penaltyCount}>{gameState.awayPenalties}</Text>
              <TouchableOpacity 
                style={styles.penaltyButton}
                onPress={() => updatePenalty('away', 1)}
              >
                <Plus size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.nextPeriodButton} onPress={nextPeriod}>
          <Text style={styles.nextPeriodText}>
            {gameState.period < 3 ? `Start Period ${gameState.period + 1}` : 'End Game'}
          </Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
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
  saveText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  gameInfo: {
    backgroundColor: '#334155',
    paddingVertical: 20,
    alignItems: 'center',
  },
  periodInfo: {
    alignItems: 'center',
    gap: 8,
  },
  periodLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  scoreboard: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  homeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
    marginBottom: 20,
  },
  awayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
  },
  scoreButton: {
    backgroundColor: '#475569',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 64,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    minWidth: 80,
    textAlign: 'center',
  },
  divider: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  vsText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  penaltySection: {
    alignItems: 'center',
  },
  penaltyLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginBottom: 12,
  },
  penaltyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  penaltyButton: {
    backgroundColor: '#FEE2E2',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  penaltyCount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'center',
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#0F172A',
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
});