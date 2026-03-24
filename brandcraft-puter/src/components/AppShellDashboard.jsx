import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { useLanguage } from "../hooks/useLanguage";
import { callAIJSON } from "../utils/api";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    }, 100);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);
}

function MeshLayer() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      background: `
        radial-gradient(ellipse 70% 55% at 10% 20%, rgba(124,77,255,0.07) 0%, transparent 60%),
        radial-gradient(ellipse 55% 45% at 90% 15%, rgba(240,80,168,0.06) 0%, transparent 50%),
        radial-gradient(ellipse 50% 40% at 50% 90%, rgba(0,201,180,0.04) 0%, transparent 55%)
      `,
    }} />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ animation: "cardIn 0.4s var(--spring)" }}>
      <div className="skeleton skeleton-title" style={{ marginBottom: 16, width: "55%" }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ marginBottom: 10, width: i === lines - 1 ? "65%" : "100%", animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

// ─── Floating Glass Navbar ─────────────────────────────────────────────────────
export function AppShell({ page, onNav, user, children, onCmdOpen }) {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef(null);

  const langs = [
    { name:"English", flag:"🇺🇸" }, { name:"Spanish", flag:"🇪🇸" },
    { name:"French", flag:"🇫🇷" }, { name:"German", flag:"🇩🇪" },
    { name:"Japanese", flag:"🇯🇵" }, { name:"Arabic", flag:"🇸🇦" },
    { name:"Hindi", flag:"🇮🇳" }, { name:"Portuguese", flag:"🇧🇷" },
    { name:"Chinese", flag:"🇨🇳" }, { name:"Italian", flag:"🇮🇹" },
    { name:"Korean", flag:"🇰🇷" },
  ];
  const currentLang = langs.find(l => l.name === language) || langs[0];

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 580);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  const links = [
    { id:"dashboard",      label:"Dashboard",      emoji:"🏠" },
    { id:"discover",       label:"Discover",       emoji:"🔍" },
    { id:"brand-identity", label:"Brand Identity", emoji:"🎨" },
    { id:"content-copy",   label:"Content & Copy", emoji:"✍️" },
    { id:"manage",         label:"Manage",         emoji:"📋" },
    { id:"share",          label:"Share",          emoji:"🚀" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", position:"relative" }}>
      <MeshLayer />

      {/* ── FLOATING GLASS NAVBAR ── */}
      <nav style={{
        position: "fixed",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: 1100,
        zIndex: 1000,
        borderRadius: 22,
        height: 60,
        padding: "0 10px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: scrolled ? "rgba(251,247,255,0.88)" : "rgba(255,253,255,0.72)",
        backdropFilter: "saturate(200%) blur(28px)",
        WebkitBackdropFilter: "saturate(200%) blur(28px)",
        border: scrolled ? "1.5px solid rgba(124,77,255,0.24)" : "1.5px solid rgba(124,77,255,0.14)",
        boxShadow: scrolled
          ? "0 8px 40px rgba(124,77,255,0.18), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
          : "0 4px 24px rgba(124,77,255,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Logo */}
        <div
          onClick={() => onNav("landing")}
          style={{
            display: "flex", alignItems: "center", gap: 9, padding: "6px 10px",
            borderRadius: 14, cursor: "pointer", flexShrink: 0, marginRight: 4,
            transition: "all 0.2s var(--spring)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(124,77,255,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #7C4DFF, #F050A8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: "0 3px 12px rgba(124,77,255,0.35)",
          }}>📖</div>
          <div>
            <div style={{ fontFamily:"Fredoka One", fontSize: 17, color:"var(--violet)", lineHeight: 1 }}>BrandCraft</div>
            <div style={{ fontSize: 8, color:"var(--text3)", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginTop: 1 }}>Brand Studio</div>
          </div>
        </div>

        <div style={{ width: 1, height: 26, background: "var(--border)", flexShrink: 0 }} />

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, padding: "0 4px" }}>
          {links.map((l, i) => {
            const isActive = page === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onNav(l.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 12px", borderRadius: 12, border: "none",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(124,77,255,0.13), rgba(240,80,168,0.07))"
                    : "transparent",
                  color: isActive ? "var(--violet)" : "var(--text2)",
                  fontFamily: "Nunito", fontSize: 13, fontWeight: isActive ? 800 : 600,
                  cursor: "pointer", whiteSpace: "nowrap", position: "relative",
                  boxShadow: isActive ? "0 2px 10px rgba(124,77,255,0.14), inset 0 1px 0 rgba(255,255,255,0.5)" : "none",
                  transition: "all 0.22s var(--spring)",
                  animationDelay: `${i * 0.06}s`,
                  animation: "fadeSlideUp 0.5s var(--spring) both",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(124,77,255,0.07)"; e.currentTarget.style.color = "var(--violet)"; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}}
              >
                <span style={{ fontSize: 14, transition: "transform 0.2s var(--spring)", transform: isActive ? "scale(1.15)" : "scale(1)" }}>{l.emoji}</span>
                <span>{l.label}</span>
                {isActive && (
                  <div style={{
                    position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
                    width: 4, height: 4, borderRadius: "50%",
                    background: "var(--violet)", boxShadow: "0 0 6px var(--violet)",
                    animation: "pulseBeat 2s infinite",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <div
            onClick={() => onCmdOpen?.()}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 10,
              background: "rgba(124,77,255,0.05)", border: "1px solid var(--border)",
              fontSize: 11, color: "var(--text3)", fontWeight: 700, cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,77,255,0.1)"; e.currentTarget.style.borderColor = "var(--violet)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,77,255,0.05)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <span>⌘</span>
            <kbd style={{ background: "rgba(124,77,255,0.1)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 4px", fontSize: 10, color: "var(--violet)", fontWeight: 800 }}>K</kbd>
          </div>

          <div ref={langRef} style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "7px 10px",
                borderRadius: 10, cursor: "pointer", border: "1.5px solid var(--border)",
                background: langOpen ? "rgba(124,77,255,0.08)" : "rgba(255,253,255,0.7)",
                fontSize: 13, fontFamily: "Nunito", fontWeight: 600, color: "var(--text)",
                transition: "all 0.18s", boxShadow: "var(--shadow-xs)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--violet)"; }}
              onMouseLeave={e => { if (!langOpen) e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <span style={{ fontSize: 14 }}>{currentLang.flag}</span>
              <span style={{ fontSize: 10, transition: "transform 0.2s", transform: langOpen ? "rotate(180deg)" : "none" }}>▼</span>
            </button>
            {langOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0, width: 176,
                background: "rgba(255,253,255,0.97)", border: "1.5px solid var(--border)",
                borderRadius: 16, zIndex: 2000, boxShadow: "var(--shadow-lg)",
                maxHeight: 260, overflowY: "auto",
                animation: "panelIn 0.22s var(--spring)", backdropFilter: "blur(24px)",
              }}>
                {langs.map(l => (
                  <div key={l.name} onClick={() => { setLanguage(l.name); setLangOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", cursor: "pointer",
                      fontSize: 13, fontWeight: 600, fontFamily: "Nunito",
                      color: language===l.name ? "var(--violet)" : "var(--text)",
                      background: language===l.name ? "var(--violet-soft)" : "transparent",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (language!==l.name) e.currentTarget.style.background = "rgba(124,77,255,0.04)"; }}
                    onMouseLeave={e => { if (language!==l.name) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 16 }}>{l.flag}</span>
                    <span>{l.name}</span>
                    {language===l.name && <span style={{ marginLeft: "auto", color: "var(--violet)", fontSize: 12 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            onClick={() => onNav("settings")}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "5px 10px 5px 5px",
              borderRadius: 12, cursor: "pointer", border: "1.5px solid var(--border)",
              background: "rgba(255,253,255,0.7)", transition: "all 0.2s var(--spring)",
              boxShadow: "var(--shadow-xs)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--violet)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,77,255,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--violet), var(--pink))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "Fredoka One",
              boxShadow: "0 2px 6px var(--violet-glow)",
            }}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden", maxWidth: 100 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email?.split("@")[0] || "User"}</div>
              <div style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600 }}>⚙ Settings</div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ position: "relative", zIndex: 1, paddingTop: 88 }}>
        {isLoading ? (
          <div style={{ padding: "36px 48px", animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div className="skeleton skeleton-title" style={{ width: 220, height: 32 }} />
              <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 99 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
              {[...Array(6)].map((_,i) => <SkeletonCard key={i} lines={2} />)}
            </div>
          </div>
        ) : (
          <div style={{ animation: "pageIn 0.5s var(--spring)" }}>{children}</div>
        )}
      </main>

      <nav className="mobile-nav">
        {links.map(l => (
          <div key={l.id} className={`mobile-nav-item ${page===l.id?"active":""}`} onClick={() => onNav(l.id)}>
            <span style={{ fontSize: 18 }}>{l.emoji}</span>
            <span>{l.label.split(" ")[0]}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

// ─── Dashboard helpers ───────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "🌅" };
  if (h < 17) return { text: "Good afternoon", emoji: "☀️" };
  return { text: "Good evening", emoji: "🌙" };
}

const toolGroups = [
  {
    label: "Discover", id: "discover", color: "#7C4DFF",
    tools: [
      { name:"Domain Checker",   emoji:"🌐", color:"#7C4DFF" },
      { name:"Steal This Brand", emoji:"🕵️", color:"#F050A8" },
      { name:"Brand Story",      emoji:"📖", color:"#00C9B4" },
      { name:"Market Research",  emoji:"📈", color:"#FFAD00" },
    ],
  },
  {
    label: "Brand Identity", id: "brand-identity", color: "#F050A8",
    tools: [
      { name:"Brand Names",      emoji:"✨", color:"#7C4DFF" },
      { name:"Logo Creator",     emoji:"🎨", color:"#F050A8" },
      { name:"Color Palette",    emoji:"🌈", color:"#FFAD00" },
      { name:"Font Pairing",     emoji:"🖋️", color:"#00C9B4" },
      { name:"Mission & Vision", emoji:"🧭", color:"#E91E63" },
      { name:"Website Generator",emoji:"🌐", color:"#4CAF50" },
    ],
  },
  {
    label: "Content & Copy", id: "content-copy", color: "#00C9B4",
    tools: [
      { name:"Ad Copy",           emoji:"📣", color:"#4CAF50" },
      { name:"Social Bio",        emoji:"🌟", color:"#FF9800" },
      { name:"Email Builder",     emoji:"💌", color:"#E91E63" },
      { name:"Content Calendar",  emoji:"📅", color:"#9C27B0" },
      { name:"Post Mockup",       emoji:"🖼️", color:"#F050A8" },
      { name:"Content Automation",emoji:"🤖", color:"#00C9B4" },
      { name:"Ad Generator",      emoji:"🎯", color:"#7C4DFF" },
    ],
  },
  {
    label: "Voice & Style", id: "voice-style", color: "#F050A8",
    tools: [
      { name:"Voice Rewriter",     emoji:"🎙️", color:"#F050A8" },
      { name:"Buyer Persona",      emoji:"👥", color:"#7C4DFF" },
      { name:"Sentiment Analysis", emoji:"💡", color:"#FFAD00" },
    ],
  },
  {
    label: "Manage", id: "manage", color: "#FFAD00",
    tools: [
      { name:"Brand Score",        emoji:"📊", color:"#7C4DFF" },
      { name:"Consistency Checker",emoji:"🔬", color:"#00C9B4" },
      { name:"Sentiment Analysis", emoji:"💬", color:"#F050A8" },
      { name:"Financial Calculator",emoji:"🧮", color:"#E91E63" },
    ],
  },
  {
    label: "Share", id: "share", color: "#4CAF50",
    tools: [
      { name:"Brand Card", emoji:"🃏", color:"#7C4DFF" },
      { name:"QR Code",    emoji:"📱", color:"#00C9B4" },
      { name:"Canva Export",emoji:"🎨", color:"#FFAD00" },
    ],
  },
];
const allTools = toolGroups.flatMap(g => g.tools.map(t => ({ ...t, id: g.id })));

// ─── AI Suggestions ───────────────────────────────────────────────────────────
function AISuggestions({ brandProfile }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!brandProfile) return;
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const data = await callAIJSON(
          `You are a top-tier brand strategist. Return ONLY a valid JSON object with the format: {"suggestions":[{"title":"Actionable Title","desc":"One sentence specific advice based on the brand's profile."}]}. Generate 3 diverse and actionable strategies for this brand.`,
          JSON.stringify(brandProfile)
        );
        setSuggestions(data.suggestions || [
          { title: "Refine Your Voice", desc: "Experiment with the Voice & Style tools." },
          { title: "Generate Content", desc: "Use your new identity to generate social copy." },
          { title: "Review Identity", desc: "Double check your color palette and selected logo." }
        ]);
      } catch (err) {
        setSuggestions([
          { title: "Keep Building", desc: "Generate more assets to unlock full suggestions!" }
        ]);
      }
      setLoading(false);
    };
    fetchSuggestions();
  }, [brandProfile]);

  if (!brandProfile) return null;

  return (
    <div className="reveal glass-card" style={{ marginBottom: 24, padding: "24px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
         <div style={{ fontSize: 22 }}>🧠</div>
         <div>
           <div style={{ fontFamily: "Fredoka One", fontSize: 20, color: "var(--text)", lineHeight: 1.1 }}>AI Strategist Suggestions</div>
           <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>Data-driven next steps for your brand</div>
         </div>
      </div>
      
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
          {(Array.isArray(suggestions) ? suggestions : []).slice(0, 3).map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: "16px 18px", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)", transition: "transform 0.2s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
            >
               <div style={{ fontSize: 14, fontWeight: 800, color: "var(--violet)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                 <span style={{ fontSize: 16 }}>✨</span> {s.title || `Suggestion ${i+1}`}
               </div>
               <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, fontWeight: 500 }}>{s.desc || s.description || s.text || s}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function Dashboard({ brandProfile, outputs, onNav, onDownloadPDF, selectedOutputs }) {
  useScrollReveal();
  const [hoveredTool, setHoveredTool]     = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [circleReady, setCircleReady]     = useState(false);
  const greeting = getGreeting();

  const requiredOutputs = [
    { key:"Brand Names" }, { key:"Color Palette" }, { key:"Font Pairing" },
    { key:"Logo Creator" }, { key:"Ad Copy" }, { key:"Social Bio" }, { key:"Email Templates" },
  ];
  const selectedCount = requiredOutputs.filter(r => selectedOutputs?.[r.key]).length;
  const allSelected   = selectedCount === requiredOutputs.length;

  const score      = Math.min(100, 20 + (brandProfile ? 30 : 0) + Math.min(50, outputs.length * 3));
  const scoreColor = score >= 80 ? "var(--teal)" : score >= 50 ? "var(--gold)" : "var(--pink)";
  const circumference = 2 * Math.PI * 66;
  const dashOffset    = circumference - (score / 100) * circumference;

  const getScoreMsg = (s) => {
    if (s <= 30) return { text: "Your story is just beginning…", emoji: "🌱" };
    if (s <= 60) return { text: "The plot is thickening!", emoji: "⚡" };
    if (s <= 80) return { text: "Your brand is heating up!", emoji: "🔥" };
    return { text: "A legendary brand story!", emoji: "🏆" };
  };
  const scoreMsg = getScoreMsg(score);

  useEffect(() => {
    setTimeout(() => setCircleReady(true), 400);
    let cur = 0; const inc = score / 55;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= score) { setAnimatedScore(score); clearInterval(t); }
      else setAnimatedScore(Math.floor(cur));
    }, 28);
    return () => clearInterval(t);
  }, [score]);

  const hexToRgb = (hex) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "124,77,255";
  };

  const usedCount = allTools.filter(t => outputs.some(o => o.feature === t.name)).length;
  const profileComplete = brandProfile
    ? Math.min(100, Object.values(brandProfile).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length * 10)
    : 0;

  return (
    <div style={{ padding: "0 48px 80px", maxWidth: 1180, margin: "0 auto" }}>

      {/* ── HEADER ── */}
      <div className="reveal" style={{ marginBottom: 32 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:22 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:"var(--violet)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:5, display:"flex", alignItems:"center", gap:6 }}>
              <span>📖</span> Chapter 1
            </div>
            <h1 style={{ fontSize:"clamp(26px,3.2vw,38px)", color:"var(--text)", lineHeight:1.1, marginBottom:5, fontFamily:"Fredoka One" }}>
              {greeting.emoji} {greeting.text}, Founder!
            </h1>
            <p style={{ fontSize:14, color:"var(--text2)", fontStyle:"italic", fontWeight:500 }}>
              Every great brand starts with a single chapter. Yours is just beginning.
            </p>
          </div>
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            <button className="btn-ghost btn-sm" onClick={() => onNav("onboarding")}>📝 Edit Profile</button>
            <button className="btn-primary btn-sm" onClick={() => onNav("brand-identity")}>🎨 Build Brand</button>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
          {[
            { label:"Brand Score",  value:`${score}/100`, color:"var(--violet)", emoji:"📊", sub: scoreMsg.emoji + " " + scoreMsg.text },
            { label:"Tools Used",   value:`${usedCount}/${allTools.length}`, color:"var(--teal)", emoji:"🛠️", sub:"Keep exploring!" },
            { label:"Selections",   value:`${selectedCount}/${requiredOutputs.length}`, color:"var(--gold)", emoji:"✅", sub:"Confirmed assets" },
            { label:"Outputs",      value:outputs.length, color:"var(--pink)", emoji:"📝", sub:"Generated so far" },
          ].map((stat, i) => (
            <div key={i} style={{
              background:"rgba(255,253,255,0.85)", backdropFilter:"blur(16px)",
              border:"1.5px solid var(--border)", borderRadius:18, padding:"16px 18px",
              boxShadow:"var(--shadow-xs)", transition:"transform 0.22s var(--spring), box-shadow 0.22s",
              animation:`cardIn 0.5s var(--spring) ${i * 0.06}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="var(--shadow-xs)"; }}
            >
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)" }}>{stat.label}</div>
                <span style={{ fontSize:15 }}>{stat.emoji}</span>
              </div>
              <div style={{ fontFamily:"Fredoka One", fontSize:26, color:stat.color, lineHeight:1, marginBottom:3 }}>{stat.value}</div>
              <div style={{ fontSize:11, color:"var(--text3)", fontWeight:600, lineHeight:1.3 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCORE RING + BRAND PROFILE ROW ── */}
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20, marginBottom:24 }}>

        {/* Score ring card */}
        <div className="glass-card reveal" style={{ padding:"26px 22px", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
            Story Progress <span style={{ animation:"pulseBeat 2s infinite", display:"inline-block" }}>📊</span>
          </div>
          <div style={{ position:"relative", marginBottom:14 }}>
            <svg width="150" height="150" viewBox="0 0 160 160" style={{ overflow:"visible" }}>
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C4DFF"/>
                  <stop offset="100%" stopColor="#F050A8"/>
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(124,77,255,0.1)" strokeWidth="9"/>
              <circle cx="80" cy="80" r="66" fill="none"
                stroke="url(#ringGrad)" strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circleReady ? dashOffset : circumference}
                transform="rotate(-90 80 80)"
                style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)", filter:"drop-shadow(0 0 8px rgba(124,77,255,0.5))" }}
              />
              <text x="80" y="74" textAnchor="middle" fill={scoreColor} fontFamily="Fredoka One" fontSize="28" fontWeight="700">{animatedScore}</text>
              <text x="80" y="92" textAnchor="middle" fill="var(--text3)" fontFamily="Nunito" fontSize="11" fontWeight="700">/ 100</text>
              <text x="80" y="108" textAnchor="middle" fontSize="18">{scoreMsg.emoji}</text>
            </svg>
          </div>
          <div className="progress-bar" style={{ width:"100%", marginBottom:10 }}>
            <div className="progress-fill" style={{ width:`${score}%` }} />
          </div>
          <div style={{ fontSize:12, color:"var(--text2)", textAlign:"center", lineHeight:1.5, fontWeight:600 }}>{scoreMsg.text}</div>
          {score < 100 && (
            <div style={{ marginTop:14, padding:"9px 12px", borderRadius:11, background:"rgba(124,77,255,0.06)", border:"1px solid rgba(124,77,255,0.14)", fontSize:11, fontWeight:700, color:"var(--violet)", lineHeight:1.4, textAlign:"center", width:"100%" }}>
              {!brandProfile ? "💡 Complete your profile to boost your score!" : outputs.length < 5 ? "💡 Generate more outputs to level up!" : "💡 Select your favourite assets to finish!"}
            </div>
          )}
        </div>

        {/* Brand profile card */}
        <div className="glass-card reveal" style={{ padding:"26px 24px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,77,255,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div style={{ fontSize:17, color:"var(--text)", display:"flex", alignItems:"center", gap:8, fontFamily:"Fredoka One" }}>
              Meet Your Brand 🧡
            </div>
            {brandProfile && (
              <button className="btn-ghost btn-sm" onClick={() => onNav("onboarding")} style={{ fontSize:11 }}>✏️ Edit</button>
            )}
          </div>

          {brandProfile ? (
            <>
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.6px" }}>Profile completeness</span>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--violet)" }}>{profileComplete}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${profileComplete}%` }} />
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {[
                  { key:"Business",         value: brandProfile.businessDo,              color:"#7C4DFF" },
                  { key:"Industry",         value: brandProfile.industry,                color:"#F050A8" },
                  { key:"Stage",            value: brandProfile.businessStage,           color:"#00C9B4" },
                  { key:"Target Age",       value: brandProfile.targetAge?.join(", "),   color:"#4CAF50" },
                  { key:"Gender Focus",     value: brandProfile.genderFocus,             color:"#FFAD00" },
                  { key:"Color Mood",       value: brandProfile.colorMood,               color:"#9C27B0" },
                  { key:"Logo Style",       value: brandProfile.logoStyle,               color:"#E91E63" },
                  { key:"Design Aesthetic", value: brandProfile.designAesthetic,         color:"#3F51B5" },
                  { key:"Brand Voice",      value: brandProfile.brandVoice,              color:"#FF9800" },
                  { key:"Brand Goals",      value: brandProfile.brandGoals?.join(", "),  color:"#7C4DFF" },
                ].filter(item => item.value).map((item, i) => (
                  <div key={item.key} style={{
                    background:`rgba(${hexToRgb(item.color)},0.08)`,
                    border:`1.5px solid rgba(${hexToRgb(item.color)},0.2)`,
                    borderRadius:12, padding:"8px 12px", minWidth:90, textAlign:"center",
                    animation:`cardIn 0.5s var(--spring) ${i * 0.05}s both`,
                    transition:"transform 0.2s var(--spring), box-shadow 0.2s", cursor:"default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow=`0 8px 20px rgba(${hexToRgb(item.color)},0.18)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="none"; }}
                  >
                    <div style={{ fontSize:9, color:"var(--text3)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:3 }}>{item.key}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:`rgb(${hexToRgb(item.color)})`, lineHeight:1.3 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"28px 20px" }}>
              <div style={{ fontSize:52, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>📭</div>
              <div style={{ fontSize:20, color:"var(--text)", marginBottom:8, fontFamily:"Fredoka One" }}>No story yet!</div>
              <div style={{ fontSize:14, color:"var(--text2)", marginBottom:22, fontWeight:500, lineHeight:1.5 }}>Complete your brand profile to unlock all AI tools and get a personalised brand score.</div>
              <button className="btn-primary" onClick={() => onNav("onboarding")}>Start Your Story ✨</button>
            </div>
          )}
        </div>
      </div>

      {/* ── AI SUGGESTIONS ── */}
      {brandProfile && <AISuggestions brandProfile={brandProfile} />}

      {/* ── BRAND SELECTIONS TRACKER ── */}
      {selectedCount > 0 && (
        <div className="reveal" style={{
          background:"linear-gradient(135deg, rgba(0,201,180,0.07), rgba(124,77,255,0.05))",
          border:"1.5px solid rgba(0,201,180,0.22)", borderRadius:20, padding:"22px 24px", marginBottom:24,
          animation:"cardIn 0.5s var(--spring)",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:3, display:"flex", alignItems:"center", gap:7 }}>
                📋 Brand Selections
                {allSelected && <span style={{ background:"var(--teal)", color:"#fff", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:99 }}>COMPLETE!</span>}
              </div>
              <div style={{ fontSize:12, color:"var(--text2)", fontWeight:500 }}>{selectedCount} of {requiredOutputs.length} assets confirmed</div>
            </div>
            <div style={{
              width:50, height:50, borderRadius:"50%", flexShrink:0,
              background:`conic-gradient(var(--teal) 0deg ${(selectedCount/requiredOutputs.length)*360}deg, rgba(0,201,180,0.12) ${(selectedCount/requiredOutputs.length)*360}deg)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:800, color:"var(--teal)",
            }}>
              {selectedCount}/{requiredOutputs.length}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8, marginBottom:14 }}>
            {requiredOutputs.map(req => {
              const sel = selectedOutputs?.[req.key];
              return (
                <div key={req.key} style={{
                  display:"flex", alignItems:"center", gap:7, padding:"8px 11px",
                  background: sel ? "rgba(0,201,180,0.1)" : "rgba(0,0,0,0.03)",
                  borderRadius:10, borderLeft:`3px solid ${sel ? "var(--teal)" : "transparent"}`,
                  transition:"all 0.3s var(--spring)",
                }}>
                  <span style={{ fontSize:12, transition:"transform 0.3s var(--spring)", transform: sel ? "scale(1.2)" : "scale(1)" }}>{sel ? "✅" : "⬜"}</span>
                  <span style={{ fontSize:11, fontWeight:700, color: sel ? "var(--text)" : "var(--text2)" }}>{req.key}</span>
                </div>
              );
            })}
          </div>
          <div className="progress-bar" style={{ marginBottom:14 }}>
            <div className="progress-fill" style={{ width:`${(selectedCount/requiredOutputs.length)*100}%` }} />
          </div>
          <button className="btn-primary" onClick={allSelected ? onDownloadPDF : () => onNav("brand-identity")} style={{ width:"100%" }}>
            {allSelected ? "🎉 Download Complete Brand PDF" : "🎨 Continue Building Your Brand →"}
          </button>
        </div>
      )}

      {/* ── TOOLBOX ── */}
      <div className="reveal" style={{ marginBottom:36 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:12 }}>
          <div style={{ fontFamily:"Fredoka One", fontSize:24, color:"var(--text)", display:"flex", alignItems:"center", gap:10 }}>
            Your Toolbox 🧰
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)" }}>{usedCount}/{allTools.length} tools explored</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {toolGroups.map((group, gi) => (
            <div key={group.id}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:group.color, boxShadow:`0 0 8px ${group.color}88` }} />
                <span style={{ fontSize:12, fontWeight:800, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"1px" }}>{group.label}</span>
                <div style={{ flex:1, height:1, background:"var(--border)" }} />
                <button onClick={() => onNav(group.id)} style={{ fontSize:11, fontWeight:800, color:group.color, background:`rgba(${hexToRgb(group.color)},0.08)`, border:`1px solid rgba(${hexToRgb(group.color)},0.2)`, borderRadius:99, padding:"4px 12px", cursor:"pointer", fontFamily:"Nunito", transition:"all 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.background=`rgba(${hexToRgb(group.color)},0.16)`}
                  onMouseLeave={e => e.currentTarget.style.background=`rgba(${hexToRgb(group.color)},0.08)`}
                >Open all →</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:12 }}>
                {group.tools.map((tool, i) => {
                  const used = outputs.some(o => o.feature === tool.name);
                  const rgb  = hexToRgb(tool.color);
                  const isHov = hoveredTool === tool.name;
                  return (
                    <div key={tool.name} onClick={() => onNav(group.id)}
                      style={{
                        background: isHov ? `rgba(${rgb},0.09)` : "rgba(255,252,255,0.9)",
                        backdropFilter:"blur(12px)",
                        border:`1.5px solid ${isHov ? `rgba(${rgb},0.3)` : "var(--border)"}`,
                        borderRadius:16, padding:"15px 13px", cursor:"pointer",
                        transition:"all 0.26s var(--spring)",
                        transform: isHov ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
                        boxShadow: isHov ? `0 12px 32px rgba(${rgb},0.16)` : "var(--shadow-xs)",
                        animation:`cardIn 0.5s var(--spring) ${(gi * 4 + i) * 0.04}s both`,
                        position:"relative", overflow:"hidden",
                      }}
                      onMouseEnter={() => setHoveredTool(tool.name)}
                      onMouseLeave={() => setHoveredTool(null)}
                    >
                      {used && <div style={{ position:"absolute", top:10, right:10, width:8, height:8, borderRadius:"50%", background:"var(--teal)", boxShadow:"0 0 6px rgba(0,201,180,0.5)" }} />}
                      <div style={{ width:38, height:38, borderRadius:11, marginBottom:10, background:`rgba(${rgb},0.13)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, transition:"transform 0.26s var(--spring)", transform: isHov ? "scale(1.2) rotate(6deg)" : "scale(1) rotate(0deg)" }}>{tool.emoji}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:6, lineHeight:1.2 }}>{tool.name}</div>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 8px", borderRadius:99, fontSize:10, fontWeight:800, background: used ? "rgba(0,201,180,0.1)" : "rgba(107,91,138,0.07)", color: used ? "var(--teal)" : "var(--text3)", border:`1px solid ${used ? "rgba(0,201,180,0.2)" : "rgba(107,91,138,0.12)"}` }}>
                        {used ? "✓ Used" : "Try it"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECENT CHAPTERS ── */}
      {outputs.length > 0 && (
        <div className="glass-card reveal" style={{ padding:"26px 28px", marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ fontFamily:"Fredoka One", fontSize:20, color:"var(--text)", display:"flex", alignItems:"center", gap:8 }}>Recent Chapters 📚</div>
            <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)" }}>{outputs.length} total</div>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:5, top:8, bottom:8, width:2, background:"linear-gradient(180deg, var(--violet), var(--pink), rgba(240,80,168,0))", borderRadius:1, opacity:0.25 }} />
            {outputs.slice(-6).reverse().map((output, i) => (
              <div key={i} style={{ display:"flex", gap:20, paddingLeft:24, paddingBottom:16, position:"relative", animation:`cardIn 0.5s var(--spring) ${i * 0.07}s both` }}>
                <div style={{ position:"absolute", left:0, top:8, width:12, height:12, borderRadius:"50%", background:"linear-gradient(135deg, var(--violet), var(--pink))", boxShadow:"0 0 10px var(--violet-glow)", border:"2px solid var(--bg)" }} />
                <div style={{ flex:1, background:"rgba(124,77,255,0.03)", borderRadius:14, padding:"12px 15px", border:"1px solid var(--border)", transition:"background 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(124,77,255,0.06)"; e.currentTarget.style.borderColor="rgba(124,77,255,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(124,77,255,0.03)"; e.currentTarget.style.borderColor="var(--border)"; }}
                >
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{output.feature}</div>
                    <div style={{ fontSize:10, color:"var(--text3)", fontWeight:600 }}>{new Date(output.time).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}</div>
                  </div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:4, fontWeight:600 }}>{new Date(output.time).toLocaleDateString([], { weekday:"short", month:"short", day:"numeric" })}</div>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{output.preview}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NEXT STEPS (shown when no brand profile) ── */}
      {!brandProfile && (
        <div className="reveal" style={{ background:"linear-gradient(135deg, rgba(124,77,255,0.07), rgba(240,80,168,0.05))", border:"1.5px solid rgba(124,77,255,0.18)", borderRadius:20, padding:"22px 24px", marginBottom:24 }}>
          <div style={{ fontFamily:"Fredoka One", fontSize:18, color:"var(--text)", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>🗺️ Your Next Chapter</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { text:"Complete your brand profile",   action:() => onNav("onboarding"),    cta:"Start" },
              { text:"Generate your first brand name", action:() => onNav("brand-identity"), cta:"Go" },
              { text:"Pick a color palette",           action:() => onNav("brand-identity"), cta:"Go" },
            ].map((step, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:"rgba(255,253,255,0.7)", borderRadius:12, border:"1px solid var(--border)" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", border:"2px solid rgba(124,77,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:"var(--text3)", fontSize:10, fontWeight:800 }}>{i+1}</span>
                </div>
                <span style={{ flex:1, fontSize:13, fontWeight:600, color:"var(--text)" }}>{step.text}</span>
                <button onClick={step.action} style={{ fontSize:11, fontWeight:800, color:"var(--violet)", background:"var(--violet-soft)", border:"1px solid rgba(124,77,255,0.2)", borderRadius:99, padding:"4px 12px", cursor:"pointer", fontFamily:"Nunito" }}>{step.cta} →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div className="reveal" style={{ display:"flex", gap:12, flexWrap:"wrap", paddingBottom:40 }}>
        <button className="btn-primary" onClick={() => onNav("content-copy")}>✨ Generate Content</button>
        <button className="btn-ghost"   onClick={() => onNav("onboarding")}>📝 Update Profile</button>
        <button className="btn-ghost"   onClick={() => onNav("brand-identity")}>🎨 Brand Identity</button>
        {outputs.length > 0 && <button className="btn-ghost" onClick={onDownloadPDF}>📥 Export PDF</button>}
      </div>
    </div>
  );
}
