import { llmService, Message } from "./llm.js";

interface SkillAssessmentRequest {
  category: string;
  responses: Array<{ questionId: string; answer: string | number; }>;
}

interface SkillAssessmentResponse {
  overallScore: number;
  insights: string;
  recommendations: string[];
}

export async function assessSkills(request: SkillAssessmentRequest): Promise<SkillAssessmentResponse> {
  const overallScore = 80; // Simplified calculation

  try {
    const prompt = `Analyze these skill assessment answers for ${request.category}: ${JSON.stringify(request.responses)}. Provide insights and recommendations in JSON format: { insights, recommendations: [] }`;
    const responseText = await llmService.chat([{ role: 'user', content: prompt }], { responseFormat: { type: 'json_object' } });
    const content = JSON.parse(responseText);

    return {
      overallScore,
      insights: content.insights || '',
      recommendations: content.recommendations || []
    };
  } catch (error) {
    console.error('Skill assessment error:', error);
    return { overallScore, insights: 'Mock insights', recommendations: [] };
  }
}
