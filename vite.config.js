import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') ||
              id.includes('@react-three') ||
              id.includes('postprocessing')) {
            return 'three-bundle'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1400,
  },
})
