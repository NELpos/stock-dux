# 📜 InvestFlow Constitution

> 이 문서는 프로젝트의 비협상 원칙을 정의합니다. 모든 개발 결정은 이 원칙을 따라야 합니다.

---

## 1. 기술 스택 (비협상)

### 프레임워크
- **Next.js 16+** (App Router, Server Components, Server Actions)
- React 19+ (use hook, Server Components 우선)
- TypeScript 5.x (strict mode 필수)

### 데이터베이스 & 인증
- **Supabase PostgreSQL** (관리형, RLS 필수)
- **Supabase Auth** (구글/네이버/카카오 SSO)
- Prisma 또는 Drizzle ORM 사용 금지 (Supabase 클라이언트 직접 사용)

### 배포
- **Vercel** (GitHub 연동, Preview Deployments)
- Edge Runtime 우선 고려 (API Routes)

### UI/UX
- **Tailwind CSS** (utility-first)
- **shadcn/ui** (기본 컴포넌트)
- **Tremor** (차트, 대시보드 컴포넌트)
- Framer Motion (애니메이션, 선택적)

### 상태관리
- **TanStack Query v5** (서버 상태)
- **Zustand** (클라이언트 상태, 필요시)
- React Context (경량 전역 상태)

---

## 2. 코드 품질 기준

### TypeScript
```typescript
// ✅ 권장
interface Portfolio {
  id: string;
  userId: string;
  ticker: string;
  quantity: number;
  avgPrice: number;
}

// ❌ 금지
const portfolio: any = { ... };
```

### 컴포넌트 구조
- **Server Component 우선** (데이터 페칭은 서버에서)
- 클라이언트 컴포넌트는 `'use client'` 명시
- 클라이언트 컴포넌트 최소화 (인터랙티브 요소만)

```typescript
// ✅ Server Component (기본)
async function PortfolioList() {
  const portfolios = await getPortfolios();
  return <div>{/* 렌더링 */}</div>;
}

// ✅ Client Component (필요시만)
'use client';
function InteractiveChart({ data }) {
  const [selected, setSelected] = useState(null);
  return <div>{/* 인터랙티브 차트 */}</div>;
}
```

### API 응답 검증
- 모든 외부 API 응답은 **Zod**로 검증
- 타입 추론 자동화

```typescript
import { z } from 'zod';

const AlpacaQuoteSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  timestamp: z.string(),
});

type AlpacaQuote = z.infer<typeof AlpacaQuoteSchema>;
```

### 에러 처리
- 모든 페이지에 Error Boundary 적용
- API 에러는 구조화된 응답 반환
- 사용자 친화적 에러 메시지 (한국어)

---

## 3. 보안 기준

### API 키 관리
- **서버 사이드에서만 사용** (절대 클라이언트 노출 금지)
- Vercel 환경변수로 관리
- `.env.local`은 `.gitignore`에 포함

### Supabase RLS
- **모든 테이블에 RLS 활성화** (필수)
- 사용자 본인 데이터만 접근 가능
- 서비스 역할 키는 서버 사이드에서만 사용

```sql
-- 예시 RLS 정책
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);
```

### 인증
- 화이트리스트 방식 접근 제어 (MVP)
- 세션 만료 시 자동 로그아웃
- CSRF 보호 (Next.js 기본 제공)

---

## 4. 테스트 기준

### 필수 테스트
- **단위 테스트 (Vitest)**: 비즈니스 로직, 유틸리티 함수
- **통합 테스트**: API Routes, Supabase 쿼리

### 선택적 테스트
- E2E 테스트 (Playwright): 핵심 사용자 플로우
- 스냅샷 테스트: UI 컴포넌트

### 테스트 커버리지
- 핵심 비즈니스 로직 80% 이상
- API Routes 100%

---

## 5. 성능 기준

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: 3초 이내
- **FID (First Input Delay)**: 100ms 이내
- **CLS (Cumulative Layout Shift)**: 0.1 이내

### 번들 최적화
- 초기 로드 번들: **500KB 이내**
- 코드 스플리팅 적극 활용
- 이미지 최적화 (`next/image` 필수)

### 데이터 페칭
- 중요 데이터: Server Component에서 페칭
- 실시간 데이터: TanStack Query + 폴링 (1분 간격)
- 캐싱 전략 명시 (`staleTime`, `gcTime`)

---

## 6. 코드 컨벤션

### 파일 명명
```
components/
  ├── dashboard/
  │   ├── PortfolioCard.tsx      # PascalCase
  │   ├── portfolio-card.test.ts # kebab-case (테스트)
  │   └── index.ts               # barrel export
  
lib/
  ├── apis/
  │   ├── alpaca.ts              # kebab-case
  │   └── kis.ts                 
  └── utils/
      └── format-currency.ts     # kebab-case
```

### 함수 명명
```typescript
// 컴포넌트: PascalCase
function PortfolioCard() { ... }

// 일반 함수: camelCase
function calculateTotalValue() { ... }

// API 핸들러: HTTP 메서드 + 명사
async function getPortfolios() { ... }
async function createTransaction() { ... }
```

### 한국어 사용
- **주석**: 한국어 허용
- **커밋 메시지**: 한국어 또는 영어 (일관성 유지)
- **UI 텍스트**: 한국어 우선
- **코드 (변수, 함수)**: 영어만

```typescript
// ✅ 허용
// 총 자산 가치 계산 (원화 환산)
function calculateTotalValue(portfolios: Portfolio[], exchangeRate: number) {
  return portfolios.reduce((sum, p) => sum + p.value * exchangeRate, 0);
}

// ❌ 금지
function 총자산계산() { ... }
```

---

## 7. Git 워크플로우

### 브랜치 전략
- `main`: 프로덕션 배포
- `develop`: 개발 통합
- `feature/xxx`: 기능 개발
- `fix/xxx`: 버그 수정

### 커밋 메시지
```
feat: 포트폴리오 대시보드 구현
fix: 한국투자증권 API 토큰 갱신 오류 수정
refactor: API 클라이언트 구조 개선
docs: README 업데이트
```

### PR 규칙
- 최소 셀프 리뷰 후 머지 (5인 팀)
- Vercel Preview 배포 확인 필수

---

## 8. 비용 제약

### 월간 예산
- **총 예산**: $50 이내
- AI (Claude API): ~$7
- 인프라 (Vercel/Supabase): 무료 티어
- 데이터 API: 무료 티어 활용

### 비용 최적화 전략
- AI 요청 배치 처리
- 캐싱 적극 활용
- 불필요한 API 호출 최소화

---

## 9. 금지 사항

### 절대 금지
- [ ] `any` 타입 사용
- [ ] 클라이언트에 API 키 노출
- [ ] RLS 없는 테이블 생성
- [ ] 테스트 없이 핵심 로직 배포
- [ ] `console.log` 프로덕션 배포

### 사전 승인 필요
- [ ] 새로운 외부 라이브러리 추가
- [ ] 데이터베이스 스키마 변경
- [ ] 유료 API 티어 업그레이드

---

*이 Constitution은 프로젝트 전체의 품질 기준입니다. 모든 코드는 이 원칙을 준수해야 합니다.*
