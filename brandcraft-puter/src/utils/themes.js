export const themes = {
  default: {
    name: "Default",
    emoji: "🎨",
    colors: {
      "--teal": "#4ECDC4",
      "--teal2": "#3BBDB4",
      "--teal-glow": "rgba(78,205,196,0.15)",
      "--purple": "#7C3AED",
      "--purple-glow": "rgba(124,58,237,0.2)",
    }
  },
  ocean: {
    name: "Ocean Blue",
    emoji: "🌊",
    colors: {
      "--teal": "#00D9FF",
      "--teal2": "#00B8D1",
      "--teal-glow": "rgba(0,217,255,0.15)",
      "--purple": "#0099CC",
      "--purple-glow": "rgba(0,153,204,0.2)",
    }
  },
  sunset: {
    name: "Sunset",
    emoji: "🌅",
    colors: {
      "--teal": "#FF6B35",
      "--teal2": "#E6502B",
      "--teal-glow": "rgba(255,107,53,0.15)",
      "--purple": "#F7931E",
      "--purple-glow": "rgba(247,147,30,0.2)",
    }
  },
  mint: {
    name: "Mint",
    emoji: "🌿",
    colors: {
      "--teal": "#00D084",
      "--teal2": "#00B86F",
      "--teal-glow": "rgba(0,208,132,0.15)",
      "--purple": "#00A86B",
      "--purple-glow": "rgba(0,168,107,0.2)",
    }
  },
  cyberpunk: {
    name: "Cyberpunk",
    emoji: "⚡",
    colors: {
      "--teal": "#FF006E",
      "--teal2": "#E6005E",
      "--teal-glow": "rgba(255,0,110,0.15)",
      "--purple": "#00D9FF",
      "--purple-glow": "rgba(0,217,255,0.2)",
    }
  },
  forest: {
    name: "Forest",
    emoji: "🌲",
    colors: {
      "--teal": "#2ECC71",
      "--teal2": "#27AE60",
      "--teal-glow": "rgba(46,204,113,0.15)",
      "--purple": "#16A085",
      "--purple-glow": "rgba(22,160,133,0.2)",
    }
  },
  lavender: {
    name: "Lavender",
    emoji: "💜",
    colors: {
      "--teal": "#B19CD9",
      "--teal2": "#9D7DB3",
      "--teal-glow": "rgba(177,156,217,0.15)",
      "--purple": "#8B7AB8",
      "--purple-glow": "rgba(139,122,184,0.2)",
    }
  },
  royal: {
    name: "Royal",
    emoji: "👑",
    colors: {
      "--teal": "#5B4B9E",
      "--teal2": "#464083",
      "--teal-glow": "rgba(91,75,158,0.15)",
      "--purple": "#9B59B6",
      "--purple-glow": "rgba(155,89,182,0.2)",
    }
  },
};

export function applyTheme(themeName) {
  const theme = themes[themeName] || themes.default;
  Object.entries(theme.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}
