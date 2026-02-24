import { llmService, Message } from "./llm.js";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  language?: string;
}

interface ChatRequest {
  message: string;
  conversationId?: string;
  language?: 'fr' | 'ar' | 'darija' | 'en' | 'auto';
  context?: string;
}

interface ChatResponse {
  response: string;
  detectedLanguage?: string;
  confidence?: number;
  conversationId: string;
}

const conversations = new Map<string, ChatMessage[]>();

export async function chat(request: ChatRequest, options: { provider?: 'cloud' | 'local' } = {}): Promise<ChatResponse> {
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

  try {
    const systemPrompts: Record<string, string> = {
      en: `You are OmniServe, the multilingual AI assistant for FiscAI. Respond in English. Be concise and helpful.`,
      fr: `Tu es OmniServe, l'assistant IA multilingue de FiscAI. Réponds en français. Sois concis et utile.`,
      ar: `أنت OmniServe، المساعد الذكي متعدد اللغات لـ FiscAI. أجب باللغة العربية. كن موجزاً ومفيداً.`,
      darija: `نتي OmniServe، المساعد الذكي ديال FiscAI. جاوبي بالدارجة المغربية. كوني مختصرة ومفيدة.`,
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.en;

    const messages: Message[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...conversation.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    response = await llmService.chat(messages, {
      temperature: 0.7,
      maxTokens: 500,
      provider: options.provider
    });
  } catch (error) {
    console.error('Error in chat service:', error);
    response = getDefaultResponse(request.message, language);
  }

  // Add assistant response
  conversation.push({
    role: 'assistant',
    content: response,
    language,
  });

  // Store conversation
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

function detectLanguage(text: string): 'fr' | 'ar' | 'darija' | 'en' {
  const lowerText = text.toLowerCase().trim();

  if (/^(hi|hello|hey|how|what|when|where|why|who|can|could|would|should|is|are|do|does|did)/i.test(lowerText)) {
    return 'en';
  }

  if (/^(bonjour|salut|bonsoir|comment|quoi|quand|ou|pourquoi|qui|est-ce|sont|fais|fait)/i.test(lowerText)) {
    return 'fr';
  }

  const arabicPattern = /[\u0600-\u06FF]/;
  const frenchPattern = /[àâäéèêëïîôùûüÿç]/i;

  if (arabicPattern.test(text)) {
    if (text.includes('د') || text.includes('ة')) {
      return 'ar';
    }
    return 'darija';
  }

  if (frenchPattern.test(text)) {
    return 'fr';
  }

  return 'en';
}

function getDefaultResponse(message: string, language: string): string {
  const responses: Record<string, string> = {
    en: "Hello! I'm OmniServe, your multilingual AI assistant. How can I help you today with your financial questions?",
    fr: "Bonjour ! Je suis OmniServe, votre assistant IA multilingue. Comment puis-je vous aider aujourd'hui avec vos questions financières ?",
    ar: "مرحباً! أنا OmniServe، مساعدك الذكي متعدد اللغات. كيف يمكنني مساعدتك اليوم في أسئلتك المالية؟",
    darija: "أهلاً! أنا OmniServe، مساعدك الذكي ديال الخدمات المالية. كيفاش يمكنني نخدمك اليوم؟",
  };

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('salut') || lowerMessage.includes('bonjour') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return responses[language] || responses.en;
  }

  if (lowerMessage.includes('tax') || lowerMessage.includes('impôt') || lowerMessage.includes('ضريبة')) {
    if (language === 'en') {
      return "For tax questions, I recommend using our FiscAI Tax Counsel tool for detailed advice with legal citations.";
    } else if (language === 'fr') {
      return "Pour les questions fiscales, je recommande d'utiliser notre outil FiscAI Tax Counsel pour des conseils détaillés avec citations légales.";
    } else {
      return "بالنسبة للأسئلة الضريبية، أنصحك باستخدام أداة FiscAI Tax Counsel للحصول على نصائح مفصلة مع المراجع القانونية.";
    }
  }

  return responses[language] || responses.en;
}

export async function transcribeAudioWithGroq(audioBuffer: Buffer, provider?: 'cloud' | 'local'): Promise<string> {
  return llmService.transcribe(audioBuffer, { provider });
}
