import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirect to login - auth context will handle role-based routing
    router.replace('/(auth)/login');
  }, []);

  return null;
}