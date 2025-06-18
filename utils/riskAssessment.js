// Risk Assessment Scoring System
// This utility calculates a comprehensive risk score based on user responses across three categories:
// 1. Risk Preference (direct risk tolerance)
// 2. Background (financial capacity)
// 3. Behavioral (psychological risk tolerance)

export const RISK_CATEGORIES = {
  ULTRA_LOW: { 
    name: 'Ultra Conservative', 
    range: [0, 20], 
    description: 'Minimal risk tolerance with capital preservation focus',
    allocation: { stocks: '10-20%', bonds: '70-80%', cash: '10-20%' }
  },
  LOW: { 
    name: 'Conservative', 
    range: [21, 40], 
    description: 'Low risk tolerance with income generation focus',
    allocation: { stocks: '20-35%', bonds: '55-70%', cash: '5-15%' }
  },
  MEDIUM: { 
    name: 'Moderate', 
    range: [41, 60], 
    description: 'Balanced approach to risk and return',
    allocation: { stocks: '40-60%', bonds: '35-50%', cash: '5-10%' }
  },
  HIGH: { 
    name: 'Growth', 
    range: [61, 80], 
    description: 'Higher risk tolerance for potential growth',
    allocation: { stocks: '65-80%', bonds: '15-30%', cash: '0-10%' }
  },
  VERY_HIGH: { 
    name: 'Aggressive', 
    range: [81, 100], 
    description: 'Maximum risk tolerance for maximum growth potential',
    allocation: { stocks: '80-95%', bonds: '0-15%', cash: '0-10%' }
  }
};

// Risk Preference Scoring (Direct risk tolerance - Weight: 40%)
export const RISK_PREFERENCE_SCORES = {
  'protective': 5,      // Ultra conservative
  'conservative': 20,   // Conservative
  'balanced': 50,       // Moderate/Balanced
  'growth': 75,         // Growth-oriented
  'aggressive': 95      // Aggressive
};

// Background Scoring (Financial capacity - Weight: 35%)
export const BACKGROUND_SCORES = {
  timeHorizon: {
    'less-than-1-year': 5,      // Very short term = lower risk capacity
    '1-to-3-years': 15,         // Short term = lower risk capacity
    '3-to-5-years': 35,         // Medium term = moderate risk capacity
    '5-to-10-years': 65,        // Long term = higher risk capacity
    'more-than-10-years': 85    // Very long term = highest risk capacity
  },
  incomeLevel: {
    'less-than-40000': 10,      // Lower income = lower risk capacity
    '40000-to-80000': 25,       // Lower-middle income
    '80000-to-1200000': 50,     // Middle income
    '1200000-to-200000': 75,    // Upper-middle income
    'more-than-200000': 90      // High income = higher risk capacity
  },
  monthlyExpense: {
    'less-than-15': 85,         // Very low expenses = high risk capacity
    'between-15-to-25': 65,     // Low expenses = good risk capacity
    'between-25-to-35': 50,     // Moderate expenses = moderate risk capacity
    'between-35-to-45': 25,     // High expenses = lower risk capacity
    'more-than-45': 10          // Very high expenses = low risk capacity
  },
  investmentPercentage: {
    'less-than-15': 20,         // Small investment = lower risk capacity
    'between-15-to-25': 35,     // Small-moderate investment
    'between-25-to-35': 55,     // Moderate investment
    'between-35-to-45': 75,     // Large investment = higher risk capacity
    'more-than-45': 90          // Very large investment = highest risk capacity
  }
};

// Behavioral Scoring (Psychological risk tolerance - Weight: 25%)
export const BEHAVIORAL_SCORES = {
  selectedOption: { // Market crash reaction
    'sell': 15,        // Panic selling = low risk tolerance
    'nothing': 50,     // Hold steady = moderate risk tolerance
    'invest': 85       // Buy the dip = high risk tolerance
  },
  selectedOption2: { // Portfolio preference
    'portfolio1': 25,  // 5% return, 5% loss = conservative
    'portfolio2': 75   // 10% return, 20% loss = aggressive
  },
  selectedOption3: { // Portfolio growth reaction
    'take-profit': 30,    // Take profit = conservative approach
    'reinvest': 60,       // Reinvest = moderate approach
    'increase': 80        // Increase contributions = aggressive approach
  }
};

