import React, { useEffect } from "react";
import { NullScene } from "@/components/three/NullScene";
import { TerminalWindow, BootSequence } from "@/components/terminal";
import { GhostLogger } from "@/components/ghost/GhostLogger";
import { executeDeepLink } from "@/core/engine/interpreter";

interface AppShellProps {
  route?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ route = "/" }) => {
  useEffect(() => {
    if (route && route !== "/") {
      const timer = setTimeout(() => {
        executeDeepLink(route);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [route]);

  return (
    <>
      {/* 3D Background — rendered in the fixed #three-root via portal */}
      <div className="fixed inset-0 z-0">
        <NullScene />
      </div>

      {/* Terminal UI — centered glass panel */}
      <div className="relative z-10 h-screen w-screen flex items-center justify-center p-4 md:p-8">
        <BootSequence />
        <TerminalWindow />
      </div>

      {/* Ghost system logs — bottom-right corner */}
      <GhostLogger />
    </>
  );
};

export default AppShell;