import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Users, DollarSign, MessageSquare, Send } from 'lucide-react-native';
import { TimeSlot, BookingRequest } from '@/types/scheduling';

const programTypes: { value: TimeSlot['programType']; label: string }[] = [
  { value: 'hockey_league', label: 'Hockey League' },
  { value: 'hockey_practice', label: 'Hockey Practice' },
  { value: 'figure_skating', label: 'Figure Skating' },
  { value: 'public_skate', label: 'Public Skate' },
  { value: 'learn_to_skate', label: 'Learn to Skate' },
  { value: 'birthday_party', label: 'Birthday Party' },
  { value: 'corporate_event', label: 'Corporate Event' },
  { value: 'other', label: 'Other' },
];

export default function BookingRequestScreen() {
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    phone: '',
    programType: 'hockey_practice' as TimeSlot['programType'],
    preferredDate: '',
    preferredTime: '',
    duration: '1.5',
    participantCount: '',
    isRecurring: false,
    recurringFrequency: 'weekly' as 'weekly' | 'biweekly' | 'monthly',
    recurringDuration: '12',
    specialRequests: '',
    budgetMin: '',
    budgetMax: '',
  });

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.contactName.trim()) {
      Alert.alert('Error', 'Contact name is required');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }
    if (!formData.preferredDate) {
      Alert.alert('Error', 'Preferred date is required');
      return;
    }
    if (!formData.participantCount.trim()) {
      Alert.alert('Error', 'Participant count is required');
      return;
    }

    Alert.alert(
      'Request Submitted',
      'Your booking request has been submitted successfully. The rink will review and respond within 24-48 hours.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Ice Time</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Book Ice Time</Text>
          <Text style={styles.introDescription}>
            Submit a request for ice time at our facility. We'll review your request and get back to you within 24-48 hours.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.contactName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, contactName: text }))}
              placeholder="John Smith"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="john@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="(555) 123-4567"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Program Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Program Type *</Text>
            <View style={styles.programTypeSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.programTypeButtons}>
                  {programTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.programTypeButton,
                        formData.programType === type.value && styles.selectedProgramType
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, programType: type.value }))}
                    >
                      <Text style={[
                        styles.programTypeButtonText,
                        formData.programType === type.value && styles.selectedProgramTypeText
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Preferred Date *</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={20} color="#64748B" />
                <TextInput
                  style={styles.inputField}
                  value={formData.preferredDate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, preferredDate: text }))}
                  placeholder="2025-01-20"
                />
              </View>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Preferred Time</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={20} color="#64748B" />
                <TextInput
                  style={styles.inputField}
                  value={formData.preferredTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, preferredTime: text }))}
                  placeholder="18:00"
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Duration (hours) *</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={(text) => setFormData(prev => ({ ...prev, duration: text }))}
                placeholder="1.5"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Participant Count *</Text>
              <View style={styles.inputWithIcon}>
                <Users size={20} color="#64748B" />
                <TextInput
                  style={styles.inputField}
                  value={formData.participantCount}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, participantCount: text }))}
                  placeholder="20"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Recurring Schedule</Text>
          
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
          >
            <View style={[styles.checkbox, formData.isRecurring && styles.checkboxChecked]}>
              {formData.isRecurring && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>This is a recurring booking</Text>
          </TouchableOpacity>

          {formData.isRecurring && (
            <View style={styles.recurringOptions}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Frequency</Text>
                  <View style={styles.frequencySelector}>
                    {(['weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.frequencyButton,
                          formData.recurringFrequency === freq && styles.selectedFrequency
                        ]}
                        onPress={() => setFormData(prev => ({ ...prev, recurringFrequency: freq }))}
                      >
                        <Text style={[
                          styles.frequencyText,
                          formData.recurringFrequency === freq && styles.selectedFrequencyText
                        ]}>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Duration (weeks)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.recurringDuration}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, recurringDuration: text }))}
                    placeholder="12"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Budget & Special Requests</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Budget Range (Min)</Text>
              <View style={styles.inputWithIcon}>
                <DollarSign size={20} color="#64748B" />
                <TextInput
                  style={styles.inputField}
                  value={formData.budgetMin}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, budgetMin: text }))}
                  placeholder="150"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Budget Range (Max)</Text>
              <View style={styles.inputWithIcon}>
                <DollarSign size={20} color="#64748B" />
                <TextInput
                  style={styles.inputField}
                  value={formData.budgetMax}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, budgetMax: text }))}
                  placeholder="250"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Special Requests</Text>
            <View style={styles.inputWithIcon}>
              <MessageSquare size={20} color="#64748B" />
              <TextInput
                style={[styles.inputField, styles.textArea]}
                value={formData.specialRequests}
                onChangeText={(text) => setFormData(prev => ({ ...prev, specialRequests: text }))}
                placeholder="Any special equipment, setup, or requirements..."
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        <View style={styles.submitSection}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Booking Request</Text>
          </TouchableOpacity>
          
          <Text style={styles.submitNote}>
            We'll review your request and respond within 24-48 hours with availability and pricing.
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
  inputGroup: {
    marginBottom: 16,
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
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  programTypeSelector: {
    marginTop: 8,
  },
  programTypeButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  programTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedProgramType: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  programTypeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  selectedProgramTypeText: {
    color: '#FFFFFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  recurringOptions: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  frequencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  selectedFrequency: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  frequencyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  selectedFrequencyText: {
    color: '#FFFFFF',
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
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  submitButtonText: {
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