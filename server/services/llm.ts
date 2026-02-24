/**
 * Unified LLM Provider Service
 * Handles routing between Cloud (OpenAI, Groq, HF) and Local (Ollama, LM Studio) LLMs
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
    provider?: 'cloud' | 'local';
}

export interface TranscriptionOptions {
    model?: string;
    provider?: 'cloud' | 'local';
}

export interface VisionOptions {
    model?: string;
    prompt: string;
    imageBuffer: Buffer;
    mimeType: string;
    provider?: 'cloud' | 'local';
}

class LLMService {
    private getProvider(): 'cloud' | 'local' {
        return (process.env.AI_PROVIDER as 'cloud' | 'local') || 'cloud';
    }

    private getLocalUrl(): string {
        return process.env.LOCAL_LLM_URL || 'http://localhost:11434/v1';
    }

    private getLocalModel(defaultModel: string): string {
        return process.env.LOCAL_LLM_MODEL || defaultModel;
    }

    /**
     * Universal chat completion
     */
    async chat(messages: Message[], options: ChatOptions = {}): Promise<string> {
        const provider = options.provider || this.getProvider();

        if (provider === 'local') {
            return this.chatLocal(messages, options);
        }

        // Default to Groq if available (faster/cheaper for this project's scale)
        if (process.env.GROQ_API_KEY) {
            return this.chatGroq(messages, options);
        }

        // Fallback to OpenAI
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

    private async chatLocal(messages: Message[], options: ChatOptions): Promise<string> {
        const url = `${this.getLocalUrl()}/chat/completions`;
        const model = this.getLocalModel(options.model || 'llama3');

        console.log(`Routing LLM call to local provider: ${url} (Model: ${model})`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature: options.temperature ?? 0.7,
                    max_tokens: options.maxTokens,
                    response_format: options.responseFormat,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Local LLM error: ${response.status} - ${error}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Local LLM connection failed, falling back to cloud:', error);
            // If explicit local was requested and failed, we should probably throw or fallback based on config
            // For now, keeping the fallback to cloud as requested by the user's "online services" toggle logic
            return this.chat(messages, { ...options, provider: 'cloud' });
        }
    }

    /**
     * Audio transcription
     */
    async transcribe(audioBuffer: Buffer, options: TranscriptionOptions = {}): Promise<string> {
        const provider = options.provider || this.getProvider();

        if (provider === 'local') {
            // Most local setups use a separate endpoint or just don't support Whisper yet
            // We'll fallback to cloud for transcription unless explicit local transcription is set up
            console.warn('Local transcription not implemented, falling back to Groq Whisper');
        }

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

    /**
     * Vision analysis
     */
    async vision(options: VisionOptions): Promise<any> {
        const provider = options.provider || this.getProvider();

        if (provider === 'local') {
            // Local vision (e.g. LLaVA) often has different prompt requirements
            // For now, we fallback to OpenAI Vision
            console.warn('Local vision not implemented, falling back to OpenAI');
        }

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
