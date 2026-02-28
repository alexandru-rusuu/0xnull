import type { FSNode} from "@/core/engine/types";

const FILESYSTEM: FSNode = {
  name: "~",
  type: "dir",
  children: [
    {
      name: "about.md",
      type: "file",
      content: `# OPERATOR PROFILE

**Designation:** Senior Fullstack Architect
**Clearance:** Level 5 — Creative Engineering
**Status:** ACTIVE

## Specializations
- Fullstack Architecture (React, Node, Cloud)
- 3D Web Experiences (Three.js, WebGL, WebGPU)
- System Design & Distributed Systems
- Creative Development & Generative Art

## Background
Building the future of web interfaces — one shader at a time.
Passionate about pushing browsers to their limits and creating
experiences that blur the line between websites and native apps.

> "The best interface is the one that feels like magic."

---
Run \`skills\` to see technical proficiencies.
Run \`cd projects && ls\` to browse the portfolio.`,
    },
    {
      name: "contact.md",
      type: "file",
      content: `# SECURE COMM CHANNELS

╔══════════════════════════════════════╗
║  EMAIL    → hello@0xnull.dev  ║
║  GITHUB   → github.com/0xnull-dev  ║
║  LINKEDIN → linkedin.com/in/0xnull ║
║  TWITTER  → @0xnull_dev           ║
╚══════════════════════════════════════╝

Or leave a message in the \`guestbook\`.`,
    },
    {
      name: "resume.pdf",
      type: "file",
      content: "[BINARY FILE — Run 'open resume.pdf' to download]",
    },
    {
      name: "projects",
      type: "dir",
      children: [
        {
          name: "neural-canvas",
          type: "dir",
          children: [
            {
              name: "README.md",
              type: "file",
              content: `# Neural Canvas
**Real-time AI art generation in the browser**

Stack: WebGPU, Transformers.js, React 19
Status: ██████████ SHIPPED

A browser-based generative art tool that runs ML models
entirely client-side using WebGPU acceleration.

→ Live: https://neural-canvas.app
→ Code: github.com/0xnull-dev/neural-canvas`,
            },
          ],
        },
        {
          name: "voxel-engine",
          type: "dir",
          children: [
            {
              name: "README.md",
              type: "file",
              content: `# Voxel Engine
**Minecraft-style renderer in pure WebGL2**

Stack: WebGL2, Rust/WASM, TypeScript
Status: ████████░░ IN PROGRESS

A high-performance voxel renderer capable of drawing
millions of cubes at 60fps using GPU instancing.

→ Code: github.com/0xnull-dev/voxel-engine`,
            },
          ],
        },
        {
          name: "quantum-chat",
          type: "dir",
          children: [
            {
              name: "README.md",
              type: "file",
              content: `# Quantum Chat
**E2EE messaging with post-quantum cryptography**

Stack: Rust, React Native, libsignal-pq
Status: ██████████ SHIPPED

Secure messaging app implementing the CRYSTALS-Kyber
key exchange for quantum-resistant encryption.

→ Code: github.com/0xnull-dev/quantum-chat`,
            },
          ],
        },
        {
          name: "0xnull",
          type: "dir",
          children: [
            {
              name: "README.md",
              type: "file",
              content: `# 0xNULL
**This very portfolio you're using right now** ◈

Stack: Astro 5, React 19, Three.js, Framer Motion
Status: ██████████ LIVE

Meta, isn't it?`,
            },
          ],
        },
      ],
    },
    {
      name: ".config",
      type: "dir",
      children: [
        {
          name: "theme.json",
          type: "file",
          content: `{
  "name": "0xnull-dark",
  "primary": "#00f0ff",
  "accent": "#ff00aa",
  "bg": "#0a0a0f",
  "scanlines": true,
  "crt_curvature": 0.02
}`,
        },
      ],
    },
  ],
};

export function resolvePath(cwd: string, target: string): string {
  if (target === "~" || target === "/") return "~";

  const base = target.startsWith("~") || target.startsWith("/")
    ? []
    : cwd.split("/").filter(Boolean);

  const parts = target
    .replace(/^~\/?/, "")
    .split("/")
    .filter(Boolean);

  const resolved = [...base];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  const path = resolved.join("/");
  return path || "~";
}

export function getNode(path: string): FSNode | null {
  if (path === "~" || path === "/" || path === "") return FILESYSTEM;

  const parts = path
    .replace(/^~\/?/, "")
    .split("/")
    .filter(Boolean);

  let current: FSNode = FILESYSTEM;
  for (const part of parts) {
    if (current.type !== "dir" || !current.children) return null;
    const child = current.children.find((c) => c.name === part);
    if (!child) return null;
    current = child;
  }

  return current;
}

export function listDir(path: string): FSNode[] | null {
  const node = getNode(path);
  if (!node || node.type !== "dir") return null;
  return node.children ?? [];
}

export function readFile(path: string): string | null {
  const node = getNode(path);
  if (!node || node.type !== "file") return null;
  return node.content ?? "";
}

export { FILESYSTEM };