import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface TrendChartProps {
  data: { hour: string; value: number }[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item, index) => (
          <Bar key={index} value={item.value} maxValue={maxValue} label={item.hour} index={index} />
        ))}
      </View>
    </View>
  );
}

function Bar({ value, maxValue, label, index }: { value: number; maxValue: number; label: string; index: number }) {
  const height = useSharedValue(0);

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
      <Animated.View style={[styles.bar, style]} />
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.surfaceAlt,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 8,
    color: Colors.textMuted,
  },
});
