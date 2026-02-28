import React, { useEffect, useRef } from "react";
import { useTerminalStore } from "@/core/engine/store";

const BOOT_ASCII = [
  "",
  "  ░█▀▀█ ░█▀▀▀ ▀▀█▀▀ ░█─░█ ░█▀▀▀ ░█▀▀█",
  "  ░█▄▄█ ░█▀▀▀ ─░█── ░█▀▀█ ░█▀▀▀ ░█▄▄▀",
  "  ░█─░█ ░█▄▄▄ ─░█── ░█─░█ ░█▄▄▄ ░█─░█",
  "",
  "  ╔═══════════════════════════════════════════════╗",
  "  ║   S H E L L   v 3 . 0  //  P O R T F O L I O ║",
  "  ╚═══════════════════════════════════════════════╝",
  "",
];

const BOOT_MESSAGES = [
  { content: "  [BOOT] Initializing 0xNULL kernel...",         color: "#5a5a72" },
  { content: "  [BOOT] Loading virtual filesystem... OK",      color: "#5a5a72" },
  { content: "  [BOOT] Three.js spatial engine... ONLINE",     color: "#5a5a72" },
  { content: "  [BOOT] CRT filter overlay... ACTIVE",          color: "#5a5a72" },
  { content: "  [BOOT] Neural autocomplete... STANDBY",        color: "#5a5a72" },
  { content: "  [BOOT] Ghost logger... MONITORING",            color: "#5a5a72" },
  { content: "",                                                color: undefined },
  { content: '  Welcome to 0xNULL. Type "help" to begin.', color: "#00f0ff" },
  { content: '  Navigate with ls, cd, cat. Try "neofetch".',    color: "#ffbf00" },
  { content: "",                                                color: undefined },
];

export const BootSequence: React.FC = () => {
  const pushLine = useTerminalStore((s) => s.pushLine);
  const hasBooted = useRef(false);

  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    for (const line of BOOT_ASCII) {
      pushLine({ type: "ascii", content: line, color: "#00f0ff" });
    }

    let delay = 300;
    for (const msg of BOOT_MESSAGES) {
      const m = msg;
      setTimeout(() => {
        pushLine({
          type: m.color === "#00f0ff" || m.color === "#ffbf00" ? "system" : "output",
          content: m.content,
          color: m.color,
        });
      }, delay);
      delay += 120;
    }
  }, [pushLine]);

  return null;
};