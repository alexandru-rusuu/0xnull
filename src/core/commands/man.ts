import type { CommandDefinition } from "@/core/engine/types";
import { commandRegistry } from "./registry";

const EXTENDED_DOCS: Record<string, string[]> = {
  help: [
    "SYNOPSIS:  help",
    "  Display a list of all available commands with their descriptions.",
    "  Aliases and usage hints are shown when available.",
  ],
  ls: [
    "SYNOPSIS:  ls [path]",
    "  List the contents of a directory. If no path is given, lists the",
    "  current working directory. Directories are shown in green, files",
    "  in cyan. Spawns 3D data cubes in the background scene.",
    "",
    "FLAGS:",
    "  (none yet)",
    "",
    "EXAMPLES:",
    "  ls              List current directory",
    "  ls projects     List the projects folder",
    "  ls ~            List home directory",
  ],
  cd: [
    "SYNOPSIS:  cd <path>",
    "  Change the current working directory. Supports relative and",
    "  absolute paths, '..' for parent, '~' for home.",
    "",
    "EXAMPLES:",
    "  cd projects          Enter projects directory",
    "  cd ..                Go up one level",
    "  cd ~                 Go to home directory",
    "  cd projects/0xnull   Navigate multiple levels",
  ],
  cat: [
    "SYNOPSIS:  cat <file>",
    "  Display the contents of a file with syntax-aware formatting.",
    "  Markdown headers, lists, and blockquotes are color-coded.",
    "",
    "EXAMPLES:",
    "  cat about.md                   Read the about page",
    "  cat projects/0xnull/README.md  Read project details",
    "  cat contact.md                 View contact info",
  ],
  grep: [
    "SYNOPSIS:  grep <pattern> [path]",
    "  Search for a regex pattern across files in the virtual filesystem.",
    "  If no path is given, searches from the current directory.",
    "",
    "FLAGS:",
    "  -i, --ignore-case    Case-insensitive search",
    "",
    "EXAMPLES:",
    '  grep React             Search for "React" in cwd',
    '  grep -i webgl ~        Case-insensitive search from home',
    '  grep "Status:.*LIVE"   Use regex patterns',
  ],
  tree: [
    "SYNOPSIS:  tree [path]",
    "  Display the directory structure as an indented tree.",
    "  Shows file/directory counts at the bottom.",
    "",
    "EXAMPLES:",
    "  tree           Show tree from current directory",
    "  tree ~         Show entire filesystem tree",
    "  tree projects  Show only projects tree",
  ],
  open: [
    "SYNOPSIS:  open <target>",
    "  Open a URL, file, or known shortcut in a new browser tab.",
    "  When given a file, extracts and opens URLs found within it.",
    "",
    "SHORTCUTS:",
    "  github        Open GitHub profile",
    "  email         Open email client",
    "  resume.pdf    Download resume",
    "",
    "EXAMPLES:",
    "  open github                      Open GitHub profile",
    "  open https://example.com         Open a URL directly",
    "  open projects/0xnull/README.md   Extract URLs from file",
  ],
  theme: [
    "SYNOPSIS:  theme [name]",
    "  Switch the terminal color theme. Run without arguments to see",
    "  available themes. Themes persist across sessions via localStorage.",
    "",
    "THEMES:",
    "  cyberpunk     Default neon cyan/magenta theme",
    "  matrix        Green phosphor monochrome",
    "  synthwave     Purple/pink retro wave",
    "  amber         Classic amber terminal",
    "  solarized     Solarized dark variant",
    "",
    "EXAMPLES:",
    "  theme              List themes",
    "  theme matrix       Switch to matrix theme",
    "  theme cyberpunk    Back to default",
  ],
  skills: [
    "SYNOPSIS:  skills [--sort]",
    "  Display a visual proficiency chart of technical skills.",
    "  Skills are shown with progress bars (░ to █).",
  ],
  neofetch: [
    "SYNOPSIS:  neofetch",
    "  Display ASCII art logo alongside system information,",
    "  including the tech stack, shell version, and uptime.",
  ],
  whoami: [
    "SYNOPSIS:  whoami",
    "  Show the current visitor identity including session ID,",
    "  clearance level, and connection timestamp.",
  ],
  history: [
    "SYNOPSIS:  history",
    "  Display a numbered list of previously executed commands.",
    "  Use ↑/↓ arrow keys to cycle through history at the prompt.",
  ],
  echo: [
    "SYNOPSIS:  echo <text>",
    "  Print text to the terminal output.",
    "",
    "EXAMPLES:",
    "  echo hello world",
    '  echo "testing 123"',
  ],
  clear: [
    "SYNOPSIS:  clear",
    "  Clear the terminal screen and remove all output lines.",
    "  Also clears any spawned 3D cubes from the scene.",
  ],
  pwd: [
    "SYNOPSIS:  pwd",
    "  Print the full path of the current working directory.",
  ],
  date: [
    "SYNOPSIS:  date",
    "  Display the current date, time, timezone, unix timestamp,",
    "  and session uptime.",
  ],
  guestbook: [
    "SYNOPSIS:  guestbook [--write <message>] [--clear]",
    "  Read or write entries to the local guestbook. Messages are",
    "  stored in browser localStorage.",
    "",
    "EXAMPLES:",
    "  guestbook                      Read all entries",
    '  guestbook --write "Hello!"     Leave a message',
    "  guestbook --clear              Clear all entries",
  ],
  fortune: [
    "SYNOPSIS:  fortune",
    "  Display a random programming quote, proverb, or joke.",
  ],
  sudo: [
    "SYNOPSIS:  sudo <command>",
    "  Attempt to escalate privileges. (Spoiler: access denied.)",
  ],
  matrix: [
    "SYNOPSIS:  matrix",
    "  Toggle the Matrix digital rain effect over the terminal.",
    "  Press any key or run 'matrix' again to stop.",
  ],
  export: [
    "SYNOPSIS:  export [session|resume]",
    "  Export data from the terminal. 'session' copies your command",
    "  history. 'resume' copies the full about/skills profile.",
  ],
  weather: [
    "SYNOPSIS:  weather [city]",
    "  Display current weather conditions. Uses a free API.",
    "  Defaults to auto-detect location if no city specified.",
  ],
};

