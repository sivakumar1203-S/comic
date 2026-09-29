import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { handleGenerateStory, handleGenerateImage } from './src/server/apiHandlers';

function comicApiPlugin(): Plugin {
  return {
    name: 'comic-craft-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Parse JSON body helper
        const parseJsonBody = () => new Promise<any>((resolve) => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch (e) {
              resolve({});
            }
          });
        });

        res.setHeader('Content-Type', 'application/json');

        if (req.url === '/api/generate-story' && req.method === 'POST') {
          try {
            const body = await parseJsonBody();
            const result = await handleGenerateStory(body);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('Error in /api/generate-story:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Failed to generate story' }));
          }
          return;
        }

        if (req.url === '/api/generate-image' && req.method === 'POST') {
          try {
            const body = await parseJsonBody();
            const result = await handleGenerateImage(body);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('Error in /api/generate-image:', err);
            res.statusCode = 200;
            res.end(JSON.stringify({ imageUrl: null, fallback: true }));
          }
          return;
        }

        if (req.url === '/api/layout-builder' && req.method === 'POST') {
          try {
            const body = await parseJsonBody();
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, layout: body.layout, timestamp: new Date().toISOString() }));
          } catch (e: any) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }

        if (req.url === '/api/health') {
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok', app: 'ComicCraft AI' }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), comicApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

