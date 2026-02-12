import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/long-line-site-diary/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Long Line Site Diary',
        short_name: 'LL Diary',
        start_url: '/long-line-site-diary/',
        scope: '/long-line-site-diary/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          { src: '/long-line-site-diary/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/long-line-site-diary/icons/pwa-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }),react()],
  server: {
    port: 5180,
    strictPort: true,
    open: false
  }
})


