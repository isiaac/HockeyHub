import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Building, Users, Shield, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Send } from 'lucide-react-native';
import { Team, Rink, TeamImportRequest } from '@/types/auth';

interface ImportOption {
  id: string;
  type: 'import' | 'create';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const importOptions: ImportOption[] = [
  {
    id: 'import-existing',
    type: 'import',
    title: 'Import Existing Team',
    description: 'Transfer your independent team to rink management while retaining coaching permissions',
    icon: <Send size={24} color="#FFFFFF" />,
    color: '#0EA5E9',
  },
  {
    id: 'create-new',
    type: 'create',
    title: 'Create New Team',
    description: 'Let the rink create a new team and assign you as coach with editing permissions',
    icon: <Users size={24} color="#FFFFFF" />,
    color: '#16A34A',
  },
];

const mockRinks: Rink[] = [
  {
    id: 'rink-1',
    name: 'Central Ice Complex',
    address: '123 Hockey Lane, Toronto, ON',
    ownerId: 'owner-1',
    adminIds: ['admin-1', 'admin-2'],
    teamsManaged: ['team-1', 'team-2'],
    canCreateTeams: true,
    canImportTeams: true,
    settings: {
      requireApproval: true,
      autoAssignDivisions: true,
      centralizedStats: true,
    },
    createdAt: '2024-01-01',
  },
  {
    id: 'rink-2',
    name: 'North Ice Arena',
    address: '456 Ice Street, Vancouver, BC',
    ownerId: 'owner-2',
    adminIds: ['admin-3'],
    teamsManaged: ['team-3'],
    canCreateTeams: true,
    canImportTeams: false,
    settings: {
      requireApproval: false,
      autoAssignDivisions: false,
      centralizedStats: true,
    },
    createdAt: '2024-02-01',
  },
];

export default function TeamImportScreen() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedRink, setSelectedRink] = useState<string | null>(null);
  const [rinks] = useState<Rink[]>(mockRinks);
  const [importMessage, setImportMessage] = useState('');

  const handleSubmitRequest = () => {
    if (!selectedOption || !selectedRink) {
      Alert.alert('Incomplete', 'Please select both an option and a rink.');
      return;
    }

    const rink = rinks.find(r => r.id === selectedRink);
    const option = importOptions.find(o => o.id === selectedOption);

    if (option?.type === 'import') {
      Alert.alert(
        'Import Request Sent',
        `Your team import request has been sent to ${rink?.name}. They will review and respond within 24-48 hours.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        'Team Creation Request Sent',
        `Your request for ${rink?.name} to create a new team has been sent. You will be notified once the team is created and permissions are assigned.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const renderImportOption = (option: ImportOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionCard,
        selectedOption === option.id && styles.selectedOption
      ]}
      onPress={() => setSelectedOption(option.id)}
    >
      <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
        {option.icon}
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
      <View style={styles.optionSelector}>
        <View style={[
          styles.radioButton,
          selectedOption === option.id && styles.selectedRadio
        ]}>
          {selectedOption === option.id && (
            <CheckCircle size={16} color="#0EA5E9" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRink = (rink: Rink) => {
    const canImport = selectedOption === 'import-existing' ? rink.canImportTeams : rink.canCreateTeams;
    
    return (
      <TouchableOpacity
        key={rink.id}
        style={[
          styles.rinkCard,
          selectedRink === rink.id && styles.selectedRink,
          !canImport && styles.disabledRink
        ]}
        onPress={() => canImport && setSelectedRink(rink.id)}
        disabled={!canImport}
      >
        <View style={styles.rinkHeader}>
          <View style={styles.rinkIcon}>
            <Building size={24} color="#FFFFFF" />
          </View>
          <View style={styles.rinkInfo}>
            <Text style={styles.rinkName}>{rink.name}</Text>
            <Text style={styles.rinkAddress}>{rink.address}</Text>
          </View>
          {!canImport && (
            <View style={styles.unavailableBadge}>
              <AlertTriangle size={16} color="#F59E0B" />
              <Text style={styles.unavailableText}>Not Available</Text>
            </View>
          )}
        </View>

        <View style={styles.rinkDetails}>
          <Text style={styles.rinkStat}>{rink.teamsManaged.length} teams managed</Text>
          <View style={styles.rinkFeatures}>
            {rink.settings.requireApproval && (
              <View style={styles.featureBadge}>
                <Shield size={12} color="#64748B" />
                <Text style={styles.featureText}>Requires Approval</Text>
              </View>
            )}
            {rink.settings.centralizedStats && (
              <View style={styles.featureBadge}>
                <CheckCircle size={12} color="#16A34A" />
                <Text style={styles.featureText}>Centralized Stats</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Team Management Options</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Join an Ice Rink</Text>
          <Text style={styles.introDescription}>
            Connect with an ice rink for enhanced team management, centralized stats, 
            and access to additional features while maintaining your coaching permissions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Option</Text>
          <View style={styles.optionsList}>
            {importOptions.map(renderImportOption)}
          </View>
        </View>

        {selectedOption && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Ice Rink</Text>
            <View style={styles.rinksList}>
              {rinks.map(renderRink)}
            </View>
          </View>
        )}

        {selectedOption && selectedRink && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Message (Optional)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Add a message to the rink administrators..."
              value={importMessage}
              onChangeText={setImportMessage}
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        {selectedOption && selectedRink && (
          <View style={styles.submitSection}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRequest}>
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {selectedOption === 'import-existing' ? 'Send Import Request' : 'Request Team Creation'}
              </Text>
            </TouchableOpacity>
          </View>
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
  introSection: {
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
  introTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  introDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#0EA5E9',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  optionSelector: {
    marginLeft: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  rinksList: {
    gap: 12,
  },
  rinkCard: {
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
  selectedRink: {
    borderColor: '#0EA5E9',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  disabledRink: {
    opacity: 0.6,
  },
  rinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rinkInfo: {
    flex: 1,
  },
  rinkName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  rinkAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  unavailableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  unavailableText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  rinkDetails: {
    gap: 8,
  },
  rinkStat: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
  },
  rinkFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  messageInput: {
    backgroundColor: '#FFFFFF',
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
  submitSection: {
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});