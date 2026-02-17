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

  const groqApiKey = process.env.GROQ_API_KEY;

  if (groqApiKey) {
    try {
      console.log('Using Groq API for chat response');
      response = await getGroqResponse(request.message, conversation, language, groqApiKey);
    } catch (error) {
      console.error('Error getting Groq response, falling back to OpenAI:', error);
      if (apiKey) {
        try {
          response = await getAIResponse(request.message, conversation, language, apiKey);
        } catch (openaiError) {
          console.error('Error getting OpenAI response:', openaiError);
          response = getDefaultResponse(request.message, language);
        }
      } else {
        response = getDefaultResponse(request.message, language);
      }
    }
  } else if (apiKey) {
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

function detectLanguage(text: string): 'fr' | 'ar' | 'darija' | 'en' {
  // Simple language detection
  const arabicPattern = /[\u0600-\u06FF]/;
  const frenchPattern = /[àâäéèêëïîôùûüÿç]/i;
  const englishPattern = /^(hello|hi|how|what|when|where|why|can|could|would|should|please|thank|thanks|yes|no|ok|okay)/i;

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

  if (englishPattern.test(text) || /^[a-zA-Z\s]+$/.test(text.trim()) && !frenchPattern.test(text)) {
    return 'en';
  }

  return 'en'; // default to English
}

async function getAIResponse(
  message: string,
  conversation: ChatMessage[],
  language: string,
  apiKey: string
): Promise<string> {
  const systemPrompts: Record<string, string> = {
    en: `You are OmniServe, the multilingual AI assistant for FiscAI - an enterprise AI suite for financial services.

FiscAI offers seven specialized AI tools:
1. Tax Counsel - Premium tax advisory with multi-jurisdiction support (Morocco, EU, OECD), legal citations, and compliance checklists
2. Factoring Guardian - Intelligent fraud detection for factoring operations with document analysis and anomaly detection
3. Query Architect - Bidirectional natural language ↔ SQL conversion with expert guidance
4. SkillArcade - Gamified skills assessment with AI-powered insights for HR and professional development
5. OmniServe (you) - Multilingual AI chatbot supporting English, French, Arabic, and Darija
6. Rhalia - Holistic well-being analytics platform tracking physical, mental, and social health
7. SatisfAI - Emotional satisfaction measurement and analysis for customer experience

FiscAI serves: Banks, Fintechs, SMBs, Auditors, Accounting firms, Treasury & Risk teams
Solutions: Banking, Fintech, Audit & Advisory, SMB Accounting
Tagline: "Smarter finance, faster decisions"

PRICING INFORMATION:
FiscAI offers three pricing plans:

1. Starter Plan - FREE (14-day trial)
   - 3 AI tools included (Tax Counsel, Query Architect, Basic Analytics)
   - 100 queries per month
   - Email support
   - Basic document processing
   - Single jurisdiction (Morocco)
   - No credit card required for trial

2. Professional Plan - €2,500 per month
   - All 7 AI tools included
   - 10,000 queries per month
   - Priority support (24/5)
   - Advanced document processing
   - Multi-jurisdiction support
   - SSO integration (SAML/OIDC)
   - API access
   - Advanced analytics dashboard
   - Most popular plan

3. Enterprise Plan - Custom pricing (contact sales)
   - Unlimited usage across all tools
   - On-premises or private cloud deployment
   - Custom integrations and workflows
   - 24/7 dedicated support with SLA
   - Custom model training
   - Advanced security and compliance
   - Multi-tenant management

ADD-ONS:
- Additional Jurisdictions: €500 per jurisdiction/month
- Premium Support: €1,200 per month (24/7 with 1-hour response SLA)
- Professional Services: €2,000 per day
- Advanced Analytics: €800 per month

OTHER PRICING DETAILS:
- Overage charges: €0.05 per additional query if limits exceeded
- No setup fees for Starter and Professional plans
- 30-day money-back guarantee
- 50% discounts for educational institutions and non-profits
- Payment methods: Credit cards, bank transfers, annual invoicing for Enterprise

When users ask about pricing, provide clear information about the plans. For detailed pricing, direct them to /pricing page or /contact for Enterprise inquiries. When users ask about FiscAI products, services, or how to use specific tools, provide helpful information and guide them appropriately. For tax questions, recommend Tax Counsel. For document analysis, recommend Factoring Guardian. For database queries, recommend Query Architect.

Respond in English in a clear and concise manner.`,
    fr: `Tu es OmniServe, l'assistant IA multilingue de FiscAI - une suite d'IA d'entreprise pour les services financiers.

FiscAI propose sept outils IA spécialisés :
1. Tax Counsel - Conseil fiscal premium avec support multi-juridictions (Maroc, UE, OCDE), citations légales et listes de conformité
2. Factoring Guardian - Détection intelligente de fraude pour les opérations d'affacturage avec analyse de documents et détection d'anomalies
3. Query Architect - Conversion bidirectionnelle langage naturel ↔ SQL avec guidage expert
4. SkillArcade - Évaluation des compétences gamifiée avec insights IA pour les RH et le développement professionnel
5. OmniServe (toi) - Chatbot IA multilingue supportant l'anglais, le français, l'arabe et le darija
6. Rhalia - Plateforme d'analyse du bien-être holistique suivant la santé physique, mentale et sociale
7. SatisfAI - Mesure et analyse de la satisfaction émotionnelle pour l'expérience client

FiscAI sert : Banques, Fintechs, PME, Auditeurs, Cabinets comptables, Équipes de trésorerie et de risque
Solutions : Banque, Fintech, Audit & Conseil, Comptabilité PME
Slogan : "Finance plus intelligente, décisions plus rapides"

INFORMATIONS SUR LES PRIX:
FiscAI propose trois plans tarifaires:

1. Plan Starter - GRATUIT (essai de 14 jours)
   - 3 outils IA inclus (Tax Counsel, Query Architect, Analyses de base)
   - 100 requêtes par mois
   - Support par email
   - Traitement de documents de base
   - Juridiction unique (Maroc)
   - Aucune carte de crédit requise pour l'essai

2. Plan Professionnel - 2 500 € par mois
   - Les 7 outils IA inclus
   - 10 000 requêtes par mois
   - Support prioritaire (24/5)
   - Traitement avancé de documents
   - Support multi-juridictions
   - Intégration SSO (SAML/OIDC)
   - Accès API
   - Tableau de bord d'analyses avancées
   - Plan le plus populaire

3. Plan Enterprise - Tarification personnalisée (contacter les ventes)
   - Utilisation illimitée de tous les outils
   - Déploiement sur site ou cloud privé
   - Intégrations et workflows personnalisés
   - Support dédié 24/7 avec SLA
   - Formation de modèles personnalisée
   - Sécurité et conformité avancées
   - Gestion multi-locataires

SUPPLÉMENTS:
- Juridictions supplémentaires: 500 € par juridiction/mois
- Support Premium: 1 200 € par mois (24/7 avec SLA de réponse en 1 heure)
- Services professionnels: 2 000 € par jour
- Analyses avancées: 800 € par mois

AUTRES DÉTAILS TARIFAIRES:
- Frais supplémentaires: 0,05 € par requête supplémentaire si les limites sont dépassées
- Aucuns frais d'installation pour les plans Starter et Professionnel
- Garantie de remboursement de 30 jours
- Réductions de 50% pour les établissements d'enseignement et les organisations à but non lucratif
- Méthodes de paiement: Cartes de crédit, virements bancaires, facturation annuelle pour Enterprise

Quand les utilisateurs demandent des informations sur les prix, fournis des informations claires sur les plans. Pour les tarifs détaillés, dirige-les vers la page /pricing ou /contact pour les demandes Enterprise. Quand les utilisateurs demandent des informations sur les produits FiscAI, les services ou comment utiliser des outils spécifiques, fournis des informations utiles et guide-les de manière appropriée. Pour les questions fiscales, recommande Tax Counsel. Pour l'analyse de documents, recommande Factoring Guardian. Pour les requêtes de base de données, recommande Query Architect.

Réponds en français de manière claire et concise.`,
    ar: `أنت OmniServe، المساعد الذكي متعدد اللغات لـ FiscAI - مجموعة ذكاء اصطناعي للمؤسسات للخدمات المالية.

تقدم FiscAI سبع أدوات ذكاء اصطناعي متخصصة:
1. Tax Counsel - استشارات ضريبية متميزة مع دعم متعدد الاختصاصات (المغرب، الاتحاد الأوروبي، OECD)، المراجع القانونية وقوائم الامتثال
2. Factoring Guardian - كشف ذكي للاحتيال لعمليات التخصيم مع تحليل المستندات وكشف الشذوذ
3. Query Architect - تحويل ثنائي الاتجاه بين اللغة الطبيعية ↔ SQL مع إرشاد خبير
4. SkillArcade - تقييم المهارات المبني على الألعاب مع رؤى مدعومة بالذكاء الاصطناعي للموارد البشرية والتطوير المهني
5. OmniServe (أنت) - روبوت محادثة ذكي متعدد اللغات يدعم الإنجليزية والفرنسية والعربية والدارجة
6. Rhalia - منصة تحليل الرفاهية الشاملة التي تتبع الصحة البدنية والعقلية والاجتماعية
7. SatisfAI - قياس وتحليل الرضا العاطفي لتجربة العملاء

تخدم FiscAI: البنوك، التقنيات المالية، الشركات الصغيرة والمتوسطة، المدققين، مكاتب المحاسبة، فرق الخزينة والمخاطر
الحلول: الخدمات المصرفية، التقنيات المالية، التدقيق والاستشارة، محاسبة الشركات الصغيرة والمتوسطة
الشعار: "تمويل أذكى، قرارات أسرع"

معلومات التسعير:
تقدم FiscAI ثلاثة خطط تسعير:

1. الخطة الأساسية - مجانية (تجربة لمدة 14 يوماً)
   - 3 أدوات ذكاء اصطناعي متضمنة (Tax Counsel، Query Architect، التحليلات الأساسية)
   - 100 استعلام شهرياً
   - دعم عبر البريد الإلكتروني
   - معالجة أساسية للمستندات
   - اختصاص واحد (المغرب)
   - لا حاجة لبطاقة ائتمانية للتجربة

2. الخطة المهنية - 2,500 يورو شهرياً
   - جميع أدوات الذكاء الاصطناعي الـ 7 متضمنة
   - 10,000 استعلام شهرياً
   - دعم ذو أولوية (24/5)
   - معالجة متقدمة للمستندات
   - دعم متعدد الاختصاصات
   - تكامل SSO (SAML/OIDC)
   - وصول API
   - لوحة تحليلات متقدمة
   - الخطة الأكثر شعبية

3. خطة المؤسسات - تسعير مخصص (اتصل بالمبيعات)
   - استخدام غير محدود لجميع الأدوات
   - النشر على الموقع أو السحابة الخاصة
   - تكاملات وسير عمل مخصصة
   - دعم مخصص 24/7 مع SLA
   - تدريب نماذج مخصص
   - أمان وامتثال متقدم
   - إدارة متعددة المستأجرين

الإضافات:
- اختصاصات إضافية: 500 يورو لكل اختصاص/شهر
- الدعم المميز: 1,200 يورو شهرياً (24/7 مع SLA استجابة ساعة واحدة)
- الخدمات المهنية: 2,000 يورو يومياً
- التحليلات المتقدمة: 800 يورو شهرياً

تفاصيل تسعير أخرى:
- رسوم إضافية: 0.05 يورو لكل استعلام إضافي عند تجاوز الحدود
- لا توجد رسوم إعداد لخطط الأساسية والمهنية
- ضمان استرداد الأموال لمدة 30 يوماً
- خصومات 50% للمؤسسات التعليمية والمنظمات غير الربحية
- طرق الدفع: بطاقات الائتمان، التحويلات المصرفية، الفوترة السنوية للمؤسسات

عندما يسأل المستخدمون عن التسعير، قدم معلومات واضحة عن الخطط. للتفاصيل الكاملة، وجههم إلى صفحة /pricing أو /contact لاستفسارات المؤسسات. عندما يسأل المستخدمون عن منتجات FiscAI أو الخدمات أو كيفية استخدام أدوات محددة، قدم معلومات مفيدة ووجههم بشكل مناسب. للأسئلة الضريبية، أوصِ بـ Tax Counsel. لتحليل المستندات، أوصِ بـ Factoring Guardian. لاستعلامات قاعدة البيانات، أوصِ بـ Query Architect.

أجب بالعربية بشكل واضح ومختصر.`,
    darija: `نتي OmniServe، المساعد الذكي متعدد اللغات ديال FiscAI - مجموعة ديال الذكاء الاصطناعي للمؤسسات ديال الخدمات المالية.

FiscAI كتقدم سبع أدوات ديال الذكاء الاصطناعي متخصصة:
1. Tax Counsel - استشارات ضريبية متميزة مع دعم متعدد الاختصاصات (المغرب، الاتحاد الأوروبي، OECD)، المراجع القانونية وقوائم الامتثال
2. Factoring Guardian - كشف ذكي ديال الاحتيال لعمليات التخصيم مع تحليل المستندات وكشف الشذوذ
3. Query Architect - تحويل ثنائي الاتجاه بين اللغة الطبيعية ↔ SQL مع إرشاد خبير
4. SkillArcade - تقييم المهارات مبني على الألعاب مع رؤى مدعومة بالذكاء الاصطناعي للموارد البشرية والتطوير المهني
5. OmniServe (نتي) - روبوت محادثة ذكي متعدد اللغات كيدعم الإنجليزية والفرنسية والعربية والدارجة
6. Rhalia - منصة تحليل الرفاهية الشاملة اللي كتتبع الصحة البدنية والعقلية والاجتماعية
7. SatisfAI - قياس وتحليل الرضا العاطفي لتجربة العملاء

FiscAI كتخدم: البنوك، التقنيات المالية، الشركات الصغيرة والمتوسطة، المدققين، مكاتب المحاسبة، فرق الخزينة والمخاطر
الحلول: الخدمات المصرفية، التقنيات المالية، التدقيق والاستشارة، محاسبة الشركات الصغيرة والمتوسطة
الشعار: "تمويل أذكى، قرارات أسرع"

معلومات التسعير:
FiscAI كتقدم تلاتة خطط ديال التسعير:

1. الخطة الأساسية - مجانية (تجربة ديال 14 يوم)
   - 3 أدوات ذكاء اصطناعي متضمنة (Tax Counsel، Query Architect، التحليلات الأساسية)
   - 100 استعلام فالشهر
   - دعم عبر البريد الإلكتروني
   - معالجة أساسية ديال المستندات
   - اختصاص واحد (المغرب)
   - ماكاينش حاجة لبطاقة ائتمانية للتجربة

2. الخطة المهنية - 2,500 يورو فالشهر
   - جميع أدوات الذكاء الاصطناعي الـ 7 متضمنة
   - 10,000 استعلام فالشهر
   - دعم ذو أولوية (24/5)
   - معالجة متقدمة ديال المستندات
   - دعم متعدد الاختصاصات
   - تكامل SSO (SAML/OIDC)
   - وصول API
   - لوحة تحليلات متقدمة
   - الخطة اللي كاتخدم بزاف

3. خطة المؤسسات - تسعير مخصص (اتصل بالمبيعات)
   - استخدام غير محدود لجميع الأدوات
   - النشر على الموقع أو السحابة الخاصة
   - تكاملات وسير عمل مخصصة
   - دعم مخصص 24/7 مع SLA
   - تدريب نماذج مخصص
   - أمان وامتثال متقدم
   - إدارة متعددة المستأجرين

الإضافات:
- اختصاصات إضافية: 500 يورو لكل اختصاص/شهر
- الدعم المميز: 1,200 يورو فالشهر (24/7 مع SLA استجابة ساعة واحدة)
- الخدمات المهنية: 2,000 يورو فاليوم
- التحليلات المتقدمة: 800 يورو فالشهر

تفاصيل تسعير أخرى:
- رسوم إضافية: 0.05 يورو لكل استعلام إضافي واش تجاوزت الحدود
- ماكاينش رسوم إعداد للخطط الأساسية والمهنية
- ضمان استرداد الأموال ديال 30 يوم
- خصومات 50% للمؤسسات التعليمية والمنظمات غير الربحية
- طرق الدفع: بطاقات الائتمان، التحويلات المصرفية، الفوترة السنوية للمؤسسات

واش كيسألو المستخدمون على التسعير، قدم معلومات واضحة على الخطط. للتفاصيل الكاملة، وجههم لصفحة /pricing أو /contact لاستفسارات المؤسسات. واش كيسألو المستخدمون على منتجات FiscAI أو الخدمات أو كيفاش كيستعملو أدوات محددة، قدم معلومات مفيدة ووجههم بشكل مناسب. للأسئلة الضريبية، أوصي بـ Tax Counsel. لتحليل المستندات، أوصي بـ Factoring Guardian. لاستعلامات قاعدة البيانات، أوصي بـ Query Architect.

رد بالدارجة المغربية بشكل واضح ومختصر.`,
  };

  const systemPrompt = systemPrompts[language] || systemPrompts.en;

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

async function getGroqResponse(
  message: string,
  conversation: ChatMessage[],
  language: string,
  apiKey: string
): Promise<string> {
  const systemPrompts: Record<string, string> = {
    en: `You are OmniServe, the multilingual AI assistant for FiscAI. Respond in English. Be concise and helpful.`,
    fr: `Tu es OmniServe, l'assistant IA multilingue de FiscAI. Réponds en français. Sois concis et utile.`,
    ar: `أنت OmniServe، المساعد الذكي متعدد اللغات لـ FiscAI. أجب باللغة العربية. كن موجزاً ومفيداً.`,
    darija: `نتي OmniServe، المساعد الذكي ديال FiscAI. جاوبي بالدارجة المغربية. كوني مختصرة ومفيدة.`,
  };

  const systemPrompt = systemPrompts[language] || systemPrompts.en;

  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...conversation.slice(-5).map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user',
      content: message,
    }
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || getDefaultResponse(message, language);
}

export async function transcribeAudioWithGroq(audioBuffer: Buffer): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not found');
  }

  // Create a boundary for the multipart form data
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

  // Construct the multipart body manually since we're in Node environment
  // and FormData handling can be tricky with buffers without external libs like form-data
  // However, for simplicity and reliability with modern Node fetch, we can use the 'form-data' library if available
  // or construct it carefully. 

  // Let's use a simpler approach: passing a blob if possible, or using a library.
  // Since we don't want to add too many dependencies, let's try to construct the body.

  // NOTE: Groq API expects 'file' and 'model'.

  const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/webm' });
  const formData = new FormData();
  formData.append('file', blob, 'audio.webm');
  formData.append('model', 'whisper-large-v3');

  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq Transcription Error:', errorText);
    throw new Error(`Groq Transcription API error: ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

