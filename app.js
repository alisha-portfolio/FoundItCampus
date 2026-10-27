import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createLimiters } from './middleware/rateLimits.js';
import { createUpload } from './middleware/upload.js';
import { adminRoutes } from './routes/admin.js';
import { publicRoutes } from './routes/public.js';

/** Builds the Express app. Kept separate from server.js so tests can run it on any port. */
export function createApp({ config, db, quietErrors = false }) {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', config.trustProxy);

  // Security headers. Images are served to a frontend on another origin, so allow cross-origin loading.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // CORS: only the configured frontend origins receive CORS headers.
  const allowed = new Set(config.corsOrigins);
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || allowed.has(origin)),
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    })
  );

  // Uploaded photos: static, no directory listing, no MIME sniffing.
  app.use(
    '/uploads',
    express.static(path.resolve(config.uploadDir), {
      index: false,
      dotfiles: 'deny',
      maxAge: '7d',
      setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
    })
  );

  const limiters = createLimiters(config.rateLimits);
  const upload = createUpload(config);

  app.use('/api', limiters.global);
  app.use('/api', express.json({ limit: '20kb' }));
  app.use('/api/admin', adminRoutes({ db, config, limiters }));
  app.use('/api', publicRoutes({ db, config, limiters, upload }));

  app.get('/', (req, res) => res.json({ service: 'FindIt Campus API', docs: 'See README.md', health: '/api/health' }));
  app.use('/api', notFoundHandler);
  app.use(errorHandler({ quiet: quietErrors }));
  return app;
}
