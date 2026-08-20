/**
 * Tab Navigation Layout
 * Main bottom tab navigation for the app
 */

import React from 'react';
import { useColorScheme, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const screenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: isDark ? Colors.primary.sky : Colors.primary.ocean,
    tabBarInactiveTintColor: colors.tabIconDefault,
    tabBarButton: HapticTab,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: Spacing.xs,
    },
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      paddingBottom: Spacing.xs,
      paddingTop: Spacing.xs,
      height: 70,
      paddingHorizontal: Spacing.md,
      ...Platform.select({
        ios: {
          paddingBottom: Spacing.xl,
        },
      }),
    },
    headerShown: false,
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="airplane-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
