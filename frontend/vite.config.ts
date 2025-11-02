// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-core";
            if (id.includes("zustand")) return "state-core";
            if (id.includes("recharts")) return "charts-core";
            if (id.includes("framer-motion")) return "motion";
            return "vendor";
          }
        },
      },
    },
  },
});
