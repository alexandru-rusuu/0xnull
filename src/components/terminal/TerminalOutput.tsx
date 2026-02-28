import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTerminalStore } from "@/core/engine/store";
import type { TerminalLine, LineType } from "@/core/engine/types";

const LINE_STYLES: Record<LineType, { color: string; prefix: string }> = {
  input:   { color: "#00f0ff", prefix: "❯ " },
  output:  { color: "#c8c8d4", prefix: "" },
  error:   { color: "#ff4444", prefix: "✖ " },
  system:  { color: "#ffbf00", prefix: "◈ " },
  ascii:   { color: "#00f0ff", prefix: "" },
  success: { color: "#39ff14", prefix: "✔ " },
  link:    { color: "#bf5fff", prefix: "→ " },
  table:   { color: "#c8c8d4", prefix: "" },
  blank:   { color: "transparent", prefix: "" },
};

const LineRow: React.FC<{ line: TerminalLine; index: number }> = ({
  line,
  index,
}) => {
  const style = LINE_STYLES[line.type];
  const color = line.color ?? style.color;

  if (line.type === "blank") {
    return <div className="h-2" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.15,
        delay: Math.min((line.delay ?? index * 8) / 1000, 0.5),
      }}
      className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all"
      style={{ color }}
    >
      {style.prefix && (
        <span className="opacity-60">{style.prefix}</span>
      )}
      {line.content}
    </motion.div>
  );
};

export const TerminalOutput: React.FC = () => {
  const lines = useTerminalStore((s) => s.lines);

  return (
    <div className="space-y-0.5">
      <AnimatePresence initial={false}>
        {lines.map((line, i) => (
          <LineRow key={line.id} line={line} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
};