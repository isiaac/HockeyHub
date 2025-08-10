import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Users, Building, ArrowRight } from 'lucide-react-native';

interface UserTypeOption {
  id: 'player' | 'rink';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const userTypes: UserTypeOption[] = [
  {
    id: 'player',
    title: 'Hockey Player',
    description: 'Join teams, track stats, and connect with other players',
    icon: <Users size={32} color="#FFFFFF" />,
    color: '#0EA5E9',
  },
  {
    id: 'rink',
    title: 'Ice Rink',
    description: 'Manage teams, facilities, and organize leagues',
    icon: <Building size={32} color="#FFFFFF" />,
    color: '#EF4444',
  },
];

export default function UserTypeScreen() {
  const handleSelectUserType = (type: 'player' | 'rink') => {
    router.push(`/(auth)/register?userType=${type}`);
  };

  const renderUserTypeCard = (userType: UserTypeOption) => (
    <TouchableOpacity
      key={userType.id}
      style={styles.userTypeCard}
      onPress={() => handleSelectUserType(userType.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: userType.color }]}>
        {userType.icon}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{userType.title}</Text>
        <Text style={styles.cardDescription}>{userType.description}</Text>
      </View>
      
      <ArrowRight size={24} color="#64748B" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to HockeyApp</Text>
        <Text style={styles.subtitle}>Choose your account type to get started</Text>
      </View>

      <View style={styles.content}>
        {userTypes.map(renderUserTypeCard)}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginLink}>Sign In</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  userTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 8,
  },
  footerText: {
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