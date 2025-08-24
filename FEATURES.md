# HockeyApp - Comprehensive Feature Summary

## Overview
HockeyApp is a comprehensive hockey management platform built with React Native and Expo Router, designed to serve players, teams, coaches, and ice rink facilities. The app provides role-based access with different interfaces for different user types.

## Architecture & Tech Stack

### Core Technologies
- **Framework**: React Native with Expo SDK 52.0.30
- **Navigation**: Expo Router 4.0.17 with file-based routing
- **Styling**: StyleSheet.create (no external CSS frameworks)
- **Fonts**: Inter font family via @expo-google-fonts/inter
- **Icons**: Lucide React Native for consistent iconography
- **State Management**: React Context API for authentication

### Project Structure
```
app/
├── _layout.tsx                 # Root layout with auth provider
├── index.tsx                   # Entry point with auth routing
├── (auth)/                     # Authentication flow
├── (tabs)/                     # Main app tabs for players
├── [individual screens]/       # Standalone screens
components/                     # Reusable components
contexts/                       # React contexts
services/                       # Business logic services
types/                         # TypeScript type definitions
```

## User Roles & Access Control

### Player/Coach/Captain
- Access to team-focused features
- Game management and lineup control
- Stats tracking and badges
- Team chat and messaging
- Store functionality

### Rink Admin/Owner
- Facility management dashboard
- Multi-team oversight
- Payment processing
- Schedule management
- Substitute player database

## Authentication System

### User Types
- **Players**: Individual hockey players
- **Ice Rink Owners/Admins**: Facility managers

### Registration Flow
1. **User Type Selection** (`/(auth)/user-type`)
   - Choose between Player or Ice Rink account
   - Different registration forms for each type

2. **Registration Forms** (`/(auth)/register`)
   - **Player Form**: Personal info, position, USA Hockey ID
   - **Rink Form**: Facility details, owner information, address

3. **Login System** (`/(auth)/login`)
   - Email/password authentication
   - Role-based routing after login

### Authentication Context
- Centralized auth state management
- Role-based access control
- Automatic routing based on user role
- Session persistence (mock implementation)

## Core Features by User Type

### Player Features (Tab Navigation)

#### 1. Games Tab (`/(tabs)/index`)
**Game Management & Lineup System**
- View upcoming, live, and completed games
- **Advanced Lineup Management** (Team Pro feature)
  - Organized by forward lines, defense pairs, goalies
  - Player check-in/check-out system
  - Jersey number and position management
  - Real-time attendance tracking
- **Live Game Controls**
  - Start live game tracking
  - Add substitute players during games
  - Open scorekeeper functionality
- **Team Management Permissions**
  - Role-based editing permissions
  - Rink-managed vs independent teams
  - Creator and admin controls

#### 2. Teams Tab (`/(tabs)/teams`)
**Free Agent System**
- **Registration as Free Agent**
  - USA Hockey ID verification
  - Skill level and position selection
  - Availability preferences
  - Location and travel distance
  - Bio and experience details
- **Browse Available Players**
  - Search by position, skill, location
  - Player ratings and reviews
  - Contact and recruitment system

#### 3. Stats Tab (`/(tabs)/stats`)
**Comprehensive Statistics**
- **Team Statistics**
  - Season record and win percentage
  - Goals for/against with per-game averages
  - Power play and penalty kill percentages
  - Shot differential and faceoff statistics
- **Individual Player Stats**
  - Goals, assists, points tracking
  - Advanced metrics (shooting %, +/-, PIM)
  - Sortable by multiple criteria
- **League Rankings**
  - Team standings with playoff positioning
  - Individual scoring leaders
  - Multiple statistical categories
  - Medal system for top performers

#### 4. Store Tab (`/(tabs)/store`)
**Team Merchandise**
- Product catalog with categories
- Team-branded apparel and equipment
- Shopping cart functionality
- Inventory management
- Rating and review system

#### 5. Badges Tab (`/(tabs)/badges`)
**Achievement System**
- Earned and available badges
- Progress tracking for incomplete badges
- Achievement categories (scoring, teamwork, etc.)
- Badge showcase and sharing

#### 6. Chat Tab (`/(tabs)/chat`)
**Team Communication**
- **Team and Individual Messaging**
  - Group chats for teams
  - Direct messaging between players
  - Message history and notifications
- **Interactive Polls**
  - Create team polls for decisions
  - Multiple choice and single selection
  - Anonymous voting options
  - Real-time results and analytics
- **Broadcast Integration**
  - Quick access to team announcements
  - Message templates and scheduling