export const manCommand: CommandDefinition = {
  name: "man",
  description: "Show detailed manual for a command",
  usage: "man <command>",
  aliases: ["manual", "info"],
  execute: (ctx) => {
    if (ctx.args.length === 0) {
      ctx.pushLines([
        { type: "blank", content: "" },
        { type: "system", content: '  Usage: man <command>' },
        { type: "output", content: '  Example: man grep' },
        { type: "blank", content: "" },
      ]);
      return;
    }

    const cmdName = ctx.args[0].toLowerCase();
    const cmd = commandRegistry.resolve(cmdName);
    const docs = EXTENDED_DOCS[cmd?.name ?? cmdName];

    if (!cmd) {
      ctx.pushLine({
        type: "error",
        content: `man: no manual entry for '${cmdName}'`,
      });
      return;
    }

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "ascii", content: `  ╔═══════════════════════════════════════════╗` },
      { type: "ascii", content: `  ║  MANUAL: ${cmd.name.toUpperCase().padEnd(33)}║` },
      { type: "ascii", content: `  ╚═══════════════════════════════════════════╝` },
      { type: "blank", content: "" },
      { type: "output", content: `  ${cmd.description}`, color: "#00f0ff" },
      { type: "blank", content: "" },
    ]);

    if (docs) {
      for (const line of docs) {
        const isHeader = line.endsWith(":") || line.startsWith("SYNOPSIS") || line.startsWith("FLAGS") || line.startsWith("EXAMPLES") || line.startsWith("SHORTCUTS") || line.startsWith("THEMES");
        ctx.pushLine({
          type: "output",
          content: `  ${line}`,
          color: isHeader ? "#ffbf00" : undefined,
        });
      }
    } else {
      ctx.pushLine({
        type: "output",
        content: `  Usage: ${cmd.usage ?? cmd.name}`,
      });
      if (cmd.aliases?.length) {
        ctx.pushLine({
          type: "output",
          content: `  Aliases: ${cmd.aliases.join(", ")}`,
          color: "#5a5a72",
        });
      }
    }

    ctx.pushLine({ type: "blank", content: "" });
  },
};
