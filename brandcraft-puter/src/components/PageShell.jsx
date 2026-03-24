import { useState } from "react";

// ─── Unified Tab Page Shell ────────────────────────────────────────────────────
// Replaces the old left-sidebar PageShell across Brand Identity, Content & Copy,
// and Voice & Style. All tools now live in a single scrollable page with a
// top tab bar — no more nested sidebar-within-sidebar layout.
export function PageShell({ emoji, title, desc, subtitle, color = "#7C4DFF", tools, activeId, onSetActive, children }) {
  const rgb = (() => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "124,77,255";
  })();

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-shell-header">
        <div>
          {emoji && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 99,
              background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)`,
              fontSize: 11, fontWeight: 700, color: color, marginBottom: 10,
            }}>
              <span>{emoji}</span> {title}
            </div>
          )}
          <h1 style={{
            fontFamily: "Fredoka One", fontSize: 28, color: "var(--text)", marginBottom: 4, lineHeight: 1.1,
          }}>{title}</h1>
          <p style={{ color: "var(--text2)", fontSize: 13, maxWidth: 440, lineHeight: 1.55 }}>{desc || subtitle}</p>
        </div>

        {/* Tab bar */}
        {tools && tools.length > 0 && (
          <div className="page-shell-tabs">
            {tools.map((t) => (
              <button
                key={t.id}
                className={`page-shell-tab${activeId === t.id ? " active" : ""}`}
                onClick={() => onSetActive(t.id)}
              >
                <span style={{ fontSize: 15, transition: "transform 0.22s var(--spring)", transform: activeId === t.id ? "scale(1.18)" : "scale(1)" }}>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tool content */}
      <div key={activeId} className="page-shell-content">
        {children}
      </div>
    </div>
  );
}
