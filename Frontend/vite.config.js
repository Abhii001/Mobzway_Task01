import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      // Proxying API requests
      '/api': {
        target: 'https://mobzway-task01.onrender.com', // Backend URL
        changeOrigin: true,
        secure: false, // Allow insecure requests if necessary
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' from the request path
      },
      // Proxying WebSocket requests
      '/socket.io': {
        target: 'http://mobzway-task01.onrender.com',  // Backend URL
        changeOrigin: true,
        ws: true,  // Enable WebSocket proxying
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
});
