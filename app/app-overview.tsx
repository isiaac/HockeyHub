import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Users, Building, Calendar, MessageSquare, Trophy, Store, Award, User, CreditCard, MapPin, Clock, UserCheck, DollarSign, Receipt, Settings, Play, Eye, Send, Plus, ArrowRight, Chrome as Home } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface PageInfo {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  color: string;
  category: 'auth' | 'tabs' | 'rink' | 'game' | 'payment' | 'management';
}

const pages: PageInfo[] = [
  // Authentication Pages
  {
    id: 'user-type',
    title: 'Choose Account Type',
    description: 'Select Player or Ice Rink account',
    route: '/(auth)/user-type',
    icon: <Users size={24} color="#FFFFFF" />,
    color: '#6366F1',
    category: 'auth'
  },
  {
    id: 'login',
    title: 'Login',
    description: 'Sign in to your account',
    route: '/(auth)/login',
    icon: <User size={24} color="#FFFFFF" />,
    color: '#0EA5E9',
    category: 'auth'
  },
  {
    id: 'register',
    title: 'Register',
    description: 'Create new account',
    route: '/(auth)/register?userType=player',
    icon: <Plus size={24} color="#FFFFFF" />,
    color: '#16A34A',
    category: 'auth'
  },

  // Main Tab Pages
  {
    id: 'games',
    title: 'Games',
    description: 'Game management & lineups',
    route: '/(tabs)/index',
    icon: <Calendar size={24} color="#FFFFFF" />,
    color: '#EF4444',
    category: 'tabs'
  },
  {
    id: 'teams',
    title: 'Free Agents',
    description: 'Register & browse players',
    route: '/(tabs)/teams',
    icon: <Users size={24} color="#FFFFFF" />,
    color: '#8B5CF6',
    category: 'tabs'
  },
  {
    id: 'stats',
    title: 'Statistics',
    description: 'Team, player & league stats',
    route: '/(tabs)/stats',
    icon: <Trophy size={24} color="#FFFFFF" />,
    color: '#F59E0B',
    category: 'tabs'
  },
  {
    id: 'store',
    title: 'Team Store',
    description: 'Merchandise & equipment',
    route: '/(tabs)/store',
    icon: <Store size={24} color="#FFFFFF" />,
    color: '#EC4899',
    category: 'tabs'
  },
  {
    id: 'badges',
    title: 'Badges',
    description: 'Achievement system',
    route: '/(tabs)/badges',
    icon: <Award size={24} color="#FFFFFF" />,
    color: '#10B981',
    category: 'tabs'
  },
  {
    id: 'chat',
    title: 'Team Chat',
    description: 'Messaging & polls',
    route: '/(tabs)/chat',
    icon: <MessageSquare size={24} color="#FFFFFF" />,
    color: '#0EA5E9',
    category: 'tabs'
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'User profile management',
    route: '/(tabs)/profile',
    icon: <User size={24} color="#FFFFFF" />,
    color: '#64748B',
    category: 'tabs'
  },

  // Rink Management Pages
  {
    id: 'rink-dashboard',
    title: 'Rink Dashboard',
    description: 'Facility management overview',
    route: '/rink-dashboard',
    icon: <Building size={24} color="#FFFFFF" />,
    color: '#7C3AED',
    category: 'rink'
  },
  {
    id: 'schedule',
    title: 'Ice Schedule',
    description: 'Facility scheduling system',
    route: '/schedule',
    icon: <Calendar size={24} color="#FFFFFF" />,
    color: '#059669',
    category: 'rink'
  },
  {
    id: 'team-import',
    title: 'Team Import',
    description: 'Import/create team requests',
    route: '/team-import',
    icon: <Send size={24} color="#FFFFFF" />,
    color: '#DC2626',
    category: 'rink'
  },
  {
    id: 'booking-request',
    title: 'Book Ice Time',
    description: 'Request ice time booking',
    route: '/booking-request',
    icon: <MapPin size={24} color="#FFFFFF" />,
    color: '#0D9488',
    category: 'rink'
  },

  // Game Management Pages
  {
    id: 'game-details',
    title: 'Game Details',
    description: 'Detailed game information',
    route: '/game-details?id=1',
    icon: <Eye size={24} color="#FFFFFF" />,
    color: '#1D4ED8',
    category: 'game'
  },
  {
    id: 'scorekeeper',
    title: 'Basic Scorekeeper',
    description: 'Simple score tracking',
    route: '/scorekeeper?gameId=1',
    icon: <Trophy size={24} color="#FFFFFF" />,
    color: '#B91C1C',
    category: 'game'
  },
  {
    id: 'live-scorekeeper',
    title: 'Live Scorekeeper',
    description: 'Advanced live game tracking',
    route: '/live-scorekeeper?gameId=game-live-1',
    icon: <Play size={24} color="#FFFFFF" />,
    color: '#DC2626',
    category: 'game'
  },
  {
    id: 'schedule-game',
    title: 'Schedule Game',
    description: 'Manual game scheduling',
    route: '/schedule-game',
    icon: <Plus size={24} color="#FFFFFF" />,
    color: '#7C2D12',
    category: 'game'
  },

  // Payment Pages
  {
    id: 'payments',
    title: 'Payment Management',
    description: 'Season fees & payment tracking',
    route: '/payments',
    icon: <DollarSign size={24} color="#FFFFFF" />,
    color: '#059669',
    category: 'payment'
  },
  {
    id: 'payment-receipt',
    title: 'Payment Receipt',
    description: 'Payment confirmation & receipt',
    route: '/payment-receipt?paymentId=pay-1',
    icon: <Receipt size={24} color="#FFFFFF" />,
    color: '#0369A1',
    category: 'payment'
  },
  {
    id: 'stripe-onboarding',
    title: 'Stripe Setup',
    description: 'Payment system onboarding',
    route: '/stripe-onboarding?rinkId=rink-1',
    icon: <CreditCard size={24} color="#FFFFFF" />,
    color: '#635BFF',
    category: 'payment'
  },
  {
    id: 'subscription',
    title: 'Subscription Plans',
    description: 'Upgrade plans & billing',
    route: '/subscription',
    icon: <Settings size={24} color="#FFFFFF" />,
    color: '#7C3AED',
    category: 'payment'
  },

  // Management Pages
  {
    id: 'player-profile',
    title: 'Player Profile',
    description: 'Individual player details',
    route: '/player-profile?playerId=user-1',
    icon: <User size={24} color="#FFFFFF" />,
    color: '#0F766E',
    category: 'management'
  },
  {
    id: 'substitute-manager',
    title: 'Substitute Manager',
    description: 'Add substitute players',
    route: '/substitute-manager?gameId=1&teamId=team-1',
    icon: <UserCheck size={24} color="#FFFFFF" />,
    color: '#BE185D',
    category: 'management'
  },
  {
    id: 'broadcast',
    title: 'Broadcast Messages',
    description: 'Mass communication system',
    route: '/broadcast',
    icon: <Send size={24} color="#FFFFFF" />,
    color: '#9333EA',
    category: 'management'
  },
];

