import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Check, Crown, Zap, Users, Building } from 'lucide-react-native';
import { TEAM_PLANS, RINK_PLANS, SubscriptionPlan } from '@/types/subscription';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SubscriptionScreen() {
  const [selectedType, setSelectedType] = useState<'team' | 'rink'>('team');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlans = selectedType === 'team' ? TEAM_PLANS : RINK_PLANS;

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const savings = billingCycle === 'yearly' ? Math.round(((plan.price.monthly * 12) - plan.price.yearly) / (plan.price.monthly * 12) * 100) : 0;

    return (
      <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularPlan]}>
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Crown size={16} color="#FFFFFF" />
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}
        
        <Text style={styles.planName}>{plan.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            ${price === 0 ? 'Free' : price.toFixed(2)}
          </Text>
          {price > 0 && (
            <Text style={styles.pricePeriod}>/{billingCycle === 'monthly' ? 'month' : 'year'}</Text>
          )}
        </View>
        
        {savings > 0 && (
          <Text style={styles.savings}>Save {savings}% yearly</Text>
        )}

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Check size={16} color="#16A34A" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.limitsContainer}>
          {plan.limits.teams && plan.limits.teams > 0 && (
            <Text style={styles.limitText}>
              {plan.limits.teams === -1 ? 'Unlimited' : plan.limits.teams} teams
            </Text>
          )}
          {plan.limits.players && plan.limits.players > 0 && (
            <Text style={styles.limitText}>
              {plan.limits.players === -1 ? 'Unlimited' : plan.limits.players} players
            </Text>
          )}
          {plan.limits.storage && (
            <Text style={styles.limitText}>{plan.limits.storage} storage</Text>
          )}
        </View>

        <TouchableOpacity style={[styles.selectButton, plan.popular && styles.popularButton]}>
          <Text style={[styles.selectButtonText, plan.popular && styles.popularButtonText]}>
            {price === 0 ? 'Get Started' : 'Choose Plan'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, selectedType === 'team' && styles.activeTypeButton]}
            onPress={() => setSelectedType('team')}
          >
            <Users size={20} color={selectedType === 'team' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.typeButtonText, selectedType === 'team' && styles.activeTypeButtonText]}>
              Team Plans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, selectedType === 'rink' && styles.activeTypeButton]}
            onPress={() => setSelectedType('rink')}
          >
            <Building size={20} color={selectedType === 'rink' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.typeButtonText, selectedType === 'rink' && styles.activeTypeButtonText]}>
              Ice Rink Plans
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.billingButton, billingCycle === 'monthly' && styles.activeBillingButton]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text style={[styles.billingButtonText, billingCycle === 'monthly' && styles.activeBillingButtonText]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingButton, billingCycle === 'yearly' && styles.activeBillingButton]}
            onPress={() => setBillingCycle('yearly')}
          >
            <Text style={[styles.billingButtonText, billingCycle === 'yearly' && styles.activeBillingButtonText]}>
              Yearly
            </Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save up to 20%</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={isTablet ? styles.plansGrid : styles.plansList}>
          {currentPlans.map(renderPlanCard)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All plans include 14-day free trial • Cancel anytime • No setup fees
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
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTypeButton: {
    backgroundColor: '#0EA5E9',
  },
  typeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  billingButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    position: 'relative',
  },
  activeBillingButton: {
    backgroundColor: '#FFFFFF',
  },
  billingButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeBillingButtonText: {
    color: '#1E293B',
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  plansList: {
    gap: 16,
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: isTablet ? (width - 60) / 3 : '100%',
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#0EA5E9',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    right: 20,
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  popularText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  planName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  pricePeriod: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  savings: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
  limitsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 4,
  },
  limitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#0EA5E9',
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
  },
  popularButtonText: {
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 32,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});