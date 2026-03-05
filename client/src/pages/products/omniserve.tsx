import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Globe, Bot, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function OmniServe() {
  const [language, setLanguage] = useState<"fr" | "ar" | "darija" | "en" | "auto">("auto");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
      }
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { setTimeout(() => scrollToBottom(), 100); }, [messages]);

  // --- Text Chat ---
  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage: Message = { role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/chat", {
        message: userMessage.content,
        conversationId,
        language,
      });
      const data = await res.json();
      if (!conversationId) setConversationId(data.conversationId);

      const assistantMessage: Message = { role: 'assistant', content: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
      if (autoSpeak) speakText(data.response, data.detectedLanguage || language);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // --- Voice Recording ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({ title: "Microphone Error", description: "Could not access microphone. Check permissions.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsLoading(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_query.webm');

    try {
      const response = await fetch('/api/omniserve/voice', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      if (data.transcription) {
        setMessages(prev => [...prev, { role: 'user', content: `🎤 ${data.transcription}`, timestamp: new Date() }]);
      }
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);
        if (autoSpeak) speakText(data.response, data.detectedLanguage || language);
      }
    } catch (error) {
      toast({ title: "Voice Error", description: "Failed to process voice. Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Text-to-Speech ---
  const speakText = (text: string, lang: string = 'en') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const langCode = (lang === 'ar' || lang === 'darija') ? 'ar' : lang;
    const voice = voices.find(v => v.lang.startsWith(langCode));
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">OmniServe</h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Multilingual AI chatbot with voice support. Speak or type in English, French, Arabic, and Darija.
              </p>
            </div>

            {/* Chat Interface */}
            <GlassCard className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-ink-950" />
                    <h3 className="font-display font-bold text-2xl text-ink-950">Chat Assistant</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setAutoSpeak(!autoSpeak); if (isSpeaking) stopSpeaking(); }}
                    className={`gap-1.5 text-xs ${autoSpeak ? 'text-emerald-600' : 'text-slate-400'}`}
                    title={autoSpeak ? "Voice responses ON" : "Voice responses OFF"}
                  >
                    {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    {autoSpeak ? "Voice On" : "Voice Off"}
                  </Button>
                </div>

                <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto Detect</SelectItem>
                    <SelectItem value="en">English</SelectItem>
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
                    <p className="text-sm text-slate-500 mb-4">
                      I speak English, French, Arabic, and Darija. Ask me anything!
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mic className="h-3.5 w-3.5" />
                      <span>Press the mic button to talk, or type below</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-ink-950 text-alabaster-50' : 'bg-alabaster-100 text-ink-950'}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <div className={`flex items-center gap-2 mt-2 ${msg.role === 'user' ? 'text-alabaster-200' : 'text-slate-500'}`}>
                            <span className="text-xs">{msg.timestamp.toLocaleTimeString()}</span>
                            {msg.role === 'assistant' && (
                              <button
                                onClick={() => speakText(msg.content, language)}
                                className="hover:text-ink-950 transition-colors"
                                title="Listen to this response"
                              >
                                <Volume2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
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

              {/* Input with Mic + Send */}
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'ar' || language === 'darija' ? 'اكتب رسالتك...' : language === 'fr' ? 'Tapez votre message...' : 'Type your message...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  dir={language === 'ar' || language === 'darija' ? 'rtl' : 'ltr'}
                  disabled={isRecording}
                />
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading && !isRecording}
                  className={isRecording ? "animate-pulse" : ""}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                {isSpeaking && (
                  <Button variant="outline" onClick={stopSpeaking} title="Stop speaking">
                    <VolumeX className="h-4 w-4" />
                  </Button>
                )}
                <Button onClick={handleSend} disabled={isLoading || !message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Status badges */}
              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                {isRecording && (
                  <Badge className="bg-red-50 text-red-600 border-red-200 animate-pulse">
                    <Mic className="h-3 w-3 mr-1" /> Recording...
                  </Badge>
                )}
                {isSpeaking && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                    <Volume2 className="h-3 w-3 mr-1" /> Speaking...
                  </Badge>
                )}
                {messages.length > 0 && !isRecording && !isSpeaking && (
                  <Badge variant="outline" className="bg-alabaster-50">
                    <Globe className="h-3 w-3 mr-2" />
                    {language === 'en' ? 'English' : language === 'fr' ? 'Français' : language === 'ar' ? 'العربية' : language === 'darija' ? 'الدارجة' : 'Auto Detect'}
                  </Badge>
                )}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Multilingual</h3>
                <p className="text-slate-700">English, French, Arabic, and Darija with auto language detection.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Mic className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Voice Input</h3>
                <p className="text-slate-700">Speak your questions. Powered by Groq Whisper speech-to-text.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Volume2 className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Voice Responses</h3>
                <p className="text-slate-700">AI reads answers aloud. Toggle voice on/off anytime.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Context-Aware</h3>
                <p className="text-slate-700">Maintains conversation context across multiple messages.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
