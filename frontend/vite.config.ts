// vite.config.ts
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: { port: 8080 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@legacy": path.resolve(__dirname, "src/legacy"),
      "@theme": path.resolve(__dirname, "src/theme"),
      "@nav": path.resolve(__dirname, "src/nav"),
      "@components": path.resolve(__dirname, "src/components"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@types": path.resolve(__dirname, "src/types"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@config": path.resolve(__dirname, "src/config")
    }
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
        }
      }
    }
  }
});
