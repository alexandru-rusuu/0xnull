import type { CommandDefinition } from "@/core/engine/types";

interface Skill {
  name: string;
  level: number;
  color: string;
}

const SKILLS: Skill[] = [
  { name: "TypeScript",     level: 10, color: "#00f0ff" },
  { name: "React/Next.js",  level: 9,  color: "#00f0ff" },
  { name: "Three.js/WebGL", level: 8,  color: "#bf5fff" },
  { name: "Node.js",        level: 9,  color: "#39ff14" },
  { name: "Rust/WASM",      level: 7,  color: "#ffbf00" },
  { name: "Python",         level: 8,  color: "#39ff14" },
  { name: "PostgreSQL",     level: 8,  color: "#00f0ff" },
  { name: "Docker/K8s",     level: 7,  color: "#ff00aa" },
  { name: "AWS/GCP",        level: 8,  color: "#ffbf00" },
  { name: "System Design",  level: 9,  color: "#bf5fff" },
];

function renderBar(level: number): string {
  const filled = "█".repeat(level);
  const empty = "░".repeat(10 - level);
  return `${filled}${empty}`;
}

export const skillsCommand: CommandDefinition = {
  name: "skills",
  description: "Display technical proficiencies",
  aliases: ["tech", "stack"],
  execute: (ctx) => {
    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "ascii", content: "  ╔══════════════════════════════════════════╗" },
      { type: "ascii", content: "  ║        TECHNICAL PROFICIENCY MAP        ║" },
      { type: "ascii", content: "  ╚══════════════════════════════════════════╝" },
      { type: "blank", content: "" },
    ]);

    for (const skill of SKILLS) {
      ctx.pushLine({
        type: "output",
        content: `  ${skill.name.padEnd(16)} ${renderBar(skill.level)} ${skill.level * 10}%`,
        color: skill.color,
      });
    }

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "system", content: "  ◈ Proficiency scale: ░ Learning → █ Expert" },
      { type: "blank", content: "" },
    ]);
  },
};