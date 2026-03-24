import { useState } from "react";
import Icon from "./Icon";

export function BrandSelectionConfirmation({ selectedOutputs, onConfirm, onDownloadPDF }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const totalTools = 7; // Brand Names, Color Palette, Font Pairing, Logo, Ad Copy, Social Bio, Email
  const selectedCount = Object.keys(selectedOutputs || {}).length;
  const allSelected = selectedCount === totalTools;

  const selections = [
    { key: "Brand Names", label: "Brand Name", emoji: "📝" },
    { key: "Color Palette", label: "Color Palette", emoji: "🎨" },
    { key: "Font Pairing", label: "Typography", emoji: "🔤" },
    { key: "Logo Creator", label: "Logo Design", emoji: "🎭" },
    { key: "Ad Copy", label: "Ad Copy", emoji: "📢" },
    { key: "Social Bio", label: "Social Bio", emoji: "📱" },
    { key: "Email Template", label: "Email Template", emoji: "📧" },
  ];

  return (
    <>
      {/* Selection Progress Panel */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(124,77,255,0.08) 100%)",
          border: "1px solid rgba(78,205,196,0.3)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
          position: "sticky",
          top: 20,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              📋 Your Brand Selections
            </div>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>
              {selectedCount} of {totalTools} items confirmed
            </p>
          </div>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `conic-gradient(var(--teal) 0deg ${(selectedCount / totalTools) * 360}deg, rgba(78,205,196,0.1) ${(selectedCount / totalTools) * 360}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--teal)",
            }}
          >
            {selectedCount}/{totalTools}
          </div>
        </div>

        {/* Selections List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {selections.map((sel) => {
            const isSelected = selectedOutputs?.[sel.key];
            return (
              <div
                key={sel.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: isSelected ? "rgba(78,205,196,0.1)" : "rgba(0,0,0,0.02)",
                  borderRadius: 10,
                  borderLeft: `3px solid ${isSelected ? "var(--teal)" : "transparent"}`,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 18 }}>{sel.emoji}</span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: isSelected ? "var(--text)" : "var(--text3)",
                  }}
                >
                  {sel.label}
                </span>
                {isSelected && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--teal)",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    <Icon name="check" size={14} /> Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--teal), var(--purple))",
              width: `${(selectedCount / totalTools) * 100}%`,
              transition: "width 0.3s ease",
              borderRadius: 3,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-primary"
            disabled={!allSelected}
            onClick={() => setConfirmOpen(true)}
            style={{
              flex: 1,
              opacity: allSelected ? 1 : 0.5,
              cursor: allSelected ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Icon name="check" size={14} /> {selectedCount === totalTools ? "Complete & Download!" : "Select All Items First"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: 500,
              width: "90%",
              padding: 32,
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Ready to Complete Your Brand?</h2>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
                You've selected all your brand assets. Download your complete Brand PDF now!
              </p>
            </div>

            {/* Selected Items Summary */}
            <div style={{ background: "rgba(78,205,196,0.05)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", marginBottom: 12 }}>Selected Items:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {selections.map((sel) => (
                  selectedOutputs?.[sel.key] && (
                    <div key={sel.key} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "var(--teal)" }}>✓</span>
                      <span>{sel.label}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn-ghost"
                onClick={() => setConfirmOpen(false)}
                style={{ flex: 1 }}
              >
                Review Again
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  onDownloadPDF();
                  onConfirm?.();
                  setConfirmOpen(false);
                }}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Icon name="download" size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
