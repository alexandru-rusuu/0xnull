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

  // Handle pipe chains: cmd1 | cmd2 | cmd3
  if (trimmed.includes("|")) {
    const pipeParts = trimmed.split("|").map((s) => s.trim()).filter(Boolean);
    let capturedOutput: string[] = [];

    for (let pi = 0; pi < pipeParts.length; pi++) {
      const part = pipeParts[pi];
      const { command, args, flags } = parseInput(part);
      const cmdDef = commandRegistry.resolve(command);

      if (!cmdDef) {
        store.pushLine({
          type: "error",
          content: `0xnull: command not found: ${command}`,
        });
        return;
      }

      const nextCaptured: string[] = [];

      // For piped commands (not the last), capture output
      const isLast = pi === pipeParts.length - 1;
      const pipeArgs = pi === 0 ? args : [...args, ...capturedOutput];

      const ctx: CommandContext = {
        args: pipeArgs,
        flags,
        rawInput: part,
        cwd: store.cwd,
        pushLine: (line) => {
          if (isLast) {
            useTerminalStore.getState().pushLine(line);
          } else {
            if (line.content && line.type !== "blank") {
              nextCaptured.push(line.content.trim());
            }
          }
        },
        pushLines: (lines) => {
          for (const line of lines) {
            if (isLast) {
              useTerminalStore.getState().pushLine(line);
            } else {
              if (line.content && line.type !== "blank") {
                nextCaptured.push(line.content.trim());
              }
            }
          }
        },
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
        return;
      } finally {
        store.setProcessing(false);
      }

      capturedOutput = nextCaptured;
    }
    return;
  }

  // Handle command chaining: cmd1 && cmd2
  if (trimmed.includes("&&")) {
    const chainParts = trimmed.split("&&").map((s) => s.trim()).filter(Boolean);
    for (const part of chainParts) {
      const { command, args, flags } = parseInput(part);
      const cmdDef = commandRegistry.resolve(command);
      if (!cmdDef) {
        store.pushLine({
          type: "error",
          content: `0xnull: command not found: ${command}`,
        });
        return;
      }

      const ctx: CommandContext = {
        args,
        flags,
        rawInput: part,
        cwd: useTerminalStore.getState().cwd,
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
        return;
      } finally {
        store.setProcessing(false);
      }
    }
    return;
  }

  // Single command execution
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
    "/guestbook":["guestbook"],
    "/skills":   ["skills"],
    "/blog":     ["cd blog", "ls"],
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