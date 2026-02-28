import type { CommandDefinition } from "@/core/engine/types";
import { commandRegistry } from "./registry";

export const helpCommand: CommandDefinition = {
  name: "help",
  description: "Display available commands",
  aliases: ["?", "commands"],
  execute: (ctx) => {
    ctx.pushLines([
      { type: "system", content: "" },
      { type: "ascii", content: "╔════════════════════════════════════════════════╗" },
      { type: "ascii", content: "║          0xNULL v3.0 — HELP             ║" },
      { type: "ascii", content: "╚════════════════════════════════════════════════╝" },
      { type: "blank", content: "" },
    ]);

    const cmds = commandRegistry.getAll();
    for (const cmd of cmds) {
      const aliases = cmd.aliases?.length
        ? ` (${cmd.aliases.join(", ")})`
        : "";
      ctx.pushLine({
        type: "output",
        content: `  ${cmd.name.padEnd(14)}${cmd.description}${aliases}`,
        color: "#00f0ff",
      });
    }

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "system", content: "  TIP: Use Tab for autocomplete. ↑/↓ for history." },
      { type: "blank", content: "" },
    ]);
  },
};