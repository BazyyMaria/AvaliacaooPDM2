import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'manifest.webmanifest'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/unpkg\.com\/leaflet\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'leaflet-lib',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }
            }
          }
        ]
      }
    }),
  ],
}
