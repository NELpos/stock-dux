# 🚀 InvestFlow - Claude Code 바이브 코딩 가이드

## spec-kit 기반 개발 워크플로우

이 가이드는 GitHub spec-kit을 활용하여 Claude Code로 InvestFlow를 바이브 코딩하는 전체 과정을 설명합니다.

---

## 📋 사전 준비

### 1. 필수 도구 설치

```bash
# 1. Node.js 20+ 설치 확인
node --version  # v20.x.x 이상

# 2. uv (Python 패키지 매니저) 설치
curl -LsSf https://astral.sh/uv/install.sh | sh

# 3. Claude Code 설치 확인
claude --version

# 4. Git 설치 확인
git --version
```

### 2. 외부 서비스 계정 준비

| 서비스 | 가입 URL | 필요한 것 |
|--------|----------|-----------|
| **Vercel** | https://vercel.com | GitHub 연동 |
| **Supabase** | https://supabase.com | 프로젝트 생성 |
| **Alpaca** | https://alpaca.markets | API Key + Secret |
| **한국투자증권** | https://apiportal.koreainvestment.com | App Key + Secret |
| **Finnhub** | https://finnhub.io | API Key |
| **Anthropic** | https://console.anthropic.com | API Key |

### 3. Supabase 프로젝트 설정

1. Supabase 대시보드에서 새 프로젝트 생성
2. **Authentication > Providers**에서 다음 활성화:
   - Google (Google Cloud Console에서 Client ID/Secret 발급)
   - Naver (네이버 개발자 센터에서 Client ID/Secret 발급)
   - Kakao (카카오 개발자 센터에서 REST API 키 발급)

---

## 🛠️ Step 1: 프로젝트 초기화

### 1.1 spec-kit으로 프로젝트 부트스트랩

```bash
# 프로젝트 디렉토리 생성 및 이동
mkdir investflow && cd investflow

# spec-kit 초기화 (Claude Code 사용)
uvx --from git+https://github.com/github/spec-kit.git specify init . --ai claude

# 또는 영구 설치 후 사용
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init . --ai claude
```

### 1.2 Next.js 16 프로젝트 생성

```bash
# Next.js 최신 버전으로 초기화
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 필수 패키지 설치
npm install @supabase/supabase-js @supabase/ssr
npm install @tremor/react recharts
npm install @tanstack/react-query
npm install lucide-react
npm install date-fns

# 개발 의존성
npm install -D @types/node
```

### 1.3 디렉토리 구조

```
investflow/
├── .specify/                    # spec-kit 템플릿
│   ├── memory/
│   │   └── constitution.md      # 프로젝트 원칙
│   ├── scripts/
│   └── templates/
├── .claude/                     # Claude Code 명령어
│   └── commands/
├── specs/                       # 기능 명세
│   └── 001-mvp-dashboard/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── contracts/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── apis/               # 외부 API 클라이언트
│   │   └── utils/
│   └── types/
├── CLAUDE.md                    # Claude Code 컨텍스트
├── .env.local                   # 환경변수
└── package.json
```

---

## 📜 Step 2: Constitution 설정 (프로젝트 원칙)

Claude Code를 실행하고 `/speckit.constitution` 명령어를 사용합니다.

```bash
# Claude Code 실행
cd investflow
claude
```

### Claude Code에서 실행:

```
/speckit.constitution 다음 원칙을 기반으로 constitution을 생성해줘:

## 기술 스택 (비협상)
- Frontend/Backend: Next.js 16+ (App Router, Server Components)
- Database: Supabase PostgreSQL
- Auth: Supabase Auth (네이버/카카오 SSO)
- 배포: Vercel
- UI: Tailwind CSS + shadcn/ui + Tremor
- 상태관리: TanStack Query (서버 상태), Zustand (클라이언트 상태)

## 코드 품질 기준
- TypeScript strict mode 필수
- 모든 API 응답에 Zod 스키마 검증
- 서버 컴포넌트 우선, 클라이언트 컴포넌트 최소화
- API Routes는 Edge Runtime 우선 고려
- 에러 바운더리 필수 적용

## 테스트 기준
- 핵심 비즈니스 로직 단위 테스트 (Vitest)
- API 통합 테스트 필수
- E2E는 선택적 (Chrome Devtools MCP)

## 보안 기준
- 모든 외부 API 키는 서버 사이드에서만 사용
- Supabase RLS 필수 적용
- 사용자 데이터 격리 검증

## 성능 기준
- LCP 3초 이내
- 번들 사이즈 500KB 이내 (초기 로드)
- 이미지 최적화 필수

## 한국어 컨벤션
- 주석은 한국어 허용
- 커밋 메시지는 한국어 또는 영어
- 사용자 대면 텍스트는 한국어 우선
```

---

## 📝 Step 3: Feature Specification

`/speckit.specify` 명령어로 첫 번째 기능을 정의합니다.

### Claude Code에서 실행:

