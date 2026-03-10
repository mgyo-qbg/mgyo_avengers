# 프론트엔드 아키텍처 — 프론트개발자-지호

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


## 규모
- 828개 TS/TSX 파일
- 321개 디렉토리

## 폴더 구조 (Feature-based + Layer-based 혼합)

```
src/
├── api/           # 도메인별 API 레이어 (22개 파일)
├── components/    # 재사용 UI (charts, forms, layout, ui)
├── config/        # 환경설정 (host URL, 인증 역할, GNB 네비게이션)
├── contexts/      # React Context (JwtContext, ExternalContext)
├── features/      # 도메인별 비즈니스 로직 (13개 도메인)
│   ├── auth, customer, investment, retirement
│   ├── portfolio, models, dashboard, report
│   ├── fa-management, calculation, settings, common
├── guards/        # AuthGuard, GuestGuard, RoleBasedGuard, PdfGuard, ExternalGuard
├── hooks/         # 커스텀 훅 17개
├── layouts/       # DashboardLayout (advisor/client 모드)
├── pages/         # 라우팅 진입점
├── providers/     # Redux, React Query Provider
├── routes/        # 라우팅 설정 (elements, paths, index)
├── store/         # Redux 슬라이스 10개
├── types/         # 타입 정의
└── utils/         # 유틸리티 함수
```

## Provider 계층

```
StrictMode → ErrorBoundary → HelmetProvider → ReduxProvider → RQProvider
→ BrowserRouter → AuthProvider → ExternalProvider → App
```

## 라우팅 구조 (4개 영역)
- `/auth/*` — 인증
- `/dashboard/advisor/*` — FA 대시보드
- `/dashboard/client/*` — 고객 상세
- `/external/*` — 외부 접근
- `/pdf/*` — PDF 리포트 (40개 이상 경로)

## 기술 스택

| 카테고리 | 라이브러리 | 버전 |
|---------|-----------|------|
| 프레임워크 | React 18 + TypeScript 5 + Vite 4 (SWC) | - |
| 라우팅 | react-router-dom v6 | ^6.14.2 |
| 상태관리 | Redux Toolkit + redux-persist | ^1.9.5 |
| 서버 상태 | TanStack React Query v4 | ^4.32.6 |
| HTTP | Axios | ^1.4.0 |
| 폼 | react-hook-form + yup | ^7.45.4 |
| 차트 | Visx (D3 기반, 16개 패키지) | ^3.x |
| 스타일링 | TailwindCSS 3 + SCSS | - |
| 리치에디터 | Lexical (10개 패키지) | ^0.23.1 |
| 테스트 | Vitest + Testing Library + Playwright | - |
| 문서화 | Storybook 7 (stories 104개) | - |
| 디자인토큰 | Figma → token-transformer → style-dictionary | - |

## 상태 관리 (3계층)

### Redux Toolkit (10개 슬라이스)
- auth, user, customer, gnb, dialog, options, router, common, locale, native
- Persist 대상: customer, user, options, router, common (localStorage)
- serializableCheck: false, immutableCheck: false (주의 필요)

### TanStack React Query v4
- 22개 API 모듈, 112개+ useQuery/useMutation
- refetchOnWindowFocus: false, retry: 0

### React Context
- JwtContext: JWT 인증 플로우 (useReducer, 317줄 — 비대)
- ExternalContext: 외부 연동

## 성능 최적화
- Route-level Code Splitting: 모든 페이지 React.lazy + Suspense (`Loadable` HOC)
- SWC 컴파일러 (Babel 대비 20배 빠름)
- useMemo/useCallback 523회 사용
- LazyLoadImage 컴포넌트
- redux-persist로 초기 로딩 최적화

## 주요 이슈

### 높은 우선순위
1. **테스트 파일 2개** (828개 파일 대비 0.24%) — 금융 서비스에서 치명적
2. **eslint-disable 남용** — react-hooks/exhaustive-deps 전역 비활성화
3. Redux serializableCheck/immutableCheck 비활성화

### 중간 우선순위
4. JwtContext 비대 (317줄) — 관심사 분리 필요
5. API + React Query 훅 혼합 (co-location 패턴 — 테스트 어려움)
6. PDF 라우트 40개+ — 동적 라우팅으로 단순화 가능
7. 애니메이션 라이브러리 중복 (framer-motion + @react-spring/web)

### 낮은 우선순위
8. vite.config.ts에서 require() 사용 (ESM 프로젝트에서 CJS)
9. 오타: `retirement-anlaysis`, `anlaysis` 폴더명
10. Storybook v7 → v8, TanStack Query v4 → v5 업그레이드 고려

## Node 버전 불일치
- CLAUDE.md: Node 16.x 명시
- package.json: `>=18 <19` (실제 18.x 사용)
