export interface PaymentAccount {
  id: string;
  rinkId: string;
  stripeAccountId: string;
  accountStatus: 'pending' | 'active' | 'restricted' | 'inactive';
  onboardingComplete: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  paymentType: 'season_fee' | 'team_dues' | 'ice_time' | 'equipment' | 'tournament_entry';
  description: string;
  payerId: string;
  payerName: string;
  payerEmail: string;
  recipientRinkId: string;
  recipientAccountId: string;
  teamId?: string;
  seasonId?: string;
  stripePaymentIntentId: string;
  platformFee: number;
  rinkAmount: number;
  receiptUrl?: string;
  refundedAmount?: number;
  metadata: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SeasonFee {
  id: string;
  seasonId: string;
  teamId: string;
  rinkId: string;
  amount: number;
  currency: string;
  description: string;
  dueDate: string;
  lateFeePenalty?: number;
  lateFeeDate?: string;
  isRecurring: boolean;
  recurringInterval?: 'monthly' | 'quarterly' | 'annually';
  status: 'draft' | 'published' | 'archived';
  playerPayments: PlayerPayment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerPayment {
  id: string;
  seasonFeeId: string;
  playerId: string;
  playerName: string;
  playerEmail: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'waived' | 'refunded';
  paymentId?: string;
  paidAt?: string;
  dueDate: string;
  remindersSent: number;
  lastReminderSent?: string;
  waivedBy?: string;
  waivedReason?: string;
  notes?: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  totalAmount: number;
  installments: PaymentInstallment[];
  teamId: string;
  rinkId: string;
  seasonId: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaymentInstallment {
  id: string;
  planId: string;
  amount: number;
  dueDate: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentId?: string;
}

export interface PaymentReminder {
  id: string;
  playerId: string;
  seasonFeeId: string;
  type: 'initial' | 'reminder' | 'final_notice' | 'overdue';
  sentAt: string;
  method: 'email' | 'sms' | 'push';
  status: 'sent' | 'delivered' | 'failed' | 'opened';
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  requestedBy: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  approvedBy?: string;
  processedAt?: string;
  stripeRefundId?: string;
  createdAt: string;
}

export interface PaymentAnalytics {
  rinkId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionAmount: number;
  platformFees: number;
  refundedAmount: number;
  outstandingAmount: number;
  paymentMethods: {
    card: number;
    bank_transfer: number;
    other: number;
  };
  topPaymentTypes: {
    type: string;
    amount: number;
    count: number;
  }[];
}