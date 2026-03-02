import type { CommandDefinition } from "@/core/engine/types";

export interface ThemeDef {
  name: string;
  label: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    dim: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
  };
}

const THEMES: ThemeDef[] = [
  {
    name: "cyberpunk",
    label: "Cyberpunk",
    description: "Default neon cyan/magenta",
    colors: {
      bg: "#0a0a0f",
      surface: "#12121a",
      border: "#1e1e2e",
      text: "#c8c8d4",
      dim: "#5a5a72",
      primary: "#00f0ff",
      secondary: "#ff00aa",
      accent: "#bf5fff",
      success: "#39ff14",
      warning: "#ffbf00",
    },
  },
  {
    name: "matrix",
    label: "Matrix",
    description: "Green phosphor monochrome",
    colors: {
      bg: "#000a00",
      surface: "#001200",
      border: "#002200",
      text: "#33ff33",
      dim: "#1a7a1a",
      primary: "#00ff41",
      secondary: "#00cc33",
      accent: "#66ff66",
      success: "#00ff00",
      warning: "#88ff44",
    },
  },
  {
    name: "synthwave",
    label: "Synthwave",
    description: "Purple/pink retro vibes",
    colors: {
      bg: "#0d0221",
      surface: "#150535",
      border: "#2a0845",
      text: "#e0d0ff",
      dim: "#7a5aaa",
      primary: "#ff71ce",
      secondary: "#01cdfe",
      accent: "#b967ff",
      success: "#05ffa1",
      warning: "#fffb96",
    },
  },
  {
    name: "amber",
    label: "Amber",
    description: "Classic amber CRT terminal",
    colors: {
      bg: "#0a0800",
      surface: "#121008",
      border: "#2a2200",
      text: "#ffb000",
      dim: "#8a6800",
      primary: "#ffbf00",
      secondary: "#ff8c00",
      accent: "#ffd700",
      success: "#ffbf00",
      warning: "#ff6600",
    },
  },
  {
    name: "solarized",
    label: "Solarized",
    description: "Solarized dark — easy on the eyes",
    colors: {
      bg: "#002b36",
      surface: "#073642",
      border: "#586e75",
      text: "#839496",
      dim: "#586e75",
      primary: "#268bd2",
      secondary: "#d33682",
      accent: "#6c71c4",
      success: "#859900",
      warning: "#b58900",
    },
  },
  {
    name: "dracula",
    label: "Dracula",
    description: "Dark purple Dracula palette",
    colors: {
      bg: "#282a36",
      surface: "#2d2f3f",
      border: "#44475a",
      text: "#f8f8f2",
      dim: "#6272a4",
      primary: "#8be9fd",
      secondary: "#ff79c6",
      accent: "#bd93f9",
      success: "#50fa7b",
      warning: "#f1fa8c",
    },
  },
];

const STORAGE_KEY = "0xnull-theme";

function applyTheme(theme: ThemeDef): void {
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", theme.colors.bg);
  root.style.setProperty("--theme-surface", theme.colors.surface);
  root.style.setProperty("--theme-border", theme.colors.border);
  root.style.setProperty("--theme-text", theme.colors.text);
  root.style.setProperty("--theme-dim", theme.colors.dim);
  root.style.setProperty("--theme-primary", theme.colors.primary);
  root.style.setProperty("--theme-secondary", theme.colors.secondary);
  root.style.setProperty("--theme-accent", theme.colors.accent);
  root.style.setProperty("--theme-success", theme.colors.success);
  root.style.setProperty("--theme-warning", theme.colors.warning);

  // Also update body background directly
  document.body.style.background = theme.colors.bg;
  document.body.style.color = theme.colors.text;

  localStorage.setItem(STORAGE_KEY, theme.name);
}

export function loadSavedTheme(): void {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const theme = THEMES.find((t) => t.name === saved);
    if (theme) applyTheme(theme);
  }
}

export function getCurrentThemeName(): string {
  return localStorage.getItem(STORAGE_KEY) ?? "cyberpunk";
}

export const themeCommand: CommandDefinition = {
  name: "theme",
  description: "Switch terminal color theme",
  usage: "theme [name]",
  aliases: ["themes"],
  execute: (ctx) => {
    if (ctx.args.length === 0) {
      const current = getCurrentThemeName();

      ctx.pushLines([
        { type: "blank", content: "" },
        { type: "ascii", content: "  ╔══════════════════════════════════════════╗" },
        { type: "ascii", content: "  ║          🎨 AVAILABLE THEMES            ║" },
        { type: "ascii", content: "  ╚══════════════════════════════════════════╝" },
        { type: "blank", content: "" },
      ]);

      for (const theme of THEMES) {
        const marker = theme.name === current ? " ◈ ACTIVE" : "";
        ctx.pushLine({
          type: "output",
          content: `  ${theme.name.padEnd(14)} ${theme.description}${marker}`,
          color: theme.name === current ? theme.colors.primary : "#5a5a72",
        });
      }

      ctx.pushLines([
        { type: "blank", content: "" },
        { type: "system", content: "  Usage: theme <name>   Example: theme matrix" },
        { type: "blank", content: "" },
      ]);
      return;
    }

    const name = ctx.args[0].toLowerCase();
    const theme = THEMES.find((t) => t.name === name);

    if (!theme) {
      ctx.pushLine({
        type: "error",
        content: `theme: unknown theme '${name}'`,
      });
      ctx.pushLine({
        type: "system",
        content: `  Available: ${THEMES.map((t) => t.name).join(", ")}`,
      });
      return;
    }

    applyTheme(theme);

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "success", content: `  ✔ Theme switched to '${theme.label}'` },
      { type: "output", content: `  ${theme.description}`, color: theme.colors.primary },
      { type: "blank", content: "" },
    ]);
  },
};
