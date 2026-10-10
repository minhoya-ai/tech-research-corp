/**
 * Corporate Research & Tech Articles Data Repository
 * Bilingual support (Korean / English)
 */

const RESEARCH_DATA = {
  company: {
    name: "Aetheris AI Research",
    koreanName: "에테리스 인공지능 연구원",
    tagline: "Where Complex Data Intelligence Meets Tangible Impact",
    koreanTagline: "고차원 데이터 인텔리전스를 탐구하고, 측정 가능한 인공지능의 미래를 창조합니다",
    description: "Aetheris AI는 고차원 임베딩 공간 기하학 분석과 ISO/IEC 5259 표준 기반 AI 데이터 품질 진단, Physical AI 시스템 엔지니어링을 선도하는 딥테크 연구기업입니다.",
    email: "research@aetheris.ai",
    location: "판교테크노밸리 글로벌 R&D 센터 & Silicon Valley Lab"
  },

  stats: {
    publications: 48,
    citations: "16,400+",
    patents: 19,
    enterprises: "70+",
    dataQualityGain: "+38.4%",
    modelAccuracyGain: "+14.7%",
    isoStandard: "ISO/IEC 5259 Contributor"
  },

  categories: [
    { id: "all", nameKo: "전체보기", nameEn: "All Topics" },
    { id: "ai-research", nameKo: "AI 기초 연구", nameEn: "AI Foundations" },
    { id: "data-intelligence", nameKo: "데이터 인텔리전스", nameEn: "Data Intelligence" },
    { id: "physical-ai", nameKo: "피지컬 AI & 로보틱스", nameEn: "Physical AI" },
    { id: "whitepaper", nameKo: "기술 백서 & 규제", nameEn: "Whitepapers" }
  ],

  articles: [
    {
      id: "aeth-01",
      category: "data-intelligence",
      featured: true,
      titleKo: "고차원 임베딩 공간 기하학을 활용한 AI 학습 데이터 품질 진단과 다이어트",
      titleEn: "Diagnostic Geometric Analysis & Data Diet in High-Dimensional Embedding Space",
      summaryKo: "방대한 AI 데이터셋에서 중복과 편향을 수학적으로 감지하고, ISO/IEC 5259-2 표준에 부합하는 다양성 및 대표성 지표를 도출하여 모델 학습 효율을 40% 이상 극대화하는 기법을 제안합니다.",
      summaryEn: "A mathematical framework to detect redundancy and bias in massive AI datasets, deriving ISO/IEC 5259-2 compliant diversity and representativeness metrics to boost model training efficiency by over 40%.",
      date: "2026.09.28",
      readTime: "7 min read",
      author: "Dr. Min-Seok Kang, AI Systems Lab",
      tags: ["ISO 5259", "Data Quality", "Embedding Space", "Data Diet"],
      coverGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
      badge: "FEATURED RESEARCH",
      metrics: {
        efficiency: "+42%",
        costReduction: "35%",
        isoCompliance: "100%"
      },
      contentKo: `
### 1. 연구 배경 및 문제 정의
대규모 파운데이션 모델(Foundation Models)의 시대에, 단순한 '데이터 양의 증가'는 기하급수적인 연산 비용과 심각한 오버피팅(Overfitting), 그리고 설명 불가능한 환각(Hallucination) 현상을 야기합니다. 현대 딥러닝 시스템의 핵심 병목은 데이터의 볼륨이 아니라 **데이터의 고유한 표현 품질(Representational Quality)**에 있습니다.

본 연구에서는 고차원 유클리드 및 비유클리드 리만 공간(Riemannian Manifolds)에서 데이터 샘플들이 형성하는 위상수학적 구조를 정밀하게 분석합니다.

### 2. 핵심 방법론: Data Diet™ 알고리즘
- **국소 밀도 편차(Local Density Variance) 측정**: 데이터 군집 내 중복 정보량을 Information Bottleneck 이론에 기반하여 수치화.
- **다양성-대표성 최적화 파레토 프론트(Pareto Front)**: 필수 엣지 케이스(Edge Cases)를 보존하면서 공통 도메인 샘플을 40% 이상 압축.
- **ISO/IEC 5259-2 표준 지표 자동 도출**: 유사성, 완전성, 균형성 지수를 수학적으로 증명 가능한 보고서로 자동 생성.

### 3. 실증 결과
자율주행 비전 모델 및 LLM 사전학습 코퍼스에 적용한 결과, 데이터셋 크기를 38% 감축하면서도 제로샷 벤치마크 점수는 오히려 2.4%p 상승함을 검증하였습니다.
      `,
      contentEn: `
### 1. Background & Problem Definition
In the era of foundation models, sheer data volume leads to exponential compute costs and severe overfitting. The true bottleneck is not volume, but representational quality.

### 2. Core Methodology: Data Diet™
- Local Density Variance Measurement based on Information Bottleneck theory.
- Diversity-Representativeness Pareto Optimization preserving critical edge cases.
- Automated ISO/IEC 5259-2 compliance metrics calculation.

### 3. Empirical Results
Demonstrated a 38% dataset size reduction with a 2.4%p zero-shot benchmark increase across autonomous driving and LLM pretraining tasks.
      `
    },
    {
      id: "aeth-02",
      category: "ai-research",
      featured: true,
      titleKo: "다단계 추론 언어모델의 잠재공간 정렬과 환각 억제 메커니즘",
      titleEn: "Latent Space Alignment & Hallucination Suppression in Multi-Step Reasoning LLMs",
      summaryKo: "복잡한 수리 및 논리 추론 과정에서 발생하는 누적 오차를 억제하기 위해, 모델의 중간 잔차 스트림(Residual Stream)을 실시간 모니터링하고 능동적으로 가이던스를 주입하는 인터벤션 프레임워크를 공개합니다.",
      summaryEn: "An active representation intervention framework that monitors intermediate residual streams in real-time to suppress accumulated reasoning errors in complex mathematical and logical deductions.",
      date: "2026.09.15",
      readTime: "9 min read",
      author: "Elena Rostova, Cognitive AI Team",
      tags: ["Reasoning Models", "Latent Intervention", "Hallucination Control", "Transformers"],
      coverGradient: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
      badge: "BEST PAPER SOTA",
      metrics: {
        accuracy: "94.2%",
        hallucinationDrop: "-68%",
        latencyCost: "+3.2%"
      },
      contentKo: `
### 1. 추론 궤적에서의 엔트로피 발산 문제
Chain-of-Thought(CoT) 및 심층 추론(Deep Reasoning) 과정에서, 중간 토큰의 사소한 확률적 편향이 이후 추론 궤적 전체를 붕괴시키는 오류 연쇄가 발생합니다.

### 2. 잔차 스트림 프로빙(Probing) 및 제어
연구팀은 추론 레이어마다 지식 신뢰도 벡터를 투영하는 **Aether-Steer** 아키텍처를 도입했습니다. 진위 판단 경계면을 벗어나는 즉시 어텐션 가중치에 제약 조건을 인가하여 모델 스스로 오류를 되짚어보도록 유도합니다.

### 3. 결과 및 오픈 벤치마크
GSM8K 및 MATH-500 벤치마크에서 기준 모델 대비 환각 발생 빈도가 68% 감소하였으며, 추론 속도 저하는 3.2% 미만으로 억제되었습니다.
      `,
      contentEn: `
### 1. Entropy Divergence in Reasoning Trajectories
Minor stochastic errors in intermediate tokens cascade into complete failures during deep Chain-of-Thought deductions.

### 2. Residual Stream Probing
We propose **Aether-Steer**, dynamically projecting truthfulness vectors across layers to enforce self-correction before token commitment.
      `
    },
    {
      id: "aeth-03",
      category: "physical-ai",
      featured: false,
      titleKo: "물리 세계와 결합하는 Physical AI: 멀티모달 센서 퓨전과 실시간 세계 모델",
      titleEn: "Physical AI at the Frontier: Multimodal Sensor Fusion & Real-Time World Models",
      summaryKo: "자율 로봇과 휴머노이드가 현실 공간의 물리 법칙을 직관적으로 이해하고 제어할 수 있도록, 초지연 10ms 이하로 세계의 변화를 예측하는 3D 가우시안 스플래팅 기반 신경망 아키텍처를 구축했습니다.",
      summaryEn: "Building a sub-10ms neural world model leveraging 3D Gaussian Splatting for humanoid robotics to intuitively predict and manipulate physical environments.",
      date: "2026.08.30",
      readTime: "6 min read",
      author: "Tae-Yang Park, Robotics & World Models Group",
      tags: ["Physical AI", "World Models", "Robotics", "3D Gaussian"],
      coverGradient: "linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)",
      badge: "ROBOTICS BREAKTHROUGH",
      metrics: {
        latency: "8.4ms",
        physicsFidelity: "98.7%",
        sim2realSuccess: "91.2%"
      },
      contentKo: `
### 1. Physical AI의 도전 과제
텍스트/이미지만 다루는 가상 AI와 달리, 로봇은 중력, 마찰력, 충돌 등 물리 법칙의 즉각적인 반작용을 실시간으로 감지하고 대응해야 합니다.

### 2. 4D 시공간 신경망 아키텍처
LiDAR, 고속 RGB 카메라, IMU 센서 데이터를 융합하여 3차원 공간 복원과 미래 0.5초 예측을 8.4ms 주기로 렌더링하는 통합 파이프라인을 완성했습니다.
      `,
      contentEn: `
### 1. Real-World Physical Challenges
Physical AI demands instantaneous reaction to friction, mass, and kinetic forces in high-stakes robotic environments.
      `
    },
    {
      id: "aeth-04",
      category: "data-intelligence",
      featured: false,
      titleKo: "물리 기반 합성 데이터(Synthetic Data) 생성과 도메인 갭 해소 전략",
      titleEn: "Physics-Grounded Synthetic Data Generation & Domain Gap Closing",
      summaryKo: "실제 수집이 불가능한 극한 환경(Severe Weather, 공장 화재, 희귀 질환 등)의 희귀 데이터를 물리 법칙 기반 시뮬레이터와 확산 모델(Diffusion)의 결합을 통해 무손실 생성하는 기술입니다.",
      summaryEn: "Generating ultra-realistic edge-case datasets for extreme conditions by bridging physics simulators and latent diffusion architectures without domain shift.",
      date: "2026.08.12",
      readTime: "8 min read",
      author: "Hye-Jin Choi, Synthetic Data Lab",
      tags: ["Synthetic Data", "Generative AI", "Domain Adaptation", "Edge Cases"],
      coverGradient: "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
      badge: "DATA BULK-UP",
      metrics: {
        dataExpansion: "10x",
        domainShiftLoss: "< 1.8%",
        labelingCost: "-85%"
      },
      contentKo: `
### 1. 엣지 케이스 데이터의 부재
제조 결함이나 자율주행의 돌발 위기 상황은 현실에서 직접 데이터를 대량 수집하기 어렵습니다.

### 2. Data Bulk-up™ 합성 엔진
렌더링 엔진의 정밀한 3D 기하학 좌표계와 생성형 AI의 사실적 텍스처 합성을 결합하여 완벽히 라벨링된 합성 데이터 수억 장을 단 수 시간 내에 생성합니다.
      `,
      contentEn: `
### 1. Rarity of High-Risk Scenarios
Gathering edge cases in real life is dangerous and expensive. Our synthetic pipeline generates billions of photorealistic, pre-labeled frames with zero human labeling error.
      `
    },
    {
      id: "aeth-05",
      category: "ai-research",
      featured: false,
      titleKo: "고차원 데이터 공간 시각화 엔진: PebbloScope 모티브와 차원 축소의 진화",
      titleEn: "Next-Gen Data Space Visualizer: High-Dimensional Manifold Mapping",
      summaryKo: "수천 차원의 임베딩 벡터를 정보 손실 없이 3차원 대화형 공간으로 사영하여, 데이터 엔지니어가 데이터셋의 불균형과 이상치를 육안으로 즉시 식별할 수 있는 시각화 아키텍처를 제시합니다.",
      summaryEn: "Projecting thousands of embedding dimensions into an interactive 3D topology without losing local structure, enabling engineers to pinpoint anomalies in real time.",
      date: "2026.07.25",
      readTime: "5 min read",
      author: "Sang-Hoon Lee, Visualization Engine Team",
      tags: ["Visualization", "t-SNE / UMAP", "Embedding Map", "Data Observability"],
      coverGradient: "linear-gradient(135deg, #311042 0%, #4c1d95 50%, #6d28d9 100%)",
      badge: "EXPLORER TOOL",
      metrics: {
        renderSpeed: "60 FPS (1M pts)",
        dimensionRatio: "4096d -> 3d",
        clusterPurity: "96.4%"
      },
      contentKo: `
### 1. 보이지 않는 데이터를 만질 수 있는 형태로
데이터의 이상치(Outlier)나 클래스 중복은 표 형식이나 통계 요약치만으로는 파악하기 어렵습니다.

### 2. WebGL/WebGPU 기반 초고속 렌더링
100만 개 이상의 고차원 데이터 포인트를 웹 브라우저에서 60 FPS로 탐색할 수 있는 GPU 가속 프로젝션 알고리즘을 개발하였습니다.
      `,
      contentEn: `
### 1. Making Invisible Data Tangible
Tabular metrics fail to reveal manifold fractures. Our WebGPU shader engine delivers real-time cluster manipulation at 60 FPS.
      `
    },
    {
      id: "aeth-06",
      category: "whitepaper",
      featured: false,
      titleKo: "EU AI Act 및 글로벌 인공지능 신뢰성 규제 대응 기술 백서 (2026년판)",
      titleEn: "Technical Whitepaper: EU AI Act & Global AI Trustworthiness Compliance (2026)",
      summaryKo: "고위험(High-Risk) AI 시스템에 부과되는 엄격한 데이터 거버넌스 및 품질 검증 의무를 기술적으로 어떻게 충족할 것인가에 대한 실무적 가이드와 체크리스트를 총망라합니다.",
      summaryEn: "A comprehensive technical compliance blueprint for enterprise AI teams navigating mandatory data governance, safety audits, and ISO/IEC 5259 certification requirements.",
      date: "2026.07.02",
      readTime: "12 min read",
      author: "Regulatory Intelligence & Strategy Office",
      tags: ["EU AI Act", "Governance", "Trustworthy AI", "ISO Standards"],
      coverGradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)",
      badge: "REGULATORY WHITEPAPER",
      metrics: {
        riskCoverage: "100%",
        auditTime: "-70%",
        certificationRate: "99.1%"
      },
      contentKo: `
### 1. 고위험 AI 규제 시대의 개막
2026년부터 전면 시행되는 EU AI Act와 글로벌 규제는 데이터 편향과 품질 미달에 대해 막대한 과징금을 부과합니다.

### 2. 기술적 해결책: 정량적 품질 증명
인공지능 모델 자체보다 모델을 학습시킨 데이터의 품질 증명서가 비즈니스 성패를 가릅니다. 본 백서는 ISO 5259 측정 지표의 감사 대응 방안을 제시합니다.
      `,
      contentEn: `
### 1. High-Risk AI Mandates
Auditable data governance is no longer optional. This report outlines automated compliance metrics to guarantee continuous regulatory clearance.
      `
    }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.RESEARCH_DATA = RESEARCH_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RESEARCH_DATA;
}
