import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  server: {
    host: true,
    allowedHosts: ['8yx25k0pcq5h.share.zrok.io']
  },
  host: '0.0.0.0',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  base: "/medicalReact",
})
