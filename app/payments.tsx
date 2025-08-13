import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard, DollarSign, Calendar, Users, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle, Receipt, Send, Plus } from 'lucide-react-native';
import { SeasonFee, PlayerPayment, Payment } from '@/types/payments';
import { StripeService } from '@/services/stripeService';

const mockSeasonFees: SeasonFee[] = [
  {
    id: 'fee-1',
    seasonId: 'season-2025',
    teamId: 'team-1',
    rinkId: 'rink-1',
    amount: 450.00,
    currency: 'USD',
    description: 'Winter 2025 Season Fee',
    dueDate: '2025-02-01',
    lateFeePenalty: 25.00,
    lateFeeDate: '2025-02-15',
    isRecurring: false,
    status: 'published',
    playerPayments: [
      {
        id: 'payment-1',
        seasonFeeId: 'fee-1',
        playerId: 'user-1',
        playerName: 'Alex Chen',
        playerEmail: 'alex@example.com',
        amount: 450.00,
        status: 'paid',
        paymentId: 'pay-1',
        paidAt: '2025-01-10T10:00:00Z',
        dueDate: '2025-02-01',
        remindersSent: 1,
        lastReminderSent: '2025-01-05T09:00:00Z',
      },
      {
        id: 'payment-2',
        seasonFeeId: 'fee-1',
        playerId: 'user-2',
        playerName: 'Morgan Davis',
        playerEmail: 'morgan@example.com',
        amount: 450.00,
        status: 'pending',
        dueDate: '2025-02-01',
        remindersSent: 0,
      },
      {
        id: 'payment-3',
        seasonFeeId: 'fee-1',
        playerId: 'user-3',
        playerName: 'Jordan Smith',
        playerEmail: 'jordan@example.com',
        amount: 450.00,
        status: 'overdue',
        dueDate: '2025-02-01',
        remindersSent: 2,
        lastReminderSent: '2025-02-10T09:00:00Z',
      },
    ],
    createdBy: 'rink-admin-1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
];

const mockPaymentHistory: Payment[] = [
  {
    id: 'pay-1',
    amount: 450.00,
    currency: 'USD',
    status: 'succeeded',
    paymentType: 'season_fee',
    description: 'Winter 2025 Season Fee',
    payerId: 'user-1',
    payerName: 'Alex Chen',
    payerEmail: 'alex@example.com',
    recipientRinkId: 'rink-1',
    recipientAccountId: 'acct_stripe123',
    teamId: 'team-1',
    seasonId: 'season-2025',
    stripePaymentIntentId: 'pi_stripe123',
    platformFee: 13.36,
    rinkAmount: 436.64,
    receiptUrl: 'https://stripe.com/receipt/123',
    metadata: {
      playerPosition: 'Center',
      jerseyNumber: '12',
    },
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
];

export default function PaymentsScreen() {
  const { rinkId, teamId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'fees' | 'history' | 'create'>('fees');
  const [seasonFees, setSeasonFees] = useState<SeasonFee[]>(mockSeasonFees);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>(mockPaymentHistory);
  const [selectedFee, setSelectedFee] = useState<SeasonFee | null>(null);
  const [loading, setLoading] = useState(false);
  const [newFeeForm, setNewFeeForm] = useState({
    description: '',
    amount: '',
    dueDate: '',
    lateFeePenalty: '',
    lateFeeDate: '',
  });

  useEffect(() => {
    loadPaymentData();
  }, [rinkId]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      // In production, load from API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      Alert.alert('Error', 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const createSeasonFee = async () => {
    if (!newFeeForm.description.trim() || !newFeeForm.amount.trim() || !newFeeForm.dueDate.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const newFee: SeasonFee = {
        id: `fee-${Date.now()}`,
        seasonId: 'season-2025',
        teamId: teamId as string || 'team-1',
        rinkId: rinkId as string || 'rink-1',
        amount: parseFloat(newFeeForm.amount),
        currency: 'USD',
        description: newFeeForm.description,
        dueDate: newFeeForm.dueDate,
        lateFeePenalty: newFeeForm.lateFeePenalty ? parseFloat(newFeeForm.lateFeePenalty) : undefined,
        lateFeeDate: newFeeForm.lateFeeDate || undefined,
        isRecurring: false,
        status: 'published',
        playerPayments: [], // Will be populated when players are assigned
        createdBy: 'rink-admin-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSeasonFees(prev => [...prev, newFee]);
      setNewFeeForm({ description: '', amount: '', dueDate: '', lateFeePenalty: '', lateFeeDate: '' });
      setActiveTab('fees');
      
      Alert.alert('Success', 'Season fee created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create season fee');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (playerPayment: PlayerPayment, seasonFee: SeasonFee) => {
    try {
      setLoading(true);
      
      // Create payment intent with Stripe Connect
      const { clientSecret, paymentIntentId } = await StripeService.createSeasonFeePayment(
        seasonFee,
        playerPayment.playerId,
        playerPayment.playerEmail,
        'acct_stripe123' // Rink's Stripe Connect account ID
      );

      // In a real app, you'd use Stripe's payment sheet here
      // For demo purposes, we'll simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      const payment = await StripeService.confirmPayment(
        paymentIntentId,
        seasonFee.id,
        playerPayment.playerId
      );

      // Update local state
      setSeasonFees(prev => prev.map(fee => 
        fee.id === seasonFee.id 
          ? {
              ...fee,
              playerPayments: fee.playerPayments.map(pp =>
                pp.id === playerPayment.id
                  ? { ...pp, status: 'paid', paidAt: new Date().toISOString(), paymentId: payment.id }
                  : pp
              )
            }
          : fee
      ));

      Alert.alert('Success', `Payment of ${StripeService.formatCurrency(seasonFee.amount)} processed successfully`);
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const sendPaymentReminder = async (playerPayment: PlayerPayment) => {
    try {
      await StripeService.sendPaymentReminder(playerPayment.playerId, playerPayment.seasonFeeId, 'email');
      
      // Update reminder count
      setSeasonFees(prev => prev.map(fee => 
        fee.id === playerPayment.seasonFeeId
          ? {
              ...fee,
              playerPayments: fee.playerPayments.map(pp =>
                pp.id === playerPayment.id
                  ? { 
                      ...pp, 
                      remindersSent: pp.remindersSent + 1,
                      lastReminderSent: new Date().toISOString()
                    }
                  : pp
              )
            }
          : fee
      ));

      Alert.alert('Success', `Payment reminder sent to ${playerPayment.playerName}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send reminder');
    }
  };

  const getPaymentStatusColor = (status: PlayerPayment['status']) => {
    switch (status) {
      case 'paid': return '#16A34A';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      case 'waived': return '#8B5CF6';
      case 'refunded': return '#64748B';
      default: return '#64748B';
    }
  };

  const getPaymentStatusIcon = (status: PlayerPayment['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} color="#16A34A" />;
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'overdue': return <AlertTriangle size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#64748B" />;
    }
  };

  const renderSeasonFee = (fee: SeasonFee) => {
    const totalPlayers = fee.playerPayments.length;
    const paidPlayers = fee.playerPayments.filter(p => p.status === 'paid').length;
    const totalCollected = fee.playerPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const platformFees = totalCollected * StripeService.PLATFORM_FEE_PERCENTAGE;
    const rinkAmount = totalCollected - platformFees;

    return (
      <TouchableOpacity
        key={fee.id}
        style={styles.seasonFeeCard}
        onPress={() => setSelectedFee(selectedFee?.id === fee.id ? null : fee)}
      >
        <View style={styles.feeHeader}>
          <View style={styles.feeInfo}>
            <Text style={styles.feeTitle}>{fee.description}</Text>
            <Text style={styles.feeAmount}>{StripeService.formatCurrency(fee.amount)}</Text>
          </View>
          <View style={styles.feeStats}>
            <Text style={styles.feeStatsText}>{paidPlayers}/{totalPlayers} paid</Text>
            <Text style={styles.feeCollected}>{StripeService.formatCurrency(totalCollected)} collected</Text>
          </View>
        </View>

        <View style={styles.feeProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${totalPlayers > 0 ? (paidPlayers / totalPlayers) * 100 : 0}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {totalPlayers > 0 ? Math.round((paidPlayers / totalPlayers) * 100) : 0}% complete
          </Text>
        </View>

        {selectedFee?.id === fee.id && (
          <View style={styles.feeDetails}>
            <View style={styles.feeFinancials}>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Total Collected:</Text>
                <Text style={styles.financialValue}>{StripeService.formatCurrency(totalCollected)}</Text>
              </View>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Platform Fees:</Text>
                <Text style={styles.financialValue}>-{StripeService.formatCurrency(platformFees)}</Text>
              </View>
              <View style={[styles.financialRow, styles.financialTotal]}>
                <Text style={styles.financialLabel}>Rink Receives:</Text>
                <Text style={[styles.financialValue, styles.financialTotalValue]}>
                  {StripeService.formatCurrency(rinkAmount)}
                </Text>
              </View>
            </View>

            <View style={styles.playerPaymentsList}>
              <Text style={styles.playerPaymentsTitle}>Player Payments</Text>
              {fee.playerPayments.map(playerPayment => (
                <View key={playerPayment.id} style={styles.playerPaymentRow}>
                  <View style={styles.playerPaymentInfo}>
                    <Text style={styles.playerPaymentName}>{playerPayment.playerName}</Text>
                    <Text style={styles.playerPaymentEmail}>{playerPayment.playerEmail}</Text>
                  </View>
                  
                  <View style={styles.playerPaymentStatus}>
                    <View style={styles.paymentStatusBadge}>
                      {getPaymentStatusIcon(playerPayment.status)}
                      <Text style={[
                        styles.paymentStatusText,
                        { color: getPaymentStatusColor(playerPayment.status) }
                      ]}>
                        {playerPayment.status.toUpperCase()}
                      </Text>
                    </View>
                    
                    <View style={styles.playerPaymentActions}>
                      {playerPayment.status === 'pending' && (
                        <TouchableOpacity
                          style={styles.payNowButton}
                          onPress={() => processPayment(playerPayment, fee)}
                        >
                          <CreditCard size={14} color="#FFFFFF" />
                          <Text style={styles.payNowText}>Pay Now</Text>
                        </TouchableOpacity>
                      )}
                      
                      {(playerPayment.status === 'pending' || playerPayment.status === 'overdue') && (
                        <TouchableOpacity
                          style={styles.reminderButton}
                          onPress={() => sendPaymentReminder(playerPayment)}
                        >
                          <Send size={14} color="#F59E0B" />
                        </TouchableOpacity>
                      )}
                      
                      {playerPayment.status === 'paid' && playerPayment.paymentId && (
                        <TouchableOpacity
                          style={styles.receiptButton}
                          onPress={() => router.push(`/payment-receipt?paymentId=${playerPayment.paymentId}`)}
                        >
                          <Receipt size={14} color="#0EA5E9" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPaymentHistoryItem = (payment: Payment) => (
    <View key={payment.id} style={styles.paymentHistoryCard}>
      <View style={styles.paymentHistoryHeader}>
        <View style={styles.paymentHistoryInfo}>
          <Text style={styles.paymentHistoryDescription}>{payment.description}</Text>
          <Text style={styles.paymentHistoryPayer}>{payment.payerName} • {payment.payerEmail}</Text>
          <Text style={styles.paymentHistoryDate}>
            {new Date(payment.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.paymentHistoryAmount}>
          <Text style={styles.paymentHistoryTotal}>
            {StripeService.formatCurrency(payment.amount)}
          </Text>
          <Text style={styles.paymentHistoryFee}>
            Platform fee: {StripeService.formatCurrency(payment.platformFee)}
          </Text>
          <Text style={styles.paymentHistoryNet}>
            Rink receives: {StripeService.formatCurrency(payment.rinkAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.paymentHistoryFooter}>
        <View style={[styles.paymentStatusBadge, { backgroundColor: getPaymentStatusColor(payment.status as any) }]}>
          <Text style={styles.paymentStatusText}>{payment.status.toUpperCase()}</Text>
        </View>
        
        <View style={styles.paymentHistoryActions}>
          {payment.receiptUrl && (
            <TouchableOpacity
              style={styles.receiptButton}
              onPress={() => router.push(`/payment-receipt?paymentId=${payment.id}`)}
            >
              <Receipt size={16} color="#0EA5E9" />
              <Text style={styles.receiptButtonText}>Receipt</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderCreateFeeForm = () => (
    <View style={styles.createFeeContainer}>
      <Text style={styles.createFeeTitle}>Create New Season Fee</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Description *</Text>
        <TextInput
          style={styles.formInput}
          value={newFeeForm.description}
          onChangeText={(text) => setNewFeeForm(prev => ({ ...prev, description: text }))}
          placeholder="Winter 2025 Season Fee"
        />
      </View>

      <View style={styles.formRow}>
        <View style={styles.formGroupHalf}>
          <Text style={styles.formLabel}>Amount (USD) *</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign size={20} color="#64748B" />
            <TextInput
              style={styles.formInputField}
              value={newFeeForm.amount}
              onChangeText={(text) => setNewFeeForm(prev => ({ ...prev, amount: text }))}
              placeholder="450.00"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        
        <View style={styles.formGroupHalf}>
          <Text style={styles.formLabel}>Due Date *</Text>
          <View style={styles.inputWithIcon}>
            <Calendar size={20} color="#64748B" />
            <TextInput
              style={styles.formInputField}
              value={newFeeForm.dueDate}
              onChangeText={(text) => setNewFeeForm(prev => ({ ...prev, dueDate: text }))}
              placeholder="2025-02-01"
            />
          </View>
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={styles.formGroupHalf}>
          <Text style={styles.formLabel}>Late Fee Penalty</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign size={20} color="#64748B" />
            <TextInput
              style={styles.formInputField}
              value={newFeeForm.lateFeePenalty}
              onChangeText={(text) => setNewFeeForm(prev => ({ ...prev, lateFeePenalty: text }))}
              placeholder="25.00"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        
        <View style={styles.formGroupHalf}>
          <Text style={styles.formLabel}>Late Fee Date</Text>
          <View style={styles.inputWithIcon}>
            <Calendar size={20} color="#64748B" />
            <TextInput
              style={styles.formInputField}
              value={newFeeForm.lateFeeDate}
              onChangeText={(text) => setNewFeeForm(prev => ({ ...prev, lateFeeDate: text }))}
              placeholder="2025-02-15"
            />
          </View>
        </View>
      </View>

      <View style={styles.feePreview}>
        <Text style={styles.feePreviewTitle}>Fee Breakdown</Text>
        {newFeeForm.amount && (
          <View style={styles.feeBreakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Player Pays:</Text>
              <Text style={styles.breakdownValue}>
                {StripeService.formatCurrency(parseFloat(newFeeForm.amount) || 0)}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Fee:</Text>
              <Text style={styles.breakdownValue}>
                -{StripeService.formatCurrency(StripeService.calculatePlatformFee(parseFloat(newFeeForm.amount) || 0))}
              </Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownTotal]}>
              <Text style={styles.breakdownLabel}>Rink Receives:</Text>
              <Text style={[styles.breakdownValue, styles.breakdownTotalValue]}>
                {StripeService.formatCurrency(StripeService.calculateRinkAmount(parseFloat(newFeeForm.amount) || 0))}
              </Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.createFeeButton, loading && styles.disabledButton]}
        onPress={createSeasonFee}
        disabled={loading}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.createFeeButtonText}>
          {loading ? 'Creating...' : 'Create Season Fee'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Management</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'fees' && styles.activeTab]}
          onPress={() => setActiveTab('fees')}
        >
          <DollarSign size={20} color={activeTab === 'fees' ? '#0EA5E9' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'fees' && styles.activeTabText]}>Season Fees</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Receipt size={20} color={activeTab === 'history' ? '#0EA5E9' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Payment History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Plus size={20} color={activeTab === 'create' ? '#0EA5E9' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>Create Fee</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'fees' && (
          <View style={styles.seasonFeesContainer}>
            <Text style={styles.sectionTitle}>Active Season Fees</Text>
            <View style={styles.seasonFeesList}>
              {seasonFees.map(renderSeasonFee)}
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.paymentHistoryContainer}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            <View style={styles.paymentHistoryList}>
              {paymentHistory.map(renderPaymentHistoryItem)}
            </View>
          </View>
        )}

        {activeTab === 'create' && renderCreateFeeForm()}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeTabText: {
    color: '#0EA5E9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  seasonFeesContainer: {
    paddingBottom: 20,
  },
  seasonFeesList: {
    gap: 16,
  },
  seasonFeeCard: {
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
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  feeInfo: {
    flex: 1,
  },
  feeTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  feeAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  feeStats: {
    alignItems: 'flex-end',
  },
  feeStatsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  feeCollected: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  feeProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    textAlign: 'center',
  },
  feeDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    gap: 20,
  },
  feeFinancials: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financialTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 8,
  },
  financialLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  financialValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  financialTotalValue: {
    color: '#16A34A',
    fontSize: 18,
  },
  playerPaymentsList: {
    gap: 12,
  },
  playerPaymentsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  playerPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  playerPaymentInfo: {
    flex: 1,
  },
  playerPaymentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  playerPaymentEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  playerPaymentStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  playerPaymentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  payNowButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  payNowText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  reminderButton: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
  },
  receiptButton: {
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  receiptButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  paymentHistoryContainer: {
    paddingBottom: 20,
  },
  paymentHistoryList: {
    gap: 16,
  },
  paymentHistoryCard: {
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
  paymentHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentHistoryInfo: {
    flex: 1,
  },
  paymentHistoryDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  paymentHistoryPayer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  paymentHistoryDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  paymentHistoryAmount: {
    alignItems: 'flex-end',
  },
  paymentHistoryTotal: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  paymentHistoryFee: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginBottom: 2,
  },
  paymentHistoryNet: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  paymentHistoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentHistoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  createFeeContainer: {
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
  },
  createFeeTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
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
  formInputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  feePreview: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  feePreviewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  feeBreakdown: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  breakdownValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  breakdownTotalValue: {
    color: '#16A34A',
    fontSize: 18,
  },
  createFeeButton: {
    backgroundColor: '#0EA5E9',
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
  createFeeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});