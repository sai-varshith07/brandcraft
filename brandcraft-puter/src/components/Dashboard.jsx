import React, { useEffect, useMemo, useState } from "react";
import { callAIJSON } from "../utils/api";
import "./Dashboard.css";

const toolGroups = [
  {
    label: "Discover",
    id: "discover",
    color: "#7C4DFF",
    tools: ["Domain Checker", "Steal This Brand", "Brand Story", "Market Research", "Growth Hacker"],
  },
  {
    label: "Brand Identity",
    id: "brand-identity",
    color: "#9B5CFF",
    tools: ["Brand Names", "Logo Creator", "Color Palette", "Font Pairing", "Mission & Vision", "Website Generator"],
  },
  {
    label: "Content & Copy",
    id: "content-copy",
    color: "#F050A8",
    tools: ["Ad Copy", "Social Bio", "Email Templates", "Content Calendar", "Post Mockup", "Content Automation", "Ad Generator", "Lead Magnet"],
  },
  {
    label: "Voice & Style",
    id: "voice-style",
    color: "#6E59FF",
    tools: ["Voice Rewriter", "Buyer Persona", "Sentiment Analysis"],
  },
  {
    label: "Manage",
    id: "manage",
    color: "#FFAD00",
    tools: ["Brand Score", "Consistency Checker", "Sentiment Analysis", "Financial Calculator"],
  },
  {
    label: "Share",
    id: "share",
    color: "#00C9B4",
    tools: ["Brand Card", "QR Code", "Canva Export"],
  },
];

const allTools = toolGroups.flatMap((group) =>
  group.tools.map((name) => ({
    name,
    groupId: group.id,
    groupLabel: group.label,
    color: group.color,
  }))
);

