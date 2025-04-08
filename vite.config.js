import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from "node:url";

const __dirname = import.meta.dirname;

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './server')
    }
  },
  build: {
    minify: false,
    emptyOutDir: false,
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.js'),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})