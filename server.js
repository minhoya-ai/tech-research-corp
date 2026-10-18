/**
 * Express Web Server for Aetheris AI Research Portal
 * Provides static asset serving and REST APIs for research articles and lab metrics.
 */

const express = require('express');
const path = require('path');
const researchData = require('./public/js/data.js');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// REST APIs
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
      a.titleKo.toLowerCase().includes(query) ||
      a.titleEn.toLowerCase().includes(query) ||
      a.summaryKo.toLowerCase().includes(query) ||
      a.summaryEn.toLowerCase().includes(query) ||
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
  const article = researchData.articles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
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
    pool: researchData.dataTechPool || [],
    syncIntervalMinutes: 30,
    serverTime: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Aetheris AI Portal', timestamp: new Date().toISOString() });
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ Aetheris AI Research Portal is live!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
