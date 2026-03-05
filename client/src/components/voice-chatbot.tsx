import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2, X, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

export function VoiceChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    const [transcription, setTranscription] = useState('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, transcription]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processAudio(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast({
                title: "Microphone Error",
                description: "Could not access microphone. Please check permissions.",
                variant: "destructive"
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };

    const processAudio = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice_query.webm');

        try {
            const response = await fetch('/api/PolyGlot/voice', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.transcription) {
                setMessages(prev => [...prev, { role: 'user', content: data.transcription }]);
            }

            if (data.response) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
                speakResponse(data.response, data.detectedLanguage);
            }

        } catch (error) {
            console.error('Error processing voice query:', error);
            toast({
                title: "Error",
                description: "Failed to process voice query. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const speakResponse = (text: string, language: string = 'en') => {
        if (!window.speechSynthesis) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Attempt to set a voice matching the language
        const voices = window.speechSynthesis.getVoices();
        const langCode = language === 'ar' || language === 'darija' ? 'ar' : language;

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
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 sm:w-96"
                    >
                        <Card className="p-4 shadow-xl border-primary/20 bg-background/95 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Mic className="w-4 h-4 text-primary" />
                                    PolyGlot Voice
                                </h3>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div
                                ref={scrollRef}
                                className="h-64 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-primary/10"
                            >
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm text-center p-4">
                                        <p>Tap the microphone to start speaking.</p>
                                        <p className="mt-2 text-xs">Supported: English, French, Arabic, Darija</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isProcessing && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Processing...
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center items-center gap-4">
                                {isSpeaking ? (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-12 w-12 rounded-full border-primary text-primary animate-pulse"
                                        onClick={stopSpeaking}
                                    >
                                        <VolumeX className="w-5 h-5" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant={isRecording ? "destructive" : "default"}
                                        size="icon"
                                        className={`h-12 w-12 rounded-full shadow-lg ${isRecording ? 'animate-pulse' : ''}`}
                                        onClick={isRecording ? stopRecording : startRecording}
                                        disabled={isProcessing}
                                    >
                                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Button
                        size="lg"
                        className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90"
                        onClick={() => setIsOpen(true)}
                    >
                        <Mic className="w-6 h-6" />
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
