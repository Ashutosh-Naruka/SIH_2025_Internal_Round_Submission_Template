// CivicReporter/utils/aiClassification.js
export const classifyIssue = (description, category = '') => {
  const keywords = {
    'pothole': {
      keywords: ['hole', 'road', 'street', 'damage', 'crack', 'bump', 'rough', 'broken road', 'pavement', 'infrastructure'],
      department: 'public_works',
      urgency: 'high',
      estimatedCost: 5000
    },
    'streetlight': {
      keywords: ['light', 'lamp', 'dark', 'broken', 'not working', 'electricity', 'bulb', 'pole'],
      department: 'electrical',
      urgency: 'medium',
      estimatedCost: 2000
    },
    'garbage': {
      keywords: ['waste', 'trash', 'dump', 'dirty', 'smell', 'bin', 'litter', 'overflow', 'collection'],
      department: 'sanitation',
      urgency: 'high',
      estimatedCost: 1000
    },
    'water': {
      keywords: ['leak', 'pipe', 'drain', 'overflow', 'sewage', 'water', 'burst', 'flooding', 'tap'],
      department: 'water_dept',
      urgency: 'critical',
      estimatedCost: 8000
    },
    'traffic': {
      keywords: ['signal', 'sign', 'traffic', 'zebra', 'crossing', 'junction', 'congestion'],
      department: 'traffic_police',
      urgency: 'medium',
      estimatedCost: 3000
    },
    'safety': {
      keywords: ['unsafe', 'danger', 'security', 'crime', 'violence', 'theft', 'harassment'],
      department: 'police',
      urgency: 'critical',
      estimatedCost: 2000
    },
    'parks': {
      keywords: ['park', 'garden', 'playground', 'trees', 'maintenance', 'recreation'],
      department: 'parks_dept',
      urgency: 'low',
      estimatedCost: 3000
    },
    'construction': {
      keywords: ['building', 'construction', 'illegal', 'permit', 'violation', 'structure'],
      department: 'building_dept',
      urgency: 'medium',
      estimatedCost: 10000
    },
    'electricity': {
      keywords: ['power', 'electricity', 'outage', 'wire', 'transformer', 'voltage'],
      department: 'electricity_board',
      urgency: 'high',
      estimatedCost: 4000
    }
  };

  const desc = (description || '').toLowerCase();
  let bestMatch = { category: 'general', confidence: 0, department: 'general', urgency: 'low', estimatedCost: 0 };

  // Check user-provided category first
  if (category && keywords[category.toLowerCase()]) {
    bestMatch = {
      category: category.toLowerCase(),
      confidence: 0.9,
      ...keywords[category.toLowerCase()]
    };
  } else {
    // AI-like classification based on keywords
    for (const [cat, data] of Object.entries(keywords)) {
      const matches = data.keywords.filter(keyword => desc.includes(keyword));
      const confidence = matches.length / data.keywords.length;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          category: cat,
          confidence: Math.min(confidence * 2, 1), // Boost confidence
          ...data
        };
      }
    }
  }

  // ensure these keys always exist
  bestMatch.department = bestMatch.department || 'general';
  bestMatch.estimatedCost = bestMatch.estimatedCost ?? 0;
  
  // Add severity based on keywords
  const severityKeywords = {
    critical: ['urgent', 'emergency', 'dangerous', 'accident', 'major', 'severe'],
    high: ['bad', 'terrible', 'awful', 'huge', 'big', 'serious'],
    medium: ['moderate', 'medium', 'average', 'normal'],
    low: ['small', 'minor', 'little', 'tiny']
  };

  let severity = 'medium';
  for (const [level, words] of Object.entries(severityKeywords)) {
    if (words.some(word => desc.includes(word))) {
      severity = level;
      break;
    }
  }

  return {
    ...bestMatch,
    severity,
    aiGenerated: true,
    processedAt: new Date().toISOString()
  };
};

// Community Impact Score Calculator
export const calculateImpactScore = (issue, nearbyIssues = []) => {
  const factors = {
    baseScore: 10,
    severityMultiplier: {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    },
    categoryWeight: {
      pothole: 15,
      water: 20,
      garbage: 10,
      streetlight: 8,
      traffic: 12,
      general: 5
    },
    proximityBoost: nearbyIssues.length * 5, // More issues nearby = higher impact
    timeDecay: Math.max(1, 30 - Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24))) // Newer issues get higher score
  };

  const severityScore = factors.severityMultiplier[issue.severity] || 2;
  const categoryScore = factors.categoryWeight[issue.category] || 5;
  
  const totalScore = factors.baseScore + 
                    (severityScore * 10) + 
                    categoryScore + 
                    factors.proximityBoost + 
                    factors.timeDecay;

  return Math.min(totalScore, 100); // Cap at 100
};
