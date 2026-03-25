import { useState, useEffect, useRef, useCallback } from "react";
import "./styles/global.css";

import { useToast } from "./hooks/useToast";
import { LanguageProvider } from "./hooks/useLanguage";
import { ThemeProvider } from "./hooks/useTheme";
import { usePuterStorage } from "./hooks/usePuter";
import { puterIsSignedIn, isPuterReady } from "./utils/puter";

import LandingPage from "./components/LandingPage";
import { AuthPage, OnboardingPage } from "./components/AuthOnboarding";
import { AppShell } from "./components/AppShellDashboard";
import Dashboard from "./components/Dashboard";
import { BrandIdentityPage } from "./components/BrandIdentity";
import { ContentCopyPage } from "./components/ContentCopy";
import { VoiceStylePage, SettingsPage } from "./components/VoiceSettings";
import AIChatWidget from "./components/AIChatWidget";
import { DiscoverPage } from "./components/DiscoverTools";
import { ManagePage } from "./components/ManagePage";
import { SharePage } from "./components/SharePage";
import Confetti from "react-confetti";

const APP_PAGES = ["dashboard", "brand-identity", "content-copy", "voice-style", "settings", "discover", "manage", "share"];

const motivationalMessages = [
  "🌟 Amazing choice! Your brand is getting stronger!",
  "✨ Fantastic! You're building something special!",
  "🎯 Perfect pick! Your brand identity is coming together!",
  "💪 Great selection! Keep building your dream brand!",
  "🚀 You're on fire! Your brand is shining brighter!",
  "🌈 Beautiful choice! Your brand story is unfolding!",
  "🏆 Brilliant! You're creating a legendary brand!",
  "💫 Wonderful! Your brand is getting unique!",
];
const celebrationMessages = [
  "🎉 Congratulations! You've completed your brand identity!",
  "🏆 Amazing! Your brand package is ready to shine!",
  "✨ Wow! You've built a complete brand!",
];

