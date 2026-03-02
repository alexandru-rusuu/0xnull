import type { CommandDefinition } from "@/core/engine/types";
import type { FSNode } from "@/core/engine/types";
import { getNode, resolvePath } from "@/core/fs";

function searchNode(
  node: FSNode,
  pattern: RegExp,
  currentPath: string,
): { path: string; line: string; lineNum: number }[] {
  const results: { path: string; line: string; lineNum: number }[] = [];

  if (node.type === "file" && node.content) {
    const lines = node.content.split("\n");
    lines.forEach((line, i) => {
      if (pattern.test(line)) {
        results.push({
          path: `${currentPath}/${node.name}`,
          line: line.trim(),
          lineNum: i + 1,
        });
      }
    });
  }

  if (node.type === "dir" && node.children) {
    for (const child of node.children) {
      results.push(
        ...searchNode(child, pattern, `${currentPath}/${child.name}`),
      );
    }
  }

  return results;
}

export const grepCommand: CommandDefinition = {
  name: "grep",
  description: "Search for patterns in files",
  usage: "grep <pattern> [path]",
  aliases: ["search", "find"],
  execute: (ctx) => {
    if (ctx.args.length === 0) {
      ctx.pushLine({
        type: "error",
        content: "grep: missing search pattern",
      });
      ctx.pushLine({
        type: "system",
        content: '  Usage: grep <pattern> [path]',
      });
      return;
    }

    const pattern = ctx.args[0];
    const searchPath = ctx.args[1]
      ? resolvePath(ctx.cwd, ctx.args[1])
      : ctx.cwd;

    const node = getNode(searchPath);
    if (!node) {
      ctx.pushLine({
        type: "error",
        content: `grep: '${ctx.args[1] ?? searchPath}': No such file or directory`,
      });
      return;
    }

    let regex: RegExp;
    try {
      const caseInsensitive = ctx.flags["i"] || ctx.flags["ignore-case"];
      regex = new RegExp(pattern, caseInsensitive ? "i" : "");
    } catch {
      ctx.pushLine({
        type: "error",
        content: `grep: invalid pattern '${pattern}'`,
      });
      return;
    }

    const results = node.type === "file"
      ? searchNode(node, regex, searchPath.replace(/\/[^/]+$/, ""))
      : searchNode(node, regex, searchPath === "~" ? "" : searchPath);

    if (results.length === 0) {
      ctx.pushLine({
        type: "output",
        content: `  No matches found for '${pattern}'`,
        color: "#5a5a72",
      });
      return;
    }

    ctx.pushLine({ type: "blank", content: "" });
    ctx.pushLine({
      type: "system",
      content: `  Found ${results.length} match${results.length > 1 ? "es" : ""}:`,
    });
    ctx.pushLine({ type: "blank", content: "" });

    for (const result of results.slice(0, 30)) {
      const highlightedLine = result.line.replace(
        regex,
        (match) => `[${match}]`,
      );
      ctx.pushLine({
        type: "output",
        content: `  ${result.path}:${result.lineNum}: ${highlightedLine}`,
        color: "#bf5fff",
      });
    }

    if (results.length > 30) {
      ctx.pushLine({
        type: "system",
        content: `  ... and ${results.length - 30} more matches`,
      });
    }

    ctx.pushLine({ type: "blank", content: "" });
  },
};
