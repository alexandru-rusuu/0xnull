import type { CommandDefinition } from "@/core/engine/types";
import { useTerminalStore } from "@/core/engine/store";

export const historyCommand: CommandDefinition = {
  name: "history",
  description: "Show command history",
  execute: (ctx) => {
    const history = useTerminalStore.getState().history;

    if (history.length === 0) {
      ctx.pushLine({ type: "output", content: "  (no history)" });
      return;
    }

    ctx.pushLine({ type: "blank", content: "" });
    history.forEach((cmd, i) => {
      ctx.pushLine({
        type: "output",
        content: `  ${String(i + 1).padStart(4)}  ${cmd}`,
        color: "#5a5a72",
      });
    });
    ctx.pushLine({ type: "blank", content: "" });
  },
};