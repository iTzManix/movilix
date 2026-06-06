import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface BadgeProps {
  label: string;
  bg?: string;
  textColor?: string;
}

export default function Badge({ label, bg = Colors.surfaceAlt, textColor = Colors.textSecondary }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
  },
});
