# 법률/컴플라이언스 — 법률전문가-혜림 + 코드리뷰어-유진

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


## 1. 개인정보 처리 현황

### 암호화 현황 (prisma-field-encryption, AES-GCM-256)

| 모델 | 암호화 필드 (`/// @encrypted`) | 해시 필드 |
|------|-------------------------------|---------|
| Customer | name, birthDate, phoneNum, ci, di, email | phoneNumHash, ciHash, diHash, emailHash |
| AdvisorUser | email, userName, phoneNum | emailHash, userNameHash, phoneNumHash |
| CustomerFamily | name, birthDate | 없음 |
| AdvisorOrgs | bizNum (사업자등록번호) | 없음 |

**양호한 부분:**
- application-level 암호화 — DB 직접 접근 시 복호화 불가
- 검색용 hash 필드 분리 — 암호화 필드 검색 보완
- 해시 필드 기반 정확 매칭 검색 구현

**[Critical] 미암호화 필드:**

| 테이블 | 미암호화 필드 | 법적 위험 |
|--------|-------------|---------|
| CustomerFamily | name (성명), birthDate (생년월일) | 개인정보보호법 제29조 위반 |
| TestCustomer | phoneNum, name, dumpCi (CI) | CI는 고유식별정보 — 최고 수준 보호 필요 |
| Customer | address (주소) | 개인정보보호법상 개인정보 |
| AdvisorUserLoginHistory | ipAddress | 대법원 판례상 개인정보 |
| AllianceOrgs | clientSecret | 인증 정보 평문 저장 |

**코드 버그:**
- `customer.service.ts:157-165`: 암호화된 name, phoneNum, email에 직접 `contains` 검색 시도
- 암호화 필드는 부분 검색 불가 (hash 필드 기반 정확 매칭만 가능) — 기능 오류 가능성
- `birthDate` 해시 필드 없어 생년월일 기반 검색 시 전체 스캔 필요

## 2. 금융규제 준수 현황

### 자본시장법 (투자자문업)

**확인된 기능:**
- CustomerAssetsManaged: advisoryType, contractDate, productCode — 투자자문/일임 계약 관리
- AssetsMatchedModelPortfolio: 고객별 모델 포트폴리오 매칭 기록
- CustomerInvestTendencyEvent: 투자성향 측정 관리
- CUSTOMER_INVESTMENT_RISK_PROFILE_NOT_MATCH 에러 — 적합성 원칙 기반 제한
- 고객 삭제 시 투자자문·일임 계약 존재 여부 확인 (`403003`) — 계약 중 고객 삭제 방지
- PDF 보고서 및 진단 모듈 — 투자 설명 자료 제공 기능

**[High] 보완 필요:**
1. **적합성 보고서 기록 테이블 부재** — 자본시장법 제46조: 투자권유 사유 기록 및 10년 보존 의무
2. **투자권유 기록 보존의무 (5년)** — 자본시장법 제60조, 보존 정책 미정의
3. **투자자문 계약서 전자서명/동의 기록 없음**
4. **설명의무 이행 기록 없음** — 금융소비자보호법 제19조

### 금융소비자보호법

**확인:**
- CustomerInvestBias: 투자 편향 진단
- 재무진단, 블루프린트, 은퇴계획 모듈 — 고객 맞춤형 분석
- 해지(`surrender/`) 모듈 존재
- `DeletionConfirmationModal.tsx`: 2단계 확인 절차 (체크박스 + 최종 확인)

**[Medium] 보완 필요:**
1. 금융상품 설명서 제공/확인 이력 미관리
2. 고객 민원/분쟁 관리 테이블 부재
3. 고객 삭제 시 법적 보존의무 기간 내 데이터까지 일괄 삭제 위험

### 전자금융거래법

**양호:**
- AdvisorUserLoginHistory — 로그인 기록
- 2FA, 5회 오류 계정 잠금, JWT + Passport, Helmet

**[High] 보완 필요:**
1. **CORS 전체 허용** — 전자금융감독규정 제15조 위반 가능
2. **Rate Limiting 미적용** — 비정상 접근 탐지/차단 의무
3. **접근 로그 5년 보존 정책 미확인** — 전자금융거래법 제22조

## 3. 이용약관/개인정보처리방침

### 약관 체계 (Strapi CMS 기반 외부 관리)

| 약관 유형 | 약관 ID | 설명 | 필수 여부 |
|---------|---------|------|---------|
| FA_ADVISOR | T0055 | 개인정보 수집·이용 동의 | 필수 |
| FA_ADVISOR | T0056 | 서비스 이용약관 | 필수 |
| FA_ADVISOR | T0057 | 개인정보 처리방침 | 필수 |
| FA_ADVISOR | T0058 | 광고성 정보 수신동의 | 선택 |
| FINANCIAL_PLANNING | - | 재무설계 약관 | 필수 |
| VERIFICATION | - | 본인인증 약관 | 필수 |
| THIRDPARTY | - | 제3자 정보제공 동의 | 필수 |

