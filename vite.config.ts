import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./src/react-app",
  publicDir: "../../public",
  server: {
    allowedHosts: true,
    port: 5173,
  },
  build: {
    outDir: "../../dist",
    chunkSizeWarningLimit: 5000,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': process.env
  }
});
