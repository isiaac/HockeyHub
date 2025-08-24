import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Building, Mail, Phone, MapPin, Calendar, Users, Shield } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface PlayerRegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  position: string;
  password: string;
  confirmPassword: string;
  usaHockeyId?: string;
}

interface RinkRegistrationForm {
  rinkName: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
}

const positions = [
  'Center', 'Left Wing', 'Right Wing', 'Left Defense', 'Right Defense', 'Goalie'
];

export default function RegisterScreen() {
  const { userType } = useLocalSearchParams();
  const { register } = useAuth();
  const router = useRouter();
  const isPlayer = userType === 'player';
  
  const [playerForm, setPlayerForm] = useState<PlayerRegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    position: '',
    password: '',
    confirmPassword: '',
    usaHockeyId: '',
  });

  const [rinkForm, setRinkForm] = useState<RinkRegistrationForm>({
    rinkName: '',
    ownerFirstName: '',
    ownerLastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
  });

  const [selectedPosition, setSelectedPosition] = useState('');

  const validatePlayerForm = (): boolean => {
    if (!playerForm.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!playerForm.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    if (!playerForm.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!playerForm.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    if (!playerForm.age.trim()) {
      Alert.alert('Error', 'Age is required');
      return false;
    }
    if (!selectedPosition) {
      Alert.alert('Error', 'Position is required');
      return false;
    }
    if (playerForm.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (playerForm.password !== playerForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const validateRinkForm = (): boolean => {
    if (!rinkForm.rinkName.trim()) {
      Alert.alert('Error', 'Rink name is required');
      return false;
    }
    if (!rinkForm.ownerFirstName.trim()) {
      Alert.alert('Error', 'Owner first name is required');
      return false;
    }
    if (!rinkForm.ownerLastName.trim()) {
      Alert.alert('Error', 'Owner last name is required');
      return false;
    }
    if (!rinkForm.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!rinkForm.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    if (!rinkForm.address.trim()) {
      Alert.alert('Error', 'Address is required');
      return false;
    }
    if (rinkForm.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (rinkForm.password !== rinkForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (isPlayer) {
      if (!validatePlayerForm()) return;
      
      try {
        await register({
          ...playerForm,
          position: selectedPosition,
        }, 'player');
        router.replace('/(tabs)');
      } catch (error) {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } else {
      if (!validateRinkForm()) return;
      
      try {
        await register(rinkForm, 'rink');
        router.replace('/rink-dashboard');
      } catch (error) {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    }
  };

  const renderPlayerForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.formHeader}>
        <View style={[styles.headerIcon, { backgroundColor: '#0EA5E9' }]}>
          <Users size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.formTitle}>Create Player Account</Text>
        <Text style={styles.formSubtitle}>Join teams and track your hockey journey</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Personal Information</Text>
        
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={playerForm.firstName}
              onChangeText={(text) => setPlayerForm(prev => ({ ...prev, firstName: text }))}
              placeholder="John"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={playerForm.lastName}
              onChangeText={(text) => setPlayerForm(prev => ({ ...prev, lastName: text }))}
              placeholder="Smith"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address *</Text>
          <View style={styles.inputWithIcon}>
            <Mail size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={playerForm.email}
              onChangeText={(text) => setPlayerForm(prev => ({ ...prev, email: text }))}
              placeholder="john.smith@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <View style={styles.inputWithIcon}>
            <Phone size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={playerForm.phone}
              onChangeText={(text) => setPlayerForm(prev => ({ ...prev, phone: text }))}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age *</Text>
          <View style={styles.inputWithIcon}>
            <Calendar size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={playerForm.age}
              onChangeText={(text) => setPlayerForm(prev => ({ ...prev, age: text }))}
              placeholder="25"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Position *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.positionSelector}>
            <View style={styles.positionButtons}>
              {positions.map((position) => (
                <TouchableOpacity
                  key={position}
                  style={[
                    styles.positionButton,
                    selectedPosition === position && styles.selectedPosition
                  ]}
                  onPress={() => setSelectedPosition(position)}
                >
                  <Text style={[
                    styles.positionText,
                    selectedPosition === position && styles.selectedPositionText
                  ]}>
                    {position}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>USA Hockey ID (Optional)</Text>
          <View style={styles.inputWithIcon}>
            <Shield size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={playerForm.usaHockeyId}
              onChangeText={(text) => setPlayerForm(prev => ({ ...prev, usaHockeyId: text }))}
              placeholder="12345678"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
          <Text style={styles.inputHint}>8-digit USA Hockey registration number</Text>
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Account Security</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password *</Text>
          <TextInput
            style={styles.input}
            value={playerForm.password}
            onChangeText={(text) => setPlayerForm(prev => ({ ...prev, password: text }))}
            placeholder="Enter password"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            value={playerForm.confirmPassword}
            onChangeText={(text) => setPlayerForm(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirm password"
            secureTextEntry
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderRinkForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.formHeader}>
        <View style={[styles.headerIcon, { backgroundColor: '#EF4444' }]}>
          <Building size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.formTitle}>Create Ice Rink Account</Text>
        <Text style={styles.formSubtitle}>Manage your facility and teams</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Facility Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ice Rink Name *</Text>
          <View style={styles.inputWithIcon}>
            <Building size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={rinkForm.rinkName}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, rinkName: text }))}
              placeholder="Central Ice Arena"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Address *</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={rinkForm.address}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, address: text }))}
              placeholder="123 Hockey Lane"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>City *</Text>
            <TextInput
              style={styles.input}
              value={rinkForm.city}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, city: text }))}
              placeholder="Toronto"
            />
          </View>
          <View style={styles.quarterInput}>
            <Text style={styles.inputLabel}>State/Province *</Text>
            <TextInput
              style={styles.input}
              value={rinkForm.state}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, state: text }))}
              placeholder="ON"
            />
          </View>
          <View style={styles.quarterInput}>
            <Text style={styles.inputLabel}>Zip/Postal *</Text>
            <TextInput
              style={styles.input}
              value={rinkForm.zipCode}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, zipCode: text }))}
              placeholder="M5V 3A8"
            />
          </View>
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Owner Information</Text>
        
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={rinkForm.ownerFirstName}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, ownerFirstName: text }))}
              placeholder="John"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={rinkForm.ownerLastName}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, ownerLastName: text }))}
              placeholder="Smith"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address *</Text>
          <View style={styles.inputWithIcon}>
            <Mail size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={rinkForm.email}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, email: text }))}
              placeholder="owner@icearena.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <View style={styles.inputWithIcon}>
            <Phone size={20} color="#64748B" />
            <TextInput
              style={styles.inputField}
              value={rinkForm.phone}
              onChangeText={(text) => setRinkForm(prev => ({ ...prev, phone: text }))}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Account Security</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password *</Text>
          <TextInput
            style={styles.input}
            value={rinkForm.password}
            onChangeText={(text) => setRinkForm(prev => ({ ...prev, password: text }))}
            placeholder="Enter password"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            value={rinkForm.confirmPassword}
            onChangeText={(text) => setRinkForm(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirm password"
            secureTextEntry
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.placeholder} />
      </View>

      {isPlayer ? renderPlayerForm() : renderRinkForm()}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>
            Create {isPlayer ? 'Player' : 'Ice Rink'} Account
          </Text>
        </TouchableOpacity>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  inputHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  quarterInput: {
    flex: 0.5,
  },
  positionSelector: {
    marginTop: 8,
  },
  positionButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  positionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedPosition: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  positionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  selectedPositionText: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  registerButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginPromptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  loginLink: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
});