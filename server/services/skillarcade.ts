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
  const categories: Record<string, string[]> = {
    technical: ['Programming', 'System Design', 'Problem Solving', 'Architecture'],
    soft: ['Communication', 'Teamwork', 'Adaptability', 'Creativity'],
    leadership: ['Vision', 'Decision Making', 'Influence', 'Development'],
    analytical: ['Data Analysis', 'Critical Thinking', 'Research', 'Pattern Recognition'],
  };

  const categoryList = categories[category] || categories.technical;
  const scores: Record<string, number> = {};
  
  // Initialize scores for each skill
  categoryList.forEach((skill) => {
    scores[skill] = 0;
  });

  // Map questions to skills based on question index
  // Questions are distributed across skills (2 questions per skill for 8 questions)
  const answersBySkill: Record<string, number[]> = {};
  
  responses.forEach((response, index) => {
    // Distribute questions evenly across skills
    // For 8 questions and 4 skills: each skill gets 2 questions
    const questionsPerSkill = Math.ceil(responses.length / categoryList.length);
    const skillIndex = Math.floor(index / questionsPerSkill);
    const skill = categoryList[skillIndex] || categoryList[0];
    
    if (!answersBySkill[skill]) {
      answersBySkill[skill] = [];
    }
    
    // Convert answer (0-3) to score contribution
    // Answer 0 = 0 points (0%), Answer 1 = 8 points (33%), Answer 2 = 17 points (67%), Answer 3 = 25 points (100%)
    const answerValue = typeof response.answer === 'number' ? response.answer : 0;
    // Normalize to 0-100 scale: (answer / 3) * 100
    const normalizedScore = Math.round((answerValue / 3) * 100);
    answersBySkill[skill].push(normalizedScore);
  });

  // Calculate average score for each skill
  Object.entries(answersBySkill).forEach(([skill, skillScores]) => {
    if (skillScores.length > 0) {
      const averageScore = skillScores.reduce((sum, s) => sum + s, 0) / skillScores.length;
      scores[skill] = Math.round(averageScore);
    } else {
      // Default score if no answers for this skill
      scores[skill] = 50;
    }
  });

  // Ensure all skills have a score (fill missing ones with average of answered skills)
  const existingScores = Object.values(scores).filter(s => s > 0);
  const averageScore = existingScores.length > 0 
    ? existingScores.reduce((sum, s) => sum + s, 0) / existingScores.length 
    : 60;
  
  categoryList.forEach((skill) => {
    if (!scores[skill] || scores[skill] === 0) {
      scores[skill] = Math.round(averageScore);
    }
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
    if (!messageContent || typeof messageContent !== 'string') {
      console.error('Empty or invalid content in OpenAI response:', JSON.stringify(data));
      throw new Error('Empty or invalid content in OpenAI response');
    }
    content = JSON.parse(messageContent);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    throw new Error('Failed to parse OpenAI response as JSON');
  }
  
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

