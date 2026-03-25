import { useState } from "react";
import { puterAIJSON, puterAI } from "../utils/puter";
import { callAIJSON } from "../utils/api";
import { SkeletonCard } from "./UI";
import { PageShell } from "./PageShell";

// ─── Helper: call AI with Puter.js first, fallback to callAIJSON ─────────────
async function smartAIJSON(sys, user) {
  try { return await puterAIJSON(sys, user); } catch {
    return await callAIJSON(sys, user);
  }
}

// ─── Domain Checker ───────────────────────────────────────────────────────────
function DomainCheckerTool({ brandProfile }) {
  const [query, setQuery] = useState(brandProfile?.brandName || "");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await smartAIJSON(
        `You are a domain availability advisor. Return JSON with:
{
  "baseName": "<cleaned domain base>",
  "suggestions": [
    { "domain": "<full domain e.g. brandname.com>", "available": true|false, "price": "<estimated price e.g. $12/yr>", "tip": "<one sentence tip>", "tld": ".com" },
    ...10 items total covering .com .io .co .app .store .brand .ai .studio .shop .design
  ],
  "alternatives": ["<3 alternative brand names that have better domain availability>"],
  "seoScore": <0-100>,
  "memorability": <0-100>
}`,
        `Brand/keyword: "${query}". Business context: ${JSON.stringify(brandProfile || {})}`
      );
      setResults(data);
    } catch { }
    setLoading(false);
  };

  const scoreColor = (v) =>
    v >= 75 ? "#00C9B4" : v >= 50 ? "#FFAD00" : "#F050A8";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🌐 Domain Checker</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Find the perfect domain for your brand — powered by Puter.js AI.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          className="input-base"
          style={{ flex: 1 }}
          placeholder="Enter your brand name or keyword…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
        />
        <button className="btn-primary" onClick={check} disabled={loading || !query.trim()}>
          {loading ? "Checking…" : "Check Domains"}
        </button>
      </div>

      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={2} />)}</div>}

      {results && !loading && (
        <>
          {/* Scores */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "SEO Score", value: results.seoScore, icon: "🔍" },
              { label: "Memorability", value: results.memorability, icon: "🧠" },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: "center", padding: "16px 20px" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: scoreColor(s.value), fontFamily: "Fredoka One" }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Domain list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {(results.suggestions || []).map((d, i) => (
              <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                  background: d.available ? "#00C9B4" : "#F050A8",
                  boxShadow: d.available ? "0 0 8px rgba(0,201,180,0.5)" : "0 0 8px rgba(240,80,168,0.4)",
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", fontFamily: "monospace" }}>{d.domain}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{d.tip}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: d.available ? "var(--teal)" : "var(--text3)" }}>
                    {d.available ? d.price : "Taken"}
                  </div>
                  <div style={{ fontSize: 10, color: d.available ? "var(--teal)" : "var(--pink)", fontWeight: 700 }}>
                    {d.available ? "✓ Available" : "✗ Registered"}
                  </div>
                </div>
                {d.available && (
                  <a href={`https://namecheap.com/domains/registration/results/?domain=${d.domain}`} target="_blank" rel="noreferrer"
                    style={{ padding: "6px 14px", borderRadius: 8, background: "var(--teal-glow)", border: "1px solid var(--teal)", color: "var(--teal)", fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                    Register →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Alternatives */}
          {results.alternatives?.length > 0 && (
            <div className="card" style={{ padding: "16px 20px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 10 }}>💡 Alternative Brand Names</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {results.alternatives.map((a, i) => (
                  <button key={i} onClick={() => setQuery(a)}
                    style={{ padding: "7px 16px", borderRadius: 99, border: "1.5px solid rgba(124,77,255,0.25)", background: "rgba(124,77,255,0.06)", color: "var(--violet)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Steal This Brand ─────────────────────────────────────────────────────────
function StealThisBrandTool({ brandProfile }) {
  const [competitor, setCompetitor] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!competitor.trim()) return;
    setLoading(true);
    try {
      const isUrlOrImage = competitor.startsWith("http");

      const data = await smartAIJSON(
        `You are a brand strategist. Analyze the given competitor brand name, website URL, or image reference. Deduce their visual style (colors/fonts) and ideology. Return JSON:
{
  "brandName": "<name>",
  "positioning": "<2-sentence positioning statement>",
  "colorPsychology": "<what their colors communicate - specifically guess their hex codes and font style if it's a URL/Image>",
  "voiceTone": "<their voice/tone style>",
  "targetAudience": "<their target audience>",
  "strengths": ["<3 brand strengths>"],
  "weaknesses": ["<3 brand weaknesses>"],
  "opportunities": ["<3 opportunities to differentiate from them>"],
  "swipeables": [
    { "element": "<e.g., 'minimalist typography' or 'playful copy'>", "adaptation": "<how my brand can use it>" }
  ],
  "differentiators": ["<3 ways to stand out vs them>"],
  "estimatedBrandScore": <0-100>
}`,
        `Competitor Source: "${competitor}". My brand context: ${JSON.stringify(brandProfile || {})}. Note: if source is a URL/Image, vividly extrapolate their visual aesthetics and ideology based on what that entity generally represents online.`
      );
      setResult(data);
    } catch { }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🕵️ Steal This Brand</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Analyze any competitor brand, website link, or image URL — and extract their visual DNA, colors, and ideology into your strategy.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          className="input-base"
          style={{ flex: 1 }}
          placeholder="Brand name, Website link (e.g. nike.com), or Image URL…"
          value={competitor}
          onChange={e => setCompetitor(e.target.value)}
          onKeyDown={e => e.key === "Enter" && analyze()}
        />
        <button className="btn-primary" onClick={analyze} disabled={loading || !competitor.trim()}>
          {loading ? "Analyzing…" : "Analyze Inspiration"}
        </button>
      </div>

      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>}

      {result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header */}
          <div className="card" style={{ padding: "20px 24px", background: "linear-gradient(135deg, rgba(124,77,255,0.08), rgba(240,80,168,0.05))" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontFamily: "Fredoka One", fontSize: 22, color: "var(--text)" }}>{result.brandName}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--violet)", fontFamily: "Fredoka One" }}>{result.estimatedBrandScore}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Brand Score</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, marginBottom: 10 }}>{result.positioning}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(0,201,180,0.1)", border: "1px solid rgba(0,201,180,0.25)", fontSize: 12, fontWeight: 700, color: "var(--teal)" }}>🎯 {result.targetAudience}</span>
              <span style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(124,77,255,0.08)", border: "1px solid rgba(124,77,255,0.2)", fontSize: 12, fontWeight: 700, color: "var(--violet)" }}>🎙️ {result.voiceTone}</span>
            </div>
          </div>

          {/* SWOT-style grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { title: "💪 Strengths", items: result.strengths, color: "#00C9B4" },
              { title: "⚠️ Weaknesses", items: result.weaknesses, color: "#FFAD00" },
              { title: "🚀 Opportunities", items: result.opportunities, color: "#7C4DFF" },
              { title: "🎯 Differentiators", items: result.differentiators, color: "#F050A8" },
            ].map(g => (
              <div key={g.title} className="card" style={{ padding: "16px 18px" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: g.color, marginBottom: 10 }}>{g.title}</div>
                {(g.items || []).map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                    <span style={{ color: g.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Swipeables */}
          {result.swipeables?.length > 0 && (
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 14 }}>✂️ What to Swipe (Ethically)</div>
              {result.swipeables.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, padding: "12px 14px", background: "rgba(124,77,255,0.04)", borderRadius: 12, border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 3 }}>{s.element}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{s.adaptation}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Brand Story ──────────────────────────────────────────────────────────────
function BrandStoryTool({ brandProfile, onOutput }) {
  const [style, setStyle] = useState("Origin Story");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = ["Origin Story", "Problem-Solution", "Hero's Journey", "Why We Exist", "Vision Letter", "Manifesto"];

  const generate = async () => {
    setLoading(true);
    setStory("");
    try {
      let full = "";
      await puterAI(
        `You are a brand storyteller. Write a compelling ${style} for this brand. Write in 3-4 paragraphs. Be emotional, specific, and authentic. Use "we" voice. No bullet points — only prose narrative.`,
        `Brand profile: ${JSON.stringify(brandProfile || {})}`
        , (text) => { setStory(text); full = text; }
      );
      onOutput?.("Brand Story", full.slice(0, 80) + "…");
    } catch {
      // fallback
      const r = await callAIJSON(
        "You are a brand storyteller. Return JSON with 'story' field containing a 3-paragraph brand narrative.",
        `Style: ${style}. Brand: ${JSON.stringify(brandProfile || {})}`
      );
      if (r.story) { setStory(r.story); onOutput?.("Brand Story", r.story.slice(0, 80) + "…"); }
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>📖 Brand Story</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Generate a compelling narrative that defines who you are.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {styles.map(s => (
          <button key={s} onClick={() => setStyle(s)}
            style={{ padding: "8px 16px", borderRadius: 99, border: `1.5px solid ${style === s ? "var(--violet)" : "var(--border)"}`, background: style === s ? "var(--violet-soft)" : "transparent", color: style === s ? "var(--violet)" : "var(--text2)", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.18s" }}>
            {s}
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? "Writing your story…" : `✍️ Generate ${style}`}
      </button>

      {(story || loading) && (
        <div className="card" style={{ padding: "24px 28px" }}>
          {loading && !story && <SkeletonCard lines={6} />}
          {story && (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--violet)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>{style}</div>
              <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.85, whiteSpace: "pre-wrap", fontWeight: 500 }}>{story}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => navigator.clipboard.writeText(story)} className="btn-ghost" style={{ fontSize: 12 }}>📋 Copy</button>
                <button onClick={generate} className="btn-ghost" style={{ fontSize: 12 }}>🔄 Regenerate</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Market Research ───────────────────────────────────────────────────────────
function MarketResearchTool({ brandProfile, onOutput }) {
  const [topic, setTopic] = useState(brandProfile?.industry || "");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await callAIJSON(
        `You are a top-tier market research analyst. Return JSON:
{
  "marketSize": "<e.g. TAM, SAM, SOM estimates with brief context>",
  "trends": ["<3 emerging trends in this space>"],
  "behaviors": ["<3 key customer behaviors/expectations>"],
  "challenges": ["<2 biggest industry challenges>"],
  "opportunity": "<1-sentence summary of the biggest gap in the market>"
}`,
        `Analyze the market for: "${topic}". Brand Context: ${JSON.stringify(brandProfile || {})}`
      );
      setReport(data);
      onOutput?.("Market Research", `Research for: ${topic}`);
    } catch { }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>📈 Market Research</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Get AI-driven insights on market size, trends, and consumer behaviors.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          className="input-base"
          style={{ flex: 1 }}
          placeholder="Enter your industry or niche (e.g. Sustainable Fashion)…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
        />
        <button className="btn-primary" onClick={generate} disabled={loading || !topic.trim()}>
          {loading ? "Researching…" : "Generate Report"}
        </button>
      </div>

      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>}

      {report && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Opportunity Highlight */}
          <div className="card" style={{ padding: "20px 24px", background: "linear-gradient(135deg, rgba(0,201,180,0.1), rgba(124,77,255,0.05))", border: "1.5px solid rgba(0,201,180,0.3)" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>💎 Biggest Opportunity</div>
            <div style={{ fontSize: 16, color: "var(--text)", fontFamily: "Fredoka One", lineHeight: 1.4 }}>{report.opportunity}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Market Size */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--violet)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>🌍 Market Size Estimate</div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{report.marketSize}</p>
            </div>

            {/* Key Trends */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>🔥 Emerging Trends</div>
              <ul style={{ paddingLeft: 16, margin: 0, color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>
                {(report.trends || []).map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
              </ul>
            </div>

            {/* Behaviors */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#FFAD00", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>👥 Consumer Behaviors</div>
              <ul style={{ paddingLeft: 16, margin: 0, color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>
                {(report.behaviors || []).map((b, i) => <li key={i} style={{ marginBottom: 6 }}>{b}</li>)}
              </ul>
            </div>

            {/* Challenges */}
            <div className="card" style={{ padding: "20px 24px", background: "rgba(255,107,107,0.03)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#FF6B6B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>⚠️ Industry Challenges</div>
              <ul style={{ paddingLeft: 16, margin: 0, color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>
                {(report.challenges || []).map((c, i) => <li key={i} style={{ marginBottom: 6 }}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Growth Hacker ───────────────────────────────────────────────────────────
function GrowthHackerTool({ brandProfile, onOutput }) {
  const [goal, setGoal] = useState("User Acquisition");
  const [strategies, setStrategies] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await smartAIJSON(
        `You are an elite growth hacker. Generate 3 unconventional, highly effective growth hacking strategies. Return JSON:
{
  "strategies": [
    { "name": "<catchy strategy name>", "description": "<how it works in 2 sentences>", "difficulty": "Low|Medium|High", "impact": "Medium|High|Massive", "steps": ["<step 1>", "<step 2>", "<step 3>"] }
  ]
}`,
        `Brand: ${JSON.stringify(brandProfile || {})}. Goal: ${goal}. Focus on creative, low-budget, high-impact growth tactics.`
      );
      setStrategies(data.strategies);
      onOutput?.("Growth Hacker", data.strategies?.[0]?.name);
    } catch { }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🚀 Growth Hacker</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Unconventional tactics to scale your brand fast.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <select className="select-base" style={{ flex: 1, minWidth: 200 }} value={goal} onChange={e => setGoal(e.target.value)}>
          {["User Acquisition", "Viral Word-of-Mouth", "Retention & Loyalty", "Revenue Expansion", "Social Media Explosive Growth"].map(g => <option key={g}>{g}</option>)}
        </select>
        <button className="btn-primary" onClick={generate} disabled={loading}>
          {loading ? "Hacking Growth…" : "Generate Strategies"}
        </button>
      </div>

      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>}

      {strategies && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {strategies.map((s, i) => (
            <div key={i} className="card" style={{ padding: "20px 24px", borderLeft: `4px solid ${i % 2 === 0 ? "var(--teal)" : "var(--pink)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontFamily: "Fredoka One", fontSize: 18, color: "var(--text)" }}>{s.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "var(--bg2)", color: "var(--text2)", border: "1px solid var(--border)" }}>Diff: {s.difficulty}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "var(--teal-glow)", color: "var(--teal)", border: "1px solid var(--teal)" }}>Impact: {s.impact}</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, marginBottom: 14 }}>{s.description}</p>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Action Plan</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(s.steps || []).map((step, si) => (
                  <div key={si} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--violet-soft)", color: "var(--violet)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{si + 1}</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Discover Page ─────────────────────────────────────────────────────────────
export function DiscoverPage({ brandProfile, onOutput }) {
  const [tool, setTool] = useState("domain");

  const tools = [
    { id: "domain", label: "Domain Checker", emoji: "🌐" },
    { id: "steal", label: "Steal This Brand", emoji: "🕵️" },
    { id: "story", label: "Brand Story", emoji: "📖" },
    { id: "market", label: "Market Research", emoji: "📈" },
    { id: "growth", label: "Growth Hacker", emoji: "🚀" },
  ];

  return (
    <PageShell title="Discover 🔍" subtitle="Research, explore, and lay the groundwork for your brand.">
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {tools.map(t => (
          <button key={t.id} onClick={() => setTool(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", borderRadius: 12, border: "1.5px solid",
              borderColor: tool === t.id ? "var(--violet)" : "var(--border)",
              background: tool === t.id ? "var(--violet-soft)" : "transparent",
              color: tool === t.id ? "var(--violet)" : "var(--text2)",
              fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.18s",
            }}>
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      {tool === "domain" && <DomainCheckerTool brandProfile={brandProfile} />}
      {tool === "steal" && <StealThisBrandTool brandProfile={brandProfile} />}
      {tool === "story" && <BrandStoryTool brandProfile={brandProfile} onOutput={onOutput} />}
      {tool === "market" && <MarketResearchTool brandProfile={brandProfile} onOutput={onOutput} />}
      {tool === "growth" && <GrowthHackerTool brandProfile={brandProfile} onOutput={onOutput} />}
    </PageShell>
  );
}
