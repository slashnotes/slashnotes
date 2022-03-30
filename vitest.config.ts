import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      all: true,
      extension: ['ts', 'tsx'],
      reporter: ['text', 'lcov']
    }
  },
  resolve: {
    alias: [
      {
        find: 'react/jsx-runtime',
        replacement: __dirname + '/node_modules/react/jsx-runtime.js'
      }
    ]
  }
})
