import { llmService, Message } from "./llm.js";

interface TaxQueryRequest {
  query: string;
  jurisdiction: string;
}

interface TaxResponse {
  shortAnswer: string;
  explanation: string;
  details: Array<{ title: string; content: string }>;
  checklist: string[];
  citations: Array<{ code: string; description: string }>;
  confidence: number;
}

export async function getTaxAdvice(request: TaxQueryRequest): Promise<TaxResponse> {
  const jurisdictionContext = getJurisdictionContext(request.jurisdiction);

  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert tax advisor. Always provide accurate, well-researched tax advice with proper citations. Respond only with valid JSON.',
    },
    {
      role: 'user',
      content: `Provide a comprehensive tax analysis for ${request.jurisdiction} regarding: "${request.query}". 
      ${jurisdictionContext}
      
      Format as JSON: { "shortAnswer": string, "explanation": string, "details": [{title, content}], "checklist": [string], "citations": [{code, description}], "confidence": number }`,
    },
  ];

  try {
    const responseText = await llmService.chat(messages, {
      temperature: 0.3,
      responseFormat: { type: 'json_object' },
    });

    const content = JSON.parse(responseText);

    return {
      shortAnswer: content.shortAnswer || '',
      explanation: content.explanation || '',
      details: content.details || [],
      checklist: content.checklist || [],
      citations: content.citations || [],
      confidence: content.confidence || 85,
    };
  } catch (error) {
    console.error('Tax advice service error:', error);
    return getMockTaxAdvice(request);
  }
}

function getJurisdictionContext(jurisdiction: string): string {
  const contexts: Record<string, string> = {
    morocco: "Focus on Code Général des Impôts (CGI) and Moroccan VAT.",
    eu: "Focus on EU VAT Directives and regional regulations.",
    oecd: "Focus on OECD Model Tax Convention and BEPS principles."
  };
  return contexts[jurisdiction.toLowerCase()] || contexts.oecd;
}

function getMockTaxAdvice(request: TaxQueryRequest): TaxResponse {
  return {
    shortAnswer: `Mock response for ${request.jurisdiction}`,
    explanation: 'Configure AI provider for real advice.',
    details: [],
    checklist: [],
    citations: [],
    confidence: 50,
  };
}
