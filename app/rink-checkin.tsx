import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Search, Users, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react-native';

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  team: string;
  checkedIn: boolean;
  checkInTime?: string;
}

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  rink: string;
  players: Player[];
}

export default function RinkCheckIn() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaysGames();
  }, []);

  const loadTodaysGames = async () => {
    // Mock data - replace with actual API call
    const mockGames: Game[] = [
      {
        id: '1',
        homeTeam: 'Ice Hawks',
        awayTeam: 'Thunder Bolts',
        startTime: '7:00 PM',
        rink: 'Rink A',
        players: [
          { id: '1', name: 'John Smith', jerseyNumber: 12, team: 'Ice Hawks', checkedIn: false },
          { id: '2', name: 'Mike Johnson', jerseyNumber: 8, team: 'Ice Hawks', checkedIn: true, checkInTime: '6:15 PM' },
          { id: '3', name: 'Dave Wilson', jerseyNumber: 23, team: 'Thunder Bolts', checkedIn: false },
          { id: '4', name: 'Tom Brown', jerseyNumber: 15, team: 'Thunder Bolts', checkedIn: false },
        ]
      },
      {
        id: '2',
        homeTeam: 'Storm Riders',
        awayTeam: 'Blue Devils',
        startTime: '9:00 PM',
        rink: 'Rink B',
        players: [
          { id: '5', name: 'Chris Davis', jerseyNumber: 7, team: 'Storm Riders', checkedIn: false },
          { id: '6', name: 'Alex Miller', jerseyNumber: 19, team: 'Blue Devils', checkedIn: false },
        ]
      }
    ];
    
    setGames(mockGames);
    setLoading(false);
  };

  const handleCheckIn = (playerId: string) => {
    if (!selectedGame) return;

    const updatedGames = games.map(game => {
      if (game.id === selectedGame.id) {
        const updatedPlayers = game.players.map(player => {
          if (player.id === playerId) {
            return {
              ...player,
              checkedIn: !player.checkedIn,
              checkInTime: !player.checkedIn ? new Date().toLocaleTimeString() : undefined
            };
          }
          return player;
        });
        return { ...game, players: updatedPlayers };
      }
      return game;
    });

    setGames(updatedGames);
    setSelectedGame(updatedGames.find(g => g.id === selectedGame.id) || null);
  };

  const getCheckedInCount = (game: Game) => {
    return game.players.filter(p => p.checkedIn).length;
  };

  const getTeamCheckedInCount = (game: Game, team: string) => {
    return game.players.filter(p => p.team === team && p.checkedIn).length;
  };

  const getTeamTotalCount = (game: Game, team: string) => {
    return game.players.filter(p => p.team === team).length;
  };

  const filteredPlayers = selectedGame?.players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.jerseyNumber.toString().includes(searchQuery)
  ) || [];

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading games...</Text>
      </View>
    );
  }

  if (!selectedGame) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Player Check-In</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Games</Text>
          
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => setSelectedGame(game)}
            >
              <View style={styles.gameHeader}>
                <Text style={styles.gameTitle}>
                  {game.homeTeam} vs {game.awayTeam}
                </Text>
                <Text style={styles.gameTime}>{game.startTime}</Text>
              </View>
              
              <View style={styles.gameDetails}>
                <Text style={styles.rinkText}>{game.rink}</Text>
                <View style={styles.checkInStatus}>
                  <Users size={16} color="#666" />
                  <Text style={styles.statusText}>
                    {getCheckedInCount(game)}/{game.players.length} checked in
                  </Text>
                </View>
              </View>

              <View style={styles.teamProgress}>
                <View style={styles.teamRow}>
                  <Text style={styles.teamName}>{game.homeTeam}</Text>
                  <Text style={styles.teamCount}>
                    {getTeamCheckedInCount(game, game.homeTeam)}/{getTeamTotalCount(game, game.homeTeam)}
                  </Text>
                </View>
                <View style={styles.teamRow}>
                  <Text style={styles.teamName}>{game.awayTeam}</Text>
                  <Text style={styles.teamCount}>
                    {getTeamCheckedInCount(game, game.awayTeam)}/{getTeamTotalCount(game, game.awayTeam)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedGame(null)} style={styles.backButton}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Check-In Players</Text>
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>
          {selectedGame.homeTeam} vs {selectedGame.awayTeam}
        </Text>
        <View style={styles.gameMetadata}>
          <Clock size={16} color="#666" />
          <Text style={styles.gameTime}>{selectedGame.startTime}</Text>
          <Text style={styles.rinkText}>{selectedGame.rink}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search players..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {getCheckedInCount(selectedGame)}/{selectedGame.players.length} players checked in
        </Text>
      </View>

      <ScrollView style={styles.playersList}>
        {filteredPlayers.map((player) => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerCard,
              player.checkedIn && styles.checkedInCard
            ]}
            onPress={() => handleCheckIn(player.id)}
          >
            <View style={styles.playerInfo}>
              <View style={styles.playerDetails}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerMeta}>
                  #{player.jerseyNumber} • {player.team}
                </Text>
                {player.checkInTime && (
                  <Text style={styles.checkInTime}>
                    Checked in at {player.checkInTime}
                  </Text>
                )}
              </View>
              
              <View style={styles.checkInButton}>
                {player.checkedIn ? (
                  <CheckCircle size={24} color="#4CAF50" />
                ) : (
                  <XCircle size={24} color="#ccc" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  gameTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rinkText: {
    fontSize: 14,
    color: '#666',
  },
  checkInStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  teamProgress: {
    gap: 4,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    color: '#333',
  },
  teamCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  gameInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  gameMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  progressContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  playersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  checkedInCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  playerMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  checkInTime: {
    fontSize: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  checkInButton: {
    padding: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});