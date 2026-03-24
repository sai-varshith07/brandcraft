import { useState, useRef, useEffect } from "react";
import { callAI } from "../utils/api";
import Icon from "./Icon";

const starterChips = [
  "Write my brand mission",
  "What should I post?",
  "Review my brand",
  "Write my tagline",
  "How to position brand?",
  "Analyse my competitors",
];

const helpMessages = [
  "Need help with your brand? 🎨",
  "Ask me anything! 🤖",
  "Let's build something great ✨",
  "I'm your brand strategist! 💡",
  "Ready to craft your story? 📖",
];

export default function AIChatWidget({ brandProfile }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [bubbleMsg, setBubbleMsg] = useState(helpMessages[0]);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [robotBounce, setRobotBounce] = useState(false);
  const messagesEndRef = useRef(null);
  const bubbleTimerRef = useRef(null);

  // Show bubble after 2s, cycle messages every 6s
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setBubbleVisible(true);
      setRobotBounce(true);
      setTimeout(() => setRobotBounce(false), 800);
    }, 2000);

    let msgIndex = 0;
    const cycleTimer = setInterval(() => {
      if (!open) {
        msgIndex = (msgIndex + 1) % helpMessages.length;
        setBubbleMsg(helpMessages[msgIndex]);
        setBubbleVisible(true);
        setRobotBounce(true);
        setTimeout(() => setRobotBounce(false), 800);
      }
    }, 6000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(cycleTimer);
    };
  }, [open]);

  // Hide bubble when chat opens
  useEffect(() => {
    if (open) setBubbleVisible(false);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const send = async (text) => {
    if (!text.trim() || streaming) return;
    const userMsg = { role: "user", content: text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setStreaming(true);
    setStreamText("");
    try {
      let full = "";
      await callAI(
        `You are BrandCraft AI, an expert brand strategist. Brand profile: ${JSON.stringify(brandProfile || {})}. Help with branding, strategy, naming, positioning, content and creative direction. Always tie advice to their specific brand. Keep responses concise and actionable.`,
        text,
        (t) => { full = t; setStreamText(t); }
      );
      setMessages(m => [...m, { role: "assistant", content: full }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setStreaming(false);
    setStreamText("");
  };

  return (
    <>
      <style>{`
        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes robotBounce {
          0%   { transform: scale(1) rotate(0deg); }
          25%  { transform: scale(1.15) rotate(-8deg); }
          50%  { transform: scale(1.1) rotate(6deg); }
          75%  { transform: scale(1.05) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes bubblePop {
          0%   { opacity:0; transform: scale(0.7) translateY(8px); }
          60%  { transform: scale(1.05) translateY(-2px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes eyeBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%            { transform: scaleY(0.1); }
        }
        @keyframes antennaPulse {
          0%, 100% { background: #4ECDC4; box-shadow: 0 0 6px #4ECDC4; }
          50%       { background: #FF6B9D; box-shadow: 0 0 12px #FF6B9D; }
        }
        @keyframes chatSlideUp {
          from { opacity:0; transform: translateY(20px) scale(0.95); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes blink { 50% { opacity:0; } }
        @keyframes typing {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      {/* Help bubble */}
      {bubbleVisible && !open && (
        <div onClick={() => setOpen(true)} style={{
          position: "fixed", bottom: 108, right: 24,
          background: "rgba(255,252,248,0.97)",
          backdropFilter: "blur(16px)",
          border: "1.5px solid rgba(124,77,255,0.2)",
          borderRadius: "18px 18px 4px 18px",
          padding: "10px 16px",
          fontSize: 13, fontWeight: 700, fontFamily: "Nunito",
          color: "#2D1B69",
          boxShadow: "0 8px 28px rgba(124,77,255,0.18)",
          cursor: "pointer", zIndex: 1001,
          animation: "bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          whiteSpace: "nowrap",
          maxWidth: 220,
        }}>
          {bubbleMsg}
          <div style={{
            position: "absolute", bottom: -8, right: 14,
            width: 0, height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "8px solid rgba(255,252,248,0.97)",
          }}/>
        </div>
      )}

      {/* Robot floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Ask BrandCraft AI"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 68, height: 68,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C4DFF 0%, #4ECDC4 100%)",
          border: "3px solid rgba(255,255,255,0.9)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1002,
          boxShadow: "0 8px 28px rgba(124,77,255,0.45), 0 0 0 4px rgba(124,77,255,0.12)",
          animation: robotBounce
            ? "robotBounce 0.6s cubic-bezier(0.34,1.56,0.64,1)"
            : "robotFloat 3s ease-in-out infinite",
          transition: "box-shadow 0.3s",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {open ? (
          // X icon when open
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
            <Icon name="x" size={26} color="#fff" />
          </div>
        ) : (
          // Robot face
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", position: "relative" }}>
            {/* Antenna */}
            <div style={{
              position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
              width: 3, height: 10, background: "#fff", borderRadius: 2,
            }}>
              <div style={{
                position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)",
                width: 7, height: 7, borderRadius: "50%",
                animation: "antennaPulse 1.8s ease-in-out infinite",
              }}/>
            </div>

            {/* Robot head */}
            <div style={{
              width: 38, height: 32, marginTop: 8,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              border: "2px solid rgba(255,255,255,0.4)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 4, position: "relative",
            }}>
              {/* Eyes */}
              <div style={{ display: "flex", gap: 7 }}>
                {[0,1].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 0 6px rgba(78,205,196,0.8)",
                    animation: "eyeBlink 4s ease-in-out infinite",
                    animationDelay: i === 1 ? "0.1s" : "0s",
                  }}/>
                ))}
              </div>
              {/* Mouth */}
              <div style={{
                width: 18, height: 5,
                border: "2px solid rgba(255,255,255,0.8)",
                borderTop: "none",
                borderRadius: "0 0 10px 10px",
              }}/>
            </div>
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 104, right: 24, width: 380, height: 520,
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: 20, display: "flex", flexDirection: "column",
          zIndex: 999, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          animation: "chatSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mini robot avatar in header */}
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #7C4DFF, #4ECDC4)",
              border: "2px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>🤖</div>
            <div>
              <div style={{ fontFamily: "Fredoka One", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>BrandCraft AI</div>
              <div style={{ fontSize: 11, color: "#4ECDC4", fontFamily: "Nunito", fontWeight: 700 }}>● Online · Ready to help</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text2)", cursor: "pointer", padding: 4 }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
            {messages.length === 0 ? (
              <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 26, flexShrink: 0 }}>🤖</div>
                  <div style={{ background: "rgba(124,77,255,0.08)", border: "1px solid rgba(124,77,255,0.15)", borderRadius: "14px 14px 14px 4px", padding: "10px 14px" }}>
                    <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.6, fontFamily: "Nunito" }}>
                      Hey there! I'm your AI brand strategist 🎨<br/>
                      Ask me anything about building your brand!
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, paddingLeft: 36 }}>
                  {starterChips.map(c => (
                    <span key={c} className="chip" onClick={() => send(c)} style={{ cursor: "pointer", fontSize: 12 }}>{c}</span>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 14, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                  {m.role === "assistant" && <div style={{ fontSize: 20, flexShrink: 0, marginBottom: 2 }}>🤖</div>}
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px",
                    borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: m.role === "user" ? "linear-gradient(135deg, #7C4DFF, #9B6BFF)" : "rgba(255,255,255,0.05)",
                    border: m.role === "user" ? "none" : "1px solid var(--border)",
                    fontSize: 13, lineHeight: 1.6, fontFamily: "Nunito",
                    color: m.role === "user" ? "#fff" : "var(--text)",
                  }}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {streaming && streamText && (
              <div style={{ marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>🤖</div>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: 13, lineHeight: 1.6, fontFamily: "Nunito" }}>
                  {streamText}<span style={{ animation: "blink 1s infinite", color: "#4ECDC4" }}>▍</span>
                </div>
              </div>
            )}
            {streaming && !streamText && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 4 }}>
                <div style={{ fontSize: 20 }}>🤖</div>
                <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ECDC4", animation: `typing 1.2s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              className="input-base"
              placeholder="Ask about your brand..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              style={{ flex: 1, padding: "10px 14px", fontSize: 13, fontFamily: "Nunito" }}
            />
            <button
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 10, border: "none", cursor: input.trim() ? "pointer" : "default",
                background: input.trim() ? "linear-gradient(135deg, #7C4DFF, #4ECDC4)" : "var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
              }}
            >
              <Icon name="send" size={14} color={input.trim() ? "#fff" : "var(--text3)"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
