import type { CommandDefinition } from "@/core/engine/types";
import { resolvePath, readFile } from "@/core/fs";

export const catCommand: CommandDefinition = {
  name: "cat",
  description: "Display file contents",
  aliases: ["read", "type"],
  usage: "cat <file>",
  execute: (ctx) => {
    if (ctx.args.length === 0) {
      ctx.pushLine({ type: "error", content: "cat: missing file operand" });
      return;
    }

    const path = resolvePath(ctx.cwd, ctx.args[0]);
    const content = readFile(path);

    if (content === null) {
      ctx.pushLine({
        type: "error",
        content: `cat: ${ctx.args[0]}: No such file`,
      });
      return;
    }

    ctx.pushLine({ type: "blank", content: "" });

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("# ")) {
        ctx.pushLine({
          type: "output",
          content: `  ${line.replace("# ", "")}`,
          color: "#00f0ff",
          delay: i * 15,
        });
      } else if (line.startsWith("## ")) {
        ctx.pushLine({
          type: "output",
          content: `  ${line.replace("## ", "")}`,
          color: "#ffbf00",
          delay: i * 15,
        });
      } else if (line.startsWith("- ")) {
        ctx.pushLine({
          type: "output",
          content: `    ${line}`,
          color: "#39ff14",
          delay: i * 15,
        });
      } else if (line.startsWith(">")) {
        ctx.pushLine({
          type: "output",
          content: `  │ ${line.replace("> ", "")}`,
          color: "#bf5fff",
          delay: i * 15,
        });
      } else {
        ctx.pushLine({
          type: "output",
          content: `  ${line}`,
          delay: i * 15,
        });
      }
    }

    ctx.pushLine({ type: "blank", content: "" });
  },
};