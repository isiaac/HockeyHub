import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Users, Search, Plus, MapPin, Star, Clock, Send } from 'lucide-react-native';

export default function TeamsScreen() {
  const [activeTab, setActiveTab] = useState<'register' | 'browse'>('register');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    usaHockeyId: '',
    firstName: '',
    lastName: '',
    age: '',
    position: '',
    skillLevel: '',
    location: '',
    travelDistance: '',
    bio: '',
    availability: {
      weekdays: false,
      weekends: false,
      mornings: false,
      evenings: false,
    },
    lookingFor: {
      teams: false,
      pickupGames: false,
      coaching: false,
      training: false,
    }
  });

  const mockFreeAgents = [
    {
      id: '1',
      name: 'Alex Johnson',
      position: 'Center',
      age: 24,
      skillLevel: 'Intermediate',
      location: 'Boston, MA',
      rating: 4.5,
      availability: 'Weekends',
      bio: 'Looking for competitive team play',
      distance: '5 miles'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      position: 'Defense',
      age: 22,
      skillLevel: 'Advanced',
      location: 'Cambridge, MA',
      rating: 4.8,
      availability: 'Evenings',
      bio: 'Former college player seeking team',
      distance: '8 miles'
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      position: 'Goalie',
      age: 28,
      skillLevel: 'Expert',
      location: 'Somerville, MA',
      rating: 4.9,
      availability: 'Flexible',
      bio: 'Experienced goalie available',
      distance: '3 miles'
    }
  ];

  const handleRegister = () => {
    if (!formData.usaHockeyId || !formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Free agent profile created successfully!');
  };

  const handleContact = (playerName: string) => {
    Alert.alert('Contact Player', `Send message to ${playerName}?`);
  };

  const renderRegisterForm = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Register as Free Agent</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>USA Hockey ID *</Text>
        <TextInput
          style={styles.input}
          value={formData.usaHockeyId}
          onChangeText={(text) => setFormData({...formData, usaHockeyId: text})}
          placeholder="12345678"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => setFormData({...formData, firstName: text})}
            placeholder="John"
          />
        </View>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => setFormData({...formData, lastName: text})}
            placeholder="Smith"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({...formData, age: text})}
            placeholder="25"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Position</Text>
          <TextInput
            style={styles.input}
            value={formData.position}
            onChangeText={(text) => setFormData({...formData, position: text})}
            placeholder="Center"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Skill Level</Text>
        <View style={styles.skillButtons}>
          {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.skillButton,
                formData.skillLevel === level && styles.skillButtonActive
              ]}
              onPress={() => setFormData({...formData, skillLevel: level})}
            >
              <Text style={[
                styles.skillButtonText,
                formData.skillLevel === level && styles.skillButtonTextActive
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => setFormData({...formData, location: text})}
          placeholder="Boston, MA"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Travel Distance (miles)</Text>
        <TextInput
          style={styles.input}
          value={formData.travelDistance}
          onChangeText={(text) => setFormData({...formData, travelDistance: text})}
          placeholder="15"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.bio}
          onChangeText={(text) => setFormData({...formData, bio: text})}
          placeholder="Tell teams about your experience and what you're looking for..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Availability</Text>
        <View style={styles.checkboxGroup}>
          {[
            { key: 'weekdays', label: 'Weekdays' },
            { key: 'weekends', label: 'Weekends' },
            { key: 'mornings', label: 'Mornings' },
            { key: 'evenings', label: 'Evenings' }
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.checkboxRow}
              onPress={() => setFormData({
                ...formData,
                availability: {
                  ...formData.availability,
                  [item.key]: !formData.availability[item.key as keyof typeof formData.availability]
                }
              })}
            >
              <View style={[
                styles.checkbox,
                formData.availability[item.key as keyof typeof formData.availability] && styles.checkboxChecked
              ]}>
                {formData.availability[item.key as keyof typeof formData.availability] && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Looking For</Text>
        <View style={styles.checkboxGroup}>
          {[
            { key: 'teams', label: 'Teams' },
            { key: 'pickupGames', label: 'Pickup Games' },
            { key: 'coaching', label: 'Coaching' },
            { key: 'training', label: 'Training' }
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.checkboxRow}
              onPress={() => setFormData({
                ...formData,
                lookingFor: {
                  ...formData.lookingFor,
                  [item.key]: !formData.lookingFor[item.key as keyof typeof formData.lookingFor]
                }
              })}
            >
              <View style={[
                styles.checkbox,
                formData.lookingFor[item.key as keyof typeof formData.lookingFor] && styles.checkboxChecked
              ]}>
                {formData.lookingFor[item.key as keyof typeof formData.lookingFor] && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Plus size={20} color="white" />
        <Text style={styles.registerButtonText}>Register as Free Agent</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderBrowsePlayers = () => (
    <View style={styles.browseContainer}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by position, skill level, location..."
        />
      </View>

      <ScrollView style={styles.playersList}>
        {mockFreeAgents
          .filter(player => 
            player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.playerHeader}>
                <View style={styles.playerAvatar}>
                  <Text style={styles.playerInitials}>
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerDetails}>
                    {player.position} • Age {player.age} • {player.skillLevel}
                  </Text>
                  <View style={styles.locationRow}>
                    <MapPin size={14} color="#666" />
                    <Text style={styles.locationText}>{player.location} • {player.distance}</Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{player.rating}</Text>
                </View>
              </View>
              
              <Text style={styles.playerBio}>{player.bio}</Text>
              
              <View style={styles.availabilityRow}>
                <Clock size={14} color="#666" />
                <Text style={styles.availabilityText}>{player.availability}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContact(player.name)}
              >
                <Send size={16} color="white" />
                <Text style={styles.contactButtonText}>Contact Player</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Users size={24} color="#333" />
        <Text style={styles.headerTitle}>Free Agents</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'register' && styles.activeTab]}
          onPress={() => setActiveTab('register')}
        >
          <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>
            Register
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
            Browse Players
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'register' ? renderRegisterForm() : renderBrowsePlayers()}
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
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#dc2626',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  skillButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  skillButtonActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  skillButtonText: {
    fontSize: 14,
    color: '#666',
  },
  skillButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  browseContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  playersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  playerDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  playerBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  availabilityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  contactButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});