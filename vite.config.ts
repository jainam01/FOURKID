// File: vite.config.ts

import { defineConfig, loadEnv } from "vite"; // <-- Import loadEnv
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Change defineConfig to accept the 'mode' argument
export default defineConfig(({ mode }) => {
  // Use loadEnv to correctly load the .env file from the project root
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
          ]
        : []),
    ],
    // Use the 'env' object loaded by loadEnv, NOT process.env
    define: {
      'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': 
      JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY),
    },
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },
  };
});