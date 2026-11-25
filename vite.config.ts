import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@data": path.resolve(__dirname, "src/data"),
        "@domain": path.resolve(__dirname, "src/domain"),
        "@presentation": path.resolve(__dirname, "src/presentation"),
        "@providers": path.resolve(__dirname, "src/providers"),
      },
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
