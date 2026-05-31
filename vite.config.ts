import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        de: resolve(__dirname, "de/index.html"),
        sv: resolve(__dirname, "sv/index.html"),
        privacy: resolve(__dirname, "privacy/index.html"),
        notFound: resolve(__dirname, "404.html"),
        error: resolve(__dirname, "500.html"),
      },
    },
  },
});
