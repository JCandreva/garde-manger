import type { MetadataRoute } from 'next'
import i18n from '@/lib/i18n'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'le garde manger',
    short_name: 'Garde Manger',
    description: i18n.t('manifest.description'),
    start_url: '/groceries',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}