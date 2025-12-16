# Troubleshooting 500 Errors

If you're getting 500 errors, here are the most common causes and solutions:

## Common Causes

### 1. Missing Environment Variables

**Symptom**: API calls return 500 errors with "Internal server error"

**Solution**: 
- Tools work without `OPENAI_API_KEY` (they use mock data)
- If errors persist, check Vercel logs for specific error messages
- Ensure `OPENAI_API_KEY` is set correctly if you want AI responses

### 2. Service Import Errors

**Symptom**: 500 errors with import-related messages

**Solution**: 
- All service imports now use `.js` extensions for ESM compatibility
- If you see "Cannot find module" errors, check that service files exist

### 3. Request Validation Errors

**Symptom**: 500 errors when submitting forms

**Solution**:
- Check that required fields are provided
- Check browser console for validation error messages
- API should return 400 (bad request) for validation errors, not 500

### 4. Service Function Parameter Mismatch

**Symptom**: 500 errors with "undefined" or "cannot read property" messages

**Solution**:
- Ensure request body matches expected service parameters
- Check service function signatures match route calls

## How to Debug

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click on the failed deployment
4. Click **Logs** to see detailed error messages

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Check **Network** tab to see API request/response details

### Check API Response

The API should return detailed error messages in development:

```json
{
  "success": false,
  "message": "Error description here",
  "error": "Full stack trace (development only)"
}
```

## Current Status

All services have been updated with:
- ✅ Proper `.js` extensions for ESM imports
- ✅ Enhanced error logging
- ✅ Fallback to mock data if API fails
- ✅ Detailed error messages in development mode

## Quick Fixes

If you're still getting 500 errors:

1. **Check Vercel Logs** - Most errors will show there
2. **Verify Service Files Exist** - All services should be in `server/services/`
3. **Test Without API Key** - Services should work with mock data
4. **Check Request Format** - Ensure request body matches expected format

## Service Function Signatures

For reference, here are the correct function calls:

```typescript
// Tax Counsel
const { getTaxAdvice } = await import("./services/tax-counsel.js");
await getTaxAdvice({ query, jurisdiction });

// Query Architect
const { convertQuery } = await import("./services/query-architect.js");
await convertQuery({ type, input });

// Factoring Guardian
const { analyzeDocument } = await import("./services/factoring-guardian.js");
await analyzeDocument({ filename });

// SkillArcade
const { assessSkills } = await import("./services/skillarcade.js");
await assessSkills({ category, responses });

// OmniServe
const { chat } = await import("./services/omniserve.js");
await chat({ message, conversationId, language });

// Rhalia
const { analyzeWellbeing } = await import("./services/rhalia.js");
await analyzeWellbeing({ physicalMetrics, mentalMetrics, socialMetrics });

// SatisfAI
const { analyzeSatisfaction } = await import("./services/satisfai.js");
await analyzeSatisfaction({ responses, context });
```

