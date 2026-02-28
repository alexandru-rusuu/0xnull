import type { CommandDefinition } from "@/core/engine/types";

export const whoamiCommand: CommandDefinition = {
  name: "whoami",
  description: "Display operator identity",
  execute: (ctx) => {
    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "output", content: "  visitor@0xnull", color: "#00f0ff" },
      { type: "output", content: "  Role: GUEST_OBSERVER" },
      { type: "output", content: "  Clearance: Level 1 — Read Access" },
      { type: "output", content: `  Session: ${crypto.randomUUID().slice(0, 8).toUpperCase()}` },
      { type: "output", content: `  Connected: ${new Date().toISOString()}` },
      { type: "blank", content: "" },
    ]);
  },
};