import type { CommandDefinition } from "@/core/engine/types";
import { useTerminalStore } from "@/core/engine/store";

export const clearCommand: CommandDefinition = {
  name: "clear",
  description: "Clear terminal screen",
  aliases: ["cls", "reset"],
  execute: (ctx) => {
    useTerminalStore.getState().clearLines();
    ctx.clearCubes();
  },
};