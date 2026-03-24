import { useState, useEffect } from "react";
import { puterAIJSON, puterAI } from "../utils/puter";
import { callAIJSON } from "../utils/api";
import { SkeletonCard } from "./UI";
import { PageShell } from "./PageShell";

async function smartAIJSON(sys, user) {
  try { return await puterAIJSON(sys, user); } catch {
    return await callAIJSON(sys, user);
  }
}

// ─── Consistency Checker ──────────────────────────────────────────────────────
function ConsistencyCheckerTool({ brandProfile, selectedOutputs }) {
  const [text, setText]     = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await smartAIJSON(
        `You are a brand consistency expert. Analyze the provided content against the brand profile and return JSON:
{
  "overallScore": <0-100>,
  "voiceMatch": <0-100>,
  "toneMatch": <0-100>,
  "audienceMatch": <0-100>,
  "issues": [{ "type": "warning"|"error", "field": "<what area>", "issue": "<description>", "fix": "<suggested fix>" }],
  "strengths": ["<what's consistent>"],
  "verdict": "<1-2 sentence overall assessment>"
}`,
        `Brand profile: ${JSON.stringify(brandProfile || {})}. Content to check: "${text}"`
      );
      setResult(data);
    } catch {}
    setLoading(false);
  };

  const scoreColor = (v) => v >= 75 ? "#00C9B4" : v >= 50 ? "#FFAD00" : "#F050A8";
  const scoreGlow  = (v) => v >= 75 ? "rgba(0,201,180,0.3)" : v >= 50 ? "rgba(255,173,0,0.3)" : "rgba(240,80,168,0.3)";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🔬 Consistency Checker</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Paste any content and see how well it aligns with your brand.</p>
      </div>

      <textarea
        className="input-base"
        rows={5}
        placeholder="Paste your caption, email, ad copy, website text — anything…"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ resize: "vertical", marginBottom: 16 }}
      />
      <button className="btn-primary" onClick={check} disabled={loading || !text.trim()} style={{ marginBottom: 24 }}>
        {loading ? "Analyzing…" : "Check Consistency"}
      </button>

      {loading && <SkeletonCard lines={4} />}

      {result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Score ring */}
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 24px" }}>
            <div style={{
              width: 90, height: 90, borderRadius: "50%", flexShrink: 0,
              background: `conic-gradient(${scoreColor(result.overallScore)} 0deg ${result.overallScore * 3.6}deg, rgba(0,0,0,0.06) ${result.overallScore * 3.6}deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${scoreGlow(result.overallScore)}`,
            }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(result.overallScore), fontFamily: "Fredoka One" }}>{result.overallScore}</span>
                <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 700 }}>/ 100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Fredoka One", fontSize: 18, color: "var(--text)", marginBottom: 6 }}>Brand Consistency Score</div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{result.verdict}</p>
            </div>
          </div>

          {/* Sub-scores */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Voice", value: result.voiceMatch },
              { label: "Tone", value: result.toneMatch },
              { label: "Audience Fit", value: result.audienceMatch },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: "center", padding: "14px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: scoreColor(s.value), fontFamily: "Fredoka One" }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.7px" }}>{s.label}</div>
                <div style={{ height: 4, borderRadius: 99, background: "var(--border)", marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.value}%`, background: scoreColor(s.value), borderRadius: 99, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Issues */}
          {result.issues?.length > 0 && (
            <div className="card" style={{ padding: "18px 22px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>⚠️ Issues Found</div>
              {result.issues.map((issue, i) => (
                <div key={i} style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 10, background: issue.type === "error" ? "rgba(240,80,168,0.06)" : "rgba(255,173,0,0.06)", border: `1px solid ${issue.type === "error" ? "rgba(240,80,168,0.2)" : "rgba(255,173,0,0.2)"}` }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: issue.type === "error" ? "var(--pink)" : "#FFAD00", marginBottom: 3 }}>{issue.field}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>{issue.issue}</div>
                  <div style={{ fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>Fix: {issue.fix}</div>
                </div>
              ))}
            </div>
          )}

          {/* Strengths */}
          {result.strengths?.length > 0 && (
            <div className="card" style={{ padding: "18px 22px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--teal)", marginBottom: 10 }}>✅ What's On-Brand</div>
              {result.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--teal)", fontSize: 12, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Brand Score ──────────────────────────────────────────────────────────────
function BrandScoreTool({ brandProfile, selectedOutputs }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedCount = Object.keys(selectedOutputs || {}).length;

  const calculate = async () => {
    setLoading(true);
    try {
      const data = await smartAIJSON(
        `You are a brand strategist. Score this brand across multiple dimensions and return JSON:
{
  "overallBrandScore": <0-100>,
  "completionBonus": <0-20, based on how complete the profile is>,
  "dimensions": [
    { "name": "Clarity", "score": <0-100>, "insight": "<1 sentence>" },
    { "name": "Differentiation", "score": <0-100>, "insight": "<1 sentence>" },
    { "name": "Memorability", "score": <0-100>, "insight": "<1 sentence>" },
    { "name": "Emotional Resonance", "score": <0-100>, "insight": "<1 sentence>" },
    { "name": "Market Fit", "score": <0-100>, "insight": "<1 sentence>" },
    { "name": "Consistency Potential", "score": <0-100>, "insight": "<1 sentence>" }
  ],
  "grade": "A+"|"A"|"B+"|"B"|"C+"|"C"|"D",
  "topStrength": "<biggest brand strength>",
  "biggestRisk": "<biggest brand risk>",
  "priorityAction": "<single most impactful next action>",
  "comparablesBrands": ["<3 similar real brands for inspiration>"]
}`,
        `Brand profile: ${JSON.stringify(brandProfile || {})}. Selected assets: ${selectedCount}/7`
      );
      setResult(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { if (brandProfile) calculate(); }, [brandProfile]);

  const gradeColor = { "A+": "#00C9B4", "A": "#00C9B4", "B+": "#7C4DFF", "B": "#7C4DFF", "C+": "#FFAD00", "C": "#FFAD00", "D": "#F050A8" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>📊 Brand Score</h2>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Your full brand health report card.</p>
        </div>
        <button className="btn-ghost" onClick={calculate} disabled={loading} style={{ fontSize: 12 }}>
          {loading ? "Calculating…" : "🔄 Recalculate"}
        </button>
      </div>

      {loading && <SkeletonCard lines={5} />}

      {result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Hero score */}
          <div className="card" style={{ padding: "28px 28px", background: "linear-gradient(135deg, rgba(124,77,255,0.08), rgba(0,201,180,0.05))", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 72, fontWeight: 900, fontFamily: "Fredoka One", color: "var(--violet)", lineHeight: 1 }}>{result.overallBrandScore}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Brand Score</div>
            </div>
            <div style={{ width: 1, height: 80, background: "var(--border)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, fontWeight: 900, fontFamily: "Fredoka One", color: gradeColor[result.grade] || "var(--teal)", lineHeight: 1 }}>{result.grade}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Grade</div>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 3 }}>Top Strength</div>
                <div style={{ fontSize: 13, color: "var(--text)" }}>{result.topStrength}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 3 }}>Biggest Risk</div>
                <div style={{ fontSize: 13, color: "var(--text)" }}>{result.biggestRisk}</div>
              </div>
            </div>
          </div>

          {/* Dimension bars */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 16 }}>📈 Brand Dimensions</div>
            {(result.dimensions || []).map((d, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{d.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: d.score >= 70 ? "var(--teal)" : d.score >= 50 ? "#FFAD00" : "var(--pink)" }}>{d.score}</span>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: "var(--border)", overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${d.score}%`, borderRadius: 99, background: d.score >= 70 ? "var(--teal)" : d.score >= 50 ? "#FFAD00" : "var(--pink)", transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)", animationDelay: `${i * 0.1}s` }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{d.insight}</div>
              </div>
            ))}
          </div>

          {/* Priority action */}
          <div className="card" style={{ padding: "18px 22px", background: "linear-gradient(135deg, rgba(0,201,180,0.08), rgba(124,77,255,0.04))", border: "1.5px solid rgba(0,201,180,0.22)" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--teal)", marginBottom: 6 }}>🎯 Priority Action</div>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{result.priorityAction}</p>
          </div>

          {/* Comparable brands */}
          {result.comparablesBrands?.length > 0 && (
            <div className="card" style={{ padding: "16px 20px" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 10 }}>🔗 Brands in Your Space</div>
              <div style={{ display: "flex", gap: 8 }}>
                {result.comparablesBrands.map((b, i) => (
                  <span key={i} style={{ padding: "5px 14px", borderRadius: 99, background: "rgba(124,77,255,0.07)", border: "1px solid rgba(124,77,255,0.15)", fontSize: 12, fontWeight: 700, color: "var(--violet)" }}>{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sentiment Analysis ───────────────────────────────────────────────────────
function SentimentAnalysisTool({ brandProfile }) {
  const [text, setText]     = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await smartAIJSON(
        `You are a sentiment analysis expert. Analyze the text and return JSON:
{
  "sentiment": "positive"|"neutral"|"negative"|"mixed",
  "score": <-100 to 100>,
  "emotions": [{ "name": "<emotion>", "intensity": <0-100> }],
  "brandAlignment": <0-100>,
  "readabilityScore": <0-100>,
  "engagementPotential": <0-100>,
  "keywords": [{ "word": "<word>", "sentiment": "positive"|"negative"|"neutral" }],
  "suggestions": ["<3 improvement suggestions>"],
  "bestFor": ["<platforms/contexts this works well for>"]
}`,
        `Text: "${text}". Brand context: ${JSON.stringify(brandProfile || {})}`
      );
      setResult(data);
    } catch {}
    setLoading(false);
  };

  const sentimentIcon  = { positive: "😊", neutral: "😐", negative: "😟", mixed: "🤔" };
  const sentimentColor = { positive: "#00C9B4", neutral: "#FFAD00", negative: "#F050A8", mixed: "#7C4DFF" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>💬 Sentiment Analysis</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Understand how your content feels to readers.</p>
      </div>

      <textarea
        className="input-base"
        rows={4}
        placeholder="Paste any content — social post, ad copy, product description, tagline…"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ resize: "vertical", marginBottom: 16 }}
      />
      <button className="btn-primary" onClick={analyze} disabled={loading || !text.trim()} style={{ marginBottom: 24 }}>
        {loading ? "Analyzing…" : "Analyze Sentiment"}
      </button>

      {loading && <SkeletonCard lines={4} />}

      {result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Main sentiment */}
          <div className="card" style={{ display: "flex", gap: 20, alignItems: "center", padding: "20px 24px", background: `rgba(${result.sentiment === "positive" ? "0,201,180" : result.sentiment === "negative" ? "240,80,168" : "124,77,255"},0.06)` }}>
            <div style={{ fontSize: 48 }}>{sentimentIcon[result.sentiment] || "🤔"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Fredoka One", fontSize: 20, color: sentimentColor[result.sentiment], textTransform: "capitalize", marginBottom: 4 }}>{result.sentiment}</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>Sentiment score: <strong style={{ color: sentimentColor[result.sentiment] }}>{result.score > 0 ? "+" : ""}{result.score}</strong></div>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Brand Alignment", value: result.brandAlignment, icon: "🎯" },
              { label: "Readability", value: result.readabilityScore, icon: "📖" },
              { label: "Engagement", value: result.engagementPotential, icon: "⚡" },
            ].map(m => (
              <div key={m.label} className="card" style={{ textAlign: "center", padding: "14px" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: m.value >= 70 ? "var(--teal)" : m.value >= 50 ? "#FFAD00" : "var(--pink)", fontFamily: "Fredoka One" }}>{m.value}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.7px" }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Emotions */}
          {result.emotions?.length > 0 && (
            <div className="card" style={{ padding: "18px 22px" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 12 }}>🌊 Emotions Detected</div>
              {result.emotions.map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 80, fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>{e.name}</div>
                  <div style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${e.intensity}%`, borderRadius: 99, background: "linear-gradient(90deg, var(--violet), var(--pink))" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", width: 28, textAlign: "right" }}>{e.intensity}</div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="card" style={{ padding: "18px 22px" }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 10 }}>💡 Suggestions</div>
              {result.suggestions.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: "var(--violet)", fontSize: 12, marginTop: 2 }}>{i + 1}.</span>
                  <span style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Manage Page ──────────────────────────────────────────────────────────────
export function ManagePage({ brandProfile, selectedOutputs }) {
  const [tool, setTool] = useState("score");

  const tools = [
    { id: "score",       label: "Brand Score",          emoji: "📊" },
    { id: "consistency", label: "Consistency Checker",  emoji: "🔬" },
    { id: "sentiment",   label: "Sentiment Analysis",   emoji: "💬" },
    { id: "finance",     label: "Financial Calculator", emoji: "🧮" },
  ];

  return (
    <PageShell title="Manage 📋" subtitle="Track, analyze, and improve your brand performance.">
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

      {tool === "score"       && <BrandScoreTool brandProfile={brandProfile} selectedOutputs={selectedOutputs} />}
      {tool === "consistency" && <ConsistencyCheckerTool brandProfile={brandProfile} selectedOutputs={selectedOutputs} />}
      {tool === "sentiment"   && <SentimentAnalysisTool brandProfile={brandProfile} />}
      {tool === "finance"     && <FinancialCalculatorTool />}
    </PageShell>
  );
}

// ─── Financial Calculator ──────────────────────────────────────────────────────
function FinancialCalculatorTool() {
  const [traffic, setTraffic] = useState(10000);
  const [conversion, setConversion] = useState(2.5);
  const [price, setPrice] = useState(49);
  const [adSpend, setAdSpend] = useState(1000);
  const [fixedCosts, setFixedCosts] = useState(500);

  // Calculations
  const customers = Math.round(traffic * (conversion / 100));
  const revenue = customers * price;
  const cac = customers > 0 ? (adSpend / customers) : 0;
  const totalCosts = fixedCosts + adSpend;
  const profit = revenue - totalCosts;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🧮 Financial Projection Calculator</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Model your brand's unit economics and forecast monthly profitability.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {/* Sliders Input Panel */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>Assumptions</div>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>Monthly Traffic</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--teal)" }}>{formatNumber(traffic)} users</span>
            </div>
            <input type="range" min="100" max="100000" step="100" value={traffic} onChange={e => setTraffic(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--teal)" }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>Conversion Rate</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--teal)" }}>{conversion}%</span>
            </div>
            <input type="range" min="0.1" max="15" step="0.1" value={conversion} onChange={e => setConversion(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--teal)" }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>Average Order / Deal Size</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--teal)" }}>{formatCurrency(price)}</span>
            </div>
            <input type="range" min="1" max="2000" step="1" value={price} onChange={e => setPrice(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--teal)" }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>Monthly Ad Spend</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--pink)" }}>{formatCurrency(adSpend)}</span>
            </div>
            <input type="range" min="0" max="20000" step="100" value={adSpend} onChange={e => setAdSpend(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--pink)" }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>Fixed Costs (Tools, Hosting, etc)</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--pink)" }}>{formatCurrency(fixedCosts)}</span>
            </div>
            <input type="range" min="0" max="10000" step="50" value={fixedCosts} onChange={e => setFixedCosts(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--pink)" }} />
          </div>
        </div>

        {/* Results Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          <div className="card" style={{ padding: "24px", background: "linear-gradient(135deg, rgba(124,77,255,0.08), rgba(0,201,180,0.05))", border: "1.5px solid rgba(124,77,255,0.2)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--violet)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Total Revenue</div>
            <div style={{ fontSize: 42, color: "var(--text)", fontFamily: "Fredoka One", lineHeight: 1 }}>{formatCurrency(revenue)}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(124,77,255,0.15)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase" }}>New Customers</div>
                <div style={{ fontSize: 18, color: "var(--text)", fontWeight: 800, fontFamily: "Nunito" }}>{formatNumber(customers)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase" }}>Avg CAC</div>
                <div style={{ fontSize: 18, color: "var(--text)", fontWeight: 800, fontFamily: "Nunito" }}>{formatCurrency(cac)}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Total Costs</div>
              <div style={{ fontSize: 24, color: "var(--text)", fontFamily: "Fredoka One" }}>{formatCurrency(totalCosts)}</div>
            </div>
            
            <div className="card" style={{ padding: "20px", background: profit >= 0 ? "rgba(0,201,180,0.08)" : "rgba(255,107,107,0.08)", border: `1.5px solid ${profit >= 0 ? "rgba(0,201,180,0.3)" : "rgba(255,107,107,0.3)"}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: profit >= 0 ? "var(--teal)" : "#FF6B6B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{profit >= 0 ? "Net Profit" : "Net Loss"}</div>
              <div style={{ fontSize: 24, color: "var(--text)", fontFamily: "Fredoka One" }}>{formatCurrency(profit)}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: profit >= 0 ? "var(--teal)" : "#FF6B6B", marginTop: 4 }}>{margin}% Margin</div>
            </div>
          </div>

          {/* Quick insights */}
          {profit < 0 ? (
             <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,179,0,0.1)", border: "1px solid rgba(255,179,0,0.3)", display: "flex", gap: 12, alignItems: "center" }}>
               <span style={{ fontSize: 20 }}>⚠️</span>
               <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>Your customer acquisition cost ({formatCurrency(cac)}) is too high relative to your price ({formatCurrency(price)}). Either increase conversion/price or lower ad spend.</div>
             </div>
          ) : (
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(0,201,180,0.1)", border: "1px solid rgba(0,201,180,0.3)", display: "flex", gap: 12, alignItems: "center" }}>
               <span style={{ fontSize: 20 }}>🌱</span>
               <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>Profitable economics! For every $1 spent on ads, you generate {adSpend > 0 ? formatCurrency(revenue / adSpend) : "infinite"} in revenue. Focus on scaling traffic.</div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
