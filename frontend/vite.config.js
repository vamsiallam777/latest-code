import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['prop-types', 'react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux']
  },
  build: {
    rollupOptions: {
      external: ['prop-types'],
      output: {
        globals: {
          'prop-types': 'PropTypes'
        }
      }
    }
  }
});
