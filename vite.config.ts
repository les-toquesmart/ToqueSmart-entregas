import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? './' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/logo-dark.png', 'assets/logo-white.png', 'assets/default-cover.png'],
      manifest: {
        name: 'Toque Smart Entregas',
        short_name: 'TS Entregas',
        description: 'Actas de entrega y aceptación de proyectos Toque Smart',
        theme_color: '#102638',
        background_color: '#eef2f5',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}']
      }
    })
  ]
}))
