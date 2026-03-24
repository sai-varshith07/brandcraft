const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const FormData = require("form-data");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const GROQ_KEY = process.env.GROQ_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const STABILITY_KEY = process.env.STABILITY_API_KEY;
const isProduction = process.env.NODE_ENV === "production";

// Serve static files in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, "build")));
}

// ── Groq chat proxy ──────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
      body: JSON.stringify(req.body),
    });
    if (req.body.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      groqRes.body.pipe(res);
    } else {
      res.json(await groqRes.json());
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Gemini Imagen 3 image generation ────────────────────────────────────────
app.post("/api/gemini-image", async (req, res) => {
  if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set in .env" });
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const imagenRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_only_high",
            personGeneration: "allow_adult",
          },
        }),
      }
    );

    const imagenData = await imagenRes.json();

    if (imagenRes.ok && imagenData?.predictions?.[0]?.bytesBase64Encoded) {
      return res.json({
        imageBase64: imagenData.predictions[0].bytesBase64Encoded,
        mimeType: imagenData.predictions[0].mimeType ?? "image/png",
      });
    }

    console.warn("Imagen 3 failed, trying gemini-2.0-flash-preview-image-generation");

    const gemRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );

    const gemData = await gemRes.json();
    if (!gemRes.ok) {
      return res.status(gemRes.status).json({ error: gemData?.error?.message || "Gemini API error" });
    }

    const parts = gemData?.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find(p => p.inlineData?.data);
    if (!imgPart) {
      return res.status(502).json({
        error: "Gemini returned no image — check your API key has image generation enabled",
        modelText: parts.find(p => p.text)?.text ?? null,
      });
    }

    return res.json({
      imageBase64: imgPart.inlineData.data,
      mimeType: imgPart.inlineData.mimeType ?? "image/png",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Stability AI v2beta Core image generation ────────────────────────────────
app.post("/api/stability-image", async (req, res) => {
  if (!STABILITY_KEY) return res.status(500).json({ error: "STABILITY_API_KEY not set in .env" });
  const { prompt, negative_prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "png");
    form.append("aspect_ratio", "1:1");
    if (negative_prompt) form.append("negative_prompt", negative_prompt);

    const stabRes = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          ...form.getHeaders(),
          "Authorization": `Bearer ${STABILITY_KEY}`,
          "Accept": "image/*",
        },
        body: form,
      }
    );

    if (!stabRes.ok) {
      const errText = await stabRes.text();
      return res.status(stabRes.status).json({ error: `Stability v2beta error: ${errText.slice(0, 200)}` });
    }

    const imgBuffer = await stabRes.buffer();
    const b64 = imgBuffer.toString("base64");
    return res.json({ imageBase64: b64 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Debug endpoint to check API keys
app.get("/api/debug-keys", (req, res) => {
  res.json({
    groq: GROQ_KEY ? "✓ set" : "✗ missing",
    gemini: GEMINI_KEY ? "✓ set" : "✗ missing",
    stability: STABILITY_KEY ? "✓ set" : "✗ missing",
  });
});

// Catch-all for SPA routing in production
if (isProduction) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ BrandCraft ${isProduction ? "production" : "development"} server running on http://localhost:${PORT}`);
  console.log(`   Groq key:     ${GROQ_KEY ? "✓ set" : "✗ missing — add GROQ_API_KEY to .env"}`);
  console.log(`   Gemini key:    ${GEMINI_KEY ? "✓ set" : "✗ missing — add GEMINI_API_KEY to .env"}`);
  console.log(`   Stability key: ${STABILITY_KEY ? "✓ set" : "✗ missing — add STABILITY_API_KEY to .env"}`);
});

