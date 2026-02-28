import type { CommandDefinition } from "@/core/engine/types";
import { resolvePath, getNode } from "@/core/fs";

export const cdCommand: CommandDefinition = {
  name: "cd",
  description: "Change working directory",
  usage: "cd <path>",
  execute: (ctx) => {
    const target = ctx.args[0] ?? "~";
    const resolved = resolvePath(ctx.cwd, target);
    const node = getNode(resolved);

    if (!node) {
      ctx.pushLine({
        type: "error",
        content: `cd: no such directory: ${target}`,
      });
      return;
    }

    if (node.type !== "dir") {
      ctx.pushLine({
        type: "error",
        content: `cd: not a directory: ${target}`,
      });
      return;
    }

    ctx.setCwd(resolved);
    ctx.clearCubes();
  },
};