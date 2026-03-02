import type { CommandDefinition } from "@/core/engine/types";
import type { FSNode } from "@/core/engine/types";
import { getNode, resolvePath } from "@/core/fs";

function buildTree(node: FSNode, prefix: string, isLast: boolean): string[] {
  const lines: string[] = [];
  const connector = isLast ? "└── " : "├── ";
  const icon = node.type === "dir" ? "📁 " : "📄 ";
  lines.push(`${prefix}${connector}${icon}${node.name}`);

  if (node.type === "dir" && node.children) {
    const childPrefix = prefix + (isLast ? "    " : "│   ");
    node.children.forEach((child, i) => {
      const childIsLast = i === node.children!.length - 1;
      lines.push(...buildTree(child, childPrefix, childIsLast));
    });
  }

  return lines;
}

export const treeCommand: CommandDefinition = {
  name: "tree",
  description: "Display directory tree structure",
  usage: "tree [path]",
  execute: (ctx) => {
    const target = ctx.args[0]
      ? resolvePath(ctx.cwd, ctx.args[0])
      : ctx.cwd;

    const node = getNode(target);
    if (!node) {
      ctx.pushLine({
        type: "error",
        content: `tree: '${ctx.args[0] ?? target}': No such directory`,
      });
      return;
    }

    if (node.type !== "dir") {
      ctx.pushLine({
        type: "error",
        content: `tree: '${ctx.args[0] ?? target}': Not a directory`,
      });
      return;
    }

    ctx.pushLine({ type: "blank", content: "" });
    ctx.pushLine({
      type: "output",
      content: `  📁 ${node.name}/`,
      color: "#39ff14",
    });

    if (node.children) {
      let dirCount = 0;
      let fileCount = 0;

      const countNodes = (n: FSNode) => {
        if (n.type === "dir") {
          dirCount++;
          n.children?.forEach(countNodes);
        } else {
          fileCount++;
        }
      };
      node.children.forEach(countNodes);

      node.children.forEach((child, i) => {
        const isLast = i === node.children!.length - 1;
        const lines = buildTree(child, "  ", isLast);
        for (const line of lines) {
          const isDir = line.includes("📁");
          ctx.pushLine({
            type: "output",
            content: line,
            color: isDir ? "#39ff14" : "#00f0ff",
          });
        }
      });

      ctx.pushLines([
        { type: "blank", content: "" },
        {
          type: "system",
          content: `  ${dirCount} directories, ${fileCount} files`,
        },
      ]);
    }

    ctx.pushLine({ type: "blank", content: "" });
  },
};
