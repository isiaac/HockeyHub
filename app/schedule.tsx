import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Filter, Plus, Search, ChevronDown, AlertTriangle, CheckCircle, Eye } from 'lucide-react-native';
import { TimeSlot, RinkSurface, BookingRequest, ScheduleFilter } from '@/types/scheduling';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const mockRinkSurfaces: RinkSurface[] = [
  {
    id: 'rink-1',
    name: 'Main Ice (Rink 1)',
    type: 'hockey',
    capacity: 200,
    isActive: true,
  },
  {
    id: 'rink-2',
    name: 'Practice Ice (Rink 2)',
    type: 'multi_purpose',
    capacity: 150,
    isActive: true,
  },
  {
    id: 'rink-3',
    name: 'Figure Skating Rink',
    type: 'figure_skating',
    capacity: 100,
    isActive: true,
  },
];

const mockTimeSlots: TimeSlot[] = [
  {
    id: '1',
    startTime: '06:00',
    endTime: '07:30',
    date: '2025-01-15',
    rinkSurface: 'Main Ice (Rink 1)',
    programType: 'hockey_league',
    title: 'Adult Rec League - Division A',
    description: 'Ice Wolves vs Thunder Hawks',
    organizerName: 'Mike Johnson',
    organizerContact: 'mike@icewolves.com',
    participantCount: 36,
    maxCapacity: 40,
    status: 'scheduled',
    pricing: {
      hourlyRate: 200,
      totalCost: 300,
      paymentStatus: 'paid',
    },
    createdAt: '2025-01-01',
    updatedAt: '2025-01-10',
  },
  {
    id: '2',
    startTime: '08:00',
    endTime: '09:00',
    date: '2025-01-15',
    rinkSurface: 'Figure Skating Rink',
    programType: 'figure_skating',
    title: 'Figure Skating Lessons',
    description: 'Beginner group lesson',
    organizerName: 'Sarah Chen',
    organizerContact: 'sarah@figureskating.com',
    participantCount: 12,
    maxCapacity: 15,
    status: 'scheduled',
    pricing: {
      hourlyRate: 150,
      totalCost: 150,
      paymentStatus: 'paid',
    },
    createdAt: '2025-01-02',
    updatedAt: '2025-01-11',
  },
  {
    id: '3',
    startTime: '10:00',
    endTime: '12:00',
    date: '2025-01-15',
    rinkSurface: 'Main Ice (Rink 1)',
    programType: 'public_skate',
    title: 'Public Skating Session',
    description: 'Open skating for all ages',
    organizerName: 'Rink Staff',
    organizerContact: 'info@centralicea.com',
    participantCount: 45,
    maxCapacity: 80,
    status: 'scheduled',
    pricing: {
      hourlyRate: 100,
      totalCost: 200,
      paymentStatus: 'paid',
    },
    createdAt: '2025-01-03',
    updatedAt: '2025-01-12',
  },
  {
    id: '4',
    startTime: '13:00',
    endTime: '14:00',
    date: '2025-01-15',
    rinkSurface: 'Practice Ice (Rink 2)',
    programType: 'learn_to_skate',
    title: 'Learn to Skate Program',
    description: 'Youth beginner skating lessons',
    organizerName: 'Emma Wilson',
    organizerContact: 'emma@learntoska.com',
    participantCount: 8,
    maxCapacity: 12,
    status: 'scheduled',
    pricing: {
      hourlyRate: 120,
      totalCost: 120,
      paymentStatus: 'paid',
    },
    createdAt: '2025-01-04',
    updatedAt: '2025-01-13',
  },
  {
    id: '5',
    startTime: '15:00',
    endTime: '16:30',
    date: '2025-01-15',
    rinkSurface: 'Main Ice (Rink 1)',
    programType: 'hockey_practice',
    title: 'Storm Riders Practice',
    description: 'Team practice session',
    organizerName: 'Coach Davis',
    organizerContact: 'coach@stormriders.com',
    participantCount: 18,
    maxCapacity: 25,
    status: 'scheduled',
    pricing: {
      hourlyRate: 180,
      totalCost: 270,
      paymentStatus: 'paid',
    },
    createdAt: '2025-01-05',
    updatedAt: '2025-01-14',
  },
  {
    id: '6',
    startTime: '17:00',
    endTime: '19:00',
    date: '2025-01-15',
    rinkSurface: 'Figure Skating Rink',
    programType: 'birthday_party',
    title: 'Birthday Party - Emma\'s 10th',
    description: 'Private skating party with decorations',
    organizerName: 'Jennifer Smith',
    organizerContact: 'jennifer.smith@email.com',
    participantCount: 15,
    maxCapacity: 20,
    status: 'scheduled',
    equipment: ['Party decorations', 'Sound system'],
    specialRequests: 'Need tables and chairs set up',
    pricing: {
      hourlyRate: 250,
      totalCost: 500,
      paymentStatus: 'pending',
    },
    createdAt: '2025-01-06',
    updatedAt: '2025-01-15',
  },
  {
    id: '7',
    startTime: '19:30',
    endTime: '21:00',
    date: '2025-01-15',
    rinkSurface: 'Main Ice (Rink 1)',
    programType: 'corporate_event',
    title: 'TechCorp Team Building',
    description: 'Corporate hockey event',
    organizerName: 'Mark Johnson',
    organizerContact: 'mark@techcorp.com',
    participantCount: 24,
    maxCapacity: 30,
    status: 'scheduled',
    equipment: ['Rental skates', 'Helmets', 'Sticks'],
    pricing: {
      hourlyRate: 300,
      totalCost: 450,
      paymentStatus: 'paid',
    },
    createdAt: '2025-01-07',
    updatedAt: '2025-01-16',
  },
  {
    id: '8',
    startTime: '21:30',
    endTime: '23:00',
    date: '2025-01-15',
    rinkSurface: 'Practice Ice (Rink 2)',
    programType: 'maintenance',
    title: 'Ice Resurfacing & Maintenance',
    description: 'Scheduled maintenance and deep clean',
    organizerName: 'Maintenance Team',
    organizerContact: 'maintenance@centralicea.com',
    status: 'scheduled',
    createdAt: '2025-01-08',
    updatedAt: '2025-01-17',
  },
];

