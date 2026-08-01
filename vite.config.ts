import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "X-Robots-Tag": "index, follow",
    },
  },
  preview: {
    headers: {
      "X-Robots-Tag": "index, follow",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "framer-motion": ["framer-motion"],
          "ui-vendor": ["lucide-react", "react-hot-toast"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
