import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Connect, Plugin } from 'vite';
import { defineConfig } from 'vite';

/**
 * Build model
 * - `vite build` bundles the browser assets only: one stylesheet entry and one tiny vanilla TS module.
 * - `vite build --ssr src/entry-server.tsx` bundles the React page templates for Node.
 * - `scripts/prerender.mjs` renders every route to static HTML in dist/.
 * No React is shipped to the browser.
 */

const root = import.meta.dirname;
const CLIENT_ENTRIES = {
  styles: 'src/styles/main.css',
  main: 'src/client/main.ts',
};

/** Security headers for every route, read from vercel.json so preview and production stay in step. */
function productionHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8')) as {
    headers?: { source: string; headers: { key: string; value: string }[] }[];
  };
  const global = config.headers?.find((entry) => entry.source === '/(.*)');
  return Object.fromEntries((global?.headers ?? []).map(({ key, value }) => [key, value]));
}

/** Dev server: render pages on request with the same templates the prerenderer uses. */
function devPages(): Plugin {
  return {
    name: 'hr-dev-pages',
    apply: 'serve',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url?.split('?')[0] ?? '/';
          const accept = req.headers.accept ?? '';
          if (req.method !== 'GET' || !accept.includes('text/html')) return next();
          try {
            const mod = (await server.ssrLoadModule(
              '/src/entry-server.tsx',
            )) as typeof import('./src/entry-server');
            const route = mod.findRoute(url);
            const assets = {
              styles: [`/${CLIENT_ENTRIES.styles}`],
              scripts: [`/${CLIENT_ENTRIES.main}`],
              fontPreloads: [],
            };
            const html = await server.transformIndexHtml(
              url,
              mod.renderRoute(route ?? mod.notFoundRoute, assets),
            );
            res.statusCode = route ? 200 : 404;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(html);
          } catch (error) {
            server.ssrFixStacktrace(error as Error);
            next(error);
          }
        });
      };
    },
  };
}

/**
 * Preview server parity with Vercel: production headers on every response, `trailingSlash: true`
 * redirects for page directories, and dist/404.html for unknown routes.
 */
function previewParity(): Plugin {
  return {
    name: 'hr-preview-parity',
    apply: 'serve',
    configurePreviewServer(server) {
      const headers = productionHeaders();
      const outDir = resolve(root, server.config.build.outDir);
      const fileFor = (url: string | undefined) => {
        const pathname = decodeURIComponent((url ?? '/').split('?')[0]);
        return resolve(outDir, `.${pathname}`);
      };

      const setHeaders: Connect.NextHandleFunction = (req, res, next) => {
        for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
        const pathname = (req.url ?? '/').split('?')[0];
        if (!pathname.endsWith('/') && existsSync(resolve(fileFor(pathname), 'index.html'))) {
          res.statusCode = 308;
          res.setHeader('Location', `${pathname}/`);
          res.end();
          return;
        }
        next();
      };
      server.middlewares.use(setHeaders);

      return () => {
        server.middlewares.use((req, res, next) => {
          const notFound = resolve(outDir, '404.html');
          const target = fileFor(req.url);
          const isFile = statSync(target, { throwIfNoEntry: false })?.isFile() ?? false;
          if (!['GET', 'HEAD'].includes(req.method ?? '') || isFile || !existsSync(notFound)) {
            return next();
          }
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(req.method === 'HEAD' ? undefined : readFileSync(notFound));
        });
      };
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [devPages(), previewParity()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    modulePreload: { polyfill: false },
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(CLIENT_ENTRIES).map(([name, file]) => [name, resolve(root, file)]),
      ),
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
});
