import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  if (mode === "development") {
    const taggerModule = await import("lovable-tagger").catch(() => null);

    if (taggerModule?.componentTagger) {
      plugins.push(taggerModule.componentTagger());
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@app": path.resolve(__dirname, "./src/app"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@legacy": path.resolve(__dirname, "./src/legacy"),
        "@theme": path.resolve(__dirname, "./src/theme"),
      },
    },

    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      globals: true,
    },
  };
});
