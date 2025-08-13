import { PaymentAccount, Payment, SeasonFee, PlayerPayment } from '@/types/payments';

export class StripeService {
  private static readonly PLATFORM_FEE_PERCENTAGE = 0.029; // 2.9%
  private static readonly PLATFORM_FEE_FIXED = 0.30; // $0.30

  // Stripe Connect Account Management
  static async createConnectAccount(rinkId: string, rinkName: string, email: string): Promise<PaymentAccount> {
    try {
      // In production, this would call your backend API which then calls Stripe
      const response = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rinkId,
          rinkName,
          email,
          type: 'express', // Simplified onboarding
          country: 'US', // or detect from rink location
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe Connect account');
      }

      const data = await response.json();
      
      return {
        id: `account-${Date.now()}`,
        rinkId,
        stripeAccountId: data.accountId,
        accountStatus: 'pending',
        onboardingComplete: false,
        payoutsEnabled: false,
        chargesEnabled: false,
        requirements: {
          currently_due: data.requirements?.currently_due || [],
          eventually_due: data.requirements?.eventually_due || [],
          past_due: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Failed to create payment account');
    }
  }

  static async createOnboardingLink(accountId: string, refreshUrl: string, returnUrl: string): Promise<string> {
    try {
      const response = await fetch('/api/stripe/create-onboarding-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          refreshUrl,
          returnUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create onboarding link');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error('Failed to create onboarding link');
    }
  }

  // Payment Processing
  static async createSeasonFeePayment(
    seasonFee: SeasonFee,
    playerId: string,
    playerEmail: string,
    rinkAccountId: string
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      const platformFee = Math.round(
        (seasonFee.amount * this.PLATFORM_FEE_PERCENTAGE + this.PLATFORM_FEE_FIXED) * 100
      );

      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: seasonFee.amount * 100, // Convert to cents
          currency: seasonFee.currency,
          applicationFeeAmount: platformFee,
          stripeAccount: rinkAccountId,
          metadata: {
            seasonFeeId: seasonFee.id,
            playerId,
            teamId: seasonFee.teamId,
            rinkId: seasonFee.rinkId,
            paymentType: 'season_fee',
          },
          description: `${seasonFee.description} - Player: ${playerEmail}`,
          receiptEmail: playerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to create payment');
    }
  }

  static async confirmPayment(
    paymentIntentId: string,
    seasonFeeId: string,
    playerId: string
  ): Promise<Payment> {
    try {
      const response = await fetch('/api/stripe/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          seasonFeeId,
          playerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Payment confirmation failed');
    }
  }

  // Payment Management
  static async getPaymentHistory(rinkId: string, limit: number = 50): Promise<Payment[]> {
    try {
      const response = await fetch(`/api/payments/history?rinkId=${rinkId}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to load payment history');
    }
  }

  static async createRefund(
    paymentId: string,
    amount: number,
    reason: string
  ): Promise<RefundRequest> {
    try {
      const response = await fetch('/api/stripe/create-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          amount: amount * 100, // Convert to cents
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create refund');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Refund creation failed');
    }
  }

  // Utility Methods
  static calculatePlatformFee(amount: number): number {
    return Math.round((amount * this.PLATFORM_FEE_PERCENTAGE + this.PLATFORM_FEE_FIXED) * 100) / 100;
  }

  static calculateRinkAmount(amount: number): number {
    return amount - this.calculatePlatformFee(amount);
  }

  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Account Status Checking
  static async getAccountStatus(accountId: string): Promise<PaymentAccount> {
    try {
      const response = await fetch(`/api/stripe/account-status?accountId=${accountId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get account status');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to check account status');
    }
  }

  static async sendPaymentReminder(playerId: string, seasonFeeId: string, method: 'email' | 'sms'): Promise<void> {
    try {
      const response = await fetch('/api/payments/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          seasonFeeId,
          method,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send payment reminder');
      }
    } catch (error) {
      throw new Error('Failed to send reminder');
    }
  }
}