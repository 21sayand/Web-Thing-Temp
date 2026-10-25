import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

// Plugin to serve the root /image directory at /image/* with no-cache headers
function serveRootImagePlugin(): Plugin {
  return {
    name: 'serve-root-image',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url === '/image/profile.jpg' || req.url.startsWith('/image/'))) {
          const cleanUrl = req.url.split('?')[0];
          const rootImagePath = path.resolve(__dirname, '.' + cleanUrl);
          const publicImagePath = path.resolve(__dirname, 'public' + cleanUrl);

          const targetPath = fs.existsSync(rootImagePath)
            ? rootImagePath
            : fs.existsSync(publicImagePath)
            ? publicImagePath
            : null;

          if (targetPath) {
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            return fs.createReadStream(targetPath).pipe(res);
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serveRootImagePlugin()],
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
