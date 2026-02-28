import type { CommandDefinition, SpatialObject } from "@/core/engine/types";
import { listDir, resolvePath } from "@/core/fs";

export const lsCommand: CommandDefinition = {
  name: "ls",
  description: "List directory contents (spawns 3D cubes)",
  aliases: ["dir", "list"],
  usage: "ls [path]",
  execute: (ctx) => {
    const target = ctx.args[0]
      ? resolvePath(ctx.cwd, ctx.args[0])
      : ctx.cwd;

    const children = listDir(target);
    if (!children) {
      ctx.pushLine({
        type: "error",
        content: `ls: cannot access '${ctx.args[0] ?? target}': No such directory`,
      });
      return;
    }

    if (children.length === 0) {
      ctx.pushLine({ type: "output", content: "(empty directory)" });
      return;
    }

    ctx.pushLine({ type: "blank", content: "" });

    for (const child of children) {
      const icon = child.type === "dir" ? "📁" : "📄";
      const color = child.type === "dir" ? "#39ff14" : "#00f0ff";
      const suffix = child.type === "dir" ? "/" : "";
      ctx.pushLine({
        type: "output",
        content: `  ${icon}  ${child.name}${suffix}`,
        color,
      });
    }

    ctx.pushLine({ type: "blank", content: "" });

    ctx.clearCubes();
    const cubes: SpatialObject[] = children.map((child, i) => ({
      id: `cube-${child.name}-${Date.now()}-${i}`,
      label: child.name,
      type: child.type,
    }));
    ctx.spawnCubes(cubes);
  },
};