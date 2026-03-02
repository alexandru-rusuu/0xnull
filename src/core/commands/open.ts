import type { CommandDefinition } from "@/core/engine/types";
import { resolvePath, readFile } from "@/core/fs";

const KNOWN_URLS: Record<string, string> = {
  github: "https://github.com/alexandru-rusuu",
  email: "mailto:alexrusu795@gmail.com",
  "resume.pdf": "/resume.pdf",
};

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s)>]+/g;
  return text.match(urlRegex) ?? [];
}

export const openCommand: CommandDefinition = {
  name: "open",
  description: "Open URLs, files, or known links",
  usage: "open <target>",
  aliases: ["xdg-open", "start"],
  execute: (ctx) => {
    if (ctx.args.length === 0) {
      ctx.pushLines([
        { type: "blank", content: "" },
        { type: "system", content: "  Usage: open <target>" },
        { type: "blank", content: "" },
        { type: "output", content: "  Quick links:", color: "#00f0ff" },
        { type: "output", content: "    open github       → GitHub profile" },
        { type: "output", content: "    open email        → Email client" },
        { type: "output", content: "    open resume.pdf   → Download resume" },
        { type: "output", content: "    open <file>       → Extract & open URLs from file" },
        { type: "blank", content: "" },
      ]);
      return;
    }

    const target = ctx.args[0];

    // Check known shortcuts
    const knownUrl = KNOWN_URLS[target.toLowerCase()];
    if (knownUrl) {
      window.open(knownUrl, "_blank", "noopener,noreferrer");
      ctx.pushLine({
        type: "success",
        content: `  Opening ${target}...`,
      });
      return;
    }

    // Check if it's a direct URL
    if (target.startsWith("http://") || target.startsWith("https://")) {
      window.open(target, "_blank", "noopener,noreferrer");
      ctx.pushLine({
        type: "success",
        content: `  Opening ${target}...`,
      });
      return;
    }

    // Try to read file and extract URLs
    const path = resolvePath(ctx.cwd, target);
    const content = readFile(path);

    if (content !== null) {
      const urls = extractUrls(content);
      if (urls.length > 0) {
        ctx.pushLine({ type: "blank", content: "" });
        ctx.pushLine({
          type: "system",
          content: `  Found ${urls.length} URL(s) in ${target}:`,
        });

        urls.forEach((url, i) => {
          ctx.pushLine({
            type: "link",
            content: `  [${i + 1}] ${url}`,
            color: "#bf5fff",
          });
        });

        // Open the first one
        window.open(urls[0], "_blank", "noopener,noreferrer");
        ctx.pushLine({
          type: "success",
          content: `  Opened first link in new tab.`,
        });
        ctx.pushLine({ type: "blank", content: "" });
      } else {
        ctx.pushLine({
          type: "output",
          content: `  No URLs found in ${target}`,
          color: "#5a5a72",
        });
      }
      return;
    }

    ctx.pushLine({
      type: "error",
      content: `open: cannot open '${target}': Not found`,
    });
  },
};
