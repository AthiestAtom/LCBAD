// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  build: {
    outDir: "dist",
=======
  // Use relative base in production so assets resolve under docs/ on GitHub Pages
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  build: {
    outDir: "docs",
>>>>>>> 56e40e1d7f07eeaf8bad5b7cff90e7becbb8a506
    assetsDir: "assets",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
