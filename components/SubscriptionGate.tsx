import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock, Crown, Zap } from 'lucide-react-native';

interface SubscriptionGateProps {
  feature: string;
  requiredPlan: string;
  onUpgrade: () => void;
  children?: React.ReactNode;
}

export function SubscriptionGate({ feature, requiredPlan, onUpgrade, children }: SubscriptionGateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.lockContainer}>
        <View style={styles.lockIcon}>
          <Lock size={32} color="#FFFFFF" />
        </View>
        <Crown size={20} color="#F59E0B" style={styles.crownIcon} />
      </View>
      
      <Text style={styles.title}>Premium Feature</Text>
      <Text style={styles.description}>
        {feature} is available with {requiredPlan} plan
      </Text>
      
      <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
        <Zap size={20} color="#FFFFFF" />
        <Text style={styles.upgradeText}>Upgrade to {requiredPlan}</Text>
      </TouchableOpacity>
      
      {children && (
        <View style={styles.previewContainer}>
          <View style={styles.previewOverlay} />
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lockContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  lockIcon: {
    backgroundColor: '#64748B',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  upgradeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  previewContainer: {
    position: 'relative',
    marginTop: 24,
    width: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
    borderRadius: 12,
  },
});