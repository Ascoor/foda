// vite.config.ts
import { defineConfig, splitVendorChunkPlugin, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// نجعل config دالة async حتى نعمل import ديناميكي فقط لو ANALYZE=true
export default defineConfig(async () => {
  const shouldAnalyze = process.env.ANALYZE === "true";

  const plugins: PluginOption[] = [
    react(),
    splitVendorChunkPlugin(),
  ];

  if (shouldAnalyze) {
    // استيراد كسول — لن يُحمَّل إلا عند ANALYZE=true
    const { visualizer } = await import("rollup-plugin-visualizer");
    plugins.push(
      visualizer({
        filename: "analyze.html",
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
        emitFile: true,
      }) as PluginOption
    );
  }

  return {
    plugins,
    server: { port: 8080 },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@features": path.resolve(__dirname, "src/features"),
        "@ui": path.resolve(__dirname, "src/ui"),
        "@routing": path.resolve(__dirname, "src/routing"),
        "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
        "@testing": path.resolve(__dirname, "src/testing"),
        // أضف هذه فقط إذا كانت موجودة فعلاً لديك:
        // "@assets": path.resolve(__dirname, "src/assets"),
        // "@types": path.resolve(__dirname, "src/types"),
      },
    }, 
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // إمّا مباشرة مع تايب البارامتر:
          manualChunks: (id: string) => {
            if (id.includes("node_modules")) {
              if (id.includes("react-router")) return "router";
              if (id.includes("@tanstack/react-query")) return "query-core";
              if (id.includes("react")) return "react-core";
              if (id.includes("framer-motion")) return "motion";
              if (id.includes("leaflet")) return "leaflet";
              return "vendor";
            }
            return undefined; // لضبط نوع الإرجاع
          
          },
        },
      },
    },
  };
});