const mockBookingRequests: BookingRequest[] = [
  {
    id: '1',
    requestedBy: 'user-new-1',
    contactInfo: {
      name: 'Lisa Park',
      email: 'lisa.park@email.com',
      phone: '555-0199',
    },
    programType: 'hockey_practice',
    preferredDates: ['2025-01-20', '2025-01-21', '2025-01-22'],
    preferredTimes: ['18:00', '19:00', '20:00'],
    duration: 1.5,
    participantCount: 20,
    recurring: {
      frequency: 'weekly',
      duration: 12,
    },
    specialRequests: 'Need access to locker rooms',
    budgetRange: {
      min: 150,
      max: 200,
    },
    status: 'pending',
    submittedAt: '2025-01-14',
  },
  {
    id: '2',
    requestedBy: 'user-new-2',
    contactInfo: {
      name: 'David Martinez',
      email: 'david@youthleague.com',
      phone: '555-0188',
    },
    programType: 'hockey_league',
    preferredDates: ['2025-01-25'],
    preferredTimes: ['16:00'],
    duration: 2,
    participantCount: 40,
    specialRequests: 'Tournament format, need scoreboard access',
    budgetRange: {
      min: 300,
      max: 400,
    },
    status: 'pending',
    submittedAt: '2025-01-13',
  },
];

const programTypeColors: Record<TimeSlot['programType'], string> = {
  hockey_league: '#EF4444',
  hockey_practice: '#F59E0B',
  figure_skating: '#8B5CF6',
  public_skate: '#0EA5E9',
  learn_to_skate: '#16A34A',
  birthday_party: '#EC4899',
  corporate_event: '#6366F1',
  maintenance: '#64748B',
  other: '#94A3B8',
};

