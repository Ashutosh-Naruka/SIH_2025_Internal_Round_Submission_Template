// i18n/index.js
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';

// Create i18n instance
const i18n = new I18n();

// Set available translations
i18n.translations = { en, hi };

// Set default locale
i18n.defaultLocale = 'en';

// Set fallback locale
i18n.fallbacks = true;

// Initialize with device locale or stored preference
const initializeI18n = async () => {
  try {
    // Set default locale first
    i18n.locale = 'en';
    
    // Try to get stored language preference
    const storedLanguage = await AsyncStorage.getItem('userLanguage');
    
    if (storedLanguage && i18n.translations[storedLanguage]) {
      i18n.locale = storedLanguage;
    } else {
      // Use device locale if available, otherwise default to English
      try {
        const deviceLocale = Localization.locale || 'en-US';
        const languageCode = deviceLocale ? deviceLocale.split('-')[0] : 'en';
        
        // Check if we support the device language
        if (i18n.translations[languageCode]) {
          i18n.locale = languageCode;
        }
      } catch (localizationError) {
        console.log('Error reading device locale:', localizationError);
        // Keep default 'en'
      }
    }
  } catch (error) {
    console.log('Error initializing i18n:', error);
    i18n.locale = 'en';
  }
};

// Function to change language and store preference
export const changeLanguage = async (languageCode) => {
  try {
    i18n.locale = languageCode;
    await AsyncStorage.setItem('userLanguage', languageCode);
  } catch (error) {
    console.log('Error changing language:', error);
  }
};

// Function to get current language
export const getCurrentLanguage = () => i18n.locale;

// Function to get available languages
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
];

// Translation function
export const t = (key, options = {}) => i18n.t(key, options);

// Initialize i18n
initializeI18n();

export default i18n;