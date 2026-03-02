import type { CommandDefinition } from "@/core/engine/types";

let matrixActive = false;
let matrixCleanup: (() => void) | null = null;

function startMatrixRain(): () => void {
  const canvas = document.createElement("canvas");
  canvas.id = "matrix-rain";
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    pointer-events: none;
    opacity: 0.85;
  `;
  document.body.appendChild(canvas);

  const ctx2d = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンゼ₀₁₂₃₄₅₆₇₈₉⟐◈▓░▒";
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1).map(() => Math.random() * -100);

  let animating = true;

  const draw = () => {
    if (!animating) return;

    ctx2d.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);

    ctx2d.fillStyle = "#00f0ff";
    ctx2d.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];

      // Random color variation
      const r = Math.random();
      if (r > 0.95) {
        ctx2d.fillStyle = "#ffffff";
      } else if (r > 0.8) {
        ctx2d.fillStyle = "#39ff14";
      } else {
        ctx2d.fillStyle = "#00f0ff";
      }

      ctx2d.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 + Math.random() * 0.5;
    }

    requestAnimationFrame(draw);
  };

  draw();

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", handleResize);

  return () => {
    animating = false;
    window.removeEventListener("resize", handleResize);
    canvas.remove();
  };
}

export const matrixCommand: CommandDefinition = {
  name: "matrix",
  description: "Toggle Matrix digital rain effect",
  aliases: ["rain"],
  execute: (ctx) => {
    if (matrixActive && matrixCleanup) {
      matrixCleanup();
      matrixCleanup = null;
      matrixActive = false;

      ctx.pushLine({
        type: "success",
        content: "  Matrix rain deactivated. Welcome back to reality.",
      });
      return;
    }

    matrixActive = true;
    matrixCleanup = startMatrixRain();

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "success", content: "  Matrix rain activated. Run 'matrix' again to stop.", color: "#39ff14" },
      { type: "output", content: "  Follow the white rabbit...", color: "#00f0ff" },
      { type: "blank", content: "" },
    ]);

    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (matrixActive && matrixCleanup) {
        matrixCleanup();
        matrixCleanup = null;
        matrixActive = false;
      }
    }, 30000);
  },
};
