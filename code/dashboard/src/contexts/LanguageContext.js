// src/contexts/LanguageContext.js
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Header
    title: "Jharkhand Civic Reporter Dashboard",
    subtitle: "Government of Jharkhand - Civic Issue Management System",
    
    // Navigation
    overview: "Overview & Map",
    management: "Issue Management",
    analytics: "Analytics",
    aiInsights: "AI Insights",
    resourceOptimizer: "Resource Optimizer",
    
    // Stats Cards
    totalIssues: "Total Issues",
    pendingIssues: "Pending Issues", 
    resolvedIssues: "Resolved Issues",
    inProgressIssues: "In Progress",
    
    // Common
    loading: "Loading Dashboard...",
    recent: "Recent Issues",
    map: "Issues Map",
    category: "Category",
    status: "Status",
    priority: "Priority",
    location: "Location",
    description: "Description",
    date: "Date",
    reportedBy: "Reported By",
    
    // Issue Categories
    pothole: "Pothole",
    streetlight: "Street Light",
    garbage: "Garbage",
    water: "Water Issue",
    traffic: "Traffic",
    general: "General",
    
    // Status
    reported: "Reported",
    inProgress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
    
    // Analytics
    analyticsTitle: "Analytics Dashboard",
    categoryBreakdown: "Issues by Category",
    statusDistribution: "Status Distribution",
    dailyTrends: "Daily Trends (Last 7 Days)",
    newIssues: "New Issues",
    resolvedIssuesChart: "Resolved Issues",
    
    // AI Insights
    aiInsightsTitle: "AI Insights & Analysis",
    
    // Resource Optimizer
    resourceOptimizerTitle: "Resource Allocation Optimizer",
    
    // Actions
    viewDetails: "View Details",
    updateStatus: "Update Status",
    assign: "Assign",
    export: "Export",
    filter: "Filter",
    search: "Search",
    markInProgress: "Mark In Progress",
    markResolved: "Mark Resolved",
    viewImage: "View Image",
    noImage: "No Image",
    imageAlt: "Issue Image",
    
    // Time
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month",
    
    // Footer
    poweredBy: "Powered by Government of Jharkhand",
    version: "Version 1.0.0",
    
    // Additional UI elements
    close: "Close",
    openInNewTab: "Open in New Tab",
    download: "Download",
    quickStats: "Quick Stats",
    backToHome: "Back to Home",
    
    // Resource Optimizer
    resourceCalculating: "Calculating resource allocation...",
    pendingIssuesCount: "Pending Issues",
    estimatedCost: "Estimated Cost",
    efficiencyScore: "Efficiency Score",
    optimizationSuggestions: "Optimization Suggestions",
    highPriority: "High Priority",
    mediumPriority: "Medium Priority",
    totalIssuesCount: "Total Issues",
    completionTime: "Completion Time",
    optimalRoutes: "Optimal Routes",
    route: "Route",
    issues: "issues",
    hours: "hours",
    days: "days",
    noSpecialSuggestions: "No special suggestions - everything looks good!",
    
    // AI Insights additional
    analysis: "AI Analysis",
    processedIssues: "Processed Issues",
    avgConfidence: "Avg Confidence",
    topCategories: "Top Categories",
    highImpactIssues: "High Impact Issues",
    departmentWorkload: "Department Workload",
    predictedHotspots: "Predicted Hotspots",
    hotspot: "Hotspot",
    average: "Avg",
    noHotspots: "No hotspots found"
  },
  
  hi: {
    // Header
    title: "झारखंड नागरिक रिपोर्टर डैशबोर्ड",
    subtitle: "झारखंड सरकार - नागरिक समस्या प्रबंधन प्रणाली",
    
    // Navigation
    overview: "अवलोकन और मानचित्र",
    management: "समस्या प्रबंधन",
    analytics: "विश्लेषण",
    aiInsights: "AI अंतर्दृष्टि",
    resourceOptimizer: "संसाधन अनुकूलक",
    
    // Stats Cards
    totalIssues: "कुल समस्याएं",
    pendingIssues: "लंबित समस्याएं",
    resolvedIssues: "हल की गई समस्याएं",
    inProgressIssues: "प्रगतिरत",
    
    // Common
    loading: "डैशबोर्ड लोड हो रहा है...",
    recent: "हाल की समस्याएं",
    map: "समस्या मानचित्र",
    category: "श्रेणी",
    status: "स्थिति",
    priority: "प्राथमिकता",
    location: "स्थान",
    description: "विवरण",
    date: "दिनांक",
    reportedBy: "द्वारा रिपोर्ट किया गया",
    
    // Issue Categories
    pothole: "गड्ढा",
    streetlight: "स्ट्रीट लाइट",
    garbage: "कचरा",
    water: "पानी की समस्या",
    traffic: "यातायात",
    general: "सामान्य",
    
    // Status
    reported: "रिपोर्ट किया गया",
    inProgress: "प्रगतिरत",
    resolved: "हल किया गया",
    closed: "बंद",
    
    // Analytics
    analyticsTitle: "विश्लेषण डैशबोर्ड",
    categoryBreakdown: "श्रेणी के अनुसार समस्याएं",
    statusDistribution: "स्थिति वितरण",
    dailyTrends: "दैनिक रुझान (पिछले 7 दिन)",
    newIssues: "नई समस्याएं",
    resolvedIssuesChart: "हल की गई समस्याएं",
    
    // AI Insights
    aiInsightsTitle: "AI अंतर्दृष्टि और विश्लेषण",
    
    // Resource Optimizer
    resourceOptimizerTitle: "संसाधन आवंटन अनुकूलक",
    
    // Actions
    viewDetails: "विवरण देखें",
    updateStatus: "स्थिति अपडेट करें",
    assign: "असाइन करें",
    export: "निर्यात करें",
    filter: "फिल्टर",
    search: "खोजें",
    markInProgress: "प्रगतिरत करें",
    markResolved: "हल करें",
    viewImage: "चित्र देखें",
    noImage: "कोई चित्र नहीं",
    imageAlt: "समस्या का चित्र",
    
    // Time
    today: "आज",
    yesterday: "कल",
    thisWeek: "इस सप्ताह",
    thisMonth: "इस महीने",
    
    // Footer
    poweredBy: "झारखंड सरकार द्वारा संचालित",
    version: "संस्करण 1.0.0",
    
    // Additional UI elements
    close: "बंद करें",
    openInNewTab: "नई विंडो में खोलें",
    download: "डाउनलोड",
    quickStats: "तुरंत आँकड़े",
    backToHome: "घर वापस",
    
    // Resource Optimizer
    resourceCalculating: "संसाधन आवंटन की गणना हो रही है...",
    pendingIssuesCount: "लंबित समस्याएं",
    estimatedCost: "अनुमानित लागत",
    efficiencyScore: "दक्षता स्कोर",
    optimizationSuggestions: "अनुकूलन सुझाव",
    highPriority: "उच्च प्राथमिकता",
    mediumPriority: "मध्यम प्राथमिकता",
    totalIssuesCount: "कुल समस्याएं",
    completionTime: "पूर्णता समय",
    optimalRoutes: "इष्टतम मार्ग",
    route: "मार्ग",
    issues: "समस्याएं",
    hours: "घंटे",
    days: "दिन",
    noSpecialSuggestions: "कोई विशेष सुझाव नहीं - सभी कुछ ठीक लग रहा है!",
    
    // AI Insights additional
    analysis: "AI विश्लेषण",
    processedIssues: "प्रोसेस्ड समस्याएं",
    avgConfidence: "औसत विश्वास",
    topCategories: "शीर्ष श्रेणियां",
    highImpactIssues: "उच्च प्रभाव समस्याएं",
    departmentWorkload: "विभागीय कार्यभार",
    predictedHotspots: "पूर्वानुमानित हॉटस्पॉट",
    hotspot: "हॉटस्पॉट",
    average: "औसत",
    noHotspots: "कोई हॉटस्पॉट नहीं मिले"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hi'); // Default to Hindi for Jharkhand
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  const switchLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };
  
  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: switchLanguage,
      t,
      isHindi: language === 'hi'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};