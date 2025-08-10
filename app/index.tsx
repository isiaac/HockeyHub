import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Check if user is authenticated
    // For now, redirect to user type selection
    // In production, check authentication state and redirect accordingly
    router.replace('/(auth)/user-type');
  }, []);

  return null;
}