# BrandCraft One-Click Deployment Setup Guide

This guide will help you set up the one-click deployment system using Vercel API and GitHub integration.

## Prerequisites

- Node.js (v16 or higher)
- GitHub account
- Vercel account
- BrandCraft project installed

## Step 1: Create Vercel Personal Access Token

1. Go to Vercel Dashboard → Settings → Tokens
2. Click "Create Token"
3. Give it a name like "BrandCraft API"
4. Copy the token

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys in `.env`:
   ```env
   VERCEL_TOKEN=your_vercel_token_here
   GROQ_API_KEY=your_groq_key_here
   GEMINI_API_KEY=your_gemini_key_here
   STABILITY_API_KEY=your_stability_key_here
   ```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Test the Setup

1. Start the development server:
   ```bash
   npm start
   ```

2. Visit http://localhost:3000
3. Generate a brand and try the "Launch Website" button

## API Endpoints

### POST /api/deploy

Deploy a website to Vercel via GitHub.

**Request Body:**
```json
{
  "html": "<html>...</html>",
  "brandName": "Your Brand Name"
}
```

**Response:**
```json
{
  "url": "https://your-brand-name-abc123.vercel.app",
  "githubUrl": "https://github.com/username/brandcraft-your-brand-name-abc123",
  "deploymentId": "deployment_123",
  "status": "success",
  "message": "Deployment initiated successfully"
}
```

## Error Handling

The deployment system handles common errors:

- **Missing API keys**: Returns 500 error with clear message
- **GitHub API errors**: Returns specific error messages
- **Vercel API errors**: Returns Vercel's error response
- **Network timeouts**: Includes retry logic

## Security Features

- API keys are never exposed to the frontend
- All deployment calls go through the backend
- GitHub repositories are created as public by default
- Vercel deployments use production target

## Troubleshooting

### "GitHub API rate limit exceeded"
- Check your GitHub token has the correct scopes
- Wait for rate limit to reset or use a different token

### "Vercel deployment failed"
- Verify your Vercel token has deployment permissions
- Check Vercel dashboard for deployment logs

### "Missing HTML content"
- Ensure the frontend is sending the HTML content
- Check browser console for JavaScript errors

## Production Deployment

For production use:

1. Set `NODE_ENV=production` in your `.env`
2. Use environment variables in your hosting platform
3. Consider using GitHub Apps for more secure authentication
4. Monitor deployment logs in your Vercel dashboard

## Rate Limits

- GitHub API: 5,000 requests/hour per token
- Vercel API: Varies by plan, typically generous for personal use

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all API keys are correctly configured
3. Test each API individually using curl or Postman
4. Check the server logs for detailed error messages