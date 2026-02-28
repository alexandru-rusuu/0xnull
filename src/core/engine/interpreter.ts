import { useTerminalStore } from "./store";
import { commandRegistry } from "@/core/commands/registry";
import type { CommandContext } from "./types";

function parseInput(raw: string): {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
} {
  const tokens = raw.trim().split(/\s+/);
  const command = (tokens[0] ?? "").toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = tokens[i + 1];
      if (next && !next.startsWith("-")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else if (token.startsWith("-") && token.length === 2) {
      flags[token.slice(1)] = true;
    } else {
      args.push(token);
    }
  }

  return { command, args, flags };
}

export async function executeCommand(rawInput: string): Promise<void> {
  const store = useTerminalStore.getState();

  store.pushLine({
    type: "input",
    content: rawInput,
  });

  store.addToHistory(rawInput);

  const trimmed = rawInput.trim();
  if (!trimmed) return;

  const { command, args, flags } = parseInput(trimmed);

  const cmdDef = commandRegistry.resolve(command);

  if (!cmdDef) {
    store.pushLine({
      type: "error",
      content: `0xnull: command not found: ${command}`,
    });
    store.pushLine({
      type: "system",
      content: 'Type "help" to see available commands.',
    });
    return;
  }

  const ctx: CommandContext = {
    args,
    flags,
    rawInput: trimmed,
    cwd: store.cwd,
    pushLine: (line) => useTerminalStore.getState().pushLine(line),
    pushLines: (lines) => useTerminalStore.getState().pushLines(lines),
    setCwd: (path) => useTerminalStore.getState().setCwd(path),
    spawnCubes: (objs) => useTerminalStore.getState().spawnCubes(objs),
    clearCubes: () => useTerminalStore.getState().clearCubes(),
    setLoading: (v) => useTerminalStore.getState().setProcessing(v),
  };

  try {
    store.setProcessing(true);
    await cmdDef.execute(ctx);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    store.pushLine({
      type: "error",
      content: `0xnull: runtime error: ${message}`,
    });
  } finally {
    store.setProcessing(false);
  }
}

export function executeDeepLink(route: string): void {
  const routeMap: Record<string, string[]> = {
    "/":         [],
    "/projects": ["cd projects", "ls"],
    "/about":    ["cat about.md"],
    "/contact":  ["cat contact.md"],
    "/guestbook":["guestbook --read"],
    "/skills":   ["skills"],
  };

  const commands = routeMap[route];
  if (!commands || commands.length === 0) return;

  let delay = 800;
  for (const cmd of commands) {
    setTimeout(() => {
      executeCommand(cmd);
    }, delay);
    delay += 1200;
  }
}