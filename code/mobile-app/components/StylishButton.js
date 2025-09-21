// components/StylishButton.js
// Government of Jharkhand Civic Portal Button Component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow, Layout } from '../constants/Theme';

export default function StylishButton({ 
  title, 
  onPress, 
  style = {}, 
  textStyle = {},
  disabled = false,
  variant = 'primary',
  size = 'regular',
  fullWidth = false 
}) {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style
  ];

  const textStyles = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Base button style
  button: {
    ...Layout.buttonBase,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Button variants - Government themed
  primary: {
    backgroundColor: Colors.primary,
    ...Shadow.government,
  },
  
  secondary: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadow.medium,
  },
  
  tertiary: {
    backgroundColor: Colors.tertiary,
    ...Shadow.medium,
  },
  
  success: {
    backgroundColor: Colors.success,
    ...Shadow.medium,
  },
  
  warning: {
    backgroundColor: Colors.warning,
    ...Shadow.medium,
  },
  
  danger: {
    backgroundColor: Colors.error,
    ...Shadow.medium,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  
  government: {
    backgroundColor: Colors.primary,
    borderTopWidth: 3,
    borderTopColor: Colors.gold,
    ...Shadow.heavy,
  },
  
  // Button sizes
  small: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
  },
  
  regular: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  
  large: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.xlarge,
  },
  
  // Special styles
  fullWidth: {
    width: '100%',
  },
  
  disabled: {
    backgroundColor: Colors.mediumGray,
    shadowOpacity: 0,
    elevation: 0,
    borderColor: Colors.mediumGray,
  },
  
  // Text styles
  buttonText: {
    fontSize: Typography.sizes.regular,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  
  // Text variants
  primaryText: {
    color: Colors.lightText,
  },
  
  secondaryText: {
    color: Colors.primary,
  },
  
  tertiaryText: {
    color: Colors.lightText,
  },
  
  successText: {
    color: Colors.lightText,
  },
  
  warningText: {
    color: Colors.lightText,
  },
  
  dangerText: {
    color: Colors.lightText,
  },
  
  outlineText: {
    color: Colors.primary,
  },
  
  ghostText: {
    color: Colors.primary,
  },
  
  governmentText: {
    color: Colors.lightText,
    fontWeight: Typography.weights.bold,
  },
  
  disabledText: {
    color: Colors.darkGray,
  },
  
  // Text sizes
  smallText: {
    fontSize: Typography.sizes.medium,
  },
  
  regularText: {
    fontSize: Typography.sizes.regular,
  },
  
  largeText: {
    fontSize: Typography.sizes.large,
  },
});
