<!--
Sync Impact Report:
- Version: 1.0.0 (Initial constitution)
- Ratification Date: 2026-02-01
- Modified Principles: N/A (initial creation)
- Added Sections: All sections (initial creation)
- Removed Sections: N/A
- Templates Status:
  ✅ .specify/templates/plan-template.md - Reviewed, compatible
  ✅ .specify/templates/spec-template.md - Reviewed, compatible
  ✅ .specify/templates/tasks-template.md - Reviewed, compatible
- Follow-up TODOs: None
-->

# InvestFlow Constitution

## Core Principles

### I. 기술 스택 (비협상)

**Frontend/Backend**: Next.js 16+ (App Router, Server Components)
**Database**: Supabase PostgreSQL
**Auth**: Supabase Auth (네이버/카카오 SSO)
**배포**: Vercel
**UI**: Tailwind CSS + shadcn/ui + Tremor
**상태관리**: TanStack Query (서버 상태), Zustand (클라이언트 상태)

**근거**: 이 스택은 프로젝트의 비기능 요구사항(5명 → 50명 확장성, 월 $50 비용 제한, 3초 이내 로딩)을 만족시키는 검증된 조합입니다. Next.js 16은 서버 컴포넌트로 초기 로딩 성능을 최적화하고, Supabase는 무료 티어로 소규모 그룹을 지원하며, Vercel은 자동 CI/CD를 제공합니다.

**비협상 이유**: 다른 기술 선택은 비용 증가, 성능 저하, 또는 개발 복잡도 증가를 초래합니다. 예를 들어 별도의 백엔드 서버는 인프라 비용을 증가시키고, 다른 DB는 Auth 통합 비용이 발생합니다.

### II. 타입 안전성 및 검증

**MUST**:
- TypeScript strict mode 필수 활성화
- 모든 외부 API 응답에 Zod 스키마 검증 적용
- 서버/클라이언트 간 데이터 전달 시 타입 검증

**근거**: 금융 데이터를 다루는 애플리케이션의 특성상 데이터 무결성은 핵심입니다. 런타임 검증 없이는 API 변경, 잘못된 환율 계산, 또는 포트폴리오 수익률 오류가 발생할 수 있습니다. Alpaca API, 한국투자증권 API, Finnhub API 등 여러 외부 소스를 통합하므로 스키마 검증은 필수입니다.

### III. 서버 우선 아키텍처

**MUST**:
- Server Component를 기본으로 사용
- 클라이언트 컴포넌트는 상호작용이 필요한 경우에만 'use client' 명시
- API Routes는 Edge Runtime 우선 고려 (성능 요구사항이 있는 경우)

**근거**: 초기 로딩 3초 이내, 번들 사이즈 500KB 이내 목표를 달성하기 위해 서버 렌더링을 최대한 활용합니다. 금융 대시보드는 실시간 상호작용보다 빠른 초기 렌더링이 더 중요합니다.

### IV. 에러 처리 및 복원력

**MUST**:
- 모든 비동기 작업에 에러 바운더리 적용
- 외부 API 호출 실패 시 폴백 처리 또는 명확한 사용자 피드백
- 네트워크 오류, 타임아웃, 인증 실패 등 각 케이스별 에러 핸들링

**근거**: Alpaca, 한국투자증권, Finnhub 등 여러 외부 API에 의존하므로 일부 API 장애가 전체 서비스 중단으로 이어지면 안 됩니다. 특히 주식 시장 개장 시간에 시세 조회 실패는 사용자 경험을 크게 저하시킵니다.

### V. 보안 규칙

**MUST**:
- 모든 외부 API 키는 서버 사이드에서만 사용 (클라이언트 노출 금지)
- Supabase Row Level Security (RLS) 모든 테이블에 적용
- 사용자 데이터 격리 검증 (user_id 기반 필터링)
- 환경변수는 `.env.local`에 저장, 커밋 금지

**근거**: 금융 데이터의 민감성과 개인정보보호법 준수를 위해 필수입니다. 한 사용자가 다른 사용자의 포트폴리오나 거래 내역에 접근하는 것은 치명적인 보안 사고입니다. 또한 API 키 노출 시 비용 폭탄 및 계정 정지 위험이 있습니다.

## 코드 품질 기준

### 테스트 전략

**핵심 비즈니스 로직**:
- 포트폴리오 가치 계산 로직은 Vitest로 단위 테스트 필수
- 환율 변환, 수익률 계산, 거래 내역 집계 등 재무 계산은 테스트 필수

**API 통합 테스트**:
- 한국투자증권 API 연동 로직은 통합 테스트 필수
- Alpaca, Finnhub API 호출은 모킹하여 테스트

**E2E 테스트** (선택적):
- Chrome Devtools MCP를 활용한 주요 사용자 플로우 검증
- 로그인 → 대시보드 조회 → 거래 동기화 시나리오

**근거**: 금융 계산 오류는 사용자 신뢰를 잃게 만듭니다. 수익률 계산, 평균 단가 계산 등은 자동화된 테스트 없이 신뢰할 수 없습니다.

### 코드 스타일 및 구조

**MUST**:
- 한 파일당 하나의 책임 (Single Responsibility)
- 컴포넌트는 200줄 이하 권장 (분리 고려)
- API Route는 하나의 엔드포인트당 하나의 파일
- 비즈니스 로직은 `lib/` 디렉토리에 순수 함수로 분리