function AISuggestions({ brandProfile }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!brandProfile) {
      setSuggestions([]);
      return;
    }

    let active = true;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const data = await callAIJSON(
          'You are a senior brand strategist. Return only valid JSON in this format: {"suggestions":[{"title":"Short title","desc":"One sentence with a specific next step."}]}. Generate exactly 3 suggestions from this brand profile.',
          JSON.stringify(brandProfile)
        );
        if (!active) return;

        setSuggestions(
          Array.isArray(data?.suggestions) && data.suggestions.length > 0
            ? data.suggestions.slice(0, 3)
            : [
                { title: "Sharpen your message", desc: "Turn your strongest audience benefit into a one-line promise for every channel." },
                { title: "Expand your toolkit", desc: "Use the brand identity and content tools together so the visuals and copy land as one system." },
                { title: "Close the launch loop", desc: "Convert your selected outputs into a tighter rollout pack with one hero message and one CTA." },
              ]
        );
      } catch {
        if (!active) return;
        setSuggestions([
          { title: "Sharpen your message", desc: "Turn your strongest audience benefit into a one-line promise for every channel." },
          { title: "Expand your toolkit", desc: "Use the brand identity and content tools together so the visuals and copy land as one system." },
          { title: "Close the launch loop", desc: "Convert your selected outputs into a tighter rollout pack with one hero message and one CTA." },
        ]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      active = false;
    };
  }, [brandProfile]);

  return (
    <section className="dashboard-section dashboard-panel">
      <div className="dashboard-section-header">
        <div>
          <div className="dashboard-eyebrow">AI Suggestions</div>
          <h2>Recommended next moves</h2>
        </div>
      </div>

      <div className="dashboard-suggestion-grid">
        {(loading ? [1, 2, 3] : suggestions).map((item, index) => (
          <article className="dashboard-suggestion-card" key={loading ? index : item.title}>
            <div className="dashboard-suggestion-index">0{index + 1}</div>
            <h3>{loading ? "Thinking..." : item.title}</h3>
            <p>{loading ? "Generating brand-specific guidance from your profile answers." : item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScoreRadar({ metrics }) {
  const size = 280;
  const center = size / 2;
  const radius = 92;

  const labels = metrics.map((metric) => metric.label);
  const points = metrics.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const pointRadius = radius * (metric.value / 100);
    return {
      x: center + Math.cos(angle) * pointRadius,
      y: center + Math.sin(angle) * pointRadius,
      labelX: center + Math.cos(angle) * (radius + 28),
      labelY: center + Math.sin(angle) * (radius + 28),
      glowX: center + Math.cos(angle) * radius,
      glowY: center + Math.sin(angle) * radius,
      color: metric.color,
      value: metric.value,
      label: metric.label,
    };
  });

  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="dashboard-radar-card dashboard-panel">
      <div className="dashboard-section-header">
        <div>
          <div className="dashboard-eyebrow">Radar</div>
          <h2>Brand balance map</h2>
        </div>
      </div>

      <div className="dashboard-radar-wrap">
        <svg className="dashboard-radar-svg" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Brand radar chart">
          {[25, 50, 75, 100].map((level) => {
            const ringPoints = labels
              .map((_, index) => {
                const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
                const ringRadius = radius * (level / 100);
                return `${center + Math.cos(angle) * ringRadius},${center + Math.sin(angle) * ringRadius}`;
              })
              .join(" ");

            return <polygon key={level} points={ringPoints} className="dashboard-radar-ring" />;
          })}

          {labels.map((_, index) => {
            const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={center + Math.cos(angle) * radius}
                y2={center + Math.sin(angle) * radius}
                className="dashboard-radar-axis"
              />
            );
          })}

          <polygon points={polygon} className="dashboard-radar-area" />

          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.glowX} cy={point.glowY} r="3.5" fill="rgba(122, 84, 255, 0.18)" />
              <circle cx={point.x} cy={point.y} r="6" fill={point.color} className="dashboard-radar-dot" />
              <text x={point.labelX} y={point.labelY} className="dashboard-radar-label">
                {point.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="dashboard-radar-legend">
          {metrics.map((metric) => (
            <div className="dashboard-radar-legend-item" key={metric.label}>
              <span className="dashboard-radar-swatch" style={{ background: metric.color }} />
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandScoreCircle({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <article className="dashboard-brand-score dashboard-panel">
      <div className="dashboard-section-header">
        <div>
          <div className="dashboard-eyebrow">Brand Score</div>
          <h2>Readiness ring</h2>
        </div>
      </div>

      <div className="dashboard-brand-score-inner">
        <svg viewBox="0 0 160 160" className="dashboard-brand-score-svg" role="img" aria-label={`Brand score ${score} out of 100`}>
          <defs>
            <linearGradient id="brandScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C4DFF" />
              <stop offset="55%" stopColor="#AB63FF" />
              <stop offset="100%" stopColor="#F050A8" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r={radius} className="dashboard-brand-score-track" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="dashboard-brand-score-progress"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <circle cx="80" cy="80" r="45" className="dashboard-brand-score-core" />
          <text x="80" y="74" textAnchor="middle" className="dashboard-brand-score-value">
            {score}
          </text>
          <text x="80" y="96" textAnchor="middle" className="dashboard-brand-score-sub">
            /100
          </text>
        </svg>

        <div className="dashboard-brand-score-copy">
          <strong>Brand reach {score}/100</strong>
          <p>The ring fills as your profile, tools, outputs, and selections become more complete and launch-ready.</p>
        </div>
      </div>
    </article>
  );
}

export default function Dashboard({ brandProfile, onNav, outputs = [], selectedOutputs = {}, onDownloadPDF }) {
  const onboardingAnswers = useMemo(() => {
    if (!brandProfile) return [];

    const personality = brandProfile.personality
      ? `Playful ${brandProfile.personality.playful} • Minimal ${brandProfile.personality.minimal} • Modern ${brandProfile.personality.modern}`
      : "";

    return [
      { label: "Business", value: brandProfile.businessDo },
      { label: "Industry", value: brandProfile.industry },
      { label: "Stage", value: brandProfile.businessStage },
      { label: "Target Age", value: brandProfile.targetAge?.join(", ") },
      { label: "Gender Focus", value: brandProfile.genderFocus },
      { label: "Color Mood", value: brandProfile.colorMood },
      { label: "Logo Style", value: brandProfile.logoStyle },
      { label: "Design Aesthetic", value: brandProfile.designAesthetic },
      { label: "Imagery Style", value: brandProfile.imageryStyle },
      { label: "Personality", value: personality },
      { label: "Brand Voice", value: brandProfile.brandVoice },
      { label: "Brand Goals", value: brandProfile.brandGoals?.join(", ") },
    ].filter((item) => item.value);
  }, [brandProfile]);

  const usedTools = useMemo(() => {
    const usedNames = new Set(outputs.map((output) => output.feature));
    return allTools.filter((tool) => usedNames.has(tool.name));
  }, [outputs]);

  const completionCount = Object.keys(selectedOutputs || {}).length;
  const completionPercent = Math.round((completionCount / 7) * 100) || 0;
  const answerPercent = Math.round((onboardingAnswers.length / 12) * 100) || 0;
  const toolCoverage = Math.round((usedTools.length / allTools.length) * 100) || 0;
  const suggestionReadiness = Math.min(100, Math.round(answerPercent * 0.55 + toolCoverage * 0.2 + completionPercent * 0.25));
  const consistencyScore = Math.min(100, Math.round(answerPercent * 0.45 + completionPercent * 0.35 + Math.min(outputs.length * 6, 20)));
  const contentMomentum = Math.min(100, Math.round(toolCoverage * 0.5 + Math.min(outputs.length * 8, 50)));
  const identityStrength = Math.min(100, Math.round(answerPercent * 0.5 + completionPercent * 0.2 + (brandProfile?.logoStyle ? 15 : 0) + (brandProfile?.colorMood ? 15 : 0)));
  const activationScore = Math.min(100, Math.round(toolCoverage * 0.3 + completionPercent * 0.4 + Math.min(outputs.length * 7, 30)));
  const overallScore = Math.round((consistencyScore + contentMomentum + identityStrength + suggestionReadiness + activationScore) / 5);

  const scoreCards = [
    { label: "Overall Score", value: overallScore, suffix: "/100", accent: "violet", text: "How ready the brand is across profile, outputs, and selections." },
    { label: "Identity Strength", value: identityStrength, suffix: "%", accent: "pink", text: "Logo, color, and aesthetic inputs are giving the brand a stronger shape." },
    { label: "Tool Coverage", value: toolCoverage, suffix: "%", accent: "blue", text: "Shows how many tools have already contributed to the build." },
    { label: "Activation", value: activationScore, suffix: "%", accent: "gold", text: "Measures progress from raw inputs into chosen brand assets." },
  ];

  const radarMetrics = [
    { label: "Strategy", value: suggestionReadiness, color: "#7C4DFF" },
    { label: "Identity", value: identityStrength, color: "#F050A8" },
    { label: "Content", value: contentMomentum, color: "#5A8BFF" },
    { label: "Trust", value: consistencyScore, color: "#00C9B4" },
    { label: "Launch", value: activationScore, color: "#FFB300" },
  ];

  const brandName = brandProfile?.brandName || "Your Brand";

  return (
    <div className="dashboard-shell">
      <div className="dashboard-static-backdrop" aria-hidden="true">
        <div className="dashboard-blob blob-violet" />
        <div className="dashboard-blob blob-purple" />
        <div className="dashboard-blob blob-pink" />
        <div className="dashboard-blob blob-blue" />
        <div className="dashboard-blob blob-gold" />
        <div className="dashboard-blob blob-mint" />
      </div>

      <div className="dashboard-content">
        <header className="dashboard-hero dashboard-panel">
          <div>
            <div className="dashboard-eyebrow">Brand overview</div>
            <h1>{brandName}</h1>
            <p>
              This dashboard now centers the 12 onboarding inputs, AI suggestions, your score board, the radar view, all tools, and the tools already used.
            </p>
          </div>

          <div className="dashboard-hero-actions">
            <button className="dashboard-primary-btn" onClick={() => onNav("onboarding")}>
              Edit 12 answers
            </button>
            <button className="dashboard-secondary-btn" onClick={onDownloadPDF}>
              Export brand PDF
            </button>
          </div>
        </header>

        <section className="dashboard-summary-grid">
          {scoreCards.map((card) => (
            <article className={`dashboard-summary-card dashboard-panel accent-${card.accent}`} key={card.label}>
              <span className="dashboard-summary-label">{card.label}</span>
              <strong>
                {card.value}
                <small>{card.suffix}</small>
              </strong>
              <p>{card.text}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-score-layout">
          <section className="dashboard-section dashboard-panel">
            <div className="dashboard-section-header">
              <div>
                <div className="dashboard-eyebrow">Score Board</div>
                <h2>Progress at a glance</h2>
              </div>
            </div>

            <div className="dashboard-scoreboard-grid">
              <article className="dashboard-scoreboard-card">
                <span>12 Questions</span>
                <strong>{onboardingAnswers.length}/12</strong>
                <div className="dashboard-inline-bar">
                  <div style={{ width: `${answerPercent}%` }} />
                </div>
              </article>
              <article className="dashboard-scoreboard-card">
                <span>Tools Used</span>
                <strong>{usedTools.length}</strong>
                <div className="dashboard-inline-bar violet">
                  <div style={{ width: `${toolCoverage}%` }} />
                </div>
              </article>
              <article className="dashboard-scoreboard-card">
                <span>Selected Outputs</span>
                <strong>{completionCount}/7</strong>
                <div className="dashboard-inline-bar pink">
                  <div style={{ width: `${completionPercent}%` }} />
                </div>
              </article>
              <article className="dashboard-scoreboard-card">
                <span>AI Readiness</span>
                <strong>{suggestionReadiness}%</strong>
                <div className="dashboard-inline-bar gold">
                  <div style={{ width: `${suggestionReadiness}%` }} />
                </div>
              </article>
            </div>

            <div className="dashboard-glance-strip">
              <article className="dashboard-glance-card">
                <span>Current focus</span>
                <strong>{toolCoverage < 40 ? "Explore more tools" : "Refine your strongest outputs"}</strong>
              </article>
              <article className="dashboard-glance-card">
                <span>Best signal</span>
                <strong>{identityStrength >= contentMomentum ? "Identity system is leading" : "Content momentum is rising"}</strong>
              </article>
              <article className="dashboard-glance-card">
                <span>Next milestone</span>
                <strong>{completionCount < 7 ? `${7 - completionCount} more selections to finish` : "Brand package complete"}</strong>
              </article>
            </div>
          </section>

          <div className="dashboard-score-side">
            <BrandScoreCircle score={overallScore} />
            <ScoreRadar metrics={radarMetrics} />
          </div>
        </section>

        <section className="dashboard-section dashboard-panel">
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-eyebrow">12 Questions</div>
              <h2>Input data from onboarding</h2>
            </div>
            <button className="dashboard-secondary-btn" onClick={() => onNav("onboarding")}>
              Update answers
            </button>
          </div>

          {onboardingAnswers.length > 0 ? (
            <div className="dashboard-answer-grid">
              {onboardingAnswers.map((item) => (
                <article className="dashboard-answer-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">Complete your onboarding profile to surface all 12 answers here.</div>
          )}
        </section>

        <AISuggestions brandProfile={brandProfile} />

        <section className="dashboard-section dashboard-panel">
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-eyebrow">All Tools</div>
              <h2>Everything available in the studio</h2>
            </div>
          </div>

          <div className="dashboard-tool-groups">
            {toolGroups.map((group) => (
              <article className="dashboard-tool-group" key={group.id}>
                <div className="dashboard-tool-group-header">
                  <h3 style={{ color: group.color }}>{group.label}</h3>
                  <button className="dashboard-link-btn" onClick={() => onNav(group.id)}>
                    Open
                  </button>
                </div>
                <div className="dashboard-tool-list">
                  {group.tools.map((tool) => {
                    const used = usedTools.some((item) => item.name === tool);
                    return (
                      <button
                        key={tool}
                        className={`dashboard-tool-chip ${used ? "used" : ""}`}
                        onClick={() => onNav(group.id)}
                        type="button"
                      >
                        <span>{tool}</span>
                        <small>{used ? "Used" : "Available"}</small>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-section dashboard-panel">
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-eyebrow">Tools Used</div>
              <h2>Tools you have already used</h2>
            </div>
          </div>

          {usedTools.length > 0 ? (
            <div className="dashboard-used-grid">
              {usedTools.map((tool) => (
                <article className="dashboard-used-card" key={tool.name}>
                  <span className="dashboard-used-group">{tool.groupLabel}</span>
                  <strong>{tool.name}</strong>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              No tools have been used yet. Start with Brand Identity or Discover to generate your first output.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
