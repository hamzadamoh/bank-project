# Vercel Environment Variables Setup Guide

This guide lists all environment variables needed for your FiscAI project on Vercel.

## Required Environment Variables

### 1. OPENAI_API_KEY (Optional but Recommended)

**Purpose**: Powers all 7 AI tools with real AI capabilities.

**Where to get it**: 
- Sign up at https://platform.openai.com
- Go to API Keys section: https://platform.openai.com/api-keys
- Create a new secret key

**Value Format**: `sk-proj-...` (starts with `sk-`)

**What it enables**:
- ✅ Tax Counsel: Real AI-powered tax advice with citations
- ✅ Query Architect: Accurate NL↔SQL conversion
- ✅ SkillArcade: AI-generated skill insights and recommendations
- ✅ OmniServe: Multilingual AI chatbot (FR/AR/Darija)
- ✅ Rhalia: AI-powered wellbeing analysis
- ✅ SatisfAI: Emotional satisfaction insights

**Without it**: Tools will use enhanced mock responses (still functional for demos).

---

### 2. DATABASE_URL (Optional)

**Purpose**: PostgreSQL database connection string (for production database storage).

**Where to get it**: 
- From your database provider (Neon, Supabase, Railway, etc.)
- Format: `postgresql://user:password@host:port/database?sslmode=require`

**Current Status**: The project uses in-memory storage by default, so this is optional unless you want persistent data storage.

**Note**: If you don't set this, the app will use in-memory storage which is fine for demos but data won't persist across deployments.

---

### 3. NODE_ENV (Automatic)

**Purpose**: Environment type (development/production).

**Status**: Automatically set by Vercel - **don't need to configure manually**.

---

### 4. PORT (Automatic)

**Purpose**: Server port number.

**Status**: Automatically set by Vercel - **don't need to configure manually**.

---

## How to Add Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click on your project (`bank-project`)

2. **Navigate to Settings**:
   - Click the **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add OPENAI_API_KEY**:
   - Click **Add New**
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Paste your OpenAI API key (starts with `sk-`)
   - **Environments**: Select all three:
     - ☑️ Production
     - ☑️ Preview  
     - ☑️ Development
   - Click **Save**

4. **Add DATABASE_URL** (Optional):
   - Click **Add New** again
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Environments**: Select all three
   - Click **Save**

5. **Redeploy**:
   - Go to **Deployments** tab
   - Click the **"..."** (three dots) on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger automatic redeploy

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add OPENAI_API_KEY
# When prompted, paste your API key and select all environments

# For database (optional)
vercel env add DATABASE_URL
# When prompted, paste your connection string and select all environments

# Redeploy
vercel --prod
```

---

## Verification Checklist

After adding environment variables, verify:

- [ ] `OPENAI_API_KEY` is listed in Environment Variables
- [ ] `OPENAI_API_KEY` is enabled for Production, Preview, and Development
- [ ] Latest deployment completed successfully
- [ ] Test a tool (e.g., Tax Counsel) - if it returns AI-generated responses, the key is working

---

## Environment Variables Summary

| Variable | Required | Purpose | Format |
|----------|----------|---------|--------|
| `OPENAI_API_KEY` | ⚠️ Optional (recommended) | Powers all AI tools | `sk-proj-...` |
| `DATABASE_URL` | ❌ Optional | PostgreSQL connection | `postgresql://...` |
| `NODE_ENV` | ✅ Auto | Environment type | `production` (auto) |
| `PORT` | ✅ Auto | Server port | `3000` (auto) |

---

## Cost Considerations

### OpenAI API Costs

- **GPT-4 Turbo**: ~$0.01 per 1K input tokens, ~$0.03 per 1K output tokens
- **Typical usage per request**:
  - Tax queries: ~500-1000 tokens
  - SQL conversions: ~300-800 tokens
  - Chat messages: ~200-500 tokens
  - Assessments: ~400-800 tokens

**Monitor usage**: https://platform.openai.com/usage

**Tips to reduce costs**:
- Tools fallback to mock data if API fails (no charges)
- Consider setting usage limits in OpenAI dashboard
- Cache common queries in production

---

## Security Best Practices

✅ **DO**:
- Add environment variables via Vercel dashboard (encrypted at rest)
- Use different API keys for development/production (optional)
- Monitor API usage regularly
- Set spending limits in OpenAI dashboard

❌ **DON'T**:
- Commit API keys to Git (they're already in `.gitignore`)
- Share your API keys publicly
- Hardcode keys in source code
- Use the same key across multiple projects (if possible)

---

## Troubleshooting

### Tools still using mock responses?

1. **Check the variable name**: Must be exactly `OPENAI_API_KEY` (case-sensitive)
2. **Redeploy after adding**: Environment variables require a new deployment
3. **Check Vercel logs**: Go to **Deployments** → Click deployment → **Logs**
4. **Verify API key**: Test your key at https://platform.openai.com/playground

### Build errors?

- Check that environment variable names are correct
- Ensure no extra spaces in values
- Check Vercel build logs for specific errors

### API errors?

- Verify your OpenAI account has credits
- Check API rate limits
- Review error messages in Vercel function logs

---

## Quick Setup Summary

**Minimum setup** (works with mock data):
- No environment variables needed! 🎉

**Full AI setup** (recommended):
1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Add `OPENAI_API_KEY` in Vercel dashboard
3. Redeploy
4. Done! ✅