#### 7. Profile Tab (`/(tabs)/profile`)
**User Profile Management**
- Personal information editing
- Contact details management
- Account status and verification
- Settings and preferences
- Subscription management access

### Rink Management Features

#### Rink Dashboard (`/rink-dashboard`)
**Comprehensive Facility Management**
- **Overview Statistics**
  - Total teams, players, games managed
  - Monthly revenue tracking
  - Ice utilization rates
  - Active substitute players count
- **Live Game Monitoring**
  - Real-time game tracking
  - Multiple concurrent games
  - Direct scorekeeper access
- **Team Management**
  - Connected teams overview
  - Team performance metrics
  - Management controls per team
- **Quick Actions Hub**
  - Schedule management
  - Broadcast messaging
  - Booking requests
  - Substitute management

## Advanced Features

### Live Game Management

#### Scorekeeper (`/scorekeeper` & `/live-scorekeeper`)
**Real-Time Game Tracking**
- **Basic Scorekeeper** (Team Pro+)
  - Score tracking for both teams
  - Period management
  - Penalty tracking
  - Time management
- **Advanced Live Scorekeeper** (Rink plans)
  - Individual player statistics
  - Shot tracking by team
  - Comprehensive stat updates (goals, assists, penalties, hits, blocks)
  - Real-time game events logging
  - Goalie-specific stats (saves, shots against)

#### Game Details (`/game-details`)
- Complete game information
- Team rosters with player links
- Game metadata (referee, division, venue)
- Live scorekeeper access for active games

### Payment Processing System

#### Stripe Integration (`/payments`, `/stripe-onboarding`)
**Complete Payment Solution**
- **Stripe Connect Integration**
  - Rink onboarding with Express accounts
  - Direct bank transfers to rinks
  - Platform fee structure (2.9% + $0.30)
- **Season Fee Management**
  - Create and manage season fees
  - Player payment tracking
  - Automated reminder system
  - Payment status monitoring
- **Financial Reporting**
  - Revenue tracking and analytics
  - Platform fee calculations
  - Payment history and receipts
- **Receipt System** (`/payment-receipt`)
  - Detailed payment breakdowns
  - PDF generation and sharing
  - Transaction history

### Scheduling & Facility Management

#### Schedule Management (`/schedule`)
**Ice Time Coordination**
- **Multi-Rink Scheduling**
  - Multiple ice surfaces management
  - Program type categorization
  - Utilization rate tracking
- **Booking Requests** (`/booking-request`)
  - Public booking request system
  - Automated approval workflows
  - Budget range specifications
  - Recurring booking options
- **Live Game Integration**
  - Convert scheduled slots to live games
  - Real-time status updates

#### Game Scheduling (`/schedule-game`)
**Manual Game Creation**
- Independent team game scheduling
- Venue and official assignment
- Tournament and exhibition support
- Automated notifications

### Communication System

#### Broadcast Messaging (`/broadcast`)
**Mass Communication Tools**
- **Multi-Channel Broadcasting**
  - Push notifications, email, SMS
  - Channel-specific preferences
  - Priority level management
- **Message Templates**
  - Pre-built templates for common scenarios
  - Custom template creation
  - Variable substitution
- **Recipient Management**
  - Role-based recipient selection
  - Individual preference respect
  - Delivery status tracking

#### Team Chat (`/(tabs)/chat`)
**Interactive Team Communication**
- Real-time messaging
- Poll creation and voting
- File and media sharing
- Message history

### Player Management

#### Substitute System (`/substitute-manager`)
**Advanced Player Replacement**
- **Ringer Check System**
  - Skill level verification
  - Division compatibility checking
  - USA Hockey status validation
  - Risk assessment (low/medium/high)
- **Player Database**
  - Searchable substitute pool
  - Availability tracking
  - Rating and review system
- **Game Integration**
  - Real-time substitute addition
  - Approval workflows
  - Notification system

#### Player Profiles (`/player-profile`)
**Comprehensive Player Data**
- **USA Hockey Integration**
  - Registration verification
  - Status checking (active/expired/suspended)
  - Real-time validation
- **Statistics Tracking**
  - Current season stats
  - Historical season data
  - Advanced metrics
- **Communication Tools**
  - Direct messaging
  - Contact information
- **Badge Integration**
  - Featured achievements
  - Progress tracking

### Team Management

#### Team Import System (`/team-import`)
**Rink Integration Options**
- **Import Existing Teams**
  - Transfer independent teams to rink management
  - Retain coaching permissions
  - Approval workflow
- **Create New Teams**
  - Rink-managed team creation
  - Permission assignment
  - Coach designation

## Subscription & Monetization

### Subscription Plans (`/subscription`)
**Tiered Feature Access**

