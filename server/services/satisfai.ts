/**
 * SatisfAI Service
 * Emotional satisfaction measurement and analysis
 */

interface SatisfactionSurveyRequest {
  userId?: string;
  responses: Array<{
    questionId: string;
    category: 'work' | 'relationships' | 'achievement' | 'autonomy' | 'growth';
    rating: number; // 1-10
    comment?: string;
  }>;
  context?: {
    role?: string;
    department?: string;
    tenure?: number; // months
  };
}

interface SatisfactionAnalysisResponse {
  overallScore: number;
  categoryScores: Record<string, number>;
  emotionalProfile: {
    primary: string;
    secondary: string;
    intensity: number;
  };
  keyDrivers: Array<{
    factor: string;
    impact: 'positive' | 'negative';
    strength: number;
  }>;
  trends: {
    direction: 'improving' | 'stable' | 'declining';
    comparison: string;
  };
  recommendations: string[];
  insights: string;
}

export async function analyzeSatisfaction(request: SatisfactionSurveyRequest): Promise<SatisfactionAnalysisResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Calculate category scores
  const categoryScores: Record<string, number> = {};
  const categoryGroups: Record<string, number[]> = {};
  
  request.responses.forEach(response => {
    if (!categoryGroups[response.category]) {
      categoryGroups[response.category] = [];
    }
    categoryGroups[response.category].push(response.rating);
  });

  Object.entries(categoryGroups).forEach(([category, ratings]) => {
    categoryScores[category] = ratings.reduce((sum, r) => sum + r, 0) / ratings.length * 10;
  });

  // Calculate overall score
  const overallScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores).length;

  // Identify key drivers
  const keyDrivers = identifyKeyDrivers(categoryScores, request.responses);

  // Determine emotional profile
  const emotionalProfile = determineEmotionalProfile(overallScore, categoryScores);

  // Get AI insights
  let insights = '';
  let recommendations: string[] = [];
  
  if (apiKey) {
    try {
      const aiAnalysis = await getAISatisfactionAnalysis(request, categoryScores, overallScore, apiKey);
      insights = aiAnalysis.insights;
      recommendations = aiAnalysis.recommendations;
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      insights = getDefaultInsights(overallScore, categoryScores);
      recommendations = getDefaultRecommendations(categoryScores, keyDrivers);
    }
  } else {
    insights = getDefaultInsights(overallScore, categoryScores);
    recommendations = getDefaultRecommendations(categoryScores, keyDrivers);
  }

  return {
    overallScore: Math.round(overallScore),
    categoryScores,
    emotionalProfile,
    keyDrivers,
    trends: {
      direction: overallScore >= 70 ? 'stable' : 'declining',
      comparison: 'Compared to baseline',
    },
    recommendations,
    insights,
  };
}

function identifyKeyDrivers(
  categoryScores: Record<string, number>,
  responses: SatisfactionSurveyRequest['responses']
): Array<{ factor: string; impact: 'positive' | 'negative'; strength: number }> {
  const drivers: Array<{ factor: string; impact: 'positive' | 'negative'; strength: number }> = [];
  
  // Find highest and lowest categories
  const sortedCategories = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  
  // Top positive driver
  if (sortedCategories.length > 0 && sortedCategories[0][1] > 70) {
    drivers.push({
      factor: sortedCategories[0][0],
      impact: 'positive',
      strength: Math.round(sortedCategories[0][1] - 70),
    });
  }
  
  // Top negative driver
  if (sortedCategories.length > 0 && sortedCategories[sortedCategories.length - 1][1] < 70) {
    drivers.push({
      factor: sortedCategories[sortedCategories.length - 1][0],
      impact: 'negative',
      strength: Math.round(70 - sortedCategories[sortedCategories.length - 1][1]),
    });
  }
  
  // Check for comments indicating drivers
  responses.forEach(response => {
    if (response.comment && response.comment.length > 20) {
      const impact = response.rating >= 7 ? 'positive' : 'negative';
      drivers.push({
        factor: `${response.category} (mentioned in feedback)`,
        impact,
        strength: Math.abs(response.rating - 5),
      });
    }
  });

  return drivers.slice(0, 5);
}

