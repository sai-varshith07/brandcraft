# BrandCraft

AI-powered branding platform built with React. Generate brand names, logos, color palettes, ad copy, social bios, email templates, and more — all driven by Claude AI.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
src/
├── App.jsx                        # Root app + routing
├── index.js                       # React entry point
├── styles/
│   └── global.css                 # Global CSS variables, animations, utilities
├── hooks/
│   └── useToast.js                # Toast notification hook
├── utils/
│   ├── api.js                     # Anthropic API helpers (callAI, callAIJSON)
│   └── imageProviders.js          # Logo image generation (4-provider cascade)
└── components/
    ├── Icon.jsx                   # SVG icon library
    ├── UI.jsx                     # Shared UI: SkeletonCard, OutputActions, GenerateMorePanel
    ├── LandingPage.jsx            # Marketing landing page
    ├── AuthOnboarding.jsx         # Sign up / login + brand profile quiz
    ├── AppShellDashboard.jsx      # Sidebar layout + Dashboard page
    ├── BrandIdentity.jsx          # Brand Names, Logo Creator, Color Palette, Font Pairing
    ├── ContentCopy.jsx            # Ad Copy, Social Bio, Email Builder, Content Calendar
    ├── VoiceSettings.jsx          # Voice Rewriter, Sentiment Analysis, Settings page
    └── AIChatWidget.jsx           # Floating AI chat assistant
```

## 🔑 API Keys

The app calls the **Anthropic API** directly from the browser via the Claude Proxy built into Claude.ai artifacts. If running standalone, you'll need to set up a backend proxy or add your Anthropic API key.

For **logo image generation**, the app cascades through:
1. **Pollinations.ai** — free, no key required
2. **getimg.ai** — replace `IMAGE_API_KEY` in `src/utils/imageProviders.js`
3. **Leonardo.ai** — same key variable
4. **Stability AI** — same key variable

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Claude (Sonnet 4)** — AI generation
- **Pollinations.ai / getimg.ai** — Logo image generation
- **Google Fonts** — Syne + DM Sans typography
- **Pure CSS** — No CSS framework, all custom variables

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `build/` folder, ready to deploy on Vercel, Netlify, or any static host.

## 🚀 One-Click Deployment Feature

BrandCraft includes a powerful one-click deployment system that allows users to deploy their generated websites to Vercel with a single click.

### Features

- **Instant Deployment**: Deploy generated websites to Vercel in seconds
- **GitHub Integration**: Automatically creates GitHub repositories for your projects
- **Real Live URLs**: Get a real, publicly accessible URL for your website
- **Deployment Tracking**: Monitor deployment status with live progress updates
- **Error Handling**: Comprehensive error handling with retry functionality
- **Security**: API keys are never exposed to the frontend

### How It Works

1. User generates a brand and website content
2. Clicks "Launch Website" button
3. System creates a GitHub repository
4. Uploads website files to GitHub
5. Triggers Vercel deployment
6. Returns live URL and GitHub repository link

### Setup Requirements

To use the deployment feature, you need:

1. **Vercel Personal Access Token** with deployment permissions
2. Environment variables configured in `.env` file

### Environment Variables

```env
VERCEL_TOKEN=your_vercel_token_here
```

### API Endpoint

```http
POST /api/deploy
Content-Type: application/json

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

### Testing

Use the included test script to verify deployment functionality:

```bash
node test-deployment.js
```

For detailed setup instructions, see [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md).
