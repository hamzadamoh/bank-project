# OpenAI API Connection Guide

## ✅ Services ARE Connected to OpenAI API

All 7 AI tools are **already connected** to OpenAI's API (ChatGPT backend). They use:
- **Model**: `gpt-4o-mini` (cost-effective, fast)
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Direct API calls**: Using native `fetch()` - no middleman

## 🔧 Setup Required

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you'll only see it once!)

### Step 2: Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `sk-...` (your API key)
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application

## 🔍 How It Works

### Current Implementation

Each service checks for the API key:

```typescript
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // Falls back to mock data if no key
  return getMockResponse();
}

// Makes direct API call to OpenAI
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [...],
  }),
});
```

### Services Using OpenAI:

1. **Tax Counsel** - Tax advice with legal citations
2. **Query Architect** - NL ↔ SQL conversion
3. **Factoring Guardian** - Document fraud detection (uses mock, ready for OCR)
4. **SkillArcade** - Skills assessment insights
5. **OmniServe** - Multilingual chatbot (FR/AR/Darija)
6. **Rhalia** - Wellbeing analysis
7. **SatisfAI** - Satisfaction measurement

## 🐛 Troubleshooting 500 Errors

### Check 1: API Key is Set

In Vercel logs, you should see:
- ✅ `"Using OpenAI API for [service] (key present)"` - Key is found
- ⚠️ `"OPENAI_API_KEY not found, using mock data"` - Key is missing

### Check 2: API Key is Valid

If you see errors like:
- `401 Unauthorized` - API key is invalid or expired
- `429 Too Many Requests` - Rate limit exceeded (upgrade plan)
- `500 Internal Server Error` from OpenAI - Temporary issue

### Check 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** → Latest deployment
3. Click **Functions** tab
4. Click on the function (e.g., `/api/tax-queries`)
5. View **Logs** tab for detailed error messages

### Common Issues:

1. **API Key Not Set in Vercel**
   - Solution: Add `OPENAI_API_KEY` to environment variables and redeploy

2. **Invalid API Key**
   - Solution: Generate a new key from OpenAI dashboard

3. **Rate Limits**
   - Solution: Check your OpenAI usage at https://platform.openai.com/usage

4. **Network Errors**
   - Solution: Check Vercel function logs for connection errors

## 📊 Fallback Behavior

If OpenAI API fails or API key is missing:
- Services automatically fall back to **intelligent mock data**
- Application continues to work
- No crashes or breaking errors
- Mock responses are context-aware

## 💰 Cost Considerations

Using `gpt-4o-mini`:
- **Cost**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- **Very affordable** for most use cases
- Each request typically uses <1000 tokens

Monitor usage at: https://platform.openai.com/usage

## 🔒 Security

- ✅ API key stored in Vercel environment variables (secure)
- ✅ Never exposed to client-side code
- ✅ All API calls happen server-side
- ✅ No API key in Git repository

## 🚀 Testing Locally

Create `.env.local` in project root:

```bash
OPENAI_API_KEY=sk-your-key-here
```

Then run:
```bash
npm run dev
```

The services will use your API key in development.

---

**Need Help?**
- Check Vercel function logs for specific error messages
- Verify API key is set in Vercel environment variables
- Test API key directly: https://platform.openai.com/playground

