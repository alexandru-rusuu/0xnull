import type { CommandDefinition } from "@/core/engine/types";

export const echoCommand: CommandDefinition = {
  name: "echo",
  description: "Print text to terminal",
  usage: "echo <text>",
  execute: (ctx) => {
    const text = ctx.args.join(" ") || "";
    ctx.pushLine({ type: "output", content: `  ${text}` });
  },
};