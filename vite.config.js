import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Empty prefix so VITE_DEV_PROXY_TARGET is read too, not just VITE_* vars
  // that Vite injects into the client bundle.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],

    server: {
      // Only used when VITE_API_URL / VITE_AI_URL keep their default
      // same-origin paths. Point them elsewhere with the matching
      // VITE_DEV_PROXY_* variable when a service isn't on localhost.
      proxy: {
        "/api": {
          target: env.VITE_DEV_PROXY_TARGET || "http://localhost:8080",
          changeOrigin: true,
        },
        "/ai-api": {
          target: env.VITE_DEV_AI_PROXY_TARGET || "http://localhost:8000",
          changeOrigin: true,
          // Unlike nginx's trailing-slash form, Vite forwards the full path, so
          // the prefix has to be stripped explicitly or the AI service 404s on
          // /ai-api/chat when it only serves /chat.
          rewrite: (path) => path.replace(/^\/ai-api/, ""),
        },
      },
    },
  };
});