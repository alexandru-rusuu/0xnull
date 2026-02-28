import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://0xnull.dev",
  output: "static",

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  vite: {
    ssr: {
      noExternal: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    optimizeDeps: {
      include: ["three", "@react-three/fiber", "@react-three/drei"],
    },
  },

});