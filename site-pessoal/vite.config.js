import { defineConfig } from 'vite';

/**
 * @brief Vite configuration for MVC framework
 * @description Build configuration optimized for modular JavaScript and GitHub Pages
 */
export default defineConfig({
    base: '/site/', // repository name
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        assetsDir: 'public/images',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: './index.html'
            },
            output: {
                manualChunks: {
                    'mvc-core': ['./src/js/core/*.js'],
                    'mvc-models': ['./src/js/models/*.js'],
                    'mvc-controllers': ['./src/js/controllers/*.js'],
                    'mvc-views': ['./src/js/views/*.js'],
                    'mvc-services': ['./src/js/services/*.js']
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
            }
        }
    },
    server: {
        port: 3000,
        open: true,
        cors: true
    },
    optimizeDeps: {
        include: ['src/js/core/*.js', 'src/js/models/*.js']
    }
});