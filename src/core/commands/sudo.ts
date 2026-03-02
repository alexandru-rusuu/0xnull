import type { CommandDefinition } from "@/core/engine/types";

const RESPONSES = [
  "Nice try. Access DENIED. 🔒",
  "user 'visitor' is not in the sudoers file. This incident will be reported.",
  "Permission denied: requires LEVEL_5_CLEARANCE.",
  "ERROR: Root access disabled in production environment.",
  "🚨 SECURITY ALERT: Unauthorized privilege escalation attempt detected.",
  "sudo: you need a mass-effect field to run this command.",
  "Ah yes, 'sudo'. We have dismissed that claim.",
  "ACCESS DENIED — But nice try, Mr. Anderson.",
];

export const sudoCommand: CommandDefinition = {
  name: "sudo",
  description: "Attempt privilege escalation (restricted)",
  execute: (ctx) => {
    const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "error", content: `  ${response}` },
      { type: "blank", content: "" },
    ]);
  },
};
