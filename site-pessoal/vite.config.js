import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/site/', // Ajuste para '/seu-repositorio/' se estiver em subdiretório
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Ajuste conforme suas dependências
          utils: ['./src/js/utils/helpers.js', './src/js/utils/validators.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    devSourcemap: true
  }
});