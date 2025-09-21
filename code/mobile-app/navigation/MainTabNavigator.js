// navigation/MainTabNavigator.js
// Government of Jharkhand Civic Portal Navigation
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReportScreen from '../screens/ReportScreen';
import IssuesScreen from '../screens/IssuesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useLanguage } from '../contexts/LanguageContext';
import { Colors, Typography, Spacing } from '../constants/Theme';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator 
      initialRouteName="Issues"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.primary,
          borderTopWidth: 3,
          elevation: 10,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondaryText,
        tabBarLabelStyle: {
          fontSize: Typography.sizes.small,
          fontWeight: Typography.weights.semibold,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Report" 
        component={ReportScreen}
        options={{
          tabBarLabel: t('navigation.report'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              icon={focused ? "📝" : "📝"} 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Issues" 
        component={IssuesScreen}
        options={{
          tabBarLabel: t('navigation.issues'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              icon={focused ? "📋" : "📋"} 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: t('navigation.profile'),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon 
              icon={focused ? "👤" : "👤"} 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Custom Tab Icon Component
function TabIcon({ icon, color, focused }) {
  return (
    <Text style={{
      fontSize: focused ? 24 : 20,
      color: color,
      textAlign: 'center',
      transform: [{ scale: focused ? 1.1 : 1 }],
    }}>
      {icon}
    </Text>
  );
}
