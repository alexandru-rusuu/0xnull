import type { CommandDefinition } from "@/core/engine/types";

interface GuestbookEntry {
  message: string;
  timestamp: number;
  session: string;
}

const STORAGE_KEY = "0xnull-guestbook";

function getEntries(): GuestbookEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntry(entry: GuestbookEntry): void {
  const entries = getEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function clearEntries(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export const guestbookCommand: CommandDefinition = {
  name: "guestbook",
  description: "Read/write the visitor guestbook",
  usage: "guestbook [--write <msg>] [--clear]",
  aliases: ["gb"],
  execute: (ctx) => {
    // Clear entries
    if (ctx.flags["clear"]) {
      clearEntries();
      ctx.pushLine({
        type: "success",
        content: "  Guestbook cleared.",
      });
      return;
    }

    // Write a message
    const writeMsg = ctx.flags["write"];
    if (writeMsg) {
      const message = typeof writeMsg === "string"
        ? writeMsg
        : ctx.args.join(" ");

      if (!message || message === "true") {
        ctx.pushLine({
          type: "error",
          content: "guestbook: please provide a message",
        });
        ctx.pushLine({
          type: "system",
          content: '  Usage: guestbook --write "Your message here"',
        });
        return;
      }

      saveEntry({
        message,
        timestamp: Date.now(),
        session: crypto.randomUUID().slice(0, 8).toUpperCase(),
      });

      ctx.pushLines([
        { type: "blank", content: "" },
        { type: "success", content: "  ✔ Message saved to guestbook!" },
        { type: "output", content: `  → "${message}"`, color: "#00f0ff" },
        { type: "blank", content: "" },
      ]);
      return;
    }

    // If args are provided without --write flag, treat them as a write
    if (ctx.args.length > 0) {
      const message = ctx.args.join(" ");
      saveEntry({
        message,
        timestamp: Date.now(),
        session: crypto.randomUUID().slice(0, 8).toUpperCase(),
      });

      ctx.pushLines([
        { type: "blank", content: "" },
        { type: "success", content: "  ✔ Message saved to guestbook!" },
        { type: "output", content: `  → "${message}"`, color: "#00f0ff" },
        { type: "blank", content: "" },
      ]);
      return;
    }

    // Read entries
    const entries = getEntries();

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "ascii", content: "  ╔══════════════════════════════════════════╗" },
      { type: "ascii", content: "  ║            📖 GUESTBOOK                 ║" },
      { type: "ascii", content: "  ╚══════════════════════════════════════════╝" },
      { type: "blank", content: "" },
    ]);

    if (entries.length === 0) {
      ctx.pushLines([
        { type: "output", content: "  (no entries yet)", color: "#5a5a72" },
        { type: "blank", content: "" },
        { type: "system", content: '  Leave a message: guestbook Hello from a visitor!' },
        { type: "blank", content: "" },
      ]);
      return;
    }

    for (const entry of entries.slice(-20)) {
      const date = new Date(entry.timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      ctx.pushLines([
        {
          type: "output",
          content: `  [${date}] <${entry.session}>`,
          color: "#5a5a72",
        },
        {
          type: "output",
          content: `    "${entry.message}"`,
          color: "#00f0ff",
        },
      ]);
    }

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "system", content: `  Total: ${entries.length} entries` },
      { type: "system", content: '  Add yours: guestbook Your message here!' },
      { type: "blank", content: "" },
    ]);
  },
};
