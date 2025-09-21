// CivicReporter/utils/duplicateDetection.js
export const detectDuplicates = (newIssue, existingIssues) => {
  const duplicates = [];
  const PROXIMITY_THRESHOLD = 0.1; // 100 meters
  const SIMILARITY_THRESHOLD = 0.6; // 60% similarity

  existingIssues.forEach(existing => {
    if (existing.id === newIssue.id) return;

    const distance = calculateDistance(newIssue.location, existing.location);
    const textSimilarity = calculateTextSimilarity(newIssue.description, existing.description);
    const categorySimilarity = newIssue.category === existing.category ? 1 : 0;
    const timeDifference = Math.abs(new Date(newIssue.createdAt) - new Date(existing.createdAt)) / (1000 * 60 * 60 * 24); // days

    // Calculate composite similarity score
    const similarityScore = (
      (distance < PROXIMITY_THRESHOLD ? 0.4 : 0) +
      (textSimilarity * 0.3) +
      (categorySimilarity * 0.2) +
      (timeDifference < 7 ? 0.1 : 0) // Bonus if within a week
    );

    if (similarityScore > SIMILARITY_THRESHOLD) {
      duplicates.push({
        issue: existing,
        similarity: similarityScore,
        reasons: {
          proximity: distance < PROXIMITY_THRESHOLD,
          textSimilar: textSimilarity > 0.5,
          sameCategory: categorySimilarity === 1,
          recentlyReported: timeDifference < 7
        }
      });
    }
  });

  return duplicates.sort((a, b) => b.similarity - a.similarity);
};

function calculateDistance(pos1, pos2) {
  if (!pos1 || !pos2) return Infinity;
  const R = 6371000; // Earth's radius in meters
  const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
  const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return distance / 1000; // Convert to km
}

function calculateTextSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const allWords = new Set([...words1, ...words2]);
  const intersection = words1.filter(word => words2.includes(word));
  
  return intersection.length / allWords.size;
}

// Priority scoring system
export const calculatePriority = (issue, duplicates = []) => {
  const weights = {
    severity: {
      critical: 40,
      high: 30,
      medium: 20,
      low: 10
    },
    category: {
      water: 35,
      pothole: 25,
      traffic: 20,
      streetlight: 15,
      garbage: 15,
      general: 10
    },
    duplicateBoost: duplicates.length * 5,
    impactScore: (issue.impactScore || 50) * 0.3,
    timeUrgency: Math.max(0, 30 - Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
  };

  const severityScore = weights.severity[issue.severity] || 20;
  const categoryScore = weights.category[issue.category] || 10;
  
  const totalPriority = severityScore + 
                       categoryScore + 
                       weights.duplicateBoost + 
                       weights.impactScore + 
                       weights.timeUrgency;

  return Math.min(totalPriority, 100);
};
