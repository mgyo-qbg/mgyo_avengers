# 웹-기획자 컨텍스트

작성일: 2026-03-10
최종 업데이트: 2026-03-10
담당: 웹-기획자1

---

## 역할 및 책임

웹-기획자1은 이슈 단위가 아닌 **제품 단위**로 사고한다.

- **스펙 확정 게이트키퍼**: Phase 2(스펙 초안) → Phase 3(스펙 확정) 전환 전 반드시 검토
- **교차 이슈 정합성 검증**: 동시 진행 이슈 간 상충 요건 탐지 및 플래그
- **제품 현황 관리**: 구현 완료된 기능/API 목록 최신 유지
- **아키텍처 원칙 관리**: 모든 이슈에 공통 적용되는 기술 원칙 수립 및 관리

> 워크플로우 상세: `issues/WORKFLOW.md`

---

## 서비스 파일 정보

- 레포: `/Users/imsi/Desktop/qbg/repo/better-wealth-fa`
- 구조: pnpm monorepo — be-nest / fe-react-app / be-fastapi
- Git 커밋 컨벤션: `[fa] #{이슈번호} {메시지}`

---

## 제품 현황 — 구현 완료 기능

| 도메인 | 기능 | 주요 파일/엔드포인트 | 비고 |
|--------|------|-------------------|------|
| 인증 | FA 로그인/로그아웃, JWT | `advisor-user.controller.ts` | ignoreExpiration: true (보안 이슈) |
| 고객 관리 | 고객 CRUD, 가족 정보 | `customer.controller.ts` | 가족 성명/생년월일 미암호화 (Critical) |
| 은퇴설계 | 설계 생성/조회/PDF | `retirement.controller.ts` | — |
| 투자설계 | 설계 생성/조회/PDF | `investment.controller.ts` | — |
| 마이데이터 | 자산 연동 | `mydata.controller.ts` | — |
| Nudge (FastAPI) | AI 투자진단, 은퇴분석 | `apps/be-fastapi/` 포트 13550 | CORS 전체 허용 (Critical) |

---

## 확정된 아키텍처 원칙

이슈 완료 시 도출된 원칙을 여기에 누적한다. 신규 이슈 스펙 검토 시 위반 여부를 반드시 확인한다.

| 원칙 | 근거 | 적용 범위 |
|------|------|---------|
| Git 커밋: `[fa] #{번호}` 형식 준수 | CLAUDE.md | 전체 |
| 브랜치: `feature/#번호-설명` 패턴 | CLAUDE.md | 전체 |
| 공유 타입/상수: `@package/shared-consts` 사용 | 기존 아키텍처 | FE/BE 공통 |
| API 응답 포맷 통일 (NestJS 기준) | 코드리뷰 분석 | BE 전체 |

---

## 즉각 조치 필요 이슈 (Critical — 신규 이슈 작업 전 인지 필수)

| # | 이슈 | 위치 | 담당 |
|---|------|------|------|
| 1 | .env Git 노출 | environments/.env.*, apps/be-fastapi/.env.* | 웹-인프라1 |
| 2 | CustomerFamily 성명/생년월일 미암호화 | prisma/schema.prisma | 웹-백엔드1 |
| 3 | TestCustomer CI/전화번호 평문 저장 | prisma/schema.prisma | 웹-백엔드1 |
| 4 | CORS 전체 허용 | main.ts, main.py | 웹-백엔드1/2 |
| 5 | 비밀번호 재설정 Guard 미적용 | advisor-user.controller.ts:105-131 | 웹-백엔드1 |
| 6 | FastAPI pickle RCE 취약점 | fncache.py | 웹-백엔드2 |

---

## 진행 중 이슈

| 번호 | 이슈명 | Phase | 교차 의존성 |
|------|--------|-------|-----------|
| — | — | — | — |

---

## 교차 이슈 충돌 이력

| 날짜 | 이슈 A | 이슈 B | 충돌 내용 | 해결 방식 |
|------|--------|--------|---------|---------|
| — | — | — | 아직 없음 | — |
