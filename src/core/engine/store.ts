import { create } from "zustand";
import type {
  TerminalState,
  TerminalLine,
  SpatialObject,
  GhostLogEntry,
  AutocompleteSuggestion,
} from "./types";

let lineCounter = 0;
const uid = () => `ln-${++lineCounter}-${Date.now()}`;
const ghostCounter = () => `ghost-${++lineCounter}-${Date.now()}`;

export const useTerminalStore = create<TerminalState>((set, get) => ({
  lines: [],
  history: [],
  historyIndex: -1,
  cwd: "~",
  isProcessing: false,
  spatialObjects: [],
  ghostLogs: [],
  suggestions: [],

  pushLine: (line: Omit<TerminalLine, "id" | "timestamp">) =>
    set((s) => ({
      lines: [
        ...s.lines,
        { ...line, id: uid(), timestamp: Date.now() },
      ],
    })),

  pushLines: (lines: Omit<TerminalLine, "id" | "timestamp">[]) =>
    set((s) => ({
      lines: [
        ...s.lines,
        ...lines.map((l) => ({
          ...l,
          id: uid(),
          timestamp: Date.now(),
        })),
      ],
    })),

  clearLines: () => set({ lines: [] }),

  addToHistory: (cmd: string) =>
    set((s) => ({
      history: [...s.history, cmd],
      historyIndex: s.history.length + 1,
    })),

  setHistoryIndex: (i: number) => set({ historyIndex: i }),

  setCwd: (path: string) => set({ cwd: path }),

  setProcessing: (v: boolean) => set({ isProcessing: v }),

  spawnCubes: (objects: SpatialObject[]) =>
    set((s) => ({
      spatialObjects: [...s.spatialObjects, ...objects],
    })),

  clearCubes: () => set({ spatialObjects: [] }),

  addGhostLog: (log: Omit<GhostLogEntry, "id" | "timestamp">) =>
    set((s) => ({
      ghostLogs: [
        { ...log, id: ghostCounter(), timestamp: Date.now() },
        ...s.ghostLogs.slice(0, 19),
      ],
    })),

  setSuggestions: (s: AutocompleteSuggestion[]) => set({ suggestions: s }),
}));