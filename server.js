/**
 * Express Web Server for Aetheris AI Research Portal
 * Production-ready backend supporting public cloud deployment & local hosting:
 * - CORS enabled for cross-domain public access
 * - Security headers & rate limiting
 * - Dynamic PORT & 0.0.0.0 HOST binding for Render, Railway, Docker, Vercel, AWS, etc.
 * - REST APIs for research publications, 30-min data-tech feeds, and contact inquiries
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const researchData = require('./public/js/data.js');

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'production';
const SERVER_START_TIME = Date.now();

// In-memory inquiries store (persists to file if writable)
const INQUIRIES_FILE = path.join(__dirname, 'inquiries.json');
let inquiries = [];
if (fs.existsSync(INQUIRIES_FILE)) {
  try {
    inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
  } catch (e) {
    inquiries = [];
  }
}

// 1. CORS Configuration (Permits requests from public domains, GitHub Pages, or localhost)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// 2. Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 3. Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'Aetheris AI Research Engine');
  next();
});

// 4. Lightweight Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (NODE_ENV !== 'production' || req.originalUrl.startsWith('/api')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms) - IP: ${ip}`);
    }
  });
  next();
});

// 5. In-Memory Rate Limiting for Public APIs
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests per minute

app.use('/api', (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local';
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 2000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again in 1 minute.',
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
    });
  }

  next();
});

// 6. Static File Serving with Caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: NODE_ENV === 'production' ? '1h' : '0',
  etag: true
}));

// ==========================================================
// REST APIs
// ==========================================================

// 1. Get all articles with optional search & category filter
app.get('/api/articles', (req, res) => {
  const { category, q } = req.query;
  let results = [...researchData.articles];

  if (category && category !== 'all') {
    results = results.filter(a => a.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(a =>
      (a.titleKo && a.titleKo.toLowerCase().includes(query)) ||
      (a.titleEn && a.titleEn.toLowerCase().includes(query)) ||
      (a.summaryKo && a.summaryKo.toLowerCase().includes(query)) ||
      (a.summaryEn && a.summaryEn.toLowerCase().includes(query)) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  res.json({
    total: results.length,
    articles: results
  });
});

// 2. Get specific article by ID
app.get('/api/articles/:id', (req, res) => {
  let article = researchData.articles.find(a => a.id === req.params.id);
  if (!article && researchData.feedPool) {
    const allPool = (researchData.feedPool.aiResearch || []).concat(
      researchData.feedPool.dataIntelligence || []
    );
    article = allPool.find(a => a.id === req.params.id);
  }
  if (!article) {
    return res.status(404).json({ error: 'Article not found', id: req.params.id });
  }
  res.json(article);
});

// 3. Get lab stats
app.get('/api/stats', (req, res) => {
  res.json(researchData.stats);
});

// 4. Get categories
app.get('/api/categories', (req, res) => {
  res.json(researchData.categories);
});

// 5. Get data-tech live feed pool
app.get('/api/data-tech/feed', (req, res) => {
  res.json({
    pool: researchData.feedPool || {},
    syncIntervalMinutes: 30,
    serverTime: new Date().toISOString()
  });
});

// 6. Dynamic Sync Trigger: Rotates and returns freshly synced articles
let syncCounter = 0;
app.post('/api/data-tech/sync', (req, res) => {
  const pool = researchData.feedPool || {};
  const aiPool = pool.aiResearch || [];
  const diPool = pool.dataIntelligence || [];

  syncCounter++;
  const aiOffset = syncCounter % Math.max(1, aiPool.length);
  const diOffset = syncCounter % Math.max(1, diPool.length);

  const newArticles = [];
  for (let i = 0; i < 2; i++) {
    if (aiPool.length > 0) {
      const item = JSON.parse(JSON.stringify(aiPool[(aiOffset + i) % aiPool.length]));
      item.id = `dt-server-sync-${Date.now()}-ai-${i}`;
      item.date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
      item.badge = '⚡ LIVE UPDATED';
      item.isLiveUpdated = true;
      newArticles.push(item);
    }
  }
  for (let i = 0; i < 2; i++) {
    if (diPool.length > 0) {
      const item = JSON.parse(JSON.stringify(diPool[(diOffset + i) % diPool.length]));
      item.id = `dt-server-sync-${Date.now()}-di-${i}`;
      item.date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
      item.badge = '⚡ LIVE UPDATED';
      item.isLiveUpdated = true;
      newArticles.push(item);
    }
  }

  res.json({
    success: true,
    syncedAt: new Date().toISOString(),
    items: newArticles,
    totalCount: newArticles.length
  });
});

// 7. Contact & PoC Collaboration Inquiry API
app.post('/api/contact', (req, res) => {
  const { name, email, organization, inquiryType, message } = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, and message are required.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address format.'
    });
  }

  const newInquiry = {
    id: `inq-${Date.now()}`,
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 120),
    organization: String(organization || '').slice(0, 100),
    inquiryType: String(inquiryType || 'general').slice(0, 50),
    message: String(message).slice(0, 3000),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    createdAt: new Date().toISOString()
  };

  inquiries.push(newInquiry);
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
  } catch (err) {
    // Read-only filesystem handling for serverless environments
  }

  console.log(`[INQUIRY RECEIVED] From: ${newInquiry.name} (${newInquiry.email}) - Org: ${newInquiry.organization}`);

  res.status(201).json({
    success: true,
    message: '연구 협력 및 문의가 성공적으로 접수되었습니다. 담당 연구원이 24시간 내에 답변드립니다.',
    inquiryId: newInquiry.id,
    receivedAt: newInquiry.createdAt
  });
});

// 8. Public Health Check & Metrics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aetheris AI Research Portal',
    uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// 9. Public API Info & Architecture
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Aetheris AI Research Portal Public API',
    version: '1.2.0',
    description: 'High-Dimensional Data Intelligence & Physical AI Research Publications',
    portalUrl: `http://${HOST}:${PORT}`,
    endpoints: {
      articles: 'GET /api/articles (query params: category, q)',
      articleDetail: 'GET /api/articles/:id',
      stats: 'GET /api/stats',
      categories: 'GET /api/categories',
      feedPool: 'GET /api/data-tech/feed',
      feedSync: 'POST /api/data-tech/sync',
      contact: 'POST /api/contact',
      health: 'GET /api/health',
      ping: 'GET /api/ping'
    },
    standards: ['ISO/IEC 5259 Compliant', 'REST Level 2', 'CORS Enabled'],
    serverTime: new Date().toISOString()
  });
});

// 10. Lightweight Ping
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Fallback to index.html for Single Page Application routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server listening on 0.0.0.0
const server = app.listen(PORT, HOST, () => {
  console.log(`=======================================================`);
  console.log(`⚡ Aetheris AI Research Portal is live!`);
  console.log(`📍 Public Binding: http://${HOST}:${PORT}`);
  console.log(`🌐 Local Access   : http://localhost:${PORT}`);
  console.log(`📡 Health Check   : http://localhost:${PORT}/api/health`);
  console.log(`📚 Public API Info: http://localhost:${PORT}/api/info`);
  console.log(`=======================================================`);
});

// Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\n[${signal}] Gracefully shutting down Aetheris AI Server...`);
  server.close(() => {
    console.log('✅ HTTP server closed. Process exiting.');
    process.exit(0);
  });
}
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = app;
