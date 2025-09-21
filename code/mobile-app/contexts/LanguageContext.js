// contexts/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages, t } from '../i18n';

// Create Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language on app start
  useEffect(() => {
    const initLanguage = async () => {
      try {
        const lang = getCurrentLanguage();
        setCurrentLanguage(lang);
      } catch (error) {
        console.log('Error initializing language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, []);

  // Function to change language
  const switchLanguage = async (languageCode) => {
    try {
      await changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      return true;
    } catch (error) {
      console.log('Error switching language:', error);
      return false;
    }
  };

  // Function to get available languages
  const availableLanguages = getAvailableLanguages();

  // Function to translate text
  const translate = (key, options) => t(key, options);

  // Context value
  const value = {
    currentLanguage,
    isLoading,
    switchLanguage,
    availableLanguages,
    translate,
    t: translate // Alias for convenience
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use Language Context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// HOC for class components (if needed)
export const withLanguage = (Component) => {
  return (props) => {
    const languageProps = useLanguage();
    return <Component {...props} {...languageProps} />;
  };
};

export default LanguageContext;