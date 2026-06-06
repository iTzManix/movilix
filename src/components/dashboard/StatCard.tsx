import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  const animValue = useSharedValue(0);

  useEffect(() => {
    animValue.value = withTiming(value, { duration: 800 });
  }, [value]);

  const style = useAnimatedStyle(() => ({
    // Animated counter display
  }));

  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={22} color={color} />
      <View style={[styles.valueWrap, { backgroundColor: color + '15' }]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  valueWrap: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '800',
  },
  label: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
});
