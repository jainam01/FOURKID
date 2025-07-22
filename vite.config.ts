// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Define the root of the frontend project
  root: 'client',

  // Define aliases relative to the project root
  resolve: {
    alias: {
      '@': '/src',
      '@shared': '/../shared', // Note the path goes up one level
      '@assets': '/../attached_assets', // Note the path goes up one level
    },
  },
  
  // Tell Vite where to build the final files
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  // Proxy settings for local development (Vercel ignores this in production)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});