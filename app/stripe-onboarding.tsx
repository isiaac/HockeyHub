import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard, Building, CircleCheck as CheckCircle, ExternalLink, Shield, DollarSign, Users, ChartBar as BarChart3 } from 'lucide-react-native';
import { PaymentAccount } from '@/types/payments';
import { StripeService } from '@/services/stripeService';

export default function StripeOnboardingScreen() {
  const { rinkId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'intro' | 'creating' | 'onboarding' | 'complete'>('intro');
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount | null>(null);

  const startOnboarding = async () => {
    try {
      setLoading(true);
      setOnboardingStep('creating');

      // Create Stripe Connect account
      const account = await StripeService.createConnectAccount(
        rinkId as string,
        'Central Ice Complex', // In production, get from rink data
        'admin@centralicea.com' // In production, get from rink data
      );

      setPaymentAccount(account);

      // Create onboarding link
      const onboardingUrl = await StripeService.createOnboardingLink(
        account.stripeAccountId,
        `hockeyapp://stripe-onboarding?rinkId=${rinkId}`, // Refresh URL
        `hockeyapp://stripe-onboarding-complete?rinkId=${rinkId}` // Return URL
      );

      setOnboardingStep('onboarding');
      
      // In production, open the onboarding URL in a web browser
      Alert.alert(
        'Stripe Onboarding',
        'You will now be redirected to Stripe to complete your account setup. This is required to receive payments.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue to Stripe', 
            onPress: () => {
              // In production: Linking.openURL(onboardingUrl);
              // For demo, simulate completion
              setTimeout(() => {
                setOnboardingStep('complete');
                setPaymentAccount(prev => prev ? {
                  ...prev,
                  accountStatus: 'active',
                  onboardingComplete: true,
                  payoutsEnabled: true,
                  chargesEnabled: true,
                } : null);
              }, 3000);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start onboarding process');
      setOnboardingStep('intro');
    } finally {
      setLoading(false);
    }
  };

  const renderIntroStep = () => (
    <View style={styles.introContainer}>
      <View style={styles.introHeader}>
        <View style={styles.stripeIcon}>
          <CreditCard size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.introTitle}>Set Up Payments</Text>
        <Text style={styles.introSubtitle}>
          Connect your ice rink to Stripe to start accepting payments from players and teams
        </Text>
      </View>

      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>What you'll get:</Text>
        
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <DollarSign size={24} color="#16A34A" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Direct Payments</Text>
              <Text style={styles.benefitDescription}>
                Receive payments directly to your bank account within 2 business days
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Users size={24} color="#0EA5E9" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Automated Collection</Text>
              <Text style={styles.benefitDescription}>
                Automatic season fee collection with payment reminders and tracking
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <BarChart3 size={24} color="#8B5CF6" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Financial Reporting</Text>
              <Text style={styles.benefitDescription}>
                Detailed payment analytics and financial reporting for your facility
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Shield size={24} color="#F59E0B" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Secure & Compliant</Text>
              <Text style={styles.benefitDescription}>
                PCI-compliant payment processing with fraud protection and dispute management
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.feeStructure}>
        <Text style={styles.feeStructureTitle}>Transparent Pricing</Text>
        <View style={styles.feeStructureContent}>
          <Text style={styles.feeStructureText}>
            Platform fee: 2.9% + $0.30 per transaction
          </Text>
          <Text style={styles.feeStructureSubtext}>
            Standard Stripe processing fees apply. No monthly fees or hidden charges.
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.startOnboardingButton, loading && styles.disabledButton]}
        onPress={startOnboarding}
        disabled={loading}
      >
        <CreditCard size={20} color="#FFFFFF" />
        <Text style={styles.startOnboardingText}>
          {loading ? 'Setting up...' : 'Connect with Stripe'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOnboardingStep = () => (
    <View style={styles.onboardingContainer}>
      <View style={styles.onboardingHeader}>
        <View style={styles.loadingIcon}>
          <CreditCard size={32} color="#0EA5E9" />
        </View>
        <Text style={styles.onboardingTitle}>Completing Setup</Text>
        <Text style={styles.onboardingSubtitle}>
          Please complete the Stripe onboarding process to start accepting payments
        </Text>
      </View>

      <View style={styles.onboardingSteps}>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>Verify your business information</Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>Add your bank account details</Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>Confirm your identity</Text>
        </View>
      </View>

      <View style={styles.onboardingNote}>
        <Text style={styles.onboardingNoteText}>
          This process typically takes 2-3 minutes. You'll be redirected back to the app once complete.
        </Text>
      </View>
    </View>
  );

  const renderCompleteStep = () => (
    <View style={styles.completeContainer}>
      <View style={styles.completeHeader}>
        <View style={styles.successIcon}>
          <CheckCircle size={64} color="#16A34A" />
        </View>
        <Text style={styles.completeTitle}>Setup Complete!</Text>
        <Text style={styles.completeSubtitle}>
          Your ice rink is now ready to accept payments
        </Text>
      </View>

      <View style={styles.accountInfo}>
        <Text style={styles.accountInfoTitle}>Account Status</Text>
        <View style={styles.accountStatusGrid}>
          <View style={styles.statusItem}>
            <CheckCircle size={20} color="#16A34A" />
            <Text style={styles.statusText}>Charges Enabled</Text>
          </View>
          <View style={styles.statusItem}>
            <CheckCircle size={20} color="#16A34A" />
            <Text style={styles.statusText}>Payouts Enabled</Text>
          </View>
          <View style={styles.statusItem}>
            <CheckCircle size={20} color="#16A34A" />
            <Text style={styles.statusText}>Account Verified</Text>
          </View>
        </View>
      </View>

      <View style={styles.nextSteps}>
        <Text style={styles.nextStepsTitle}>What's Next?</Text>
        <View style={styles.nextStepsList}>
          <Text style={styles.nextStepItem}>• Create season fees for your teams</Text>
          <Text style={styles.nextStepItem}>• Set up automatic payment reminders</Text>
          <Text style={styles.nextStepItem}>• Track payments and generate reports</Text>
          <Text style={styles.nextStepItem}>• Manage refunds and disputes</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => router.push('/payments')}
      >
        <Text style={styles.continueButtonText}>Go to Payment Management</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Setup</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {onboardingStep === 'intro' && renderIntroStep()}
        {onboardingStep === 'onboarding' && renderOnboardingStep()}
        {onboardingStep === 'complete' && renderCompleteStep()}
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
  introContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  introHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stripeIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#635BFF',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  introSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsSection: {
    marginBottom: 40,
  },
  benefitsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  benefitsList: {
    gap: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  feeStructure: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  feeStructureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  feeStructureContent: {
    gap: 8,
  },
  feeStructureText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0EA5E9',
  },
  feeStructureSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  startOnboardingButton: {
    backgroundColor: '#635BFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  startOnboardingText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  onboardingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  onboardingHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingIcon: {
    marginBottom: 20,
  },
  onboardingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  onboardingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  onboardingSteps: {
    gap: 16,
    marginBottom: 32,
    alignSelf: 'stretch',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
  },
  onboardingNote: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
  },
  onboardingNoteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0EA5E9',
    textAlign: 'center',
  },
  completeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  completeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  completeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  accountInfo: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    alignSelf: 'stretch',
  },
  accountInfoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  accountStatusGrid: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  nextSteps: {
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  nextStepsList: {
    gap: 8,
  },
  nextStepItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});