import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      all: true,
      extension: ['ts', 'tsx'],
    }
  }
})
