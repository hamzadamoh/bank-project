/**
 * Unified LLM Provider Service
 * Routes between Cloud providers (OpenAI, Groq)
 */

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: 'json_object' | 'text' };
}

export interface TranscriptionOptions {
    model?: string;
}

export interface VisionOptions {
    model?: string;
    prompt: string;
    imageBuffer: Buffer;
    mimeType: string;
}

class LLMService {
    /**
     * Universal chat completion — Groq first, OpenAI fallback
     */
    async chat(messages: Message[], options: ChatOptions = {}): Promise<string> {
        if (process.env.GROQ_API_KEY) {
            return this.chatGroq(messages, options);
        }
        return this.chatOpenAI(messages, options);
    }

    private async chatOpenAI(messages: Message[], options: ChatOptions): Promise<string> {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY not found');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: options.model || 'gpt-4o-mini',
                messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens,
                response_format: options.responseFormat,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    private async chatGroq(messages: Message[], options: ChatOptions): Promise<string> {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new Error('GROQ_API_KEY not found');

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: options.model || 'llama-3.3-70b-versatile',
                messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens,
                response_format: options.responseFormat,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    async transcribe(audioBuffer: Buffer, options: TranscriptionOptions = {}): Promise<string> {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new Error('GROQ_API_KEY not found for transcription');

        const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'audio.webm');
        formData.append('model', options.model || 'whisper-large-v3');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}` },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Transcription error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        return data.text;
    }

    async vision(options: VisionOptions): Promise<any> {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY not found for vision');

        const base64Content = options.imageBuffer.toString('base64');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: options.model || 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: options.prompt },
                            {
                                type: 'image_url',
                                image_url: { url: `data:${options.mimeType};base64,${base64Content}` },
                            },
                        ],
                    },
                ],
                temperature: 0.1,
                response_format: { type: 'json_object' },
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Vision error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        return content ? JSON.parse(content) : null;
    }
}

export const llmService = new LLMService();
