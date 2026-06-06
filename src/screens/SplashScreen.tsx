import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 10, stiffness: 80 });
    logoOpacity.value = withTiming(1, { duration: 500 });
    textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    barWidth.value = withDelay(
      600,
      withTiming(width - 80, { duration: 1400 }, () => {
        runOnJS(navigation.replace)('Onboarding');
      })
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: barWidth.value,
  }));

  return (
    <LinearGradient
      colors={['#0B0E1A', '#141828', '#0B0E1A']}
      style={styles.container}
    >
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>M</Text>
        </View>
      </Animated.View>

      <Animated.View style={textStyle}>
        <Text style={styles.appName}>MoviliX</Text>
        <Text style={styles.tagline}>Movilidad ciudadana inteligente</Text>
      </Animated.View>

      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, barStyle]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  barTrack: {
    position: 'absolute',
    bottom: 60,
    width: width - 80,
    height: 3,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 2,
  },
  barFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
