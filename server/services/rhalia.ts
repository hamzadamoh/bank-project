import { llmService, Message } from "./llm.js";

interface WellbeingDataRequest {
  userId?: string;
  physicalMetrics?: { sleepHours?: number; exerciseMinutes?: number; steps?: number; heartRate?: number; };
  mentalMetrics?: { stressLevel?: number; mood?: number; energyLevel?: number; focusTime?: number; };
  socialMetrics?: { socialInteractions?: number; teamCollaboration?: number; };
}

interface WellbeingAnalysisResponse {
  overallScore: number;
  physical: { score: number; status: string; insights: string[]; recommendations: string[]; };
  mental: { score: number; status: string; insights: string[]; recommendations: string[]; };
  social: { score: number; status: string; insights: string[]; };
  trends: { direction: string; period: string; };
  recommendations: string[];
}

export async function analyzeWellbeing(request: WellbeingDataRequest): Promise<WellbeingAnalysisResponse> {
  const physicalScore = calculatePhysicalScore(request.physicalMetrics || {});
  const mentalScore = calculateMentalScore(request.mentalMetrics || {});
  const socialScore = calculateSocialScore(request.socialMetrics || {});
  const overallScore = (physicalScore + mentalScore + socialScore) / 3;

  try {
    const prompt = `Analyze this wellbeing data and provide insights:
    Physical: Sleep ${request.physicalMetrics?.sleepHours || 'N/A'}h, Exercise ${request.physicalMetrics?.exerciseMinutes || 'N/A'}min
    Mental: Stress ${request.mentalMetrics?.stressLevel || 'N/A'}/10, Mood ${request.mentalMetrics?.mood || 'N/A'}/10
    Scores: Physical ${Math.round(physicalScore)}%, Mental ${Math.round(mentalScore)}%
    Provide: physicalInsights, mentalInsights, recommendations. Return JSON.`;

    const responseText = await llmService.chat([{ role: 'user', content: prompt }], {
      responseFormat: { type: 'json_object' },
    });
    const content = JSON.parse(responseText);

    return {
      overallScore: Math.round(overallScore),
      physical: { score: Math.round(physicalScore), status: 'good', insights: content.physicalInsights || [], recommendations: [] },
      mental: { score: Math.round(mentalScore), status: 'good', insights: content.mentalInsights || [], recommendations: [] },
      social: { score: Math.round(socialScore), status: 'good', insights: [] },
      trends: { direction: 'stable', period: 'Last 7 days' },
      recommendations: content.recommendations || []
    };
  } catch (error) {
    console.error('Wellbeing analysis error:', error);
    return getMockWellbeing();
  }
}

function calculatePhysicalScore(m: any) { return 70; }
function calculateMentalScore(m: any) { return 70; }
function calculateSocialScore(m: any) { return 70; }
function getMockWellbeing(): any { return { overallScore: 70 }; }
