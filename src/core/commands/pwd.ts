import type { CommandDefinition } from "@/core/engine/types";

export const pwdCommand: CommandDefinition = {
  name: "pwd",
  description: "Print current working directory",
  execute: (ctx) => {
    ctx.pushLine({ type: "output", content: `  ${ctx.cwd}` });
  },
};
