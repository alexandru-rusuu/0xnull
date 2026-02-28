import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://alexandru-rusuu.github.io",
  base: "/0xnull",
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