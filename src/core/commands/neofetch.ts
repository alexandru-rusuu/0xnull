import type { CommandDefinition } from "@/core/engine/types";

const ASCII_LOGO = [
  "     ▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄   ▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄   ",
  "    █   █       █       █  █ █  █ █       █   ▄  █  ",
  "    █   █    ▄▄▄█▄     ▄█  █▄█  █ █    ▄▄▄█  █ █ █  ",
  "    █   █   █▄▄▄  █   █ █       █ █   █▄▄▄█   █▄▄█▄ ",
  "    █   █    ▄▄▄█ █   █ █   ▄   █ █    ▄▄▄█    ▄▄  █",
  "    █   █   █▄▄▄  █   █ █  █ █  █ █   █▄▄▄█   █  █ █",
  "    █▄▄▄█▄▄▄▄▄▄▄█ █▄▄▄█ █▄▄█ █▄▄█ █▄▄▄▄▄▄▄█▄▄▄█  █▄█",
];

export const neofetchCommand: CommandDefinition = {
  name: "neofetch",
  description: "Display system information",
  aliases: ["sysinfo", "about"],
  execute: (ctx) => {
    const info = [
      "",
      `  OS:        0xNULL v3.0`,
      `  Kernel:    Astro 5.0 / React 19`,
      `  Shell:     0xnull-term 1.0.0`,
      `  Engine:    Three.js r170 (WebGL2)`,
      `  UI:        Tailwind CSS 4 + Framer Motion`,
      `  Backend:   Supabase (Real-time)`,
      `  AI:        Transformers.js (local)`,
      `  Theme:     Cyberpunk Dark [CRT]`,
      `  Terminal:  ${navigator?.userAgent?.slice(0, 40) ?? "Unknown"}...`,
      `  Uptime:    ${Math.floor(performance.now() / 1000)}s`,
      "",
    ];

    ctx.pushLine({ type: "blank", content: "" });

    const maxLines = Math.max(ASCII_LOGO.length, info.length);
    for (let i = 0; i < maxLines; i++) {
      const artLine = ASCII_LOGO[i] ?? " ".repeat(52);
      const infoLine = info[i] ?? "";
      ctx.pushLine({
        type: "ascii",
        content: `${artLine}${infoLine}`,
        color: i < ASCII_LOGO.length ? "#00f0ff" : undefined,
      });
    }

    ctx.pushLine({ type: "blank", content: "" });

    const colors = ["#ff0000", "#ff8800", "#ffff00", "#39ff14", "#00f0ff", "#bf5fff", "#ff00aa", "#ffffff"];
    ctx.pushLine({
      type: "output",
      content: "  " + colors.map(() => "███").join(""),
      color: "#00f0ff",
    });

    ctx.pushLine({ type: "blank", content: "" });
  },
};