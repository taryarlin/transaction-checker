import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Pay Check',
                short_name: 'PayCheck',
                start_url: '.',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#3b82f6',
                description: 'Track and share your transactions easily!',
                icons: [
                    {
                        src: '/favicon.ico',
                        sizes: '48x48 72x72 96x96 128x128 256x256 512x512',
                        type: 'image/x-icon'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
