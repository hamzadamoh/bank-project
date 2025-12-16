/**
 * SkillArcade Service
 * Gamified skills assessment with AI insights
 */

interface SkillAssessmentRequest {
  userId?: string;
  category: string; // 'technical' | 'soft' | 'leadership' | 'analytical'
  responses: Array<{
    questionId: string;
    answer: string | number;
    timeSpent?: number;
  }>;
}

interface SkillAssessmentResponse {
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  insights: string;
  badges: string[];
  nextLevel: {
    current: number;
    target: number;
    progress: number;
  };
}

export async function assessSkills(request: SkillAssessmentRequest): Promise<SkillAssessmentResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Calculate scores based on responses
  const scores = calculateScores(request.responses, request.category);
  
  // Get AI insights if API key is available
  let insights = '';
  let recommendations: string[] = [];
  
  if (apiKey) {
    try {
      const aiInsights = await getAIInsights(scores, request.category, apiKey);
      insights = aiInsights.insights;
      recommendations = aiInsights.recommendations;
    } catch (error) {
      console.error('Error getting AI insights:', error);
      insights = getDefaultInsights(scores, request.category);
      recommendations = getDefaultRecommendations(scores, request.category);
    }
  } else {
    insights = getDefaultInsights(scores, request.category);
    recommendations = getDefaultRecommendations(scores, request.category);
  }

  // Calculate strengths and weaknesses
  const strengths = identifyStrengths(scores);
  const weaknesses = identifyWeaknesses(scores);
  
  // Generate badges
  const badges = generateBadges(scores, request.category);

  // Calculate level progression
  const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
  const currentLevel = Math.floor(overallScore / 10) + 1;
  const targetLevel = currentLevel + 1;
  const progress = (overallScore % 10) / 10 * 100;

  return {
    overallScore: Math.round(overallScore),
    categoryScores: scores,
    strengths,
    weaknesses,
    recommendations,
    insights,
    badges,
    nextLevel: {
      current: currentLevel,
      target: targetLevel,
      progress: Math.round(progress),
    },
  };
}

function calculateScores(responses: SkillAssessmentRequest['responses'], category: string): Record<string, number> {
  // Mock scoring logic - in production, this would use actual assessment criteria
  const baseScore = Math.random() * 30 + 60; // 60-90 range
  
  const categories: Record<string, string[]> = {
    technical: ['Programming', 'System Design', 'Problem Solving', 'Architecture'],
    soft: ['Communication', 'Teamwork', 'Adaptability', 'Creativity'],
    leadership: ['Vision', 'Decision Making', 'Influence', 'Development'],
    analytical: ['Data Analysis', 'Critical Thinking', 'Research', 'Pattern Recognition'],
  };

  const categoryList = categories[category] || categories.technical;
  const scores: Record<string, number> = {};
  
  categoryList.forEach((cat, index) => {
    scores[cat] = Math.round(baseScore + (Math.random() * 20 - 10)); // Add some variation
  });

  return scores;
}

async function getAIInsights(
  scores: Record<string, number>,
  category: string,
  apiKey: string
): Promise<{ insights: string; recommendations: string[] }> {
  const scoreSummary = Object.entries(scores)
    .map(([skill, score]) => `${skill}: ${score}%`)
    .join(', ');

  const prompt = `You are a skills assessment expert. Analyze these skill scores and provide:
1. A brief insight (2-3 sentences) about the candidate's performance
2. 3-5 specific, actionable recommendations for improvement

Category: ${category}
Scores: ${scoreSummary}

Respond in JSON format:
{
  "insights": "brief insight text",
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
          content: 'You are a skills assessment expert. Provide constructive feedback and actionable recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);
  
  return {
    insights: content.insights || '',
    recommendations: content.recommendations || [],
  };
}

function getDefaultInsights(scores: Record<string, number>, category: string): string {
  const avgScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
  const topSkill = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  
  if (avgScore >= 85) {
    return `Excellent performance in ${category} skills. Your strength in ${topSkill} stands out. Continue building on these foundations.`;
  } else if (avgScore >= 70) {
    return `Solid performance with room for growth. Focus on strengthening areas below 75% to achieve mastery.`;
  } else {
    return `Good foundation established. With targeted practice, significant improvement is achievable. Start with the weakest areas.`;
  }
}

function getDefaultRecommendations(scores: Record<string, number>, category: string): string[] {
  const sortedSkills = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const weakest = sortedSkills.slice(0, 3);
  
  return [
    `Focus on improving ${weakest[0][0]} through targeted practice and real-world application`,
    `Practice ${weakest[1] ? weakest[1][0] : 'core skills'} regularly to build consistency`,
    `Seek feedback and mentorship in areas scoring below 75%`,
    `Set specific, measurable goals for skill improvement over the next quarter`,
  ];
}

function identifyStrengths(scores: Record<string, number>): string[] {
  return Object.entries(scores)
    .filter(([_, score]) => score >= 80)
    .map(([skill, _]) => skill)
    .slice(0, 3);
}

function identifyWeaknesses(scores: Record<string, number>): string[] {
  return Object.entries(scores)
    .filter(([_, score]) => score < 70)
    .map(([skill, _]) => skill)
    .slice(0, 3);
}

function generateBadges(scores: Record<string, number>, category: string): string[] {
  const badges: string[] = [];
  const avgScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
  
  if (avgScore >= 90) {
    badges.push('Master', `${category} Expert`, 'Top Performer');
  } else if (avgScore >= 80) {
    badges.push('Advanced', `${category} Specialist`);
  } else if (avgScore >= 70) {
    badges.push('Competent', `${category} Practitioner`);
  } else {
    badges.push('Developing', 'Learner');
  }
  
  return badges;
}