### 구현 현황

**양호:**
- TermsHistory: termId, agree, version, target, targetId, 타임스탬프 — 동의 증빙
- TermsMarketingHistory: 채널별 동의 (SMS/Email/Push) 세분화
- 필수 약관 미동의 시 `TERMS_REQUIRED_NOT_AGREE` 예외 차단
- 약관 버전 변경 시 재동의 요구 (`TERM_NOT_VALID` 검증)
- 마케팅 동의 별도 분리 + 선택사항 처리

**[High] 보완 필요:**
1. **동의 철회 이력 미기록** — agree 필드 update로 덮어씀, append-only로 변경 필요
2. **필수 약관 철회 처리 흐름 불명확** — 개인정보보호법 제37조(처리정지) 대응 미흡
3. **제3자 제공 동의 상세 미확인** — 제공 대상, 목적, 항목 코드상 미확인

## 4. 오픈소스 라이선스

### 프로젝트 라이선스

| 패키지 | 라이선스 |
|--------|---------|
| apps/be-nest | UNLICENSED (독점) |
| apps/fe-react-app | 미지정 (private: true) |
| apps/be-fastapi | ISC |
| packages/shared-consts | ISC |

### 주요 의존성 — 전체 평가: GPL 감염 위험 없음 (양호)

| 라이선스 | 주요 패키지 |
|---------|-----------|
| MIT | React, NestJS, Vite, TailwindCSS, Redux, Axios, React Hook Form, TanStack Query, lodash, dayjs, Passport |
| Apache-2.0 | Prisma, RxJS |
| BSD-2/BSD-3 | D3 계열, NumPy, SciPy, uvicorn, pandas |
| ISC | Node.js 유틸리티 다수 |

**주의사항:**
- openai — MIT이나 **OpenAI API 이용약관 별도 확인** (고객 금융정보 전송 시 국외 개인정보 이전 동의 필요)
- yfinance — Apache-2.0이나 **Yahoo Finance 상업적 이용 약관 확인 필요**
- fncache.py — 외부 코드 직접 포함, 라이선스 표기 없음
- NOTICE 파일 없음 — Apache-2.0 사용 시 고지 의무 존재

## 5. 법적 리스크 및 권고사항

### [Critical] 즉시 조치

| # | 항목 | 권고 |
|---|------|------|
| 1 | .env 파일 Git 노출 (JWT secret, DB 비밀번호, API 키) | Vault/Secret Manager 도입, Git 이력 제거, 키 로테이션 |
| 2 | CustomerFamily 성명/생년월일 미암호화 | prisma-field-encryption 적용 |
| 3 | TestCustomer CI/전화번호 평문 저장 | 더미 데이터 대체 또는 암호화 |
| 4 | CORS 전체 허용 (NestJS + FastAPI) | 허용 도메인 화이트리스트 적용 |
| 5 | JWT ignoreExpiration: true | JWT 만료 검증 복원 (defense-in-depth) |
| 6 | FastAPI 내부 에러 정보 외부 노출 | str(exc) 제거 |

### [High] 조기 보완

| # | 항목 | 관련 법령 |
|---|------|---------|
| 7 | 적합성 보고서 기록 체계 구축 | 자본시장법 제46조 |
| 8 | 투자권유 기록 5년 보존 정책 | 자본시장법 제60조 |
| 9 | Rate Limiting 구현 | 전자금융감독규정 |
| 10 | 약관 동의 철회 API 및 append-only 이력 | 개인정보보호법 제37조 |
| 11 | 접근 로그 5년 보존 정책 | 전자금융거래법 제22조 |
| 12 | 고객 삭제 시 법적 보존 데이터 아카이빙 분리 | 자본시장법 등 |
| 13 | 개인정보 접근 감사 로그 구현 | 개인정보보호법 시행령 제30조 |

### [Medium] 중기 개선

| # | 항목 |
|---|------|
| 14 | Customer.address 암호화 |
| 15 | OpenAI 국외 개인정보 이전 동의 검토 |
| 16 | yfinance 상업적 이용 약관 검토 |
| 17 | fncache.py 라이선스 표기 (NOTICE 파일) |
| 18 | 금융상품 설명서 전자문서 관리 체계 |
| 19 | 암호화 필드 직접 contains 검색 코드 수정 (`customer.service.ts:157-165`) |
| 20 | 프로젝트 라이선스 정책 통일 |

## 종합 평가

| 영역 | 현황 | 평가 |
|------|------|------|
| 개인정보 암호화 | 주요 필드 O, 가족/테스트/주소 X | 보통 (개선 필요) |
| 약관 동의 관리 | 기본 구조 O, 철회 이력 X | 보통 |
| 자본시장법 | 기본 구조 O, 적합성 기록/보존 X | 미흡 |
| 전자금융거래법 | 인증 체계 O, CORS/Rate Limit X | 보통 |
| 오픈소스 라이선스 | GPL 위험 없음, NOTICE 파일 부재 | 양호 |
