import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'libs',
        replacement: __dirname + '/src/libs',
      },
      {
        find: 'desktop',
        replacement: __dirname + '/src/desktop',
      },
      {
        find: 'react/jsx-runtime',
        replacement: __dirname + '/../../node_modules/react/jsx-runtime.js'
      }
    ],
  }
})
