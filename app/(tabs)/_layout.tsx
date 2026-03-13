/**
 * Tab Layout - 5-Tab Navigation
 * As per ROADMAP Section 3
 * 
 * Tabs:
 * 1. Home     - Daily verse, mood, prayer times, special days
 * 2. Qur'an   - Read/Listen to Qur'an
 * 3. Listen   - Prophet stories + Duas (audio content)
 * 4. Explore  - Categorized content discovery (file: explore.tsx)
 * 5. Profile  - Settings, streak, bookmarks
 * 
 * No additional tabs. No floating actions.
 */

import { Tabs } from 'expo-router';
import { BookOpen, Compass, Headphones, Home, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { DesignTokens } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: DesignTokens.accent.primary,
        tabBarInactiveTintColor: DesignTokens.text.muted,
        tabBarButton: HapticTab,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: "Qur'an",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          title: 'Listen',
          tabBarIcon: ({ color, focused }) => (
            <Headphones 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Compass 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5} 
            />
          ),
        }}
      />
      {/* Keep discover as a hidden alias while the codebase standardizes on explore */}
      <Tabs.Screen
        name="discover"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: DesignTokens.background.surface,
    borderTopWidth: 1,
    borderTopColor: DesignTokens.border.subtle,
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});
