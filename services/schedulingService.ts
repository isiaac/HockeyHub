import { TimeSlot, BookingRequest, ScheduleConflict, RinkSurface } from '@/types/scheduling';

export class SchedulingService {
  static async getTimeSlots(rinkId: string, date: string): Promise<TimeSlot[]> {
    try {
      // In production, this would fetch from your database
      // For now, return mock data filtered by date
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This would be replaced with actual API call
      return mockTimeSlots.filter(slot => slot.date === date);
    } catch (error) {
      throw new Error('Failed to fetch schedule');
    }
  }

  static async createTimeSlot(timeSlot: Omit<TimeSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeSlot> {
    try {
      // Validate for conflicts
      const conflicts = await this.checkForConflicts(timeSlot);
      if (conflicts.length > 0) {
        throw new Error(`Schedule conflict detected: ${conflicts[0].description}`);
      }

      // In production, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTimeSlot: TimeSlot = {
        ...timeSlot,
        id: `slot-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newTimeSlot;
    } catch (error) {
      throw error;
    }
  }

  static async updateTimeSlot(id: string, updates: Partial<TimeSlot>): Promise<TimeSlot> {
    try {
      // In production, update in database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock update
      const updatedSlot: TimeSlot = {
        ...mockTimeSlots.find(slot => slot.id === id)!,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return updatedSlot;
    } catch (error) {
      throw new Error('Failed to update time slot');
    }
  }

  static async deleteTimeSlot(id: string): Promise<void> {
    try {
      // In production, delete from database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if slot can be deleted (not in progress, etc.)
      const slot = mockTimeSlots.find(s => s.id === id);
      if (slot?.status === 'in_progress') {
        throw new Error('Cannot delete a time slot that is currently in progress');
      }
    } catch (error) {
      throw error;
    }
  }

  static async checkForConflicts(timeSlot: Partial<TimeSlot>): Promise<ScheduleConflict[]> {
    try {
      // In production, check against database
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const conflicts: ScheduleConflict[] = [];
      
      // Check for overlapping time slots on same rink surface
      const overlapping = mockTimeSlots.filter(existing => 
        existing.date === timeSlot.date &&
        existing.rinkSurface === timeSlot.rinkSurface &&
        this.timesOverlap(
          existing.startTime, existing.endTime,
          timeSlot.startTime!, timeSlot.endTime!
        )
      );

      if (overlapping.length > 0) {
        conflicts.push({
          id: `conflict-${Date.now()}`,
          timeSlotId: overlapping[0].id,
          conflictType: 'overlap',
          description: `Time slot overlaps with ${overlapping[0].title}`,
          severity: 'high',
        });
      }

      return conflicts;
    } catch (error) {
      return [];
    }
  }

  static async getBookingRequests(rinkId: string): Promise<BookingRequest[]> {
    try {
      // In production, fetch from database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockBookingRequests;
    } catch (error) {
      throw new Error('Failed to fetch booking requests');
    }
  }

  static async approveBookingRequest(requestId: string, timeSlot: Omit<TimeSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      // Create the time slot
      await this.createTimeSlot(timeSlot);
      
      // Update request status
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, update request status in database
    } catch (error) {
      throw error;
    }
  }

  static async getRinkSurfaces(rinkId: string): Promise<RinkSurface[]> {
    try {
      // In production, fetch from database
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockRinkSurfaces;
    } catch (error) {
      throw new Error('Failed to fetch rink surfaces');
    }
  }

  static getUtilizationRate(timeSlots: TimeSlot[], date: string): number {
    const daySlots = timeSlots.filter(slot => slot.date === date);
    const totalHours = 24;
    const bookedHours = daySlots.reduce((total, slot) => {
      const start = this.timeToMinutes(slot.startTime);
      const end = this.timeToMinutes(slot.endTime);
      return total + ((end - start) / 60);
    }, 0);
    
    return Math.round((bookedHours / totalHours) * 100);
  }

  static getDailyRevenue(timeSlots: TimeSlot[], date: string): number {
    return timeSlots
      .filter(slot => slot.date === date)
      .reduce((total, slot) => total + (slot.pricing?.totalCost || 0), 0);
  }

  private static timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const start1Minutes = this.timeToMinutes(start1);
    const end1Minutes = this.timeToMinutes(end1);
    const start2Minutes = this.timeToMinutes(start2);
    const end2Minutes = this.timeToMinutes(end2);

    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

// Mock data (in production, this would come from your database)
const mockTimeSlots: TimeSlot[] = [
  // ... (same mock data as in the component)
];

const mockBookingRequests: BookingRequest[] = [
  // ... (same mock data as in the component)
];

const mockRinkSurfaces: RinkSurface[] = [
  // ... (same mock data as in the component)
];