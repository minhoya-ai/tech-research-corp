# Aetheris AI Research Portal - 공용(Public) 백엔드 배포 및 운영 가이드

본 가이드는 `localhost:4000`에서 실행되던 Aetheris AI 포털을 **전 세계 누구나 접속할 수 있는 공용(Public) 웹사이트 및 백엔드 API 서비스**로 배포하고 운영하는 4가지 방법을 안내합니다.

---

## 🚀 빠른 시작 옵션 요약

| 배포 방식 | 소요 시간 | 비용 | 특징 | 추천 대상 |
| :--- | :---: | :---: | :--- | :--- |
| **1. 원클릭 퍼블릭 터널** | **5초** | **무료** | `start-public-tunnel.cmd` 실행 즉시 전 세계 접속 가능한 HTTPS URL 발급 | 지금 당장 외부 공유 / 모바일 테스트 |
| **2. Render.com 클라우드** | **3분** | **무료** | 24/7 상시 운영, Git Push 시 자동 빌드 & 배포, `render.yaml` 내장 | 영구적인 공용 Node.js 백엔드 서버 |
| **3. Vercel 서버리스** | **2분** | **무료** | 글로벌 CDN 엣지 네트워크, 고속 캐싱, `vercel.json` 내장 | 초고속 공용 웹사이트 및 서버리스 API |
| **4. Docker 컨테이너** | **1분** | 사용자 인프라 | `docker compose up -d`로 AWS/GCP/클라우드 VPS 즉시 구동 | 자체 서버 및 엔터프라이즈 환경 |

---

## 방법 1. 원클릭 퍼블릭 터널 (로컬 서버를 즉시 전 세계에 공개)

가장 간단한 방법으로, 현재 로컬 PC에서 실행 중인 `localhost:4000`을 안전한 보안 터널을 통해 공용 인터넷 주소로 즉시 노출합니다.

### 실행 방법:
1. 프로젝트 폴더의 **`start-public-tunnel.cmd`** 파일을 더블 클릭합니다.
2. 터미널 창에 발급된 공용 HTTPS 주소가 출력됩니다:
   ```text
   your url is: https://bright-river-42.loca.lt
   ```
3. 스마트폰, 외부 PC 등 전 세계 어디서든 해당 URL로 접속하면 로컬 백엔드 및 웹사이트가 그대로 동작합니다.

---

## 방법 2. Render.com 무료 클라우드 배포 (24/7 영구 운영)

Render는 Node.js Express 백엔드를 무료로 호스팅해주는 가장 안정적인 클라우드 플랫폼입니다.

### 배포 순서:
1. **GitHub 원격 저장소에 코드 푸시**:
   - `deploy-github.cmd`를 실행하여 최신 코드를 `minhoya-ai/tech-research-corp` 저장소로 업로드합니다.
2. **[Render.com](https://render.com/) 접속 및 로그인** (GitHub 계정으로 간편 가입).
3. 대시보드 우측 상단 **[New +]** 버튼 클릭 ➡️ **[Blueprint]** 선택.
4. 본인의 GitHub 저장소 **`minhoya-ai/tech-research-corp`** 선택.
5. 저장소에 포함된 `render.yaml` 파일이 자동으로 감지되며, 서비스명(`tech-research-corp`)이 설정됩니다.
6. **[Apply]** 버튼을 누르면 약 2분 후 무료 공용 도메인이 발급됩니다:
   - 공용 접속 URL: `https://tech-research-corp.onrender.com`
   - 공용 API Health: `https://tech-research-corp.onrender.com/api/health`
   - 공용 API Info: `https://tech-research-corp.onrender.com/api/info`
7. 이후 로컬에서 코드를 수정하고 GitHub에 푸시할 때마다 Render가 **자동으로 재빌드 및 재배포**를 수행합니다.

---

## 방법 3. Vercel 서버리스 배포

Vercel은 글로벌 엣지 네트워크 기반으로 프론트엔드와 Node.js API를 초고속 서빙합니다.

### 배포 순서:
1. **[Vercel](https://vercel.com/) 접속 및 로그인**.
2. **[Add New...]** ➡️ **[Project]** 클릭.
3. GitHub 계정을 연동하고 **`tech-research-corp`** 저장소의 **[Import]** 버튼 클릭.
4. 프로젝트 루트에 `vercel.json`과 `api/index.js`가 구성되어 있으므로 별도 설정 없이 **[Deploy]** 클릭.
5. 배포 완료 후 `https://tech-research-corp.vercel.app` 형태의 글로벌 공용 URL이 즉시 활성화됩니다.

---

## 방법 4. Docker 컨테이너 배포 (자체 서버 / AWS / GCP)

AWS EC2, Google Cloud, 또는 자체 리눅스 서버가 있으신 경우 Docker로 즉시 구동할 수 있습니다.

### 실행 명령어:
```bash
# 1. 도커 컨테이너 빌드 및 백그라운드 실행
docker compose up -d --build

# 2. 실행 상태 및 로그 확인
docker compose ps
docker compose logs -f

# 3. 헬스 체크
curl http://localhost:4000/api/health
```

---

## 📡 구축된 공용 백엔드 REST API 목록

모든 공용 API는 **CORS 활성화**, **보안 헤더(Security Headers)**, **초당 요청 제한(Rate Limiting)**이 적용되어 있어 안전하게 공개 호출이 가능합니다:

1. **`GET /api/articles`**: 연구 논문 목록 조회 (검색: `?q=...`, 카테고리: `?category=...`)
2. **`GET /api/articles/:id`**: 특정 논문의 상세 정보 및 전문 데이터 조회
3. **`GET /api/stats`**: 연구소 인용수, 특허, 글로벌 파트너 지표 조회
4. **`GET /api/categories`**: 데이터 기술 하위 카테고리 목록
5. **`GET /api/data-tech/feed`**: 30분 주기 데이터 기술 실시간 피드 풀 조회
6. **`POST /api/data-tech/sync`**: 데이터 기술 카테고리 실시간 갱신 트리거
7. **`POST /api/contact`**: 연구 협력 및 PoC 문의 접수 (이름, 이메일, 제안내용 검증 및 저장)
8. **`GET /api/health`**: 서버 가동 시간(Uptime), 상태 모니터링
9. **`GET /api/info`**: 공용 API 규격 및 아키텍처 정보
10. **`GET /api/ping`**: 클라우드 인스턴스 콜드 스타트 방지용 핑 엔드포인트
