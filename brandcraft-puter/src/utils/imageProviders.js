// ─── Logo Image Generation ────────────────────────────────────────────────────
// Provider cascade: Pollinations (free/no key) → Gemini → Stability → SVG

// ── Build a tight, focused prompt per style ───────────────────────────────────
// Short prompts work MUCH better with FLUX/Pollinations — keep under 120 chars
export function buildLogoPrompt(brandName, industry, colorMood, aesthetic, style) {
  const name    = brandName  ? `"${brandName}" ` : "";
  const mood    = colorMood  ? `${colorMood} colors, ` : "";
  const look    = aesthetic  ? `${aesthetic} aesthetic, ` : "";
  const biz     = industry   ? `${industry} brand, ` : "professional brand, ";

  const styleMap = {
    "Minimal Icon": (
      `${name}logo, ${biz}${mood}${look}` +
      `minimal flat icon, single geometric shape, bold clean symbol, ` +
      `pure white background, vector art, centered, high contrast`
    ),
    "Wordmark": (
      `${name}wordmark logo, ${biz}${mood}${look}` +
      `elegant custom typography, text-only logo, refined lettering, ` +
      `pure white background, vector art, centered`
    ),
    "Badge / Emblem": (
      `${name}badge emblem logo, ${biz}${mood}${look}` +
      `circular crest design, symmetrical seal, enclosed badge, ` +
      `pure white background, vector art, premium feel`
    ),
    "Abstract Mark": (
      `${name}abstract logo mark, ${biz}${mood}${look}` +
      `modern geometric symbol, bold dynamic shape, creative mark, ` +
      `pure white background, vector art, centered`
    ),
  };

  return (styleMap[style] || styleMap["Minimal Icon"]).slice(0, 350);
}

const NEGATIVE =
  "watermark, text overlay, blurry, noisy, photo, realistic, 3d render, " +
  "low quality, distorted, dark background, cluttered, multiple logos, border, frame, " +
  "people, face, hands, nsfw";

// ── 1. Puter.js — Native Cloud OS Image Gen ──────────────────────────────────
async function tryPuter(prompt) {
  if (!window.puter) throw new Error("Puter.js not loaded");
  const imgElement = await window.puter.ai.txt2img(prompt);
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.naturalWidth || imgElement.width || 1024;
  canvas.height = imgElement.naturalHeight || imgElement.height || 1024;
  canvas.getContext('2d').drawImage(imgElement, 0, 0);
  return canvas.toDataURL("image/png");
}

// ── 2. Pollinations.ai — FREE, no API key, FLUX model ────────────────────────
async function tryPollinations(prompt) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=1024&height=1024` +
    `&seed=${Math.floor(Math.random() * 999999)}` +
    `&model=flux` +
    `&nologo=true` +
    `&enhance=false` +
    `&negative=${encodeURIComponent(NEGATIVE)}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(35000) });
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);

  const blob = await res.blob();
  if (!blob || blob.size < 3000) throw new Error("Pollinations: empty response");

  return await blobToDataUrl(blob);
}

// ── 2. Gemini (via /api/gemini-image proxy) ───────────────────────────────────
async function tryGemini(prompt) {
  const res = await fetch("/api/gemini-image", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini: ${data.error || res.status}`);
  if (!data.imageBase64) throw new Error("Gemini: no image in response");
  return `data:${data.mimeType ?? "image/png"};base64,${data.imageBase64}`;
}

// ── 3. Stability AI v2beta (via /api/stability-image proxy) ──────────────────
async function tryStability(prompt) {
  const res = await fetch("/api/stability-image", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ prompt, negative_prompt: NEGATIVE }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stability: ${data.error || res.status}`);
  if (!data.imageBase64) throw new Error("Stability: no image in response");
  return `data:image/png;base64,${data.imageBase64}`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });
}

function makePlaceholderSVG(brandName, style) {
  const palettes = {
    "Minimal Icon":   ["#7C4DFF","#5E35B1"],
    "Wordmark":       ["#F050A8","#AD1457"],
    "Badge / Emblem": ["#FFB300","#E65100"],
    "Abstract Mark":  ["#00C9B4","#006064"],
  };
  const [c1, c2] = palettes[style] || ["#7C4DFF","#F050A8"];
  const label = brandName || style;
  const initials = label.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).filter(Boolean).join("") || "BC";

  const inner = {
    "Minimal Icon":
      `<rect x="178" y="178" width="156" height="156" rx="28" fill="url(#g)" transform="rotate(45 256 256)"/>`,
    "Wordmark":
      `<text x="256" y="290" font-size="110" font-weight="900" text-anchor="middle" fill="url(#g)" font-family="Georgia,serif">${initials}</text>`,
    "Badge / Emblem":
      `<circle cx="256" cy="256" r="160" fill="none" stroke="url(#g)" stroke-width="12"/>
       <circle cx="256" cy="256" r="130" fill="none" stroke="url(#g)" stroke-width="3"/>
       <text x="256" y="270" font-size="70" font-weight="900" text-anchor="middle" fill="url(#g)" font-family="Arial,sans-serif">${initials}</text>`,
    "Abstract Mark":
      `<polygon points="256,90 400,390 112,390" fill="none" stroke="url(#g)" stroke-width="18" stroke-linejoin="round"/>
       <text x="256" y="290" font-size="52" font-weight="700" text-anchor="middle" fill="url(#g)" font-family="Arial,sans-serif" opacity="0.5">${initials}</text>`,
  };

  const brandLabel = brandName
    ? `<text x="256" y="470" font-size="28" text-anchor="middle" fill="${c1}" font-family="Fredoka One, Arial, sans-serif" font-weight="600">${brandName.slice(0,18)}</text>`
    : "";

  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#ffffff"/>
  ${inner[style] || inner["Minimal Icon"]}
  ${brandLabel}
</svg>`;

  return new Promise(resolve => {
    const blob   = new Blob([svg], { type: "image/svg+xml" });
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ── Master export ─────────────────────────────────────────────────────────────
// prompt  = pre-built string from buildLogoPrompt()
// style   = "Minimal Icon" | "Wordmark" | "Badge / Emblem" | "Abstract Mark"
// brandName = raw name string for placeholder fallback label
export async function generateLogoImage(prompt, onStatus, style = "Minimal Icon", brandName = "") {
  const providers = [
    { name: "Puter AI",            fn: () => tryPuter(prompt)        },
    { name: "Pollinations (FLUX)", fn: () => tryPollinations(prompt) },
    { name: "Gemini",              fn: () => tryGemini(prompt)       },
    { name: "Stability AI",        fn: () => tryStability(prompt)    },
  ];

  const errors = [];
  for (const p of providers) {
    try {
      onStatus?.(`⚡ ${p.name}…`);
      const result = await p.fn();
      onStatus?.(`✓ ${p.name}`);
      return result;
    } catch (e) {
      console.warn(`[Logo] ${p.name} failed:`, e.message);
      errors.push(`${p.name}: ${e.message}`);
      onStatus?.(`↳ trying next…`);
    }
  }

  console.warn("[Logo] All providers failed:", errors.join(" | "));
  onStatus?.("⚠ placeholder — check API keys");
  return makePlaceholderSVG(brandName, style);
}
