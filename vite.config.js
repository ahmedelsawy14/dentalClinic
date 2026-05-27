import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    target: ['es2020'],
    
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'react-router': ['react-router-dom'],
          'lucide': ['lucide-react'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg|webp|ico/.test(ext)) {
            return `images/[name]-[hash][extname]`;
          } else if (/woff|woff2|ttf|otf|eot/.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    minify: 'esbuild',
    esbuild: {
      drop: ['console'],
    },

    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    assetsInlineLimit: 4096,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@tailwindcss/vite',
      'tailwindcss'
    ],
    exclude: [
      '@tailwindcss/oxide',
      'lightningcss',
    ],
  },

  ssr: {
    noExternal: ['@tailwindcss/vite', 'tailwindcss'],
  },
})
