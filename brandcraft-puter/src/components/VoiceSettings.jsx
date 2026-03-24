import { useState, useEffect } from "react";
import { callAIJSON } from "../utils/api";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import { applyTheme } from "../utils/themes";
import { SkeletonCard, OutputActions, GenerateMorePanel } from "./UI";
import Icon from "./Icon";
import { PageShell } from "./PageShell";



// ─── Voice Rewriter ────────────────────────────────────────────────────────────
function VoiceTool({ brandProfile, onOutput }) {
  const [inputText, setInputText] = useState("");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    if (!inputText && !spec) return;
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are a brand voice expert. Rewrite text to match the brand voice. Return JSON: {rewritten: string, changes: string[]}",
        `Brand profile: ${JSON.stringify(brandProfile)}. Original: "${inputText}". ${spec || "Rewrite in brand voice."}`
      );
      if (result.rewritten) {
        setRounds(r => [...r, { original: inputText, rewritten: result.rewritten, changes: result.changes, spec, round: r.length + 1 }]);
        onOutput("Voice & Tone", result.rewritten);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🎙️ Voice & Tone Customizer</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Make your brand sound consistent everywhere.</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        {brandProfile?.voice && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--teal-glow)", border: "1px solid var(--teal)", borderRadius: 8, fontSize: 13, color: "var(--teal)", marginBottom: 14, fontWeight: 700 }}>
            <Icon name="voice" size={13} /> Brand voice: <strong>{brandProfile.voice}</strong>
          </div>
        )}
        <textarea className="input-base" rows={4} placeholder="Paste any text here to rewrite it in your brand voice..." value={inputText} onChange={e => setInputText(e.target.value)} style={{ resize: "none", marginBottom: 12, display: "block", width: "100%" }} />
        <button className="btn-primary" onClick={() => generate()} disabled={loading || !inputText}>
          {loading ? "Rewriting…" : "Rewrite in Brand Voice"}
        </button>
      </div>
      {loading && <SkeletonCard lines={5} />}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="card" style={{ opacity: 0.7, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8, fontWeight: 700, letterSpacing: "0.05em" }}>ORIGINAL</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text2)" }}>{round.original}</p>
            </div>
            <div className="card" style={{ border: "1.5px solid var(--teal)", padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "var(--teal)", fontWeight: 700, letterSpacing: "0.05em" }}>REWRITTEN</div>
                <OutputActions text={round.rewritten} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text)" }}>{round.rewritten}</p>
              {round.changes?.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6, fontWeight: 700 }}>Changes made:</div>
                  {round.changes.map((c, i) => <div key={i} style={{ fontSize: 12, color: "var(--text2)", padding: "2px 0" }}>· {c}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Even More Formal","More Casual","Shorter Version","Add Personality","Make it Punchy","Sound More Human"]} />
      )}
    </div>
  );
}

