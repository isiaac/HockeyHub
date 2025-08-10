import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Users, User, Search, ChartBar as BarChart3, MessageSquare, Plus, X, Radio } from 'lucide-react-native';
import { router } from 'expo-router';
import { ChatPoll, PollOption } from '@/types/polls';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface ChatRoom {
  id: string;
  name: string;
  type: 'team' | 'individual';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants?: number;
}

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isMe: boolean;
}

interface PollCreationForm {
  question: string;
  options: string[];
  allowMultiple: boolean;
  anonymous: boolean;
  expiresIn: number; // hours
}

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Ice Wolves Team',
    type: 'team',
    lastMessage: 'Great game everyone! See you at practice Tuesday.',
    lastMessageTime: '2 min ago',
    unreadCount: 3,
    participants: 18,
  },
  {
    id: '2',
    name: 'Alex Chen',
    type: 'individual',
    lastMessage: 'Want to work on some drills before the next game?',
    lastMessageTime: '15 min ago',
    unreadCount: 1,
  },
  {
    id: '3',
    name: 'Coaches Group',
    type: 'team',
    lastMessage: 'Updated lineup for Saturday\'s game',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    participants: 4,
  },
  {
    id: '4',
    name: 'Morgan Davis',
    type: 'individual',
    lastMessage: 'Thanks for the assist on that goal!',
    lastMessageTime: '3 hours ago',
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Coach Mike',
    message: 'Great job in today\'s practice everyone!',
    timestamp: '2:30 PM',
    isMe: false,
  },
  {
    id: '2',
    sender: 'You',
    message: 'Thanks coach! Ready for Saturday\'s game.',
    timestamp: '2:32 PM',
    isMe: true,
  },
  {
    id: '3',
    sender: 'Alex Chen',
    message: 'Anyone want to grab dinner after the game?',
    timestamp: '2:35 PM',
    isMe: false,
  },
];

