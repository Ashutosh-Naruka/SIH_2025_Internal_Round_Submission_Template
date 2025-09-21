// components/LoadingSpinner.js
// Government of Jharkhand Civic Portal Loading Component
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, GovernmentBranding } from '../constants/Theme';

export default function LoadingSpinner({ 
  text = "Loading...",
  variant = 'government',
  showBranding = false 
}) {
  return (
    <View style={[styles.container, styles[variant]]}>
      {showBranding && (
        <View style={styles.brandingContainer}>
          <Text style={styles.governmentText}>🏛️ Government of Jharkhand</Text>
          <Text style={styles.departmentText}>Civic Issue Reporting System</Text>
          <View style={styles.divider} />
        </View>
      )}
      
      <ActivityIndicator 
        size="large" 
        color={variant === 'government' ? Colors.primary : Colors.tertiary} 
      />
      
      <Text style={[styles.text, styles[`${variant}Text`]]}>{text}</Text>
      
      {showBranding && (
        <Text style={styles.officialText}>Official Government Portal</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
  },
  
  // Variant styles
  government: {
    backgroundColor: Colors.background,
  },
  
  light: {
    backgroundColor: Colors.white,
  },
  
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  
  // Text styles
  text: {
    marginTop: Spacing.medium,
    fontSize: Typography.sizes.regular,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  
  governmentText: {
    color: Colors.secondaryText,
  },
  
  lightText: {
    color: Colors.primaryText,
  },
  
  overlayText: {
    color: Colors.primaryText,
  },
  
  // Branding styles
  brandingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xlarge,
  },
  
  governmentText: {
    ...GovernmentBranding.officialTitle,
    color: Colors.primary,
    fontSize: Typography.sizes.large,
  },
  
  departmentText: {
    ...GovernmentBranding.departmentText,
    marginTop: Spacing.tiny,
  },
  
  officialText: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    marginTop: Spacing.medium,
    fontStyle: 'italic',
  },
  
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: Spacing.medium,
  },
});
