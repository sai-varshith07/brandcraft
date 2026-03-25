commit# BrandCraft Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Create one at https://vercel.com
2. **API Keys**: Get the following API keys:
   - GROQ API Key: https://console.groq.com
   - Gemini API Key: https://aistudio.google.com/app/apikey
   - Stability AI API Key: https://platform.stability.ai/account/api-keys
   - GitHub Personal Access Token (repo scope): https://github.com/settings/tokens
   - Vercel API Token: https://vercel.com/account/tokens

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to the project:
   ```bash
   cd brandcraft
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. During deployment, when prompted for environment variables, add:
   - `GROQ_API_KEY` = your Groq API key
   - `GEMINI_API_KEY` = your Gemini API key
   - `STABILITY_API_KEY` = your Stability AI API key
   - `GITHUB_TOKEN` = your GitHub token
   - `VERCEL_TOKEN` = your Vercel API token

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository

2. Go to https://vercel.com and click "Add New..." → "Project"

3. Import your GitHub repository

4. In the configuration screen:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `build`

5. Add environment variables:
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY` 
   - `STABILITY_API_KEY`
   - `GITHUB_TOKEN`
   - `VERCEL_TOKEN`

6. Click "Deploy"

## Project Structure for Vercel

```
brandcraft/
├── api/
│   ├── chat.js              # Groq chat proxy
│   ├── gemini-image.js      # Gemini image generation
│   ├── stability-image.js   # Stability AI image generation
│   ├── deploy.js            # Vercel & GitHub deployment API
│   └── debug-keys.js        # Debug endpoint
├── build/                   # Production React build
├── src/                     # React source code
├── public/                  # Static assets
├── vercel.json              # Vercel configuration
├── package.json
└── server.js               # Local development server
```

## API Endpoints

After deployment, your API endpoints will be:
- `https://your-project.vercel.app/api/chat`
- `https://your-project.vercel.app/api/gemini-image`
- `https://your-project.vercel.app/api/stability-image`
- `https://your-project.vercel.app/api/deploy`
- `https://your-project.vercel.app/api/debug-keys`

## Troubleshooting

1. **API Keys not working**: Make sure they're set in Vercel dashboard under Settings → Environment Variables

2. **Build fails**: Run `npm run build` locally first to check for errors

3. **API errors**: Check the Vercel Function logs in the dashboard

## Local Development

For local development with Vercel functions:
```bash
npm install -g vercel
vercel dev
```

This will run both the React app and API functions locally.
