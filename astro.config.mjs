// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: node({
    mode: "standalone",
    host: "0.0.0.0",
    port: process.env.PORT || 4321,
  }),

  vite: {
    plugins: [
      // ...add your Vite plugins here
      tailwindcss(),
    ],
  },

  image: {
    domains: ["coffeeshop.local", "coffe-shop.core-hub-plex.cloud"],
  },
});
