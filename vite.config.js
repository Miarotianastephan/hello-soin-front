import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  server: {
    host: true,
    allowedHosts: ['a626-129-222-108-22.ngrok-free.app']
  },
  host: '0.0.0.0',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/medicalReact",
})
