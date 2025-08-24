import { Redirect, useRootNavigationState, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  // Wait for the root navigator to mount before redirecting
  const state = useRootNavigationState();
  
  useEffect(() => {
    if (!isLoading && user && state?.key) {
      // Auto-redirect based on user role
      if (user.role === 'rink_owner' || user.role === 'rink_admin') {
        router.replace('/rink-dashboard');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, state?.key, router]);
  
  if (!state?.key) return null;
  
  // If user is logged in, don't show login screen
  if (user) return null;

  return <Redirect href="/(auth)/login" />;
}