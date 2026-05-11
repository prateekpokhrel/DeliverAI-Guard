import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: This tells Vite to map Node's 'global' to the browser's 'window'
  define: {
    global: 'window',
  },
})