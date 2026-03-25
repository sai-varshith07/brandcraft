import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icon";
import ToolsCarousel from "./ToolsCarousel";

// ─── Magic Burst Transition ───────────────────────────────────────────────────
function MagicBurst({ onDone }) {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: 5 + (i * 13.7) % 90,
    y: 5 + (i * 17.3) % 88,
    size: 18 + (i % 4) * 10,
    delay: (i * 0.038),
    emoji: ["✨", "⭐", "🌟", "💫", "✦", "❋", "🔆"][i % 7],
    tx: ((i % 7) - 3) * 28,
    ty: ((i % 5) - 2) * 28,
    rot: i * 47,
  }));

  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes magicOverlay {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 0.6; }
          100% { opacity: 0; }
        }
        @keyframes sparkleUp {
          0%   { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
          35%  { opacity: 1; transform: translate(calc(var(--tx)*1px), calc(var(--ty)*1px)) scale(1.3) rotate(calc(var(--rot)*1deg)); }
          100% { opacity: 0; transform: translate(calc(var(--tx)*2.5px), calc(var(--ty)*2.5px - 50px)) scale(0.2) rotate(calc(var(--rot)*2.5deg)); }
        }
        @keyframes wandPop {
          0%   { opacity:0; transform: translate(-50%,-50%) scale(0) rotate(-20deg); }
          40%  { opacity:1; transform: translate(-50%,-50%) scale(1.3) rotate(15deg); }
          100% { opacity:0; transform: translate(-50%,-50%) scale(0.5) rotate(40deg); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
        background: "rgba(253,246,236,0.55)", animation: "magicOverlay 1.1s ease forwards"
      }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            fontSize: p.size,
            "--tx": p.tx, "--ty": p.ty, "--rot": p.rot,
            animation: `sparkleUp 0.9s ${p.delay}s ease-out both`,
            filter: "drop-shadow(0 0 6px rgba(124,77,255,0.7))",
          }}>{p.emoji}</div>
        ))}
        <div style={{
          position: "absolute", left: "50%", top: "50%", fontSize: 80,
          animation: "wandPop 1s 0.05s ease-out both",
          filter: "drop-shadow(0 0 24px rgba(124,77,255,0.9))",
        }}>🪄</div>
      </div>
    </>
  );
}

