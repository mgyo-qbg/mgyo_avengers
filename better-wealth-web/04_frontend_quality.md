# 프론트엔드 품질/테스트 — 프론트개발자-하은

## 테스트 현황

### 단위 테스트 (Vitest + Testing Library)
- **테스트 파일 2개** (828개 파일 대비 0.24%)
  - `formatters.test.ts`
  - `jwtUtils.test.ts`
- Vitest, Testing Library, Playwright 모두 설정되어 있으나 거의 미활용

### Storybook
- 104개 `.stories.tsx` 파일 — 시각적 테스트에 의존
- 주로 components/ 레벨에서 잘 작성됨

## 반응형 웹 현황
- TailwindCSS 3 + SCSS 사용
- 데스크톱 중심 레이아웃
- 모바일 FA 활용 시나리오 대응 미비

## 접근성 (a11y)
- @headlessui/react 사용 (접근성 지원 UI)
- 별도의 a11y 테스트 미확인

## API 연동 방식
- Axios 기반 HTTP 클라이언트
- 22개 도메인별 API 모듈 분리
- TanStack React Query v4로 서버 상태 관리
- API 함수와 커스텀 훅이 같은 파일에 공존 (co-location) — 테스트/재사용성 저하

## ESLint 설정 이슈
- `react-hooks/exhaustive-deps: 'off'` — TanStack Query 플러그인에 위임, 일반 useEffect 검증 빠질 수 있음
- `@typescript-eslint/no-unsafe-assignment: 0`
- `@typescript-eslint/no-unsafe-member-access: 0`
- 여러 파일에서 `// eslint-disable-next-line` 주석

## Redux 설정 이슈
- `serializableCheck: false` — 비직렬화 데이터가 store에 들어갈 위험
- `immutableCheck: false` — 불변성 검증 비활성화

## 주요 개선 포인트

### 높은 우선순위
1. **테스트 커버리지 확보** — 비즈니스 로직, 커스텀 훅, API 연동 테스트 필수
2. **react-hooks/exhaustive-deps 재활성화** 검토

### 중간 우선순위
3. TanStack Query v4 → v5 마이그레이션 고려
4. Storybook v7 → v8 업그레이드
5. 디자인 토큰 CI 통합 (현재 수동 실행)

### 낮은 우선순위
6. Shared Package 빌드 의존성 자동화 (`prepare` 스크립트)
7. 모바일 반응형 대응 강화