```
/speckit.specify 해외투자 자산관리 플랫폼 MVP를 만들려고 해.

## 핵심 기능
1. **SSO 로그인**: 구글, 네이버 또는 카카오 계정으로 로그인. 초대된 5명만 사용 가능 (화이트리스트).

2. **포트폴리오 대시보드**: 
   - 총 자산 가치 (원화 환산, 실시간 환율 적용)
   - 오늘/이번주/이번달/올해 수익률
   - 미국주식/한국ETF 비중 파이차트
   - 종목별 수익률 히트맵 또는 바차트
   
3. **실시간 시세**: 
   - 보유 종목 50개까지 실시간 시세 표시
   - 미국 주식은 Alpaca API 사용
   - 한국 ETF는 한국투자증권 API 사용
   
4. **거래 내역 동기화**:
   - 한국투자증권 API 연동으로 매수/매도 내역 자동 동기화
   - 해외주식 + 국내 ETF 모두 지원
   - 수동 동기화 버튼 제공
   
5. **종목별 뉴스**:
   - Finnhub API로 영문 뉴스 수집
   - Claude API로 한국어 요약 생성
   - 긍정/부정/중립 감성 표시

## 사용자 플로우
1. 랜딩 페이지 접속
2. 구글/네이버/카카오 로그인 선택
3. 화이트리스트 확인 후 대시보드 진입
4. 최초 접속 시 한국투자증권 API 연동 안내
5. 연동 완료 후 포트폴리오 자동 로드

## 주요 제약사항
- 5명 이내 소규모 서비스
- 월 AI 비용 ₩10,000 이내
- 자동 매매 기능 없음 (조회만)
```

---

## 🔧 Step 4: Technical Plan

`/speckit.plan` 명령어로 기술 구현 계획을 생성합니다.

### Claude Code에서 실행:

```
/speckit.plan 다음 기술 스택과 제약사항으로 구현 계획을 세워줘:

## 기술 스택
- Next.js 16 (App Router, Server Components, Server Actions)
- Supabase PostgreSQL + Auth + RLS
- Vercel 배포 (Edge Functions 활용)
- Tremor + shadcn/ui (대시보드 컴포넌트)
- TanStack Query v5 (데이터 페칭)

## 외부 API
- Alpaca Markets: 미국주식 시세 (무료 IEX 데이터)
- 한국투자증권 API: 거래내역, 잔고, 국내 시세
- Finnhub: 뉴스 (무료 60req/분)
- Claude API (claude-3-haiku): 뉴스 요약

## 데이터베이스 스키마
- users (Supabase Auth 연동)
- portfolios (user_id, ticker, quantity, avg_price, type)
- transactions (user_id, ticker, type, quantity, price, executed_at)
- news_cache (ticker, title, summary_ko, sentiment, published_at)
- broker_connections (user_id, provider, access_token, refresh_token)

## 보안 요구사항
- Supabase RLS로 사용자 데이터 격리
- 외부 API 키는 Vercel 환경변수로 관리
- 한국투자증권 토큰은 암호화 저장
- 화이트리스트는 Supabase 테이블로 관리

## 폴더 구조
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── callback/[provider]/route.ts
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (대시보드)
│   │   ├── portfolio/page.tsx
│   │   └── news/page.tsx
│   └── api/
│       ├── portfolio/route.ts
│       ├── quotes/route.ts
│       ├── sync/route.ts
│       └── news/route.ts
├── components/
│   ├── dashboard/
│   ├── portfolio/
│   └── ui/
└── lib/
    ├── supabase/
    ├── apis/
    │   ├── alpaca.ts
    │   ├── kis.ts (한국투자증권)
    │   └── finnhub.ts
    └── utils/
```

---

## ✅ Step 5: Task Breakdown

`/speckit.tasks` 명령어로 작업 목록을 생성합니다.

### Claude Code에서 실행:

```
/speckit.tasks
```

이 명령어는 plan.md를 기반으로 구체적인 작업 목록을 생성합니다.

---

## 🚀 Step 6: Implementation

`/speckit.implement` 명령어로 구현을 시작합니다.

### Claude Code에서 실행:

```
/speckit.implement
```

또는 단계별로 진행하고 싶다면:

```
Task 1부터 순서대로 구현해줘. 각 작업 완료 후 테스트하고 다음으로 넘어가자.
```

---

## 🔑 환경변수 설정

### `.env.local` 파일 생성

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Alpaca Markets
ALPACA_API_KEY=PKxxx
ALPACA_SECRET_KEY=xxx

# 한국투자증권
KIS_APP_KEY=xxx
KIS_APP_SECRET=xxx
KIS_ACCOUNT_NO=12345678-01

# Finnhub
FINNHUB_API_KEY=xxx

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxx

