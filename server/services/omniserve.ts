/**
 * OmniServe Service
 * Multilingual AI chatbot supporting French, Arabic, and Darija
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  language?: string;
}

interface ChatRequest {
  message: string;
  conversationId?: string;
  language?: 'fr' | 'ar' | 'darija' | 'auto';
  context?: string;
}

interface ChatResponse {
  response: string;
  detectedLanguage?: string;
  confidence?: number;
  conversationId: string;
}

const conversations = new Map<string, ChatMessage[]>();

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  // Detect language if auto
  const language = request.language === 'auto' ? detectLanguage(request.message) : request.language || 'fr';
  
  // Get or create conversation
  const conversationId = request.conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const conversation = conversations.get(conversationId) || [];
  
  // Add user message
  conversation.push({
    role: 'user',
    content: request.message,
    language,
  });

  let response: string;
  
  if (apiKey) {
    try {
      response = await getAIResponse(request.message, conversation, language, apiKey);
    } catch (error) {
      console.error('Error getting AI response:', error);
      response = getDefaultResponse(request.message, language);
    }
  } else {
    response = getDefaultResponse(request.message, language);
  }

  // Add assistant response
  conversation.push({
    role: 'assistant',
    content: response,
    language,
  });

  // Store conversation (in production, use database)
  conversations.set(conversationId, conversation);
  
  // Keep only last 20 messages
  if (conversation.length > 20) {
    conversations.set(conversationId, conversation.slice(-20));
  }

  return {
    response,
    detectedLanguage: language,
    confidence: 0.95,
    conversationId,
  };
}

function detectLanguage(text: string): 'fr' | 'ar' | 'darija' {
  // Simple language detection
  const arabicPattern = /[\u0600-\u06FF]/;
  const frenchPattern = /[àâäéèêëïîôùûüÿç]/i;
  
  if (arabicPattern.test(text)) {
    // Could be Arabic or Darija - simple heuristic
    if (text.includes('د') || text.includes('ة')) {
      return 'ar';
    }
    return 'darija';
  }
  
  if (frenchPattern.test(text) || /^(bonjour|salut|merci|oui|non)/i.test(text)) {
    return 'fr';
  }
  
  return 'fr'; // default
}

async function getAIResponse(
  message: string,
  conversation: ChatMessage[],
  language: string,
  apiKey: string
): Promise<string> {
  const systemPrompts: Record<string, string> = {
    fr: 'Tu es un assistant IA professionnel pour services financiers. Réponds en français de manière claire et concise.',
    ar: 'أنت مساعد ذكي محترف للخدمات المالية. أجب بالعربية بشكل واضح ومختصر.',
    darija: 'نتي مساعد ذكي محترف ديال الخدمات المالية. رد بالدارجة المغربية بشكل واضح ومختصر.',
  };

  const systemPrompt = systemPrompts[language] || systemPrompts.fr;

  const messages = [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
    ...conversation.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
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

  const content = data.choices[0].message.content;
  if (!content || typeof content !== 'string') {
    console.error('Empty or invalid content in OpenAI response:', JSON.stringify(data));
    throw new Error('Empty or invalid content in OpenAI response');
  }

  return content.trim();
}

function getDefaultResponse(message: string, language: string): string {
  const responses: Record<string, string> = {
    fr: "Bonjour ! Je suis OmniServe, votre assistant IA multilingue. Comment puis-je vous aider aujourd'hui avec vos questions financières ?",
    ar: "مرحباً! أنا OmniServe، مساعدك الذكي متعدد اللغات. كيف يمكنني مساعدتك اليوم في أسئلتك المالية؟",
    darija: "أهلاً! أنا OmniServe، مساعدك الذكي ديال الخدمات المالية. كيفاش يمكنني نخدمك اليوم؟",
  };

  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('salut') || lowerMessage.includes('bonjour') || lowerMessage.includes('hello')) {
    return responses[language] || responses.fr;
  }
  
  if (lowerMessage.includes('tax') || lowerMessage.includes('impôt')) {
    return language === 'fr' 
      ? "Pour les questions fiscales, je recommande d'utiliser notre outil FiscAI Tax Counsel pour des conseils détaillés avec citations légales."
      : "بالنسبة للأسئلة الضريبية، أنصحك باستخدام أداة FiscAI Tax Counsel للحصول على نصائح مفصلة مع المراجع القانونية.";
  }
  
  return responses[language] || responses.fr;
}

