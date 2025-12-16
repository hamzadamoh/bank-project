import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Globe, Bot } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function OmniServe() {
  const [language, setLanguage] = useState<"fr" | "ar" | "darija" | "auto">("auto");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                OmniServe
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Multilingual AI chatbot supporting French, Arabic, and Darija. Get instant answers in your preferred language.
              </p>
            </div>

            {/* Chat Interface */}
            <GlassCard className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-ink-950" />
                  <h3 className="font-display font-bold text-2xl text-ink-950">Chat Assistant</h3>
                </div>
                
                <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto Detect</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="darija">الدارجة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Messages */}
              <div className="bg-white rounded-xl p-6 h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot className="h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-slate-600 mb-2">Start a conversation</p>
                    <p className="text-sm text-slate-500">
                      I speak French, Arabic, and Darija. Ask me anything!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl p-4 ${
                            msg.role === 'user'
                              ? 'bg-ink-950 text-alabaster-50'
                              : 'bg-alabaster-100 text-ink-950'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-xs mt-2 ${
                            msg.role === 'user' ? 'text-alabaster-200' : 'text-slate-500'
                          }`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-alabaster-100 rounded-xl p-4">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-ink-950 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-ink-950 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-ink-950 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'ar' || language === 'darija' ? 'اكتب رسالتك...' : 'Type your message...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  dir={language === 'ar' || language === 'darija' ? 'rtl' : 'ltr'}
                />
                <Button onClick={handleSend} disabled={isLoading || !message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Language Detection Badge */}
              {messages.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <Badge variant="outline" className="bg-alabaster-50">
                    <Globe className="h-3 w-3 mr-2" />
                    Detected: {language === 'fr' ? 'Français' : language === 'ar' ? 'العربية' : language === 'darija' ? 'الدارجة' : 'Auto'}
                  </Badge>
                </div>
              )}
            </GlassCard>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Multilingual</h3>
                <p className="text-slate-700">
                  Seamlessly switch between French, Arabic, and Darija with automatic language detection.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">AI-Powered</h3>
                <p className="text-slate-700">
                  Advanced AI understands context and provides relevant, accurate responses.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Send className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Context-Aware</h3>
                <p className="text-slate-700">
                  Maintains conversation context across multiple messages for natural interactions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

