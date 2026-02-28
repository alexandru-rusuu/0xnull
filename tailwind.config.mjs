export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "void-bg": "#0a0a0f",
        "void-surface": "#12121a",
        "void-border": "#1e1e2e",
        "void-text": "#c8c8d4",
        "void-dim": "#5a5a72",
        "neon-cyan": "#00f0ff",
        "neon-magenta": "#ff00aa",
        "neon-green": "#39ff14",
        "neon-amber": "#ffbf00",
        "neon-violet": "#bf5fff",
        "glass-white": "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "Consolas", "monospace"],
        display: ['"Orbitron"', '"Rajdhani"', "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 5px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)",
        "neon-magenta": "0 0 5px #ff00aa, 0 0 20px rgba(255, 0, 170, 0.3)",
        "neon-green": "0 0 5px #39ff14, 0 0 20px rgba(57, 255, 20, 0.3)",
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "cursor-blink": "blink 1s step-end infinite",
        scanline: "scanline 8s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        "text-reveal": "text-reveal 0.05s steps(1) forwards",
        flicker: "flicker 0.15s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "glow-pulse": {
          "0%": { textShadow: "0 0 4px currentColor" },
          "100%": { textShadow: "0 0 12px currentColor, 0 0 30px currentColor" },
        },
        "text-reveal": {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.97" },
        },
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};