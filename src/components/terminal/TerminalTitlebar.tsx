import React from "react";
import { useTerminalStore } from "@/core/engine/store";

export const TerminalTitlebar: React.FC = () => {
  const cwd = useTerminalStore((s) => s.cwd);
  const isProcessing = useTerminalStore((s) => s.isProcessing);

  return (
    <div className="terminal-titlebar select-none">
      {/* Traffic light dots */}
      <div className="flex gap-2">
        <div className="terminal-dot bg-red-500/80 hover:bg-red-400 transition-colors" />
        <div className="terminal-dot bg-yellow-500/80 hover:bg-yellow-400 transition-colors" />
        <div className="terminal-dot bg-green-500/80 hover:bg-green-400 transition-colors" />
      </div>

      {/* Title */}
      <div className="flex-1 text-center text-xs text-void-dim tracking-wider">
        <span className="neon-cyan text-[10px] opacity-70">
          0xNULL
        </span>
        <span className="text-void-dim mx-2">—</span>
        <span className="text-void-dim">{cwd}</span>
        {isProcessing && (
          <span className="ml-2 text-neon-amber animate-pulse">
            ⟳ processing...
          </span>
        )}
      </div>

      {/* Session indicator */}
      <div className="text-[10px] text-void-dim font-mono">
        <span className="text-neon-green">●</span> LIVE
      </div>
    </div>
  );
};