# Complete Flow: Route → GPT API

This document explains the complete flow from when a request hits the `/api/tax-queries` route all the way to making the OpenAI API call.

---

## Complete Flow Diagram

```
1. Browser/Client
   ↓ POST /api/tax-queries
   
2. Vercel Serverless Function
   ↓ Routes to /api/index
   
3. api/index.ts
   ↓ Imports server/routes.ts
   
4. server/routes.ts
   ↓ app.post("/api/tax-queries", ...)
   
5. Route Handler
   ↓ Dynamically imports service
   
6. server/services/tax-counsel.ts
   ↓ getTaxAdvice() function
   
7. OpenAI API
   ↓ fetch('https://api.openai.com/v1/chat/completions')
   
8. Response flows back up
   ↓ Through all layers
   
9. Browser receives response
```

---

## Step-by-Step Code Flow

### Step 1: Request Arrives at Route

**File:** `server/routes.ts`

```typescript
app.post("/api/tax-queries", async (req, res) => {
  // Extract data from request body
  const { query, jurisdiction } = req.body;
  
  // Validate input
  if (!query || !jurisdiction) {
    return res.status(400).json({ ... });
  }
```

### Step 2: Route Imports Service

**File:** `server/routes.ts`

```typescript
  // Dynamically import the service module
  const taxCounselModule = await import("./services/tax-counsel");
  
  // Get the function from the module
  const taxResponse = await taxCounselModule.getTaxAdvice({ 
    query, 
    jurisdiction 
  });
```

### Step 3: Service Function Checks API Key

**File:** `server/services/tax-counsel.ts`

```typescript
export async function getTaxAdvice(request: TaxQueryRequest): Promise<TaxResponse> {
  // Get API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  
  // If no API key, return mock data (no GPT call)
  if (!apiKey) {
    return getMockTaxAdvice(request);
  }
```

### Step 4: Service Builds Prompt

**File:** `server/services/tax-counsel.ts`

```typescript
  // Build the prompt with jurisdiction context
  const jurisdictionContext = getJurisdictionContext(request.jurisdiction);
  
  const prompt = `You are a professional tax advisor specializing in ${jurisdiction} tax law. 

${jurisdictionContext}

A client asks: "${request.query}"

Provide a comprehensive tax analysis with:
1. A concise short answer (2-3 sentences)
2. A detailed explanation (2-3 paragraphs)
3. Specific legal details with relevant articles/codes
4. A compliance checklist of actionable items
5. Legal citations with codes and descriptions
6. Your confidence level (0-100)

Format your response as JSON with this structure:
{
  "shortAnswer": "brief answer",
  "explanation": "detailed explanation",
  "details": [{"title": "...", "content": "..."}],
  "checklist": ["item1", "item2"],
  "citations": [{"code": "Art. 123", "description": "..."}],
  "confidence": 85
}`;
```

### Step 5: Service Makes OpenAI API Call

**File:** `server/services/tax-counsel.ts`

```typescript
  // This is where the actual GPT API call happens!
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,  // ← API key from environment
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',              // ← Model being used
      messages: [
        {
          role: 'system',
          content: 'You are an expert tax advisor. Always provide accurate, well-researched tax advice with proper citations. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,                // ← The prompt we built
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });
```

### Step 6: Service Processes Response

**File:** `server/services/tax-counsel.ts`

```typescript
  // Check if request was successful
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  // Parse the JSON response from OpenAI
  const data = await response.json();
  
  // Extract the AI's response content
  const content = JSON.parse(data.choices[0].message.content);
  
  // Transform to our response format
  return {
    shortAnswer: content.shortAnswer || '',
    explanation: content.explanation || '',
    details: content.details || [],
    checklist: content.checklist || [],
    citations: content.citations || [],
    confidence: content.confidence || 85,
  };
```

### Step 7: Response Flows Back to Route

**File:** `server/routes.ts`

