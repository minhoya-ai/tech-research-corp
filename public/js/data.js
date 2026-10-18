/**
 * Corporate Research & Tech Articles Data Repository
 * Bilingual support (Korean / English)
 * 
 * Supports hierarchical Data Technology categories:
 * - 전체보기 (All Topics)
 * - AI 기초 연구 (AI Foundations)
 * - 데이터 인텔리전스 (Data Intelligence)
 * - 피지컬 AI (Physical AI)
 * - 기술 백서 (Whitepapers)
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

  // 데이터 기술 카테고리 및 하위 분류 정의
  categories: [
    { id: "all", nameKo: "전체보기", nameEn: "All Topics" },
    { id: "ai-research", nameKo: "AI 기초 연구", nameEn: "AI Foundations" },
    { id: "data-intelligence", nameKo: "데이터 인텔리전스", nameEn: "Data Intelligence" },
    { id: "physical-ai", nameKo: "피지컬 AI & 로보틱스", nameEn: "Physical AI" },
    { id: "whitepaper", nameKo: "기술 백서 & 규제", nameEn: "Whitepapers" }
  ],

  // 데이터 기술 하위 카테고리별 실시간 갱신용 풀 (30분 주기 동기화)
  feedPool: {
    // 1. AI 기초 연구 하위 풀
    aiResearch: [
      {
        id: "pool-ai-01",
        category: "ai-research",
        titleKo: "다단계 추론 언어모델의 잠재공간 정렬과 환각 억제 메커니즘",
        titleEn: "Latent Space Alignment & Hallucination Suppression in Multi-Step Reasoning LLMs",
        summaryKo: "복잡한 수리 및 논리 추론 과정에서 발생하는 누적 오차를 억제하기 위해, 모델의 중간 잔차 스트림을 실시간 모니터링하고 능동적으로 가이던스를 주입하는 인터벤션 프레임워크를 공개합니다.",
        summaryEn: "An active representation intervention framework that monitors intermediate residual streams in real-time to suppress accumulated reasoning errors in complex mathematical and logical deductions.",
        readTime: "9 min read",
        author: "Elena Rostova, Cognitive AI Team",
        tags: ["Reasoning Models", "Latent Intervention", "Hallucination Control", "Transformers"],
        coverGradient: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
        badge: "AI FOUNDATION",
        metrics: { accuracy: "94.2%", hallucinationDrop: "-68%", latencyCost: "+3.2%" },
        contentKo: `
### 1. 추론 궤적에서의 엔트로피 발산 문제
Chain-of-Thought(CoT) 및 심층 추론(Deep Reasoning) 과정에서, 중간 토큰의 사소한 확률적 편향이 이후 추론 궤적 전체를 붕괴시키는 오류 연쇄가 발생합니다.

### 2. 잔차 스트림 프로빙 및 제어
추론 레이어마다 지식 신뢰도 벡터를 투영하는 **Aether-Steer** 아키텍처를 도입하여 진위 판단 경계면을 벗어나는 즉시 모델 스스로 오류를 되짚어보도록 유도합니다.
        `,
        contentEn: `
### 1. Entropy Divergence in Reasoning Trajectories
Minor stochastic errors in intermediate tokens cascade into complete failures during deep Chain-of-Thought deductions.
        `
      },
      {
        id: "pool-ai-02",
        category: "ai-research",
        titleKo: "초거대 모델의 희소성(Sparsity) 최적화를 위한 동적 MoE 라우팅 알고리즘",
        titleEn: "Dynamic Expert Routing & Sparsity Optimization for Next-Gen Mixture-of-Experts",
        summaryKo: "수천억 파라미터 규모의 모델에서 활성 파라미터를 12% 수준으로 유지하면서도 밀집(Dense) 모델 이상의 일반화 성능을 달성하는 새로운 라우팅 엔트로피 정규화 기법입니다.",
        summaryEn: "A routing entropy regularization mechanism keeping active parameters under 12% in massive MoE architectures while exceeding dense baseline generalization benchmarks.",
        readTime: "8 min read",
        author: "Dr. Alex Vance, Foundation Architectures",
        tags: ["MoE", "Sparsity", "Compute Efficiency", "Large Scale"],
        coverGradient: "linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #581c87 100%)",
        badge: "AI FOUNDATION",
        metrics: { paramEfficiency: "8.3x", inferenceSpeed: "+45%", routingPurity: "98.1%" },
        contentKo: `
### 1. MoE 라우팅 붕괴 현상
특정 전문가 네트워크(Expert)로만 연산이 편중되어 모델 용량이 낭비되는 로드 불균형을 동적 어텐션 밸런서로 해결했습니다.
        `,
        contentEn: `
### 1. Routing Collapse in MoE
Eliminates token allocation bottlenecks using dynamic attention-balanced gating.
        `
      },
      {
        id: "pool-ai-03",
        category: "ai-research",
        titleKo: "테스트 타임 컴퓨팅(Test-Time Compute) 확장을 통한 다단계 추론 오류 자가 치유",
        titleEn: "Test-Time Compute Scaling & Autonomous Self-Healing for Complex Reasoning",
        summaryKo: "추론 시점에 계산량을 가변적으로 투입하여 모델이 자체적으로 논리적 모순을 검증하고 경로를 재탐색하는 몬테카를로 트리 탐색(MCTS) 결합 아키텍처입니다.",
        summaryEn: "Dynamic test-time compute allocation paired with Monte Carlo Tree Search, enabling autonomous proof verification and trajectory backtracking.",
        readTime: "10 min read",
        author: "Reasoning & Cognitive Systems Group",
        tags: ["Test-Time Compute", "MCTS", "Self-Correction", "Reasoning"],
        coverGradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)",
        badge: "AI FOUNDATION",
        metrics: { reasoningGain: "+18.4%", verificationAccuracy: "99.2%", tokensUsed: "Adaptive" },
        contentKo: `
### 1. 사후 검증 기반 추론
출력 생성 전 단계에서 모델 스스로 반증 사례를 생성하여 신뢰도를 검증합니다.
        `,
        contentEn: `
### 1. Autonomous Verification
Enforces internal counter-example synthesis before final output commitment.
        `
      }
    ],

    // 2. 데이터 인텔리전스 하위 풀
    dataIntelligence: [
      {
        id: "pool-di-01",
        category: "data-intelligence",
        titleKo: "고차원 임베딩 공간 기하학을 활용한 AI 학습 데이터 품질 진단과 다이어트",
        titleEn: "Diagnostic Geometric Analysis & Data Diet in High-Dimensional Embedding Space",
        summaryKo: "방대한 AI 데이터셋에서 중복과 편향을 수학적으로 감지하고, ISO/IEC 5259-2 표준에 부합하는 다양성 및 대표성 지표를 도출하여 모델 학습 효율을 40% 이상 극대화하는 기법을 제안합니다.",
        summaryEn: "A mathematical framework to detect redundancy and bias in massive AI datasets, deriving ISO/IEC 5259-2 compliant diversity and representativeness metrics to boost model training efficiency by over 40%.",
        readTime: "7 min read",
        author: "Dr. Min-Seok Kang, AI Systems Lab",
        tags: ["ISO 5259", "Data Quality", "Embedding Space", "Data Diet"],
        coverGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
        badge: "DATA INTEL",
        metrics: { efficiency: "+42%", costReduction: "35%", isoCompliance: "100%" },
        contentKo: `
### 1. 데이터 표현 품질(Representational Quality)
현대 딥러닝 시스템의 핵심 병목은 데이터 볼륨이 아니라 데이터의 고유한 표현 품질에 있습니다. Data Diet™ 알고리즘을 통해 필수 엣지 케이스를 보존하면서 공통 샘플을 40% 이상 압축합니다.
        `,
        contentEn: `
### 1. Data Quality Bottleneck
Compression preserving topological manifold structures under ISO/IEC 5259 guidelines.
        `
      },
      {
        id: "pool-di-02",
        category: "data-intelligence",
        titleKo: "물리 기반 합성 데이터(Synthetic Data) 생성과 도메인 갭 해소 전략",
        titleEn: "Physics-Grounded Synthetic Data Generation & Domain Gap Closing",
        summaryKo: "실제 수집이 불가능한 극한 환경(Severe Weather, 공장 화재, 희귀 결함)의 데이터를 물리 시뮬레이터와 확산 모델(Diffusion)의 결합을 통해 무손실 생성하는 기술입니다.",
        summaryEn: "Generating ultra-realistic edge-case datasets for extreme conditions by bridging physics simulators and latent diffusion architectures without domain shift.",
        readTime: "8 min read",
        author: "Hye-Jin Choi, Synthetic Data Lab",
        tags: ["Synthetic Data", "Generative AI", "Domain Adaptation", "Edge Cases"],
        coverGradient: "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
        badge: "DATA INTEL",
        metrics: { dataExpansion: "10x", domainShiftLoss: "< 1.8%", labelingCost: "-85%" },
        contentKo: `
### 1. Data Bulk-up™ 합성 엔진
3D 물리 기하학과 생성형 AI 사실성을 융합하여 결함 및 엣지 케이스 데이터를 완전 자동 라벨링 생성합니다.
        `,
        contentEn: `
### 1. Synthetic Physics Bridging
Generates photorealistic domain-adapted edge case datasets without manual labeling.
        `
      },
      {
        id: "pool-di-03",
        category: "data-intelligence",
        titleKo: "ISO/IEC 5259 표준 AI 데이터 다양성 및 대표성 정량화 벤치마크",
        titleEn: "ISO/IEC 5259 Standard AI Data Diversity & Representativeness Benchmarking",
        summaryKo: "데이터 완전성, 일관성, 균형성 및 최신성을 실시간 스트리밍 데이터셋에서 자동으로 연산하고 감사 추적성(Audit Trail)을 보장하는 표준 프레임워크입니다.",
        summaryEn: "An automated compliance framework calculating completeness, consistency, and balance metrics in real-time streaming datasets with cryptographically auditable trails.",
        readTime: "6 min read",
        author: "ISO 5259 WG3 Taskforce, Aetheris AI",
        tags: ["ISO 5259", "Data Auditing", "Compliance", "MLOps"],
        coverGradient: "linear-gradient(135deg, #0f2b46 0%, #0d4a70 50%, #0284c7 100%)",
        badge: "DATA INTEL",
        metrics: { auditSpeed: "1.2M rows/s", standardFidelity: "99.9%", falseAlarm: "< 0.05%" },
        contentKo: `
### 1. 글로벌 규제 대응
EU AI Act 및 글로벌 고위험 AI 인증에 필수적인 ISO 5259 표준 품질 지표를 정량 증명합니다.
        `,
        contentEn: `
### 1. Standards Compliance
Automates verifiable data quality auditing for regulatory high-risk AI certifications.
        `
      },
      {
        id: "pool-di-04",
        category: "data-intelligence",
        titleKo: "자율 시스템 센서 데이터의 실시간 데이터 드리프트(Data Drift) 감지 알고리즘",
        titleEn: "Real-Time Sensor Data Drift Detection & Adaptive Calibration in Autonomous Systems",
        summaryKo: "센서 노후화 및 기상 급변으로 인해 발생하는 시계열/비전 데이터의 분포 이동을 15ms 내에 포착하여 모델 오작동을 선제 차단하는 기술입니다.",
        summaryEn: "Detecting environmental sensor data drift within 15ms using dynamic Wasserstein distance bounds to prevent autonomous mission failures.",
        readTime: "7 min read",
        author: "Dr. Sang-Woo Yoon, Stream Intelligence Lab",
        tags: ["Data Drift", "Sensors", "Real-time AI", "Reliability"],
        coverGradient: "linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #14b8a6 100%)",
        badge: "DATA INTEL",
        metrics: { latency: "14.2ms", driftAccuracy: "97.8%", calibrationGain: "+22%" },
        contentKo: `
### 1. 실시간 데이터 분포 감시
동적 바서슈타인 거리 연산으로 센서 스트림의 왜곡을 감지하고 파이프라인을 자율 보정합니다.
        `,
        contentEn: `
### 1. High-frequency Drift Guard
Guarantees uninterrupted perceptual reliability against sensor degradation.
        `
      }
    ]
  },

  // 메인 화면 활성 아티클 초기 목록 (전체보기 및 하위 탭 표시)
  articles: [
    {
      id: "art-init-01",
      category: "data-intelligence",
      featured: true,
      titleKo: "고차원 임베딩 공간 기하학을 활용한 AI 학습 데이터 품질 진단과 다이어트",
      titleEn: "Diagnostic Geometric Analysis & Data Diet in High-Dimensional Embedding Space",
      summaryKo: "방대한 AI 데이터셋에서 중복과 편향을 수학적으로 감지하고, ISO/IEC 5259-2 표준에 부합하는 다양성 및 대표성 지표를 도출하여 모델 학습 효율을 40% 이상 극대화하는 기법을 제안합니다.",
      summaryEn: "A mathematical framework to detect redundancy and bias in massive AI datasets, deriving ISO/IEC 5259-2 compliant diversity and representativeness metrics to boost model training efficiency by over 40%.",
      date: "2026.10.18",
      readTime: "7 min read",
      author: "Dr. Min-Seok Kang, AI Systems Lab",
      tags: ["ISO 5259", "Data Quality", "Embedding Space", "Data Diet"],
      coverGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
      badge: "DATA INTEL",
      metrics: { efficiency: "+42%", costReduction: "35%", isoCompliance: "100%" },
      contentKo: `
### 1. 연구 배경 및 문제 정의
대규모 파운데이션 모델(Foundation Models)의 시대에, 단순한 '데이터 양의 증가'는 기하급수적인 연산 비용과 심각한 오버피팅(Overfitting), 그리고 설명 불가능한 환각(Hallucination) 현상을 야기합니다. 현대 딥러닝 시스템의 핵심 병목은 데이터의 볼륨이 아니라 **데이터의 고유한 표현 품질(Representational Quality)**에 있습니다.

본 연구에서는 고차원 유클리드 및 비유클리드 리만 공간(Riemannian Manifolds)에서 데이터 샘플들이 형성하는 위상수학적 구조를 정밀하게 분석합니다.

### 2. 핵심 방법론: Data Diet™ 알고리즘
- **국소 밀도 편차(Local Density Variance) 측정**: 데이터 군집 내 중복 정보량을 Information Bottleneck 이론에 기반하여 수치화.
- **다양성-대표성 최적화 파레토 프론트(Pareto Front)**: 필수 엣지 케이스(Edge Cases)를 보존하면서 공통 도메인 샘플을 40% 이상 압축.
- **ISO/IEC 5259-2 표준 지표 자동 도출**: 유사성, 완전성, 균형성 지수를 수학적으로 증명 가능한 보고서로 자동 생성.
      `,
      contentEn: `
### 1. Background & Problem Definition
In the era of foundation models, sheer data volume leads to exponential compute costs and severe overfitting. The true bottleneck is not volume, but representational quality.
      `
    },
    {
      id: "art-init-02",
      category: "ai-research",
      featured: false,
      titleKo: "다단계 추론 언어모델의 잠재공간 정렬과 환각 억제 메커니즘",
      titleEn: "Latent Space Alignment & Hallucination Suppression in Multi-Step Reasoning LLMs",
      summaryKo: "복잡한 수리 및 논리 추론 과정에서 발생하는 누적 오차를 억제하기 위해, 모델의 중간 잔차 스트림(Residual Stream)을 실시간 모니터링하고 능동적으로 가이던스를 주입하는 인터벤션 프레임워크를 공개합니다.",
      summaryEn: "An active representation intervention framework that monitors intermediate residual streams in real-time to suppress accumulated reasoning errors in complex mathematical and logical deductions.",
      date: "2026.10.18",
      readTime: "9 min read",
      author: "Elena Rostova, Cognitive AI Team",
      tags: ["Reasoning Models", "Latent Intervention", "Hallucination Control", "Transformers"],
      coverGradient: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
      badge: "AI FOUNDATION",
      metrics: { accuracy: "94.2%", hallucinationDrop: "-68%", latencyCost: "+3.2%" },
      contentKo: `
### 1. 추론 궤적에서의 엔트로피 발산 문제
Chain-of-Thought(CoT) 및 심층 추론(Deep Reasoning) 과정에서 중간 토큰의 확률적 편향이 이후 추론 전체를 붕괴시키는 문제를 잔차 스트림 프로빙을 통해 자가 치유합니다.
      `,
      contentEn: `
### 1. Entropy Divergence
Suppresses reasoning failure cascades through targeted residual stream probing.
      `
    },
    {
      id: "art-init-03",
      category: "data-intelligence",
      featured: false,
      titleKo: "물리 기반 합성 데이터(Synthetic Data) 생성과 도메인 갭 해소 전략",
      titleEn: "Physics-Grounded Synthetic Data Generation & Domain Gap Closing",
      summaryKo: "실제 수집이 불가능한 극한 환경(Severe Weather, 공장 화재, 희귀 질환 등)의 희귀 데이터를 물리 법칙 기반 시뮬레이터와 확산 모델(Diffusion)의 결합을 통해 무손실 생성하는 기술입니다.",
      summaryEn: "Generating ultra-realistic edge-case datasets for extreme conditions by bridging physics simulators and latent diffusion architectures without domain shift.",
      date: "2026.10.18",
      readTime: "8 min read",
      author: "Hye-Jin Choi, Synthetic Data Lab",
      tags: ["Synthetic Data", "Generative AI", "Domain Adaptation", "Edge Cases"],
      coverGradient: "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
      badge: "DATA INTEL",
      metrics: { dataExpansion: "10x", domainShiftLoss: "< 1.8%", labelingCost: "-85%" },
      contentKo: `
### 1. 엣지 케이스 데이터의 부재 해결
현실에서 직접 수집하기 어려운 희귀 결함 데이터를 물리 시뮬레이션과 생성형 AI의 융합으로 완전 자동 생성합니다.
      `,
      contentEn: `
### 1. Physics Grounded Synthesis
Generates synthetic sensor data across extreme conditions without domain shift.
      `
    },
    {
      id: "art-init-04",
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
      badge: "PHYSICAL AI",
      metrics: { latency: "8.4ms", physicsFidelity: "98.7%", sim2realSuccess: "91.2%" },
      contentKo: `
### 1. Physical AI의 도전 과제
텍스트/이미지만 다루는 가상 AI와 달리, 로봇은 중력, 마찰력, 충돌 등 물리 법칙의 즉각적인 반작용을 실시간으로 감지하고 대응해야 합니다.
      `,
      contentEn: `
### 1. Real-World Physical Challenges
Instantaneous reaction to kinetic forces in robotic environments.
      `
    },
    {
      id: "art-init-05",
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
      badge: "WHITEPAPER",
      metrics: { riskCoverage: "100%", auditTime: "-70%", certificationRate: "99.1%" },
      contentKo: `
### 1. 고위험 AI 규제 시대의 개막
2026년부터 전면 시행되는 EU AI Act와 글로벌 규제는 데이터 편향과 품질 미달에 대해 엄격한 기준을 요구합니다.
      `,
      contentEn: `
### 1. High-Risk Compliance
Auditable data governance is vital for continuous regulatory clearance.
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
