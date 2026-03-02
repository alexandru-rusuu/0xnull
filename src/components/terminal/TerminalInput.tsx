import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTerminalStore } from "@/core/engine/store";
import { executeCommand } from "@/core/engine/interpreter";
import { commandRegistry } from "@/core/commands/registry";
import { listDir, resolvePath } from "@/core/fs";

function getPathCompletions(input: string, cwd: string): string[] {
  const tokens = input.split(/\s+/);
  if (tokens.length < 2) return [];

  const partial = tokens[tokens.length - 1] ?? "";
  const lastSlash = partial.lastIndexOf("/");
  const dirPart = lastSlash >= 0 ? partial.slice(0, lastSlash) : "";
  const prefix = lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial;

  const searchDir = dirPart ? resolvePath(cwd, dirPart) : cwd;
  const children = listDir(searchDir);
  if (!children) return [];

  const matches = children
    .filter((c) => c.name.toLowerCase().startsWith(prefix.toLowerCase()))
    .map((c) => {
      const fullName = dirPart ? `${dirPart}/${c.name}` : c.name;
      return c.type === "dir" ? `${fullName}/` : fullName;
    });

  return matches;
}

export const TerminalInput: React.FC = () => {
  const [value, setValue] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [tabCompletions, setTabCompletions] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const cwd = useTerminalStore((s) => s.cwd);
  const history = useTerminalStore((s) => s.history);
  const historyIndex = useTerminalStore((s) => s.historyIndex);
  const setHistoryIndex = useTerminalStore((s) => s.setHistoryIndex);
  const isProcessing = useTerminalStore((s) => s.isProcessing);

  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    document.addEventListener("click", focus);
    document.addEventListener("keydown", focus);
    return () => {
      document.removeEventListener("click", focus);
      document.removeEventListener("keydown", focus);
    };
  }, []);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestion("");
      return;
    }

    const trimmed = value.trim().toLowerCase();
    const tokens = trimmed.split(/\s+/);

    // If single token, autocomplete command names
    if (tokens.length === 1) {
      const allNames = commandRegistry.getNames();
      const match = allNames.find((n) => n.startsWith(trimmed));
      setSuggestion(match && match !== trimmed ? match : "");
      return;
    }

    // If multiple tokens, autocomplete file paths
    const partial = tokens[tokens.length - 1] ?? "";
    const completions = getPathCompletions(value.trim(), cwd);
    if (completions.length === 1) {
      const baseCmd = tokens.slice(0, -1).join(" ");
      setSuggestion(`${baseCmd} ${completions[0]}`);
    } else {
      setSuggestion("");
    }
  }, [value, cwd]);

  const handleSubmit = useCallback(async () => {
    if (isProcessing) return;
    const cmd = value.trim();
    setValue("");
    setSuggestion("");
    if (cmd) {
      await executeCommand(cmd);
    }
  }, [value, isProcessing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();

        // Single token: autocomplete command
        const tokens = value.trim().split(/\s+/);
        if (tokens.length <= 1) {
          if (suggestion) {
            setValue(suggestion + " ");
            setSuggestion("");
          }
          return;
        }

        // Multi-token: cycle through file path completions
        const completions = getPathCompletions(value.trim(), cwd);
        if (completions.length === 0) return;

        if (completions.length === 1) {
          const baseCmd = tokens.slice(0, -1).join(" ");
          setValue(`${baseCmd} ${completions[0]}`);
          setSuggestion("");
          setTabCompletions([]);
          setTabIndex(-1);
          return;
        }

        // Multiple matches: cycle through them
        const nextIndex = (tabIndex + 1) % completions.length;
        setTabIndex(nextIndex);
        setTabCompletions(completions);
        const baseCmd = tokens.slice(0, -1).join(" ");
        setValue(`${baseCmd} ${completions[nextIndex]}`);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const newIndex = Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setValue(history[newIndex] ?? "");
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex >= history.length - 1) {
          setHistoryIndex(history.length);
          setValue("");
          return;
        }
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setValue(history[newIndex] ?? "");
        return;
      }

      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        executeCommand("clear");
        return;
      }

      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setValue("");
        setSuggestion("");
        return;
      }
    },
    [handleSubmit, suggestion, history, historyIndex, setHistoryIndex],
  );

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      {/* Prompt */}
      <span className="flex items-center gap-1 shrink-0 select-none">
        <span className="text-neon-green font-bold">visitor</span>
        <span className="text-void-dim">@</span>
        <span className="text-neon-cyan">0xnull</span>
        <span className="text-void-dim">:</span>
        <span className="text-neon-magenta">{cwd}</span>
        <span className="text-void-dim ml-1">❯</span>
      </span>

      {/* Input with ghost suggestion */}
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="
            w-full bg-transparent border-none outline-none
            text-void-text caret-neon-cyan font-mono text-sm
            placeholder:text-void-dim/30
            disabled:opacity-40
          "
          placeholder={isProcessing ? "processing..." : "type a command..."}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {/* Ghost autocomplete preview */}
        {suggestion && (
          <div
            className="absolute inset-0 pointer-events-none text-void-dim/25 font-mono text-sm"
            aria-hidden
          >
            {suggestion}
          </div>
        )}
      </div>

      {/* Blinking cursor indicator */}
      {!isProcessing && (
        <span className="terminal-cursor" aria-hidden />
      )}

      {/* Processing spinner */}
      {isProcessing && (
        <span className="text-neon-amber animate-spin text-xs">⟳</span>
      )}
    </div>
  );
};