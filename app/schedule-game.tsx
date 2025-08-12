import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Trophy, Save, Plus, Minus } from 'lucide-react-native';

interface GameForm {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  division: string;
  referees: string[];
  notes: string;
  isPlayoff: boolean;
  gameType: 'regular' | 'playoff' | 'exhibition' | 'tournament';
}

const gameTypes = [
  { value: 'regular', label: 'Regular Season' },
  { value: 'playoff', label: 'Playoff Game' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'tournament', label: 'Tournament' },
];

const mockTeams = [
  'Ice Wolves',
  'Thunder Hawks', 
  'Storm Riders',
  'Lightning Bolts',
  'Frost Giants',
  'Fire Hawks',
  'Blue Devils',
  'Steel Sharks',
];

const mockVenues = [
  'Central Ice Arena',
  'North Rink Complex',
  'East Side Ice Center',
  'Community Ice Rink',
  'Metro Hockey Center',
  'Riverside Ice Facility',
];

export default function ScheduleGameScreen() {
  const [formData, setFormData] = useState<GameForm>({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    venue: '',
    division: '',
    referees: [''],
    notes: '',
    isPlayoff: false,
    gameType: 'regular',
  });

  const [showTeamDropdown, setShowTeamDropdown] = useState<'home' | 'away' | null>(null);
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);

  const addReferee = () => {
    if (formData.referees.length < 3) {
      setFormData(prev => ({
        ...prev,
        referees: [...prev.referees, '']
      }));
    }
  };

  const removeReferee = (index: number) => {
    if (formData.referees.length > 1) {
      setFormData(prev => ({
        ...prev,
        referees: prev.referees.filter((_, i) => i !== index)
      }));
    }
  };

  const updateReferee = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      referees: prev.referees.map((ref, i) => i === index ? value : ref)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.homeTeam.trim()) {
      Alert.alert('Error', 'Home team is required');
      return false;
    }
    if (!formData.awayTeam.trim()) {
      Alert.alert('Error', 'Away team is required');
      return false;
    }
    if (formData.homeTeam === formData.awayTeam) {
      Alert.alert('Error', 'Home and away teams must be different');
      return false;
    }
    if (!formData.date.trim()) {
      Alert.alert('Error', 'Game date is required');
      return false;
    }
    if (!formData.time.trim()) {
      Alert.alert('Error', 'Game time is required');
      return false;
    }
    if (!formData.venue.trim()) {
      Alert.alert('Error', 'Venue is required');
      return false;
    }
    return true;
  };

  const handleScheduleGame = () => {
    if (!validateForm()) return;

    Alert.alert(
      'Game Scheduled',
      `${formData.homeTeam} vs ${formData.awayTeam} has been scheduled for ${formData.date} at ${formData.time}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const selectTeam = (team: string, type: 'home' | 'away') => {
    setFormData(prev => ({
      ...prev,
      [type === 'home' ? 'homeTeam' : 'awayTeam']: team
    }));
    setShowTeamDropdown(null);
  };

  const selectVenue = (venue: string) => {
    setFormData(prev => ({ ...prev, venue }));
    setShowVenueDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Game</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleScheduleGame}>
          <Save size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Manual Game Scheduling</Text>
          <Text style={styles.introDescription}>
            Schedule games for independent teams not managed by ice rinks. Perfect for organizing tournaments, exhibitions, or league games.
          </Text>
        </View>

        {/* Game Type Selection */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Game Type</Text>
          <View style={styles.gameTypeSelector}>
            {gameTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.gameTypeButton,
                  formData.gameType === type.value && styles.selectedGameType
                ]}
                onPress={() => setFormData(prev => ({ ...prev, gameType: type.value as any }))}
              >
                <Text style={[
                  styles.gameTypeText,
                  formData.gameType === type.value && styles.selectedGameTypeText
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Teams Selection */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Teams</Text>
          
          <View style={styles.teamsRow}>
            <View style={styles.teamSelector}>
              <Text style={styles.inputLabel}>Home Team *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowTeamDropdown(showTeamDropdown === 'home' ? null : 'home')}
              >
                <Text style={[styles.dropdownText, !formData.homeTeam && styles.placeholderText]}>
                  {formData.homeTeam || 'Select home team'}
                </Text>
              </TouchableOpacity>
              
              {showTeamDropdown === 'home' && (
                <View style={styles.dropdown}>
                  {mockTeams
                    .filter(team => team !== formData.awayTeam)
                    .map((team) => (
                      <TouchableOpacity
                        key={team}
                        style={styles.dropdownItem}
                        onPress={() => selectTeam(team, 'home')}
                      >
                        <Text style={styles.dropdownItemText}>{team}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>

            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.teamSelector}>
              <Text style={styles.inputLabel}>Away Team *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowTeamDropdown(showTeamDropdown === 'away' ? null : 'away')}
              >
                <Text style={[styles.dropdownText, !formData.awayTeam && styles.placeholderText]}>
                  {formData.awayTeam || 'Select away team'}
                </Text>
              </TouchableOpacity>
              
              {showTeamDropdown === 'away' && (
                <View style={styles.dropdown}>
                  {mockTeams
                    .filter(team => team !== formData.homeTeam)
                    .map((team) => (
                      <TouchableOpacity
                        key={team}
                        style={styles.dropdownItem}
                        onPress={() => selectTeam(team, 'away')}
                      >
                        <Text style={styles.dropdownItemText}>{team}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Date *</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={20} color="#64748B" />
                <TextInput
                  style={styles.inputField}
                  value={formData.date}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                  placeholder="2025-01-20"
                />
              </View>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Time *</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={20} color="#64748B" />
                <TextInput
                  style={styles.inputField}
                  value={formData.time}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
                  placeholder="7:00 PM"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Venue Selection */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Venue</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Venue *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowVenueDropdown(!showVenueDropdown)}
            >
              <MapPin size={20} color="#64748B" />
              <Text style={[styles.dropdownText, !formData.venue && styles.placeholderText]}>
                {formData.venue || 'Select venue'}
              </Text>
            </TouchableOpacity>
            
            {showVenueDropdown && (
              <View style={styles.dropdown}>
                {mockVenues.map((venue) => (
                  <TouchableOpacity
                    key={venue}
                    style={styles.dropdownItem}
                    onPress={() => selectVenue(venue)}
                  >
                    <Text style={styles.dropdownItemText}>{venue}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.dropdownItem, styles.customVenueItem]}
                  onPress={() => {
                    setShowVenueDropdown(false);
                    // In production, this would open a custom venue input
                    Alert.alert('Custom Venue', 'Custom venue entry coming soon');
                  }}
                >
                  <Plus size={16} color="#0EA5E9" />
                  <Text style={styles.customVenueText}>Add Custom Venue</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Division</Text>
            <TextInput
              style={styles.input}
              value={formData.division}
              onChangeText={(text) => setFormData(prev => ({ ...prev, division: text }))}
              placeholder="Division A, Adult Rec, etc."
            />
          </View>
        </View>

        {/* Officials */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Officials</Text>
          
          {formData.referees.map((referee, index) => (
            <View key={index} style={styles.refereeRow}>
              <TextInput
                style={styles.refereeInput}
                value={referee}
                onChangeText={(text) => updateReferee(index, text)}
                placeholder={`Referee ${index + 1} name`}
              />
              {formData.referees.length > 1 && (
                <TouchableOpacity onPress={() => removeReferee(index)}>
                  <Minus size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          {formData.referees.length < 3 && (
            <TouchableOpacity style={styles.addRefereeButton} onPress={addReferee}>
              <Plus size={16} color="#0EA5E9" />
              <Text style={styles.addRefereeText}>Add Referee</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Additional Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Game Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Special instructions, equipment needs, etc."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Schedule Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleGame}>
            <Trophy size={20} color="#FFFFFF" />
            <Text style={styles.scheduleButtonText}>Schedule Game</Text>
          </TouchableOpacity>
          
          <Text style={styles.submitNote}>
            This game will be added to your team's schedule and both teams will be notified.
          </Text>
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
  saveButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  introSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  introTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 24,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  gameTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gameTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedGameType: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  gameTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  selectedGameTypeText: {
    color: '#FFFFFF',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  teamSelector: {
    flex: 1,
    position: 'relative',
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  vsText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  customVenueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
  },
  customVenueText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  refereeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  refereeInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  addRefereeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  addRefereeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  submitSection: {
    marginBottom: 40,
  },
  scheduleButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  scheduleButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  submitNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});