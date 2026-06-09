import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/recommend': {
        target: 'https://api.anthropic.com/v1/messages',
        changeOrigin: true,
        rewrite: () => '',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Forward key and headers
            proxyReq.setHeader('x-api-key', req.headers['x-api-key'] || '');
            proxyReq.setHeader('anthropic-version', '2023-06-01');
            proxyReq.setHeader('content-type', 'application/json');
          });
        }
      }
    }
  }
});
