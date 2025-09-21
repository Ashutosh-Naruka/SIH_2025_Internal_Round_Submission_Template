// App.js
import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
}
