import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  base: './', // ./ 或 /
  registerType: 'autoUpdate', // prompt、autoUpdate
  workbox: {
    cleanupOutdatedCaches: true,
  },
  // devOptions: {
  //   enabled: true,
  // },
  manifest: {
    lang: 'zh',
    name: '虎鲸智造',
    short_name: '虎鲸智造',
    description: '官网、文档、演示地址',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
}

export const createPwa = () => {
  return VitePWA(pwaOptions)
}