#### Team Plans
- **Free**: Basic features, limited games (20 players, 5 games/month)
- **Team Pro**: Advanced lineup, scorekeeper, chat (30 players, unlimited games)
- **Team Elite**: Store, branding, analytics, API (50 players, 5GB storage)

#### Rink Plans
- **Starter**: Up to 10 teams, basic management (300 players, 10GB)
- **Professional**: Up to 25 teams, advanced analytics (750 players, 50GB)
- **Enterprise**: Unlimited teams, white-label (unlimited, custom features)

### Feature Gating
- **SubscriptionGate Component**: Graceful feature limiting
- **Progressive Disclosure**: Upgrade prompts with clear value
- **Trial System**: 14-day free trials

## Data Flow & Architecture

### Authentication Flow
1. App launch → Check auth state
2. Unauthenticated → Login/Register flow
3. Authenticated → Role-based routing
4. Context provides user data throughout app

### Game Management Flow
1. **Schedule Creation** → Time slot booking
2. **Live Game Start** → Convert to live tracking
3. **Scorekeeper** → Real-time stat updates
4. **Game Completion** → Finalize and save stats
5. **Historical Data** → Archive for future reference

### Payment Flow
1. **Rink Onboarding** → Stripe Connect setup
2. **Season Fee Creation** → Define payment requirements
3. **Player Payment** → Secure processing
4. **Fund Distribution** → Direct to rink accounts
5. **Reporting** → Financial analytics

### Communication Flow
1. **Message Creation** → Template or custom
2. **Recipient Selection** → Role and preference based
3. **Channel Distribution** → Multi-channel delivery
4. **Delivery Tracking** → Status monitoring

## Key Services & Utilities

### StripeService (`services/stripeService.ts`)
- Payment processing and Connect account management
- Fee calculations and currency formatting
- Refund and dispute handling
- Platform fee structure (2.9% + $0.30)

### GameStatsService (`services/gamestatsService.ts`)
- Live game state management
- Player statistics tracking
- Event logging and history
- Game finalization workflows

### SubstituteService (`services/substituteService.ts`)
- Player search and verification
- Ringer checking algorithms
- Game integration workflows
- Risk assessment logic

### USAHockeyService (`services/usaHockeyService.ts`)
- Registration validation
- Status checking and formatting
- Mock API integration
- Format validation

### SchedulingService (`services/schedulingService.ts`)
- Time slot management
- Conflict detection
- Booking request processing
- Utilization calculations

## Security & Permissions

### Role-Based Access Control
- **AuthGuard Component**: Route protection
- **Permission Checking**: Feature-level access control
- **Data Isolation**: User can only access appropriate data

### USA Hockey Integration
- Registration verification
- Status validation
- Compliance checking

### Payment Security
- Stripe Connect for secure processing
- PCI compliance through Stripe
- Platform fee transparency

## Mobile-First Design

### Responsive Layout
- Tablet and desktop optimizations
- Flexible grid systems
- Touch-friendly interfaces

### Platform Considerations
- Web-compatible API usage
- Platform-specific feature detection
- Graceful degradation for unsupported features

## Component Architecture

### Reusable Components
- **AuthGuard**: Route protection with role checking
- **SubscriptionGate**: Feature gating with upgrade prompts
- **BroadcastButton**: Quick access to messaging

### Context Providers
- **AuthContext**: User authentication and session management
- Global state management for user data

## Type System

### Comprehensive TypeScript Types
- **Auth Types**: User, Team, Rink, permissions
- **Game Types**: LiveGame, GamePlayer, GameEvent, stats
- **Payment Types**: Payment, SeasonFee, PaymentAccount
- **Scheduling Types**: TimeSlot, BookingRequest, conflicts
- **Communication Types**: BroadcastMessage, polls, notifications

## Future Extensibility

### API Integration Points
- USA Hockey registration system
- Payment processing (Stripe)
- Notification services
- Analytics platforms

### Modular Architecture
- Service-based business logic
- Component reusability
- Type-safe interfaces
- Clear separation of concerns

### Scalability Considerations
- Database-ready data models
- Caching strategies
- Performance optimization points
- Multi-tenant architecture support

## Development Notes

### Mock Data Implementation
- Comprehensive mock data for all features
- Realistic user scenarios and edge cases
- Production-ready data structures

### Error Handling
- Graceful error states
- User-friendly error messages
- Fallback mechanisms

### Performance Optimizations
- Lazy loading for large datasets
- Efficient re-rendering strategies
- Memory management for real-time features

This architecture provides a solid foundation for a production hockey management application with room for growth and additional features. The modular design allows for easy feature additions and modifications while maintaining code quality and user experience standards.