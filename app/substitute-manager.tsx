import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, Users, Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, UserPlus, Phone, Mail, Calendar, Target } from 'lucide-react-native';
import { SubstitutePlayer, GameSubstitute, RingerCheck, SubstituteSearch } from '@/types/substitute';
import { SubstituteService } from '@/services/substituteService';

export default function SubstituteManagerScreen() {
  const { gameId, teamId } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [substitutes, setSubstitutes] = useState<SubstitutePlayer[]>([]);
  const [selectedSubstitute, setSelectedSubstitute] = useState<SubstitutePlayer | null>(null);
  const [ringerCheck, setRingerCheck] = useState<RingerCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRingerModal, setShowRingerModal] = useState(false);

  const searchSubstitutes = async () => {
    if (!searchQuery.trim()) {
      setSubstitutes([]);
      return;
    }

    setLoading(true);
    try {
      const searchParams: SubstituteSearch = {
        query: searchQuery,
        availableOnly: true,
        usaHockeyVerified: true,
      };

      const results = await SubstituteService.searchSubstitutes('rink-1', searchParams);
      setSubstitutes(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to search substitutes');
    } finally {
      setLoading(false);
    }
  };

  const selectSubstitute = async (substitute: SubstitutePlayer) => {
    setSelectedSubstitute(substitute);
    
    try {
      // Perform ringer check
      const check = await SubstituteService.performRingerCheck(substitute, 'Adult Rec A');
      setRingerCheck(check);
      
      if (check.riskLevel === 'high' || check.warnings.length > 0) {
        setShowRingerModal(true);
      } else {
        // Safe to add directly
        addSubstituteToGame(substitute);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify substitute eligibility');
    }
  };

  const addSubstituteToGame = async (substitute: SubstitutePlayer, override: boolean = false) => {
    if (!gameId || !teamId) return;

    try {
      if (ringerCheck && ringerCheck.riskLevel === 'high' && !override) {
        Alert.alert('High Risk Player', 'This player requires manual approval due to skill level concerns.');
        return;
      }

      const gameSubstitute = await SubstituteService.addSubstituteToGame(
        gameId as string,
        substitute.id,
        teamId as string,
        substitute.position,
        undefined, // No specific player being replaced
        'Substitute player added'
      );

      Alert.alert(
        'Substitute Added',
        `${substitute.firstName} ${substitute.lastName} has been added to the game${gameSubstitute.status === 'pending' ? ' (pending approval)' : ''}.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add substitute');
    }
  };

  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'low': return '#16A34A';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
    }
  };

  const renderSubstitute = (substitute: SubstitutePlayer) => (
    <TouchableOpacity
      key={substitute.id}
      style={styles.substituteCard}
      onPress={() => selectSubstitute(substitute)}
    >
      <View style={styles.substituteHeader}>
        <View style={styles.substituteAvatar}>
          <Text style={styles.substituteInitials}>
            {substitute.firstName[0]}{substitute.lastName[0]}
          </Text>
        </View>
        <View style={styles.substituteInfo}>
          <Text style={styles.substituteName}>
            {substitute.firstName} {substitute.lastName}
          </Text>
          <Text style={styles.substitutePosition}>
            {substitute.position} • {substitute.skillLevel}
          </Text>
          <View style={styles.substituteDetails}>
            <Text style={styles.substituteAge}>Age {substitute.age}</Text>
            <Text style={styles.substituteShoots}>Shoots {substitute.shoots}</Text>
          </View>
        </View>
        <View style={styles.substituteStatus}>
          {substitute.usaHockeyStatus === 'active' ? (
            <View style={styles.verifiedBadge}>
              <Shield size={16} color="#16A34A" />
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          ) : (
            <View style={styles.expiredBadge}>
              <AlertTriangle size={16} color="#EF4444" />
              <Text style={styles.expiredText}>EXPIRED</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.substituteFooter}>
        <View style={styles.contactInfo}>
          <View style={styles.contactRow}>
            <Mail size={14} color="#64748B" />
            <Text style={styles.contactText}>{substitute.email}</Text>
          </View>
          {substitute.phone && (
            <View style={styles.contactRow}>
              <Phone size={14} color="#64748B" />
              <Text style={styles.contactText}>{substitute.phone}</Text>
            </View>
          )}
        </View>
        <View style={styles.registrationInfo}>
          <Text style={styles.registrationText}>
            USA Hockey: #{substitute.usaHockeyId}
          </Text>
          <Text style={styles.divisionText}>
            Registered: {substitute.registeredDivision}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRingerModal = () => {
    if (!ringerCheck || !selectedSubstitute) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.ringerModal}>
          <View style={styles.ringerModalHeader}>
            <View style={styles.riskIndicator}>
              <AlertTriangle size={24} color={getRiskColor(ringerCheck.riskLevel)} />
              <Text style={[styles.riskLevel, { color: getRiskColor(ringerCheck.riskLevel) }]}>
                {ringerCheck.riskLevel.toUpperCase()} RISK
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowRingerModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.ringerModalContent}>
            <Text style={styles.ringerModalTitle}>Ringer Check Results</Text>
            <Text style={styles.playerCheckName}>
              {ringerCheck.playerName}
            </Text>

            <View style={styles.divisionComparison}>
              <View style={styles.divisionItem}>
                <Text style={styles.divisionLabel}>Registered Division</Text>
                <Text style={styles.divisionValue}>{ringerCheck.registeredDivision}</Text>
              </View>
              <Text style={styles.divisionArrow}>→</Text>
              <View style={styles.divisionItem}>
                <Text style={styles.divisionLabel}>Game Division</Text>
                <Text style={styles.divisionValue}>{ringerCheck.requestedDivision}</Text>
              </View>
            </View>

            {ringerCheck.warnings.length > 0 && (
              <View style={styles.warningsSection}>
                <Text style={styles.warningsTitle}>⚠️ Warnings</Text>
                {ringerCheck.warnings.map((warning, index) => (
                  <Text key={index} style={styles.warningText}>• {warning}</Text>
                ))}
              </View>
            )}

            {ringerCheck.recommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <Text style={styles.recommendationsTitle}>💡 Recommendations</Text>
                {ringerCheck.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.ringerModalActions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowRingerModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            {ringerCheck.riskLevel !== 'high' && (
              <TouchableOpacity 
                style={styles.approveButton}
                onPress={() => {
                  setShowRingerModal(false);
                  addSubstituteToGame(selectedSubstitute!, true);
                }}
              >
                <UserPlus size={16} color="#FFFFFF" />
                <Text style={styles.approveButtonText}>Add Anyway</Text>
              </TouchableOpacity>
            )}
            
            {ringerCheck.requiresApproval && (
              <TouchableOpacity 
                style={styles.pendingButton}
                onPress={() => {
                  setShowRingerModal(false);
                  addSubstituteToGame(selectedSubstitute!);
                }}
              >
                <Text style={styles.pendingButtonText}>Submit for Approval</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Substitute Player</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, USA Hockey ID, or position..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchSubstitutes}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchSubstitutes}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching substitutes...</Text>
          </View>
        )}

        {!loading && substitutes.length === 0 && searchQuery.trim() && (
          <View style={styles.noResultsContainer}>
            <Users size={48} color="#94A3B8" />
            <Text style={styles.noResultsTitle}>No Substitutes Found</Text>
            <Text style={styles.noResultsText}>
              Try searching by name, USA Hockey ID, or position
            </Text>
          </View>
        )}

        {!loading && searchQuery.trim() === '' && (
          <View style={styles.instructionsContainer}>
            <Target size={48} color="#0EA5E9" />
            <Text style={styles.instructionsTitle}>Find Substitute Players</Text>
            <Text style={styles.instructionsText}>
              Search for registered players in our database to add as substitutes. 
              All players are automatically verified for USA Hockey registration and skill level appropriateness.
            </Text>
            <View style={styles.searchTips}>
              <Text style={styles.searchTipsTitle}>Search Tips:</Text>
              <Text style={styles.searchTip}>• Enter player's first or last name</Text>
              <Text style={styles.searchTip}>• Use USA Hockey registration number</Text>
              <Text style={styles.searchTip}>• Search by position (Center, Goalie, etc.)</Text>
            </View>
          </View>
        )}

        <View style={styles.substitutesList}>
          {substitutes.map(renderSubstitute)}
        </View>
      </ScrollView>

      {showRingerModal && renderRingerModal()}
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
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  searchButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 24,
  },
  instructionsTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  searchTips: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  searchTipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  searchTip: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  substitutesList: {
    gap: 12,
    paddingBottom: 20,
  },
  substituteCard: {
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
  },
  substituteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  substituteAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  substituteInitials: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  substituteInfo: {
    flex: 1,
  },
  substituteName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  substitutePosition: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  substituteDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  substituteAge: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  substituteShoots: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  substituteStatus: {
    alignItems: 'flex-end',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  expiredText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  substituteFooter: {
    gap: 12,
  },
  contactInfo: {
    gap: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  registrationInfo: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  registrationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  divisionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  ringerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  ringerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskLevel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#64748B',
    padding: 8,
  },
  ringerModalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: 400,
  },
  ringerModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  playerCheckName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 20,
  },
  divisionComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 16,
  },
  divisionItem: {
    flex: 1,
    alignItems: 'center',
  },
  divisionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  divisionValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  divisionArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },
  warningsSection: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    marginBottom: 4,
  },
  recommendationsSection: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#D97706',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginBottom: 4,
  },
  ringerModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    gap: 8,
  },
  approveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  pendingButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
  },
  pendingButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});