// Calculate overall risk score
export function calculateRiskScore(formData) {
  // Risk Preference Score (40% weight)
  const riskPrefScore = RISK_PREFERENCE_SCORES[formData.riskPreference.risk] || 50;
  
  // Background Score (35% weight) - Average of all background factors
  const backgroundScores = [
    BACKGROUND_SCORES.timeHorizon[formData.background.timeHorizon] || 50,
    BACKGROUND_SCORES.incomeLevel[formData.background.incomeLevel] || 50,
    BACKGROUND_SCORES.monthlyExpense[formData.background.monthlyExpense] || 50,
    BACKGROUND_SCORES.investmentPercentage[formData.background.investmentPercentage] || 50
  ];
  const backgroundScore = backgroundScores.reduce((sum, score) => sum + score, 0) / backgroundScores.length;
  
  // Behavioral Score (25% weight) - Average of all behavioral factors
  const behavioralScores = [
    BEHAVIORAL_SCORES.selectedOption[formData.behavioural.selectedOption] || 50,
    BEHAVIORAL_SCORES.selectedOption2[formData.behavioural.selectedOption2] || 50,
    BEHAVIORAL_SCORES.selectedOption3[formData.behavioural.selectedOption3] || 50
  ];
  const behavioralScore = behavioralScores.reduce((sum, score) => sum + score, 0) / behavioralScores.length;
  
  // Calculate weighted final score
  const finalScore = Math.round(
    (riskPrefScore * 0.40) + 
    (backgroundScore * 0.35) + 
    (behavioralScore * 0.25)
  );
  
  return {
    finalScore,
    breakdown: {
      riskPreference: riskPrefScore,
      background: Math.round(backgroundScore),
      behavioral: Math.round(behavioralScore)
    }
  };
}

// Determine risk category based on score
export function getRiskCategory(score) {
  for (const [key, category] of Object.entries(RISK_CATEGORIES)) {
    if (score >= category.range[0] && score <= category.range[1]) {
      return {
        key,
        ...category,
        score
      };
    }
  }
}

// Get complete risk assessment
export function getCompleteRiskAssessment(formData) {
  const scoreResult = calculateRiskScore(formData);
  const riskCategory = getRiskCategory(scoreResult.finalScore);
  
  return {
    ...scoreResult,
    category: riskCategory,
    recommendations: generateRecommendations(riskCategory)
  };
}

// Generate investment recommendations based on risk category
function generateRecommendations(riskCategory) {
  const baseRecommendations = {
    ULTRA_LOW: [
      'Focus on capital preservation with high-grade bonds and CDs',
      'Consider treasury securities and money market funds',
      'Limit stock exposure to dividend-paying blue-chip stocks',
      'Maintain higher cash reserves for emergencies'
    ],
    LOW: [
      'Balanced portfolio with emphasis on income generation',
      'High-quality corporate and government bonds',
      'Dividend-focused equity funds',
      'Conservative mutual funds and ETFs'
    ],
    MEDIUM: [
      'Diversified portfolio across asset classes',
      'Mix of growth and value stocks',
      'Balanced mutual funds and ETFs',
      'Some exposure to international markets'
    ],
    HIGH: [
      'Growth-focused equity portfolio',
      'Higher allocation to small and mid-cap stocks',
      'International and emerging market exposure',
      'Growth-oriented mutual funds and ETFs'
    ],
    VERY_HIGH: [
      'Aggressive growth portfolio with high equity allocation',
      'Small-cap and emerging market investments',
      'Sector-specific and thematic ETFs',
      'Consider alternative investments (REITs, commodities)'
    ]
  };
  
  return baseRecommendations[riskCategory.key] || baseRecommendations.MEDIUM;
} 