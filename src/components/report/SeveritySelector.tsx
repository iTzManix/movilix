import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import type { SeverityLevel } from '../../types';

interface SeveritySelectorProps {
  selected: SeverityLevel | null;
  onSelect: (severity: SeverityLevel) => void;
}

const SEVERITY_OPTIONS = [
  { key: 'low', label: 'Leve', color: Colors.low },
  { key: 'medium', label: 'Medio', color: Colors.medium },
  { key: 'high', label: 'Alto', color: Colors.high },
  { key: 'critical', label: 'Crítico', color: Colors.critical },
];

export default function SeveritySelector({ selected, onSelect }: SeveritySelectorProps) {
  return (
    <View style={styles.container}>
      {SEVERITY_OPTIONS.map((sev) => (
        <Pressable
          key={sev.key}
          style={[
            styles.option,
            selected === sev.key && {
              borderColor: sev.color,
              backgroundColor: sev.color + '20',
            },
          ]}
          onPress={() => onSelect(sev.key as SeverityLevel)}
        >
          <View style={[styles.dot, { backgroundColor: sev.color }]} />
          <Text style={styles.label}>{sev.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
