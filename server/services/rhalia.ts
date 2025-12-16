/**
 * Rhalia Service
 * Holistic well-being analytics platform
 */

interface WellbeingDataRequest {
  userId?: string;
  physicalMetrics?: {
    sleepHours?: number;
    exerciseMinutes?: number;
    steps?: number;
    heartRate?: number;
  };
  mentalMetrics?: {
    stressLevel?: number; // 1-10
    mood?: number; // 1-10
    energyLevel?: number; // 1-10
    focusTime?: number; // minutes
  };
  socialMetrics?: {
    socialInteractions?: number;
    teamCollaboration?: number; // 1-10
  };
}

interface WellbeingAnalysisResponse {
  overallScore: number;
  physical: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'needs_attention';
    insights: string[];
    recommendations: string[];
  };
  mental: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'needs_attention';
    insights: string[];
    recommendations: string[];
  };
  social: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'needs_attention';
    insights: string[];
  };
  trends: {
    direction: 'improving' | 'stable' | 'declining';
    period: string;
  };
  recommendations: string[];
}

export async function analyzeWellbeing(request: WellbeingDataRequest): Promise<WellbeingAnalysisResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Calculate scores
  const physicalScore = calculatePhysicalScore(request.physicalMetrics || {});
  const mentalScore = calculateMentalScore(request.mentalMetrics || {});
  const socialScore = calculateSocialScore(request.socialMetrics || {});
  
  const overallScore = (physicalScore + mentalScore + socialScore) / 3;

  // Get AI insights
  let physicalInsights: string[] = [];
  let mentalInsights: string[] = [];
  let recommendations: string[] = [];
  
  if (apiKey) {
    try {
      const aiAnalysis = await getAIAnalysis(request, physicalScore, mentalScore, socialScore, apiKey);
      physicalInsights = aiAnalysis.physicalInsights;
      mentalInsights = aiAnalysis.mentalInsights;
      recommendations = aiAnalysis.recommendations;
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      physicalInsights = getDefaultPhysicalInsights(physicalScore, request.physicalMetrics || {});
      mentalInsights = getDefaultMentalInsights(mentalScore, request.mentalMetrics || {});
      recommendations = getDefaultRecommendations(physicalScore, mentalScore, socialScore);
    }
  } else {
    physicalInsights = getDefaultPhysicalInsights(physicalScore, request.physicalMetrics || {});
    mentalInsights = getDefaultMentalInsights(mentalScore, request.mentalMetrics || {});
    recommendations = getDefaultRecommendations(physicalScore, mentalScore, socialScore);
  }

  return {
    overallScore: Math.round(overallScore),
    physical: {
      score: Math.round(physicalScore),
      status: getStatus(physicalScore),
      insights: physicalInsights,
      recommendations: getPhysicalRecommendations(physicalScore, request.physicalMetrics || {}),
    },
    mental: {
      score: Math.round(mentalScore),
      status: getStatus(mentalScore),
      insights: mentalInsights,
      recommendations: getMentalRecommendations(mentalScore, request.mentalMetrics || {}),
    },
    social: {
      score: Math.round(socialScore),
      status: getStatus(socialScore),
      insights: getDefaultSocialInsights(socialScore),
    },
    trends: {
      direction: 'stable', // Would compare with historical data in production
      period: 'Last 7 days',
    },
    recommendations,
  };
}

function calculatePhysicalScore(metrics: NonNullable<WellbeingDataRequest['physicalMetrics']>): number {
  let score = 70; // Base score
  
  // Sleep (optimal: 7-9 hours)
  if (metrics.sleepHours) {
    if (metrics.sleepHours >= 7 && metrics.sleepHours <= 9) {
      score += 10;
    } else if (metrics.sleepHours >= 6 && metrics.sleepHours <= 10) {
      score += 5;
    } else {
      score -= 10;
    }
  }
  
  // Exercise (optimal: 150+ minutes/week = ~21 min/day)
  if (metrics.exerciseMinutes) {
    if (metrics.exerciseMinutes >= 20) {
      score += 10;
    } else if (metrics.exerciseMinutes >= 10) {
      score += 5;
    }
  }
  
  // Steps (optimal: 8000-10000)
  if (metrics.steps) {
    if (metrics.steps >= 8000) {
      score += 10;
    } else if (metrics.steps >= 5000) {
      score += 5;
    }
  }
  
  return Math.min(100, Math.max(0, score));
}

function calculateMentalScore(metrics: NonNullable<WellbeingDataRequest['mentalMetrics']>): number {
  let score = 70;
  
  if (metrics.stressLevel !== undefined) {
    score += (10 - metrics.stressLevel) * 2; // Lower stress = higher score
  }
  
  if (metrics.mood !== undefined) {
    score += (metrics.mood - 5) * 2; // Higher mood = higher score
  }
  
  if (metrics.energyLevel !== undefined) {
    score += (metrics.energyLevel - 5) * 2;
  }
  
  return Math.min(100, Math.max(0, score));
}

function calculateSocialScore(metrics: NonNullable<WellbeingDataRequest['socialMetrics']>): number {
  let score = 70;
  
  if (metrics.teamCollaboration !== undefined) {
    score += (metrics.teamCollaboration - 5) * 3;
  }
  
  return Math.min(100, Math.max(0, score));
}

