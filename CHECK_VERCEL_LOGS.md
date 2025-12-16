# How to Check Vercel Logs for 500 Errors

To find the actual error causing the 500 responses, follow these steps:

## Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click on your project (`bank-project`)

2. **Open Deployments**
   - Click the **Deployments** tab
   - Click on the latest deployment (should have a timestamp)

3. **View Function Logs**
   - Look for a **Functions** tab or section
   - Click on `/api/index` or the function that handles `/api/tax-queries`
   - Look for error messages in the logs

4. **Alternative: View Real-time Logs**
   - Go to your project dashboard
   - Click on **Logs** in the left sidebar
   - You'll see real-time logs from your functions
   - Filter by "Error" to see only errors

## Method 2: Vercel CLI

If you have Vercel CLI installed:

```bash
# Login to Vercel
vercel login

# View logs
vercel logs --follow
```

## What to Look For

In the logs, you should see:
- **Import errors**: "Cannot find module" or similar
- **Runtime errors**: Stack traces showing where the code fails
- **Service errors**: Errors from the tax-counsel service itself

## Common Error Patterns

### Module Not Found
```
Error: Cannot find module './services/tax-counsel'
```
**Solution**: Check if service files are being bundled correctly

### Function Not Found
```
TypeError: taxCounselModule.getTaxAdvice is not a function
```
**Solution**: Check if the export is correct

### Runtime Error
```
Error in tax-counsel service: ...
```
**Solution**: Check the service code for the actual error

## After Finding the Error

Once you identify the error:
1. Share the error message here
2. I can help fix it based on the specific error
3. The fix will be committed and deployed

