const fetch   = require("node-fetch");
const FormData = require("form-data");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const STABILITY_KEY = process.env.STABILITY_API_KEY;
  if (!STABILITY_KEY) return res.status(500).json({ error: "STABILITY_API_KEY not configured in Vercel environment variables" });

  const { prompt, negative_prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const form = new FormData();
    form.append("prompt",        prompt);
    form.append("output_format", "png");
    form.append("aspect_ratio",  "1:1");
    if (negative_prompt) form.append("negative_prompt", negative_prompt);

    const stabRes = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method:  "POST",
      headers: { ...form.getHeaders(), "Authorization": `Bearer ${STABILITY_KEY}`, "Accept": "image/*" },
      body:    form,
    });

    if (!stabRes.ok) {
      const errText = await stabRes.text();
      return res.status(stabRes.status).json({ error: `Stability error: ${errText.slice(0, 200)}` });
    }

    const imgBuffer = await stabRes.buffer();
    return res.json({ imageBase64: imgBuffer.toString("base64") });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
