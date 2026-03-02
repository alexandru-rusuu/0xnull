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

const URL_REGEX = /(https?:\/\/[^\s)>]+)/g;

function renderContentWithLinks(content: string, baseColor: string): React.ReactNode {
  const parts = content.split(URL_REGEX);
  if (parts.length === 1) return content;

  return parts.map((part, i) => {
    if (URL_REGEX.test(part)) {
      // Reset regex lastIndex
      URL_REGEX.lastIndex = 0;
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:brightness-125 transition-all cursor-pointer"
          style={{ color: "#bf5fff" }}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

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
      {line.isHtml ? (
        <span dangerouslySetInnerHTML={{ __html: line.content }} />
      ) : (
        renderContentWithLinks(line.content, color)
      )}
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