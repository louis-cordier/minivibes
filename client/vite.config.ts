import { defineConfig } from 'vite';
import basicSsl from '@vite/plugin-basic-ssl';

export default defineConfig({
  plugins: [basicSsl()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    target: 'ES2020',
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
