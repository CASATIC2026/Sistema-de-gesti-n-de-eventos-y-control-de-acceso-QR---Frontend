import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [
    vue(),
    mkcert()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  server: {
  host: true,
  https: false,
  port: 5173
}
})