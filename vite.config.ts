/// <reference types="node" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import gfMetadata from './build/gfMetadata';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'xivanalysisZh',
      formats: ['iife'],
      fileName: () => 'index.js',
    },
    minify: false,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  plugins: [gfMetadata],
});