**근거**: 5명의 소규모 그룹이지만 코드베이스가 성장하면 유지보수가 어려워집니다. 명확한 구조는 빠른 디버깅과 기능 추가를 가능하게 합니다.

## 성능 기준

### 핵심 지표

**MUST**:
- Largest Contentful Paint (LCP): 3초 이내
- 초기 번들 사이즈: 500KB 이내
- 이미지 최적화: Next.js Image 컴포넌트 사용, WebP/AVIF 형식

**SHOULD**:
- Time to Interactive (TTI): 5초 이내
- First Input Delay (FID): 100ms 이내
- 대시보드 데이터 페칭: 병렬 처리로 2초 이내

**근거**: PRD의 비기능 요구사항에 명시된 "대시보드 초기 로딩 3초 이내"를 달성하기 위한 구체적인 지표입니다. 금융 대시보드는 빠른 정보 접근이 핵심 가치입니다.

### 캐싱 전략

**MUST**:
- 실시간 시세: TanStack Query로 1분 캐싱 (`staleTime: 60000`)
- 뉴스 데이터: 15분 캐싱
- 재무제표: 24시간 캐싱
- 포트폴리오 잔고: 한국투자증권 API 호출 최소화 (일 1회 자동 동기화)

**근거**: Alpaca 200req/분, Finnhub 60req/분 등 API Rate Limit을 준수하고, 불필요한 네트워크 호출을 줄여 성능을 개선합니다.

## 한국어 컨벤션

### 코드 및 문서

**주석**: 한국어 허용 (복잡한 비즈니스 로직 설명 시 권장)
**커밋 메시지**: 한국어 또는 영어 (일관성 유지)
**사용자 대면 텍스트**: 한국어 우선 (UI 레이블, 에러 메시지, 알림 등)
**변수/함수명**: 영어 사용 (국제 표준)

**예시**:
```typescript
// ✅ 좋은 예: 복잡한 로직에 한국어 주석
// 평균 단가는 (총 매수 금액 + 수수료) / 총 수량으로 계산
// 환율은 매수 당시 환율을 적용
const calculateAvgPrice = (transactions: Transaction[]) => {
  // ...
};

// ✅ 사용자 대면 메시지는 한국어
throw new Error("포트폴리오 조회에 실패했습니다. 잠시 후 다시 시도해주세요.");

// ❌ 나쁜 예: 변수명에 한글 사용
const 평균단가 = calculateAvgPrice(거래내역);
```

**근거**: 이 프로젝트는 한국 사용자 대상이며, 복잡한 금융 로직을 설명할 때 한국어가 더 명확합니다. 단, 코드 자체는 영어로 유지하여 국제 표준을 따릅니다.

## 개발 워크플로우

### Git 컨벤션

**브랜치 전략**:
- `main`: 프로덕션 배포 브랜치
- `feature/###-feature-name`: 기능 개발 브랜치
- `fix/###-bug-name`: 버그 수정 브랜치

**커밋 메시지 형식**:
```
<type>: <description>

<optional body>
```

**Type**:
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `docs`: 문서 변경
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

**예시**:
```
feat: Add portfolio sync with Korea Investment API

- Implement OAuth token refresh logic
- Add transaction history fetch endpoint
- Handle API rate limiting with retry
```

**근거**: spec-kit 워크플로우와 통합하여 추적 가능한 개발 이력을 유지합니다.

### 코드 리뷰 기준

**MUST**:
- Constitution 원칙 준수 확인
- 보안 규칙 위반 여부 (API 키 노출, RLS 미적용)
- 타입 안전성 (any 사용 금지, Zod 검증)
- 성능 영향 (번들 사이즈, 캐싱 전략)

**SHOULD**:
- 테스트 커버리지 (핵심 로직만)
- 접근성 (스크린 리더, 키보드 네비게이션)
- 에러 핸들링 품질

**근거**: 5명의 소규모 그룹이지만 코드 품질을 유지하기 위해 최소한의 리뷰 기준이 필요합니다.

## Governance

### Constitution 준수

**모든 새 기능 및 변경 사항은 이 Constitution을 준수해야 합니다.**

- Pull Request는 Constitution Check 통과 필수
- 원칙 위반이 필요한 경우 명확한 정당화 및 문서화 필요
- 복잡도 증가는 비즈니스 가치로 정당화되어야 함

### Amendment Process

**Constitution 수정 절차**:
1. 수정 제안 및 근거 문서화
2. 영향받는 코드베이스 범위 파악
3. 마이그레이션 계획 수립
4. 팀 승인 후 버전 업데이트

**Version 정책**:
- MAJOR: 비호환 원칙 제거/재정의
- MINOR: 새로운 원칙 추가/확장
- PATCH: 문구 명확화, 오타 수정

### Compliance Review

**정기 검토**:
- 새 기능 개발 시 plan.md의 "Constitution Check" 섹션 필수
- 분기별 Constitution 적합성 리뷰
- 위반 사례 발견 시 즉시 수정 또는 정당화

**근거**: Constitution이 형식적 문서가 되지 않도록 실제 개발 프로세스에 통합합니다.

---

**Version**: 1.0.0 | **Ratified**: 2026-02-01 | **Last Amended**: 2026-02-01
