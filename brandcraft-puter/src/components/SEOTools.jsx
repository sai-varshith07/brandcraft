import { useState, useEffect } from "react";
import { callAIJSON } from "../utils/api";
import { puterAIJSON } from "../utils/puter";
import { SkeletonCard } from "./UI";
import { PageShell } from "./PageShell";

async function smartAIJSON(sys, user) {
    try { return await puterAIJSON(sys, user); } catch {
        return await callAIJSON(sys, user);
    }
}

// ─── SEO Analyzer ──────────────────────────────────────────────────────────
function SEOAnalyzerTool({ brandProfile }) {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const analyze = async () => {
        if (!url.trim()) return;
        setLoading(true);
        setShowDetails(false);
        try {
            const data = await smartAIJSON(
                `You are an expert SEO analyzer. Provide a mock SEO analysis for the given URL based on standard best practices. Return JSON:
{
  "score": <0-100>,
  "performance": <0-100>,
  "accessibility": <0-100>,
  "bestPractices": <0-100>,
  "seo": <0-100>,
  "missingTags": ["<tag1>", "<tag2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>"],
  "performanceIssues": ["<issue1>", "<issue2>"],
  "seoIssues": ["<seo1>", "<seo2>"]
}`,
                `Analyze URL: ${url}. Brand Context: ${JSON.stringify(brandProfile || {})}. Provide detailed analysis.`
            );
            setResult(data);
            setTimeout(() => setShowDetails(true), 500);
        } catch { }
        setLoading(false);
    };

    const getScoreColor = (score) => score >= 90 ? "#00C9B4" : score >= 50 ? "#FFAD00" : "#F050A8";
    const getScoreLabel = (score) => score >= 90 ? "Excellent" : score >= 50 ? "Good" : "Needs Improvement";

    return (
        <div className="seo-analyzer">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="hover-glow" style={{ fontSize: 28 }}>📈</span>
                    SEO Analyzer
                </h2>
                <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
                    Analyze any URL for SEO performance, identify missing optimizations, and get actionable improvement suggestions.
                </p>
            </div>

            {/* Input Section */}
            <div className="card" style={{ padding: "24px", marginBottom: 24, background: "linear-gradient(135deg, rgba(63, 81, 181, 0.05), rgba(124, 77, 255, 0.05))" }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "280px" }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 8, display: "block" }}>
                            Website URL
                        </label>
                        <input
                            className="input-base"
                            style={{ flex: 1 }}
                            placeholder="https://yoursite.com"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && analyze()}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <button className="btn-primary" onClick={analyze} disabled={loading || !url.trim()} style={{ height: "48px" }}>
                            {loading ? (
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                                    Analyzing...
                                </span>
                            ) : (
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>🔍</span> Analyze URL
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                    <SkeletonCard lines={8} />
                    <SkeletonCard lines={6} />
                </div>
            )}

            {result && !loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Main Score Card */}
                    <div className="card" style={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr",
                        gap: 24,
                        padding: "32px",
                        background: "linear-gradient(135deg, rgba(63, 81, 181, 0.05), rgba(124, 77, 255, 0.05))",
                        border: "1.5px solid rgba(63, 81, 181, 0.2)",
                        boxShadow: "0 20px 50px rgba(63, 81, 181, 0.15)",
                        animation: "float 6s ease-in-out infinite"
                    }}>
                        <div style={{ position: "relative", width: "100%", height: "200px" }}>
                            <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="12" />
                                <circle cx="100" cy="100" r="90" fill="none" stroke={getScoreColor(result.score)} strokeWidth="12"
                                    strokeDasharray={2 * Math.PI * 90}
                                    strokeDashoffset={(2 * Math.PI * 90) * (1 - result.score / 100)}
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dashoffset 1.5s ease" }} />
                            </svg>
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }}>
                                <span style={{
                                    fontSize: 42,
                                    fontWeight: 900,
                                    fontFamily: "Fredoka One",
                                    color: getScoreColor(result.score),
                                    textShadow: `0 0 20px ${getScoreColor(result.score)}40`
                                }}>
                                    {result.score}
                                </span>
                                <span style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "var(--text2)",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px"
                                }}>
                                    {getScoreLabel(result.score)}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <h3 style={{ fontSize: 22, fontFamily: "Fredoka One", marginBottom: 16, color: "var(--text)" }}>
                                Overall SEO Score
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                                {[
                                    { label: "Performance", value: result.performance, icon: "⚡" },
                                    { label: "Accessibility", value: result.accessibility, icon: "♿" },
                                    { label: "Best Practices", value: result.bestPractices, icon: "✅" },
                                    { label: "SEO Core", value: result.seo, icon: "🔍" },
                                ].map(m => (
                                    <div key={m.label} className="card" style={{
                                        padding: "16px",
                                        background: "rgba(255,255,255,0.6)",
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        borderRadius: "12px",
                                        transition: "all 0.3s ease",
                                        cursor: "pointer"
                                    }} onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                                    }} onMouseLeave={e => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                            <span style={{ fontSize: 16 }}>{m.icon}</span>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>{m.label}</span>
                                        </div>
                                        <div style={{
                                            fontSize: 20,
                                            fontWeight: 800,
                                            color: getScoreColor(m.value),
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8
                                        }}>
                                            {m.value}
                                            <div style={{
                                                width: "100%",
                                                height: "4px",
                                                background: "rgba(0,0,0,0.1)",
                                                borderRadius: "2px",
                                                overflow: "hidden",
                                                marginTop: 4
                                            }}>
                                                <div style={{
                                                    width: `${m.value}%`,
                                                    height: "100%",
                                                    background: getScoreColor(m.value),
                                                    transition: "width 1s ease"
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                        <div className="card" style={{ padding: "24px" }}>
                            <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--pink)", display: "flex", alignItems: "center", gap: 8 }}>
                                <span>⚠️</span> Missing Tags & Issues
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {(result.missingTags || []).map((tag, i) => (
                                    <div key={i} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px",
                                        background: "rgba(240, 80, 168, 0.08)",
                                        border: "1px solid rgba(240, 80, 168, 0.2)",
                                        borderRadius: "8px"
                                    }}>
                                        <span style={{ fontSize: 13, color: "var(--text)" }}>{tag}</span>
                                        <span style={{ fontSize: 11, color: "var(--pink)", fontWeight: 700 }}>MISSING</span>
                                    </div>
                                ))}
                                {(result.performanceIssues || []).map((issue, i) => (
                                    <div key={`perf-${i}`} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px",
                                        background: "rgba(255, 173, 0, 0.08)",
                                        border: "1px solid rgba(255, 173, 0, 0.2)",
                                        borderRadius: "8px"
                                    }}>
                                        <span style={{ fontSize: 13, color: "var(--text)" }}>{issue}</span>
                                        <span style={{ fontSize: 11, color: "#FFAD00", fontWeight: 700 }}>PERFORMANCE</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: "24px" }}>
                            <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--teal)", display: "flex", alignItems: "center", gap: 8 }}>
                                <span>💡</span> Improvement Suggestions
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {(result.suggestions || []).map((suggestion, i) => (
                                    <div key={i} style={{
                                        padding: "12px",
                                        background: "rgba(0, 201, 180, 0.08)",
                                        border: "1px solid rgba(0, 201, 180, 0.2)",
                                        borderRadius: "8px"
                                    }}>
                                        <span style={{ fontSize: 13, color: "var(--text)" }}>{suggestion}</span>
                                    </div>
                                ))}
                                {(result.seoIssues || []).map((seo, i) => (
                                    <div key={`seo-${i}`} style={{
                                        padding: "12px",
                                        background: "rgba(63, 81, 181, 0.08)",
                                        border: "1px solid rgba(63, 81, 181, 0.2)",
                                        borderRadius: "8px"
                                    }}>
                                        <span style={{ fontSize: 13, color: "var(--text)" }}>{seo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Keyword Generator ───────────────────────────────────────────────────────
function KeywordGeneratorTool({ brandProfile }) {
    const [topic, setTopic] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("volume");

    const generate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const data = await smartAIJSON(
                `You are an SEO Keyword research expert. Return JSON:
{
  "keywords": [
    { "keyword": "<keyword>", "intent": "Informational|Navigational|Commercial|Transactional", "volume": "High|Medium|Low", "difficulty": "Hard|Medium|Easy", "cpc": "<estimated cost per click>" }
  ]
}`,
                `Topic: ${topic}. Brand Context: ${JSON.stringify(brandProfile || {})}. Provide 15 diverse keywords with search intent analysis.`
            );
            setResult(data);
        } catch { }
        setLoading(false);
    };

    const intentColors = { Informational: "var(--teal)", Navigational: "var(--violet)", Commercial: "#FFAD00", Transactional: "var(--pink)" };
    const volumeColors = { High: "#00C9B4", Medium: "#FFAD00", Low: "#F050A8" };
    const difficultyColors = { Easy: "#00C9B4", Medium: "#FFAD00", Hard: "#F050A8" };

    const getVolumeScore = (volume) => volume === "High" ? 100 : volume === "Medium" ? 60 : 20;
    const getDifficultyScore = (difficulty) => difficulty === "Easy" ? 20 : difficulty === "Medium" ? 60 : 100;

    const sortedKeywords = result?.keywords?.sort((a, b) => {
        if (sortBy === "volume") return getVolumeScore(b.volume) - getVolumeScore(a.volume);
        if (sortBy === "difficulty") return getDifficultyScore(a.difficulty) - getDifficultyScore(b.difficulty);
        return 0;
    }) || [];

    return (
        <div className="keyword-generator">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="hover-glow" style={{ fontSize: 28 }}>🔑</span>
                    Keyword Generator
                </h2>
                <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
                    Find high-intent keywords for your business idea or topic. Get search volume, competition, and intent analysis.
                </p>
            </div>

            {/* Input Section */}
            <div className="card" style={{ padding: "24px", marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 8, display: "block" }}>
                            Business Topic or Idea
                        </label>
                        <input
                            className="input-base"
                            style={{ flex: 1 }}
                            placeholder="e.g. 'eco-friendly candles', 'digital marketing agency'"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && generate()}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-primary" onClick={generate} disabled={loading || !topic.trim()}>
                            {loading ? "Generating…" : "Generate Keywords"}
                        </button>
                    </div>
                </div>
            </div>

            {loading && <SkeletonCard lines={8} />}

            {result && !loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Stats Overview */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--violet)", marginBottom: 4 }}>{result.keywords?.length || 0}</div>
                            <div style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "1px" }}>Total Keywords</div>
                        </div>
                        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--teal)", marginBottom: 4 }}>
                                {result.keywords?.filter(k => k.intent === "Transactional").length || 0}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "1px" }}>Commercial Intent</div>
                        </div>
                        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "#FFAD00", marginBottom: 4 }}>
                                {result.keywords?.filter(k => k.volume === "High").length || 0}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "1px" }}>High Volume</div>
                        </div>
                    </div>

                    {/* Sort Controls */}
                    <div className="card" style={{ padding: "16px", display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", alignSelf: "center" }}>Sort by:</span>
                        {["volume", "difficulty"].map(option => (
                            <button
                                key={option}
                                className={`pill ${sortBy === option ? "active" : ""}`}
                                onClick={() => setSortBy(option)}
                                style={{ fontSize: 12, fontWeight: 700 }}
                            >
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Keywords Table */}
                    <div className="card" style={{ padding: 0, overflow: "hidden", border: "1.5px solid var(--border)", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}>
                        <div style={{ maxHeight: "500px", overflow: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead style={{ position: "sticky", top: 0, background: "var(--bg2)", zIndex: 1 }}>
                                    <tr style={{ background: "var(--bg2)", borderBottom: "1.5px solid var(--border)" }}>
                                        <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", cursor: "pointer" }} onClick={() => setSortBy("volume")}>
                                            Keyword {sortBy === "volume" && "↓"}
                                        </th>
                                        <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase" }}>Intent</th>
                                        <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", cursor: "pointer" }} onClick={() => setSortBy("difficulty")}>
                                            Volume {sortBy === "difficulty" && "↓"}
                                        </th>
                                        <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase" }}>Difficulty</th>
                                        <th style={{ padding: "16px 20px", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase" }}>CPC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedKeywords.map((k, i) => (
                                        <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "var(--bg2)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                                                {k.keyword}
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <span style={{
                                                    padding: "4px 10px",
                                                    borderRadius: 99,
                                                    background: `${intentColors[k.intent] || "var(--violet)"}1A`,
                                                    color: intentColors[k.intent] || "var(--violet)",
                                                    fontSize: 11,
                                                    fontWeight: 800
                                                }}>
                                                    {k.intent}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>{k.volume}</span>
                                                    <div style={{
                                                        width: "60px",
                                                        height: "4px",
                                                        background: "rgba(0,0,0,0.1)",
                                                        borderRadius: "2px",
                                                        overflow: "hidden"
                                                    }}>
                                                        <div style={{
                                                            width: `${getVolumeScore(k.volume)}%`,
                                                            height: "100%",
                                                            background: volumeColors[k.volume] || "#00C9B4",
                                                            transition: "width 0.5s ease"
                                                        }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>{k.difficulty}</span>
                                                    <div style={{
                                                        width: "60px",
                                                        height: "4px",
                                                        background: "rgba(0,0,0,0.1)",
                                                        borderRadius: "2px",
                                                        overflow: "hidden"
                                                    }}>
                                                        <div style={{
                                                            width: `${getDifficultyScore(k.difficulty)}%`,
                                                            height: "100%",
                                                            background: difficultyColors[k.difficulty] || "#F050A8",
                                                            transition: "width 0.5s ease"
                                                        }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>
                                                {k.cpc || "$0.50 - $2.00"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Meta Tag Generator ──────────────────────────────────────────────────────
function MetaTagGeneratorTool({ brandProfile }) {
    const [title, setTitle] = useState(brandProfile?.brandName || "");
    const [desc, setDesc] = useState(brandProfile?.businessDo || "");
    const [keywords, setKeywords] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const data = await smartAIJSON(
                `You are an SEO expert. Generate optimized HTML meta tags. Return JSON:
{
  "html": "<ready to copy html snippet containing title, description, keywords, og: tags, twitter cards, structured data>",
  "preview": { "title": "<optimized title>", "url": "https://yoursite.com", "description": "<optimized description>" },
  "characterCounts": { "title": <number>, "description": <number> },
  "seoScore": <0-100>
}`,
                `Input Title: ${title}, Desc: ${desc}, Keywords: ${keywords}. Brand Context: ${JSON.stringify(brandProfile || {})}. Include Open Graph, Twitter Cards, and basic structured data.`
            );
            setResult(data);
        } catch { }
        setLoading(false);
    };

    const copyToClipboard = async () => {
        if (result?.html) {
            await navigator.clipboard.writeText(result.html);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="meta-generator">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="hover-glow" style={{ fontSize: 28 }}>🏷️</span>
                    Meta Tag Generator
                </h2>
                <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
                    Generate ready-to-copy HTML meta tags for better search visibility, social sharing, and structured data.
                </p>
            </div>

            <div className="card" style={{ padding: "24px", marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 6, display: "block" }}>
                        Page Title (50-60 characters)
                    </label>
                    <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Home Page" />
                    <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>
                        {title.length}/60 characters
                    </div>
                </div>
                <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 6, display: "block" }}>
                        Page Description (150-160 characters)
                    </label>
                    <textarea className="input-base" rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of the page..." style={{ resize: "none" }} />
                    <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>
                        {desc.length}/160 characters
                    </div>
                </div>
                <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 6, display: "block" }}>
                        Target Keywords
                    </label>
                    <input className="input-base" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g. startup, brand, tools" />
                </div>
                <div style={{ display: "flex", alignItems: "end" }}>
                    <button className="btn-primary" onClick={generate} disabled={loading} style={{ height: "48px" }}>
                        {loading ? "Generating Tags…" : "Generate Meta Tags"}
                    </button>
                </div>
            </div>

            {loading && <SkeletonCard lines={6} />}

            {result && !loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* SEO Score */}
                    <div className="card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: "var(--text)" }}>SEO Optimization Score</h4>
                            <div style={{ fontSize: 12, color: "var(--text2)" }}>Based on your input</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: "conic-gradient(var(--violet) 0deg, var(--violet) " + (result.seoScore * 3.6) + "deg, #e0e0e0 " + (result.seoScore * 3.6) + "deg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                fontWeight: 800,
                                color: "var(--text)"
                            }}>
                                {result.seoScore}
                            </div>
                        </div>
                    </div>

                    {/* Google Search Preview */}
                    <div className="card" style={{ padding: "24px", background: "var(--bg2)", border: "1px solid var(--border)" }}>
                        <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "var(--text)" }}>🔍 Google Search Preview</h4>
                        <div style={{ background: "#fff", padding: "16px", borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)", position: "relative" }}>
                            <div style={{ fontSize: 12, color: "#202124", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F1F3F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🌐</div>
                                <div>
                                    <div style={{ color: "#202124", fontSize: 12 }}>{result.preview?.url}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: 20, color: "#1a0dab", fontWeight: 400, fontFamily: "arial,sans-serif", marginBottom: 4, cursor: "pointer", textDecoration: "none", maxWidth: "600px" }}
                                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                                {result.preview?.title}
                            </div>
                            <div style={{ fontSize: 14, color: "#4d5156", fontFamily: "arial,sans-serif", lineHeight: 1.58, maxWidth: "600px" }}>
                                {result.preview?.description}
                            </div>
                            <div style={{ position: "absolute", top: 8, right: 12, fontSize: 11, color: "#666" }}>
                                Desktop Preview
                            </div>
                        </div>
                    </div>

                    {/* Meta Tags Output */}
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", background: "#1A1232" }}>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>index.html <head></div>
                            <button className="btn-ghost btn-sm" onClick={copyToClipboard} style={{ color: "#fff" }}>
                                {copied ? "✅ Copied!" : "📋 Copy HTML"}
                            </button>
                        </div>
                        <pre style={{ margin: 0, padding: "20px", background: "#0D0820", color: "#C792EA", fontSize: 13, fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                            {result.html}
                        </pre>
                    </div>

                    {/* Character Count Analysis */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                        <div className="card" style={{ padding: "16px", textAlign: "center" }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--violet)", marginBottom: 4 }}>{result.characterCounts?.title || title.length}</div>
                            <div style={{ fontSize: 12, color: "var(--text2)" }}>Title Characters</div>
                            <div style={{ fontSize: 10, color: "var(--text3)" }}>Optimal: 50-60</div>
                        </div>
                        <div className="card" style={{ padding: "16px", textAlign: "center" }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--teal)", marginBottom: 4 }}>{result.characterCounts?.description || desc.length}</div>
                            <div style={{ fontSize: 12, color: "var(--text2)" }}>Description Characters</div>
                            <div style={{ fontSize: 10, color: "var(--text3)" }}>Optimal: 150-160</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Content Optimizer ───────────────────────────────────────────────────────
function ContentOptimizerTool({ brandProfile }) {
    const [content, setContent] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const optimize = async () => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            const data = await smartAIJSON(
                `You are an SEO Content Optimizer. Return JSON:
{
  "readabilityScore": <0-100>,
  "keywordSuggestions": ["<kw1>", "<kw2>"],
  "tips": ["<tip1>", "<tip2>"],
  "optimizedContent": "<rewritten content optimized for SEO>",
  "densityAnalysis": { "<keyword1>": <percentage>, "<keyword2>": <percentage> },
  "readabilityGrade": "8th Grade|High School|College|Professional"
}`,
                `Content: ${content}. Brand Context: ${JSON.stringify(brandProfile || {})}. Provide detailed optimization with keyword density analysis.`
            );
            setResult(data);
        } catch { }
        setLoading(false);
    };

    const getScoreColor = (score) => score >= 80 ? "#00C9B4" : score >= 50 ? "#FFAD00" : "#F050A8";
    const getScoreLabel = (score) => score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";

    const copyOptimizedContent = async () => {
        if (result?.optimizedContent) {
            await navigator.clipboard.writeText(result.optimizedContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="content-optimizer">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="hover-glow" style={{ fontSize: 28 }}>📝</span>
                    Content Optimizer
                </h2>
                <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
                    Paste your blog or content to get SEO readability improvements, keyword suggestions, and density analysis.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Input Section */}
                <div>
                    <div className="card" style={{ padding: "24px", height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h4 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>Your Content</h4>
                            <div style={{ fontSize: 12, color: "var(--text2)" }}>
                                {content.length} characters
                            </div>
                        </div>
                        <textarea
                            className="input-base"
                            rows={12}
                            placeholder="Paste your content here..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            style={{ resize: "vertical", width: "100%", minHeight: "200px" }}
                        />
                        <div style={{ marginTop: 16 }}>
                            <button className="btn-primary" onClick={optimize} disabled={loading || !content.trim()} style={{ width: "100%" }}>
                                {loading ? "Optimizing…" : "Optimize Content"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div>
                    {loading && <SkeletonCard lines={10} />}

                    {result && !loading && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Readability Score */}
                            <div className="card" style={{ padding: "24px", textAlign: "center", background: "linear-gradient(135deg, rgba(0, 201, 180, 0.05), rgba(255, 173, 0, 0.05))" }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Readability Score</div>
                                <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "Fredoka One", color: getScoreColor(result.readabilityScore), lineHeight: 1, marginBottom: 8 }}>
                                    {result.readabilityScore}
                                </div>
                                <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 12 }}>{getScoreLabel(result.readabilityScore)}</div>
                                <div style={{ fontSize: 12, color: "var(--text3)" }}>{result.readabilityGrade}</div>
                            </div>

                            {/* Keyword Suggestions */}
                            <div className="card" style={{ padding: "24px" }}>
                                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>🔑 Suggested Keywords</h4>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                                    {(result.keywordSuggestions || []).map((kw, i) => (
                                        <span key={i} style={{
                                            padding: "8px 12px",
                                            background: "rgba(0,201,180,0.1)",
                                            border: "1px solid rgba(0,201,180,0.2)",
                                            borderRadius: 99,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: "var(--teal)",
                                            cursor: "pointer"
                                        }} onClick={() => {
                                            const newContent = content + " " + kw;
                                            setContent(newContent);
                                        }}>
                                            {kw}
                                        </span>
                                    ))}
                                </div>

                                {/* Density Analysis */}
                                {result.densityAnalysis && (
                                    <div>
                                        <h5 style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase" }}>Keyword Density</h5>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {Object.entries(result.densityAnalysis).map(([kw, density]) => (
                                                <div key={kw} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <span style={{ fontSize: 12, color: "var(--text)", minWidth: "120px" }}>{kw}</span>
                                                    <div style={{ width: "100px", height: "6px", background: "rgba(0,0,0,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                                                        <div style={{
                                                            width: `${Math.min(density, 100)}%`,
                                                            height: "100%",
                                                            background: getScoreColor(density * 5),
                                                            transition: "width 0.5s ease"
                                                        }}></div>
                                                    </div>
                                                    <span style={{ fontSize: 11, color: "var(--text2)", minWidth: "40px" }}>{density.toFixed(1)}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Optimization Tips */}
                            <div className="card" style={{ padding: "24px" }}>
                                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>💡 Optimization Tips</h4>
                                <ul style={{ paddingLeft: 16, fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
                                    {(result.tips || []).map((t, i) => (
                                        <li key={i} style={{ marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                            <span style={{ fontSize: 16, color: "var(--violet)" }}>•</span>
                                            <span>{t}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Optimized Content Output */}
            {result && !loading && (
                <div style={{ marginTop: 24 }}>
                    <div className="card" style={{ padding: "24px", background: "linear-gradient(135deg, rgba(124, 77, 255, 0.05), rgba(240, 80, 168, 0.05))" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h4 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>✨ Optimized Content</h4>
                            <button className="btn-primary btn-sm" onClick={copyOptimizedContent}>
                                {copied ? "✅ Copied!" : "📋 Copy Content"}
                            </button>
                        </div>
                        <div style={{
                            fontSize: 14,
                            color: "var(--text)",
                            lineHeight: 1.7,
                            whiteSpace: "pre-wrap",
                            background: "rgba(255,255,255,0.5)",
                            padding: "16px",
                            borderRadius: 12,
                            border: "1px solid var(--border)",
                            maxHeight: "400px",
                            overflow: "auto"
                        }}>
                            {result.optimizedContent}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── SEO Tools Page ──────────────────────────────────────────────────────────
export function SEOToolsPage({ brandProfile, onOutput, selectedOutputs, onSelect }) {
    const [activeTool, setActiveTool] = useState("analyzer");

    const tools = [
        { id: "analyzer", emoji: "📈", label: "SEO Analyzer" },
        { id: "keywords", emoji: "🔑", label: "Keyword Research" },
        { id: "meta", emoji: "🏷️", label: "Meta Tags" },
        { id: "content", emoji: "📝", label: "Content Optimizer" },
    ];

    return (
        <PageShell
            emoji="🔍"
            title="SEO Tools"
            color="#3F51B5"
            desc="Optimize your brand's online presence and rank higher on search engines with professional SEO tools."
            tools={tools}
            activeId={activeTool}
            onSetActive={setActiveTool}
        >
            {activeTool === "analyzer" && <SEOAnalyzerTool brandProfile={brandProfile} />}
            {activeTool === "keywords" && <KeywordGeneratorTool brandProfile={brandProfile} />}
            {activeTool === "meta" && <MetaTagGeneratorTool brandProfile={brandProfile} />}
            {activeTool === "content" && <ContentOptimizerTool brandProfile={brandProfile} />}
        </PageShell>
    );
}