// ─── Floating Pill Nav ────────────────────────────────────────────────────────
function FloatingPillNav() {
  const [visible, setVisible] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "Features", emoji: "✨", id: "features" },
    { label: "How It Works", emoji: "🗺️", id: "how-it-works" },
    { label: "Testimonials", emoji: "💬", id: "testimonials" },
    { label: "Pricing", emoji: "💳", id: "pricing" },
  ];
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveLink(id);
  };
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? "0" : "-80px"})`,
      opacity: visible ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      zIndex: 200, pointerEvents: visible ? "auto" : "none",
    }}>
      <div className="glass" style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 99, padding: "6px 8px" }}>
        {links.map(link => (
          <button key={link.id} onClick={() => scrollTo(link.id)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
            transition: "all 0.22s ease",
            background: activeLink === link.id ? "linear-gradient(135deg,#7C4DFF,#FF6B9D)" : "transparent",
            color: activeLink === link.id ? "#fff" : "#6B5B8A",
            boxShadow: activeLink === link.id ? "0 4px 12px rgba(124,77,255,0.35)" : "none",
          }}
            onMouseEnter={e => { if (activeLink !== link.id) { e.currentTarget.style.background = "rgba(124,77,255,0.1)"; e.currentTarget.style.color = "#7C4DFF"; } }}
            onMouseLeave={e => { if (activeLink !== link.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B5B8A"; } }}
          >
            <span style={{ fontSize: 14 }}>{link.emoji}</span>{link.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    }, 80);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);
}

function KineticText({ text, delay = 0 }) {
  return (
    <span aria-label={text} style={{ display: "inline" }}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="kinetic-word" style={{ animationDelay: `${delay + wi * 0.08}s`, display: "inline-block", marginRight: "0.25em" }}>
          {word}
        </span>
      ))}
    </span>
  );
}

const marqueeItems = [
  { emoji: "✨", text: "Brand Names" }, { emoji: "🎨", text: "Logo Creator" },
  { emoji: "🌈", text: "Color Palette" }, { emoji: "🖋️", text: "Typography" },
  { emoji: "📣", text: "Ad Copy" }, { emoji: "🌟", text: "Social Bio" },
  { emoji: "💌", text: "Email Builder" }, { emoji: "📅", text: "Content Calendar" },
  { emoji: "🎙️", text: "Voice & Tone" }, { emoji: "💡", text: "Sentiment AI" },
  { emoji: "🌍", text: "Multilanguage" }, { emoji: "🤖", text: "AI Assistant" },
  { emoji: "📊", text: "Brand Score" },
  { emoji: "🧲", text: "Lead Magnet" }, { emoji: "🚀", text: "Growth Hacker" },
  { emoji: "🌐", text: "Domain Checker" }, { emoji: "🕵️", text: "Steal This Brand" },
  { emoji: "📖", text: "Brand Story" }, { emoji: "📈", text: "Market Research" },
  { emoji: "🧭", text: "Mission & Vision" }, { emoji: "💻", text: "Website Gen" },
  { emoji: "🖼️", text: "Post Mockup" }, { emoji: "⚙️", text: "Content Auto" },
  { emoji: "🎯", text: "Ad Generator" }, { emoji: "👥", text: "Buyer Persona" },
  { emoji: "🔬", text: "Consistency" }, { emoji: "🧮", text: "Finances" },
  { emoji: "🃏", text: "Brand Card" }, { emoji: "📱", text: "QR Code" },
  { emoji: "🖌️", text: "Canva Export" },
];

function Marquee({ reverse = false }) {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-wrapper" style={{ padding: "14px 0" }}>
      <div className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 24px", margin: "0 8px",
            background: "rgba(255,252,248,0.85)", backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(124,77,255,0.12)", borderRadius: 99,
            fontSize: 14, fontWeight: 700, color: "#2D1B69",
            fontFamily: "Nunito", whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(124,77,255,0.08)",
          }}>
            <span style={{ fontSize: 18 }}>{item.emoji}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Story Steps ──────────────────────────────────────────────────────────────
const storySteps = [
  { chapter: "Step 01", title: "Whisper Your Vision", desc: "Tell us your industry, vibe, and goals. Our AI learns what makes your brand unique before creating a single asset.", emoji: "💬", accent: "#7C4DFF" },
  { chapter: "Step 02", title: "AI Weaves the Magic", desc: "Watch as 30 powerful tools generate names, colors, logos, typography and more — all tailored to your exact profile.", emoji: "⚡", accent: "#FF6B9D" },
  { chapter: "Step 03", title: "Curate & Refine", desc: "Pick your favorites, regenerate with one click, and fine-tune every element until it feels perfectly you.", emoji: "🎯", accent: "#FFB300" },
  { chapter: "Step 04", title: "Launch Your Legend", desc: "Download your complete brand package as a PDF. Every asset, every format — ready to go live.", emoji: "🚀", accent: "#4ECDC4" },
];

function StickyStory() {
  const [activeStep, setActiveStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const autoRef = useRef(null);

  const goTo = (i) => {
    setActiveStep(i);
    setAnimKey(k => k + 1);
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActiveStep(s => { const next = (s + 1) % storySteps.length; setAnimKey(k => k + 1); return next; });
    }, 4000);
  };

  useEffect(() => {
    autoRef.current = setInterval(() => {
      setActiveStep(s => { const next = (s + 1) % storySteps.length; setAnimKey(k => k + 1); return next; });
    }, 4000);
    return () => clearInterval(autoRef.current);
  }, []);

  const step = storySteps[activeStep];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 80px" }}>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
        {storySteps.map((s, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 99, border: "2px solid",
            borderColor: i === activeStep ? s.accent : "rgba(124,77,255,0.15)",
            background: i === activeStep ? `${s.accent}14` : "rgba(255,252,248,0.8)",
            color: i === activeStep ? s.accent : "#9B8CB8",
            fontFamily: "Nunito", fontWeight: 800, fontSize: 13, cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            transform: i === activeStep ? "translateY(-2px) scale(1.04)" : "scale(1)",
            boxShadow: i === activeStep ? `0 6px 20px ${s.accent}28` : "none",
          }}>
            <span style={{ fontSize: 16 }}>{s.emoji}</span>{s.chapter}
          </button>
        ))}
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
        background: "rgba(255,252,248,0.85)", backdropFilter: "blur(20px)",
        border: `1.5px solid ${step.accent}22`, borderRadius: 28, overflow: "hidden",
        boxShadow: `0 20px 60px ${step.accent}14`,
        transition: "border-color 0.5s, box-shadow 0.5s", minHeight: 380,
      }}>
        <div style={{
          padding: "48px 40px", borderRight: "1px solid rgba(124,77,255,0.08)",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 20,
          background: `linear-gradient(160deg, ${step.accent}06 0%, transparent 100%)`,
          transition: "background 0.5s",
        }}>
          {storySteps.map((s, i) => (
            <div key={i} onClick={() => goTo(i)} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 16px", borderRadius: 16, cursor: "pointer",
              opacity: i === activeStep ? 1 : 0.4,
              background: i === activeStep ? `${s.accent}10` : "transparent",
              border: `1.5px solid ${i === activeStep ? s.accent + "30" : "transparent"}`,
              transform: i === activeStep ? "translateX(4px)" : "translateX(0)",
              transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <div style={{
                width: i === activeStep ? 46 : 38, height: i === activeStep ? 46 : 38,
                borderRadius: "50%", flexShrink: 0,
                background: i === activeStep ? `linear-gradient(135deg, ${s.accent}, ${s.accent}88)` : "rgba(124,77,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: i === activeStep ? 20 : 17,
                boxShadow: i === activeStep ? `0 6px 20px ${s.accent}44` : "none",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>{s.emoji}</div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: i === activeStep ? s.accent : "#A89BC0", textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: "Nunito", marginBottom: 2 }}>{s.chapter}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", fontFamily: "Fredoka One" }}>{s.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div key={animKey} style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", animation: "cardIn 0.45s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ fontSize: 72, marginBottom: 24, filter: `drop-shadow(0 8px 24px ${step.accent}55)` }}>{step.emoji}</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: step.accent, textTransform: "uppercase", letterSpacing: "1.8px", fontFamily: "Nunito", marginBottom: 10 }}>{step.chapter}</div>
          <h3 style={{ fontFamily: "Fredoka One", fontSize: "clamp(28px,3vw,40px)", color: "#2D1B69", marginBottom: 18, lineHeight: 1.1 }}>{step.title}</h3>
          <p style={{ fontSize: 16, color: "#6B5B8A", lineHeight: 1.8, fontFamily: "Nunito", fontWeight: 500, maxWidth: 360, marginBottom: 32 }}>{step.desc}</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24 }}>
            {storySteps.map((s, i) => (
              <div key={i} onClick={() => goTo(i)} style={{
                height: 5, borderRadius: 99,
                width: i === activeStep ? 36 : 10,
                background: i === activeStep ? step.accent : "rgba(124,77,255,0.18)",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", cursor: "pointer",
              }} />
            ))}
          </div>
          <button onClick={() => goTo((activeStep + 1) % storySteps.length)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 22px", borderRadius: 99,
            background: `linear-gradient(135deg, ${step.accent}, ${step.accent}bb)`,
            color: "#fff", border: "none", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 800, fontSize: 13,
            boxShadow: `0 6px 20px ${step.accent}38`,
            transition: "transform 0.2s, box-shadow 0.2s", alignSelf: "flex-start",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {activeStep < storySteps.length - 1 ? `Next: ${storySteps[activeStep + 1].title} →` : "Start Your Story ✨"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const stats = [
  { value: "2,400+", label: "Founders", emoji: "👥" },
  { value: "30", label: "AI Tools", emoji: "🛠️" },
  { value: "98%", label: "Satisfaction", emoji: "⭐" },
  { value: "<5 min", label: "To Launch", emoji: "🚀" },
];

function StatsBar() {
  return (
    <div className="reveal" style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0,
      background: "rgba(255,252,248,0.85)", backdropFilter: "blur(16px)",
      border: "1.5px solid rgba(124,77,255,0.14)", borderRadius: 24, overflow: "hidden",
      margin: "0 auto", maxWidth: 800, boxShadow: "0 8px 32px rgba(124,77,255,0.1)",
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: "28px 20px", textAlign: "center",
          borderRight: i < 3 ? "1px solid rgba(124,77,255,0.1)" : "none",
          transition: "background 0.2s", cursor: "default",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(124,77,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>{s.emoji}</div>
          <div style={{ fontFamily: "Fredoka One", fontSize: 30, color: "#7C4DFF", lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#9B8CB8", fontFamily: "Nunito", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.8px" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  { name: "Priya K.", role: "Startup Founder", avatar: "🧕", quote: "I had a complete brand identity ready in 20 minutes. An agency would've charged $5,000. BrandCraft is pure magic.", color: "#7C4DFF" },
  { name: "Marcus T.", role: "Freelance Designer", avatar: "👨‍💻", quote: "I use BrandCraft to show clients concept directions instantly. It's become my secret weapon for winning pitches.", color: "#FF6B9D" },
  { name: "Sophie L.", role: "E-commerce Owner", avatar: "👩‍💼", quote: "The Brand Score helped me see what was missing. Once I hit 90, my conversion rate went up 34%. Genuinely life-changing.", color: "#FFB300" },
  { name: "Arjun M.", role: "Creative Director", avatar: "🧑‍🎨", quote: "The AI understands nuance. It didn't spit out generic output — it felt like working with a real brand strategist.", color: "#4ECDC4" },
];

function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: "100px 48px", scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1.5px" }}>💬 Real Stories</div>
          <h2 style={{ fontFamily: "Fredoka One", fontSize: "clamp(36px,4.5vw,54px)", color: "#2D1B69", marginBottom: 12, lineHeight: 1.1 }}>
            Brands built with <span className="grad-text">BrandCraft</span>
          </h2>
          <p style={{ color: "#6B5B8A", fontSize: 17, fontFamily: "Nunito", fontWeight: 500 }}>Don't take our word for it — hear from the founders.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="reveal" style={{
              background: "rgba(255,252,248,0.9)", backdropFilter: "blur(16px)",
              border: "1.5px solid rgba(124,77,255,0.12)", borderRadius: 22, padding: "28px 24px",
              position: "relative", overflow: "hidden",
              transition: "transform 0.28s, box-shadow 0.28s", animationDelay: `${i * 0.08}s`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(124,77,255,0.13)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${t.color}18, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_, si) => <span key={si} style={{ color: "#FFB300", fontSize: 13 }}>★</span>)}
              </div>
              <p style={{ fontSize: 15, color: "#4A3860", lineHeight: 1.7, fontFamily: "Nunito", fontWeight: 500, marginBottom: 22, fontStyle: "italic" }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${t.color}22, ${t.color}44)`, border: `2px solid ${t.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "Fredoka One", fontSize: 16, color: "#2D1B69" }}>{t.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.color, fontFamily: "Nunito" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Overview ─────────────────────────────────────────────────────────
const pricingPlans = [
  {
    name: "Starter",
    price: "₹499",
    period: "/mo",
    desc: "Perfect for indie makers and solo founders starting out.",
    features: [
      "1 Brand Profile",
      "Unlimited Idea Generations",
      "Basic Export Formats (PNG, JPG)",
      "Standard Support",
    ],
    color: "#4ECDC4",
    mostPopular: false,
    cta: "Start Free Trial"
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/mo",
    desc: "Everything you need to launch and scale your brand identity.",
    features: [
      "Up to 5 Brand Profiles",
      "Priority AI Generation",
      "Full Vector Exports (SVG, PDF)",
      "Custom Brand Guidelines",
      "Priority 24/7 Support"
    ],
    color: "#7C4DFF",
    mostPopular: true,
    cta: "Start Free Trial"
  },
  {
    name: "Agency",
    price: "₹1499",
    period: "/mo",
    desc: "For creative teams and agencies managing multiple clients.",
    features: [
      "Unlimited Brand Profiles",
      "White-label Presentations",
      "Team Collaboration (5 seats)",
      "API Access",
      "Dedicated Account Manager"
    ],
    color: "#FF6B9D",
    mostPopular: false,
    cta: "Contact Sales"
  }
];

function PricingOverview({ onNav }) {
  return (
    <section id="pricing" style={{ padding: "100px 48px", scrollMarginTop: 80, background: "rgba(124,77,255,0.02)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Trial Banner */}
        <div className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(124,77,255,0.1), rgba(240,80,168,0.1))",
            border: "1.5px solid rgba(124,77,255,0.2)", borderRadius: 99,
            padding: "8px 24px", display: "inline-flex", alignItems: "center", gap: 10,
            fontSize: 14, fontWeight: 700, color: "#2D1B69", fontFamily: "Nunito",
            boxShadow: "0 4px 12px rgba(124,77,255,0.05)"
          }}>
            <span style={{ fontSize: 18 }}>🎉</span> All plans include a <strong>7-Day Free Trial</strong>. Cancel anytime.
          </div>
        </div>

        {/* Section Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1.5px" }}>💳 Simple Pricing</div>
          <h2 style={{ fontFamily: "Fredoka One", fontSize: "clamp(36px,4.5vw,54px)", color: "#2D1B69", marginBottom: 12, lineHeight: 1.1 }}>
            Choose your <span className="grad-text">magic tier</span>
          </h2>
          <p style={{ color: "#6B5B8A", fontSize: 17, fontFamily: "Nunito", fontWeight: 500, maxWidth: 500, margin: "0 auto" }}>
            Invest in your brand's future. Flexible plans for solitary dreamers and large teams alike.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "center" }}>
          {pricingPlans.map((plan, i) => (
            <div key={i} className="reveal" style={{
              background: plan.mostPopular ? "rgba(255,255,255,0.95)" : "rgba(255,252,248,0.7)",
              backdropFilter: "blur(16px)",
              border: `2px solid ${plan.mostPopular ? plan.color : "rgba(124,77,255,0.1)"}`,
              borderRadius: 32, padding: "40px 32px",
              position: "relative",
              transform: plan.mostPopular ? "scale(1.05)" : "scale(1)",
              zIndex: plan.mostPopular ? 10 : 1,
              boxShadow: plan.mostPopular ? `0 24px 60px ${plan.color}25` : "0 10px 30px rgba(0,0,0,0.03)",
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
              animationDelay: `${i * 0.1}s`,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = plan.mostPopular ? "scale(1.07) translateY(-8px)" : "scale(1.02) translateY(-8px)";
                e.currentTarget.style.boxShadow = plan.mostPopular ? `0 32px 70px ${plan.color}35` : "0 20px 40px rgba(124,77,255,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = plan.mostPopular ? "scale(1.05)" : "scale(1)";
                e.currentTarget.style.boxShadow = plan.mostPopular ? `0 24px 60px ${plan.color}25` : "0 10px 30px rgba(0,0,0,0.03)";
              }}
            >
              {plan.mostPopular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${plan.color}, #F050A8)`, color: "#fff", padding: "6px 16px", borderRadius: 99, fontSize: 12, fontWeight: 800, fontFamily: "Nunito", textTransform: "uppercase", letterSpacing: "1px", boxShadow: `0 4px 12px ${plan.color}40`, whiteSpace: "nowrap" }}>
                  ⭐ Most Popular
                </div>
              )}

              <div style={{ fontSize: 20, fontWeight: 800, color: plan.color, fontFamily: "Nunito", marginBottom: 12 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                <span style={{ fontSize: 48, fontWeight: 900, fontFamily: "Fredoka One", color: "#2D1B69", lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#A89BC0", fontFamily: "Nunito" }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 14, color: "#6B5B8A", fontFamily: "Nunito", fontWeight: 500, lineHeight: 1.6, marginBottom: 32, minHeight: 44 }}>
                {plan.desc}
              </p>

              <button
                onClick={() => onNav("signup")}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 16, border: "none", cursor: "pointer",
                  background: plan.mostPopular ? `linear-gradient(135deg, ${plan.color}, #F050A8)` : "rgba(124,77,255,0.08)",
                  color: plan.mostPopular ? "#fff" : plan.color,
                  fontSize: 15, fontWeight: 800, fontFamily: "Nunito", marginBottom: 32,
                  boxShadow: plan.mostPopular ? `0 8px 24px ${plan.color}40` : "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (!plan.mostPopular) e.currentTarget.style.background = "rgba(124,77,255,0.15)" }}
                onMouseLeave={e => { if (!plan.mostPopular) e.currentTarget.style.background = "rgba(124,77,255,0.08)" }}
              >
                {plan.cta}
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#2D1B69", fontFamily: "Nunito", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>What's Included:</div>
                {plan.features.map((feat, fi) => (
                  <div key={fi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ color: plan.color, fontSize: 16, marginTop: -2 }}>✓</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#6B5B8A", fontFamily: "Nunito" }}>{feat}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Feature Highlights ───────────────────────────────────────────────────────

const highlights = [
  { emoji: "🧠", title: "Profile-First AI", desc: "Every tool reads your brand DNA before generating. No generic output — ever.", color: "#7C4DFF" },
  { emoji: "📊", title: "Live Brand Score", desc: "A real-time score tracks how complete and compelling your brand identity is.", color: "#FF6B9D" },
  { emoji: "🌍", title: "11 Languages", desc: "Generate your brand assets in English, Spanish, Japanese, Arabic and more.", color: "#FFB300" },
  { emoji: "⚡", title: "One-Click Regen", desc: "Not feeling it? Regenerate any asset instantly with a different creative direction.", color: "#4ECDC4" },
  { emoji: "📥", title: "Complete Brand PDF", desc: "Export every asset into a polished brand book — ready for designers or investors.", color: "#7C4DFF" },
  { emoji: "🤖", title: "AI Brand Coach", desc: "A chat companion that answers questions and guides your brand-building journey.", color: "#FF6B9D" },
];

function HighlightCards() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 48px" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1.5px" }}>📖 What Makes Us Different</div>
        <h2 style={{ fontFamily: "Fredoka One", fontSize: "clamp(34px,4.5vw,52px)", color: "#2D1B69", lineHeight: 1.1 }}>
          Built for storytellers, <span className="grad-text">not templates</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {highlights.map((h, i) => (
          <div key={i} className="reveal" style={{
            background: "rgba(255,252,248,0.85)", backdropFilter: "blur(16px)",
            border: `1.5px solid ${h.color}1A`, borderRadius: 22, padding: "28px 24px",
            display: "flex", gap: 18, alignItems: "flex-start",
            transition: "transform 0.26s, box-shadow 0.26s", animationDelay: `${i * 0.06}s`,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${h.color}1A`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 15, flexShrink: 0, background: `${h.color}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{h.emoji}</div>
            <div>
              <div style={{ fontFamily: "Fredoka One", fontSize: 19, color: "#2D1B69", marginBottom: 8 }}>{h.title}</div>
              <div style={{ fontSize: 14, color: "#6B5B8A", lineHeight: 1.65, fontFamily: "Nunito", fontWeight: 500 }}>{h.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Star data — each star has a depth factor for parallax magnitude
const STAR_DATA = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: (i * 37.3 + 3) % 100,
  top: (i * 53.7 + 7) % 88,
  size: [12, 16, 20, 24, 28][i % 5],
  depth: 0.08 + (i % 7) * 0.055,   // 0.08 → 0.41 — controls how far each star moves
  floatDur: 3.2 + (i % 6) * 0.7,
  floatDelay: (i * 0.42) % 5,
  opacity: 0.35 + (i % 4) * 0.15,
  color: ["#7C4DFF", "#F050A8", "#FFB300", "#7C4DFF", "#00C9B4"][i % 5],
  shape: ["✦", "✧", "✦", "✦", "✧", "✦", "✦", "✧"][i % 8],
}));

// ─── Cursor-Tracking Star Field ───────────────────────────────────────────────
// KEY FIX: each star is TWO divs:
//   outer div → cursor parallax via direct DOM ref writes (no React state, no CSS animation)
//   inner div → float bob animation via CSS (animation only affects inner, never fights outer transform)
function StarField() {
  const outerRefs = useRef([]);   // refs to the parallax-moving outer divs
  const mouseRef = useRef({ x: 0, y: 0 });   // raw mouse target
  const curRef = useRef({ x: 0, y: 0 });   // smoothed current position
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      // Map cursor to -1…+1 range centred on screen
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;
    const LERP_SPEED = 0.07;   // lower = more lag/smoothness

    const tick = () => {
      // Smoothly chase the mouse
      curRef.current.x = lerp(curRef.current.x, mouseRef.current.x, LERP_SPEED);
      curRef.current.y = lerp(curRef.current.y, mouseRef.current.y, LERP_SPEED);

      // Write directly to each DOM node — zero React re-renders, silky 60fps
      outerRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = STAR_DATA[i];
        const px = curRef.current.x * s.depth * 90;   // max travel px = depth × 90
        const py = curRef.current.y * s.depth * 90;
        el.style.transform = `translate(${px}px, ${py}px)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes starBob {
          0%,100% { transform: translateY(0px)   rotate(0deg);  }
          33%     { transform: translateY(-9px)  rotate(14deg); }
          66%     { transform: translateY(5px)   rotate(-9deg); }
        }
      `}</style>
      {STAR_DATA.map((s, i) => (
        /* OUTER: only cursor parallax transform is set here via ref */
        <div
          key={s.id}
          ref={el => outerRefs.current[i] = el}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            willChange: "transform",
          }}
        >
          {/* INNER: only float animation — never touches outer transform */}
          <div style={{
            fontSize: s.size,
            opacity: s.opacity,
            color: s.color,
            animation: `starBob ${s.floatDur}s ease-in-out ${s.floatDelay}s infinite`,
            filter: `drop-shadow(0 0 ${Math.round(s.size / 3)}px ${s.color})`,
            lineHeight: 1,
          }}>
            {s.shape}
          </div>
        </div>
      ))}
    </div>
  );
}

const HanddrawnDivider = () => (
  <svg width="100%" height="50" viewBox="0 0 1200 50" style={{ margin: "32px 0", opacity: 0.2 }}>
    <path d="M 0 25 Q 150 8 300 25 T 600 25 T 900 25 T 1200 25" stroke="#7C4DFF" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// ─── Main LandingPage ─────────────────────────────────────────────────────────
export default function LandingPage({ onNav }) {
  useScrollReveal();
  const [navScrolled, setNavScrolled] = useState(false);
  const [burst, setBurst] = useState(false);
  const burstDestRef = useRef("signup");

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const magicNav = useCallback((dest) => {
    burstDestRef.current = dest;
    setBurst(true);
  }, []);

  const handleBurstDone = useCallback(() => {
    setBurst(false);
    onNav(burstDestRef.current);
  }, [onNav]);

  return (
    <div className="mesh-bg" style={{ minHeight: "100vh", overflowX: "hidden", background: "linear-gradient(180deg, #FDF6EC 0%, #FFF8F0 50%, #FFFAF3 100%)" }}>
      {burst && <MagicBurst onDone={handleBurstDone} />}
      <FloatingPillNav />

      {/* NAV — no login button */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(253,246,236,0.88)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: navScrolled ? "blur(20px) saturate(160%)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(124,77,255,0.1)" : "none",
        transition: "all 0.35s ease",
        boxShadow: navScrolled ? "0 4px 24px rgba(124,77,255,0.07)" : "none",
      }}>
        <div style={{ fontFamily: "Fredoka One", fontSize: 24, color: "#7C4DFF", display: "flex", alignItems: "center", gap: 8 }}>
          📖 BrandCraft
          <span style={{ fontSize: 10, fontFamily: "Nunito", fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#7C4DFF,#FF6B9D)", padding: "2px 8px", borderRadius: 99, marginLeft: 4, letterSpacing: "0.5px" }}>FREE</span>
        </div>
        <button className="btn-primary btn-sm" onClick={() => onNav("signup")}>Start Story ✨</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 80px", position: "relative", overflow: "hidden" }}>
        {/* Ambient blobs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "5%", left: "5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(124,77,255,0.09) 0%, transparent 70%)", filter: "blur(60px)", borderRadius: "50%", animation: "float 12s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "20%", right: "3%", width: 400, height: 400, background: "radial-gradient(circle, rgba(255,107,157,0.07) 0%, transparent 70%)", filter: "blur(60px)", borderRadius: "50%", animation: "float 10s ease-in-out infinite", animationDelay: "3s" }} />
          <div style={{ position: "absolute", bottom: "5%", left: "25%", width: 500, height: 380, background: "radial-gradient(circle, rgba(255,179,0,0.06) 0%, transparent 70%)", filter: "blur(60px)", borderRadius: "50%", animation: "float 14s ease-in-out infinite", animationDelay: "6s" }} />
        </div>

        {/* Cursor-tracking interactive star field */}
        <StarField />

        <div className="kinetic-word" style={{ animationDelay: "0s", display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(124,77,255,0.1)", border: "2px solid rgba(124,77,255,0.2)", borderRadius: 24, fontSize: 14, color: "#7C4DFF", marginBottom: 32, fontWeight: 700, fontFamily: "Nunito", position: "relative", zIndex: 5 }}>
          <span>🎉</span> Free · Unlimited · No Credit Card · Pure Magic
        </div>

        {/* HEADLINE */}
        <div style={{ position: "relative", maxWidth: 860, zIndex: 5 }}>
          <h1 style={{ fontSize: "clamp(44px, 7vw, 86px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.02em", color: "#2D1B69", fontFamily: "Fredoka One" }}>
            <KineticText text="Every Brand Has a Story." delay={0.1} />
            <br />
            <span className="grad-text" style={{ fontFamily: "Fredoka One" }}>
              <KineticText text="Let's Write Yours." delay={0.45} />
            </span>
          </h1>
          <p className="kinetic-word" style={{ animationDelay: "0.7s", fontSize: "clamp(16px, 2.5vw, 20px)", color: "#6B5B8A", lineHeight: 1.8, maxWidth: 580, margin: "0 auto 48px", fontFamily: "Nunito", fontWeight: 500 }}>
            Your brand deserves more than templates. With AI-powered storytelling, create a brand identity as unique as you are — in minutes, not months. 🌟
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px", fontFamily: "Nunito", fontWeight: 700, animation: "kineticReveal 0.7s 0.9s both" }} onClick={() => magicNav("signup")}>Begin the Journey ✨</button>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "16px 40px", fontFamily: "Nunito", fontWeight: 700, animation: "kineticReveal 0.7s 1.05s both" }} onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Explore Magic 🪄</button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ padding: "0 48px 72px" }}>
        <StatsBar />
      </div>

      {/* MARQUEE */}
      <div style={{ background: "rgba(124,77,255,0.04)", borderTop: "1px solid rgba(124,77,255,0.1)", borderBottom: "1px solid rgba(124,77,255,0.1)", padding: "4px 0" }}>
        <Marquee />
        <Marquee reverse />
      </div>

      <HanddrawnDivider />

      {/* CHAPTER 1 — features */}
      <section id="features" style={{ scrollMarginTop: 80 }}>
        <div className="reveal" style={{ textAlign: "center", padding: "72px 24px 40px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>📖 Chapter 1 · 30 Enchanted Tools</div>
          <h2 style={{ fontSize: "clamp(34px,5vw,52px)", fontWeight: 800, color: "#2D1B69", fontFamily: "Fredoka One", marginBottom: 12 }}>Everything Your Brand Needs</h2>
          <p style={{ color: "#6B5B8A", fontSize: 17, fontFamily: "Nunito", fontWeight: 500 }}>Powered by AI. Guided by your story.</p>
        </div>
        <ToolsCarousel onNav={onNav} />
      </section>

      <HanddrawnDivider />

      <HighlightCards />

      <HanddrawnDivider />

      {/* CHAPTER 2 — how it works */}
      <section id="how-it-works" style={{ scrollMarginTop: 80 }}>
        <div className="reveal" style={{ textAlign: "center", padding: "72px 24px 40px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>📖 Chapter 2</div>
          <h2 style={{ fontSize: "clamp(36px,5vw,52px)", fontWeight: 800, color: "#2D1B69", fontFamily: "Fredoka One", marginBottom: 12 }}>The Storytelling Journey</h2>
          <p style={{ color: "#6B5B8A", fontSize: 18, fontFamily: "Nunito", fontWeight: 500 }}>Click through the magic.</p>
        </div>
        <StickyStory />
      </section>

      <HanddrawnDivider />

      <Testimonials />

      <HanddrawnDivider />

      <PricingOverview onNav={onNav} />

      <HanddrawnDivider />

      {/* FINALE CTA — no Log In button */}
      <section style={{ padding: "100px 48px 120px", textAlign: "center", background: "linear-gradient(135deg, rgba(124,77,255,0.08) 0%, rgba(255,107,157,0.08) 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,77,255,0.15) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 20, filter: "drop-shadow(0 8px 20px rgba(124,77,255,0.3))" }}>✨</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 16, textTransform: "uppercase", letterSpacing: "1.5px" }}>🎬 The Finale</div>
          <h2 style={{ fontSize: "clamp(40px,5vw,64px)", fontWeight: 800, marginBottom: 16, color: "#2D1B69", fontFamily: "Fredoka One", lineHeight: 1.1 }}>Your Story Awaits</h2>
          <p style={{ color: "#6B5B8A", fontSize: 18, fontFamily: "Nunito", maxWidth: 520, margin: "0 auto 48px", fontWeight: 500, lineHeight: 1.7 }}>
            Free forever. No tricks. No surprises. Just magnificent branding magic. ✨
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <button className="btn-primary" style={{ fontSize: 18, padding: "18px 48px", fontFamily: "Nunito", fontWeight: 700 }} onClick={() => magicNav("signup")}>Begin Your Story 🪄</button>
          </div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["✅ Free forever", "🔒 No credit card", "⚡ Ready in 5 min", "🌍 11 languages"].map((s, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 700, color: "#9B8CB8", fontFamily: "Nunito" }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER — clean, no link columns, no avatar row */}
      <footer style={{ borderTop: "2px solid rgba(124,77,255,0.1)", padding: "40px 48px", background: "rgba(255,250,243,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, maxWidth: 1100, margin: "0 auto", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "Fredoka One", fontSize: 22, color: "#7C4DFF", marginBottom: 6 }}>📖 BrandCraft</div>
            <div style={{ color: "#6B5B8A", fontSize: 13, fontFamily: "Nunito", lineHeight: 1.5 }}>Where brand dreams come true. ✨</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["twitter", "instagram", "linkedin"].map(s => (
              <div key={s} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(124,77,255,0.08)", border: "1.5px solid rgba(124,77,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,77,255,0.16)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,77,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Icon name={s} size={18} color="#7C4DFF" />
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(124,77,255,0.08)", paddingTop: 20, textAlign: "center", color: "#A89BC0", fontSize: 13, fontFamily: "Nunito", maxWidth: 1100, margin: "0 auto" }}>
          © 2026 BrandCraft. Written with ✨ and 💜. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
