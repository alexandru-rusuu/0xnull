import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://0xnull.dev",
  output: "static",

  integrations: [
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    optimizeDeps: {
      include: ["three", "@react-three/fiber", "@react-three/drei"],
    },
  },

});