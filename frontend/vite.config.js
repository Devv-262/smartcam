import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external access (important for Raspberry Pi)
<<<<<<< HEAD
    port: 5174,
    strictPort: false, // Allow fallback to next available port if 5174 is taken
    cors: {
      origin: '*',
      credentials: false
    },
=======
    port: 5173,
    strictPort: true,
    cors: true,
>>>>>>> 4513f3dbe49a135911df4895bf01bc2e063e2c0f
    proxy: {
      // Proxy API requests to Flask backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
<<<<<<< HEAD
      },
      // Proxy Socket.IO connections
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
=======
>>>>>>> 4513f3dbe49a135911df4895bf01bc2e063e2c0f
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'icons': ['lucide-react']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})