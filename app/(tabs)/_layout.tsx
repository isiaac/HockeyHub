import { Tabs } from 'expo-router';
import { Calendar, MessageSquare, Trophy, Users, Store, ChartBar as BarChart3, User } from 'lucide-react-native';
import { AuthGuard } from '@/components/AuthGuard';

export default function TabLayout() {
  return (
    <AuthGuard allowedRoles={['player', 'coach', 'captain']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1E293B',
            borderTopColor: '#334155',
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
          },
          tabBarActiveTintColor: '#0EA5E9',
          tabBarInactiveTintColor: '#64748B',
          tabBarLabelStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 12,
            marginTop: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Games',
            tabBarIcon: ({ size, color }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="teams"
          options={{
            title: 'Free Agents',
            tabBarIcon: ({ size, color }) => (
              <Users size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ size, color }) => (
              <BarChart3 size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="badges"
          options={{
            title: 'Badges',
            tabBarIcon: ({ size, color }) => (
              <Trophy size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ size, color }) => (
              <MessageSquare size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="store"
          options={{
            title: 'Store',
            tabBarIcon: ({ size, color }) => (
              <Store size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}