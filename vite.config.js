import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  server: {
    fs: { allow: ['..'] },
    proxy: { '/api': 'http://localhost:3001' },
  },
  build: { outDir: '../dist', emptyOutDir: true },
});