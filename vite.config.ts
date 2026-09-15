import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Connect } from 'vite';

function staticResearchRoutes(directory: string): Connect.NextHandleFunction {
  return (request, _response, next) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    if (url.pathname === '/research' || url.pathname.startsWith('/research/')) {
      const candidate = path.resolve(directory, `.${url.pathname}`, 'index.html');
      if (
        candidate.startsWith(path.resolve(directory, 'research') + path.sep) &&
        existsSync(candidate)
      ) {
        request.url = `${url.pathname.replace(/\/$/, '')}/index.html${url.search}`;
      }
    }
    next();
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'static-research-routes',
      configureServer(server) {
        // Vite's SPA fallback otherwise serves the interactive map at directory routes.
        server.middlewares.use(staticResearchRoutes('public'));
      },
      configurePreviewServer(server) {
        server.middlewares.use(staticResearchRoutes('dist'));
      },
    },
  ],
  build: { chunkSizeWarningLimit: 800 },
});
