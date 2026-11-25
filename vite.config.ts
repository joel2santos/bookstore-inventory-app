import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const proxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@data": new URL("./src/data", import.meta.url).pathname,
        "@domain": new URL("./src/domain", import.meta.url).pathname,
        "@presentation": new URL("./src/presentation", import.meta.url).pathname,
        "@providers": new URL("./src/providers", import.meta.url).pathname,
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      exclude: ["node_modules", "dist"],
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
  };
});
