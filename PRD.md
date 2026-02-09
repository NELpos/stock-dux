# 📊 InvestFlow - 해외투자 자산관리 플랫폼 PRD

## Document Info
| 항목 | 내용 |
|------|------|
| **프로젝트명** | InvestFlow (가칭) |
| **버전** | v1.0.0-MVP |
| **작성일** | 2026-01-31 |
| **대상 사용자** | 5명 이내 소규모 그룹 |
| **배포 환경** | Vercel + Supabase |

---

## 1. 프로젝트 개요

### 1.1 배경 및 문제 정의
한국인 개인 투자자로서 미국 주식과 한국 ETF를 동시에 관리하는 데 다음과 같은 불편함이 있음:

- **반복적인 엑셀 기입**: 매수/매도 기록을 수동으로 관리해야 함
- **시차로 인한 정보 접근성**: 미국 장 마감 시간이 한국 새벽이라 뉴스 추적이 어려움
- **분산된 정보**: 증권사 앱, 시킹알파, SEC Filing 등 여러 소스를 오가며 정보 수집
- **인사이트 부재**: 매수/매도 이력 기반의 패턴 분석이나 학습 기회 부족

### 1.2 목표
1. **자산 현황 통합 관리**: 미국주식 + 한국 ETF 포트폴리오를 한눈에 파악
2. **자동화된 거래 기록**: 한국투자증권 API 연동으로 수동 입력 제거
3. **뉴스 및 정보 집약**: 보유 종목 관련 뉴스를 주기적으로 수집하고 한국어로 요약
4. **재무 분석 도구**: SEC Filing 기반 재무제표 조회 및 분석
5. **투자 인사이트**: 매수/매도 패턴 분석을 통한 자기 학습

### 1.3 성공 지표 (MVP)
- [ ] 50개 미만 종목의 실시간 시세 조회 가능
- [ ] 한국투자증권 API 연동으로 거래 내역 자동 동기화
- [ ] 일 1회 이상 보유 종목 뉴스 자동 수집 및 요약
- [ ] 사용자당 월 AI 비용 ₩10,000 이내 유지

---

## 2. 사용자 스토리

### 2.1 페르소나
**김투자 (32세, 소프트웨어 개발자)**
- 미국 주식 30개, 한국 ETF 15개 보유
- 한국투자증권 계좌 사용
- 시킹알파 유료 구독 중
- 평일에는 바빠서 주말에 몰아서 투자 공부
- NotebookLM 스타일의 인터랙티브한 정보 탐색 선호

### 2.2 핵심 사용자 스토리

#### US-001: 포트폴리오 대시보드
> **사용자로서**, 로그인하면 내 전체 포트폴리오 현황을 한눈에 보고 싶다.
> 
> **수용 기준**:
> - 총 자산 가치 (원화 환산)
> - 오늘/이번 주/이번 달/올해 수익률
> - 미국주식/한국ETF 비중 파이차트
> - 종목별 수익률 히트맵
> - 실시간 환율 반영

#### US-002: 거래 내역 자동 동기화
> **사용자로서**, 한국투자증권에서 매수/매도하면 자동으로 내 플랫폼에 반영되길 원한다.
> 
> **수용 기준**:
> - 한국투자증권 API 연동 (해외주식 + 국내 ETF)
> - 최초 연동 시 과거 거래 내역 일괄 동기화
> - 이후 일 1회 자동 동기화
> - 수동 동기화 트리거 버튼 제공

#### US-003: 종목별 뉴스 피드
> **사용자로서**, 내가 보유한 종목들의 최신 뉴스를 한국어로 요약해서 보고 싶다.
> 
> **수용 기준**:
> - 보유 종목별 최신 뉴스 5개 표시
> - 영문 뉴스는 한국어 요약 제공
> - 감성 분석 (긍정/부정/중립) 표시
> - 뉴스 원문 링크 제공

#### US-004: 재무제표 조회
> **사용자로서**, 관심 종목의 재무제표(손익계산서, 대차대조표)를 쉽게 조회하고 싶다.
> 
> **수용 기준**:
> - 최근 5년 분기별 재무 데이터
> - 주요 지표 시각화 (매출, 영업이익, EPS 등)
> - 전년 동기 대비 증감 표시
> - SEC EDGAR 원문 링크 제공

#### US-005: 투자 일지 및 인사이트
> **사용자로서**, 내 매수/매도 이력을 분석해서 투자 패턴을 파악하고 싶다.
> 
> **수용 기준**:
> - 거래 이력 타임라인 뷰
> - 종목별 평균 보유 기간
> - 수익/손실 실현 내역
> - AI 기반 인사이트 요약 (선택적)

