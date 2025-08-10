import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { router } from 'expo-router';

interface BroadcastButtonProps {
  teamId?: string;
  style?: any;
}

export function BroadcastButton({ teamId, style }: BroadcastButtonProps) {
  const handlePress = () => {
    router.push(`/broadcast${teamId ? `?teamId=${teamId}` : ''}`);
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <MessageSquare size={20} color="#16A34A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
});