# 화이트리스트 (쉼표 구분 이메일)
WHITELIST_EMAILS=user1@naver.com,user2@kakao.com
```

### Vercel 환경변수 설정

```bash
# Vercel CLI로 환경변수 설정
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ALPACA_API_KEY
# ... (모든 환경변수)
```

---

## 📊 Supabase 초기 설정

### 1. 테이블 생성 SQL

Claude Code에서 Supabase SQL Editor에 실행할 스크립트를 생성하도록 요청:

```
Supabase에서 실행할 초기 데이터베이스 스키마 SQL을 생성해줘.
다음 테이블이 필요해:
- profiles (사용자 프로필, auth.users 연동)
- whitelist (허용된 이메일 목록)
- portfolios (포트폴리오)
- transactions (거래 내역)
- broker_connections (증권사 연동 정보)
- news_cache (뉴스 캐시)

RLS 정책도 함께 포함해줘.
```

### 2. Google OAuth 설정

Google Cloud Console (https://console.cloud.google.com):
1. 새 프로젝트 생성 또는 기존 프로젝트 선택
2. APIs & Services > OAuth consent screen 설정
3. APIs & Services > Credentials > OAuth 2.0 Client ID 생성
4. Authorized redirect URIs: `https://xxx.supabase.co/auth/v1/callback`

### 3. Naver OAuth 설정

네이버 개발자 센터 (https://developers.naver.com):
1. 애플리케이션 등록
2. API 권한: 네아로 (로그인 오픈API)
3. 서비스 URL: `https://your-app.vercel.app`
4. Callback URL: `https://xxx.supabase.co/auth/v1/callback`

### 4. Kakao OAuth 설정

카카오 개발자 (https://developers.kakao.com):
1. 애플리케이션 추가
2. 카카오 로그인 활성화
3. Redirect URI: `https://xxx.supabase.co/auth/v1/callback`

---

## 🔄 개발 워크플로우 요약

```
┌─────────────────────────────────────────────────────────────┐
│                    spec-kit 워크플로우                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. /speckit.constitution                                  │
│      └── 프로젝트 원칙 정의                                   │
│                    ↓                                        │
│   2. /speckit.specify                                       │
│      └── 기능 요구사항 작성 (WHAT/WHY)                        │
│                    ↓                                        │
│   3. /speckit.clarify (선택)                                │
│      └── 모호한 부분 명확화                                   │
│                    ↓                                        │
│   4. /speckit.plan                                          │
│      └── 기술 구현 계획 (HOW)                                │
│                    ↓                                        │
│   5. /speckit.tasks                                         │
│      └── 작업 분해                                           │
│                    ↓                                        │
│   6. /speckit.implement                                     │
│      └── 코드 구현                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 바이브 코딩 팁

### 1. Claude Code 효과적 사용

```bash
# 프로젝트 컨텍스트 로드
claude

# 탐색 모드 (코드 작성 전 구조 파악)
> "src/lib/apis 폴더 구조 파악하고, 어떤 API 클라이언트가 필요한지 정리해줘. 코드는 아직 작성하지마."

# 확장 사고 모드
> "한국투자증권 API 토큰 갱신 로직 설계해줘. think harder"

# 점진적 구현
> "alpaca.ts 클라이언트부터 구현하고 테스트해보자"
```

### 2. CLAUDE.md 활용

프로젝트 루트에 `CLAUDE.md` 파일을 생성하여 Claude Code에게 컨텍스트 제공:

```markdown
# InvestFlow - 해외투자 자산관리 플랫폼

## 기술 스택
- Frontend/Backend: Next.js 16 (App Router)
- Database: Supabase PostgreSQL
- Auth: Supabase Auth (네이버/카카오 SSO)
- 배포: Vercel
- UI: Tailwind + shadcn/ui + Tremor

## 주요 명령어
- npm run dev: 개발 서버 (http://localhost:3000)
- npm run build: 프로덕션 빌드
- npm run test: Vitest 테스트

## 외부 API
- Alpaca: 미국주식 시세
- 한국투자증권: 거래내역, 잔고
- Finnhub: 뉴스
- Claude: AI 요약

## 규칙
- TypeScript strict mode 필수
- Server Component 우선
- 한국어 주석 허용
- API 키는 반드시 환경변수로
```

### 3. 에러 발생 시

```
> "이 에러가 발생했어: [에러 메시지]. 원인을 분석하고 수정해줘."

> "Supabase RLS가 제대로 동작하지 않아. 정책을 확인하고 수정해줘."

> "한국투자증권 API에서 401 에러가 나와. 토큰 갱신 로직을 확인해줘."
```

---

## 📚 참고 자료

- [spec-kit 공식 문서](https://github.com/github/spec-kit)
- [Next.js 16 문서](https://nextjs.org/docs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Tremor 컴포넌트](https://www.tremor.so/docs/getting-started/installation)
- [한국투자증권 API](https://apiportal.koreainvestment.com)
- [Alpaca API](https://docs.alpaca.markets)

---

*이 가이드를 따라 Claude Code와 함께 InvestFlow를 바이브 코딩하세요! 🚀*