async function getAIAnalysis(
  request: WellbeingDataRequest,
  physicalScore: number,
  mentalScore: number,
  socialScore: number,
  apiKey: string
): Promise<{
  physicalInsights: string[];
  mentalInsights: string[];
  recommendations: string[];
}> {
  const prompt = `Analyze this wellbeing data and provide insights:

Physical: Sleep ${request.physicalMetrics?.sleepHours || 'N/A'}h, Exercise ${request.physicalMetrics?.exerciseMinutes || 'N/A'}min, Steps ${request.physicalMetrics?.steps || 'N/A'}
Mental: Stress ${request.mentalMetrics?.stressLevel || 'N/A'}/10, Mood ${request.mentalMetrics?.mood || 'N/A'}/10, Energy ${request.mentalMetrics?.energyLevel || 'N/A'}/10
Scores: Physical ${Math.round(physicalScore)}%, Mental ${Math.round(mentalScore)}%, Social ${Math.round(socialScore)}%

Provide:
1. 2-3 physical insights
2. 2-3 mental insights  
3. 3-5 holistic recommendations

JSON format:
{
  "physicalInsights": ["insight1", "insight2"],
  "mentalInsights": ["insight1", "insight2"],
  "recommendations": ["rec1", "rec2", "rec3"]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
        model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a wellbeing analyst. Provide actionable, empathetic insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenAI API error (${response.status}):`, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Invalid OpenAI response format:', JSON.stringify(data));
    throw new Error('Invalid response format from OpenAI API');
  }

  let content;
  try {
    const messageContent = data.choices[0].message.content;
    content = typeof messageContent === 'string' ? JSON.parse(messageContent) : messageContent;
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    throw new Error('Failed to parse OpenAI response as JSON');
  }
  
  return {
    physicalInsights: content.physicalInsights || [],
    mentalInsights: content.mentalInsights || [],
    recommendations: content.recommendations || [],
  };
}

function getStatus(score: number): 'excellent' | 'good' | 'fair' | 'needs_attention' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'fair';
  return 'needs_attention';
}

function getDefaultPhysicalInsights(score: number, metrics: NonNullable<WellbeingDataRequest['physicalMetrics']>): string[] {
  const insights: string[] = [];
  
  if (metrics.sleepHours && metrics.sleepHours < 7) {
    insights.push('Sleep duration is below recommended 7-9 hours');
  }
  
  if (metrics.exerciseMinutes && metrics.exerciseMinutes < 20) {
    insights.push('Exercise time could be increased for better physical health');
  }
  
  if (score >= 85) {
    insights.push('Excellent physical wellbeing indicators');
  }
  
  return insights;
}

function getDefaultMentalInsights(score: number, metrics: NonNullable<WellbeingDataRequest['mentalMetrics']>): string[] {
  const insights: string[] = [];
  
  if (metrics.stressLevel && metrics.stressLevel > 7) {
    insights.push('Stress levels are elevated - consider stress management techniques');
  }
  
  if (metrics.mood && metrics.mood < 5) {
    insights.push('Mood could be improved with positive activities');
  }
  
  if (score >= 80) {
    insights.push('Strong mental wellbeing metrics');
  }
  
  return insights;
}

function getDefaultSocialInsights(score: number): string[] {
  if (score >= 80) {
    return ['Strong social engagement and collaboration'];
  } else if (score >= 70) {
    return ['Good social connections, room for more collaboration'];
  } else {
    return ['Consider increasing team interactions and social engagement'];
  }
}

function getPhysicalRecommendations(score: number, metrics: NonNullable<WellbeingDataRequest['physicalMetrics']>): string[] {
  const recs: string[] = [];
  
  if (!metrics.sleepHours || metrics.sleepHours < 7) {
    recs.push('Aim for 7-9 hours of sleep nightly');
  }
  
  if (!metrics.exerciseMinutes || metrics.exerciseMinutes < 20) {
    recs.push('Add 20-30 minutes of daily exercise');
  }
  
  if (!metrics.steps || metrics.steps < 8000) {
    recs.push('Increase daily steps to 8,000-10,000');
  }
  
  return recs;
}

function getMentalRecommendations(score: number, metrics: NonNullable<WellbeingDataRequest['mentalMetrics']>): string[] {
  const recs: string[] = [];
  
  if (metrics.stressLevel && metrics.stressLevel > 6) {
    recs.push('Practice mindfulness or meditation to reduce stress');
  }
  
  if (metrics.energyLevel && metrics.energyLevel < 6) {
    recs.push('Ensure adequate rest and consider energy-boosting activities');
  }
  
  recs.push('Schedule regular breaks during work hours');
  recs.push('Maintain work-life balance');
  
  return recs;
}

function getDefaultRecommendations(physical: number, mental: number, social: number): string[] {
  const recs: string[] = [];
  
  if (physical < 70) {
    recs.push('Focus on improving physical health through exercise and sleep');
  }
  
  if (mental < 70) {
    recs.push('Prioritize mental wellbeing with stress management');
  }
  
  if (social < 70) {
    recs.push('Increase social interactions and team collaboration');
  }
  
  return recs;
}