// ─── Puter Status Badge ───────────────────────────────────────────────────────
function PuterBadge() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const check = () => {
      if (isPuterReady()) { setReady(true); setSignedIn(puterIsSignedIn()); }
      else setTimeout(check, 500);
    };
    check();
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 80, right: 28, zIndex: 490,
      display: "flex", alignItems: "center", gap: 6,
      background: ready ? "rgba(0,201,180,0.1)" : "rgba(255,173,0,0.1)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      border: `1.5px solid ${ready ? "rgba(0,201,180,0.3)" : "rgba(255,173,0,0.3)"}`,
      borderRadius: 99, padding: "6px 12px",
      fontSize: 11, fontWeight: 700,
      color: ready ? "var(--teal)" : "#FFAD00",
      fontFamily: "Nunito",
      animation: "slideUp 0.5s 2s both",
      pointerEvents: "none",
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: ready ? "var(--teal)" : "#FFAD00", boxShadow: ready ? "0 0 6px rgba(0,201,180,0.6)" : "0 0 6px rgba(255,173,0,0.6)", animation: "pulseBeat 2s infinite" }} />
      {ready ? (signedIn ? "Puter.js ✓ Synced" : "Puter.js ✓ Ready") : "Puter.js Loading…"}
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────────
function CommandPalette({ open, onClose, onNav, user }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  const allCommands = [
    { icon: "🏠", label: "Dashboard", shortcut: "G D", action: () => onNav("dashboard"), group: "Navigate", requires: "auth" },
    { icon: "🔍", label: "Discover", shortcut: "G R", action: () => onNav("discover"), group: "Navigate", requires: "auth" },
    { icon: "🎨", label: "Brand Identity", shortcut: "G B", action: () => onNav("brand-identity"), group: "Navigate", requires: "auth" },
    { icon: "✍️", label: "Content & Copy", shortcut: "G C", action: () => onNav("content-copy"), group: "Navigate", requires: "auth" },
    { icon: "🎙️", label: "Voice & Style", shortcut: "G V", action: () => onNav("voice-style"), group: "Navigate", requires: "auth" },
    { icon: "📋", label: "Manage", shortcut: "G M", action: () => onNav("manage"), group: "Navigate", requires: "auth" },
    { icon: "🚀", label: "Share", shortcut: "G H", action: () => onNav("share"), group: "Navigate", requires: "auth" },
    { icon: "⚙️", label: "Settings", shortcut: "G X", action: () => onNav("settings"), group: "Navigate", requires: "auth" },
    { icon: "✨", label: "Landing Page", shortcut: "", action: () => onNav("landing"), group: "Navigate", requires: null },
    { icon: "🔑", label: "Log In", shortcut: "", action: () => onNav("login"), group: "Account", requires: null },
    { icon: "🌐", label: "Domain Checker", shortcut: "", action: () => onNav("discover"), group: "Tools", requires: "auth" },
    { icon: "🕵️", label: "Steal This Brand", shortcut: "", action: () => onNav("discover"), group: "Tools", requires: "auth" },
    { icon: "📊", label: "Brand Score", shortcut: "", action: () => onNav("manage"), group: "Tools", requires: "auth" },
    { icon: "🔬", label: "Consistency Check", shortcut: "", action: () => onNav("manage"), group: "Tools", requires: "auth" },
    { icon: "🃏", label: "Brand Card", shortcut: "", action: () => onNav("share"), group: "Tools", requires: "auth" },
    { icon: "📱", label: "QR Code", shortcut: "", action: () => onNav("share"), group: "Tools", requires: "auth" },
    { icon: "🌐", label: "Website Generator", shortcut: "", action: () => onNav("brand-identity"), group: "Tools", requires: "auth" },
    { icon: "🖼️", label: "Post Mockup", shortcut: "", action: () => onNav("content-copy"), group: "Tools", requires: "auth" },
  ].filter(c => !c.requires || (c.requires === "auth" && user));

  const filtered = query.trim()
    ? allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : allCommands;

  useEffect(() => {
    if (open) { setQuery(""); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);
  useEffect(() => { setActiveIdx(0); }, [query]);
  const run = useCallback((cmd) => { cmd.action(); onClose(); }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[activeIdx]) { run(filtered[activeIdx]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx, run, onClose]);

  if (!open) return null;
  const groups = [...new Set(filtered.map(c => c.group))];
  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div style={{ padding: "14px 18px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, opacity: 0.5 }}>🔍</span>
          <input ref={inputRef} className="cmd-input" style={{ flex: 1, padding: "4px 0", border: "none", borderBottom: "none" }} placeholder="Search commands, pages, tools…" value={query} onChange={e => setQuery(e.target.value)} />
          <kbd style={{ fontSize: 11, color: "#A89BC0", background: "rgba(124,77,255,0.08)", border: "1px solid rgba(124,77,255,0.15)", borderRadius: 6, padding: "3px 8px", fontFamily: "inherit", fontWeight: 700 }}>ESC</kbd>
        </div>
        <div style={{ height: 1, background: "rgba(124,77,255,0.1)", margin: "12px 0 4px" }} />
        <div className="cmd-results">
          {filtered.length === 0 && <div style={{ padding: "24px", textAlign: "center", color: "#A89BC0", fontSize: 14, fontFamily: "Nunito" }}>No results for "{query}"</div>}
          {groups.map(group => (
            <div key={group}>
              <div style={{ padding: "8px 14px 4px", fontSize: 10, fontWeight: 800, color: "#A89BC0", textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: "Nunito" }}>{group}</div>
              {filtered.filter(c => c.group === group).map(cmd => {
                const gi = filtered.indexOf(cmd);
                return (
                  <div key={cmd.label} className={`cmd-item ${gi === activeIdx ? "active" : ""}`} onClick={() => run(cmd)} onMouseEnter={() => setActiveIdx(gi)}>
                    <div className="cmd-item-icon">{cmd.icon}</div>
                    <span style={{ flex: 1 }}>{cmd.label}</span>
                    {cmd.shortcut && <span style={{ fontSize: 11, color: "#A89BC0", display: "flex", gap: 4 }}>{cmd.shortcut.split(" ").map((k, ki) => <kbd key={ki} style={{ background: "rgba(124,77,255,0.08)", border: "1px solid rgba(124,77,255,0.15)", borderRadius: 4, padding: "1px 5px", fontFamily: "inherit", fontWeight: 700, color: "#7C4DFF" }}>{k}</kbd>)}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmd-footer">
          <span><kbd className="cmd-key">↑↓</kbd> Navigate</span>
          <span><kbd className="cmd-key">↵</kbd> Select</span>
          <span><kbd className="cmd-key">⌘K</kbd> Toggle</span>
        </div>
      </div>
    </div>
  );
}

function AnimatedToast({ msg }) {
  const [exiting, setExiting] = useState(false);
  const prev = useRef(msg);
  useEffect(() => {
    if (msg && !prev.current) setExiting(false);
    if (!msg && prev.current) setExiting(true);
    prev.current = msg;
  }, [msg]);
  if (!msg && !exiting) return null;
  return <div className={`toast ${exiting ? "toast-exit" : ""}`}>{msg || prev.current}</div>;
}

function PageWrapper({ pageKey, children }) {
  const [animKey, setAnimKey] = useState(pageKey);
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    setEntering(true); setAnimKey(pageKey);
    const t = setTimeout(() => setEntering(false), 450);
    return () => clearTimeout(t);
  }, [pageKey]);
  return <div key={animKey} className={entering ? "page-enter" : ""} style={{ minHeight: "100vh" }}>{children}</div>;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState("default");
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  // Puter.js-backed persistent state
  const [brandProfile, setBrandProfile] = usePuterStorage("brandProfile", null);
  const [outputs, setOutputs] = usePuterStorage("outputs", []);
  const [favorites, setFavorites] = usePuterStorage("favorites", []);
  const [selectedOutputs, setSelectedOutputs] = usePuterStorage("selectedOutputs", {});
  const [toolOutputs, setToolOutputs] = usePuterStorage("toolOutputs", {
    "brand-names": [], "color-palette": [], "font-pairing": [],
    "logo-creator": [], "ad-copy": [], "social-bio": [],
    "email-builder": [], "content-calendar": [],
  });

  const { msg: toastMsg, show: showToast } = useToast();
  const requiredOutputs = ["Brand Names", "Color Palette", "Font Pairing", "Logo Creator", "Ad Copy", "Social Bio", "Email Templates"];

  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(o => !o); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const navigate = (target) => {
    if (APP_PAGES.includes(target) && !user) { setPage("login"); return; }
    setPage(target); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuth = (userData) => {
    setUser(userData);
    setPage(brandProfile ? "dashboard" : "onboarding");
    showToast("🎉 Welcome to BrandCraft!");
  };

  const handleOnboardingComplete = (data) => {
    setBrandProfile(data);
    setPage("dashboard");
    showToast("✨ Brand profile saved to Puter.js cloud!");
  };

  const handleOutput = (feature, preview) => {
    setOutputs([...(outputs || []), { feature, preview, time: Date.now() }]);
  };

  const saveToolOutput = (toolKey, outputData) => {
    setToolOutputs(prev => ({ ...prev, [toolKey]: [...(prev[toolKey] || []), { ...outputData, time: Date.now() }] }));
  };

  const getToolOutputs = (toolKey) => (toolOutputs || {})[toolKey] || [];

  const handleFavorite = (id) => {
    const next = (favorites || []).includes(id) ? favorites.filter(x => x !== id) : [...(favorites || []), id];
    setFavorites(next); showToast("⭐ Saved to favourites!");
  };

  const handleSelect = (feature, outputId, outputText) => {
    const wasAll = requiredOutputs.every(k => (selectedOutputs || {})[k]);
    const next = { ...(selectedOutputs || {}), [feature]: { id: outputId, text: outputText } };
    setSelectedOutputs(next);
    setConfettiType("default"); setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    showToast(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    const allNow = requiredOutputs.every(k => k === feature ? true : (selectedOutputs || {})[k]);
    if (allNow && !wasAll) {
      setTimeout(() => {
        setConfettiType("celebration"); setShowConfetti(true);
        setCelebrationMessage(celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]);
        setShowCelebration(true);
        setTimeout(() => { setShowConfetti(false); setShowCelebration(false); }, 6000);
      }, 3500);
    }
  };

  const handleDownloadPDF = () => {
    showToast("📄 Preparing your Brand PDF…");
    setTimeout(() => showToast("✅ Your Brand PDF is ready!"), 2000);
  };

  const appProps = {
    brandProfile, onOutput: handleOutput,
    favorites: favorites || [], onFavorite: handleFavorite,
    selectedOutputs: selectedOutputs || {}, onSelect: handleSelect,
    onDownloadPDF: handleDownloadPDF,
    toolOutputs: toolOutputs || {}, saveToolOutput, getToolOutputs,
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {showConfetti && <Confetti numberOfPieces={confettiType === "celebration" ? 300 : 100} recycle={false} />}
        <AnimatedToast msg={toastMsg} />
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNav={navigate} user={user} />
        <PuterBadge />

        {page === "landing" && !cmdOpen && (
          <div onClick={() => setCmdOpen(true)} style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 500,
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,252,248,0.88)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1.5px solid rgba(124,77,255,0.2)",
            borderRadius: 99, padding: "10px 16px", cursor: "pointer",
            boxShadow: "0 8px 24px rgba(124,77,255,0.15)",
            fontSize: 13, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito",
            transition: "all 0.2s var(--ease-spring)",
            animation: "slideUp 0.5s 1.5s both",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(124,77,255,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,77,255,0.15)"; }}>
            <span style={{ fontSize: 15 }}>⌘</span>
            <span>Quick Actions</span>
            <kbd style={{ background: "rgba(124,77,255,0.12)", border: "1px solid rgba(124,77,255,0.2)", borderRadius: 5, padding: "2px 6px", fontSize: 11, color: "#7C4DFF" }}>K</kbd>
          </div>
        )}

        <PageWrapper pageKey={page}>
          {page === "landing" && <LandingPage onNav={navigate} />}
          {page === "signup" && <AuthPage type="signup" onAuth={handleAuth} onNav={navigate} />}
          {page === "login" && <AuthPage type="login" onAuth={handleAuth} onNav={navigate} />}
          {page === "onboarding" && <OnboardingPage user={user} onComplete={handleOnboardingComplete} />}

          {APP_PAGES.includes(page) && user && (
            <AppShell page={page} onNav={navigate} user={user} onCmdOpen={() => setCmdOpen(true)}>
              {page === "dashboard" && <Dashboard brandProfile={brandProfile} onNav={navigate} outputs={outputs || []} favorites={favorites || []} selectedOutputs={selectedOutputs || {}} onDownloadPDF={handleDownloadPDF} />}
              {page === "discover" && <DiscoverPage brandProfile={brandProfile} onOutput={handleOutput} />}
              {page === "brand-identity" && <BrandIdentityPage {...appProps} />}
              {page === "content-copy" && <ContentCopyPage {...appProps} />}
              {page === "voice-style" && <VoiceStylePage brandProfile={brandProfile} onOutput={handleOutput} />}
              {page === "manage" && <ManagePage brandProfile={brandProfile} selectedOutputs={selectedOutputs || {}} />}
              {page === "share" && <SharePage brandProfile={brandProfile} selectedOutputs={selectedOutputs || {}} />}
              {page === "settings" && <SettingsPage user={user} onNav={navigate} />}
            </AppShell>
          )}
        </PageWrapper>

        {user && <AIChatWidget brandProfile={brandProfile} />}

        {showCelebration && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,40,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, animation: "fadeIn 0.3s ease" }}>
            <div style={{ background: "linear-gradient(135deg,#7C4DFF,#FF6B9D)", borderRadius: 28, padding: 52, textAlign: "center", color: "white", maxWidth: 500, width: "90%", boxShadow: "0 32px 80px rgba(124,77,255,0.4)", animation: "bounceIn 0.5s var(--ease-spring)" }}>
              <div style={{ fontSize: 84, marginBottom: 16, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}>🎉</div>
              <h2 style={{ fontSize: 34, fontWeight: 700, marginBottom: 16, fontFamily: "Fredoka One" }}>Congratulations!</h2>
              <p style={{ fontSize: 18, marginBottom: 24, opacity: 0.95, lineHeight: 1.6 }}>{celebrationMessage}</p>
              <button onClick={() => { handleDownloadPDF(); setShowCelebration(false); }} style={{ background: "white", color: "#7C4DFF", border: "none", borderRadius: 99, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", fontFamily: "Nunito" }}>
                📥 Download Brand PDF
              </button>
            </div>
          </div>
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}
