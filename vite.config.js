import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages (comment out for Vercel)
  // For Vercel: use base: '/'
  // For GitHub Pages: use base: '/hexax/'
  base: process.env.VERCEL ? '/' : '/hexax/',
})