const programTypeLabels: Record<TimeSlot['programType'], string> = {
  hockey_league: 'Hockey League',
  hockey_practice: 'Hockey Practice',
  figure_skating: 'Figure Skating',
  public_skate: 'Public Skate',
  learn_to_skate: 'Learn to Skate',
  birthday_party: 'Birthday Party',
  corporate_event: 'Corporate Event',
  maintenance: 'Maintenance',
  other: 'Other',
};

export default function ScheduleScreen() {
  const [timeSlots] = useState<TimeSlot[]>(mockTimeSlots);
  const [bookingRequests] = useState<BookingRequest[]>(mockBookingRequests);
  const [selectedDate, setSelectedDate] = useState('2025-01-15');
  const [selectedRink, setSelectedRink] = useState('All Rinks');
  const [selectedProgramType, setSelectedProgramType] = useState<TimeSlot['programType'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTimeSlots = timeSlots.filter(slot => {
    const matchesDate = slot.date === selectedDate;
    const matchesRink = selectedRink === 'All Rinks' || slot.rinkSurface === selectedRink;
    const matchesType = selectedProgramType === 'all' || slot.programType === selectedProgramType;
    return matchesDate && matchesRink && matchesType;
  });

  const getUtilizationRate = () => {
    const totalSlots = 24; // 24 hours in a day
    const bookedSlots = filteredTimeSlots.length;
    return Math.round((bookedSlots / totalSlots) * 100);
  };

  const getTotalRevenue = () => {
    return filteredTimeSlots.reduce((total, slot) => {
      return total + (slot.pricing?.totalCost || 0);
    }, 0);
  };

  const renderTimeSlot = (slot: TimeSlot) => (
    <TouchableOpacity key={slot.id} style={styles.timeSlotCard}>
      <View style={styles.timeSlotHeader}>
        <View style={[styles.programTypeBadge, { backgroundColor: programTypeColors[slot.programType] }]}>
          <Text style={styles.programTypeText}>{programTypeLabels[slot.programType]}</Text>
        </View>
        <View style={[styles.statusBadge, styles[`${slot.status}Badge`]]}>
          <Text style={[styles.statusText, styles[`${slot.status}Text`]]}>
            {slot.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.slotTitle}>{slot.title}</Text>
      {slot.description && (
        <Text style={styles.slotDescription}>{slot.description}</Text>
      )}

      <View style={styles.slotDetails}>
        <View style={styles.detailRow}>
          <Clock size={16} color="#64748B" />
          <Text style={styles.detailText}>{slot.startTime} - {slot.endTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={16} color="#64748B" />
          <Text style={styles.detailText}>{slot.rinkSurface}</Text>
        </View>
        <View style={styles.detailRow}>
          <Users size={16} color="#64748B" />
          <Text style={styles.detailText}>
            {slot.participantCount || 0}{slot.maxCapacity ? `/${slot.maxCapacity}` : ''} participants
          </Text>
        </View>
      </View>

      <View style={styles.slotFooter}>
        <View style={styles.organizerInfo}>
          <Text style={styles.organizerName}>{slot.organizerName}</Text>
          <Text style={styles.organizerContact}>{slot.organizerContact}</Text>
        </View>
        {slot.pricing && (
          <View style={styles.pricingInfo}>
            <Text style={styles.priceText}>${slot.pricing.totalCost}</Text>
            <View style={[
              styles.paymentStatus,
              slot.pricing.paymentStatus === 'paid' ? styles.paidStatus : 
              slot.pricing.paymentStatus === 'pending' ? styles.pendingStatus : styles.overdueStatus
            ]}>
              <Text style={[
                styles.paymentStatusText,
                slot.pricing.paymentStatus === 'paid' ? styles.paidText : 
                slot.pricing.paymentStatus === 'pending' ? styles.pendingText : styles.overdueText
              ]}>
                {slot.pricing.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </View>

      {slot.specialRequests && (
        <View style={styles.specialRequests}>
          <Text style={styles.specialRequestsLabel}>Special Requests:</Text>
          <Text style={styles.specialRequestsText}>{slot.specialRequests}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderBookingRequest = (request: BookingRequest) => (
    <View key={request.id} style={styles.bookingRequestCard}>
      <View style={styles.requestHeader}>
        <View style={[styles.programTypeBadge, { backgroundColor: programTypeColors[request.programType] }]}>
          <Text style={styles.programTypeText}>{programTypeLabels[request.programType]}</Text>
        </View>
        <View style={styles.requestStatus}>
          <Text style={styles.requestStatusText}>{request.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.requestTitle}>New Booking Request</Text>
      <Text style={styles.requestContact}>{request.contactInfo.name} • {request.contactInfo.phone}</Text>

      <View style={styles.requestDetails}>
        <Text style={styles.requestDetail}>
          Duration: {request.duration} hours • {request.participantCount} participants
        </Text>
        <Text style={styles.requestDetail}>
          Preferred dates: {request.preferredDates.join(', ')}
        </Text>
        <Text style={styles.requestDetail}>
          Budget: ${request.budgetRange?.min} - ${request.budgetRange?.max}
        </Text>
      </View>

      <View style={styles.requestActions}>
        <TouchableOpacity style={styles.approveButton}>
          <CheckCircle size={16} color="#FFFFFF" />
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reviewButton}>
          <Eye size={16} color="#0EA5E9" />
          <Text style={styles.reviewText}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ice Rink Schedule</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.requestButton}
          onPress={() => router.push('/booking-request')}
        >
          <Text style={styles.requestButtonText}>Request Ice Time</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule Controls */}
      <View style={styles.controls}>
        <View style={styles.dateSelector}>
          <Calendar size={20} color="#0EA5E9" />
          <Text style={styles.selectedDate}>{selectedDate}</Text>
          <ChevronDown size={16} color="#64748B" />
        </View>

        <View style={styles.viewModeSelector}>
          {(['day', 'week', 'month'] as const).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[styles.viewModeButton, viewMode === mode && styles.activeViewMode]}
              onPress={() => setViewMode(mode)}
            >
              <Text style={[styles.viewModeText, viewMode === mode && styles.activeViewModeText]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#64748B" />
          <Text style={styles.filterToggleText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterChip, selectedRink !== 'All Rinks' && styles.activeFilterChip]}
                onPress={() => setSelectedRink(selectedRink === 'All Rinks' ? 'Main Ice (Rink 1)' : 'All Rinks')}
              >
                <Text style={[styles.filterChipText, selectedRink !== 'All Rinks' && styles.activeFilterChipText]}>
                  {selectedRink}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, selectedProgramType !== 'all' && styles.activeFilterChip]}
                onPress={() => setSelectedProgramType(selectedProgramType === 'all' ? 'hockey_league' : 'all')}
              >
                <Text style={[styles.filterChipText, selectedProgramType !== 'all' && styles.activeFilterChipText]}>
                  {selectedProgramType === 'all' ? 'All Programs' : programTypeLabels[selectedProgramType]}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Schedule Overview */}
      <View style={styles.overview}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Today's Utilization</Text>
          <Text style={styles.overviewValue}>{getUtilizationRate()}%</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Daily Revenue</Text>
          <Text style={styles.overviewValue}>${getTotalRevenue()}</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Active Programs</Text>
          <Text style={styles.overviewValue}>{filteredTimeSlots.length}</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Pending Requests</Text>
          <Text style={styles.overviewValue}>{bookingRequests.filter(r => r.status === 'pending').length}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pending Booking Requests */}
        {bookingRequests.filter(r => r.status === 'pending').length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Booking Requests</Text>
            <View style={styles.requestsList}>
              {bookingRequests
                .filter(r => r.status === 'pending')
                .map(renderBookingRequest)}
            </View>
          </View>
        )}

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Schedule for {selectedDate} • {filteredTimeSlots.length} programs
          </Text>
          <View style={styles.scheduleList}>
            {filteredTimeSlots
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(renderTimeSlot)}
          </View>
        </View>

        {/* Rink Surface Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rink Surface Status</Text>
          <View style={styles.rinkSurfacesList}>
            {mockRinkSurfaces.map(surface => (
              <View key={surface.id} style={styles.surfaceCard}>
                <View style={styles.surfaceHeader}>
                  <Text style={styles.surfaceName}>{surface.name}</Text>
                  <View style={[styles.surfaceStatus, surface.isActive ? styles.activeSurface : styles.inactiveSurface]}>
                    <Text style={[styles.surfaceStatusText, surface.isActive ? styles.activeText : styles.inactiveText]}>
                      {surface.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.surfaceType}>{surface.type.replace('_', ' ').toUpperCase()}</Text>
                <Text style={styles.surfaceCapacity}>Capacity: {surface.capacity} people</Text>
                
                <View style={styles.surfaceSchedule}>
                  <Text style={styles.surfaceScheduleTitle}>Today's Usage:</Text>
                  {timeSlots
                    .filter(slot => slot.rinkSurface === surface.name && slot.date === selectedDate)
                    .slice(0, 3)
                    .map(slot => (
                      <Text key={slot.id} style={styles.surfaceSlot}>
                        {slot.startTime}-{slot.endTime}: {slot.title}
                      </Text>
                    ))}
                </View>
              </View>
            ))}
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
  addButton: {
    backgroundColor: '#0EA5E9',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  requestButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  selectedDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeViewMode: {
    backgroundColor: '#FFFFFF',
  },
  viewModeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeViewModeText: {
    color: '#1E293B',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    gap: 6,
  },
  filterToggleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterOptions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterChip: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  overview: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 16,
  },
  overviewCard: {
    flex: 1,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  scheduleList: {
    gap: 12,
  },
  timeSlotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  programTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  programTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scheduledBadge: {
    backgroundColor: '#F0FDF4',
  },
  in_progressBadge: {
    backgroundColor: '#FEF3C7',
  },
  completedBadge: {
    backgroundColor: '#EFF6FF',
  },
  cancelledBadge: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  scheduledText: {
    color: '#16A34A',
  },
  in_progressText: {
    color: '#D97706',
  },
  completedText: {
    color: '#0EA5E9',
  },
  cancelledText: {
    color: '#EF4444',
  },
  slotTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  slotDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  slotDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  slotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  organizerContact: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  pricingInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
    marginBottom: 4,
  },
  paymentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidStatus: {
    backgroundColor: '#F0FDF4',
  },
  pendingStatus: {
    backgroundColor: '#FEF3C7',
  },
  overdueStatus: {
    backgroundColor: '#FEF2F2',
  },
  paymentStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  paidText: {
    color: '#16A34A',
  },
  pendingText: {
    color: '#D97706',
  },
  overdueText: {
    color: '#EF4444',
  },
  specialRequests: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  specialRequestsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#64748B',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    fontStyle: 'italic',
  },
  requestsList: {
    gap: 12,
  },
  bookingRequestCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestStatus: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  requestStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  requestTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  requestContact: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 12,
  },
  requestDetails: {
    gap: 4,
    marginBottom: 16,
  },
  requestDetail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  approveText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  reviewButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0EA5E9',
    gap: 6,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0EA5E9',
  },
  rinkSurfacesList: {
    gap: 12,
  },
  surfaceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  surfaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  surfaceName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  surfaceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeSurface: {
    backgroundColor: '#F0FDF4',
  },
  inactiveSurface: {
    backgroundColor: '#FEF2F2',
  },
  surfaceStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  activeText: {
    color: '#16A34A',
  },
  inactiveText: {
    color: '#EF4444',
  },
  surfaceType: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  surfaceCapacity: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  surfaceSchedule: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  surfaceScheduleTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  surfaceSlot: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
});