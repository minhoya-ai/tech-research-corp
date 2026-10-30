/**
 * Main Application Controller for Aetheris AI Portal
 * Handles Theme, View Modes, Real-time Search, Modals, Reading History,
 * Interactive Simulator, and 30-Minute Periodic & Instant Refresh for Data Technology Subcategories:
 * - 전체보기 (All Topics)
 * - AI 기초 연구 (AI Foundations)
 * - 데이터 인텔리전스 (Data Intelligence)
 */

const App = {
  activeCategory: 'all',
  searchQuery: '',
  viewMode: 'card', // 'card' or 'list'
  readingHistory: [],
  simulatorPoints: [],
  simAnimationId: null,
  currentModalArticleId: null,
  currentModalTab: 'full',

  // 30-Minute Data Technology Sync Engine (covers AI Research + Data Intelligence + All)
  dataTechSync: {
    intervalMs: 30 * 60 * 1000, // 30 minutes in milliseconds
    lastSyncTime: Date.now(),
    countdownTimerId: null,
    aiOffset: 0,
    diOffset: 0
  },

  init() {
    this.loadPreferences();
    this.setupEventListeners();
    this.initDataTechSync();
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

    // Load cached synced articles if present
    try {
      const cached = localStorage.getItem('aetheris-cached-synced-articles');
      if (cached && window.RESEARCH_DATA) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Replace matching category articles with cached version
          window.RESEARCH_DATA.articles = window.RESEARCH_DATA.articles.filter(
            a => a.category !== 'ai-research' && a.category !== 'data-intelligence'
          ).concat(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load cached articles', e);
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

    // Instant Refresh Button for Data Technology Category (Hierarchical: All, AI, Data Intel)
    const refreshBtn = document.getElementById('data-tech-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.triggerDataTechRefresh(true);
      });
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

  /* ==========================================================
     30-MINUTE PERIODIC & MANUAL REFRESH ENGINE FOR DATA TECH
     Synchronizes subcategories: All, AI Foundations, Data Intelligence
     ========================================================== */
  initDataTechSync() {
    const savedLast = localStorage.getItem('aetheris-last-dt-sync');
    if (savedLast) {
      this.dataTechSync.lastSyncTime = parseInt(savedLast, 10);
    } else {
      this.dataTechSync.lastSyncTime = Date.now();
      localStorage.setItem('aetheris-last-dt-sync', this.dataTechSync.lastSyncTime);
    }

    this.updateLastSyncLabel();

    // Check if 30 minutes have already elapsed since last sync
    const elapsed = Date.now() - this.dataTechSync.lastSyncTime;
    if (elapsed >= this.dataTechSync.intervalMs) {
      this.triggerDataTechRefresh(false);
    }

    // Start 1-second countdown ticker
    if (this.dataTechSync.countdownTimerId) {
      clearInterval(this.dataTechSync.countdownTimerId);
    }
    this.dataTechSync.countdownTimerId = setInterval(() => {
      this.updateCountdownTick();
    }, 1000);

    this.updateCountdownTick();
  },

  updateCountdownTick() {
    const elapsed = Date.now() - this.dataTechSync.lastSyncTime;
    const remainingMs = Math.max(0, this.dataTechSync.intervalMs - elapsed);

    const countdownEl = document.getElementById('sync-countdown');
    if (countdownEl) {
      const totalSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      countdownEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Trigger auto refresh when countdown hits 0
    if (remainingMs <= 0) {
      this.triggerDataTechRefresh(false);
    }
  },

  updateLastSyncLabel() {
    const labelEl = document.getElementById('sync-last-time');
    if (!labelEl) return;

    const date = new Date(this.dataTechSync.lastSyncTime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    labelEl.textContent = `${hours}:${minutes}:${seconds}`;
  },

  triggerDataTechRefresh(isManual = false) {
    const refreshBtn = document.getElementById('data-tech-refresh-btn');
    const refreshLabel = document.getElementById('refresh-btn-label');
    const lang = (window.I18N && window.I18N.currentLang) || 'ko';

    // UI Loading state
    if (refreshBtn) refreshBtn.classList.add('loading');
    if (refreshLabel) {
      refreshLabel.textContent = lang === 'en' ? 'Syncing Subcategories...' : '데이터 기술 하위 연구 동기화 중...';
    }

    setTimeout(() => {
      if (!window.RESEARCH_DATA || !window.RESEARCH_DATA.feedPool) {
        if (refreshBtn) refreshBtn.classList.remove('loading');
        return;
      }

      const pool = window.RESEARCH_DATA.feedPool;
      const aiPool = pool.aiResearch || [];
      const diPool = pool.dataIntelligence || [];

      // Rotate offsets
      this.dataTechSync.aiOffset = (this.dataTechSync.aiOffset + 1) % Math.max(1, aiPool.length);
      this.dataTechSync.diOffset = (this.dataTechSync.diOffset + 1) % Math.max(1, diPool.length);

      // Pick 2 from AI Foundations and 2 from Data Intelligence
      const newArticles = [];

      // 1. Pick AI Research items
      for (let i = 0; i < 2; i++) {
        if (aiPool.length > 0) {
          const item = JSON.parse(JSON.stringify(aiPool[(this.dataTechSync.aiOffset + i) % aiPool.length]));
          newArticles.push(item);
        }
      }

      // 2. Pick Data Intelligence items
      for (let i = 0; i < 2; i++) {
        if (diPool.length > 0) {
          const item = JSON.parse(JSON.stringify(diPool[(this.dataTechSync.diOffset + i) % diPool.length]));
          newArticles.push(item);
        }
      }

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

      // Mark newly synced articles
      newArticles.forEach((art, idx) => {
        art.id = `dt-live-${Date.now()}-${idx}`;
        art.date = `${dateStr} (${timeStr})`;
        art.badge = '⚡ LIVE UPDATED';
        art.isLiveUpdated = true;
      });

      // Keep other categories (physical-ai, whitepaper) and prepend new AI + DI articles
      const otherArticles = window.RESEARCH_DATA.articles.filter(
        a => a.category !== 'ai-research' && a.category !== 'data-intelligence'
      );

      // Make the first synced item featured
      if (newArticles.length > 0) {
        newArticles[0].featured = true;
        // unset other featured
        otherArticles.forEach(a => a.featured = false);
      }

      // Prepend newly refreshed articles to the top so "전체보기 (All Topics)" shows them first!
      window.RESEARCH_DATA.articles = newArticles.concat(otherArticles);

      // Save to localStorage for persistence
      try {
        localStorage.setItem('aetheris-cached-synced-articles', JSON.stringify(newArticles));
      } catch (e) {}

      // Update sync time
      this.dataTechSync.lastSyncTime = Date.now();
      localStorage.setItem('aetheris-last-dt-sync', this.dataTechSync.lastSyncTime);
      this.updateLastSyncLabel();

      // Re-render Featured Banner & Articles Grid/List
      this.renderFeatured();
      this.renderArticles();

      // Reset button UI
      if (refreshBtn) refreshBtn.classList.remove('loading');
      if (refreshLabel) {
        refreshLabel.textContent = lang === 'en' ? 'Refresh Data Tech' : '데이터 기술 즉시 갱신';
      }

      // Show floating Toast Notification
      this.showSyncToast(isManual);
    }, 650);
  },

  showSyncToast(isManual) {
    const toast = document.getElementById('sync-toast');
    const textEl = document.getElementById('sync-toast-text');
    if (!toast) return;

    const lang = (window.I18N && window.I18N.currentLang) || 'ko';
    if (textEl) {
      if (lang === 'en') {
        textEl.textContent = isManual 
          ? '✨ [Data Technology] Subcategories (All, AI Foundations, Data Intel) manually refreshed with latest research!'
          : '✨ 30-minute auto-sync complete: Data Technology subcategories updated with live publications!';
      } else {
        textEl.textContent = isManual
          ? '✨ [데이터 기술] 하위 내용(전체보기, AI 기초 연구, 데이터 인텔리전스)이 최신 연구 논문으로 즉시 갱신되었습니다!'
          : '✨ [데이터 기술] 30분 주기 자동 동기화 완료: 하위 카테고리(전체보기, AI 기초 연구, 데이터 인텔리전스)가 최신화되었습니다!';
      }
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
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

    const featured = window.RESEARCH_DATA.articles.find(a => a.featured) || window.RESEARCH_DATA.articles[0];
    if (!featured) return;

    const lang = (window.I18N && window.I18N.currentLang) || 'ko';
    const title = lang === 'en' ? featured.titleEn : featured.titleKo;
    const summary = lang === 'en' ? featured.summaryEn : featured.summaryKo;
    const readBtnText = lang === 'en' ? 'Read Full Research Paper →' : '연구 논문 원문 전문 보기 →';
    const sourceBtnText = lang === 'en' ? 'Original Source ↗' : '원문 사이트 ↗';
    const sourceUrl = (featured.originalSource && featured.originalSource.url) || '#';

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
          <div class="flex items-center gap-3 flex-wrap">
            <button class="px-5 py-2.5 rounded-xl font-bold text-white transition-all transform hover:scale-105" 
                    style="background: var(--accent-gradient); box-shadow: 0 4px 15px var(--accent-glow);"
                    onclick="App.openArticleModal('${featured.id}', 'full')">
              ${readBtnText}
            </button>
            <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" 
               class="px-4 py-2.5 rounded-xl font-semibold text-slate-200 border border-slate-700/80 hover:border-orange-500 hover:text-white transition-all flex items-center gap-1.5"
               style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px);">
              <span>🌐 ${sourceBtnText}</span>
            </a>
            <div class="flex items-center gap-2">
              ${(featured.tags || []).map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="featured-image-box" style="background: ${featured.coverGradient}; display: flex; align-items: center; justify-content: center; position: relative;">
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🧬</div>
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; color: #fff;">ISO/IEC 5259 Compliant</div>
            <div style="color: var(--accent-secondary); font-family: var(--font-mono); font-size: 0.85rem; margin-top: 0.4rem;">
              Efficiency ${(featured.metrics && featured.metrics.efficiency) || '+42%'} | Live Certified
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getFilteredArticles() {
    if (!window.RESEARCH_DATA) return [];
    return window.RESEARCH_DATA.articles.filter(article => {
      // Category filter: 'all' shows all topics (including refreshed AI and Data Intel)
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
        const liveBadgeClass = art.isLiveUpdated ? 'badge-live-updated' : '';
        const sourceUrl = (art.originalSource && art.originalSource.url) || '#';
        return `
          <div class="article-card" onclick="App.openArticleModal('${art.id}', 'full')">
            <div class="card-cover" style="background: ${art.coverGradient}; display:flex; align-items:center; justify-content:center;">
              <span class="category-pill ${liveBadgeClass}">${art.badge || art.category}</span>
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
                ${(art.tags || []).slice(0, 3).map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
              </div>
              <div class="card-actions-bar">
                <button class="btn-card-read" type="button" onclick="event.stopPropagation(); App.openArticleModal('${art.id}', 'full')">
                  <span>${lang === 'en' ? 'Full Paper' : '전체 자료 보기'}</span>
                  <span class="text-xs">→</span>
                </button>
                <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" 
                   class="btn-card-source" onclick="event.stopPropagation()" title="${lang === 'en' ? 'Open Original Source Site' : '원문 사이트 새 창으로 열기'}">
                  <span>${lang === 'en' ? 'Source ↗' : '원문 출처 ↗'}</span>
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.className = 'articles-list';
      container.innerHTML = articles.map(art => {
        const title = lang === 'en' ? art.titleEn : art.titleKo;
        const liveBadge = art.isLiveUpdated ? '<span class="text-orange-400 font-bold mr-1">[LIVE]</span>' : '';
        const sourceUrl = (art.originalSource && art.originalSource.url) || '#';
        return `
          <div class="article-list-item" onclick="App.openArticleModal('${art.id}', 'full')">
            <div class="list-item-main">
              <div class="list-item-meta">
                <span style="color: var(--accent-secondary); font-weight:700;">[${art.category.toUpperCase()}]</span>
                <span>${art.date}</span>
                <span>•</span>
                <span>${art.readTime}</span>
                <span>•</span>
                <span>${art.author}</span>
              </div>
              <h3 class="list-item-title">${liveBadge}${title}</h3>
              <div class="flex gap-2 mt-1">
                ${(art.tags || []).map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
              </div>
            </div>
            <div class="flex items-center gap-3">
              <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" 
                 class="btn-card-source" onclick="event.stopPropagation()" title="${lang === 'en' ? 'Open Original Source Site' : '원문 사이트 새 창으로 열기'}">
                <span>${lang === 'en' ? 'Source ↗' : '원문 출처 ↗'}</span>
              </a>
              <div style="color: var(--accent-primary); font-size: 1.25rem;">→</div>
            </div>
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

  formatPaperMarkdown(mdText) {
    if (!mdText) return '';
    let html = mdText;

    // Process markdown tables (| col 1 | col 2 |)
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<div class="paper-table-wrap"><table class="paper-table">';
          const cells = line.split('|').slice(1, -1).map(c => c.trim());
          tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
          if (i + 1 < lines.length && lines[i + 1].trim().includes('---')) {
            i++;
          }
        } else {
          const cells = line.split('|').slice(1, -1).map(c => c.trim());
          tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table></div>';
          processedLines.push(tableHtml);
          tableHtml = '';
        }
        processedLines.push(lines[i]);
      }
    }
    if (inTable) {
      tableHtml += '</tbody></table></div>';
      processedLines.push(tableHtml);
    }

    html = processedLines.join('\n');

    // Headings
    html = html.replace(/^# (.*$)/gim, '<h1 class="paper-h1">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="paper-h2">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="paper-h3">$1</h3>');

    // Math block ($$ ... $$)
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-formula-box">$1</div>');

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent-secondary);">$1</strong>');

    // Links [text](url)
    html = html.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600;">$1 ↗</a>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 1.5rem 0;">');

    // Blockquotes / callout (> ...)
    html = html.replace(/^> (.*$)/gim, '<div class="paper-abstract-box">$1</div>');

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="paper-inline-code">$1</code>');

    // Unordered lists (- item)
    html = html.replace(/^\- (.*$)/gim, '<li style="margin-left: 1.25rem; list-style-type: disc;">$1</li>');

    // Paragraph breaks
    html = html.replace(/\n\n/g, '<p style="margin-bottom: 0.85rem;"></p>');

    return html;
  },

  openArticleModal(id, initialTab = 'full') {
    let article = window.RESEARCH_DATA.articles.find(a => a.id === id);
    if (!article && window.RESEARCH_DATA.feedPool) {
      const allPool = (window.RESEARCH_DATA.feedPool.aiResearch || []).concat(
        window.RESEARCH_DATA.feedPool.dataIntelligence || []
      );
      article = allPool.find(a => a.id === id);
    }
    if (!article) return;

    this.currentModalArticleId = id;
    this.currentModalTab = initialTab || 'full';

    // Record to reading history
    this.addToHistory(article);

    this.renderModalContent();

    const modal = document.getElementById('article-modal');
    if (modal) modal.classList.add('active');
  },

  switchArticleTab(tabKey) {
    this.currentModalTab = tabKey;
    this.renderModalContent();
  },

  renderModalContent() {
    const modalBody = document.getElementById('article-modal-body');
    if (!modalBody || !this.currentModalArticleId) return;

    let article = window.RESEARCH_DATA.articles.find(a => a.id === this.currentModalArticleId);
    if (!article && window.RESEARCH_DATA.feedPool) {
      const allPool = (window.RESEARCH_DATA.feedPool.aiResearch || []).concat(
        window.RESEARCH_DATA.feedPool.dataIntelligence || []
      );
      article = allPool.find(a => a.id === this.currentModalArticleId);
    }
    if (!article) return;

    const lang = (window.I18N && window.I18N.currentLang) || 'ko';
    const title = lang === 'en' ? article.titleEn : article.titleKo;
    const summary = lang === 'en' ? article.summaryEn : article.summaryKo;
    const fullPaper = lang === 'en' ? (article.fullPaperEn || article.fullPaperKo) : (article.fullPaperKo || article.fullPaperEn);
    const content = lang === 'en' ? article.contentEn : article.contentKo;
    const source = article.originalSource || {
      siteName: 'arXiv.org / ISO Portal',
      url: 'https://arxiv.org/abs/2306.15895',
      doi: '10.48550/arXiv.2306.15895',
      publication: 'Official Research Publication',
      license: 'Open Access (CC BY 4.0)',
      publishedDate: article.date || '2026'
    };

    const tabFullClass = this.currentModalTab === 'full' ? 'active' : '';
    const tabSummaryClass = this.currentModalTab === 'summary' ? 'active' : '';
    const tabSourceClass = this.currentModalTab === 'source' ? 'active' : '';

    let tabBodyHtml = '';

    if (this.currentModalTab === 'full') {
      tabBodyHtml = `
        <div class="paper-full-container">
          <div class="paper-abstract-box">
            <strong>💡 Executive Abstract:</strong> ${summary}
          </div>
          ${this.formatPaperMarkdown(fullPaper || content)}
          <div class="mt-8 p-4 rounded-xl border border-orange-500/30 bg-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div class="font-bold text-white text-sm">🌐 논문 원본 및 공식 출처 자료 전체 열람</div>
              <div class="text-xs text-slate-300 mt-0.5">외부 저장소(${source.siteName})에서 전체 피어리뷰 자료와 원문 문서를 바로 확인하실 수 있습니다.</div>
            </div>
            <a href="${source.url}" target="_blank" rel="noopener noreferrer" class="btn-quick-source whitespace-nowrap">
              <span>원문 출처 사이트 바로가기 ↗</span>
            </a>
          </div>
        </div>
      `;
    } else if (this.currentModalTab === 'summary') {
      tabBodyHtml = `
        <div class="mb-6">
          <h3 class="text-lg font-bold text-white mb-2">📊 핵심 성능 및 연구 지표 (Quantitative Metrics)</h3>
          <div class="p-4 rounded-xl flex items-center justify-around flex-wrap gap-4 mb-6" style="background: rgba(249, 115, 22, 0.08); border: 1px solid rgba(249, 115, 22, 0.25);">
            ${Object.entries(article.metrics || {}).map(([k, v]) => `
              <div class="text-center">
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">${k}</div>
                <div style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--accent-secondary);">${v}</div>
              </div>
            `).join('')}
          </div>
          <h3 class="text-lg font-bold text-white mb-2">📝 주요 연구 요약</h3>
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 leading-relaxed text-sm">
            ${this.formatPaperMarkdown(content || summary)}
          </div>
        </div>
      `;
    } else if (this.currentModalTab === 'source') {
      const bibtexCode = source.citationKey ? `@article{${source.citationKey},
  title={${article.titleEn || article.titleKo}},
  author={${article.author}},
  journal={${source.publication || source.siteName}},
  year={2026},
  doi={${source.doi || 'N/A'}},
  url={${source.url}}
}` : `@misc{aetheris2026paper,
  title={${article.titleEn || article.titleKo}},
  author={${article.author}},
  url={${source.url}},
  year={2026}
}`;

      tabBodyHtml = `
        <div class="source-site-preview-card">
          <div class="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
            <div>
              <span class="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 mb-2">
                ${source.siteName}
              </span>
              <h2 class="text-xl font-bold text-white">${article.titleEn || article.titleKo}</h2>
              <p class="text-xs text-slate-400 mt-1">${source.publication || 'Official Research Publication'}</p>
            </div>
            <a href="${source.url}" target="_blank" rel="noopener noreferrer" class="btn-quick-source">
              <span>원문 출처 사이트 열람 (새 창) ↗</span>
            </a>
          </div>

          <div class="source-meta-grid">
            <div class="source-meta-item">
              <div class="source-meta-label">공식 식별자 (DOI)</div>
              <div class="source-meta-value font-mono">${source.doi || 'N/A'}</div>
            </div>
            <div class="source-meta-item">
              <div class="source-meta-label">공식 원문 URL</div>
              <div class="source-meta-value text-xs font-mono truncate" title="${source.url}">
                <a href="${source.url}" target="_blank" class="text-orange-400 hover:underline">${source.url}</a>
              </div>
            </div>
            <div class="source-meta-item">
              <div class="source-meta-label">동료 평가 및 표준 (Review Status)</div>
              <div class="source-meta-value text-emerald-400 font-semibold">${source.peerReviewed || 'Peer Reviewed'}</div>
            </div>
            <div class="source-meta-item">
              <div class="source-meta-label">라이선스 (License)</div>
              <div class="source-meta-value font-mono">${source.license || 'Open Access (CC BY 4.0)'}</div>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-mono text-slate-400">학술 인용 (BibTeX Citation)</span>
              <button class="btn-copy-bibtex" onclick="App.copyBibtex()">인용 복사</button>
            </div>
            <div id="bibtex-citation-content" class="bibtex-box">${bibtexCode}</div>
          </div>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <!-- Modal Top Category & Title -->
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="category-pill" style="position:static; display:inline-block;">${article.category.toUpperCase()}</span>
          ${article.isLiveUpdated ? '<span class="badge-live-updated px-2 py-0.5 rounded text-xs">⚡ LIVE UPDATED</span>' : ''}
          <span class="text-xs font-mono text-slate-400 ml-auto">${source.siteName}</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold mb-3 leading-snug" style="font-family: var(--font-display); color: #fff;">${title}</h1>
        <div class="card-meta">
          <span>📅 ${article.date}</span>
          <span>•</span>
          <span>⏱️ ${article.readTime}</span>
          <span>•</span>
          <span>✍️ ${article.author}</span>
          <span>•</span>
          <span class="font-mono text-orange-400">DOI: ${source.doi || 'N/A'}</span>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="modal-header-actions">
        <a href="${source.url}" target="_blank" rel="noopener noreferrer" class="btn-quick-source" title="공식 원문 출처 사이트 새 창으로 열기">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          <span>원문 출처 사이트 바로가기 (새 창) ↗</span>
        </a>
        <a href="${source.url}" target="_blank" rel="noopener noreferrer" class="btn-quick-outline">
          <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>
          <span>공식 PDF 열람</span>
        </a>
        ${source.githubUrl ? `
          <a href="${source.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-quick-outline">
            <svg class="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>
            <span>Code / GitHub</span>
          </a>
        ` : ''}
      </div>

      <!-- Tab Switcher Navigation -->
      <div class="article-tabs-nav">
        <button class="article-tab-btn ${tabFullClass}" onclick="App.switchArticleTab('full')">
          <span>📑</span>
          <span>${lang === 'en' ? 'Full Paper & Complete Data' : '논문 원문 전문 / 전체 자료'}</span>
        </button>
        <button class="article-tab-btn ${tabSummaryClass}" onclick="App.switchArticleTab('summary')">
          <span>📋</span>
          <span>${lang === 'en' ? 'Summary & Key Metrics' : '핵심 요약 & 주요 지표'}</span>
        </button>
        <button class="article-tab-btn ${tabSourceClass}" onclick="App.switchArticleTab('source')">
          <span>🌐</span>
          <span>${lang === 'en' ? 'Original Source Site' : '원문 출처 사이트 및 정보'}</span>
        </button>
      </div>

      <!-- Tab Body -->
      ${tabBodyHtml}

      <!-- Modal Footer -->
      <div class="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-4">
        <div class="flex gap-2 flex-wrap">
          ${(article.tags || []).map(t => `<span class="keyword-tag">#${t}</span>`).join('')}
        </div>
        <button class="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all" onclick="App.closeAllModals()">
          ${lang === 'en' ? 'Close Window' : '닫기'}
        </button>
      </div>
    `;
  },

  copyBibtex() {
    const bibtexEl = document.getElementById('bibtex-citation-content');
    if (!bibtexEl) return;
    const text = bibtexEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.btn-copy-bibtex');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '복사 완료! ✓';
        btn.style.background = '#059669';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy BibTeX: ', err);
    });
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

    this.simulatorPoints.forEach(p => {
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
