// components/LanguageSwitcher.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import StylishButton from './StylishButton';
import { Colors, Typography, Spacing, Shadow } from '../constants/Theme';

const LanguageSwitcher = ({ style, variant = 'button', showLabel = true }) => {
  const { currentLanguage, availableLanguages, switchLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [switching, setSwitching] = useState(false);

  const currentLanguageInfo = availableLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = async (languageCode) => {
    setSwitching(true);
    setModalVisible(false);

    try {
      const success = await switchLanguage(languageCode);
      if (success) {
        Alert.alert(
          t('common.success'),
          t('language.changeSuccess')
        );
      } else {
        Alert.alert(
          t('common.error'),
          t('language.changeError')
        );
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('language.changeError')
      );
    } finally {
      setSwitching(false);
    }
  };

  const renderLanguageOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageOption,
        item.code === currentLanguage && styles.selectedLanguageOption
      ]}
      onPress={() => handleLanguageChange(item.code)}
      disabled={item.code === currentLanguage}
    >
      <View style={styles.languageOptionContent}>
        <Text style={[
          styles.languageName,
          item.code === currentLanguage && styles.selectedLanguageName
        ]}>
          {item.nativeName}
        </Text>
        <Text style={[
          styles.languageCode,
          item.code === currentLanguage && styles.selectedLanguageCode
        ]}>
          {item.name}
        </Text>
      </View>
      {item.code === currentLanguage && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  if (variant === 'inline') {
    return (
      <View style={[styles.inlineContainer, style]}>
        {showLabel && (
          <Text style={styles.inlineLabel}>
            {t('language.currentLanguage')}:
          </Text>
        )}
        <TouchableOpacity
          style={styles.inlineButton}
          onPress={() => setModalVisible(true)}
          disabled={switching}
        >
          <Text style={styles.inlineButtonText}>
            {currentLanguageInfo?.nativeName} ({currentLanguageInfo?.name})
          </Text>
          <Text style={styles.inlineButtonIcon}>⚙️</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {t('language.title')}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {t('language.subtitle')}
                </Text>
              </View>

              <FlatList
                data={availableLanguages}
                renderItem={renderLanguageOption}
                keyExtractor={(item) => item.code}
                style={styles.languageList}
                showsVerticalScrollIndicator={false}
              />

              <View style={styles.modalActions}>
                <StylishButton
                  title={t('common.close')}
                  onPress={() => setModalVisible(false)}
                  variant="outline"
                  size="medium"
                  fullWidth
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Default button variant
  return (
    <View style={[styles.container, style]}>
      <StylishButton
        title={showLabel ? t('profile.languageSettings') : `🌐 ${currentLanguageInfo?.nativeName}`}
        onPress={() => setModalVisible(true)}
        variant="tertiary"
        size="large"
        fullWidth
        disabled={switching}
        loading={switching}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('language.title')}
              </Text>
              <Text style={styles.modalSubtitle}>
                {t('language.subtitle')}
              </Text>
            </View>

            <FlatList
              data={availableLanguages}
              renderItem={renderLanguageOption}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.modalActions}>
              <StylishButton
                title={t('common.close')}
                onPress={() => setModalVisible(false)}
                variant="outline"
                size="medium"
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.small,
  },

  // Inline variant styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.small,
  },

  inlineLabel: {
    fontSize: Typography.sizes.medium,
    color: Colors.primaryText,
    fontWeight: Typography.weights.medium,
  },

  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: Spacing.small,
    ...Shadow.light,
  },

  inlineButtonText: {
    fontSize: Typography.sizes.medium,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
    marginRight: Spacing.small,
  },

  inlineButtonIcon: {
    fontSize: Typography.sizes.medium,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.large,
  },

  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.large,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...Shadow.heavy,
  },

  modalHeader: {
    padding: Spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.small,
  },

  modalSubtitle: {
    fontSize: Typography.sizes.medium,
    color: Colors.secondaryText,
    textAlign: 'center',
  },

  languageList: {
    maxHeight: 300,
  },

  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },

  selectedLanguageOption: {
    backgroundColor: Colors.primary + '10',
  },

  languageOptionContent: {
    flex: 1,
  },

  languageName: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.medium,
    color: Colors.primaryText,
    marginBottom: Spacing.tiny,
  },

  selectedLanguageName: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },

  languageCode: {
    fontSize: Typography.sizes.small,
    color: Colors.secondaryText,
  },

  selectedLanguageCode: {
    color: Colors.primary,
  },

  checkmark: {
    fontSize: Typography.sizes.large,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },

  modalActions: {
    padding: Spacing.large,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
});

export default LanguageSwitcher;