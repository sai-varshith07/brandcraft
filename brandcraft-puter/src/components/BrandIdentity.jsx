import { useState, useEffect } from "react";
import { callAIJSON } from "../utils/api";
import { generateLogoImage, buildLogoPrompt } from "../utils/imageProviders";
import { SkeletonCard, OutputActions, GenerateMorePanel, ToolSection } from "./UI";
import Icon from "./Icon";
import { PageShell } from "./PageShell";


// ─── Auto-Suggest Banner ───────────────────────────────────────────────────────
function AutoSuggest({ suggestions }) {
  const [dismissed, setDismissed] = useState([]);
  const visible = suggestions.filter((_, i) => !dismissed.includes(i));
  if (!visible.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      {suggestions.map((s, i) => dismissed.includes(i) ? null : (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "12px 16px", borderRadius: 12,
          background: s.type === "warning" ? "rgba(255,179,0,0.08)" : "rgba(124,77,255,0.07)",
          border: `1.5px solid ${s.type === "warning" ? "rgba(255,179,0,0.3)" : "rgba(124,77,255,0.2)"}`,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{s.type === "warning" ? "⚠️" : "💡"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{s.body}</div>
            {s.action && (
              <button onClick={s.action.fn} style={{
                marginTop: 8, padding: "5px 12px", borderRadius: 8, border: "none",
                background: "var(--teal)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>{s.action.label}</button>
            )}
          </div>
          <button onClick={() => setDismissed(d => [...d, i])} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 16, padding: 0, flexShrink: 0 }}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── Logo Mockups ─────────────────────────────────────────────────────────────
function LogoMockups({ logoUrl, brandName = "Your Brand" }) {
  const [activeMock, setActiveMock] = useState("card");
  const [activeAnim, setActiveAnim] = useState("none");

  const mocks = [
    { id: "card",       label: "Business Card", emoji: "💼" },
    { id: "hoodie",     label: "Hoodie",        emoji: "👕" },
    { id: "storefront", label: "Storefront",    emoji: "🏪" },
  ];

  const anims = [
    { id: "none",   label: "Still",    css: "none" },
    { id: "float",  label: "Float",    css: "anim-float 3s ease-in-out infinite" },
    { id: "pulse",  label: "Pulse",    css: "anim-pulse 2s infinite" },
    { id: "spin",   label: "Spin",     css: "anim-spin 8s linear infinite" },
    { id: "bounce", label: "Bounce",   css: "anim-bounce 2s infinite" },
  ];

  return (
    <div style={{ marginTop: 24, padding: "20px 24px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16 }}>
      {/* Injecting Keyframes safely for the animations */}
      <style>{`
        @keyframes anim-float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
        @keyframes anim-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes anim-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes anim-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-15px); } 60% { transform: translateY(-7px); } }
      `}</style>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.5px" }}>✨ Preview & Animate</div>
        
        {/* Actions Right Side */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* Mockup Toolbar */}
          <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.05)", padding: 4, borderRadius: 8 }}>
            {mocks.map(m => (
              <button key={m.id} onClick={() => setActiveMock(m.id)} style={{
                padding: "5px 10px", borderRadius: 6, border: "none",
                background: activeMock === m.id ? "white" : "transparent",
                color: activeMock === m.id ? "var(--teal)" : "var(--text2)",
                boxShadow: activeMock === m.id ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
                fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              }}>{m.emoji} {m.label}</button>
            ))}
          </div>

          {/* Animation Toolbar */}
          <div style={{ display: "flex", gap: 4, background: "rgba(124,77,255,0.08)", padding: 4, borderRadius: 8 }}>
            {anims.map(a => (
              <button key={a.id} onClick={() => setActiveAnim(a.id)} style={{
                padding: "5px 10px", borderRadius: 6, border: "none",
                background: activeAnim === a.id ? "var(--violet)" : "transparent",
                color: activeAnim === a.id ? "white" : "var(--violet)",
                fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              }}>{a.id === "none" ? "🚫" : "🪄"} {a.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
        {/* Business Card */}
        {activeMock === "card" && (
            <div style={{
              width: 340, height: 190, borderRadius: 14, background: "#fff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.12)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, var(--teal), var(--purple))" }} />
              <div style={{ width: 60, height: 60, marginBottom: 8, animation: anims.find(a=>a.id===activeAnim)?.css }}>
                <img src={logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1232", fontFamily: "Fredoka One" }}>{brandName}</div>
              <div style={{ fontSize: 11, color: "#9B8CB8", marginTop: 4 }}>hello@{brandName.toLowerCase().replace(/\s/g,"")}.com</div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 60, height: 60, background: "var(--teal-glow)", borderRadius: "50%", transform: "translate(20px, 20px)" }} />
            </div>
        )}

        {/* Hoodie */}
        {activeMock === "hoodie" && (
            <div style={{ position: "relative", width: 220, height: 240 }}>
              {/* Hoodie body */}
              <svg viewBox="0 0 220 240" width="220" height="240">
                <path d="M 60 30 L 20 70 L 10 140 L 40 145 L 40 220 L 180 220 L 180 145 L 210 140 L 200 70 L 160 30 Q 140 20 110 22 Q 80 20 60 30 Z" fill="#3D3560" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                {/* Hood */}
                <path d="M 80 30 Q 110 5 140 30 Q 125 40 110 42 Q 95 40 80 30 Z" fill="#352E52" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                {/* Sleeve lines */}
                <line x1="20" y1="70" x2="40" y2="145" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                <line x1="200" y1="70" x2="180" y2="145" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                {/* Pocket */}
                <rect x="75" y="165" width="70" height="40" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              </svg>
              {/* Logo on chest */}
              <div style={{
                position: "absolute", top: 75, left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{ width: 44, height: 44, animation: anims.find(a=>a.id===activeAnim)?.css }}>
                  <img src={logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9 }} />
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 700, marginTop: 2, letterSpacing: "1px", textTransform: "uppercase" }}>{brandName}</div>
              </div>
            </div>
        )}

        {/* Storefront */}
        {activeMock === "storefront" && (
            <div style={{ position: "relative", width: 300, height: 210 }}>
              {/* Building */}
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 280, height: 185, background: "#E8E4F0", borderRadius: "10px 10px 0 0", border: "2px solid #C8C0D8" }}>
                {/* Sign board */}
                <div style={{
                  position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)",
                  width: 220, padding: "12px 20px", background: "#fff",
                  borderRadius: 10, border: "3px solid var(--teal)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
                }}>
                  <div style={{ width: 32, height: 32, animation: anims.find(a=>a.id===activeAnim)?.css }}>
                    <img src={logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1232", fontFamily: "Fredoka One" }}>{brandName}</span>
                </div>
                {/* Door */}
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 90, background: "#7C6B9E", borderRadius: "6px 6px 0 0", border: "2px solid #6B5B8A" }}>
                  <div style={{ position: "absolute", top: 12, right: 8, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,215,0,0.9)" }} />
                </div>
                {/* Windows */}
                {[40, 160].map(x => (
                  <div key={x} style={{ position: "absolute", bottom: 60, left: x, width: 50, height: 50, background: "rgba(135,206,250,0.6)", borderRadius: 4, border: "2px solid #9B8CB8" }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", width: 1, height: "100%", background: "rgba(0,0,0,0.15)" }} />
                    <div style={{ position: "absolute", top: "50%", left: 0, height: 1, width: "100%", background: "rgba(0,0,0,0.15)" }} />
                  </div>
                ))}
              </div>
              {/* Ground */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: "#9B8CB8", borderRadius: "0 0 4px 4px" }} />
            </div>
        )}
      </div>
    </div>
  );
}

// ─── Contrast checker ─────────────────────────────────────────────────────────
function hexLum(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
function contrastRatio(hex1, hex2) {
  const l1 = hexLum(hex1), l2 = hexLum(hex2);
  const light = Math.max(l1, l2), dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

// ─── Brand Names ───────────────────────────────────────────────────────────────
function BrandNamesTool({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async (spec = "") => {
    setLoading(true); setError("");
    try {
      const result = await callAIJSON(
        "You are a creative brand naming expert. Return JSON with a 'names' array of 6 objects, each with 'name' (string) and 'reason' (1-sentence string).",
        `Brand profile: ${JSON.stringify(brandProfile)}. ${spec ? `Focus: ${spec}` : "Generate unique brand names that fit this brand perfectly."}`
      );
      if (result.names) {
        setRounds(r => [...r, { names: result.names, spec, round: r.length + 1 }]);
        onOutput("Brand Names", result.names[0]?.name);
      }
    } catch { setError("Generation failed. Please try again."); }
    setLoading(false);
  };

  const selectedName = selectedOutputs?.["Brand Names"]?.text;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>✨ Brand Name Generator</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>AI-powered names tailored to your brand profile. Hit ✓ to select one as your official brand name.</p>
      </div>
      {selectedName && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
          background: "linear-gradient(135deg, rgba(0,201,180,0.1), rgba(124,77,255,0.07))",
          border: "1.5px solid rgba(0,201,180,0.35)", borderRadius: 14, marginBottom: 20,
        }}>
          <span style={{ fontSize: 22 }}>✅</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Selected Brand Name</div>
            <div style={{ fontFamily: "Fredoka One", fontSize: 22, color: "var(--text)", lineHeight: 1.2 }}>{selectedName}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>This name will be used in logo generation and mockups</div>
          </div>
        </div>
      )}
      {rounds.length === 0 && !loading && (
        <button className="btn-primary" onClick={() => generate()}>Generate Names</button>
      )}
      {loading && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>{[...Array(6)].map((_, i) => <SkeletonCard key={i} lines={2} />)}</div>}
      {error && <div style={{ color: "#FF6B6B", fontSize: 14 }}>{error} <button className="btn-ghost btn-sm" onClick={() => generate()}>Retry</button></div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}{round.spec ? ` · ${round.spec}` : ""}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {round.names.map((n, i) => {
              const id = `names-${ri}-${i}`;
              return (
                <div key={i} className="card output-card" style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontFamily: "Fredoka One", fontSize: 20, color: "var(--teal)" }}>{n.name}</div>
                    <OutputActions text={n.name} starred={favorites.includes(id)} onStar={() => onFavorite(id)} onSelect={onSelect} selected={selectedOutputs["Brand Names"]?.id === id} feature="Brand Names" id={id} />
                  </div>
                  <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>{n.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Playful","More Professional","Shorter Names","Unique/Invented","More Descriptive","International Feel"]} />
      )}
    </div>
  );
}

// ─── Color Palette ─────────────────────────────────────────────────────────────
function ColorPaletteTool({ brandProfile, onOutput, selectedOutputs, onSelect }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const checkContrastSuggestions = (palette) => {
    const issues = [];
    palette.forEach(c => {
      if (!c.hex || !c.hex.startsWith("#") || c.hex.length < 7) return;
      const whiteContrast = contrastRatio(c.hex, "#ffffff");
      const darkContrast = contrastRatio(c.hex, "#1A1232");
      if (c.role === "Primary" || c.role === "Accent") {
        if (whiteContrast < 3 && darkContrast < 3) {
          issues.push({
            type: "warning",
            title: `Low contrast on ${c.name} (${c.hex})`,
            body: `This ${c.role} color has poor contrast against both light and dark text (ratio: ${whiteContrast.toFixed(1)}:1 vs white). Consider adjusting brightness for accessibility.`,
          });
        }
      }
    });
    setSuggestions(issues);
  };

  const generate = async (spec = "") => {
    setLoading(true); setSuggestions([]);
    try {
      const result = await callAIJSON(
        "You are a brand color expert. Return JSON with a 'palette' array of exactly 5 objects, each with 'hex' (e.g. #FF5733), 'name' (string), 'role' (Primary/Secondary/Accent/Neutral/Background).",
        `Brand profile: ${JSON.stringify(brandProfile)}. ${spec || "Generate a professional brand color palette."}`
      );
      if (result.palette) {
        setRounds(r => [...r, { palette: result.palette, spec, round: r.length + 1 }]);
        onOutput("Color Palette", result.palette.map(c => c.hex).join(", "));
        checkContrastSuggestions(result.palette);
      }
    } catch {}
    setLoading(false);
  };

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(""), 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🎨 Color Palette Generator</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Perfect colors that match your brand vibe, with accessibility checks.</p>
      </div>
      <AutoSuggest suggestions={suggestions} />
      {rounds.length === 0 && !loading && <button className="btn-primary" onClick={() => generate()}>Generate Palette</button>}
      {loading && <div style={{ display: "flex", gap: 12 }}>{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, flex: 1, borderRadius: 12 }} />)}</div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <OutputActions text={`Color Palette: ${round.palette.map(c => `${c.name} (${c.hex}) - ${c.role}`).join(', ')}`} onSelect={onSelect} selected={selectedOutputs["Color Palette"]?.id === `palette-${ri}`} feature="Color Palette" id={`palette-${ri}`} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {round.palette.map((c, i) => (
              <div key={i} style={{ flex: "1 1 100px", minWidth: 90 }}>
                <div onClick={() => copyHex(c.hex)}
                  style={{ height: 110, borderRadius: 14, background: c.hex, cursor: "pointer", transition: "transform 0.2s", display: "flex", alignItems: "flex-end", padding: 8, position: "relative", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05) translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  {copiedHex === c.hex && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", borderRadius: 14, color: "#fff", fontSize: 12, fontWeight: 600 }}>Copied!</div>}
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{c.hex}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 1 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Darker","Lighter","More Vibrant","More Muted","Warmer","Cooler","More Contrast","Pastel"]} />
      )}
    </div>
  );
}

// ─── Font Pairing ──────────────────────────────────────────────────────────────
function FontPairingTool({ brandProfile, onOutput, selectedOutputs, onSelect }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const checkFontSuggestions = (pairs) => {
    const issues = [];
    pairs.forEach(pair => {
      // Heuristic: decorative/display fonts as body text = low readability
      const badBodyFonts = ["Playfair Display", "Cinzel", "Bebas Neue", "Pacifico", "Lobster", "Dancing Script"];
      if (badBodyFonts.some(f => pair.body?.includes(f))) {
        issues.push({
          type: "warning",
          title: `${pair.body} may be hard to read as body text`,
          body: `Decorative fonts reduce readability at small sizes. Try pairing it with a neutral sans-serif like "Inter", "Lato", or "Source Sans 3" for body text instead.`,
          action: { label: "Generate with Inter body", fn: () => generate("Use Inter or Lato as the body font") },
        });
      }
      // Check if heading and body are too similar
      if (pair.heading === pair.body) {
        issues.push({ type: "warning", title: "Heading and body fonts are the same", body: "Using the same font for headings and body creates low visual hierarchy. Try a contrasting pair." });
      }
    });
    // Generic readability tip if no specific issues
    if (issues.length === 0 && pairs.length > 0) {
      issues.push({ type: "tip", title: "💡 Pro tip: Test at different sizes", body: "Check your heading font at 14px and body font at 48px to ensure both remain readable at non-standard sizes." });
    }
    setSuggestions(issues);
  };

  const generate = async (spec = "") => {
    setLoading(true); setSuggestions([]);
    try {
      const result = await callAIJSON(
        "You are a typography expert. Return JSON: {pairs: [{heading: string, body: string, reason: string, css: string}]} with 3 Google Font pairs.",
        `Brand: ${JSON.stringify(brandProfile)}. ${spec || "Suggest professional font pairings."}`
      );
      if (result.pairs) {
        setRounds(r => [...r, { pairs: result.pairs, spec, round: r.length + 1 }]);
        onOutput("Font Pairing", result.pairs[0]?.heading + " + " + result.pairs[0]?.body);
        checkFontSuggestions(result.pairs);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🖋️ Typography Pairing</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Font combinations with readability & contrast checks.</p>
      </div>
      <AutoSuggest suggestions={suggestions} />
      {rounds.length === 0 && !loading && <button className="btn-primary" onClick={() => generate()}>Generate Font Pairs</button>}
      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={4} />)}</div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {round.pairs.map((pair, i) => (
              <div key={i} className="card" style={{ padding: "20px 22px" }}>
                <link href={`https://fonts.googleapis.com/css2?family=${pair.heading?.replace(/ /g,"+")}:wght@700&family=${pair.body?.replace(/ /g,"+")}:wght@400;500&display=swap`} rel="stylesheet" />
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                  <OutputActions text={`Font Pairing: ${pair.heading} + ${pair.body} - ${pair.reason}`} onSelect={onSelect} selected={selectedOutputs["Font Pairing"]?.id === `font-${ri}-${i}`} feature="Font Pairing" id={`font-${ri}-${i}`} />
                </div>
                <div style={{ fontFamily: `'${pair.heading}', serif`, fontSize: 30, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>The quick brown fox</div>
                <div style={{ fontFamily: `'${pair.body}', sans-serif`, fontSize: 15, color: "var(--text2)", lineHeight: 1.7, marginBottom: 14 }}>
                  Your brand story deserves typography that communicates trust and identity at every touchpoint.
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <div>
                    <span style={{ fontSize: 12, color: "var(--teal)", fontWeight: 700 }}>{pair.heading}</span>
                    <span style={{ fontSize: 12, color: "var(--text3)", margin: "0 6px" }}>+</span>
                    <span style={{ fontSize: 12, color: "var(--text2)" }}>{pair.body}</span>
                    {pair.reason && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{pair.reason}</div>}
                  </div>
                  <button className="btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(pair.css || `font-family: '${pair.heading}', serif;`)}>
                    <Icon name="copy" size={12} /> Copy CSS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Modern","More Classic","More Playful","More Elegant","Bolder Heading","Lighter Body"]} />
      )}
    </div>
  );
}

// ─── Logo Creator ──────────────────────────────────────────────────────────────
function LogoCreatorTool({ brandProfile, onOutput, selectedOutputs, onSelect }) {
  const [rounds, setRounds]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(-1);
  const [error, setError]         = useState("");
  const [styleNotes, setStyleNotes] = useState("");
  const [colorPref, setColorPref] = useState("");
  const [avoid, setAvoid]         = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [previewLogo, setPreviewLogo] = useState(null);

  // ── Resolve brand name from selected output (must be before buildPrompts) ──
  const selectedBrandName = selectedOutputs?.["Brand Names"]?.text
    || brandProfile?.brandName
    || "";

  // Build 4 style-specific prompts using the focused buildLogoPrompt helper
  const buildPrompts = (spec = "") => {
    const name     = selectedBrandName;
    const industry = brandProfile?.industry        || "brand";
    const colorMood= (colorPref || brandProfile?.colorMood) || "";
    const aesthetic= brandProfile?.designAesthetic || "";

    const STYLES = ["Minimal Icon", "Wordmark", "Badge / Emblem", "Abstract Mark"];
    return STYLES.map(style => ({
      style,
      prompt: buildLogoPrompt(name, industry, colorMood, aesthetic, style)
        + (styleNotes ? `, ${styleNotes}` : "")
        + (avoid      ? `, avoid ${avoid}` : "")
        + (spec       ? `, ${spec}` : ""),
    }));
  };

  const generate = async (spec = "") => {
    setLoading(true); setError(""); setStatusMsg(""); setPreviewLogo(null);
    const prompts = buildPrompts(spec);
    const logos   = [];
    try {
      for (let i = 0; i < prompts.length; i++) {
        setLoadingIdx(i);
        setStatusMsg(`[${i+1}/4] Generating ${prompts[i].style}…`);
        const imageUrl = await generateLogoImage(
          prompts[i].prompt,
          (msg) => setStatusMsg(`[${i+1}/4] ${msg}`),
          prompts[i].style,
          selectedBrandName,
        );
        logos.push({ style: prompts[i].style, imageUrl, prompt: prompts[i].prompt });
        if (i === 0) setPreviewLogo({ url: imageUrl, brandName: selectedBrandName || brandProfile?.industry || "Brand" });
        setStatusMsg(`✓ ${prompts[i].style} done`);
      }
      setRounds(r => [...r, { logos, spec, round: r.length + 1 }]);
      onOutput("Logo Creator", "4 AI logo images generated");
      setStatusMsg("");
    } catch (e) {
      setError(e.message || "Generation failed.");
      setStatusMsg("");
    }
    setLoading(false);
    setLoadingIdx(-1);
  };

  const downloadImage = (imageUrl, name) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `logo-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };

  const styleLabels = ["Minimal Icon", "Wordmark", "Badge / Emblem", "Abstract Mark"];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🎯 Logo Creator</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Real AI-generated logos with instant mockup previews.</p>
      </div>

      {selectedBrandName ? (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(124,77,255,0.07)", border:"1.5px solid rgba(124,77,255,0.2)", borderRadius:12, marginBottom:20 }}>
          <span style={{ fontSize:20 }}>🏷️</span>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:"var(--violet)", textTransform:"uppercase", letterSpacing:"0.8px" }}>Generating logos for</div>
            <div style={{ fontFamily:"Fredoka One", fontSize:20, color:"var(--text)" }}>{selectedBrandName}</div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"rgba(255,179,0,0.06)", border:"1.5px solid rgba(255,179,0,0.22)", borderRadius:12, marginBottom:20 }}>
          <span style={{ fontSize:16 }}>💡</span>
          <div style={{ fontSize:13, color:"#b8860b", fontWeight:600 }}>
            Tip: Go to <strong>Brand Names</strong> tab, generate names, then hit ✓ on one — it will appear in your logos automatically.
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, maxWidth: 520 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>Style notes</label>
          <input className="input-base" placeholder="e.g. use geometric shapes" value={styleNotes} onChange={e => setStyleNotes(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>Color preference</label>
          <input className="input-base" placeholder="e.g. navy blue and gold" value={colorPref} onChange={e => setColorPref(e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: 16, maxWidth: 520 }}>
        <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>Avoid</label>
        <input className="input-base" placeholder="e.g. no circles, no dark backgrounds" value={avoid} onChange={e => setAvoid(e.target.value)} />
      </div>
      <button className="btn-primary" onClick={() => generate()} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? `Generating… (${Math.max(loadingIdx, 0) + 1}/4)` : "Generate Logos"}
      </button>

      {loading && (
        <div style={{ marginBottom: 20 }}>
          {statusMsg && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "var(--teal-glow)", border: "1px solid var(--teal)", borderRadius: 8, marginBottom: 12, fontSize: 12, color: "var(--teal)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", animation: "pulse-glow 1s infinite" }} />
              {statusMsg}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {styleLabels.map((label, i) => (
              <div key={i} style={{ borderRadius: 14, border: `1px solid ${i === loadingIdx ? "var(--teal)" : "var(--border)"}`, background: "var(--card)", overflow: "hidden" }}>
                <div className="skeleton" style={{ height: 180, borderRadius: 0, opacity: i === loadingIdx ? 1 : i < loadingIdx ? 0.2 : 0.4 }} />
                <div style={{ padding: "10px 14px", fontSize: 12, color: i < loadingIdx ? "var(--teal)" : i === loadingIdx ? "var(--teal)" : "var(--text3)", fontWeight: i <= loadingIdx ? 600 : 400 }}>
                  {i < loadingIdx ? `✓ ${label}` : i === loadingIdx ? `⟳ ${label}` : label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: "16px 18px", background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 14 }}>⚠ Generation failed</span>
            <button className="btn-ghost btn-sm" onClick={() => generate()}>🔄 Retry</button>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,107,107,0.85)", fontFamily: "monospace", background: "rgba(255,107,107,0.05)", padding: "8px 10px", borderRadius: 8, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{error}</div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
            💡 <strong>Fix:</strong> Check that your <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>.env</code> file has <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>GEMINI_API_KEY</code> and <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>STABILITY_API_KEY</code> set, then restart the server.
            {" "}Or visit <a href="http://localhost:3001/api/debug-keys" target="_blank" rel="noreferrer" style={{ color: "var(--violet)" }}>localhost:3001/api/debug-keys</a> to verify keys are loaded.
          </div>
        </div>
      )}

      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 32 }}>
          <div className="round-label">Round {round.round}{round.spec ? ` · ${round.spec}` : ""}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {round.logos.map((logo, i) => (
              <div key={i} className="card" style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}
                onClick={() => setPreviewLogo({ url: logo.imageUrl, brandName: selectedBrandName || brandProfile?.industry || "Brand" })}>
                <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 180, position: "relative" }}>
                  <img src={logo.imageUrl} alt={logo.style} style={{ width: "100%", height: 180, objectFit: "contain", display: "block" }} />
                  <div style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", background: "rgba(0,0,0,0.6)", borderRadius: 6, fontSize: 10, color: "#fff", fontWeight: 700 }}>Click to preview</div>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{logo.style}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>512 × 512 · PNG</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <OutputActions text={`Logo: ${logo.style}`} onSelect={onSelect} selected={selectedOutputs["Logo Creator"]?.id === `logo-${ri}-${i}`} feature="Logo Creator" id={`logo-${ri}-${i}`} />
                    <button className="action-btn" title="Download PNG" onClick={e => { e.stopPropagation(); downloadImage(logo.imageUrl, logo.style); }}>
                      <Icon name="download" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live mockup preview — updates immediately when logo is selected */}
          {previewLogo && (
            <LogoMockups logoUrl={previewLogo.url} brandName={previewLogo.brandName} />
          )}
        </div>
      ))}

      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Minimal","More Bold","Different Colors","More Premium","More Playful","More Modern","Darker Theme","Lighter Theme"]} />
      )}
    </div>
  );
}

// ─── Website Generation Tool ──────────────────────────────────────────────────
function WebsiteGenerationTool({ brandProfile, onOutput }) {
  const [pages, setPages]   = useState("Landing Page");
  const [style, setStyle]   = useState("Modern Minimal");
  const [code, setCode]     = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const pageTypes = ["Landing Page", "Portfolio", "Product Page", "Coming Soon", "Agency Site"];
  const styles    = ["Modern Minimal", "Bold & Vibrant", "Dark & Techy", "Soft & Elegant", "Brutalist"];

  const generate = async () => {
    setLoading(true);
    setCode("");
    setPreview(false);
    try {
      const { puterAI } = await import("../utils/puter");
      await puterAI(
        `You are a world-class web developer. Generate a complete, beautiful single-file HTML website. The code must be self-contained with inline CSS and JS. No external dependencies except Google Fonts. Make it visually stunning and fully responsive. Output ONLY the HTML code — no explanation, no markdown, no backticks.`,
        `Brand: ${JSON.stringify(brandProfile || {})}. Page type: ${pages}. Design style: ${style}. Make it polished, modern, and ready to deploy.`,
        (text) => setCode(text)
      );
      onOutput?.("Website Generation", `${pages} — ${style}`);
    } catch (e) {
      setCode(`<!-- Error: ${e.message}. Please check Puter.js connection. -->`);
    }
    setLoading(false);
  };

  const download = () => {
    const blob = new Blob([code], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(brandProfile?.brandName || "website").toLowerCase().replace(/\s/g, "-")}.html`;
    a.click();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🌐 Website Generation</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Generate a complete branded website in seconds — powered by Puter.js AI.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select className="select-base" style={{ width: "auto", minWidth: 160 }} value={pages} onChange={e => setPages(e.target.value)}>
          {pageTypes.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="select-base" style={{ width: "auto", minWidth: 160 }} value={style} onChange={e => setStyle(e.target.value)}>
          {styles.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary" onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "🌐 Generate Website"}
        </button>
      </div>

      {loading && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <SkeletonCard lines={6} />
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 8, textAlign: "center" }}>Building your {pages} with {style} style…</div>
        </div>
      )}

      {code && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Action bar */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={download}>📥 Download HTML</button>
            <button className="btn-ghost" onClick={() => setPreview(p => !p)} style={{ fontSize: 12 }}>
              {preview ? "📝 View Code" : "👁️ Preview"}
            </button>
            <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(code)} style={{ fontSize: 12 }}>📋 Copy Code</button>
            <button className="btn-ghost" onClick={generate} style={{ fontSize: 12 }}>🔄 Regenerate</button>
          </div>

          {preview ? (
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid var(--border)", height: 500 }}>
              <iframe
                srcDoc={code}
                title="Website Preview"
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid var(--border)" }}>
              <div style={{ background: "#1A1232", padding: "10px 16px", display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 8, fontFamily: "monospace" }}>index.html</span>
              </div>
              <pre style={{ margin: 0, padding: "20px 24px", background: "#0D0820", color: "#C792EA", fontSize: 12, lineHeight: 1.7, overflow: "auto", maxHeight: 420, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {code}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mission & Vision Generator ──────────────────────────────────────────────────
function MissionVisionTool({ brandProfile, onOutput }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are a master brand strategist. Return JSON: {mission: string, vision: string, punchline: string}",
        `Brand Profile: ${JSON.stringify(brandProfile)}. ${spec || "Create an inspiring mission and vision statement for this brand."}`
      );
      if (result.mission) {
        setRounds(r => [...r, { ...result, spec, round: r.length + 1 }]);
        onOutput("Mission & Vision", result.punchline || result.mission);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🧭 Mission & Vision Generator</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Define your "why" with powerful, emotional statements that align your team.</p>
      </div>

      {rounds.length === 0 && !loading && (
        <button className="btn-primary" onClick={() => generate()}>Generate Mission & Vision</button>
      )}

      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(2)].map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>}

      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}{round.spec ? ` · ${round.spec}` : ""}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Mission */}
            <div className="card" style={{ padding: "24px 28px", borderTop: "4px solid var(--teal)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>🎯 Mission Statement</div>
              <p style={{ color: "var(--text)", fontSize: 16, lineHeight: 1.7, fontWeight: 600 }}>"{round.mission}"</p>
            </div>
            {/* Vision */}
            <div className="card" style={{ padding: "24px 28px", borderTop: "4px solid var(--violet)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--violet)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>👁️ Vision Statement</div>
              <p style={{ color: "var(--text)", fontSize: 16, lineHeight: 1.7, fontWeight: 600 }}>"{round.vision}"</p>
            </div>
          </div>
          {round.punchline && (
            <div className="card" style={{ marginTop: 16, padding: "20px 24px", background: "rgba(124,77,255,0.04)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>💡 Elevator Pitch / Tagline</div>
              <div style={{ fontSize: 18, color: "var(--text)", fontFamily: "Fredoka One" }}>{round.punchline}</div>
            </div>
          )}
        </div>
      ))}

      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Ambitious", "Short & Punchy", "Focus on Community", "Focus on Innovation", "More Emotional"]} />
      )}
    </div>
  );
}

// ─── Brand Identity Page ───────────────────────────────────────────────────────
export function BrandIdentityPage({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect }) {
  const [activeTool, setActiveTool] = useState("names");

  const tools = [
    { id: "names",   emoji: "✨", label: "Brand Names" },
    { id: "logo",    emoji: "🎯", label: "Logo Creator" },
    { id: "colors",  emoji: "🎨", label: "Color Palette" },
    { id: "fonts",   emoji: "🖋️", label: "Typography" },
    { id: "mission", emoji: "🧭", label: "Mission & Vision" },
    { id: "website", emoji: "🌐", label: "Website Gen" },
  ];

  return (
    <PageShell
      emoji="🎨" title="Brand Identity" color="#7C4DFF"
      desc="Build the visual and verbal foundation of your brand."
      tools={tools} activeId={activeTool} onSetActive={setActiveTool}
    >
      {activeTool === "names"   && <BrandNamesTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} selectedOutputs={selectedOutputs} onSelect={onSelect} />}
      {activeTool === "logo"    && <LogoCreatorTool brandProfile={brandProfile} onOutput={onOutput} selectedOutputs={selectedOutputs} onSelect={onSelect} />}
      {activeTool === "colors"  && <ColorPaletteTool brandProfile={brandProfile} onOutput={onOutput} selectedOutputs={selectedOutputs} onSelect={onSelect} />}
      {activeTool === "fonts"   && <FontPairingTool brandProfile={brandProfile} onOutput={onOutput} selectedOutputs={selectedOutputs} onSelect={onSelect} />}
      {activeTool === "mission" && <MissionVisionTool brandProfile={brandProfile} onOutput={onOutput} />}
      {activeTool === "website" && <WebsiteGenerationTool brandProfile={brandProfile} onOutput={onOutput} />}
    </PageShell>
  );
}
