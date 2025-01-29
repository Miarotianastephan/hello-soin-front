import { defineConfig } from 'vite';
import path from 'path';
import postcss from 'postcss';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    postcss,
  },
});
