import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

function MeshLayer() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: `
          radial-gradient(ellipse 72% 58% at 14% 18%, rgba(124,77,255,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 55% 46% at 85% 18%, rgba(240,80,168,0.08) 0%, transparent 52%),
          radial-gradient(ellipse 58% 46% at 48% 88%, rgba(90,139,255,0.07) 0%, transparent 56%),
          radial-gradient(ellipse 40% 38% at 74% 74%, rgba(0,201,180,0.05) 0%, transparent 50%)
        `,
      }}
    />
  );
}

export function AppShell({ page, onNav, user, children, onCmdOpen }) {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const langRef = useRef(null);

  const langs = [
    { name: "English", flag: "🇺🇸" },
    { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" },
    { name: "German", flag: "🇩🇪" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Arabic", flag: "🇸🇦" },
    { name: "Hindi", flag: "🇮🇳" },
    { name: "Portuguese", flag: "🇧🇷" },
    { name: "Chinese", flag: "🇨🇳" },
    { name: "Italian", flag: "🇮🇹" },
    { name: "Korean", flag: "🇰🇷" },
  ];

  const currentLang = langs.find((item) => item.name === language) || langs[0];

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    if (!langOpen) return undefined;
    const handler = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  const links = [
    { id: "dashboard", label: "Dashboard", emoji: "🏠" },
    { id: "discover", label: "Discover", emoji: "🔍" },
    { id: "brand-identity", label: "Brand Identity", emoji: "🎨" },
    { id: "content-copy", label: "Content & Copy", emoji: "✍️" },
    { id: "manage", label: "Manage", emoji: "📋" },
    { id: "share", label: "Share", emoji: "🚀" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <MeshLayer />

      <aside
        className="app-shell-sidebar"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          bottom: 16,
          width: 248,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "20px 16px",
          borderRadius: 28,
          background: "rgba(255,253,255,0.72)",
          backdropFilter: "saturate(180%) blur(28px)",
          WebkitBackdropFilter: "saturate(180%) blur(28px)",
          border: "1.5px solid rgba(124,77,255,0.16)",
          boxShadow: "0 24px 56px rgba(124,77,255,0.14), inset 0 1px 0 rgba(255,255,255,0.82)",
        }}
      >
        <div
          onClick={() => onNav("landing")}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px", borderRadius: 16, cursor: "pointer" }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #7C4DFF, #AB63FF, #F050A8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#fff",
              boxShadow: "0 10px 22px rgba(124,77,255,0.3)",
            }}
          >
            📘
          </div>
          <div>
            <div style={{ fontFamily: "Fredoka One", fontSize: 18, color: "var(--violet)", lineHeight: 1.1 }}>BrandCraft</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>
              Brand Studio
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", padding: "0 8px" }}>
            Navigation
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {links.map((link, index) => {
              const isActive = page === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNav(link.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 16,
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    background: isActive ? "linear-gradient(135deg, rgba(124,77,255,0.16), rgba(240,80,168,0.09))" : "transparent",
                    color: isActive ? "var(--violet)" : "var(--text2)",
                    fontFamily: "Nunito",
                    fontSize: 13,
                    fontWeight: isActive ? 800 : 700,
                    textAlign: "left",
                    transition: "all 0.22s var(--spring)",
                    animationDelay: `${index * 0.05}s`,
                    animation: "fadeSlideUp 0.45s var(--spring) both",
                    boxShadow: isActive ? "0 8px 18px rgba(124,77,255,0.12), inset 0 1px 0 rgba(255,255,255,0.75)" : "none",
                  }}
                  onMouseEnter={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.background = "rgba(124,77,255,0.07)";
                      event.currentTarget.style.color = "var(--violet)";
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.background = "transparent";
                      event.currentTarget.style.color = "var(--text2)";
                    }
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      borderRadius: 999,
                      background: isActive ? "linear-gradient(180deg, #7C4DFF, #AB63FF, #F050A8)" : "transparent",
                      boxShadow: isActive ? "0 0 10px rgba(124,77,255,0.35)" : "none",
                      transition: "all 0.22s ease",
                    }}
                  />
                  <span style={{ fontSize: 16 }}>{link.emoji}</span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            onClick={() => onCmdOpen?.()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 14,
              background: "rgba(124,77,255,0.06)",
              border: "1px solid var(--border)",
              fontSize: 12,
              color: "var(--text2)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <span>Quick commands</span>
            <kbd
              style={{
                background: "rgba(124,77,255,0.1)",
                border: "1px solid rgba(124,77,255,0.18)",
                borderRadius: 6,
                padding: "2px 6px",
                fontSize: 10,
                color: "var(--violet)",
                fontWeight: 800,
              }}
            >
              Ctrl K
            </kbd>
          </div>

          <div ref={langRef} style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen((open) => !open)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 14,
                cursor: "pointer",
                border: "1.5px solid var(--border)",
                background: langOpen ? "rgba(124,77,255,0.08)" : "rgba(255,253,255,0.76)",
                fontSize: 13,
                fontFamily: "Nunito",
                fontWeight: 700,
                color: "var(--text)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{currentLang.flag}</span>
                <span>{currentLang.name}</span>
              </span>
              <span style={{ fontSize: 10, transition: "transform 0.2s", transform: langOpen ? "rotate(180deg)" : "none" }}>▼</span>
            </button>

            {langOpen && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "calc(100% + 8px)",
                  background: "rgba(255,253,255,0.97)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 16,
                  zIndex: 2000,
                  boxShadow: "var(--shadow-lg)",
                  maxHeight: 260,
                  overflowY: "auto",
                  animation: "panelIn 0.22s var(--spring)",
                  backdropFilter: "blur(24px)",
                }}
              >
                {langs.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setLanguage(item.name);
                      setLangOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "9px 14px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "Nunito",
                      color: language === item.name ? "var(--violet)" : "var(--text)",
                      background: language === item.name ? "var(--violet-soft)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.flag}</span>
                    <span>{item.name}</span>
                    {language === item.name && <span style={{ marginLeft: "auto", color: "var(--violet)", fontSize: 12 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            onClick={() => onNav("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 16,
              cursor: "pointer",
              border: "1.5px solid var(--border)",
              background: "rgba(255,253,255,0.74)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--violet), var(--pink))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "Fredoka One",
                boxShadow: "0 2px 6px var(--violet-glow)",
              }}
            >
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 150,
                }}
              >
                {user?.email?.split("@")[0] || "User"}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>Settings</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="app-shell-main" style={{ position: "relative", zIndex: 1, padding: "16px 16px 96px 288px" }}>
        {isLoading ? (
          <div style={{ padding: "24px 12px", animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div className="skeleton skeleton-title" style={{ width: 220, height: 32 }} />
              <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 99 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card" style={{ animation: "cardIn 0.4s var(--spring)" }}>
                  <div className="skeleton skeleton-title" style={{ marginBottom: 16, width: "55%" }} />
                  <div className="skeleton skeleton-text" style={{ marginBottom: 10 }} />
                  <div className="skeleton skeleton-text" style={{ marginBottom: 10 }} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ animation: "pageIn 0.5s var(--spring)" }}>{children}</div>
        )}
      </main>

      <nav className="mobile-nav">
        {links.map((link) => (
          <div key={link.id} className={`mobile-nav-item ${page === link.id ? "active" : ""}`} onClick={() => onNav(link.id)}>
            <span style={{ fontSize: 18 }}>{link.emoji}</span>
            <span>{link.label.split(" ")[0]}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
