import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Download, Share2, CheckCircle, Receipt, Calendar, CreditCard, Building, User } from 'lucide-react-native';
import { Payment } from '@/types/payments';
import { StripeService } from '@/services/stripeService';

const mockPayment: Payment = {
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
    teamName: 'Ice Wolves',
    rinkName: 'Central Ice Complex',
  },
  createdAt: '2025-01-10T10:00:00Z',
  updatedAt: '2025-01-10T10:00:00Z',
};

export default function PaymentReceiptScreen() {
  const { paymentId } = useLocalSearchParams();
  const [payment, setPayment] = useState<Payment>(mockPayment);
  const [loading, setLoading] = useState(false);

  const shareReceipt = async () => {
    try {
      const receiptText = `
Payment Receipt - ${payment.description}

Amount: ${StripeService.formatCurrency(payment.amount)}
Date: ${new Date(payment.createdAt).toLocaleDateString()}
Player: ${payment.payerName}
Team: ${payment.metadata.teamName}
Rink: ${payment.metadata.rinkName}
Transaction ID: ${payment.id}

Thank you for your payment!
      `.trim();

      await Share.share({
        message: receiptText,
        title: 'Payment Receipt',
      });
    } catch (error) {
      console.error('Failed to share receipt:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Receipt</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareReceipt}>
          <Share2 size={20} color="#0EA5E9" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color="#16A34A" />
            </View>
            <Text style={styles.successTitle}>Payment Successful</Text>
            <Text style={styles.successSubtitle}>Your payment has been processed</Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <Text style={styles.amountValue}>
              {StripeService.formatCurrency(payment.amount)}
            </Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Payment Details</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Receipt size={20} color="#64748B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{payment.description}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Calendar size={20} color="#64748B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Payment Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(payment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <User size={20} color="#64748B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Player</Text>
                <Text style={styles.detailValue}>{payment.payerName}</Text>
                <Text style={styles.detailSubvalue}>{payment.payerEmail}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Building size={20} color="#64748B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Ice Rink</Text>
                <Text style={styles.detailValue}>{payment.metadata.rinkName}</Text>
                <Text style={styles.detailSubvalue}>Team: {payment.metadata.teamName}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <CreditCard size={20} color="#64748B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Transaction ID</Text>
                <Text style={styles.detailValue}>{payment.id}</Text>
                <Text style={styles.detailSubvalue}>Stripe ID: {payment.stripePaymentIntentId}</Text>
              </View>
            </View>
          </View>

          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
            
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Total Amount</Text>
              <Text style={styles.breakdownValue}>
                {StripeService.formatCurrency(payment.amount)}
              </Text>
            </View>
            
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Fee</Text>
              <Text style={styles.breakdownValue}>
                -{StripeService.formatCurrency(payment.platformFee)}
              </Text>
            </View>
            
            <View style={[styles.breakdownRow, styles.breakdownTotal]}>
              <Text style={styles.breakdownLabel}>Rink Receives</Text>
              <Text style={[styles.breakdownValue, styles.breakdownTotalValue]}>
                {StripeService.formatCurrency(payment.rinkAmount)}
              </Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton} onPress={shareReceipt}>
              <Share2 size={20} color="#0EA5E9" />
              <Text style={styles.shareButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Questions about this payment? Contact {payment.metadata.rinkName} directly or reach out to our support team.
            </Text>
          </View>
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  receiptCard: {
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
    marginBottom: 20,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  amountSection: {
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  detailsSection: {
    marginBottom: 32,
  },
  detailsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  detailSubvalue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  breakdownSection: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  breakdownTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    marginTop: 8,
  },
  breakdownLabel: {
    fontSize: 16,
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
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  footerSection: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});