// AI-generated, reviewed and modified
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api requests to the Express backend
      '/api': {
        target: 'https://task-manager-1-ipo6.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
