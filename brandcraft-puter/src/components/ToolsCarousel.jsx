import { useState, useRef, useCallback, useEffect } from "react";

const tools = [
  {
    name: "Brand Name Generator",
    emoji: "✨",
    desc: "Magic words that capture your essence",
    gradient: "linear-gradient(135deg, #7C4DFF 0%, #B47FFF 100%)",
    accent: "#7C4DFF",
    pattern: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 0%, transparent 60%)",
  },
  {
    name: "Logo Creator",
    emoji: "🎨",
    desc: "AI-generated logos in seconds",
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #FF9DC4 100%)",
    accent: "#FF6B9D",
    pattern: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.18) 0%, transparent 55%)",
  },
  {
    name: "Color Palette",
    emoji: "🌈",
    desc: "Perfect colors that match your vibe",
    gradient: "linear-gradient(135deg, #FF8C42 0%, #FFB347 100%)",
    accent: "#FF8C42",
    pattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12) 0%, transparent 50%)",
  },
  {
    name: "Typography Pairing",
    emoji: "🖋️",
    desc: "Font combos that look hand-crafted",
    gradient: "linear-gradient(135deg, #26C6DA 0%, #67E8F9 100%)",
    accent: "#26C6DA",
    pattern: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
  },
  {
    name: "Ad Copy Generator",
    emoji: "📣",
    desc: "Words that make hearts skip",
    gradient: "linear-gradient(135deg, #66BB6A 0%, #A5D6A7 100%)",
    accent: "#66BB6A",
    pattern: "radial-gradient(circle at 40% 60%, rgba(255,255,255,0.15) 0%, transparent 55%)",
  },
  {
    name: "Social Media Bio",
    emoji: "🌟",
    desc: "Bios that tell your story",
    gradient: "linear-gradient(135deg, #FFA726 0%, #FFCC80 100%)",
    accent: "#FFA726",
    pattern: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.18) 0%, transparent 50%)",
  },
  {
    name: "Email Templates",
    emoji: "💌",
    desc: "Messages that connect deeply",
    gradient: "linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)",
    accent: "#EC407A",
    pattern: "radial-gradient(circle at 25% 75%, rgba(255,255,255,0.15) 0%, transparent 55%)",
  },
  {
    name: "Content Calendar",
    emoji: "📅",
    desc: "Ideas that flow endless",
    gradient: "linear-gradient(135deg, #5C6BC0 0%, #9FA8DA 100%)",
    accent: "#5C6BC0",
    pattern: "radial-gradient(circle at 75% 25%, rgba(255,255,255,0.16) 0%, transparent 50%)",
  },
  {
    name: "Voice & Tone",
    emoji: "🎙️",
    desc: "Your brand's unique voice",
    gradient: "linear-gradient(135deg, #AB47BC 0%, #CE93D8 100%)",
    accent: "#AB47BC",
    pattern: "radial-gradient(circle at 35% 65%, rgba(255,255,255,0.14) 0%, transparent 55%)",
  },
  {
    name: "Sentiment Analysis",
    emoji: "💡",
    desc: "Feelings made visible",
    gradient: "linear-gradient(135deg, #26A69A 0%, #80CBC4 100%)",
    accent: "#26A69A",
    pattern: "radial-gradient(circle at 65% 35%, rgba(255,255,255,0.17) 0%, transparent 50%)",
  },
  {
    name: "Multilanguage",
    emoji: "🌍",
    desc: "Your brand speaks every tongue",
    gradient: "linear-gradient(135deg, #EF5350 0%, #EF9A9A 100%)",
    accent: "#EF5350",
    pattern: "radial-gradient(circle at 45% 55%, rgba(255,255,255,0.14) 0%, transparent 52%)",
  },
  {
    name: "Branding Assistant",
    emoji: "🤖",
    desc: "Always by your side",
    gradient: "linear-gradient(135deg, #2D1B69 0%, #7C4DFF 100%)",
    accent: "#2D1B69",
    pattern: "radial-gradient(circle at 55% 45%, rgba(255,255,255,0.12) 0%, transparent 55%)",
  },
  {
    name: "Brand Score",
    emoji: "📊",
    desc: "See your magic grow",
    gradient: "linear-gradient(135deg, #00897B 0%, #4DB6AC 100%)",
    accent: "#00897B",
    pattern: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 0%, transparent 55%)",
  },
];

