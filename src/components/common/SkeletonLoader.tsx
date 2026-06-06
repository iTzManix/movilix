import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = Theme.borderRadius.sm,
  style,
}: SkeletonLoaderProps) {
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.8 }}
      transition={{ type: 'timing', duration: 700, loop: true, repeatReverse: true }}
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.surfaceAlt,
  },
});
