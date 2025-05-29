import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from "node:url";

const __dirname = import.meta.dirname;

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './server'),
    },
  },
  server: {
    cors: {
      // the origin you will be accessing via browser
      origin: 'http://192.168.1.124:3000',
    },
  },
  build: {
    minify: false,
    emptyOutDir: false,
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.js'),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})