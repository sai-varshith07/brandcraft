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
