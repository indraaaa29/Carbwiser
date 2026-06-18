/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react() as any,
    tailwindcss() as any,
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      thresholds: {
        statements: 20,
        branches: 20,
        functions: 20,
        lines: 20
      }
    }
  },
} as any)