#### US-006: SSO 로그인
> **사용자로서**, 구글, 네이버 또는 카카오 계정으로 간편하게 로그인하고 싶다.
> 
> **수용 기준**:
> - Supabase Auth 기반 SSO
> - Google OAuth 2.0 지원
> - 네이버 OAuth 2.0 지원
> - 카카오 OAuth 2.0 지원
> - 5명 이내 화이트리스트 방식 (MVP)

---

## 3. 기능 명세

### 3.1 기능 우선순위 (MoSCoW)

| 우선순위 | 기능 | 설명 |
|----------|------|------|
| **Must** | 대시보드 | 포트폴리오 현황, 수익률, 자산 배분 |
| **Must** | SSO 인증 | 구글/네이버/카카오 로그인, 화이트리스트 |
| **Must** | 실시간 시세 | Alpaca API 연동, 50개 종목 |
| **Must** | 거래 동기화 | 한국투자증권 API 연동 |
| **Should** | 뉴스 피드 | Finnhub API + AI 요약 |
| **Should** | 재무제표 | FMP API 또는 SEC EDGAR |
| **Could** | 투자 인사이트 | AI 기반 패턴 분석 |
| **Could** | 알림 설정 | 가격 변동, 실적 발표 알림 |
| **Won't (MVP)** | 자동 매매 | 트레이딩 봇 기능 |
| **Won't (MVP)** | 소셜 기능 | 투자 공유, 팔로우 |

### 3.2 페이지 구조

```
/                       # 랜딩 페이지 (미인증 시)
/login                  # 로그인 (SSO 선택)
/dashboard              # 메인 대시보드
/portfolio              # 포트폴리오 상세
  /portfolio/[ticker]   # 개별 종목 상세
/news                   # 뉴스 피드
/analysis               # 재무 분석 도구
  /analysis/[ticker]    # 개별 종목 재무제표
/journal                # 투자 일지
/settings               # 설정
  /settings/account     # 계정 관리
  /settings/broker      # 증권사 연동
```

### 3.3 데이터 모델 (개념)

```
User
├── id (Supabase Auth)
├── email
├── name
├── provider (naver/kakao)
└── settings (JSON)

Portfolio
├── user_id
├── ticker
├── quantity
├── avg_price
├── currency
└── type (US_STOCK/KR_ETF)

Transaction
├── user_id
├── ticker
├── type (BUY/SELL)
├── quantity
├── price
├── fee
├── executed_at
└── synced_from (KIS_API/MANUAL)

News
├── ticker
├── title
├── summary_ko
├── sentiment
├── source_url
├── published_at
└── fetched_at

Financials
├── ticker
├── period (Q1_2024, etc.)
├── data (JSON - 재무제표)
└── fetched_at
```

---

## 4. 기술 요구사항

### 4.1 기술 스택

| 레이어 | 기술 | 선택 이유 |
|--------|------|-----------|
| **Frontend** | Next.js 16 (App Router) | 최신 React 서버 컴포넌트, 개발자 숙련도 |
| **Backend** | Next.js API Routes | 별도 백엔드 없이 풀스택 |
| **Database** | Supabase PostgreSQL | 관리형 DB, Auth 통합, 5명 무료 티어 |
| **Auth** | Supabase Auth | 구글/네이버/카카오 SSO 지원 |
| **배포** | Vercel | Next.js 최적화, CI/CD 자동화 |
| **UI** | Tailwind CSS + shadcn/ui + Tremor | 빠른 개발, 금융 대시보드 특화 |
| **상태관리** | TanStack Query | 서버 상태 캐싱, 실시간 갱신 |

### 4.2 외부 API

| API | 용도 | 비용 |
|-----|------|------|
| **Alpaca Markets** | 미국주식 실시간 시세 | 무료 (IEX 데이터) |
| **한국투자증권 API** | 거래 내역, 잔고 조회 | 무료 |
| **Finnhub** | 뉴스 수집 | 무료 (60req/분) |
| **Financial Modeling Prep** | 재무제표 | $99/월 (또는 SEC EDGAR 무료) |
| **Claude API** | 뉴스 요약, 인사이트 | ~$7/월 예상 |

### 4.3 비기능 요구사항

| 항목 | 요구사항 |
|------|----------|
| **성능** | 대시보드 초기 로딩 3초 이내 |
| **가용성** | Vercel + Supabase 기본 SLA |
| **보안** | HTTPS, API 키 환경변수 관리, Row Level Security |
| **확장성** | 5명 → 50명까지 아키텍처 변경 없이 확장 |
| **비용** | 월 총 비용 $50 이내 (AI 포함) |

---

## 5. 보안 및 규정

