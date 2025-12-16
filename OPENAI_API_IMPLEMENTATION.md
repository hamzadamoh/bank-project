# How Requests Are Sent to OpenAI GPT

This document explains how the FiscAI platform makes API calls to OpenAI GPT models.

## Implementation Overview

All services use the **fetch API** to make HTTP POST requests to OpenAI's Chat Completions API endpoint. No SDK/library is used - just native fetch for simplicity and smaller bundle size.

---

## Standard Implementation Pattern

Every service follows this pattern:

```typescript
// 1. Check for API key
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // Fallback to mock data if no API key
  return getMockResponse();
}

try {
  // 2. Build the prompt
  const prompt = `Your prompt here...`;

  // 3. Make the API request
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'System prompt defining the AI persona',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // 0.0-2.0, controls randomness
      response_format: { type: 'json_object' }, // Optional: for structured JSON responses
    }),
  });

  // 4. Handle the response
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // 5. Parse and return
  return JSON.parse(content); // If JSON format was requested
  // or
  return content.trim(); // If plain text

} catch (error) {
  console.error('OpenAI API error:', error);
  // Fallback to mock data on error
  return getMockResponse();
}
```

---

## Detailed Breakdown

### 1. API Endpoint

```
https://api.openai.com/v1/chat/completions
```

This is OpenAI's Chat Completions API endpoint (same endpoint used by ChatGPT).

### 2. Authentication

The API key is sent in the `Authorization` header:

```typescript
headers: {
  'Authorization': `Bearer ${apiKey}`,
}
```

The API key comes from the environment variable: `process.env.OPENAI_API_KEY`

### 3. Request Body Structure

```typescript
{
  model: 'gpt-4o-mini',           // Model to use
  messages: [                      // Conversation history
    {
      role: 'system',              // System prompt (defines AI persona)
      content: 'You are an expert...'
    },
    {
      role: 'user',                // User prompt (the actual request)
      content: 'User question here...'
    }
  ],
  temperature: 0.3,                // 0.0 (deterministic) to 2.0 (creative)
  response_format: {               // Optional: force JSON output
    type: 'json_object'
  }
}
```

### 4. Response Structure

OpenAI returns:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Response content here..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 50,
    "total_tokens": 150
  }
}
```

We extract the content with: `data.choices[0].message.content`

---

## Examples by Service

### Tax Counsel

```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert tax advisor. Always provide accurate, well-researched tax advice with proper citations. Respond only with valid JSON.',
      },
      {
        role: 'user',
        content: `You are a professional tax advisor specializing in ${jurisdiction} tax law...`,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  }),
});

const data = await response.json();
const content = JSON.parse(data.choices[0].message.content);
```

### Query Architect (NL to SQL)

```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a SQL expert. Generate optimized, production-ready SQL queries. Return only the SQL query.',
      },
      {
        role: 'user',
        content: `Convert the following natural language question into SQL...`,
      },
    ],
    temperature: 0.2,  // Lower for more deterministic SQL
  }),
});

const data = await response.json();
const sql = data.choices[0].message.content.trim();
```

### OmniServe (Chatbot with Conversation History)

```typescript
const messages = [
  {
    role: 'system',
    content: systemPrompt,  // Language-specific system prompt
  },
  ...conversation.slice(-10).map(msg => ({  // Include last 10 messages
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
    temperature: 0.7,  // Higher for more natural conversation
  }),
});
```

---

## Temperature Settings

Different tools use different temperature values:

| Service | Temperature | Reason |
|---------|------------|--------|
| Tax Counsel | 0.3 | Precise, factual responses |
| Query Architect (NL→SQL) | 0.2 | Deterministic SQL generation |
| Query Architect (SQL→NL) | 0.3 | Clear explanations |
| SkillArcade | 0.5 | Balanced creativity for insights |
| OmniServe | 0.7 | Natural conversation flow |
| Rhalia | 0.6 | Empathetic but consistent |
| SatisfAI | 0.6 | Empathetic analysis |

---

## Error Handling

All services implement:

1. **API Key Check**: If no key, return mock data
2. **Try-Catch**: Wrap API calls in try-catch
3. **Response Validation**: Check `response.ok`
4. **Fallback**: Return mock data on any error
5. **Logging**: Console.error for debugging

```typescript
try {
  const response = await fetch(...);
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  // Process response...
  
} catch (error) {
  console.error('Service error:', error);
  return getMockResponse();  // Graceful fallback
}
```

---

## Why Native Fetch Instead of OpenAI SDK?

1. **Smaller Bundle Size**: No external dependencies
2. **Simplicity**: Direct HTTP calls are easier to understand
3. **Control**: Full control over request/response handling
4. **Compatibility**: Fetch is native in Node.js 18+ and all browsers

---

## API Costs

Each request consumes tokens:

- **Input tokens**: Everything in the `messages` array
- **Output tokens**: The generated response
- **Model**: `gpt-4o-mini` pricing:
  - Input: ~$0.15 per 1M tokens
  - Output: ~$0.60 per 1M tokens

Example costs per request:
- Tax query: ~500-1000 tokens = $0.0001-0.0003
- SQL conversion: ~300-800 tokens = $0.0001-0.0002
- Chat message: ~200-500 tokens = $0.0001-0.0002

---

## Security Notes

✅ **DO**:
- Store API key in environment variables
- Never expose API key in client-side code
- Use server-side only (all services are server-side)
- Validate and sanitize user inputs before sending to API

❌ **DON'T**:
- Hardcode API keys in source code
- Send API keys to the frontend
- Trust user input without validation
- Skip error handling

---

## Testing Without API Key

All services gracefully handle missing API keys by:
1. Detecting `!process.env.OPENAI_API_KEY`
2. Returning enhanced mock responses
3. Maintaining the same response structure
4. Allowing full frontend functionality for demos

This makes the platform functional even without API keys, perfect for demos and testing.

