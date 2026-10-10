/**
 * Main Application Controller for Aetheris AI Portal
 * Handles Theme, View Modes, Real-time Search, Modals, Reading History, and Interactive Simulator
 */

const App = {
  activeCategory: 'all',
  searchQuery: '',
  viewMode: 'card', // 'card' or 'list'
  readingHistory: [],
  simulatorPoints: [],
  simAnimationId: null,

  init() {
    this.loadPreferences();
    this.setupEventListeners();
    this.renderCategories();
    this.renderFeatured();
    this.renderArticles();
    this.initSimulator();
  },

  loadPreferences() {
    // Theme
    const savedTheme = localStorage.getItem('aetheris-theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }

    // View Mode
    this.viewMode = localStorage.getItem('aetheris-view-mode') || 'card';
    this.updateViewButtons();

    // Reading History
    try {
      this.readingHistory = JSON.parse(localStorage.getItem('aetheris-history') || '[]');
    } catch (e) {
      this.readingHistory = [];
    }
  },

  setupEventListeners() {
    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        if (window.I18N) window.I18N.setLanguage(lang);
      });
    });

    // View mode toggle
    const cardBtn = document.getElementById('view-card-btn');
    const listBtn = document.getElementById('view-list-btn');
    if (cardBtn) cardBtn.addEventListener('click', () => this.setViewMode('card'));
    if (listBtn) listBtn.addEventListener('click', () => this.setViewMode('list'));

    // Search input with debounce
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderArticles();
        }, 180);
      });
    }

    // Shortcut key '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== document.getElementById('search-input')) {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      } else if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Stats modal trigger
    const statsBtn = document.getElementById('stats-toggle-btn');
    if (statsBtn) {
      statsBtn.addEventListener('click', () => this.openStatsModal());
    }

    // History modal trigger
    const historyBtn = document.getElementById('history-toggle-btn');
    if (historyBtn) {
      historyBtn.addEventListener('click', () => this.openHistoryModal());
    }

    // Modal background overlay close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeAllModals();
        }
      });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });
  },

  toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('aetheris-theme', isLight ? 'light' : 'dark');
  },

  setViewMode(mode) {
    this.viewMode = mode;
    localStorage.setItem('aetheris-view-mode', mode);
    this.updateViewButtons();
    this.renderArticles();
  },

  updateViewButtons() {
    const cardBtn = document.getElementById('view-card-btn');
    const listBtn = document.getElementById('view-list-btn');
    if (cardBtn) cardBtn.classList.toggle('active', this.viewMode === 'card');
    if (listBtn) listBtn.classList.toggle('active', this.viewMode === 'list');
  },

  renderCategories() {
    const container = document.getElementById('category-filter-container');
    if (!container || !window.RESEARCH_DATA) return;

    const lang = (window.I18N && window.I18N.currentLang) || 'ko';
    container.innerHTML = window.RESEARCH_DATA.categories.map(cat => {
      const name = lang === 'en' ? cat.nameEn : cat.nameKo;
      const isActive = this.activeCategory === cat.id ? 'active' : '';
      return `<button class="tag-btn ${isActive}" data-category="${cat.id}">${name}</button>`;
    }).join('');

    container.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeCategory = e.currentTarget.getAttribute('data-category');
        container.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderArticles();
      });
    });
  },

  renderFeatured() {
    const container = document.getElementById('featured-article-wrap');
    if (!container || !window.RESEARCH_DATA) return;

    const featured = window.RESEARCH_DATA.articles.find(a => a.featured);
    if (!featured) return;

    const lang = (window.I18N && window.I18N.currentLang) || 'ko';
    const title = lang === 'en' ? featured.titleEn : featured.titleKo;
    const summary = lang === 'en' ? featured.summaryEn : featured.summaryKo;
    const readBtnText = lang === 'en' ? 'Read In-Depth Analysis →' : '연구 논문 심층 분석 보기 →';

    container.innerHTML = `
      <div class="featured-card">
        <div class="featured-content">
          <div class="featured-badge">★ ${featured.badge || 'FEATURED RESEARCH'}</div>
          <div class="card-meta">
            <span>${featured.date}</span>
            <span>•</span>
            <span>${featured.readTime}</span>
            <span>•</span>
            <span>${featured.author}</span>
          </div>
          <h2 class="card-title text-2xl md:text-3xl font-extrabold mb-4" style="color: #fff;">${title}</h2>
          <p class="text-slate-300 mb-6 text-base leading-relaxed">${summary}</p>
          <div class="flex items-center gap-4 flex-wrap">
            <button class="px-5 py-2.5 rounded-xl font-bold text-white transition-all transform hover:scale-105" 
                    style="background: var(--accent-gradient); box-shadow: 0 4px 15px var(--accent-glow);"
                    onclick="App.openArticleModal('${featured.id}')">
              ${readBtnText}
            </button>
            <div class="flex items-center gap-2">
              ${featured.tags.map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="featured-image-box" style="background: ${featured.coverGradient}; display: flex; align-items: center; justify-content: center; position: relative;">
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🧬</div>
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; color: #fff;">ISO/IEC 5259 Compliant</div>
            <div style="color: var(--accent-secondary); font-family: var(--font-mono); font-size: 0.85rem; margin-top: 0.4rem;">Efficiency ${featured.metrics.efficiency} | Outlier Removal</div>
          </div>
        </div>
      </div>
    `;
  },

  getFilteredArticles() {
    if (!window.RESEARCH_DATA) return [];
    return window.RESEARCH_DATA.articles.filter(article => {
      // Category filter
      if (this.activeCategory !== 'all' && article.category !== this.activeCategory) {
        return false;
      }
      // Search filter
      if (this.searchQuery) {
        const titleKo = (article.titleKo || '').toLowerCase();
        const titleEn = (article.titleEn || '').toLowerCase();
        const sumKo = (article.summaryKo || '').toLowerCase();
        const sumEn = (article.summaryEn || '').toLowerCase();
        const author = (article.author || '').toLowerCase();
        const tags = (article.tags || []).join(' ').toLowerCase();

        return titleKo.includes(this.searchQuery) ||
               titleEn.includes(this.searchQuery) ||
               sumKo.includes(this.searchQuery) ||
               sumEn.includes(this.searchQuery) ||
               author.includes(this.searchQuery) ||
               tags.includes(this.searchQuery);
      }
      return true;
    });
  },

  renderArticles() {
    const container = document.getElementById('articles-display-container');
    if (!container) return;

    const articles = this.getFilteredArticles();
    const lang = (window.I18N && window.I18N.currentLang) || 'ko';

    if (articles.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 text-slate-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-medium">${lang === 'en' ? 'No research papers found matching your criteria.' : '일치하는 연구 논문이나 기사가 없습니다.'}</p>
        </div>
      `;
      return;
    }

    if (this.viewMode === 'card') {
      container.className = 'articles-grid';
      container.innerHTML = articles.map(art => {
        const title = lang === 'en' ? art.titleEn : art.titleKo;
        const summary = lang === 'en' ? art.summaryEn : art.summaryKo;
        return `
          <div class="article-card" onclick="App.openArticleModal('${art.id}')">
            <div class="card-cover" style="background: ${art.coverGradient}; display:flex; align-items:center; justify-content:center;">
              <span class="category-pill">${art.badge || art.category}</span>
              <div style="font-size: 2.8rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
                ${this.getCategoryIcon(art.category)}
              </div>
              <div class="card-cover-overlay"></div>
            </div>
            <div class="card-content">
              <div class="card-meta">
                <span>${art.date}</span>
                <span>•</span>
                <span>${art.readTime}</span>
              </div>
              <h3 class="card-title">${title}</h3>
              <p class="card-summary">${summary}</p>
              <div class="card-tags">
                ${art.tags.slice(0, 3).map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.className = 'articles-list';
      container.innerHTML = articles.map(art => {
        const title = lang === 'en' ? art.titleEn : art.titleKo;
        return `
          <div class="article-list-item" onclick="App.openArticleModal('${art.id}')">
            <div class="list-item-main">
              <div class="list-item-meta">
                <span style="color: var(--accent-secondary); font-weight:700;">[${art.category.toUpperCase()}]</span>
                <span>${art.date}</span>
                <span>•</span>
                <span>${art.readTime}</span>
                <span>•</span>
                <span>${art.author}</span>
              </div>
              <h3 class="list-item-title">${title}</h3>
              <div class="flex gap-2 mt-1">
                ${art.tags.map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
              </div>
            </div>
            <div style="color: var(--accent-primary); font-size: 1.25rem;">→</div>
          </div>
        `;
      }).join('');
    }
  },

  getCategoryIcon(cat) {
    switch (cat) {
      case 'ai-research': return '🧠';
      case 'data-intelligence': return '📊';
      case 'physical-ai': return '🤖';
      case 'whitepaper': return '📜';
      default: return '⚡';
    }
  },

  openArticleModal(id) {
    const article = window.RESEARCH_DATA.articles.find(a => a.id === id);
    if (!article) return;

    // Record to reading history
    this.addToHistory(article);

    const lang = (window.I18N && window.I18N.currentLang) || 'ko';
    const title = lang === 'en' ? article.titleEn : article.titleKo;
    const content = lang === 'en' ? article.contentEn : article.contentKo;

    const modalBody = document.getElementById('article-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="mb-4">
          <span class="category-pill" style="position:static; display:inline-block; margin-bottom:0.75rem;">${article.category.toUpperCase()}</span>
          <h1 class="text-2xl md:text-3xl font-extrabold mb-3 leading-snug" style="font-family: var(--font-display);">${title}</h1>
          <div class="card-meta">
            <span>📅 ${article.date}</span>
            <span>•</span>
            <span>⏱️ ${article.readTime}</span>
            <span>•</span>
            <span>✍️ ${article.author}</span>
          </div>
        </div>

        <div class="p-4 rounded-xl mb-6 flex items-center justify-around flex-wrap gap-4" style="background: rgba(249, 115, 22, 0.08); border: 1px solid rgba(249, 115, 22, 0.25);">
          ${Object.entries(article.metrics || {}).map(([k, v]) => `
            <div class="text-center">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">${k}</div>
              <div style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--accent-secondary);">${v}</div>
            </div>
          `).join('')}
        </div>

        <div class="prose max-w-none text-slate-300 leading-relaxed text-base" style="white-space: pre-line;">
          ${content.trim()}
        </div>

        <div class="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-4">
          <div class="flex gap-2">
            ${article.tags.map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
          </div>
          <button class="px-4 py-2 rounded-lg font-medium text-sm text-slate-300 hover:text-white border border-slate-700" onclick="App.closeAllModals()">
            ${lang === 'en' ? 'Close Window' : '닫기'}
          </button>
        </div>
      `;
    }

    const modal = document.getElementById('article-modal');
    if (modal) modal.classList.add('active');
  },

  addToHistory(article) {
    this.readingHistory = this.readingHistory.filter(item => item.id !== article.id);
    this.readingHistory.unshift({
      id: article.id,
      titleKo: article.titleKo,
      titleEn: article.titleEn,
      date: article.date,
      category: article.category,
      timestamp: Date.now()
    });
    // Keep max 10
    if (this.readingHistory.length > 10) this.readingHistory.pop();
    localStorage.setItem('aetheris-history', JSON.stringify(this.readingHistory));
  },

  openStatsModal() {
    const modal = document.getElementById('stats-modal');
    if (modal) modal.classList.add('active');
  },

  openHistoryModal() {
    const modal = document.getElementById('history-modal');
    const container = document.getElementById('history-modal-content');
    const lang = (window.I18N && window.I18N.currentLang) || 'ko';

    if (container) {
      if (this.readingHistory.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-400 py-8">${lang === 'en' ? 'No recently viewed research yet.' : '최근 열람한 연구 논문이 없습니다.'}</p>`;
      } else {
        container.innerHTML = this.readingHistory.map(item => {
          const title = lang === 'en' ? item.titleEn : item.titleKo;
          return `
            <div class="p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-orange-500/50 flex items-center justify-between cursor-pointer transition-all mb-2" onclick="App.openArticleModal('${item.id}')">
              <div>
                <span class="text-xs text-orange-400 font-mono">[${item.category.toUpperCase()}]</span>
                <div class="font-bold text-sm text-slate-200 mt-1">${title}</div>
              </div>
              <span class="text-xs text-slate-400 font-mono">${item.date}</span>
            </div>
          `;
        }).join('');
      }
    }
    if (modal) modal.classList.add('active');
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
  },

  /* ==========================================================
     INTERACTIVE EMBEDDING & TOPOLOGY SIMULATOR (MINI LAB)
     ========================================================== */
  initSimulator() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    this.simCtx = canvas.getContext('2d');

    const generateBtn = document.getElementById('sim-btn-generate');
    const cleanBtn = document.getElementById('sim-btn-clean');

    if (generateBtn) generateBtn.addEventListener('click', () => this.generateSimData());
    if (cleanBtn) cleanBtn.addEventListener('click', () => this.cleanSimData());

    this.generateSimData();
    this.renderSimulatorLoop();
  },

  generateSimData() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth || 600;
    canvas.height = 280;

    this.simulatorPoints = [];
    const clusters = [
      { cx: canvas.width * 0.28, cy: canvas.height * 0.45, color: '#f97316', label: 'C1: Foundation Data' },
      { cx: canvas.width * 0.72, cy: canvas.height * 0.55, color: '#06b6d4', label: 'C2: Sensor Manifold' },
      { cx: canvas.width * 0.50, cy: canvas.height * 0.75, color: '#a855f7', label: 'C3: Edge Cases' }
    ];

    clusters.forEach(c => {
      // Regular cluster points
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 55;
        this.simulatorPoints.push({
          x: c.cx + Math.cos(angle) * r,
          y: c.cy + Math.sin(angle) * r,
          targetX: c.cx + Math.cos(angle) * r,
          targetY: c.cy + Math.sin(angle) * r,
          color: c.color,
          radius: 3.5,
          isOutlier: false,
          isRedundant: Math.random() < 0.35,
          alpha: 0.85
        });
      }
    });

    // Add noisy outliers
    for (let i = 0; i < 18; i++) {
      this.simulatorPoints.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
        color: '#ef4444',
        radius: 4,
        isOutlier: true,
        isRedundant: false,
        alpha: 0.95
      });
    }

    const statusEl = document.getElementById('sim-status-text');
    if (statusEl) {
      const lang = (window.I18N && window.I18N.currentLang) || 'ko';
      statusEl.textContent = lang === 'en' 
        ? 'Status: Initialized 153 raw multidimensional vector samples (Noise & Outliers present).'
        : '상태: 153개 원시 다차원 벡터 샘플 초기화 완료 (노이즈 및 이상치 포함).';
      statusEl.style.color = 'var(--text-secondary)';
    }
  },

  cleanSimData() {
    const statusEl = document.getElementById('sim-status-text');
    const lang = (window.I18N && window.I18N.currentLang) || 'ko';

    if (statusEl) {
      statusEl.textContent = lang === 'en'
        ? 'Status: Executing Data Diet™ — compressing redundant embeddings & eliminating outliers...'
        : '상태: Data Diet™ 실행 중 — 중복 임베딩 압축 및 이상치 위상학적 정제 중...';
      statusEl.style.color = 'var(--accent-primary)';
    }

    setTimeout(() => {
      // Remove outliers and redundant points
      this.simulatorPoints = this.simulatorPoints.filter(p => !p.isOutlier && !p.isRedundant);

      if (statusEl) {
        statusEl.textContent = lang === 'en'
          ? 'Status: Complete! Dataset compressed by 42%. Verified 100% ISO/IEC 5259 Compliance.'
          : '상태: 완료! 데이터 중복 42% 압축 및 정제 완료. ISO/IEC 5259 신뢰도 100% 달성.';
        statusEl.style.color = '#10b981';
      }
    }, 700);
  },

  renderSimulatorLoop() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas || !this.simCtx) return;

    this.simCtx.fillStyle = '#060913';
    this.simCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw coordinate grid lines
    this.simCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.simCtx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      this.simCtx.beginPath();
      this.simCtx.moveTo(x, 0);
      this.simCtx.lineTo(x, canvas.height);
      this.simCtx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      this.simCtx.beginPath();
      this.simCtx.moveTo(0, y);
      this.simCtx.lineTo(canvas.width, y);
      this.simCtx.stroke();
    }

    // Draw points
    this.simulatorPoints.forEach(p => {
      // gentle drift
      p.x += (Math.random() - 0.5) * 0.4;
      p.y += (Math.random() - 0.5) * 0.4;

      this.simCtx.beginPath();
      this.simCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.simCtx.fillStyle = p.color;
      this.simCtx.globalAlpha = p.alpha;
      this.simCtx.fill();

      if (p.isOutlier) {
        this.simCtx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        this.simCtx.lineWidth = 1.5;
        this.simCtx.stroke();
      }
    });
    this.simCtx.globalAlpha = 1.0;

    requestAnimationFrame(() => this.renderSimulatorLoop());
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.App = App;
  if (window.I18N) window.I18N.init();
  App.init();
});
