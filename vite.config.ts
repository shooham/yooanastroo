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
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback to Vercel dev server if available
          proxy.on('error', (err, req, res) => {
            console.log('API proxy error, trying direct file execution...');
          });
        }
      }
    }
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
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
    'process.env.RAZORPAY_KEY_ID': JSON.stringify(process.env.RAZORPAY_KEY_ID)
  }
});
