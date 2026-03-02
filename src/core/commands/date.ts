import type { CommandDefinition } from "@/core/engine/types";

export const dateCommand: CommandDefinition = {
  name: "date",
  description: "Display current date and time",
  aliases: ["time", "now"],
  execute: (ctx) => {
    const now = new Date();
    const iso = now.toISOString();
    const local = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const unix = Math.floor(now.getTime() / 1000);
    const uptime = Math.floor(performance.now() / 1000);
    const mins = Math.floor(uptime / 60);
    const secs = uptime % 60;

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "output", content: `  Local:    ${local}`, color: "#00f0ff" },
      { type: "output", content: `  ISO:      ${iso}` },
      { type: "output", content: `  Unix:     ${unix}` },
      { type: "output", content: `  Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}` },
      { type: "output", content: `  Uptime:   ${mins}m ${secs}s` },
      { type: "blank", content: "" },
    ]);
  },
};
