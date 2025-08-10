import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Send, Users, Mail, MessageSquare, Bell, TriangleAlert as AlertTriangle, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { BroadcastMessage, BroadcastChannel, BroadcastRecipient, BroadcastTemplate } from '@/types/broadcast';

const mockTemplates: BroadcastTemplate[] = [
  {
    id: '1',
    name: 'Game Reminder',
    subject: 'Game Tomorrow - {TEAM_NAME} vs {OPPONENT}',
    message: 'Don\'t forget about tomorrow\'s game at {TIME} at {VENUE}. Please arrive 30 minutes early for warm-up.',
    category: 'game_reminder',
    isDefault: true,
    createdBy: 'system',
  },
  {
    id: '2',
    name: 'Practice Update',
    subject: 'Practice Update - {DATE}',
    message: 'Practice has been {STATUS} for {DATE}. {ADDITIONAL_INFO}',
    category: 'practice_update',
    isDefault: true,
    createdBy: 'system',
  },
  {
    id: '3',
    name: 'Emergency Alert',
    subject: 'URGENT: {SUBJECT}',
    message: 'This is an urgent message regarding: {MESSAGE}',
    category: 'emergency',
    isDefault: true,
    createdBy: 'system',
  },
];

const mockRecipients: BroadcastRecipient[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    phone: '555-0101',
    role: 'player',
    deliveryStatus: {},
    preferences: {
      allowPush: true,
      allowEmail: true,
      allowSMS: false,
    },
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Morgan Davis',
    email: 'morgan@example.com',
    phone: '555-0102',
    role: 'player',
    deliveryStatus: {},
    preferences: {
      allowPush: true,
      allowEmail: true,
      allowSMS: true,
    },
  },
  {
    id: '3',
    userId: 'user-3',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    phone: '555-0103',
    role: 'coach',
    deliveryStatus: {},
    preferences: {
      allowPush: true,
      allowEmail: true,
      allowSMS: false,
    },
  },
];

