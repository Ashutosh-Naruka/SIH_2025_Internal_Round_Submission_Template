import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, ScrollView, Platform, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, query, getDocs, limit } from 'firebase/firestore';
import { classifyIssue, calculateImpactScore } from '../utils/aiClassification';
import { detectDuplicates, calculatePriority } from '../utils/duplicateDetection';
import LoadingSpinner from '../components/LoadingSpinner';
import StylishButton from '../components/StylishButton';
import { useLanguage } from '../contexts/LanguageContext';
import { Colors, Typography, Spacing, Layout, GovernmentBranding, Shadow } from '../constants/Theme';

export default function ReportScreen() {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [image, setImage] = useState(null); // preview
  const [imageBase64, setImageBase64] = useState(null); // for Firestore
  const [uploading, setUploading] = useState(false);
  
  // Day 8 additions - Error handling states
  const [submitError, setSubmitError] = useState('');
  const [locationError, setLocationError] = useState('');

  // Predefined categories for Jharkhand Government
  const categories = [
    { label: t('report.categories.pothole'), value: 'pothole' },
    { label: t('report.categories.streetlight'), value: 'streetlight' },
    { label: t('report.categories.garbage'), value: 'garbage' },
    { label: t('report.categories.water'), value: 'water' },
    { label: t('report.categories.traffic'), value: 'traffic' },
    { label: t('report.categories.safety'), value: 'safety' },
    { label: t('report.categories.parks'), value: 'parks' },
    { label: t('report.categories.construction'), value: 'construction' },
    { label: t('report.categories.electricity'), value: 'electricity' },
    { label: t('report.categories.general'), value: 'general' }
  ];

  // Enhanced image picker with permission handling
  const pickImage = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          t('common.error'),
          t('report.cameraPermissionError') || 'Camera permission is required to take photos',
          [
            {
              text: t('common.cancel') || 'Cancel',
              style: 'cancel'
            },
            {
              text: t('common.settings') || 'Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
        return;
      }

      // Launch camera
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // 🔑 Extra compression + resize step
        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 800 } }], // downscale width (keeps aspect ratio)
          { compress: 0.2, base64: true, format: ImageManipulator.SaveFormat.JPEG }
        );

        setImage(manipResult.uri); // preview
        setImageBase64(`data:image/jpeg;base64,${manipResult.base64}`); // save to Firestore
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        t('common.error'),
        t('report.cameraError') || 'Unable to access camera. Please try again.',
        [{ text: t('common.ok') || 'OK' }]
      );
    }
  };

  // Enhanced getCurrentLocation with better error handling (Day 8)
  const getCurrentLocation = async () => {
    try {
      setLocationError('');
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError(t('report.locationError'));
        Alert.alert(t('common.error'), t('report.locationPermissionError'));
        return null;
      }

      // Show loading for location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000, // 10 second timeout
      });

      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: loc.timestamp,
        accuracy: loc.coords.accuracy
      };
    } catch (error) {
      setLocationError(`Location error: ${error.message}`);
      // Fallback to low accuracy
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
          timeout: 5000
        });
        return {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
          accuracy: loc.coords.accuracy
        };
      } catch (fallbackError) {
        Alert.alert(t('common.error'), t('report.locationFallbackError'));
        return null;
      }
    }
  };

  // Day 8 addition - Check network connection
  const checkNetworkConnection = async () => {
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        timeout: 5000 
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Enhanced handleSubmit with Day 8 improvements + your existing logic
  const handleSubmit = async () => {
    if (!description || !imageBase64) {
      Alert.alert(t('common.error'), t('report.validationError'));
      return;
    }

    setUploading(true);
    setSubmitError(''); // Day 8 addition

    try {
      // Day 8 addition - Check network connection
      const isOnline = await checkNetworkConnection();
      if (!isOnline) {
        throw new Error(t('report.networkError'));
      }

      const loc = await getCurrentLocation();
      if (!loc) throw new Error(t('report.locationError'));

      // AI Classification with error handling (Day 8 enhancement)
      let aiAnalysis;
      try {
        aiAnalysis = classifyIssue(description, category);
      } catch (aiError) {
        // Fallback to basic classification
        aiAnalysis = {
          category: category || 'general',
          confidence: 0.5,
          department: 'general',
          estimatedCost: 5000,
          severity: 'medium'
        };
      }

      // Duplicate detection with timeout (Day 8 enhancement)
      let duplicates = [];
      try {
        const nearbyQuery = query(collection(db, 'issues'), limit(50));
        const nearbySnapshot = await Promise.race([
          getDocs(nearbyQuery),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);

        const existingIssues = nearbySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));

        const newIssueData = {
          description,
          category: aiAnalysis.category,
          severity: aiAnalysis.severity,
          location: loc,
          createdAt: new Date()
        };

        duplicates = detectDuplicates(newIssueData, existingIssues);
      } catch (duplicateError) {
        console.log('Duplicate detection skipped:', duplicateError.message);
      }

      // Show duplicate warning if found (keeping your existing logic)
      if (duplicates.length > 0) {
        const topDuplicate = duplicates[0];
        const proceed = await new Promise((resolve) => {
          Alert.alert(
            t('report.duplicateTitle'),
            t('report.duplicateMessage', { 
              category: topDuplicate.issue.category, 
              similarity: Math.round(topDuplicate.similarity * 100) 
            }),
            [
              { text: t('common.cancel'), onPress: () => resolve(false) },
              { text: t('report.reportAnyway'), onPress: () => resolve(true) }
            ]
          );
        });

        if (!proceed) {
          setUploading(false);
          return;
        }
      }

      const impactScore = calculateImpactScore({ 
        description, 
        category: aiAnalysis.category, 
        severity: aiAnalysis.severity, 
        createdAt: new Date() 
      });
      const priority = calculatePriority({ 
        description, 
        category: aiAnalysis.category, 
        severity: aiAnalysis.severity, 
        createdAt: new Date() 
      }, duplicates);

      // Your existing sanitization logic
      const sanitizeForFirestore = (obj) => {
        const copy = { ...obj };
        Object.keys(copy).forEach(k => {
          if (typeof copy[k] === 'undefined') delete copy[k];
        });
        return copy;
      };

      // Prepare data with sanitization (Day 8 enhancement)
      const sanitizedData = {
        description: description.trim(),
        category: aiAnalysis.category,
        severity: aiAnalysis.severity,
        department: aiAnalysis.department,
        estimatedCost: aiAnalysis.estimatedCost,
        impactScore: Math.round(impactScore),
        priority: Math.round(priority),
        duplicatesFound: duplicates.length,
        aiAnalysis: {
          confidence: aiAnalysis.confidence,
          aiGenerated: true,
          processedAt: new Date().toISOString()
        },
        imageUrl: imageBase64,
        location: loc,
        reportedBy: auth.currentUser?.email || 'anonymous',
        status: 'reported',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'issues'), sanitizeForFirestore(sanitizedData));

      // Reset form (keeping your existing logic)
      setDescription('');
      setCategory('');
      setImage(null);
      setImageBase64(null);

      Alert.alert(
        t('report.successTitle'),
        t('report.successMessage', {
          category: aiAnalysis.category,
          confidence: Math.round(aiAnalysis.confidence * 100),
          priority: Math.round(priority),
          impact: Math.round(impactScore)
        })
      );
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err.message); // Day 8 addition
      Alert.alert(t('common.error'), t('report.submitError'));
    }

    setUploading(false);
  };

  if (uploading) {
    return (
      <LoadingSpinner 
        text={t('report.submitting')}
        variant="government" 
        showBranding={true}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Government Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerIcon}>🏛️</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.governmentTitle}>{t('report.headerTitle')}</Text>
            <Text style={styles.departmentText}>{t('report.headerSubtitle')}</Text>
          </View>
        </View>
        
        <View style={styles.headerBottom}>
          <Text style={styles.portalTitle}>{t('report.portalTitle')}</Text>
          <Text style={styles.portalSubtitle}>{t('report.portalSubtitle')}</Text>
        </View>
        
        <View style={styles.headerDivider} />
      </View>

      {/* Form Section */}
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>{t('report.formTitle')}</Text>
          <Text style={styles.formSubtitle}>{t('report.formSubtitle')}</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('report.categoryTitle')}{t('report.categoryRequired')}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={styles.picker}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('report.descriptionTitle')}</Text>
          <Text style={styles.sectionSubtitle}>
            {t('report.descriptionSubtitle')}
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder={t('report.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Photo Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('report.photoTitle')}</Text>
          <Text style={styles.sectionSubtitle}>
            {t('report.photoSubtitle')}
          </Text>
          
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageCheckmark}>✓</Text>
                <Text style={styles.imageSuccessText}>{t('report.photoAttached')}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageIcon}>📷</Text>
              <Text style={styles.noImageText}>{t('report.noPhoto')}</Text>
            </View>
          )}
          
          <StylishButton 
            title={image ? t('report.retakePhoto') : t('report.takePhoto')} 
            onPress={pickImage}
            variant={image ? "secondary" : "tertiary"}
            size="large"
            fullWidth={true}
          />
        </View>

        {/* Error and Warning Messages */}
        {submitError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        )}

        {locationError && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>{locationError}</Text>
          </View>
        )}

        {/* Submit Section */}
        <View style={styles.submitSection}>
          <StylishButton 
            title={t('report.submitButton')}
            onPress={handleSubmit}
            disabled={!description || !imageBase64}
            variant="government"
            size="large"
            fullWidth={true}
          />
          
          <Text style={styles.submitNote}>
            {t('report.submitNote')}
          </Text>
        </View>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>✨ Digital India • Transparent Governance</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header Section
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: Spacing.xlarge,
    paddingHorizontal: Spacing.large,
    ...Shadow.government,
  },
  
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  
  headerIcon: {
    fontSize: 32,
    marginRight: Spacing.medium,
  },
  
  headerTextContainer: {
    flex: 1,
  },
  
  governmentTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.lightText,
  },
  
  departmentText: {
    fontSize: Typography.sizes.medium,
    color: Colors.lightText,
    opacity: 0.9,
    marginTop: 2,
  },
  
  headerBottom: {
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  
  portalTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.lightText,
    textAlign: 'center',
  },
  
  portalSubtitle: {
    fontSize: Typography.sizes.regular,
    color: Colors.lightText,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: Spacing.tiny,
  },
  
  headerDivider: {
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    alignSelf: 'center',
    width: '60%',
  },
  
  // Form Section
  formCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    marginTop: -Spacing.large,
    borderRadius: Spacing.large,
    padding: Spacing.xlarge,
    ...Shadow.heavy,
    borderTopWidth: 4,
    borderTopColor: Colors.gold,
  },
  
  formHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xlarge,
    paddingBottom: Spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  
  formTitle: {
    fontSize: Typography.sizes.huge,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textAlign: 'center',
  },
  
  formSubtitle: {
    fontSize: Typography.sizes.regular,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: Spacing.small,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.regular,
  },
  
  // Section Styling
  sectionContainer: {
    marginBottom: Spacing.xlarge,
  },
  
  sectionTitle: {
    ...GovernmentBranding.sectionHeader,
    fontSize: Typography.sizes.large,
  },
  
  sectionSubtitle: {
    fontSize: Typography.sizes.medium,
    color: Colors.secondaryText,
    marginBottom: Spacing.medium,
    lineHeight: Typography.lineHeights.normal * Typography.sizes.medium,
  },
  
  // Picker Styling
  pickerWrapper: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Spacing.medium,
    backgroundColor: Colors.documentBg,
    overflow: 'hidden',
  },
  
  picker: {
    height: 50,
    color: Colors.primaryText,
  },
  
  // Text Area Styling
  textArea: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Spacing.medium,
    padding: Spacing.medium,
    fontSize: Typography.sizes.regular,
    color: Colors.primaryText,
    backgroundColor: Colors.documentBg,
    minHeight: 120,
    ...Shadow.light,
  },
  
  // Image Section
  imagePreviewContainer: {
    position: 'relative',
    marginVertical: Spacing.medium,
  },
  
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: Spacing.medium,
    backgroundColor: Colors.lightGray,
  },
  
  imageOverlay: {
    position: 'absolute',
    top: Spacing.small,
    right: Spacing.small,
    backgroundColor: Colors.success,
    borderRadius: Spacing.large,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.medium,
  },
  
  imageCheckmark: {
    color: Colors.lightText,
    fontSize: Typography.sizes.regular,
    fontWeight: Typography.weights.bold,
    marginRight: Spacing.tiny,
  },
  
  imageSuccessText: {
    color: Colors.lightText,
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
  },
  
  noImageContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: Spacing.medium,
    paddingVertical: Spacing.xlarge,
    alignItems: 'center',
    marginVertical: Spacing.medium,
    borderWidth: 2,
    borderColor: Colors.mediumGray,
    borderStyle: 'dashed',
  },
  
  noImageIcon: {
    fontSize: Typography.sizes.massive,
    marginBottom: Spacing.small,
  },
  
  noImageText: {
    fontSize: Typography.sizes.regular,
    color: Colors.secondaryText,
    fontWeight: Typography.weights.medium,
  },
  
  // Error and Warning Messages
  errorContainer: {
    backgroundColor: Colors.error + '10',
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: Spacing.medium,
    padding: Spacing.medium,
    marginVertical: Spacing.medium,
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
  
  warningContainer: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: Spacing.medium,
    padding: Spacing.medium,
    marginVertical: Spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  warningIcon: {
    fontSize: Typography.sizes.large,
    marginRight: Spacing.small,
  },
  
  warningText: {
    color: Colors.warning,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  
  // Submit Section
  submitSection: {
    alignItems: 'center',
    paddingTop: Spacing.xlarge,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  
  submitNote: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: Spacing.medium,
    fontStyle: 'italic',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.small,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xlarge,
    paddingHorizontal: Spacing.large,
  },
  
  footerText: {
    fontSize: Typography.sizes.medium,
    color: Colors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
