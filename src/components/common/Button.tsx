import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string }> = {
  primary: { bg: Colors.primary, text: '#FFFFFF' },
  secondary: { bg: Colors.surfaceAlt, text: Colors.textPrimary },
  ghost: { bg: 'transparent', text: Colors.primary },
  danger: { bg: Colors.critical, text: '#FFFFFF' },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const { bg, text } = VARIANT_STYLES[variant];

  return (
    <Animated.View style={[animStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
          variant === 'ghost' && styles.ghostBorder,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={text} size="small" />
        ) : (
          <Text style={[styles.text, { color: text }]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: Theme.fontSize.base,
    fontWeight: '600',
  },
});
