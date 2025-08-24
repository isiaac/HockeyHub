import { Redirect, useRootNavigationState } from 'expo-router';

export default function Index() {
  // Wait for the root navigator to mount before redirecting
  const state = useRootNavigationState();
  if (!state?.key) return null;

  return <Redirect href="/(auth)/login" />;
}