# AI Tools Setup Guide

This guide explains how to configure the AI-powered tools in FiscAI.

## Required Environment Variables

### OpenAI API Key (Optional but Recommended)

For **Tax Counsel** and **Query Architect** to work with real AI, you need an OpenAI API key:

1. Get your API key from https://platform.openai.com/api-keys
2. Add it to your environment variables:
   - Local development: Create a `.env` file in the project root:
     ```
     OPENAI_API_KEY=sk-your-api-key-here
     ```
   - Vercel: Add it in your Vercel dashboard under Settings → Environment Variables

### How It Works

#### Without API Key (Fallback Mode)
- Tools will use enhanced mock responses
- Still functional for demonstration purposes
- Responses are context-aware but not AI-generated

#### With API Key (Full AI Mode)
- **Tax Counsel**: Uses GPT-4 to provide real tax advice with proper citations
- **Query Architect**: Uses GPT-4 for accurate NL↔SQL conversion
- **Factoring Guardian**: Currently uses mock data (document processing requires OCR services - see below)

## Tool Details

### 1. Tax Counsel
- **Purpose**: AI-powered tax advisory with multi-jurisdiction support
- **AI Model**: GPT-4 Turbo (when API key is configured)
- **Features**:
  - Multi-jurisdiction tax advice (Morocco, EU, OECD)
  - Legal citations and references
  - Compliance checklists
  - Confidence scoring

### 2. Query Architect
- **Purpose**: Bidirectional natural language ↔ SQL conversion
- **AI Model**: GPT-4 Turbo (when API key is configured)
- **Features**:
  - Natural language to SQL: Converts business questions to optimized SQL queries
  - SQL to natural language: Explains complex SQL in plain English
  - Query optimization hints
  - Performance metadata

### 3. Factoring Guardian
- **Purpose**: Document fraud detection and invoice analysis
- **Current Status**: Uses mock data
- **Future Implementation** (requires additional setup):
  - OCR services (Google Vision, Azure Form Recognizer, or AWS Textract)
  - Document parsing libraries
  - ML-based anomaly detection models
  - Supplier master data integration

## Testing

1. **Local Testing**:
   ```bash
   npm install
   # Add OPENAI_API_KEY to .env file
   npm run dev
   ```

2. **Verify API Key**:
   - Try a tax query with a real question
   - If you get AI-generated responses, the API key is working
   - If you get mock responses, check your API key configuration

## Cost Considerations

OpenAI API usage is charged per token:
- GPT-4 Turbo: ~$0.01 per 1K input tokens, ~$0.03 per 1K output tokens
- Tax queries: ~500-1000 tokens per query
- SQL conversions: ~300-800 tokens per conversion

Monitor usage at: https://platform.openai.com/usage

## Production Recommendations

1. **Rate Limiting**: Implement rate limiting to control API costs
2. **Caching**: Cache common queries to reduce API calls
3. **Error Handling**: Fallback to mock data if API fails
4. **Monitoring**: Track API usage and costs
5. **Security**: Never expose API keys in client-side code

## Troubleshooting


### Groq API (Optional but Recommended for High Speed)

For **Factoring Guardian** to use the Groq API for ultra-fast fraud detection:

1. Get your API key from [Groq Console](https://console.groq.com/keys)
2. Add it to your `.env` file:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

### Hugging Face API (Required for Query Architect)

For **Query Architect** to use the dedicated SQL generation model:

1. Get your API token from [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Add it to your `.env` file:
   ```
   HUGGINGFACE_API_TOKEN=hf_your_token_here
   ```

### Voice Chatbot (Requires Groq)

For the **Voice Chatbot** to function:
1. Ensure `GROQ_API_KEY` is set (see above).
2. The system uses `whisper-large-v3` for speech-to-text and `openai/gpt-oss-120b` for responses.
3. Browser permission for microphone access is required.

### Troubleshooting

### Tools not working with AI?
- Check that `OPENAI_API_KEY`, `GROQ_API_KEY`, or `HUGGINGFACE_API_TOKEN` is set in environment variables
- Verify the API key is valid and has credits
- Check server logs for API errors
- Tools will fallback to mock data if API fails


### Getting errors?
- Ensure your OpenAI account has credits
- Check API rate limits
- Verify network connectivity
- Check browser console and server logs

