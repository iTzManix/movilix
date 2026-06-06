import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: '🗺️',
    title: 'Monitorea tu ciudad',
    subtitle:
      'Visualiza incidencias de transporte en tiempo real.\nSé el primero en saber qué pasa en tu ruta.',
    color: Colors.primary,
  },
  {
    id: '2',
    icon: '📣',
    title: 'Reporta en segundos',
    subtitle:
      'Trameajes, accidentes, bloqueos.\nUn reporte tuyo ayuda a cientos de personas.',
    color: Colors.accent,
  },
  {
    id: '3',
    icon: '⭐',
    title: 'Construye reputación',
    subtitle:
      'Cada reporte válido suma puntos.\nConviértete en Experto MoviliX.',
    color: '#A78BFA',
  },
];

function SlideItem({ item, index }: { item: (typeof SLIDES)[0]; index: number }) {
  const iconScale = useSharedValue(0.8);

  React.useEffect(() => {
    iconScale.value = withSpring(1, { damping: 10, stiffness: 60 });
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.iconWrap, iconStyle]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </Animated.View>
      <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeColor = SLIDES[currentIndex]?.color || Colors.primary;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Main');
    }
  };

  return (
    <LinearGradient
      colors={['#0B0E1A', '#141828', '#0B0E1A']}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item, index }) => <SlideItem item={item} index={index} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, index) => (
            <Dot key={index} isActive={index === currentIndex} color={activeColor} />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={[styles.button, { backgroundColor: activeColor }]}
        >
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function Dot({ isActive, color }: { isActive: boolean; color: string }) {
  const widthAnim = useSharedValue(isActive ? 24 : 8);

  React.useEffect(() => {
    widthAnim.value = withSpring(isActive ? 24 : 8, { damping: 12 });
  }, [isActive]);

  const style = useAnimatedStyle(() => ({
    width: widthAnim.value,
    opacity: withTiming(isActive ? 1 : 0.4, { duration: 200 }),
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        style,
        { backgroundColor: isActive ? color : Colors.textMuted },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  iconWrap: {
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: Theme.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 60,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: Theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
  },
});