### 5.1 인증/인가
- Supabase Auth 기반 JWT 토큰
- Row Level Security (RLS)로 사용자 데이터 격리
- 화이트리스트 방식 접근 제어 (MVP)

### 5.2 API 키 관리
- 모든 외부 API 키는 환경변수로 관리
- 클라이언트 노출 금지 (서버 사이드 호출)
- 한국투자증권 토큰 자동 갱신 로직

### 5.3 개인정보
- 금융 데이터는 사용자 본인만 접근 가능
- 제3자 공유 기능 없음 (MVP)
- GDPR/개인정보보호법 기본 준수

---

## 6. 마일스톤

### Phase 1: Foundation (Week 1-2)
- [ ] 프로젝트 초기화 (Next.js 16 + Supabase)
- [ ] Vercel 배포 파이프라인 구축
- [ ] Supabase Auth + 네이버/카카오 SSO
- [ ] 기본 UI 레이아웃 (Tremor)

### Phase 2: Core Features (Week 3-4)
- [ ] Alpaca API 연동 (실시간 시세)
- [ ] 한국투자증권 API 연동 (잔고/거래)
- [ ] 포트폴리오 대시보드 구현
- [ ] 거래 내역 동기화

### Phase 3: Intelligence (Week 5-6)
- [ ] 뉴스 수집 파이프라인 (Finnhub)
- [ ] AI 요약 기능 (Claude API)
- [ ] 재무제표 조회 (FMP/SEC EDGAR)

### Phase 4: Polish (Week 7-8)
- [ ] 투자 일지 기능
- [ ] 모바일 반응형 최적화
- [ ] 성능 최적화 및 버그 수정
- [ ] 베타 테스트

---

## 7. 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| 한국투자증권 API 변경 | 높음 | API 버전 고정, 모니터링 설정 |
| Alpaca 무료 티어 제한 | 중간 | Finnhub 백업, 캐싱 적극 활용 |
| AI 비용 초과 | 낮음 | 요청 배치 처리, 모델 티어링 |
| SSO 설정 복잡성 | 중간 | Supabase 문서 숙지, 테스트 환경 분리 |

---

## 8. 용어 정의

| 용어 | 정의 |
|------|------|
| **티커(Ticker)** | 주식 종목 코드 (예: AAPL, 005930) |
| **KIS API** | 한국투자증권 Open API |
| **SEC Filing** | 미국 증권거래위원회 공시 자료 |
| **RLS** | Row Level Security (Supabase 행 단위 보안) |
| **SSO** | Single Sign-On (통합 로그인) |

---

## 부록 A: 와이어프레임 참고

```
┌─────────────────────────────────────────────────────────────┐
│  [InvestFlow]    Dashboard  Portfolio  News  Analysis  ⚙️   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 총 자산     │  │ 오늘 수익   │  │ 연간 수익   │         │
│  │ ₩52,340,000 │  │ +₩234,500   │  │ +12.4%     │         │
│  │             │  │ (+0.45%)    │  │            │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  자산 배분           │  │  종목별 수익률        │        │
│  │  ┌────┐              │  │  NVDA  ████████ +45% │        │
│  │  │ 🥧 │ US 70%       │  │  AAPL  ██████   +23% │        │
│  │  │    │ KR 30%       │  │  TSLA  ████     +12% │        │
│  │  └────┘              │  │  KODEX ███      +8%  │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │  최근 뉴스                                        │      │
│  │  📰 NVDA, AI 칩 수요 급증으로 실적 호조 예상      │      │
│  │  📰 애플, 내년 새로운 제품 라인업 공개 예정        │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 부록 B: API 엔드포인트 설계 (초안)

```
# 인증
POST   /api/auth/callback/google
POST   /api/auth/callback/naver
POST   /api/auth/callback/kakao

# 포트폴리오
GET    /api/portfolio              # 전체 포트폴리오
GET    /api/portfolio/[ticker]     # 개별 종목
POST   /api/portfolio/sync         # 한투 동기화 트리거

# 시세
GET    /api/quotes?tickers=AAPL,NVDA
GET    /api/quotes/[ticker]/history

# 거래
GET    /api/transactions
GET    /api/transactions/[ticker]

# 뉴스
GET    /api/news?ticker=AAPL
POST   /api/news/refresh           # 뉴스 새로고침

# 재무
GET    /api/financials/[ticker]
GET    /api/financials/[ticker]/income
GET    /api/financials/[ticker]/balance

# 설정
GET    /api/settings
PUT    /api/settings
POST   /api/settings/broker/connect
DELETE /api/settings/broker/disconnect
```

---

*이 PRD는 Claude Code 바이브 코딩과 spec-kit 워크플로우를 통해 구현될 예정입니다.*
