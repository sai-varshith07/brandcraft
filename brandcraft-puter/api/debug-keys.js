module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    groq:      process.env.GROQ_API_KEY      ? "✓ set" : "✗ missing",
    gemini:    process.env.GEMINI_API_KEY    ? "✓ set" : "✗ missing",
    stability: process.env.STABILITY_API_KEY ? "✓ set" : "✗ missing",
  });
};