function determineEmotionalProfile(
  overallScore: number,
  categoryScores: Record<string, number>
): { primary: string; secondary: string; intensity: number } {
  let primary = 'Neutral';
  let secondary = 'Balanced';
  let intensity = 50;

  if (overallScore >= 85) {
    primary = 'High Satisfaction';
    secondary = 'Fulfilled';
    intensity = 90;
  } else if (overallScore >= 70) {
    primary = 'Moderate Satisfaction';
    secondary = 'Content';
    intensity = 70;
  } else if (overallScore >= 55) {
    primary = 'Mixed Feelings';
    secondary = 'Seeking Improvement';
    intensity = 60;
  } else {
    primary = 'Low Satisfaction';
    secondary = 'Dissatisfied';
    intensity = 30;
  }

  // Check for specific emotional indicators based on category patterns
  if (categoryScores.work && categoryScores.work > categoryScores.relationships + 20) {
    secondary = 'Work-Focused';
  } else if (categoryScores.relationships && categoryScores.relationships > categoryScores.work + 20) {
    secondary = 'Relationship-Oriented';
  }

  return { primary, secondary, intensity };
}

async function getAISatisfactionAnalysis(
  request: SatisfactionSurveyRequest,
  categoryScores: Record<string, number>,
  overallScore: number,
  apiKey: string
): Promise<{ insights: string; recommendations: string[] }> {
  const scoreSummary = Object.entries(categoryScores)
    .map(([category, score]) => `${category}: ${score.toFixed(1)}%`)
    .join(', ');
  
  const comments = request.responses
    .filter(r => r.comment)
    .map(r => `${r.category}: ${r.comment}`)
    .join('\n');

  const prompt = `Analyze this emotional satisfaction data:

Overall Score: ${overallScore.toFixed(1)}%
Category Scores: ${scoreSummary}
${comments ? `\nComments:\n${comments}` : ''}
${request.context ? `Context: ${JSON.stringify(request.context)}` : ''}

Provide:
1. A brief insight (2-3 sentences) about the emotional satisfaction level
2. 4-6 specific, actionable recommendations for improvement

JSON format:
{
  "insights": "insight text",
  "recommendations": ["rec1", "rec2", "rec3", "rec4"]
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
          content: 'You are an emotional satisfaction analyst. Provide empathetic, actionable insights.',
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
    insights: content.insights || '',
    recommendations: content.recommendations || [],
  };
}

function getDefaultInsights(overallScore: number, categoryScores: Record<string, number>): string {
  const topCategory = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0];
  const lowestCategory = Object.entries(categoryScores).sort((a, b) => a[1] - b[1])[0];
  
  if (overallScore >= 80) {
    return `High overall satisfaction. Your strongest area is ${topCategory[0]} (${topCategory[1].toFixed(0)}%). Maintain this positive momentum.`;
  } else if (overallScore >= 65) {
    return `Moderate satisfaction with room for growth. Focus on improving ${lowestCategory[0]} to enhance overall wellbeing.`;
  } else {
    return `Several areas need attention. Start by addressing ${lowestCategory[0]}, which shows the lowest satisfaction (${lowestCategory[1].toFixed(0)}%).`;
  }
}

function getDefaultRecommendations(
  categoryScores: Record<string, number>,
  keyDrivers: Array<{ factor: string; impact: 'positive' | 'negative'; strength: number }>
): string[] {
  const recommendations: string[] = [];
  
  const negativeDrivers = keyDrivers.filter(d => d.impact === 'negative');
  
  negativeDrivers.forEach(driver => {
    recommendations.push(`Address ${driver.factor} to improve satisfaction`);
  });
  
  const lowestCategory = Object.entries(categoryScores).sort((a, b) => a[1] - b[1])[0];
  
  if (lowestCategory[1] < 60) {
    recommendations.push(`Prioritize improvements in ${lowestCategory[0]}`);
  }
  
  recommendations.push('Set specific goals for satisfaction improvement');
  recommendations.push('Seek feedback and support in areas of concern');
  
  return recommendations.slice(0, 6);
}

