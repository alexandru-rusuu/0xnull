export type LineType =
  | "input"
  | "output"
  | "error"
  | "system"
  | "ascii"
  | "success"
  | "link"
  | "table"
  | "blank";

export interface TerminalLine {
  id: string;
  type: LineType;
  content: string;
  timestamp: number;
  color?: string;
  delay?: number;
  isHtml?: boolean;
}

export interface CommandContext {
  args: string[];
  flags: Record<string, string | boolean>;
  rawInput: string;
  cwd: string;
  pushLine: (line: Omit<TerminalLine, "id" | "timestamp">) => void;
  pushLines: (lines: Omit<TerminalLine, "id" | "timestamp">[]) => void;
  setCwd: (path: string) => void;
  spawnCubes: (objects: SpatialObject[]) => void;
  clearCubes: () => void;
  setLoading: (v: boolean) => void;
}

export interface CommandDefinition {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  execute: (ctx: CommandContext) => Promise<void> | void;
}

export type FSNodeType = "file" | "dir";

export interface FSNode {
  name: string;
  type: FSNodeType;
  children?: FSNode[];
  content?: string;
  meta?: Record<string, string>;
}

export interface SpatialObject {
  id: string;
  label: string;
  type: FSNodeType;
  color?: string;
  position?: [number, number, number];
  data?: Record<string, unknown>;
}

export interface GhostLogEntry {
  id: string;
  type: "github" | "spotify" | "system" | "network";
  message: string;
  timestamp: number;
}

export interface AutocompleteSuggestion {
  text: string;
  description?: string;
  score: number;
}

export interface TerminalState {
  lines: TerminalLine[];
  history: string[];
  historyIndex: number;
  cwd: string;
  isProcessing: boolean;
  spatialObjects: SpatialObject[];
  ghostLogs: GhostLogEntry[];
  suggestions: AutocompleteSuggestion[];

  pushLine: (line: Omit<TerminalLine, "id" | "timestamp">) => void;
  pushLines: (lines: Omit<TerminalLine, "id" | "timestamp">[]) => void;
  clearLines: () => void;
  addToHistory: (cmd: string) => void;
  setHistoryIndex: (i: number) => void;
  setCwd: (path: string) => void;
  setProcessing: (v: boolean) => void;
  spawnCubes: (objects: SpatialObject[]) => void;
  clearCubes: () => void;
  addGhostLog: (log: Omit<GhostLogEntry, "id" | "timestamp">) => void;
  setSuggestions: (s: AutocompleteSuggestion[]) => void;
}