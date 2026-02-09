# InvestFlow - Claude Code Context

## 프로젝트 개요
해외투자 자산관리 플랫폼. 미국주식과 한국 ETF를 통합 관리하는 개인용 서비스.
5명 이내 소규모 그룹 대상, Vercel + Supabase 기반.

## 기술 스택
- **Framework**: Next.js 16+ (App Router, Server Components)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (구글/네이버/카카오 SSO)
- **Deploy**: Vercel
- **UI**: Tailwind CSS + shadcn/ui + Tremor
- **State**: TanStack Query v5

## 주요 명령어
```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run test         # Vitest 테스트
npm run test:e2e     # Playwright E2E
```

## 폴더 구조
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트
│   ├── (dashboard)/       # 대시보드 라우트 (인증 필요)
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── dashboard/         # 대시보드 전용
│   ├── portfolio/         # 포트폴리오 전용
│   └── ui/               # 공통 UI (shadcn)
├── lib/
│   ├── supabase/         # Supabase 클라이언트
│   ├── apis/             # 외부 API 클라이언트
│   │   ├── alpaca.ts     # 미국주식 시세
│   │   ├── kis.ts        # 한국투자증권
│   │   └── finnhub.ts    # 뉴스
│   └── utils/            # 유틸리티 함수
└── types/                # TypeScript 타입 정의
```

## 외부 API
| API | 용도 | Rate Limit |
|-----|------|------------|
| Alpaca Markets | 미국주식 실시간 시세 | 200/분 |
| 한국투자증권 | 거래내역, 잔고, 국내시세 | - |
| Finnhub | 뉴스 수집 | 60/분 |
| Claude (Haiku) | 뉴스 요약 | - |

## 환경변수
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ALPACA_API_KEY
ALPACA_SECRET_KEY
KIS_APP_KEY
KIS_APP_SECRET
KIS_ACCOUNT_NO
FINNHUB_API_KEY
ANTHROPIC_API_KEY
WHITELIST_EMAILS
```

## 데이터베이스 테이블
- `profiles`: 사용자 프로필 (auth.users 연동)
- `whitelist`: 허용된 이메일 목록
- `portfolios`: 포트폴리오 (종목별 보유량)
- `transactions`: 거래 내역
- `broker_connections`: 증권사 API 연동 정보
- `news_cache`: 뉴스 캐시

## 코딩 규칙
1. TypeScript strict mode 필수
2. Server Component 우선 (클라이언트는 'use client' 명시)
3. 모든 API 응답은 Zod로 검증
4. API 키는 절대 클라이언트에 노출하지 않음
5. Supabase RLS 필수 적용
6. 한국어 주석 허용
7. 커밋 메시지: feat/fix/refactor/docs + 설명

## 자주 사용하는 패턴

### Server Component 데이터 페칭
```typescript
// app/(dashboard)/page.tsx
import { createServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('*');
  
  return <PortfolioList portfolios={portfolios} />;
}
```

### API Route
```typescript
// app/api/quotes/route.ts
import { NextResponse } from 'next/server';
import { getQuotes } from '@/lib/apis/alpaca';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',') || [];
  
  const quotes = await getQuotes(tickers);
  return NextResponse.json(quotes);
}
```

### TanStack Query 사용
```typescript
'use client';
import { useQuery } from '@tanstack/react-query';

function PortfolioValue() {
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', 'value'],
    queryFn: () => fetch('/api/portfolio').then(r => r.json()),
    staleTime: 1000 * 60, // 1분
  });
  
  if (isLoading) return <Skeleton />;
  return <Metric value={data.totalValue} />;
}
```

## 현재 진행 상황
- [ ] 프로젝트 초기화
- [ ] Supabase 연동
- [ ] SSO 로그인 (네이버/카카오)
- [ ] 포트폴리오 대시보드
- [ ] 실시간 시세 연동
- [ ] 거래 내역 동기화
- [ ] 뉴스 피드

## spec-kit 명령어
```
/speckit.constitution  # 프로젝트 원칙 생성/수정
/speckit.specify       # 기능 명세 작성
/speckit.clarify       # 명세 명확화
/speckit.plan          # 기술 구현 계획
/speckit.tasks         # 작업 분해
/speckit.implement     # 구현 실행
```

---
*Constitution 파일: .specify/memory/constitution.md 참조*
