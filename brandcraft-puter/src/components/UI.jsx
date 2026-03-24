import { useState } from "react";
import Icon from "./Icon";
import { useToast } from "../hooks/useToast";

// ─── Skeleton Loader ───────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ animation: "cardIn 0.4s ease" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 14, marginBottom: 10, width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}

// ─── Output Card Actions ───────────────────────────────────────────────────────
export function OutputActions({ text, onStar, starred, onSave, onSelect, selected, feature, id }) {
  const { show, msg } = useToast();
  return (
    <div className="output-actions">
      {msg && <div style={{ fontSize: 11, color: "var(--teal)", display: "flex", alignItems: "center" }}>{msg}</div>}
      <button className={`action-btn ${starred ? "starred" : ""}`} onClick={() => { onStar?.(); show("★ Favourited"); }} title="Favourite">
        {starred ? <Icon name="star" size={13} /> : <Icon name="starO" size={13} />}
      </button>
      {onSelect && (
        <button className={`action-btn ${selected ? "selected" : ""}`} onClick={() => { onSelect(feature, id, text); show("✓ Selected as final!"); }} title="Select as Final">
          <Icon name="check" size={13} />
        </button>
      )}
      {text && (
        <button className="action-btn" onClick={() => { navigator.clipboard.writeText(text); show("Copied!"); }} title="Copy">
          <Icon name="copy" size={13} />
        </button>
      )}
      <button className="action-btn" onClick={() => { onSave?.(); show("Saved!"); }} title="Save">
        <Icon name="save" size={13} />
      </button>
    </div>
  );
}

// ─── Generate More Panel ───────────────────────────────────────────────────────
export function GenerateMorePanel({ onGenerate, chips = [], loading }) {
  const [open, setOpen] = useState(false);
  const [spec, setSpec] = useState("");
  const [selected, setSelected] = useState([]);

  const handleGenerate = () => {
    const combined = [selected.join(", "), spec].filter(Boolean).join(". ");
    onGenerate(combined || "Generate a new variation");
    setOpen(false);
    setSpec("");
    setSelected([]);
  };

  return (
    <div style={{ marginTop: 20 }}>
      {!open ? (
        <button className="btn-ghost btn-sm" onClick={() => setOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={14} /> Generate More
        </button>
      ) : (
        <div className="gen-panel">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "var(--teal)" }}>What would you like to change?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
            {chips.map(c => (
              <span
                key={c}
                className={`chip ${selected.includes(c) ? "active" : ""}`}
                onClick={() => setSelected(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c])}
              >
                {c}
              </span>
            ))}
          </div>
          <textarea
            className="input-base"
            rows={2}
            placeholder="Or describe what you want... e.g. 'Make it more playful and youthful'"
            value={spec}
            onChange={e => setSpec(e.target.value)}
            style={{ resize: "none", marginBottom: 12 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary btn-sm" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating…" : "Generate"}
            </button>
            <button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tool Section Wrapper ──────────────────────────────────────────────────────
export function ToolSection({ title, desc, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{title}</h2>
      {desc && <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 20 }}>{desc}</p>}
      {children}
    </div>
  );
}