export default function BroadcastScreen() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    scheduledFor: '',
  });
  const [selectedChannels, setSelectedChannels] = useState<BroadcastChannel[]>([
    { type: 'push', enabled: true },
    { type: 'email', enabled: true },
    { type: 'sms', enabled: false },
  ]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const handleTemplateSelect = (template: BroadcastTemplate) => {
    setSelectedTemplate(template.id);
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      message: template.message,
    }));
  };

  const toggleChannel = (channelType: 'push' | 'email' | 'sms') => {
    setSelectedChannels(prev =>
      prev.map(channel =>
        channel.type === channelType
          ? { ...channel, enabled: !channel.enabled }
          : channel
      )
    );
  };

  const toggleRecipient = (recipientId: string) => {
    setSelectedRecipients(prev =>
      prev.includes(recipientId)
        ? prev.filter(id => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const selectAllRecipients = () => {
    if (selectedRecipients.length === mockRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(mockRecipients.map(r => r.id));
    }
  };

  const handleSend = () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    if (selectedRecipients.length === 0) {
      Alert.alert('Error', 'Please select at least one recipient');
      return;
    }

    const enabledChannels = selectedChannels.filter(c => c.enabled);
    if (enabledChannels.length === 0) {
      Alert.alert('Error', 'Please select at least one communication channel');
      return;
    }

    Alert.alert(
      'Message Sent',
      `Broadcast message sent to ${selectedRecipients.length} recipients via ${enabledChannels.map(c => c.type).join(', ')}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'normal': return '#0EA5E9';
      case 'low': return '#64748B';
      default: return '#0EA5E9';
    }
  };

  const getChannelIcon = (type: 'push' | 'email' | 'sms') => {
    switch (type) {
      case 'push': return <Bell size={20} color="#FFFFFF" />;
      case 'email': return <Mail size={20} color="#FFFFFF" />;
      case 'sms': return <MessageSquare size={20} color="#FFFFFF" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Broadcast Message</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Message Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.templatesContainer}>
              {mockTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    selectedTemplate === template.id && styles.selectedTemplate
                  ]}
                  onPress={() => handleTemplateSelect(template)}
                >
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateCategory}>{template.category.replace('_', ' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Message Composition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compose Message</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject *</Text>
            <TextInput
              style={styles.input}
              value={formData.subject}
              onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
              placeholder="Enter message subject"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message *</Text>
            <TextInput
              style={[styles.input, styles.messageTextArea]}
              value={formData.message}
              onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
              placeholder="Enter your message..."
              multiline
              numberOfLines={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={styles.prioritySelector}>
              {(['low', 'normal', 'high', 'urgent'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    formData.priority === priority && styles.selectedPriority,
                    { borderColor: getPriorityColor(priority) }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, priority }))}
                >
                  {priority === 'urgent' && <AlertTriangle size={16} color={getPriorityColor(priority)} />}
                  <Text style={[
                    styles.priorityText,
                    formData.priority === priority && { color: getPriorityColor(priority) }
                  ]}>
                    {priority.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Communication Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication Channels</Text>
          <View style={styles.channelsContainer}>
            {selectedChannels.map((channel) => (
              <TouchableOpacity
                key={channel.type}
                style={[
                  styles.channelCard,
                  channel.enabled && styles.enabledChannel
                ]}
                onPress={() => toggleChannel(channel.type)}
              >
                <View style={[
                  styles.channelIcon,
                  { backgroundColor: channel.enabled ? getPriorityColor('normal') : '#94A3B8' }
                ]}>
                  {getChannelIcon(channel.type)}
                </View>
                <Text style={[
                  styles.channelText,
                  channel.enabled && styles.enabledChannelText
                ]}>
                  {channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}
                </Text>
                <View style={[
                  styles.channelToggle,
                  channel.enabled && styles.enabledToggle
                ]}>
                  {channel.enabled && <CheckCircle size={16} color="#16A34A" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recipients Selection */}
        <View style={styles.section}>
          <View style={styles.recipientsHeader}>
            <Text style={styles.sectionTitle}>Recipients</Text>
            <TouchableOpacity style={styles.selectAllButton} onPress={selectAllRecipients}>
              <Text style={styles.selectAllText}>
                {selectedRecipients.length === mockRecipients.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recipientsList}>
            {mockRecipients.map((recipient) => {
              const isSelected = selectedRecipients.includes(recipient.id);
              const enabledChannels = selectedChannels.filter(c => c.enabled);
              const availableChannels = enabledChannels.filter(channel => {
                switch (channel.type) {
                  case 'push': return recipient.preferences.allowPush;
                  case 'email': return recipient.preferences.allowEmail && recipient.email;
                  case 'sms': return recipient.preferences.allowSMS && recipient.phone;
                  default: return false;
                }
              });

              return (
                <TouchableOpacity
                  key={recipient.id}
                  style={[styles.recipientCard, isSelected && styles.selectedRecipient]}
                  onPress={() => toggleRecipient(recipient.id)}
                >
                  <View style={styles.recipientInfo}>
                    <View style={styles.recipientAvatar}>
                      <Text style={styles.recipientInitials}>
                        {recipient.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.recipientDetails}>
                      <Text style={styles.recipientName}>{recipient.name}</Text>
                      <Text style={styles.recipientRole}>{recipient.role}</Text>
                      <View style={styles.recipientChannels}>
                        {availableChannels.map((channel) => (
                          <View key={channel.type} style={styles.channelBadge}>
                            <Text style={styles.channelBadgeText}>{channel.type}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  <View style={[
                    styles.recipientCheckbox,
                    isSelected && styles.selectedCheckbox
                  ]}>
                    {isSelected && <CheckCircle size={16} color="#0EA5E9" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Send Section */}
        <View style={styles.sendSection}>
          <View style={styles.sendSummary}>
            <Text style={styles.sendSummaryText}>
              Ready to send to {selectedRecipients.length} recipients via {selectedChannels.filter(c => c.enabled).length} channels
            </Text>
          </View>
          
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>Send Broadcast</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  templatesContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 140,
  },
  selectedTemplate: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  templateName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  messageTextArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  selectedPriority: {
    backgroundColor: '#F8FAFC',
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  channelsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  channelCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  enabledChannel: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  channelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 8,
  },
  enabledChannelText: {
    color: '#0EA5E9',
  },
  channelToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabledToggle: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  recipientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectAllButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  recipientsList: {
    gap: 8,
  },
  recipientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedRecipient: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recipientInitials: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  recipientRole: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  recipientChannels: {
    flexDirection: 'row',
    gap: 4,
  },
  channelBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  channelBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  recipientCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckbox: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  sendSection: {
    marginBottom: 40,
  },
  sendSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendSummaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});