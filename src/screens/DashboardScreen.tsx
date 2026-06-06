import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import Card from '../components/common/Card';

const STATS = [
  { label: 'Reportes hoy', value: 23, icon: 'megaphone' as const, color: Colors.primary },
  { label: 'Zonas críticas', value: 5, icon: 'warning' as const, color: Colors.critical },
  { label: 'Confirmados', value: 16, icon: 'checkmark-circle' as const, color: Colors.low },
  { label: 'Usuarios activos', value: 142, icon: 'people' as const, color: Colors.accent },
];

const CRITICAL_ZONES = [
  { name: 'Av. Busch', incidents: 3, severity: 'high' as const },
  { name: 'Calle Yungas', incidents: 2, severity: 'critical' as const },
  { name: 'La Ceja', incidents: 2, severity: 'medium' as const },
  { name: 'Zona Sur', incidents: 1, severity: 'low' as const },
];

const ACTIVITY_DATA = [
  { hour: '6am', value: 3 },
  { hour: '7am', value: 8 },
  { hour: '8am', value: 12 },
  { hour: '9am', value: 7 },
  { hour: '10am', value: 5 },
  { hour: '11am', value: 4 },
  { hour: '12pm', value: 6 },
  { hour: '1pm', value: 5 },
  { hour: '2pm', value: 4 },
  { hour: '3pm', value: 6 },
  { hour: '4pm', value: 8 },
  { hour: '5pm', value: 10 },
  { hour: '6pm', value: 15 },
  { hour: '7pm', value: 12 },
  { hour: '8pm', value: 8 },
  { hour: '9pm', value: 3 },
];

const SEVERITY_COLORS: Record<string, string> = {
  low: Colors.low,
  medium: Colors.medium,
  high: Colors.high,
  critical: Colors.critical,
};

function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const sharedValue = useSharedValue(0);

  useEffect(() => {
    sharedValue.value = withTiming(value, { duration: 800 });
  }, [value]);

  const derived = useDerivedValue(() => Math.round(sharedValue.value));

  const animStyle = useAnimatedStyle(() => ({
    // We'll display the value directly since Reanimated 4 useDerivedValue works differently
  }));

  return (
    <View style={[styles.statValueWrap, { backgroundColor: color + '15' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

function ActivityBar({ value, maxValue, index }: { value: number; maxValue: number; index: number }) {
  const height = useSharedValue(0);
  const isCurrentHour = index === 12; // 6pm

  useEffect(() => {
    height.value = withTiming((value / maxValue) * 100, {
      duration: 600,
    });
  }, [value]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <View style={styles.barColumn}>
      <Animated.View
        style={[
          styles.bar,
          style,
          { backgroundColor: isCurrentHour ? Colors.primary : Colors.surfaceAlt },
        ]}
      />
      <Text style={styles.barLabel}>{ACTIVITY_DATA[index].hour}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const maxValue = Math.max(...ACTIVITY_DATA.map((d) => d.value));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Estadísticas en tiempo real</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
              <AnimatedCounter value={stat.value} color={stat.color} />
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Critical Zones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zonas Críticas</Text>
          {CRITICAL_ZONES.map((zone) => (
            <View key={zone.name} style={styles.zoneItem}>
              <View style={[styles.zoneDot, { backgroundColor: SEVERITY_COLORS[zone.severity] }]} />
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneIncidents}>{zone.incidents} incidencias</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </View>
          ))}
        </View>

        {/* Activity Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad de Hoy</Text>
          <Card style={styles.chartCard}>
            <View style={styles.chart}>
              {ACTIVITY_DATA.map((_, index) => (
                <ActivityBar
                  key={index}
                  value={ACTIVITY_DATA[index].value}
                  maxValue={maxValue}
                  index={index}
                />
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: 50,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 100,
    gap: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    gap: 8,
  },
  statValueWrap: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Theme.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: Theme.fontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  zoneIncidents: {
    fontSize: Theme.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chartCard: {
    height: 180,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: Theme.spacing.md,
  },
  barColumn: {
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: 12,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 8,
    color: Colors.textMuted,
  },
});
