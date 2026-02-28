import React, { useRef, useEffect } from "react";
import { useTerminalStore } from "@/core/engine/store";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { TerminalTitlebar } from "./TerminalTitlebar";

export const TerminalWindow: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lines = useTerminalStore((s) => s.lines);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines.length]);

  return (
    <div className="terminal-chrome w-full max-w-4xl h-[85vh] flex flex-col">
      {/* Title bar with fake window controls */}
      <TerminalTitlebar />

      {/* Scrollable output area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 scroll-smooth"
      >
        <TerminalOutput />
      </div>

      {/* Input prompt pinned at bottom */}
      <div className="border-t border-glass-border px-4 py-3">
        <TerminalInput />
      </div>
    </div>
  );
};

export default TerminalWindow;