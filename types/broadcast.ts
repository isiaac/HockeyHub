export interface BroadcastMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'coach' | 'captain' | 'rink_admin';
  teamId: string;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channels: BroadcastChannel[];
  recipients: BroadcastRecipient[];
  scheduledFor?: string; // ISO date string for scheduled messages
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  deliveryStats: {
    total: number;
    delivered: number;
    failed: number;
    pending: number;
  };
  createdAt: string;
  sentAt?: string;
}

export interface BroadcastChannel {
  type: 'push' | 'email' | 'sms';
  enabled: boolean;
}

export interface BroadcastRecipient {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'player' | 'coach' | 'parent' | 'staff';
  deliveryStatus: {
    push?: 'pending' | 'delivered' | 'failed';
    email?: 'pending' | 'delivered' | 'failed' | 'bounced';
    sms?: 'pending' | 'delivered' | 'failed';
  };
  preferences: {
    allowPush: boolean;
    allowEmail: boolean;
    allowSMS: boolean;
  };
}

export interface BroadcastTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  category: 'game_reminder' | 'practice_update' | 'emergency' | 'general' | 'custom';
  isDefault: boolean;
  createdBy: string;
  teamId?: string; // null for system templates
}

export interface NotificationPreferences {
  userId: string;
  allowPushNotifications: boolean;
  allowEmailNotifications: boolean;
  allowSMSNotifications: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  emergencyOverride: boolean; // Allow urgent messages during quiet hours
  categories: {
    gameReminders: boolean;
    practiceUpdates: boolean;
    teamNews: boolean;
    emergencyAlerts: boolean;
  };
}