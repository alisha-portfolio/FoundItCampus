import 'dotenv/config';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { openDatabase } from './database/db.js';
import { seedDemoData } from './database/seed.js';
import { bootstrapAdmin } from './services/adminService.js';

const config = loadConfig();
const db = await openDatabase(config.dbPath);

// First-run convenience for hosts without a shell (e.g. Render free tier):
// create the initial admin from ADMIN_EMAIL / ADMIN_PASSWORD if no admin exists.
try {
  if (await bootstrapAdmin(db, config.bootstrapAdminEmail, config.bootstrapAdminPassword)) {
    console.log(`Created the initial administrator (${config.bootstrapAdminEmail}).`);
  }
} catch (err) {
  console.error(`Could not create the initial administrator: ${err.message}`);
}
if (db.prepare('SELECT COUNT(*) AS n FROM admins').get().n === 0) {
  console.warn('No administrator exists yet. Set ADMIN_EMAIL and ADMIN_PASSWORD, or run: npm run admin:create');
}

// Optional demo content for live demonstrations. Never overwrites existing reports.
if (config.seedDemoData) {
  const result = seedDemoData(db);
  console.log(result.seeded ? `Seeded ${result.items} demo reports.` : `Demo seed skipped: ${result.reason}.`);
}

const app = createApp({ config, db });
const server = app.listen(config.port, () => {
  console.log(`FindIt Campus API listening on port ${config.port} (${config.isProd ? 'production' : 'development'}, sqlite driver: ${db.driver})`);
  console.log(`Allowed frontend origins: ${config.corsOrigins.join(', ')}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
