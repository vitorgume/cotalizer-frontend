import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // equivale a 0.0.0.0
    port: 5173,          // opcional
    strictPort: true,    // opcional: não muda a porta
    // hmr: { host: '192.168.0.12', protocol: 'ws' } // só se o HMR não conectar
  }
})
