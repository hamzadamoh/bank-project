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

## AI Infrastructure Selection

FiscAI supports both Cloud-based and Local LLMs. You can toggle between these in the **Dashboard Settings**.

### 1. Cloud AI (Default)
- **Providers**: Groq, OpenAI
- **Requirement**: `GROQ_API_KEY` or `OPENAI_API_KEY` in environment variables.
- **Best for**: Performance, latency, and high-capacity models.

### 2. Local AI (Privacy-Focused)
- **Requirement**: A running instance of Ollama or LM Studio on your local machine.
- **Default URL**: `http://localhost:11434/v1`
- **Setup**:
  1. Download and install [Ollama](https://ollama.ai).
  2. Run `ollama run llama3`.
  3. In FiscAI Dashboard, switch to **Local**.
- **Best for**: Maximum data privacy and air-gapped environments.

### 3. Connectivity Verification
The Dashboard includes a **Connection Status** indicator:
- **Connected (Green)**: FiscAI can successfully talk to your selected AI infrastructure.
- **Disconnected (Red)**: The provider is unreachable. Check your API keys (Cloud) or ensure your local service is running (Local).

## Troubleshooting

### "Switch Failed" Error
If you cannot switch to **Local AI**:
1. Ensure Ollama/LM Studio is running.
2. Verify you can access `http://localhost:11434/v1/models` in your browser.
3. Check `LOCAL_LLM_URL` in your `.env` if you are using a non-standard port.

### Missing Admin Permissions
Only **Admin** users can change the organization's AI Infrastructure setting. If the tabs are disabled or you get a "403 Forbidden", contact your administrator.

