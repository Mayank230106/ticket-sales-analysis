import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          // Disable headers for all tabs
          headerShown: false,

          // Tab bar styling with a slight background for distinction
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#F8FAFC', // Light greyish background for better contrast
            borderTopWidth: 0,
            elevation: 3,
            shadowOpacity: 0.1,
            height: 60,
            position: 'absolute',
            bottom: 10,
            borderRadius: 20,
            marginHorizontal: 15,
            paddingBottom: 8,
          },

          // Individual tab styling with background distinction
          tabBarItemStyle: {
            backgroundColor: '#E2E8F0', // Light blue-gray for subtle contrast
            borderRadius: 15,
            marginHorizontal: 8,
            paddingVertical: 6,
          },

          // Active/inactive colors
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="home"
                size={size}
                color={focused ? '#4CAF50' : '#718096'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="new_events"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="add"
                size={size}
                color={focused ? '#4CAF50' : '#718096'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="analytics"
                size={size}
                color={focused ? '#4CAF50' : '#718096'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="past"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="time"
                size={size}
                color={focused ? '#4CAF50' : '#718096'}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
