import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTerminalStore } from "@/core/engine/store";
import type { GhostLogEntry } from "@/core/engine/types";

const GHOST_TEMPLATES = {
  github: [
    "git: pushed 3 commits to main",
    "git: PR #42 merged → feat/spatial-cubes",
    "git: new star on 0xnull ★",
    "git: issue #17 closed — fixed CRT flicker",
    "git: dependabot: bump three.js to 0.171.0",
    "git: workflow run passed ✓ (2m 14s)",
  ],
  system: [
    "sys: CPU 12% | MEM 847MB | GPU 34%",
    "sys: WebGL2 context — 60fps stable",
    "sys: service worker cached 24 assets",
    "sys: TLS handshake complete (ECDHE-P256)",
    "sys: heap snapshot — 12.4MB allocated",
    "sys: GC pause — 2.1ms (minor)",
  ],
  network: [
    "net: CDN edge → ams-01 (14ms RTT)",
    "net: WebSocket heartbeat — OK",
    "net: Supabase realtime — connected",
    "net: DNS resolved in 3ms",
    "net: HTTP/3 multiplexed — 4 streams",
  ],
  spotify: [
    "♪ Now Playing: Kavinsky — Nightcall",
    "♪ Now Playing: Perturbator — Neo Tokyo",
    "♪ Now Playing: Carpenter Brut — Turbo Killer",
    "♪ Now Playing: Gunship — Tech Noir",
    "♪ Now Playing: Dynatron — Cosmo Black",
    "♪ Now Playing: FM-84 — Running in the Night",
  ],
};

const ICON_MAP: Record<string, string> = {
  github: "⟐",
  system: "◉",
  network: "⟁",
  spotify: "♫",
};

const COLOR_MAP: Record<string, string> = {
  github: "#c8c8d4",
  system: "#5a5a72",
  network: "#00f0ff",
  spotify: "#39ff14",
};

function randomTemplate(): Omit<GhostLogEntry, "id" | "timestamp"> {
  const types = Object.keys(GHOST_TEMPLATES) as Array<
    keyof typeof GHOST_TEMPLATES
  >;
  const type = types[Math.floor(Math.random() * types.length)];
  const messages = GHOST_TEMPLATES[type];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return { type, message };
}

export const GhostLogger: React.FC = () => {
  const ghostLogs = useTerminalStore((s) => s.ghostLogs);
  const addGhostLog = useTerminalStore((s) => s.addGhostLog);

  const spawnLog = useCallback(() => {
    addGhostLog(randomTemplate());
  }, [addGhostLog]);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 8000;
      return setTimeout(() => {
        spawnLog();
        timerId = scheduleNext();
      }, delay);
    };

    let timerId = setTimeout(() => {
      spawnLog();
      timerId = scheduleNext();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [spawnLog]);

  return (
    <div className="fixed bottom-4 right-4 z-20 max-w-sm space-y-1 pointer-events-none">
      <AnimatePresence>
        {ghostLogs.slice(0, 5).map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 0.6, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              font-mono text-[10px] leading-tight px-2 py-1
              rounded border border-glass-border
              bg-void-bg/60 backdrop-blur-sm
              select-none
            "
            style={{ color: COLOR_MAP[log.type] ?? "#5a5a72" }}
          >
            <span className="opacity-40 mr-1">
              {ICON_MAP[log.type] ?? "◈"}
            </span>
            <span className="opacity-30 mr-1.5">
              {new Date(log.timestamp).toLocaleTimeString("en-US", {
                hour12: false,
              })}
            </span>
            {log.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};