const mockPolls: ChatPoll[] = [
  {
    id: '1',
    chatRoomId: '1',
    createdBy: 'user-1',
    creatorName: 'Coach Mike',
    question: 'What time works best for practice this week?',
    options: [
      { id: '1', text: 'Tuesday 7 PM', votes: 8, voters: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8'] },
      { id: '2', text: 'Wednesday 8 PM', votes: 5, voters: ['user-9', 'user-10', 'user-11', 'user-12', 'user-13'] },
      { id: '3', text: 'Thursday 7 PM', votes: 3, voters: ['user-14', 'user-15', 'user-16'] },
    ],
    allowMultiple: false,
    anonymous: false,
    totalVotes: 16,
    isActive: true,
    expiresAt: '2025-01-16T23:59:59Z',
    createdAt: '2025-01-15T10:00:00Z',
  },
];

export default function ChatScreen() {
  const [chatRooms] = useState<ChatRoom[]>(mockChatRooms);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages] = useState<Message[]>(mockMessages);
  const [polls] = useState<ChatPoll[]>(mockPolls);
  const [newMessage, setNewMessage] = useState('');
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollForm, setPollForm] = useState<PollCreationForm>({
    question: '',
    options: ['', ''],
    allowMultiple: false,
    anonymous: false,
    expiresIn: 24,
  });
  const [userVotes, setUserVotes] = useState<{ [pollId: string]: string[] }>({});

  const selectedRoom = chatRooms.find(room => room.id === selectedChat);
  const roomPolls = polls.filter(poll => poll.chatRoomId === selectedChat);

  const addPollOption = () => {
    if (pollForm.options.length < 6) {
      setPollForm(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removePollOption = (index: number) => {
    if (pollForm.options.length > 2) {
      setPollForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setPollForm(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const createPoll = () => {
    if (!pollForm.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    const validOptions = pollForm.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    // In production, this would create the poll via API
    console.log('Creating poll:', pollForm);
    
    // Reset form and close modal
    setPollForm({
      question: '',
      options: ['', ''],
      allowMultiple: false,
      anonymous: false,
      expiresIn: 24,
    });
    setShowPollModal(false);
  };

  const voteOnPoll = (pollId: string, optionId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    setUserVotes(prev => {
      const currentVotes = prev[pollId] || [];
      
      if (poll.allowMultiple) {
        // Toggle vote for multiple selection
        if (currentVotes.includes(optionId)) {
          return { ...prev, [pollId]: currentVotes.filter(id => id !== optionId) };
        } else {
          return { ...prev, [pollId]: [...currentVotes, optionId] };
        }
      } else {
        // Single selection
        return { ...prev, [pollId]: [optionId] };
      }
    });
  };

  const renderPoll = (poll: ChatPoll) => {
    const userPollVotes = userVotes[poll.id] || [];
    const hasVoted = userPollVotes.length > 0;

    return (
      <View key={poll.id} style={styles.pollContainer}>
        <View style={styles.pollHeader}>
          <View style={styles.pollIcon}>
            <BarChart3 size={16} color="#0EA5E9" />
          </View>
          <View style={styles.pollInfo}>
            <Text style={styles.pollCreator}>{poll.creatorName}</Text>
            <Text style={styles.pollQuestion}>{poll.question}</Text>
          </View>
        </View>

        <View style={styles.pollOptions}>
          {poll.options.map((option) => {
            const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
            const isSelected = userPollVotes.includes(option.id);

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.pollOption, isSelected && styles.selectedPollOption]}
                onPress={() => voteOnPoll(poll.id, option.id)}
                disabled={!poll.isActive}
              >
                <View style={styles.pollOptionContent}>
                  <View style={styles.pollOptionText}>
                    <View style={[styles.pollRadio, isSelected && styles.selectedPollRadio]}>
                      {isSelected && <Radio size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                      {option.text}
                    </Text>
                  </View>
                  <Text style={styles.optionVotes}>{option.votes} votes</Text>
                </View>
                {hasVoted && (
                  <View style={styles.pollProgress}>
                    <View style={[styles.pollProgressBar, { width: `${percentage}%` }]} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.pollFooter}>
          <Text style={styles.pollStats}>
            {poll.totalVotes} votes • {poll.allowMultiple ? 'Multiple choice' : 'Single choice'}
            {poll.anonymous && ' • Anonymous'}
          </Text>
          <Text style={styles.pollExpiry}>
            {poll.isActive ? 'Expires in 12 hours' : 'Poll ended'}
          </Text>
        </View>
      </View>
    );
  };

  const renderPollModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.pollModal}>
        <View style={styles.pollModalHeader}>
          <Text style={styles.pollModalTitle}>Create Poll</Text>
          <TouchableOpacity onPress={() => setShowPollModal(false)}>
            <X size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.pollModalContent}>
          <View style={styles.pollFormGroup}>
            <Text style={styles.pollFormLabel}>Question *</Text>
            <TextInput
              style={styles.pollQuestionInput}
              value={pollForm.question}
              onChangeText={(text) => setPollForm(prev => ({ ...prev, question: text }))}
              placeholder="What would you like to ask the team?"
              multiline
            />
          </View>

          <View style={styles.pollFormGroup}>
            <Text style={styles.pollFormLabel}>Options</Text>
            {pollForm.options.map((option, index) => (
              <View key={index} style={styles.pollOptionInput}>
                <TextInput
                  style={styles.pollOptionField}
                  value={option}
                  onChangeText={(text) => updatePollOption(index, text)}
                  placeholder={`Option ${index + 1}`}
                />
                {pollForm.options.length > 2 && (
                  <TouchableOpacity onPress={() => removePollOption(index)}>
                    <X size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            {pollForm.options.length < 6 && (
              <TouchableOpacity style={styles.addOptionButton} onPress={addPollOption}>
                <Plus size={16} color="#0EA5E9" />
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.pollSettings}>
            <TouchableOpacity
              style={styles.pollSetting}
              onPress={() => setPollForm(prev => ({ ...prev, allowMultiple: !prev.allowMultiple }))}
            >
              <View style={[styles.pollCheckbox, pollForm.allowMultiple && styles.pollCheckboxChecked]}>
                {pollForm.allowMultiple && <Text style={styles.pollCheckmark}>✓</Text>}
              </View>
              <Text style={styles.pollSettingText}>Allow multiple selections</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pollSetting}
              onPress={() => setPollForm(prev => ({ ...prev, anonymous: !prev.anonymous }))}
            >
              <View style={[styles.pollCheckbox, pollForm.anonymous && styles.pollCheckboxChecked]}>
                {pollForm.anonymous && <Text style={styles.pollCheckmark}>✓</Text>}
              </View>
              <Text style={styles.pollSettingText}>Anonymous voting</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.pollModalActions}>
          <TouchableOpacity style={styles.pollCancelButton} onPress={() => setShowPollModal(false)}>
            <Text style={styles.pollCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pollCreateButton} onPress={createPoll}>
            <Text style={styles.pollCreateText}>Create Poll</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderChatRoom = (room: ChatRoom) => (
    <TouchableOpacity
      key={room.id}
      style={styles.chatRoomCard}
      onPress={() => setSelectedChat(room.id)}
    >
      <View style={styles.chatRoomIcon}>
        {room.type === 'team' ? (
          <Users size={24} color="#0EA5E9" />
        ) : (
          <User size={24} color="#64748B" />
        )}
      </View>
      
      <View style={styles.chatRoomContent}>
        <View style={styles.chatRoomHeader}>
          <Text style={styles.chatRoomName}>{room.name}</Text>
          <Text style={styles.chatRoomTime}>{room.lastMessageTime}</Text>
        </View>
        
        <Text style={styles.lastMessage} numberOfLines={1}>
          {room.lastMessage}
        </Text>
        
        {room.participants && (
          <Text style={styles.participantCount}>{room.participants} members</Text>
        )}
      </View>
      
      {room.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{room.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[styles.messageContainer, message.isMe && styles.myMessage]}>
      <View style={[styles.messageBubble, message.isMe && styles.myMessageBubble]}>
        {!message.isMe && (
          <Text style={styles.messageSender}>{message.sender}</Text>
        )}
        <Text style={[styles.messageText, message.isMe && styles.myMessageText]}>
          {message.message}
        </Text>
        <Text style={[styles.messageTime, message.isMe && styles.myMessageTime]}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );

  if (selectedChat && selectedRoom) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatTitle}>{selectedRoom.name}</Text>
          <View style={styles.chatHeaderActions}>
            <TouchableOpacity 
              style={styles.chatActionButton}
              onPress={() => setShowPollModal(true)}
            >
              <BarChart3 size={20} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.chatActionButton}
              onPress={() => router.push('/broadcast')}
            >
              <MessageSquare size={20} color="#16A34A" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map(renderMessage)}
          {roomPolls.map(renderPoll)}
        </ScrollView>

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {showPollModal && renderPollModal()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chatRoomsList}>
          {chatRooms.map(renderChatRoom)}
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
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  chatRoomsList: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 20,
  },
  chatRoomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chatRoomIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  chatRoomContent: {
    flex: 1,
  },
  chatRoomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatRoomName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  chatRoomTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  participantCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  chatHeader: {
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  chatTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  placeholder: {
    width: 60,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  myMessageBubble: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  messageSender: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: '#BFDBFE',
  },
  messageInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'flex-end',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#0EA5E9',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pollContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pollIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pollInfo: {
    flex: 1,
  },
  pollCreator: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  pollQuestion: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    lineHeight: 22,
  },
  pollOptions: {
    gap: 8,
    marginBottom: 12,
  },
  pollOption: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedPollOption: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  pollOptionText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pollRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedPollRadio: {
    borderColor: '#0EA5E9',
    backgroundColor: '#0EA5E9',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    flex: 1,
  },
  selectedOptionText: {
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  optionVotes: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  pollProgress: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  pollProgressBar: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 2,
  },
  pollFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollStats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  pollExpiry: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pollModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width - 40,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  pollModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pollModalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  pollModalContent: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pollFormGroup: {
    marginBottom: 20,
  },
  pollFormLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  pollQuestionInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  pollOptionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  pollOptionField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  addOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  pollSettings: {
    gap: 12,
  },
  pollSetting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollCheckboxChecked: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  pollCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  pollSettingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  pollModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  pollCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  pollCancelText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  pollCreateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
  },
  pollCreateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});