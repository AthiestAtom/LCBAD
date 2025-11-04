// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // Use relative base in production so assets resolve under docs/ on GitHub Pages
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  build: {
    outDir: "docs",
    assetsDir: "assets",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