```typescript
  // Save to storage
  const taxQuery = await storage.createTaxQuery({
    query,
    jurisdiction,
    response: taxResponse,  // ← Response from GPT
    confidence: taxResponse.confidence >= 80 ? "high" : ...
  });

  // Send response to client
  res.json({ 
    success: true, 
    id: taxQuery.id,
    response: taxResponse  // ← This goes back to the browser
  });
```

---

## Complete Code Path

Here's the actual code path with file references:

### 1. Route Definition
```typescript
// File: server/routes.ts
app.post("/api/tax-queries", async (req, res) => {
  const { query, jurisdiction } = req.body;
  const taxCounselModule = await import("./services/tax-counsel");
  const taxResponse = await taxCounselModule.getTaxAdvice({ query, jurisdiction });
  // ... returns response to client
});
```

### 2. Service Function
```typescript
// File: server/services/tax-counsel.ts
export async function getTaxAdvice(request: TaxQueryRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return getMockTaxAdvice(request);  // ← No GPT call if no API key
  }
  
  // Build prompt...
  
  // ← GPT API CALL HAPPENS HERE ↓
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [/* system + user prompts */],
    }),
  });
  
  // Process response and return...
}
```

---

## Key Points

1. **Route doesn't directly call GPT** - It delegates to the service layer
2. **Service layer makes the actual API call** - Uses `fetch()` to call OpenAI
3. **API key comes from environment** - `process.env.OPENAI_API_KEY`
4. **Fallback to mock data** - If no API key, uses mock responses
5. **Error handling** - Try-catch wraps everything, falls back to mock on error

---

## What Happens Without API Key?

```typescript
// In service file:
if (!apiKey) {
  return getMockTaxAdvice(request);  // ← Returns immediately, no GPT call
}
```

**Flow without API key:**
```
Route → Service → Check API key → No key found → Return mock data → Route → Client
```

**Flow with API key:**
```
Route → Service → Check API key → Key found → Build prompt → Call GPT API → Parse response → Route → Client
```

---

## Network Diagram

```
Client (Browser)
    │
    │ POST /api/tax-queries
    │ { query: "...", jurisdiction: "morocco" }
    ↓
Vercel Serverless Function
    │
    │ Express route handler
    ↓
server/routes.ts
    │
    │ Dynamic import + function call
    ↓
server/services/tax-counsel.ts
    │
    │ HTTP POST request
    ↓
https://api.openai.com/v1/chat/completions
    │
    │ GPT-4o-mini processes request
    │ Returns JSON response
    ↓
server/services/tax-counsel.ts
    │
    │ Parses and transforms response
    ↓
server/routes.ts
    │
    │ Saves to storage + returns to client
    ↓
Client (Browser)
    │
    │ Receives: { success: true, response: {...} }
```

---

## Example Request/Response

### Request to Your API
```http
POST /api/tax-queries
Content-Type: application/json

{
  "query": "VAT implications for Moroccan companies",
  "jurisdiction": "morocco"
}
```

### Your Route → Service → GPT API Request
```http
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer sk-proj-...
Content-Type: application/json

{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert tax advisor..."
    },
    {
      "role": "user",
      "content": "You are a professional tax advisor specializing in morocco tax law..."
    }
  ],
  "temperature": 0.3,
  "response_format": { "type": "json_object" }
}
```

### GPT API Response
```json
{
  "choices": [{
    "message": {
      "content": "{\"shortAnswer\":\"...\",\"explanation\":\"...\",...}"
    }
  }]
}
```

### Your API Response to Client
```json
{
  "success": true,
  "id": "uuid-here",
  "response": {
    "shortAnswer": "...",
    "explanation": "...",
    "details": [...],
    "checklist": [...],
    "citations": [...],
    "confidence": 85
  }
}
```

---

## Summary

**The route itself doesn't call GPT directly.** Instead:

1. **Route** receives HTTP request
2. **Route** calls **Service** function
3. **Service** function makes **fetch() call** to OpenAI API
4. **Service** processes response
5. **Service** returns to **Route**
6. **Route** sends response to client

The actual GPT API call happens in `server/services/tax-counsel.ts` using the native `fetch()` API.

