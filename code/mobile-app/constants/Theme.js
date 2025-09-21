// constants/Theme.js
// Official Government of Jharkhand Color Theme & Design System

export const Colors = {
  // Primary Government Colors (Jharkhand Official Colors)
  primary: '#FF6B35',        // Saffron/Orange - Main government color
  secondary: '#2E7D32',      // Forest Green - Represents Jharkhand's forests
  tertiary: '#1565C0',       // Government Blue - Professional blue
  
  // Accent Colors
  accent: '#FFA726',         // Light orange
  gold: '#FFD700',          // Gold for important highlights
  
  // Status Colors
  success: '#4CAF50',       // Green for success states
  warning: '#FF9800',       // Orange for warnings
  error: '#D32F2F',         // Red for errors
  info: '#2196F3',          // Blue for information
  
  // Neutral Colors
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkGray: '#757575',
  charcoal: '#424242',
  black: '#000000',
  
  // Background Colors
  background: '#FAFAFA',
  cardBackground: '#FFFFFF',
  headerBackground: '#FF6B35',
  
  // Text Colors
  primaryText: '#212121',
  secondaryText: '#757575',
  lightText: '#FFFFFF',
  linkText: '#1565C0',
  
  // Government Specific Colors
  governmentSeal: '#8B4513',    // Brown for official seals
  documentBg: '#FFFEF7',        // Cream for official documents
  officialStamp: '#DC143C',     // Crimson for official stamps
};

export const Typography = {
  // Font Sizes
  sizes: {
    tiny: 10,
    small: 12,
    medium: 14,
    regular: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    huge: 28,
    massive: 32,
  },
  
  // Font Weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

export const Spacing = {
  // Standard spacing units
  tiny: 4,
  small: 8,
  medium: 12,
  regular: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  huge: 40,
  massive: 48,
};

export const BorderRadius = {
  tiny: 2,
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 50,
};

export const Shadow = {
  light: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  heavy: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  government: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const Layout = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Government header style
  governmentHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.regular,
    alignItems: 'center',
    ...Shadow.government,
  },
  
  // Card styles
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.medium,
    padding: Spacing.regular,
    marginVertical: Spacing.small,
    marginHorizontal: Spacing.regular,
    ...Shadow.medium,
  },
  
  // Form styles
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.large,
    margin: Spacing.regular,
    ...Shadow.medium,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    fontSize: Typography.sizes.regular,
    backgroundColor: Colors.white,
    marginBottom: Spacing.small,
  },
  
  // Button base style
  buttonBase: {
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.small,
  },
};

export const GovernmentBranding = {
  // Official text styles
  officialTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.lightText,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  
  officialSubtitle: {
    fontSize: Typography.sizes.regular,
    fontWeight: Typography.weights.medium,
    color: Colors.lightText,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: Spacing.tiny,
  },
  
  departmentText: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  
  sectionHeader: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryText,
    marginBottom: Spacing.medium,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: Spacing.small,
  },
  
  // Status badge styles
  statusBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.tiny,
    borderRadius: BorderRadius.medium,
    alignSelf: 'flex-start',
  },
  
  // Priority indicators
  priorityHigh: {
    backgroundColor: Colors.error,
    color: Colors.white,
  },
  
  priorityMedium: {
    backgroundColor: Colors.warning,
    color: Colors.white,
  },
  
  priorityLow: {
    backgroundColor: Colors.success,
    color: Colors.white,
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadow,
  Layout,
  GovernmentBranding,
};