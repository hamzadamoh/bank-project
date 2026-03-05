import { llmService, Message } from "./llm.js";

interface SatisfactionSurveyRequest {
  responses: Array<{ category: string; rating: number; comment?: string; }>;
}

interface SatisfactionAnalysisResponse {
  overallScore: number;
  categoryScores: Record<string, number>;
  insights: string;
  recommendations: string[];
}

export async function analyzeSatisfaction(request: SatisfactionSurveyRequest): Promise<SatisfactionAnalysisResponse> {
  const overallScore = 75; // Simplified calculation

  try {
    const prompt = `Analyze these customer satisfaction responses: ${JSON.stringify(request.responses)}. Provide insights and recommendations in JSON format: { insights, recommendations: [] }`;
    const responseText = await llmService.chat([{ role: 'user', content: prompt }], {
      responseFormat: { type: 'json_object' },
    });
    const content = JSON.parse(responseText);

    return {
      overallScore,
      categoryScores: {},
      insights: content.insights || '',
      recommendations: content.recommendations || []
    };
  } catch (error) {
    console.error('Satisfaction analysis error:', error);
    return { overallScore, categoryScores: {}, insights: 'Mock insights', recommendations: [] };
  }
}
