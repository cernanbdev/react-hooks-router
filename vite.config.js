/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // `describe`, `it`, `expect` etc. are available without importing them,
    // which also lets React Testing Library auto-unmount between tests.
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
})
