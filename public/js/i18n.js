/**
 * Internationalization (i18n) Module
 * Dynamic bilingual switching between Korean (KO) and English (EN)
 */

const I18N = {
  currentLang: 'ko',

  translations: {
    ko: {
      'brand.tag': 'AI & DATA RESEARCH INSTITUTE',
      'nav.research': '핵심 연구 (Research)',
      'nav.tech': '데이터 기술 (Technology)',
      'nav.simulator': '체험 시뮬레이터 (Simulator)',
      'nav.stats': '연구 통계 (Stats)',
      'nav.contact': '연구 협력 (Contact)',
      'theme.toggle': '테마 전환',
      'history.toggle': '최근 열람 기록',
      'stats.toggle': '연구 성과 통계',

      'hero.badge': 'NEXT-GEN DATA INTELLIGENCE & PHYSICAL AI',
      'hero.title.pre': '보이지 않는 고차원 데이터를 탐구하고,',
      'hero.title.gradient': '측정 가능한 AI의 미래를',
      'hero.title.post': '창조합니다.',
      'hero.desc': 'Aetheris AI는 고차원 임베딩 공간 기하학 분석과 ISO/IEC 5259 표준 AI 데이터 품질 진단, Physical AI 시스템 엔지니어링을 선도하는 딥테크 연구 기업입니다.',
      'hero.cta.primary': '최신 연구 논문 탐색',
      'hero.cta.secondary': '데이터 품질 진단 체험',

      'stats.papers': '발행 논문 & 백서',
      'stats.citations': '총 논문 인용 수',
      'stats.patents': '보유 글로벌 특허',
      'stats.gain': '데이터 효율성 개선율',

      'featured.label': 'HIGHLIGHTED RESEARCH',
      'featured.readMore': '논문 상세 분석 보기 →',

      'search.placeholder': '연구 주제, 알고리즘, 저자, 키워드 검색... (단축키: /)',
      'view.card': '카드 뷰',
      'view.list': '리스트 뷰',

      'sim.badge': 'INTERACTIVE LAB',
      'sim.title': '실시간 고차원 임베딩 & 데이터 품질 진단 시뮬레이터',
      'sim.desc': '브라우저 상에서 데이터 샘플을 생성하고, Aetheris AI의 독자적인 위상 공간 분석 알고리즘이 이상치(Outlier)와 중복(Redundancy)을 실시간으로 감지하는 과정을 확인해보세요.',
      'sim.btn.generate': '새 데이터셋 생성',
      'sim.btn.clean': 'Data Diet™ 정제 실행',
      'sim.status.ready': '상태: 샘플 데이터셋 준비 완료',
      'sim.status.cleaning': '상태: ISO 5259 알고리즘 분석 및 정제 중...',
      'sim.status.done': '상태: 정제 완료 (중복 42% 압축, 벤치마크 신뢰도 99.4%)',

      'modal.close': '닫기',
      'modal.stats.title': '연구소 핵심 성과 및 글로벌 지표',
      'modal.history.title': '최근 열람한 연구 아티클',
      'modal.history.empty': '아직 열람한 아티클이 없습니다. 관심 있는 연구를 클릭해보세요.',

      'footer.corp': 'Aetheris AI Research Inc. All Rights Reserved.',
      'footer.address': '글로벌 본사: 대한민국 경기도 성남시 분당구 판교역로 146 R&D 타워 | 실리콘밸리 연구소: Palo Alto, CA',
      'footer.contact': '기술 협력 & 산학 연구 문의: contact@aetheris.ai | 특허 번호: KR-10-2026-0048291',
      'footer.rights': 'ISO/IEC 5259 준수 AI 데이터 품질 평가 솔루션 공인 연구소'
    },
    en: {
      'brand.tag': 'AI & DATA RESEARCH INSTITUTE',
      'nav.research': 'Research',
      'nav.tech': 'Technology',
      'nav.simulator': 'Simulator',
      'nav.stats': 'Lab Stats',
      'nav.contact': 'Contact',
      'theme.toggle': 'Toggle Theme',
      'history.toggle': 'Reading History',
      'stats.toggle': 'Research Statistics',

      'hero.badge': 'NEXT-GEN DATA INTELLIGENCE & PHYSICAL AI',
      'hero.title.pre': 'Exploring Invisible Data Manifolds,',
      'hero.title.gradient': 'Engineering Tangible AI Futures',
      'hero.title.post': 'with Precision.',
      'hero.desc': 'Aetheris AI is a frontier deep-tech research corporation advancing high-dimensional embedding topology, ISO/IEC 5259 certified data diagnostics, and real-time Physical AI systems.',
      'hero.cta.primary': 'Explore Research Publications',
      'hero.cta.secondary': 'Launch Diagnostic Lab',

      'stats.papers': 'Publications & Papers',
      'stats.citations': 'Global Citations',
      'stats.patents': 'Granted Patents',
      'stats.gain': 'Avg Data Efficiency Gain',

      'featured.label': 'HIGHLIGHTED RESEARCH',
      'featured.readMore': 'Read In-Depth Analysis →',

      'search.placeholder': 'Search topics, algorithms, authors, tags... (Press / to focus)',
      'view.card': 'Card View',
      'view.list': 'List View',

      'sim.badge': 'INTERACTIVE LAB',
      'sim.title': 'Real-Time Embedding Topology & Data Diagnostic Simulator',
      'sim.desc': 'Generate high-dimensional vector clusters in browser and watch Aetheris AI’s manifold analysis algorithm detect outliers and eliminate redundancies in real time.',
      'sim.btn.generate': 'Generate New Dataset',
      'sim.btn.clean': 'Execute Data Diet™',
      'sim.status.ready': 'Status: Sample dataset initialized',
      'sim.status.cleaning': 'Status: Analyzing ISO 5259 manifold curvature...',
      'sim.status.done': 'Status: Optimization complete (Redundancy -42%, Trustworthiness 99.4%)',

      'modal.close': 'Close',
      'modal.stats.title': 'Research Achievements & Global Metrics',
      'modal.history.title': 'Recently Viewed Research Articles',
      'modal.history.empty': 'No recently viewed articles yet. Click on any research paper to view.',

      'footer.corp': 'Aetheris AI Research Inc. All Rights Reserved.',
      'footer.address': 'HQ: Pangyo R&D Tower, Seongnam-si, South Korea | Silicon Valley Lab: Palo Alto, CA',
      'footer.contact': 'Partnerships & Academic Grants: contact@aetheris.ai | Patent Ref: KR-10-2026-0048291',
      'footer.rights': 'ISO/IEC 5259 Certified AI Data Diagnostic & Engineering Institute'
    }
  },

  init() {
    const saved = localStorage.getItem('aetheris-lang') || 'ko';
    this.setLanguage(saved);
  },

  setLanguage(lang) {
    if (!this.translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('aetheris-lang', lang);

    // Update active class on toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (this.translations[lang][key]) {
        el.textContent = this.translations[lang][key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (this.translations[lang][key]) {
        el.setAttribute('placeholder', this.translations[lang][key]);
      }
    });

    // Trigger re-render of articles if App is present
    if (window.App && typeof window.App.renderArticles === 'function') {
      window.App.renderArticles();
      window.App.renderCategories();
    }
  },

  t(key) {
    return this.translations[this.currentLang][key] || key;
  }
};

if (typeof window !== 'undefined') {
  window.I18N = I18N;
}
