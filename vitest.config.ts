import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      include: ['packages/**.{ts,tsx}', 'packages/**/**.{ts,tsx}'],
      exclude: ['packages/**.test.{ts,tsx}', 'packages/**/**.test.{ts,tsx}', 'packages/__tests__', 'packages/**/__tests__', '**/**.d.ts'],
      reporter: ['text', 'lcov'],
    }
  },
  resolve: {
    alias: [
      {
        find: 'react/jsx-runtime',
        replacement: __dirname + '/node_modules/react/jsx-runtime.js'
      },
      {
        find: '@slashnotes/md',
        replacement: __dirname + '/packages/md/src'
      }
    ]
  }
})
