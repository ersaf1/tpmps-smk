import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../..", import.meta.url));
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, "");
  return {
    plugins: [react()],
    envDir: root,
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "",
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          "",
      ),
    },
    server: {
      proxy: { "/api": env.API_PROXY_TARGET || "http://127.0.0.1:3001" },
    },
  };
});
