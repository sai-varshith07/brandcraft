import { useState, useRef, useEffect } from "react";
import { puterAIJSON } from "../utils/puter";
import { puterFSWrite } from "../utils/puter";
import { PageShell } from "./PageShell";
import { SkeletonCard } from "./UI";

// ─── QR Code Generator ────────────────────────────────────────────────────────
function QRCodeTool({ brandProfile }) {
  const [url, setUrl]       = useState(brandProfile?.website || "https://mybrand.com");
  const [size, setSize]     = useState(200);
  const [color, setColor]   = useState("#7C4DFF");
  const qrRef               = useRef(null);
  const qrInstance          = useRef(null);

  const generateQR = () => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = "";
    if (window.QRCode) {
      qrInstance.current = new window.QRCode(qrRef.current, {
        text: url,
        width: size,
        height: size,
        colorDark: color,
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H,
      });
    }
  };

  useEffect(() => { setTimeout(generateQR, 100); }, [url, size, color]);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${brandProfile?.brandName || "brand"}-qrcode.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>📱 QR Code Generator</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Create a branded QR code for your website, menu, portfolio, or campaign.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", display: "block", marginBottom: 6 }}>URL / Content</label>
            <input
              className="input-base"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://yourbrand.com"
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", display: "block", marginBottom: 6 }}>Color</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width: 44, height: 36, borderRadius: 8, border: "1.5px solid var(--border)", cursor: "pointer", padding: 2 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "monospace" }}>{color}</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", display: "block", marginBottom: 6 }}>Size: {size}px</label>
            <input type="range" min={120} max={400} step={20} value={size} onChange={e => setSize(+e.target.value)}
              style={{ width: "100%", accentColor: color }} />
          </div>

          {/* Quick presets */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", display: "block", marginBottom: 8 }}>Quick Presets</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "Instagram", url: "https://instagram.com/" },
                { label: "LinkedIn", url: "https://linkedin.com/in/" },
                { label: "Portfolio", url: "https://portfolio.yourdomain.com" },
                { label: "Menu", url: "https://menu.yourdomain.com" },
              ].map(p => (
                <button key={p.label} onClick={() => setUrl(p.url)}
                  style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QR Preview */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ padding: 24, background: "#fff", borderRadius: 20, boxShadow: "0 12px 40px rgba(124,77,255,0.12)", border: "1.5px solid var(--border)" }}>
            <div ref={qrRef} />
            {!window.QRCode && (
              <div style={{ width: size, height: size, background: "var(--bg2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--text3)" }}>
                Loading QR…
              </div>
            )}
          </div>
          <button onClick={downloadQR} className="btn-primary" style={{ width: "100%" }}>
            📥 Download QR Code
          </button>
          <button onClick={() => navigator.clipboard.writeText(url)} className="btn-ghost" style={{ width: "100%", fontSize: 12 }}>
            📋 Copy URL
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shareable Brand Card ─────────────────────────────────────────────────────
function ShareableBrandCard({ brandProfile, selectedOutputs }) {
  const cardRef  = useRef(null);
  const [theme, setTheme] = useState("gradient");

  const themes = {
    gradient: { bg: "linear-gradient(135deg, #7C4DFF 0%, #F050A8 50%, #00C9B4 100%)", text: "#fff", sub: "rgba(255,255,255,0.75)" },
    dark:     { bg: "linear-gradient(135deg, #0F0A28 0%, #1A1040 100%)", text: "#fff", sub: "rgba(255,255,255,0.55)" },
    light:    { bg: "linear-gradient(135deg, #FAFAFF 0%, #F0EBFF 100%)", text: "#1A1232", sub: "#6B5B8A" },
    gold:     { bg: "linear-gradient(135deg, #1A0A00 0%, #3D1C00 100%)", text: "#FFD700", sub: "#C8A840" },
  };
  const t = themes[theme];

  const bp = brandProfile || {};

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `${bp.brandName || "brand"}-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Download requires html2canvas. Run: npm install html2canvas");
    }
  };

  const copyShareText = () => {
    const text = `✨ ${bp.brandName || "My Brand"} — ${bp.businessDo || "Building something amazing"}. Built with BrandCraft.`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🃏 Shareable Brand Card</h2>
        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 8 }}>Generate a stunning visual summary of your brand to share anywhere.</p>
        <p style={{ color: "var(--violet)", fontSize: 12, fontWeight: 700 }}>💡 Tip: Click on the text inside the card to edit directly before downloading!</p>
      </div>

      {/* Theme selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {Object.keys(themes).map(k => (
          <button key={k} onClick={() => setTheme(k)}
            style={{ padding: "7px 16px", borderRadius: 99, border: `1.5px solid ${theme === k ? "var(--violet)" : "var(--border)"}`, background: theme === k ? "var(--violet-soft)" : "transparent", color: theme === k ? "var(--violet)" : "var(--text2)", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>
            {k}
          </button>
        ))}
      </div>

      {/* Card Preview */}
      <div ref={cardRef} style={{
        borderRadius: 24, padding: "36px 40px", background: t.bg,
        maxWidth: 480, margin: "0 auto 24px",
        boxShadow: "0 24px 60px rgba(124,77,255,0.25)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo area */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              📖
            </div>
            <div>
              <div contentEditable suppressContentEditableWarning style={{ fontFamily: "Fredoka One", fontSize: 24, color: t.text, lineHeight: 1, outline: "none", borderBottom: `1px dashed ${t.sub}` }}>{bp.brandName || "Your Brand"}</div>
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: t.sub, marginTop: 3, outline: "none", borderBottom: `1px dashed ${t.sub}` }}>{bp.industry || "Brand Studio"}</div>
            </div>
          </div>

          {/* Tagline / description */}
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, color: t.sub, lineHeight: 1.6, marginBottom: 24, maxWidth: 340, outline: "none", borderBottom: `1px dashed ${t.sub}` }}>
            {bp.businessDo ? bp.businessDo.slice(0, 120) + (bp.businessDo.length > 120 ? "…" : "") : "Building a remarkable brand experience for the world."}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {[bp.brandVoice, bp.designAesthetic, bp.colorMood, bp.logoStyle].filter(Boolean).map((tag, i) => (
              <span key={i} style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(255,255,255,0.14)", fontSize: 11, fontWeight: 700, color: t.text }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: t.sub, fontWeight: 700 }}>Brand Completion</span>
              <span style={{ fontSize: 11, color: t.text, fontWeight: 800 }}>{Object.keys(selectedOutputs || {}).length}/7</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }}>
              <div style={{ height: "100%", width: `${(Object.keys(selectedOutputs || {}).length / 7) * 100}%`, borderRadius: 99, background: t.text, opacity: 0.9 }} />
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: 11, color: t.sub }}>Built with BrandCraft ✨</div>
            <div style={{ fontSize: 11, color: t.sub }}>Powered by Puter.js</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={downloadCard} className="btn-primary">📥 Download Card</button>
        <button onClick={copyShareText} className="btn-ghost">📋 Copy Share Text</button>
        <button onClick={() => {
          if (navigator.share) {
            navigator.share({ title: bp.brandName || "My Brand", text: `Check out my brand built with BrandCraft!` });
          }
        }} className="btn-ghost">🔗 Share</button>
      </div>
    </div>
  );
}

// ─── Canva Export Guide ───────────────────────────────────────────────────────
function CanvaExportTool({ brandProfile, selectedOutputs }) {
  const [kit, setKit]     = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await puterAIJSON(
        `You are a Canva expert. Return a JSON brand kit for Canva:
{
  "primaryColor": "<hex>",
  "secondaryColor": "<hex>",
  "accentColor": "<hex>",
  "backgroundColors": ["<hex>", "<hex>"],
  "headingFont": "<Google Font name>",
  "bodyFont": "<Google Font name>",
  "canvaTemplates": [
    { "name": "<template category>", "url": "https://www.canva.com/search/templates?q=<encoded query>", "use": "<when to use>" }
  ],
  "brandKitInstructions": ["<5 steps to set up brand kit in Canva>"]
}`,
        `Brand profile: ${JSON.stringify(brandProfile || {})}`
      );
      setKit(data);
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🎨 Export to Canva</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Get your brand kit ready to import into Canva in one click.</p>
      </div>

      <button className="btn-primary" onClick={generate} disabled={loading} style={{ marginBottom: 24 }}>
        {loading ? "Generating kit…" : "Generate Canva Brand Kit"}
      </button>

      {loading && <SkeletonCard lines={4} />}

      {kit && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Colors */}
          <div className="card" style={{ padding: "18px 22px" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 14 }}>🎨 Brand Colors</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Primary", color: kit.primaryColor },
                { label: "Secondary", color: kit.secondaryColor },
                { label: "Accent", color: kit.accentColor },
                ...(kit.backgroundColors || []).map((c, i) => ({ label: `BG ${i + 1}`, color: c })),
              ].map((c, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: c.color, marginBottom: 6, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                    onClick={() => navigator.clipboard.writeText(c.color)} title={`Copy ${c.color}`} />
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)" }}>{c.label}</div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--text3)" }}>{c.color}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="card" style={{ padding: "18px 22px" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>✍️ Typography</div>
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 4 }}>HEADING</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{kit.headingFont}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 4 }}>BODY</div>
                <div style={{ fontSize: 15, color: "var(--text2)" }}>{kit.bodyFont}</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="card" style={{ padding: "18px 22px" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>📋 Setup in Canva</div>
            {(kit.brandKitInstructions || []).map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--violet-soft)", border: "1.5px solid rgba(124,77,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--violet)", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Canva templates */}
          {kit.canvaTemplates?.length > 0 && (
            <div className="card" style={{ padding: "18px 22px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>🔗 Recommended Templates</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {kit.canvaTemplates.map((t, i) => (
                  <a key={i} href={t.url} target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "rgba(255,252,255,0.7)", textDecoration: "none", transition: "all 0.18s" }}>
                    <span style={{ fontSize: 18 }}>🖼️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{t.use}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--violet)", fontWeight: 700 }}>Open →</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <a href="https://www.canva.com/brand-kits/" target="_blank" rel="noreferrer" className="btn-primary" style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
            Open Canva Brand Kit →
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Share Page ───────────────────────────────────────────────────────────────
export function SharePage({ brandProfile, selectedOutputs }) {
  const [tool, setTool] = useState("card");

  const tools = [
    { id: "card",  label: "Brand Card",      emoji: "🃏" },
    { id: "qr",    label: "QR Code",         emoji: "📱" },
    { id: "canva", label: "Export to Canva", emoji: "🎨" },
  ];

  return (
    <PageShell title="Share 🚀" subtitle="Export, share, and publish your brand to the world.">
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

      {tool === "card"  && <ShareableBrandCard brandProfile={brandProfile} selectedOutputs={selectedOutputs} />}
      {tool === "qr"    && <QRCodeTool brandProfile={brandProfile} />}
      {tool === "canva" && <CanvaExportTool brandProfile={brandProfile} selectedOutputs={selectedOutputs} />}
    </PageShell>
  );
}
