// Central configuration. Everything comes from environment variables so that
// no secret or deployment-specific value is hard-coded.

const DEFAULT_LOCATIONS = [
  { name: 'Library', zone: 'academic' },
  { name: 'Computer Lab', zone: 'academic' },
  { name: 'Science Laboratory', zone: 'academic' },
  { name: 'Classroom Block A', zone: 'academic' },
  { name: 'Classroom Block B', zone: 'academic' },
  { name: 'Administration Block', zone: 'academic' },
  { name: 'Cafeteria', zone: 'social' },
  { name: 'Student Center', zone: 'social' },
  { name: 'Prayer Area', zone: 'social' },
  { name: 'Sports Ground', zone: 'outdoor' },
  { name: 'Parking Area', zone: 'outdoor' },
  { name: 'Main Gate', zone: 'outdoor' },
  { name: 'Bus Stop', zone: 'outdoor' },
  { name: 'Hostel', zone: 'residential' },
  { name: 'Other / Not sure', zone: 'other' },
];

export const CATEGORIES = [
  'Wallet',
  'Phone',
  'Keys',
  'ID Card',
  'Bag',
  'Water Bottle',
  'Books & Stationery',
  'Electronics',
  'Clothing',
  'Accessories',
  'Documents',
  'Other',
];

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// `requireCors` is true for the web server in production; CLI scripts (db:init,
// db:seed, admin:create) don't serve HTTP, so they pass false.
export function loadConfig(env = process.env, { requireCors = true } = {}) {
  const isProd = env.NODE_ENV === 'production';

  // Custom locations: CAMPUS_LOCATIONS="Library,Cafeteria,...". Each custom
  // location becomes its own zone (so only exact-location matches score).
  const customLocations = parseList(env.CAMPUS_LOCATIONS);
  const locations = customLocations.length
    ? customLocations.map((name) => ({ name, zone: name }))
    : DEFAULT_LOCATIONS;

  const corsOrigins = parseList(env.CORS_ORIGINS);
  if (isProd && requireCors && corsOrigins.length === 0) {
    throw new Error('CORS_ORIGINS must be set in production (comma-separated list of allowed frontend origins).');
  }

  return {
    isProd,
    port: toInt(env.PORT, 4000),
    universityName: env.UNIVERSITY_NAME || 'Mehran University of Engineering and Technology',
    // Shown on the website so students know who to contact. Replace the placeholders in .env.
    adminContact: {
      name: env.ADMIN_CONTACT_NAME || 'Lost & Found Administrator',
      email: env.ADMIN_CONTACT_EMAIL || 'xxx@gmail.com',
      phone: env.ADMIN_CONTACT_PHONE || '03XX-XXXXXXX',
      office_location: env.OFFICE_LOCATION || '[Lost & Found office location]',
      office_hours: env.OFFICE_HOURS || '[Opening hours]',
    },
    categories: CATEGORIES,
    locations,
    corsOrigins: corsOrigins.length ? corsOrigins : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    // Render/Vercel sit behind a proxy; set TRUST_PROXY=1 so rate limiting sees real client IPs.
    trustProxy: env.TRUST_PROXY ? toInt(env.TRUST_PROXY, 1) : false,
    dbPath: env.DB_PATH || './data/findit.db',
    uploadDir: env.UPLOAD_DIR || './uploads',
    maxImageBytes: toInt(env.MAX_IMAGE_MB, 3) * 1024 * 1024,
    sessionHours: toInt(env.ADMIN_SESSION_HOURS, 8),
    // Bootstrap admin: created at startup only if no admin exists yet.
    bootstrapAdminEmail: env.ADMIN_EMAIL || '',
    bootstrapAdminPassword: env.ADMIN_PASSWORD || '',
    seedDemoData: env.SEED_DEMO_DATA === 'true',
    rateLimits: {
      globalPer15Min: toInt(env.RATE_LIMIT_GLOBAL, 300),
      writesPerHour: toInt(env.RATE_LIMIT_WRITES, 20),
      loginPer15Min: toInt(env.RATE_LIMIT_LOGIN, 10),
    },
  };
}
