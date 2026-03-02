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
║  EMAIL    → alexrusu795@gmail.com     ║
║  GITHUB   → github.com/alexandru-rusuu ║
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

Features:
- Full terminal emulator with 20+ commands
- 3D spatial scene with particle grid & data cubes
- 6 color themes (try: theme matrix)
- Virtual filesystem with directories & files
- Pipe operators & command chaining
- Tab autocomplete for commands & file paths
- Guestbook, weather, matrix rain, and more

Meta, isn't it?`,
            },
          ],
        },
        {
          name: "shader-playground",
          type: "dir",
          children: [
            {
              name: "README.md",
              type: "file",
              content: `# Shader Playground
**Live GLSL editor with hot-reload preview**

Stack: WebGL2, CodeMirror 6, TypeScript
Status: ██████████ SHIPPED

A browser-based GLSL shader editor with real-time
preview, uniform controls, and texture support.
Export to ShaderToy-compatible format.

→ Live: https://shader-playground.dev
→ Code: github.com/0xnull-dev/shader-playground`,
            },
          ],
        },
      ],
    },
    {
      name: "blog",
      type: "dir",
      children: [
        {
          name: "webgpu-future.md",
          type: "file",
          content: `# Why WebGPU Changes Everything
Posted: 2025-12-15

WebGPU isn't just WebGL's successor — it's a paradigm shift.

## Key Advantages
- Compute shaders for general-purpose GPU work
- Explicit resource management (like Vulkan/Metal)
- Better multi-threading with Web Workers
- Unified API across platforms

## The Opportunity
With WebGPU, browsers become legitimate platforms for:
- Real-time machine learning inference
- Complex physics simulation
- Professional-grade 3D rendering
- Scientific computing

The performance gap between native and web shrinks
dramatically. We're entering an era where "web app"
no longer implies compromise.

> The browser is the new operating system.`,
        },
        {
          name: "terminal-ui-design.md",
          type: "file",
          content: `# Building Terminal UIs for the Web
Posted: 2025-11-08

Why terminal interfaces make excellent portfolio sites:

## Benefits
- Instantly conveys technical competence
- Forces content-first design
- Creates memorable, interactive experience
- Natural command-based navigation
- Low bandwidth, high impact

## Technical Stack
This portfolio uses:
- Zustand for state management
- Virtual filesystem with path resolution
- Framer Motion for smooth line animations
- Three.js for spatial 3D background
- Custom command interpreter with pipes

The key insight: treat the terminal as a real shell,
not just a visual gimmick. Real tab-completion, real
history, real filesystem traversal.`,
        },
        {
          name: "rust-wasm-perf.md",
          type: "file",
          content: `# Rust + WASM: When JavaScript Isn't Fast Enough
Posted: 2025-10-22

Case study: optimizing a voxel renderer from 12fps to 60fps
by moving the hot path to Rust/WASM.

## The Problem
JavaScript's garbage collector caused frame drops during
mesh generation. 500ms GC pauses are unacceptable at 60fps.

## The Solution
- Moved chunk meshing to Rust compiled to WASM
- Used SharedArrayBuffer for zero-copy data transfer
- Implemented greedy meshing in Rust (3x faster)
- Result: consistent 60fps with 16x render distance

## Lessons Learned
1. Profile first, optimize second
2. WASM isn't magic — FFI boundaries have cost
3. Shared memory beats message passing
4. Rust's borrow checker prevents GPU resource leaks`,
        },
      ],
    },
    {
      name: "certs",
      type: "dir",
      children: [
        {
          name: "aws-sa-pro.md",
          type: "file",
          content: `# AWS Solutions Architect — Professional
Issued: 2025-06
Expires: 2028-06
ID: SAP-C02-XXXXXX

Validates advanced skills in designing distributed
systems on AWS. Covers multi-account strategies,
cost optimization, and migration planning.`,
        },
        {
          name: "k8s-cka.md",
          type: "file",
          content: `# Certified Kubernetes Administrator (CKA)
Issued: 2025-03
Expires: 2027-03
ID: CKA-2500-XXXXXX

Performance-based exam covering cluster architecture,
networking, storage, security, and troubleshooting.`,
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
        {
          name: "aliases.sh",
          type: "file",
          content: `# 0xNULL Shell Aliases
alias ll="ls -l"
alias la="ls -a"
alias ..="cd .."
alias gs="git status"
alias gp="git push"
alias dev="npm run dev"
alias build="npm run build"
alias cls="clear"`,
        },
      ],
    },
    {
      name: ".bashrc",
      type: "file",
      content: `# ~/.bashrc — 0xNULL Terminal Configuration
# ==========================================

export PS1="\\[\\033[32m\\]visitor\\[\\033[0m\\]@\\[\\033[36m\\]0xnull\\[\\033[0m\\]:\\[\\033[35m\\]\\w\\[\\033[0m\\] ❯ "
export EDITOR=vim
export LANG=en_US.UTF-8
export TERM=xterm-256color

# Welcome message
echo ""
echo "  Welcome to 0xNULL Terminal"
echo "  Type 'help' to get started"
echo ""`,
    },
    {
      name: "links.md",
      type: "file",
      content: `# USEFUL LINKS

## Social
- GitHub:   https://github.com/alexandru-rusuu
- Email:    alexrusu795@gmail.com

## Projects (Live)
- Neural Canvas:      https://neural-canvas.app
- Shader Playground:  https://shader-playground.dev

## Resources
- Three.js Docs:     https://threejs.org/docs
- Astro Docs:        https://docs.astro.build
- React Docs:        https://react.dev`,
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