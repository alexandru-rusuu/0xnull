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
      { type: "ascii", content: "║          0xNULL v3.0 — COMMAND REFERENCE       ║" },
      { type: "ascii", content: "╚════════════════════════════════════════════════╝" },
      { type: "blank", content: "" },
      { type: "output", content: "  NAVIGATION & FILES", color: "#ffbf00" },
    ]);

    const navCmds = ["ls", "cd", "cat", "pwd", "tree", "grep", "open"];
    const infoCmds = ["help", "man", "whoami", "skills", "neofetch", "date"];
    const utilCmds = ["clear", "history", "echo", "export", "theme"];
    const funCmds = ["weather", "guestbook", "fortune", "matrix", "sudo"];

    const allCmds = commandRegistry.getAll();
    const cmdMap = new Map(allCmds.map((c) => [c.name, c]));

    const printGroup = (names: string[], color: string) => {
      for (const name of names) {
        const cmd = cmdMap.get(name);
        if (!cmd) continue;
        const aliases = cmd.aliases?.length
          ? ` (${cmd.aliases.join(", ")})`
          : "";
        ctx.pushLine({
          type: "output",
          content: `    ${cmd.name.padEnd(14)}${cmd.description}${aliases}`,
          color,
        });
      }
    };

    printGroup(navCmds, "#00f0ff");
    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "output", content: "  INFO & PROFILE", color: "#ffbf00" },
    ]);
    printGroup(infoCmds, "#bf5fff");
    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "output", content: "  UTILITIES", color: "#ffbf00" },
    ]);
    printGroup(utilCmds, "#39ff14");
    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "output", content: "  INTERACTIVE & FUN", color: "#ffbf00" },
    ]);
    printGroup(funCmds, "#ff00aa");

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "system", content: "  TIPS:" },
      { type: "output", content: "    Tab         Autocomplete commands & file paths" },
      { type: "output", content: "    ↑/↓         Cycle through command history" },
      { type: "output", content: "    Ctrl+L      Clear screen" },
      { type: "output", content: "    Ctrl+C      Cancel current input" },
      { type: "output", content: '    cmd1 | cmd2  Pipe output between commands' },
      { type: "output", content: '    cmd1 && cmd2 Chain commands' },
      { type: "output", content: '    man <cmd>    Detailed manual for any command' },
      { type: "blank", content: "" },
    ]);
  },
};