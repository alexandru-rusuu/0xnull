import type { CommandDefinition } from "@/core/engine/types";

import { helpCommand } from "./help";
import { lsCommand } from "./ls";
import { cdCommand } from "./cd";
import { catCommand } from "./cat";
import { clearCommand } from "./clear";
import { whoamiCommand } from "./whoami";
import { skillsCommand } from "./skills";
import { neofetchCommand } from "./neofetch";
import { historyCommand } from "./history";
import { echoCommand } from "./echo";

class CommandRegistry {
  private commands = new Map<string, CommandDefinition>();
  private aliases = new Map<string, string>();

  register(cmd: CommandDefinition): void {
    this.commands.set(cmd.name, cmd);
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        this.aliases.set(alias, cmd.name);
      }
    }
  }

  resolve(name: string): CommandDefinition | undefined {
    const direct = this.commands.get(name);
    if (direct) return direct;

    const aliasTarget = this.aliases.get(name);
    if (aliasTarget) return this.commands.get(aliasTarget);

    return undefined;
  }

  getAll(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  getNames(): string[] {
    return [
      ...Array.from(this.commands.keys()),
      ...Array.from(this.aliases.keys()),
    ];
  }
}

export const commandRegistry = new CommandRegistry();

commandRegistry.register(helpCommand);
commandRegistry.register(lsCommand);
commandRegistry.register(cdCommand);
commandRegistry.register(catCommand);
commandRegistry.register(clearCommand);
commandRegistry.register(whoamiCommand);
commandRegistry.register(skillsCommand);
commandRegistry.register(neofetchCommand);
commandRegistry.register(historyCommand);
commandRegistry.register(echoCommand);