const VISIBLE_SIDE = 2;

function getCardTransform(offset) {
  const absOffset = Math.abs(offset);
  const sign = offset < 0 ? -1 : 1;
  const translateX = sign * (absOffset === 0 ? 0 : absOffset === 1 ? 235 : 430);
  const translateZ = absOffset === 0 ? 80 : absOffset === 1 ? -40 : -120;
  const rotateY = sign * (absOffset === 0 ? 0 : absOffset === 1 ? 28 : 46);
  const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.6;
  const translateY = absOffset === 0 ? 0 : absOffset === 1 ? 24 : 52;
  const zIndex = 10 - absOffset * 3;
  const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.92 : 0.76;
  return { translateX, translateZ, rotateY, scale, translateY, zIndex, opacity };
}

export default function FanCarousel({ onNav }) {
  const [center, setCenter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(null);

  const navigate = useCallback((newCenter) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCenter(((newCenter % tools.length) + tools.length) % tools.length);
    setTimeout(() => setIsAnimating(false), 640);
  }, [isAnimating]);

  const prev = useCallback(() => navigate(center - 1), [center, navigate]);
  const next = useCallback(() => navigate(center + 1), [center, navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const visibleCards = [];
  for (let offset = -VISIBLE_SIDE; offset <= VISIBLE_SIDE; offset++) {
    const idx = ((center + offset) % tools.length + tools.length) % tools.length;
    visibleCards.push({ idx, offset });
  }

  const activeTool = tools[center];

  return (
    <div style={{ background: "#F5F0E8", padding: "0 0 80px", overflow: "hidden" }}>

      {/* ─── Section Header ─── */}
      <div style={{ textAlign: "center", padding: "80px 24px 64px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(124,77,255,0.08)", border: "1.5px solid rgba(124,77,255,0.18)",
          borderRadius: 99, padding: "6px 16px", marginBottom: 28,
          fontSize: 12, fontWeight: 700, color: "#7C4DFF",
          fontFamily: "Nunito", letterSpacing: "1.5px", textTransform: "uppercase",
        }}>
          📖 Chapter 1 · 13 Enchanted Tools
        </div>

        <h2 style={{ fontSize: "clamp(38px, 5.5vw, 66px)", lineHeight: 1.06, color: "#1A0F3C", marginBottom: 24, letterSpacing: "-0.02em" }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 400 }}>
            Craft Every Piece
          </span>
          <br />
          <span style={{ fontFamily: "Fredoka One, sans-serif", fontWeight: 400 }}>
            of Your Brand Story.
          </span>
        </h2>

        <p style={{ fontSize: 18, color: "#6B5B8A", lineHeight: 1.8, fontFamily: "Nunito", fontWeight: 500, maxWidth: 520, margin: "0 auto 36px" }}>
          13 AI-powered tools working in harmony — from your first name to your final campaign.
        </p>

        <button
          onClick={() => onNav && onNav("signup")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#1A0F3C", color: "#fff", border: "none", borderRadius: 99,
            padding: "14px 28px", fontSize: 15, fontFamily: "Nunito", fontWeight: 700,
            cursor: "pointer", boxShadow: "0 8px 24px rgba(26,15,60,0.28)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(26,15,60,0.38)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,15,60,0.28)"; }}
        >
          Start Building Free
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      {/* ─── 3D Carousel Stage ─── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          height: 460,
          perspective: "1100px",
          perspectiveOrigin: "50% 38%",
          marginBottom: 48,
        }}
      >
        {/* Cards container */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 0, height: "100%",
          transformStyle: "preserve-3d",
        }}>
          {visibleCards.map(({ idx, offset }) => {
            const tool = tools[idx];
            const t = getCardTransform(offset);
            const isCenter = offset === 0;

            return (
              <div
                key={`card-${idx}-${offset}`}
                onClick={() => !isCenter && navigate(center + offset)}
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: 280, height: 380,
                  marginLeft: -140,
                  borderRadius: 24,
                  background: tool.gradient,
                  cursor: isCenter ? "default" : "pointer",
                  transformStyle: "preserve-3d",
                  transform: `translateX(${t.translateX}px) translateY(${t.translateY}px) translateZ(${t.translateZ}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                  transition: "transform 620ms cubic-bezier(0.34, 1.28, 0.64, 1), opacity 380ms ease, box-shadow 280ms ease",
                  zIndex: t.zIndex,
                  opacity: t.opacity,
                  boxShadow: isCenter
                    ? "0 32px 64px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.16)"
                    : Math.abs(offset) === 1
                    ? "0 16px 40px rgba(0,0,0,0.18)"
                    : "0 8px 20px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  userSelect: "none",
                  willChange: "transform",
                }}
              >
                {/* Glow overlay */}
                <div style={{ position: "absolute", inset: 0, background: tool.pattern, pointerEvents: "none" }} />

                {/* Decorative orbs */}
                <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 2, padding: "36px 28px 28px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 60, marginBottom: 18, lineHeight: 1, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.22))" }}>
                      {tool.emoji}
                    </div>
                    <div style={{ fontFamily: "Fredoka One, sans-serif", fontSize: 22, color: "#fff", marginBottom: 10, lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                      {tool.name}
                    </div>
                    <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.84)", lineHeight: 1.65, fontFamily: "Nunito", fontWeight: 500 }}>
                      {tool.desc}
                    </div>
                  </div>

                  {/* Badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    borderRadius: 99, padding: "7px 14px",
                    fontSize: 12, fontWeight: 700, color: "#fff",
                    fontFamily: "Nunito", alignSelf: "flex-start",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "inline-block" }} />
                    Tool {String(tools.indexOf(tool) + 1).padStart(2, "0")} / {tools.length}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrow — Left */}
        <button
          onClick={prev}
          aria-label="Previous tool"
          style={{
            position: "absolute", left: "calc(50% - 300px)", top: "50%",
            transform: "translateY(-50%)",
            width: 48, height: 48, borderRadius: "50%",
            background: "#fff", border: "none", cursor: "pointer", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
            transition: "all 0.2s ease", color: "#2D1B69",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-50%) scale(1.12)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(-50%) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)"; }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Arrow — Right */}
        <button
          onClick={next}
          aria-label="Next tool"
          style={{
            position: "absolute", right: "calc(50% - 300px)", top: "50%",
            transform: "translateY(-50%)",
            width: 48, height: 48, borderRadius: "50%",
            background: "#fff", border: "none", cursor: "pointer", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
            transition: "all 0.2s ease", color: "#2D1B69",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-50%) scale(1.12)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(-50%) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)"; }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* ─── Active Tool Label ─── */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "#fff", border: `2px solid ${activeTool.accent}28`,
          borderRadius: 99, padding: "10px 24px",
          boxShadow: `0 4px 20px ${activeTool.accent}1A`,
          transition: "all 400ms ease",
        }}>
          <span style={{ fontSize: 22 }}>{activeTool.emoji}</span>
          <span style={{ fontFamily: "Fredoka One", fontSize: 18, color: "#2D1B69" }}>{activeTool.name}</span>
          <span style={{ width: 1, height: 18, background: "rgba(0,0,0,0.1)", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "#6B5B8A", fontFamily: "Nunito", fontWeight: 600 }}>{activeTool.desc}</span>
        </div>
      </div>

      {/* ─── 3-column summary ─── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        maxWidth: 860,
        margin: "0 auto",
        padding: "0 32px",
      }}>
        {[
          { icon: "⚡", title: "Instant Generation", body: "Every tool produces results in seconds — AI-powered and tuned to your profile." },
          { icon: "🎯", title: "Brand-Aware Output", body: "Each tool reads your brand profile so results feel hand-crafted, never generic." },
          { icon: "♾️", title: "Unlimited Iterations", body: "Regenerate freely. Refine with chips or describe exactly what you want." },
        ].map((item, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 20, padding: "28px 24px",
            border: "1.5px solid rgba(124,77,255,0.1)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: 30, marginBottom: 14 }}>{item.icon}</div>
            <div style={{ fontFamily: "Fredoka One", fontSize: 17, color: "#1A0F3C", marginBottom: 8 }}>{item.title}</div>
            <div style={{ fontSize: 13.5, color: "#6B5B8A", lineHeight: 1.65, fontFamily: "Nunito", fontWeight: 500 }}>{item.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
