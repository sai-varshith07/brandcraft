import { useState, useEffect } from "react";
import { AuthPage } from "./AuthPage";
export { AuthPage };

const stepEmojis = ["💬","🏭","🚀","👥","⚧","🎨","🎯","✏️","📸","🎭","🎙️","🏆"];

export function OnboardingPage({ user, onComplete }) {
  const [step, setStep]       = useState(0);
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [animKey, setAnimKey] = useState(0);
  const [profile, setProfile] = useState({
    businessDo:"", industry:"", businessStage:"", targetAge:[],
    genderFocus:"", colorMood:"", logoStyle:"", designAesthetic:"",
    imageryStyle:"", personality:{ playful:50, minimal:50, modern:50 },
    brandVoice:"", brandGoals:[],
  });

  const questions = [
    { key:"businessDo",      label:"What does your business do?",             type:"textarea", placeholder:"e.g. We sell handcrafted eco-friendly candles to mindful consumers…" },
    { key:"industry",        label:"What industry are you in?",                type:"dropdown", options:["Fashion","Tech","Food & Beverage","Health & Wellness","Finance","Education","Entertainment","E-commerce","Real Estate","Sports"] },
    { key:"businessStage",   label:"What stage is your business at?",          type:"pills",    options:["Idea","Startup","Growing","Established"], single:true },
    { key:"targetAge",       label:"Who is your target age group?",            type:"pills",    options:["Gen Z","Millennial","Gen X","Boomer","All"], multi:true },
    { key:"genderFocus",     label:"What is your gender focus?",               type:"pills",    options:["Male","Female","Neutral","All"], single:true },
    { key:"colorMood",       label:"What color mood fits your brand?",         type:"swatches", options:[{label:"Warm",color:"#FFB74D"},{label:"Cool",color:"#64B5F6"},{label:"Dark",color:"#424242"},{label:"Pastel",color:"#F8BBD9"},{label:"Vibrant",color:"#FF5722"},{label:"Neutral",color:"#9E9E9E"}], single:true },
    { key:"logoStyle",       label:"What logo style do you want?",             type:"cards",    options:["Wordmark","Icon","Monogram","Abstract","Combination"], single:true },
    { key:"designAesthetic", label:"What design aesthetic fits your brand?",   type:"cards",    options:["Minimal","Bold","Playful","Elegant","Futuristic","Retro"], single:true },
    { key:"imageryStyle",    label:"What imagery style fits your brand?",      type:"cards",    options:["Photography","Illustration","3D","Flat"], single:true },
    { key:"personality",     label:"Set your brand personality",               type:"sliders",  sliders:[{left:"Playful",right:"Professional",key:"playful"},{left:"Minimal",right:"Bold",key:"minimal"},{left:"Modern",right:"Classic",key:"modern"}] },
    { key:"brandVoice",      label:"What is your brand voice?",                type:"pills",    options:["Friendly","Authoritative","Witty","Inspiring","Luxurious","Edgy"], single:true },
    { key:"brandGoals",      label:"What are your brand goals?",               type:"pills",    options:["Build Trust","Go Viral","Look Premium","Appeal Globally","Build Community"], multi:true },
  ];

  const current = questions[step];
  const pct = ((step + 1) / questions.length) * 100;

  const goStep = (dir) => {
    setDirection(dir);
    setAnimKey(k => k + 1);
    setStep(s => s + dir);
  };

  const handleChange = (key, value) => setProfile(p => ({ ...p, [key]: value }));
  const handleMultiSelect = (key, option, selected) => {
    const cur = profile[key] || [];
    setProfile(p => ({ ...p, [key]: selected ? [...cur, option] : cur.filter(o => o !== option) }));
  };
  const handleSlider = (sliderKey, value) => {
    setProfile(p => ({ ...p, personality: { ...p.personality, [sliderKey]: value } }));
  };

  const renderInput = () => {
    switch (current.type) {
      case "textarea":
        return (
          <textarea
            className="input-base"
            rows={4}
            placeholder={current.placeholder || "Tell us more…"}
            value={profile[current.key]}
            onChange={e => handleChange(current.key, e.target.value)}
            style={{ resize:"none", fontSize:15, lineHeight:1.6 }}
          />
        );

      case "dropdown":
        return (
          <select
            className="select-base"
            value={profile[current.key]}
            onChange={e => handleChange(current.key, e.target.value)}
          >
            <option value="">Select an option…</option>
            {current.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );

      case "pills":
        return (
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {current.options.map(opt => {
              const active = current.multi
                ? (profile[current.key] || []).includes(opt)
                : profile[current.key] === opt;
              return (
                <button
                  key={opt}
                  className={`pill ${active ? "active" : ""}`}
                  onClick={() => {
                    if (current.multi) handleMultiSelect(current.key, opt, !active);
                    else handleChange(current.key, active ? "" : opt);
                  }}
                  style={{ fontSize:14, padding:"10px 20px" }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );

      case "swatches":
        return (
          <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
            {current.options.map(opt => {
              const active = profile[current.key] === opt.label;
              return (
                <button
                  key={opt.label}
                  onClick={() => handleChange(current.key, active ? "" : opt.label)}
                  style={{
                    display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                    padding:"14px 18px", borderRadius:16, border:"none",
                    background: active ? "rgba(124,77,255,0.1)" : "rgba(255,252,255,0.8)",
                    outline: active ? "2px solid var(--violet)" : "1.5px solid var(--border)",
                    cursor:"pointer",
                    transition:"all 0.22s var(--spring)",
                    transform: active ? "translateY(-3px) scale(1.05)" : "translateY(0) scale(1)",
                    boxShadow: active ? "0 8px 20px rgba(124,77,255,0.2)" : "var(--shadow-xs)",
                  }}
                  onMouseEnter={e => { if(!active) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="var(--shadow-sm)"; }}}
                  onMouseLeave={e => { if(!active) { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="var(--shadow-xs)"; }}}
                >
                  <div style={{ width:36, height:36, borderRadius:10, background:opt.color, boxShadow:`0 4px 12px ${opt.color}55` }} />
                  <span style={{ fontSize:12, fontWeight:700, color: active ? "var(--violet)" : "var(--text2)", fontFamily:"Nunito" }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        );

      case "cards":
        return (
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {current.options.map(opt => {
              const active = profile[current.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleChange(current.key, active ? "" : opt)}
                  style={{
                    padding:"13px 20px", borderRadius:14,
                    border: active ? "2px solid var(--violet)" : "1.5px solid var(--border)",
                    background: active ? "rgba(124,77,255,0.08)" : "rgba(255,252,255,0.85)",
                    color: active ? "var(--violet)" : "var(--text2)",
                    fontFamily:"Nunito", fontSize:14, fontWeight:700,
                    cursor:"pointer",
                    transition:"all 0.22s var(--spring)",
                    transform: active ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: active ? "0 6px 16px rgba(124,77,255,0.18)" : "var(--shadow-xs)",
                  }}
                  onMouseEnter={e => { if(!active) { e.currentTarget.style.borderColor="var(--violet)"; e.currentTarget.style.color="var(--violet)"; e.currentTarget.style.transform="translateY(-2px)"; }}}
                  onMouseLeave={e => { if(!active) { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text2)"; e.currentTarget.style.transform="translateY(0)"; }}}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );

      case "sliders":
        return (
          <div style={{ width:"100%" }}>
            {current.sliders.map((slider, si) => (
              <div key={slider.key} style={{ marginBottom:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:13, fontWeight:700, color:"var(--text2)" }}>
                  <span>{slider.left}</span>
                  <span style={{ background:"var(--violet-soft)", color:"var(--violet)", borderRadius:99, padding:"2px 10px", fontSize:12 }}>{profile.personality[slider.key]}%</span>
                  <span>{slider.right}</span>
                </div>
                <div style={{ position:"relative", height:6 }}>
                  <div style={{ position:"absolute", inset:0, borderRadius:99, background:"rgba(124,77,255,0.1)" }} />
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, borderRadius:99, width:`${profile.personality[slider.key]}%`, background:"linear-gradient(90deg, var(--violet), var(--pink))", transition:"width 0.2s" }} />
                  <input
                    type="range" min="0" max="100"
                    value={profile.personality[slider.key]}
                    onChange={e => handleSlider(slider.key, parseInt(e.target.value))}
                    style={{
                      position:"absolute", inset:0, width:"100%", height:"100%",
                      opacity:0, cursor:"pointer", margin:0,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="mesh-bg" style={{
      minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
      background:"linear-gradient(135deg, #F5EEFF 0%, #FFF0FB 50%, #EEF4FF 100%)",
    }}>
      <div className="mesh-layer" />

      {/* Step dots — top */}
      <div style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5, zIndex:100 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 7, height:7, borderRadius:99,
            background: i < step ? "var(--violet)" : i === step ? "linear-gradient(90deg, var(--violet), var(--pink))" : "rgba(124,77,255,0.15)",
            transition:"all 0.35s var(--spring)",
            boxShadow: i === step ? "0 2px 8px var(--violet-glow)" : "none",
          }} />
        ))}
      </div>

      {/* Main card */}
      <div
        key={animKey}
        className="glass-card"
        style={{
          width:"100%", maxWidth:660,
          padding:"44px 48px",
          position:"relative",
          animation:`${direction > 0 ? "slideFromRight" : "slideFromLeft"} 0.4s var(--spring)`,
        }}
      >
        {/* Step emoji */}
        <div style={{ fontSize:52, marginBottom:20, animation:"float 4s ease-in-out infinite", display:"inline-block" }}>
          {stepEmojis[step]}
        </div>

        {/* Question counter */}
        <div style={{ fontSize:12, fontWeight:800, color:"var(--violet)", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:10 }}>
          Step {step + 1} of {questions.length}
        </div>

        {/* Question label */}
        <h2 style={{ fontSize:26, color:"var(--text)", marginBottom:26, lineHeight:1.25 }}>{current.label}</h2>

        {/* Input area */}
        <div style={{ marginBottom:32 }}>{renderInput()}</div>

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <button
            className="btn-ghost btn-sm"
            onClick={() => goStep(-1)}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.35 : 1 }}
          >
            ← Previous
          </button>

          <div style={{ fontSize:13, color:"var(--text3)", fontWeight:600 }}>{Math.round(pct)}% complete</div>

          {step < questions.length - 1 ? (
            <button className="btn-primary btn-sm" onClick={() => goStep(1)}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary btn-sm" onClick={onComplete.bind(null, profile)}>
              ✨ Generate My Brand
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginTop:24 }}>
          <div className="progress-fill" style={{ width:`${pct}%` }} />
        </div>
      </div>

      <style>{`
        @keyframes slideFromRight {
          from { opacity:0; transform: translateX(36px) scale(0.97); }
          to   { opacity:1; transform: translateX(0)    scale(1); }
        }
        @keyframes slideFromLeft {
          from { opacity:0; transform: translateX(-36px) scale(0.97); }
          to   { opacity:1; transform: translateX(0)     scale(1); }
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, var(--violet), var(--pink));
          cursor: pointer;
          box-shadow: 0 2px 8px var(--violet-glow);
          transition: transform 0.2s var(--spring);
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }
      `}</style>
    </div>
  );
}
