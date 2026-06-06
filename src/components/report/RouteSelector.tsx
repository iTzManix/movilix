import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { MOCK_ROUTES } from '../../data/mockRoutes';

interface RouteSelectorProps {
  selected: string;
  onSelect: (route: string) => void;
}

export default function RouteSelector({ selected, onSelect }: RouteSelectorProps) {
  return (
    <View style={styles.container}>
      {MOCK_ROUTES.map((route) => (
        <Pressable
          key={route.id}
          style={[styles.item, selected === route.name && styles.itemActive]}
          onPress={() => onSelect(route.name)}
        >
          <View style={[styles.colorBar, { backgroundColor: route.color }]} />
          <View style={styles.info}>
            <Text style={styles.name}>{route.name}</Text>
            <Text style={styles.line}>{route.line}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  colorBar: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Theme.fontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  line: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
