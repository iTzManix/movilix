import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { MainTabParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AssistantScreen from '../screens/AssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'map',
  History: 'list',
  Dashboard: 'bar-chart',
  Assistant: 'chatbubble-ellipses',
  Profile: 'person',
};

function AnimatedTabIcon({ name, focused }: { name: string; focused: boolean }) {
  const scale = useSharedValue(focused ? 1 : 0.9);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.15 : 1, { damping: 12 }) }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Ionicons
        name={ICONS[name] || 'ellipse'}
        size={22}
        color={focused ? Colors.primary : Colors.textMuted}
      />
    </Animated.View>
  );
}

function TabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            <AnimatedTabIcon name={route.name} focused={isFocused} />
            {isFocused && (
              <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    height: 68,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: { flex: 1, alignItems: 'center', paddingTop: 12 },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
});

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Assistant" component={AssistantScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
