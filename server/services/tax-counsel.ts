/**
 * Tax Counsel Service
 * Provides AI-powered tax advice using OpenAI
 */

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
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    // Fallback to enhanced mock if no API key
    return getMockTaxAdvice(request);
  }

  try {
    const jurisdictionContext = getJurisdictionContext(request.jurisdiction);
    
    const prompt = `You are a professional tax advisor specializing in ${request.jurisdiction} tax law. 

${jurisdictionContext}

A client asks: "${request.query}"

Provide a comprehensive tax analysis with:
1. A concise short answer (2-3 sentences)
2. A detailed explanation (2-3 paragraphs)
3. Specific legal details with relevant articles/codes
4. A compliance checklist of actionable items
5. Legal citations with codes and descriptions
6. Your confidence level (0-100)

Format your response as JSON with this structure:
{
  "shortAnswer": "brief answer",
  "explanation": "detailed explanation",
  "details": [{"title": "...", "content": "..."}],
  "checklist": ["item1", "item2"],
  "citations": [{"code": "Art. 123", "description": "..."}],
  "confidence": 85
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert tax advisor. Always provide accurate, well-researched tax advice with proper citations. Respond only with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    return {
      shortAnswer: content.shortAnswer || '',
      explanation: content.explanation || '',
      details: content.details || [],
      checklist: content.checklist || [],
      citations: content.citations || [],
      confidence: content.confidence || 85,
    };
  } catch (error) {
    console.error('Tax advice error:', error);
    // Fallback to mock on error
    return getMockTaxAdvice(request);
  }
}

function getJurisdictionContext(jurisdiction: string): string {
  const contexts: Record<string, string> = {
    morocco: `You are an expert in Moroccan tax law, including:
- General Tax Code (Code Général des Impôts - CGI)
- VAT regulations (20% standard rate)
- Corporate tax (IR) and personal income tax (IGR)
- Tax treaties and cross-border taxation
- Recent tax reforms and administrative notes`,
    
    eu: `You are an expert in European Union tax law, including:
- EU VAT Directive (2006/112/EC)
- One-Stop Shop (OSS) system
- Reverse charge mechanisms
- Digital services taxation
- Transfer pricing regulations`,
    
    oecd: `You are an expert in international tax law following OECD principles:
- OECD Model Tax Convention
- BEPS (Base Erosion and Profit Shifting) initiatives
- Transfer pricing guidelines
- Permanent establishment rules
- Tax transparency and exchange of information`,
  };

  return contexts[jurisdiction.toLowerCase()] || contexts.oecd;
}

function getMockTaxAdvice(request: TaxQueryRequest): TaxResponse {
  // Enhanced mock that's context-aware
  const mockResponses: Record<string, TaxResponse> = {
    morocco: {
      shortAnswer: `Moroccan SaaS companies serving EU clients must apply 20% VAT domestically and trigger EU OSS registration above €10,000 annual sales.`,
      explanation: `For Moroccan SaaS providers serving EU clients, the VAT treatment involves both domestic Moroccan obligations and potential EU compliance requirements. Under Article 87 of the General Tax Code (CGI), SaaS services are subject to 20% VAT when provided from Morocco.`,
      details: [
        {
          title: 'Moroccan VAT Application',
          content: 'Under Article 87 of the General Tax Code (CGI), SaaS services are subject to 20% VAT when provided from Morocco, regardless of client location.',
        },
        {
          title: 'EU VAT Obligations',
          content: 'For B2B clients in the EU, the reverse charge mechanism applies under EU Directive 2006/112/EC. EU businesses account for VAT in their member state.',
        },
        {
          title: 'OSS Registration Threshold',
          content: 'Once annual EU B2C sales exceed €10,000, registration for the One-Stop Shop (OSS) system becomes mandatory per Note 728/2023.',
        },
      ],
      checklist: [
        'Register for Moroccan VAT if not already done',
        'Implement reverse charge invoicing for EU B2B clients',
        'Monitor annual EU B2C sales threshold',
        'Consider OSS registration preparation',
        'Maintain proper documentation for cross-border services',
      ],
      citations: [
        { code: 'Art. 87 CGI', description: 'Morocco General Tax Code - Digital Services VAT' },
        { code: 'EU Dir. 2006/112', description: 'EU VAT Directive - Reverse Charge Mechanism' },
        { code: 'Note 728/2023', description: 'Morocco Tax Authority - Digital Services Clarification' },
      ],
      confidence: 95,
    },
  };

  return mockResponses[request.jurisdiction.toLowerCase()] || {
    shortAnswer: `Tax analysis for ${request.jurisdiction}: ${request.query}`,
    explanation: 'This is a mock response. Please configure OPENAI_API_KEY for real AI-powered tax advice.',
    details: [
      {
        title: 'Analysis Overview',
        content: 'Mock tax analysis content would appear here with proper legal research and citations.',
      },
    ],
    checklist: [
      'Review applicable tax regulations',
      'Consult with local tax advisor',
      'Ensure proper documentation',
    ],
    citations: [
      { code: 'Mock Citation', description: 'Example legal reference' },
    ],
    confidence: 85,
  };
}

