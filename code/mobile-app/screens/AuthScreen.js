// screens/AuthScreen.js
// Government of Jharkhand Civic Portal Authentication
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  KeyboardAvoidingView,
  Platform,
  Alert 
} from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import StylishButton from '../components/StylishButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { Colors, Typography, Spacing, Layout, GovernmentBranding, Shadow } from '../constants/Theme';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;
    
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Welcome!', 'Successfully logged into Jharkhand Civic Portal');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Account Created!', 'Welcome to Jharkhand Civic Portal');
      }
    } catch (err) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already registered. Please login instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner 
        text={isLogin ? "Authenticating with Jharkhand Portal..." : "Creating your government account..."}
        variant="government" 
        showBranding={true}
      />
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Government Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🏛️</Text>
            <Text style={styles.governmentTitle}>Government of Jharkhand</Text>
            <Text style={styles.portalSubtitle}>Civic Issue Reporting Portal</Text>
            <View style={styles.divider} />
          </View>
        </View>

        {/* Auth Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Citizen Login' : 'Create Account'}
          </Text>
          
          <Text style={styles.formSubtitle}>
            {isLogin 
              ? 'Access your civic reporting dashboard' 
              : 'Join the digital governance initiative'
            }
          </Text>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={[
                styles.input, 
                validationErrors.email && styles.inputError
              ]}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => {
                setEmail(text);
                if (validationErrors.email) {
                  setValidationErrors(prev => ({ ...prev, email: null }));
                }
              }}
              value={email}
            />
            {validationErrors.email && (
              <Text style={styles.validationError}>{validationErrors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={[
                styles.input, 
                validationErrors.password && styles.inputError
              ]}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => {
                setPassword(text);
                if (validationErrors.password) {
                  setValidationErrors(prev => ({ ...prev, password: null }));
                }
              }}
              value={password}
            />
            {validationErrors.password && (
              <Text style={styles.validationError}>{validationErrors.password}</Text>
            )}
          </View>

          {/* Auth Button */}
          <StylishButton 
            title={isLogin ? '🚀 Access Portal' : '✨ Create Account'}
            onPress={handleAuth}
            variant="government"
            size="large"
            fullWidth={true}
            style={styles.authButton}
            disabled={loading}
          />

          {/* Switch Auth Mode */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchPrompt}>
              {isLogin ? "New to the portal?" : 'Already have an account?'}
            </Text>
            <StylishButton 
              title={isLogin ? 'Create Account' : 'Login Here'}
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
                setValidationErrors({});
              }}
              variant="outline"
              size="small"
              style={styles.switchButton}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌟 Digital India Initiative</Text>
          <Text style={styles.footerSubText}>Empowering citizens through technology</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.xlarge,
  },
  
  // Header Section
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.xlarge,
    alignItems: 'center',
    ...Shadow.government,
  },
  
  logoContainer: {
    alignItems: 'center',
  },
  
  logoText: {
    fontSize: 48,
    marginBottom: Spacing.small,
  },
  
  governmentTitle: {
    ...GovernmentBranding.officialTitle,
    fontSize: Typography.sizes.xxlarge,
  },
  
  portalSubtitle: {
    ...GovernmentBranding.officialSubtitle,
    fontSize: Typography.sizes.regular,
  },
  
  divider: {
    width: 80,
    height: 3,
    backgroundColor: Colors.gold,
    marginTop: Spacing.medium,
    borderRadius: 2,
  },
  
  // Form Section
  formCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    marginTop: -Spacing.xlarge,
    borderRadius: Spacing.large,
    padding: Spacing.xlarge,
    ...Shadow.heavy,
    borderTopWidth: 4,
    borderTopColor: Colors.gold,
  },
  
  formTitle: {
    fontSize: Typography.sizes.huge,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.small,
  },
  
  formSubtitle: {
    fontSize: Typography.sizes.regular,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.xlarge,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.regular,
  },
  
  // Error Handling
  errorContainer: {
    backgroundColor: Colors.error + '15',
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: Spacing.medium,
    padding: Spacing.medium,
    marginBottom: Spacing.large,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  errorIcon: {
    fontSize: Typography.sizes.large,
    marginRight: Spacing.small,
  },
  
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  
  // Input Styling
  inputContainer: {
    marginBottom: Spacing.large,
  },
  
  inputLabel: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryText,
    marginBottom: Spacing.small,
  },
  
  input: {
    ...Layout.input,
    fontSize: Typography.sizes.regular,
    borderColor: Colors.mediumGray,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    backgroundColor: Colors.white,
  },
  
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  
  validationError: {
    color: Colors.error,
    fontSize: Typography.sizes.small,
    marginTop: Spacing.tiny,
    fontWeight: Typography.weights.medium,
  },
  
  // Button Styling
  authButton: {
    marginTop: Spacing.medium,
    marginBottom: Spacing.large,
  },
  
  // Switch Mode Section
  switchContainer: {
    alignItems: 'center',
    paddingTop: Spacing.large,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  
  switchPrompt: {
    fontSize: Typography.sizes.regular,
    color: Colors.secondaryText,
    marginBottom: Spacing.small,
  },
  
  switchButton: {
    marginTop: Spacing.small,
  },
  
  // Footer Section
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xlarge,
    paddingHorizontal: Spacing.large,
  },
  
  footerText: {
    fontSize: Typography.sizes.regular,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    textAlign: 'center',
  },
  
  footerSubText: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: Spacing.tiny,
    fontStyle: 'italic',
  },
});
