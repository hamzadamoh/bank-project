# Netlify Deployment Guide

This project can be deployed to **Netlify** just like Vercel! The codebase has been adapted to work with both platforms.

## ✅ What Works on Netlify

- ✅ Express.js serverless functions
- ✅ All API routes (`/api/*`)
- ✅ Static file serving
- ✅ Environment variables
- ✅ Same functionality as Vercel

## 📋 Prerequisites

1. **Netlify Account**: Sign up at https://app.netlify.com
2. **Git Repository**: Your code should be in a Git repo (GitHub, GitLab, or Bitbucket)

## 🚀 Deployment Steps

### Method 1: Netlify Dashboard (Recommended)

1. **Connect Repository**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Select the repository and branch

2. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions` (auto-detected from `netlify.toml`)

3. **Add Environment Variables**:
   - Go to **Site settings** → **Environment variables**
   - Add the same variables you use on Vercel:
     - `OPENAI_API_KEY` (optional but recommended)
     - `DATABASE_URL` (optional)
     - `NODE_ENV` (auto-set to `production`)

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site.netlify.app`

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (first time only)
netlify init

# Deploy
netlify deploy --prod
```

## 🔧 Configuration Files

### `netlify.toml`
Already created! This file configures:
- Build command and output directory
- Function directory
- Redirects for API routes and SPA routing

### `netlify/functions/server.ts`
Netlify function adapter that wraps your Express app using `serverless-http`.

## 🔄 Differences from Vercel

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Function Format | `VercelRequest/VercelResponse` | AWS Lambda (`event`, `context`) |
| Config File | `vercel.json` | `netlify.toml` |
| Function Location | `api/` | `netlify/functions/` |
| Timeout (Free) | 10 seconds | 10 seconds |
| Timeout (Pro) | 60 seconds | 26 seconds |

## 📝 Environment Variables

Add the same environment variables as Vercel:

| Variable | Required | Purpose |
|----------|----------|---------|
| `OPENAI_API_KEY` | ⚠️ Optional | Powers all AI tools |
| `DATABASE_URL` | ❌ Optional | PostgreSQL connection |
| `NODE_ENV` | ✅ Auto | Set to `production` automatically |

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module 'serverless-http'`
- **Solution**: Run `npm install` to install dependencies

**Error**: `Functions directory not found`
- **Solution**: Ensure `netlify/functions/server.ts` exists

### API Routes Return 404

**Check**:
1. Verify `netlify.toml` redirects are correct
2. Check Netlify function logs: **Site settings** → **Functions** → **View logs**
3. Ensure function is deployed: Check **Functions** tab in Netlify dashboard

### Static Files Not Loading

**Check**:
1. Verify `dist/public` directory exists after build
2. Check build logs for errors
3. Ensure `publish` directory in `netlify.toml` matches build output

## 📊 Monitoring

- **Function Logs**: **Site settings** → **Functions** → **View logs**
- **Build Logs**: Click on any deployment → **Deploy log**
- **Analytics**: Available in Netlify dashboard (Pro plan)

## 🔄 Switching Between Vercel and Netlify

You can deploy to **both platforms** simultaneously! They use different files:

- **Vercel**: Uses `api/index.ts` and `vercel.json`
- **Netlify**: Uses `netlify/functions/server.ts` and `netlify.toml`

Both share the same:
- `server/` directory (routes and services)
- `client/` directory (frontend)
- Environment variables (set separately in each platform)

## 💡 Tips

1. **Free Tier Limits**:
   - 100GB bandwidth/month
   - 300 build minutes/month
   - 10-second function timeout

2. **Pro Tier Benefits**:
   - 26-second function timeout
   - More build minutes
   - Priority support

3. **Build Optimization**:
   - Netlify automatically caches `node_modules` between builds
   - Use `NETLIFY_NODE_VERSION=20` in environment variables if needed

## ✅ Verification Checklist

After deployment:

- [ ] Site loads at `https://your-site.netlify.app`
- [ ] API routes work (test `/api/health`)
- [ ] Static files load correctly
- [ ] Environment variables are set
- [ ] Functions are deployed (check Functions tab)
- [ ] Build logs show no errors

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://answers.netlify.com
- Check function logs in Netlify dashboard