const categoryColors = {
  auth: '#F3F4F6',
  tabs: '#EFF6FF',
  rink: '#F0FDF4',
  game: '#FEF2F2',
  payment: '#ECFDF5',
  management: '#FDF4FF',
};

const categoryTitles = {
  auth: 'Authentication',
  tabs: 'Main App Tabs',
  rink: 'Rink Management',
  game: 'Game Features',
  payment: 'Payment System',
  management: 'User Management',
};

export default function AppOverviewScreen() {
  const groupedPages = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, PageInfo[]>);

  const renderPageCard = (page: PageInfo) => (
    <TouchableOpacity
      key={page.id}
      style={[styles.pageCard, isTablet && styles.tabletPageCard]}
      onPress={() => router.push(page.route as any)}
    >
      <View style={[styles.pageIcon, { backgroundColor: page.color }]}>
        {page.icon}
      </View>
      <View style={styles.pageContent}>
        <Text style={styles.pageTitle}>{page.title}</Text>
        <Text style={styles.pageDescription}>{page.description}</Text>
      </View>
      <ArrowRight size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  const renderCategory = (category: string, pages: PageInfo[]) => (
    <View key={category} style={styles.categorySection}>
      <View style={[styles.categoryHeader, { backgroundColor: categoryColors[category as keyof typeof categoryColors] }]}>
        <Text style={styles.categoryTitle}>{categoryTitles[category as keyof typeof categoryTitles]}</Text>
        <Text style={styles.categoryCount}>{pages.length} pages</Text>
      </View>
      <View style={styles.categoryPages}>
        {pages.map(renderPageCard)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Home size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Overview</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>HockeyHub App Structure</Text>
        <Text style={styles.summaryText}>
          {pages.length} total pages across {Object.keys(groupedPages).length} categories
        </Text>
        <View style={styles.summaryStats}>
          {Object.entries(groupedPages).map(([category, categoryPages]) => (
            <View key={category} style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{categoryPages.length}</Text>
              <Text style={styles.summaryStatLabel}>{categoryTitles[category as keyof typeof categoryTitles]}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedPages).map(([category, categoryPages]) =>
          renderCategory(category, categoryPages)
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
  },
  summaryStatItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  summaryStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  summaryStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  categoryPages: {
    gap: 8,
  },
  pageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    width: '100%',
  },
  tabletPageCard: {
    width: (width - 60) / 2,
  },
  pageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pageContent: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  pageDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 18,
  },
});