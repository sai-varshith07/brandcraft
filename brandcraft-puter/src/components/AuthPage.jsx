import { useState, useEffect, useRef } from "react";

// ─── Reusable Character SVG ───────────────────────────────────────────────────
// eyeState: "open" | "closed"
function Character({ id, skin, hair, shirt, eyeColor, eyeState = "open", size = 110 }) {
  const w = size;
  const h = Math.round(size * 1.6);
  const s = size / 110; // scale factor vs 110px baseline

  const sc = (n) => n * s;

  const headCX = sc(55);
  const headCY = h - sc(85);
  const eyeBaseY = h - sc(85);
  const lx = sc(38);
  const rx = sc(72);
  const eyeR = sc(13);
  const irisR = sc(8);
  const pupilR = sc(4.5);

  const closed = eyeState === "closed";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {/* shirt/body */}
      <ellipse cx={headCX} cy={h - sc(25)} rx={sc(38)} ry={sc(28)} fill={shirt} />
      {/* neck */}
      <rect x={headCX - sc(9)} y={h - sc(65)} width={sc(18)} height={sc(16)} rx={sc(6)} fill={skin} />
      {/* head */}
      <ellipse cx={headCX} cy={headCY} rx={sc(38)} ry={sc(40)} fill={skin} />
      {/* hair */}
      <ellipse cx={headCX} cy={h - sc(120)} rx={sc(40)} ry={sc(21)} fill={hair} />
      {/* ears */}
      <ellipse cx={sc(17)} cy={headCY} rx={sc(8)} ry={sc(10)} fill={skin} />
      <ellipse cx={w - sc(17)} cy={headCY} rx={sc(8)} ry={sc(10)} fill={skin} />

      {/* LEFT EYE */}
      <circle cx={lx} cy={eyeBaseY} r={eyeR} fill="white" />
      {closed ? (
        <path
          d={`M ${lx - eyeR} ${eyeBaseY} Q ${lx} ${eyeBaseY + eyeR * 0.85} ${lx + eyeR} ${eyeBaseY}`}
          stroke={hair} strokeWidth={sc(2.5)} fill={skin} strokeLinecap="round"
        />
      ) : (
        <>
          <circle id={`${id}-li`} cx={lx} cy={eyeBaseY} r={irisR} fill={eyeColor} />
          <circle id={`${id}-lp`} cx={lx} cy={eyeBaseY} r={pupilR} fill="#111" />
          <circle cx={lx - sc(2)} cy={eyeBaseY - sc(2)} r={sc(2)} fill="white" />
        </>
      )}

      {/* RIGHT EYE */}
      <circle cx={rx} cy={eyeBaseY} r={eyeR} fill="white" />
      {closed ? (
        <path
          d={`M ${rx - eyeR} ${eyeBaseY} Q ${rx} ${eyeBaseY + eyeR * 0.85} ${rx + eyeR} ${eyeBaseY}`}
          stroke={hair} strokeWidth={sc(2.5)} fill={skin} strokeLinecap="round"
        />
      ) : (
        <>
          <circle id={`${id}-ri`} cx={rx} cy={eyeBaseY} r={irisR} fill={eyeColor} />
          <circle id={`${id}-rp`} cx={rx} cy={eyeBaseY} r={pupilR} fill="#111" />
          <circle cx={rx - sc(2)} cy={eyeBaseY - sc(2)} r={sc(2)} fill="white" />
        </>
      )}

      {/* eyebrows */}
      <path d={`M ${lx-sc(10)} ${eyeBaseY-sc(14)} Q ${lx} ${eyeBaseY-sc(18)} ${lx+sc(10)} ${eyeBaseY-sc(13)}`}
        stroke={hair} strokeWidth={sc(2.2)} fill="none" strokeLinecap="round" />
      <path d={`M ${rx-sc(10)} ${eyeBaseY-sc(13)} Q ${rx} ${eyeBaseY-sc(18)} ${rx+sc(10)} ${eyeBaseY-sc(14)}`}
        stroke={hair} strokeWidth={sc(2.2)} fill="none" strokeLinecap="round" />

      {/* nose */}
      <ellipse cx={headCX} cy={eyeBaseY + sc(12)} rx={sc(4.5)} ry={sc(3.5)}
        fill={skin === "#f5c5a3" ? "#e8a882" : skin === "#c68642" ? "#a05830" : skin === "#4a2040" ? "#3a1030" : "#d4906a"} />

      {/* mouth */}
      {closed ? (
        <path d={`M ${headCX-sc(9)} ${eyeBaseY+sc(25)} L ${headCX+sc(9)} ${eyeBaseY+sc(25)}`}
          stroke="#b06050" strokeWidth={sc(2)} fill="none" strokeLinecap="round" />
      ) : (
        <path d={`M ${headCX-sc(12)} ${eyeBaseY+sc(23)} Q ${headCX} ${eyeBaseY+sc(32)} ${headCX+sc(12)} ${eyeBaseY+sc(23)}`}
          stroke="#c07050" strokeWidth={sc(2.5)} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

const CHARS = [
  { id:"c1",  skin:"#f5c5a3", hair:"#3e1f00", shirt:"#26c6da", eyeColor:"#3b6ef8"  },
  { id:"c2",  skin:"#c68642", hair:"#1a0a00", shirt:"#e67e22", eyeColor:"#6b3a00"  },
  { id:"c3",  skin:"#4a2040", hair:"#1a0a00", shirt:"#9b59b6", eyeColor:"#e91e63"  },
  { id:"c4",  skin:"#fde0c0", hair:"#c08040", shirt:"#ff7043", eyeColor:"#43a047"  },
  { id:"c5",  skin:"#ffe0b2", hair:"#bf360c", shirt:"#ef5350", eyeColor:"#1565c0"  },
  { id:"c6",  skin:"#d7a87a", hair:"#4e342e", shirt:"#66bb6a", eyeColor:"#00796b"  },
  { id:"c7",  skin:"#ffd5b8", hair:"#212121", shirt:"#5c6bc0", eyeColor:"#6a1b9a"  },
  { id:"c8",  skin:"#c09060", hair:"#3e2723", shirt:"#ab47bc", eyeColor:"#ff6f00"  },
  { id:"c9",  skin:"#ffe5d0", hair:"#ffa000", shirt:"#26a69a", eyeColor:"#c62828"  },
  { id:"c10", skin:"#8d5524", hair:"#1b0000", shirt:"#ec407a", eyeColor:"#2e7d32"  },
  { id:"c11", skin:"#f8d5c0", hair:"#6d4c41", shirt:"#ffa726", eyeColor:"#0288d1"  },
  { id:"c12", skin:"#e8b89a", hair:"#37474f", shirt:"#78909c", eyeColor:"#558b2f"  },
];

// 12 positions surrounding the card — top(4), sides(4), bottom(4)
const POSITIONS = [
  // ── TOP 4 ──
  { style:{ top:20, left:"6%"      }, rotate:-10, scale:0.70, size:120 },
  { style:{ top:5,  left:"18%"     }, rotate: 6,  scale:0.76, size:125 },
  { style:{ top:8,  right:"18%"    }, rotate:-5,  scale:0.74, size:122 },
  { style:{ top:22, right:"6%"     }, rotate: 12, scale:0.68, size:118 },
  // ── LEFT 2 ──
  { style:{ top:"28%", left:"0%"   }, rotate:-18, scale:0.72, size:115 },
  { style:{ top:"54%", left:"1%"   }, rotate: 10, scale:0.68, size:110 },
  // ── RIGHT 2 ──
  { style:{ top:"30%", right:"0%"  }, rotate: 16, scale:0.74, size:115 },
  { style:{ top:"55%", right:"1%"  }, rotate:-12, scale:0.70, size:112 },
  // ── BOTTOM 4 ──
  { style:{ bottom:0, left:"3%"    }, rotate: -9, scale:0.72, size:145 },
  { style:{ bottom:0, left:"17%"   }, rotate: -4, scale:0.84, size:155 },
  { style:{ bottom:0, right:"17%"  }, rotate:  5, scale:0.82, size:152 },
  { style:{ bottom:0, right:"3%"   }, rotate: 10, scale:0.70, size:142 },
];

const INPUT_STYLE = {
  width: "100%",
  padding: "12px 16px",
  border: "1.5px solid #e5e7eb",
  borderRadius: 12,
  fontSize: "0.9rem",
  color: "#0f0f14",
  background: "#ffffff",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export function AuthPage({ type = "login", onAuth, onNav }) {
  const [formType,        setFormType]        = useState(type);
  const [email,           setEmail]           = useState("");
  const [pass,            setPass]            = useState("");
  const [name,            setName]            = useState("");
  const [loading,         setLoading]         = useState(false);
  const [showPass,        setShowPass]        = useState(false);
  const [passFocused,     setPassFocused]     = useState(false);
  const [blinking,        setBlinking]        = useState(false);
  const [cursor,          setCursor]          = useState({ x: 0, y: 0 });
  const charRefs = useRef([]);

  const isSignup = formType === "signup";

  // cursor tracking
  useEffect(() => {
    const h = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // random blink (skip when password focused — eyes already closed)
  useEffect(() => {
    let t;
    const schedule = () => {
      t = setTimeout(() => {
        if (!passFocused) {
          setBlinking(true);
          setTimeout(() => { setBlinking(false); schedule(); }, 130);
        } else {
          schedule();
        }
      }, 1800 + Math.random() * 2800);
    };
    schedule();
    return () => clearTimeout(t);
  }, [passFocused]);

  // pupil tracking
  useEffect(() => {
    if (passFocused) return;
    charRefs.current.forEach((el, idx) => {
      if (!el) return;
      const cfg = CHARS[idx];
      const pos = POSITIONS[idx];
      const rect = el.getBoundingClientRect();
      const elCX = rect.left + rect.width  / 2;
      const elCY = rect.top  + rect.height / 2;
      const dx = cursor.x - elCX;
      const dy = cursor.y - elCY;
      const MAX = 4.5;
      const ox = Math.max(-MAX, Math.min(MAX, dx / 30));
      const oy = Math.max(-MAX, Math.min(MAX, dy / 30));

      const sz = pos.size;
      const sc = sz / 110;
      const baseEyeY = sz * 1.6 - 85 * sc;
      const lx = 38 * sc;
      const rx = 72 * sc;

      ["li","lp"].forEach(part => {
        const el2 = document.getElementById(`${cfg.id}-${part}`);
        if (el2) { el2.setAttribute("cx", lx + ox); el2.setAttribute("cy", baseEyeY + oy); }
      });
      ["ri","rp"].forEach(part => {
        const el2 = document.getElementById(`${cfg.id}-${part}`);
        if (el2) { el2.setAttribute("cx", rx + ox); el2.setAttribute("cy", baseEyeY + oy); }
      });
    });
  }, [cursor, passFocused]);

  const handleSubmit = async () => {
    if (!email || !pass || (isSignup && !name)) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onAuth({ email, name: isSignup ? name : undefined, id: "user_" + Date.now() });
  };

  const eyeState = (passFocused || blinking) ? "closed" : "open";

  return (
    <div style={{
      width:"100vw", height:"100vh",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"flex-start",
      paddingTop: 36,
      position:"relative", overflow:"hidden",
      background:"#eef0f7",
      fontFamily:"'Outfit','Nunito',sans-serif",
    }}>

      {/* bg blobs */}
      <div style={{ position:"absolute", top:-100, left:-100, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,110,248,0.09) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(233,30,99,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>

      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"1.15rem", fontWeight:800, color:"#7C4DFF", letterSpacing:"-0.5px", marginBottom:26, zIndex:20, fontFamily:"Fredoka One" }}>
        📖 BrandCraft
      </div>

      {/* ── 12 Characters scattered around ── */}
      {CHARS.map((cfg, idx) => {
        const pos = POSITIONS[idx];
        return (
          <div
            key={cfg.id}
            ref={el => charRefs.current[idx] = el}
            style={{
              position: "absolute",
              zIndex: 8,
              transformOrigin: "bottom center",
              transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
              transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
              pointerEvents: "none",
              ...pos.style,
            }}
          >
            <Character
              id={cfg.id}
              skin={cfg.skin}
              hair={cfg.hair}
              shirt={cfg.shirt}
              eyeColor={cfg.eyeColor}
              eyeState={eyeState}
              size={pos.size}
            />
          </div>
        );
      })}

      {/* ── Auth Card ── */}
      <div style={{
        background:"#ffffff", borderRadius:24,
        padding:"36px 40px 32px", width:400,
        boxShadow:"0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.1)",
        position:"relative", zIndex:20,
      }}>

        {/* Tabs */}
        <div style={{ display:"flex", background:"#f7f8fc", borderRadius:12, padding:4, marginBottom:26 }}>
          {[["login","Log In"],["signup","Sign Up"]].map(([t,label]) => (
            <div key={t} onClick={() => setFormType(t)} style={{
              flex:1, padding:"9px 0", textAlign:"center",
              fontSize:"0.88rem", fontWeight:600, borderRadius:9, cursor:"pointer",
              color: formType===t ? "#0f0f14" : "#6b7280",
              background: formType===t ? "#ffffff" : "transparent",
              boxShadow: formType===t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition:"all 0.25s", userSelect:"none",
            }}>{label}</div>
          ))}
        </div>

        {/* Heading */}
        <div style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:"1.6rem", color:"#0f0f14", marginBottom:4, lineHeight:1.2 }}>
          {isSignup ? "Create your brand ✨" : "Welcome back 👋"}
        </div>
        <div style={{ fontSize:"0.82rem", color:"#6b7280", marginBottom:22 }}>
          {isSignup ? "Create your account and start building your brand." : "Log in to continue your brand story."}
        </div>

        {/* Name field (signup only) */}
        {isSignup && (
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"#0f0f14", marginBottom:6 }}>Full Name</label>
            <input type="text" placeholder="Alex Johnson" value={name}
              onChange={e => setName(e.target.value)} style={INPUT_STYLE}
              onFocus={e => { e.target.style.borderColor="#3b6ef8"; e.target.style.boxShadow="0 0 0 4px rgba(59,110,248,0.1)"; }}
              onBlur={e => { e.target.style.borderColor="#e5e7eb"; e.target.style.boxShadow="none"; }}
            />
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"#0f0f14", marginBottom:6 }}>Email</label>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)} style={INPUT_STYLE}
            onFocus={e => { e.target.style.borderColor="#3b6ef8"; e.target.style.boxShadow="0 0 0 4px rgba(59,110,248,0.1)"; }}
            onBlur={e => { e.target.style.borderColor="#e5e7eb"; e.target.style.boxShadow="none"; }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: isSignup ? 8 : 4 }}>
          <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"#0f0f14", marginBottom:6 }}>Password</label>
          <div style={{ position:"relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              style={{ ...INPUT_STYLE, paddingRight:56 }}
            />
            <button
              onClick={() => setShowPass(v => !v)}
              style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:"0.75rem", fontFamily:"inherit", fontWeight:500 }}
            >{showPass ? "Hide" : "Show"}</button>
          </div>
        </div>

        {/* Remember / forgot (login only) */}
        {!isSignup && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px 0 18px", fontSize:"0.78rem" }}>
            <label style={{ display:"flex", alignItems:"center", gap:6, color:"#6b7280", cursor:"pointer" }}>
              <input type="checkbox" style={{ accentColor:"#3b6ef8" }}/> Remember me
            </label>
            <span style={{ color:"#3b6ef8", fontWeight:600, cursor:"pointer" }}>Forgot password?</span>
          </div>
        )}

        {/* Primary CTA */}
        <button
          onClick={handleSubmit} disabled={loading}
          style={{
            width:"100%", padding:"14px",
            background:"#0f0f14", color:"#ffffff",
            border:"none", borderRadius:14,
            fontFamily:"inherit", fontSize:"0.95rem", fontWeight:700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginTop: isSignup ? 6 : 0,
            marginBottom:14, letterSpacing:"0.3px",
            transition:"background 0.2s, transform 0.15s",
          }}
          onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="translateY(-1px)"; }}
          onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
        >
          {loading ? "…" : isSignup ? "Create Account →" : "Log In →"}
        </button>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:"0.75rem", color:"#c0c4cc", marginBottom:14 }}>
          <div style={{ flex:1, height:1, background:"#e5e7eb" }}/> or <div style={{ flex:1, height:1, background:"#e5e7eb" }}/>
        </div>

        {/* Google */}
        <button
          onClick={() => onAuth({ email:"google", id:"google_"+Date.now() })}
          style={{ width:"100%", padding:"12px", border:"1.5px solid #e5e7eb", borderRadius:14, background:"#ffffff", display:"flex", alignItems:"center", justifyContent:"center", gap:10, fontFamily:"inherit", fontSize:"0.88rem", fontWeight:600, color:"#0f0f14", cursor:"pointer", transition:"background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="#f7f8fc"}
          onMouseLeave={e => e.currentTarget.style.background="#ffffff"}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {isSignup ? "Sign up with Google" : "Continue with Google"}
        </button>

        {/* Switch form */}
        <div style={{ textAlign:"center", fontSize:"0.8rem", color:"#6b7280", marginTop:16 }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setFormType(isSignup ? "login" : "signup")} style={{ color:"#3b6ef8", fontWeight:700, cursor:"pointer" }}>
            {isSignup ? "Log in" : "Sign up free"}
          </span>
        </div>
      </div>

      {/* 🙈 hint when typing password */}
      {passFocused && (
        <div style={{
          position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
          background:"rgba(15,15,20,0.85)", color:"#fff",
          padding:"9px 22px", borderRadius:99,
          fontSize:13, fontWeight:600, whiteSpace:"nowrap",
          backdropFilter:"blur(12px)", zIndex:100,
          animation:"fadeSlideIn 0.3s ease",
        }}>
          🙈 They're covering their eyes! Your secret is safe.
        </div>
      )}
    </div>
  );
}
