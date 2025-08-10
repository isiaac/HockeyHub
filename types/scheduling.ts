export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  rinkSurface: string; // e.g., "Rink 1", "Rink 2"
  programType: 'hockey_league' | 'figure_skating' | 'public_skate' | 'hockey_practice' | 'learn_to_skate' | 'birthday_party' | 'corporate_event' | 'maintenance' | 'other';
  title: string;
  description?: string;
  organizerName: string;
  organizerContact: string;
  participantCount?: number;
  maxCapacity?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recurring?: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    endDate: string;
  };
  pricing?: {
    hourlyRate: number;
    totalCost: number;
    paymentStatus: 'pending' | 'paid' | 'overdue';
  };
  equipment?: string[];
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RinkSurface {
  id: string;
  name: string;
  type: 'hockey' | 'figure_skating' | 'multi_purpose';
  capacity: number;
  isActive: boolean;
  maintenanceSchedule?: string[];
}

export interface ScheduleConflict {
  id: string;
  timeSlotId: string;
  conflictType: 'overlap' | 'maintenance' | 'capacity_exceeded';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface BookingRequest {
  id: string;
  requestedBy: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  programType: TimeSlot['programType'];
  preferredDates: string[];
  preferredTimes: string[];
  duration: number; // in hours
  participantCount: number;
  recurring?: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    duration: number; // weeks/months
  };
  specialRequests?: string;
  budgetRange?: {
    min: number;
    max: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'requires_modification';
  submittedAt: string;
  respondedAt?: string;
  notes?: string;
}

export interface ScheduleFilter {
  programTypes: TimeSlot['programType'][];
  rinkSurfaces: string[];
  dateRange: {
    start: string;
    end: string;
  };
  timeRange?: {
    start: string;
    end: string;
  };
  status: TimeSlot['status'][];
}