// ─── Sentiment Analysis ────────────────────────────────────────────────────────
function SentimentTool({ brandProfile, onOutput }) {
  const [inputText, setInputText] = useState("");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    if (!inputText) return;
    setLoading(true);
    try {
      const result = await callAIJSON(
        "Sentiment analyzer. Return JSON: {score: 0-100 (higher=more positive), emotions: {joy:0-100,trust:0-100,fear:0-100,surprise:0-100,sadness:0-100,anger:0-100}, sentiment: 'Positive|Neutral|Negative', recommendation: string, keyWords: [{word:string,emotion:string}]}",
        `Analyze: "${inputText}". Context: brand for ${brandProfile?.industry || "business"}. ${spec || ""}`
      );
      if (result.score !== undefined) {
        setRounds(r => [...r, { ...result, text: inputText, spec, round: r.length + 1 }]);
        onOutput("Sentiment Analysis", `Score: ${result.score}/100`);
      }
    } catch {}
    setLoading(false);
  };

  const emotions = ["joy","trust","fear","surprise","sadness","anger"];
  const emotionColors = { joy: "#FFD700", trust: "#4ECDC4", fear: "#7C3AED", surprise: "#FF9F43", sadness: "#6BB5FF", anger: "#FF6B6B" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>💡 Sentiment Analysis</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Know how your content makes people feel.</p>
      </div>
      <textarea className="input-base" rows={5} placeholder="Paste any content to analyse..." value={inputText} onChange={e => setInputText(e.target.value)} style={{ resize: "none", marginBottom: 12, display: "block", width: "100%" }} />
      <button className="btn-primary" onClick={() => generate()} disabled={loading || !inputText} style={{ marginBottom: 24 }}>
        {loading ? "Analysing…" : "Analyse Sentiment"}
      </button>
      {loading && <SkeletonCard lines={6} />}
      {rounds.map((round, ri) => {
        const scoreColor = round.score >= 60 ? "#4ECDC4" : round.score >= 40 ? "#FFC107" : "#FF6B6B";
        const circ = 2 * Math.PI * 50;
        return (
          <div key={ri} style={{ marginBottom: 24 }}>
            <div className="round-label">Round {round.round}</div>
            <div className="card" style={{ padding: "20px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <svg width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="8"
                      strokeDasharray={circ} strokeDashoffset={circ - (round.score / 100) * circ}
                      strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1s ease" }} />
                    <text x="60" y="64" textAnchor="middle" dominantBaseline="middle" fill={scoreColor} fontSize="24" fontFamily="Fredoka One" fontWeight="800">{round.score}</text>
                  </svg>
                  <div style={{ fontSize: 13, color: scoreColor, fontWeight: 700, marginTop: 8 }}>{round.sentiment}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12, fontWeight: 700 }}>Emotion Breakdown</div>
                  {emotions.map(em => (
                    <div key={em} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: emotionColors[em], textTransform: "capitalize", fontWeight: 600 }}>{em}</span>
                        <span style={{ color: "var(--text2)" }}>{round.emotions?.[em] || 0}%</span>
                      </div>
                      <div style={{ height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: emotionColors[em], width: `${round.emotions?.[em] || 0}%`, borderRadius: 3, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {round.recommendation && (
                <div style={{ padding: 14, background: "var(--teal-glow)", border: "1px solid var(--teal)", borderRadius: 12 }}>
                  <div style={{ fontSize: 11, color: "var(--teal)", fontWeight: 700, marginBottom: 5, letterSpacing: "0.05em" }}>💡 RECOMMENDATION</div>
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{round.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Focus on Positive Words","Focus on Negative Words","Suggest Improvements","How would Gen Z feel?","How would Boomers feel?"]} />
      )}
    </div>
  );
}

// ─── Target Audience (Buyer Persona) ───────────────────────────────────────────
function BuyerPersonaTool({ brandProfile, onOutput }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are an expert audience researcher. Return JSON: {personas: [{name: string, demographic: string, psychological: string, painPoints: string[], whereTheyHangOut: string[]}]}",
        `Brand Profile: ${JSON.stringify(brandProfile)}. ${spec || "Generate 2 highly specific, distinct target audience personas."}`
      );
      if (result.personas && result.personas.length > 0) {
        setRounds(r => [...r, { personas: result.personas, spec, round: r.length + 1 }]);
        onOutput("Target Audience", result.personas[0].name);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>👥 Buyer Personas</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Visualize exactly who you're talking to with 3D audience profiles.</p>
      </div>

      {rounds.length === 0 && !loading && (
        <button className="btn-primary" onClick={() => generate()}>Generate Target Audiences</button>
      )}

      {loading && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{[...Array(2)].map((_, i) => <SkeletonCard key={i} lines={6} />)}</div>}

      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 32 }}>
          <div className="round-label">Round {round.round}{round.spec ? ` · ${round.spec}` : ""}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {round.personas.map((p, i) => (
              <div key={i} className="card" style={{ padding: "24px 28px", borderTop: `4px solid ${i % 2 === 0 ? "var(--teal)" : "var(--pink)"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "1.5px solid var(--border)" }}>{i % 2 === 0 ? "🧑‍💻" : "💁‍♀️"}</div>
                  <div>
                    <div style={{ fontFamily: "Fredoka One", fontSize: 18, color: "var(--text)" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--teal)", fontWeight: 700 }}>{p.demographic}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>🧠 Psychology</div>
                  <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{p.psychological}</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>⚠️ Pain Points</div>
                  <ul style={{ paddingLeft: 16, margin: 0, color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>
                    {p.painPoints?.map((pp, pi) => <li key={pi} style={{ marginBottom: 4 }}>{pp}</li>)}
                  </ul>
                </div>

                <div style={{ background: "rgba(124,77,255,0.05)", padding: "12px 16px", borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--violet)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>📍 Where they hang out</div>
                  <div style={{ fontSize: 13, color: "var(--text)", display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {p.whereTheyHangOut?.map((wh, wi) => (
                      <span key={wi} style={{ background: "#fff", padding: "4px 10px", borderRadius: 99, border: "1px solid var(--border)", display: "inline-block" }}>{wh}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Gen Z Focus", "B2B Decision Makers", "More Specific", "Different Channels", "Higher Income Bracket"]} />
      )}
    </div>
  );
}

// ─── Voice Style Page ──────────────────────────────────────────────────────────
export function VoiceStylePage({ brandProfile, onOutput }) {
  const [activeTool, setActiveTool] = useState("voice");

  const tools = [
    { id: "voice",     emoji: "🎙️", label: "Voice Rewriter" },
    { id: "audience",  emoji: "👥", label: "Buyer Persona" },
    { id: "sentiment", emoji: "💡", label: "Sentiment Analysis" },
  ];

  return (
    <PageShell
      emoji="🎙️" title="Voice & Style" color="#F050A8"
      desc="Shape how your brand sounds and how it makes people feel."
      tools={tools} activeId={activeTool} onSetActive={setActiveTool}
    >
      {activeTool === "voice"     && <VoiceTool brandProfile={brandProfile} onOutput={onOutput} />}
      {activeTool === "audience"  && <BuyerPersonaTool brandProfile={brandProfile} onOutput={onOutput} />}
      {activeTool === "sentiment" && <SentimentTool brandProfile={brandProfile} onOutput={onOutput} />}
    </PageShell>
  );
}

// ─── Settings Page — fully working dark mode + theme ─────────────────────────
export function SettingsPage({ user, onNav }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, themes: themeList } = useTheme();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("brandcraft-dark") === "true");
  const [saved, setSaved] = useState(false);

  // Apply theme + darkmode whenever either changes
  useEffect(() => {
    localStorage.setItem("brandcraft-dark", darkMode);
    applyTheme(theme, darkMode);
  }, [theme, darkMode]);

  const handleThemeChange = (key) => {
    setTheme(key);
    applyTheme(key, darkMode);
  };

  const handleDarkToggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    applyTheme(theme, next);
  };

  const handleSaveLanguage = () => {
    setLanguage(language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const langs = [
    { name: "English", flag: "🇺🇸" }, { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" }, { name: "German", flag: "🇩🇪" },
    { name: "Japanese", flag: "🇯🇵" }, { name: "Arabic", flag: "🇸🇦" },
    { name: "Hindi", flag: "🇮🇳" }, { name: "Portuguese", flag: "🇧🇷" },
    { name: "Chinese", flag: "🇨🇳" }, { name: "Italian", flag: "🇮🇹" },
    { name: "Korean", flag: "🇰🇷" },
  ];

  const SectionTitle = ({ children }) => (
    <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14, color: "var(--text)", fontFamily: "Fredoka One" }}>{children}</h2>
  );

  return (
    <div style={{ maxWidth: 680, padding: "32px 40px 80px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "var(--text)", fontFamily: "Fredoka One" }}>⚙️ Settings</h1>
      <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 36 }}>Manage your profile, theme, and preferences.</p>

      {/* Dark mode — prominently at top */}
      <section style={{ marginBottom: 32 }}>
        <SectionTitle>🌙 Appearance</SectionTitle>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>Dark Mode</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>{darkMode ? "Dark background is active across all pages" : "Light mode is active"}</div>
            </div>
            <div
              onClick={handleDarkToggle}
              style={{
                width: 52, height: 28,
                background: darkMode ? "var(--teal)" : "var(--border)",
                borderRadius: 99, cursor: "pointer", position: "relative",
                transition: "background 0.3s ease",
                flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute", top: 4, left: darkMode ? 27 : 4,
                width: 20, height: 20, background: "#fff", borderRadius: "50%",
                transition: "left 0.3s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* App Theme */}
      <section style={{ marginBottom: 32 }}>
        <SectionTitle>🎨 App Theme</SectionTitle>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 14 }}>Changes accent colors across all pages instantly.</p>
        <div className="card" style={{ padding: "16px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
            {Object.entries(themeList).map(([key, themeData]) => (
              <div
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  padding: "12px 10px", borderRadius: 14, textAlign: "center",
                  border: `2px solid ${theme === key ? "var(--teal)" : "var(--border)"}`,
                  background: theme === key ? "var(--teal-glow)" : "var(--bg2)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{themeData.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: theme === key ? 800 : 500, color: theme === key ? "var(--teal)" : "var(--text2)" }}>{themeData.name}</div>
                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: themeData.colors["--teal"] }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: themeData.colors["--purple"] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile */}
      <section style={{ marginBottom: 32 }}>
        <SectionTitle>👤 Profile</SectionTitle>
        <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6, fontWeight: 700 }}>Email</label>
            <input className="input-base" defaultValue={user?.email} readOnly style={{ opacity: 0.7 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6, fontWeight: 700 }}>Display Name</label>
            <input className="input-base" placeholder="Your display name" />
          </div>
        </div>
      </section>

      {/* Language */}
      <section style={{ marginBottom: 32 }}>
        <SectionTitle>🌍 Language</SectionTitle>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 14 }}>AI will generate content in your selected language.</p>
        <div className="card" style={{ padding: "16px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
            {langs.map(l => (
              <div key={l.name} onClick={() => setLanguage(l.name)}
                style={{
                  padding: "10px 14px", borderRadius: 10,
                  border: `1.5px solid ${language === l.name ? "var(--teal)" : "var(--border)"}`,
                  background: language === l.name ? "var(--teal-glow)" : "var(--bg2)",
                  cursor: "pointer", transition: "all 0.18s",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                <span style={{ fontSize: 18 }}>{l.flag}</span>
                <span style={{ fontSize: 13, fontWeight: language === l.name ? 700 : 400, color: language === l.name ? "var(--teal)" : "var(--text2)" }}>{l.name}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary btn-sm" onClick={handleSaveLanguage}>
            {saved ? <><Icon name="check" size={13} /> Saved!</> : "Save Language"}
          </button>
        </div>
      </section>

      {/* Brand Profile */}
      <section style={{ marginBottom: 32 }}>
        <SectionTitle>📖 Brand Profile</SectionTitle>
        <button className="btn-ghost" onClick={() => onNav("onboarding")}>Edit Brand Profile →</button>
      </section>

      {/* Danger Zone */}
      <section>
        <SectionTitle>⚠️ Danger Zone</SectionTitle>
        <div className="card" style={{ padding: "16px 20px", border: "1px solid rgba(255,107,107,0.3)" }}>
          <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Delete Account</div>
          <div style={{ color: "var(--text2)", fontSize: 12, marginBottom: 14 }}>This action is permanent and cannot be undone.</div>
          <button style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #FF6B6B", background: "transparent", color: "#FF6B6B", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,107,107,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >Delete Account</button>
        </div>
      </section>
    </div>
  );
}
