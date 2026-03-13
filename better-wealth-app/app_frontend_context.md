# 앱-프론트엔드1 컨텍스트

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**
> 수정이 필요하면 Claude에게 요청하세요.


작성일: 2026-03-12
최종 업데이트: 2026-03-12
레포 경로: `/Users/imsi/Desktop/qbg/repo/better-backend`

---

## 역할 및 책임

- 모바일 앱↔백엔드 연동 API 엔드포인트, 인증 흐름, DTO 파악
- 신규 이슈 개발 시 앱에서 사용할 API 스펙 및 응답 구조 검토
- 화면 구현에 필요한 데이터 플로우 설계 지원

---

## 앱↔백엔드 인증 흐름

```
1. 앱 최초 실행
   → POST /api/v1/auth/login
     Body: { ci, di, pin }
     Header: x-device-id, x-alliance
   → Response: { accessToken, refreshToken, user }

2. API 호출
   → Authorization: Bearer {accessToken}
   → accessToken 만료(1h) 시 refreshToken(7d)으로 갱신

3. 디바이스 등록
   → POST /api/v1/auth/device
     Body: { fcmToken, deviceOs, deviceModel }

4. 생체 인증 (FIDO)
   → POST /api/v1/auth/fido  — 지문 정보 저장
   → 이후 로그인 시 PIN 대신 생체 인증 사용 가능
```

---

## 주요 연동 API 상세

### 1. 인증
```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  ci: string;   // 암호화된 신원식별정보 (CI)
  di: string;   // 중복가입확인정보 (DI)
  pin: string;  // 4자리 PIN (문자열)
}
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    ID: bigint;
    CUST_NM: string;       // 복호화된 이름
    INVST_INCLNT_TP_CD: string;  // 투자 성향 코드 (1~9)
    MY_CODE: string;       // 추천 코드
  };
}
```

### 2. 현재 사용자 정보
```typescript
// GET /api/v1/auth/me
// Header: Authorization: Bearer {accessToken}
interface MeResponse {
  ID: bigint;
  CUST_NM: string;
  MOBILE_NO: string;
  EMAIL: string;
  BIRTH_DD: Date;
  GNDR: string;
  INVST_INCLNT_TP_CD: string;
  FA_ID: string | null;    // FA 플랫폼 ID (매칭 여부 확인)
  MY_CODE: string;
}
```

### 3. 자산 조회
```typescript
// GET /api/v1/assets
// Header: Authorization: Bearer {accessToken}
interface AssetsResponse {
  totalAsset: number;  // 총 자산 (원)
  assets: {
    BANK: BankAsset[];
    INVEST: InvestAsset[];
    PENSION: PensionAsset[];  // DC, IRP, DB 포함
    INSURANCE: InsuranceAsset[];
    CRYPTO: CryptoAsset[];
  };
}
```

### 4. MyData 연동 상태 확인
```typescript
// GET /api/v1/mdauth/individual/status
interface MydataStatusResponse {
  isConnected: boolean;
  authUrl: string | null;  // 미연동 시 인증 URL 제공
  connectedAt: Date | null;
}
```

### 5. 투자 성향 조회/저장
```typescript
// GET /api/v1/user/investment-tendency
interface InvestmentTendencyResponse {
  investmentType: string;  // '1'~'9'
  description: string;     // "보수적 투자자" 등
  surveyDate: Date;
}

// POST /api/v1/user/investment-tendency
interface InvestmentTendencyRequest {
  answers: { questionId: number; answer: string }[];
}
```

---

## 인출설계 설문 (#943) 연동 포인트

### 마이데이터 절세형/일반형 자산 보유 여부 (P3 분기)
- **API**: GET /api/v1/assets (또는 전용 엔드포인트 확인 필요)
- **판단 기준**: mainClassCode/middleClassCode/minorClassCode 조합
- **주의**: 앱 기준 계좌 타입 확인 필요 (미확인 사항)

### DC 자산 보유 여부 (P8 분기)
- **API**: GET /api/v1/assets/pension
- **판단 기준**: 마이데이터 기준 DC 계좌 보유 여부
- **주의**: 앱 기준 계좌 타입 확인 필요 (미확인 사항)

### FA 매칭 여부 (진입 분기)
- **API**: GET /api/v1/auth/me → `FA_ID` 필드 확인
- FA_ID 있음 → 이미 매칭된 FA 존재
- FA_ID 없음 → qb.event 계정으로 자동 매칭

### T0054 약관 동의 여부 (P11 분기)
- **API**: 약관 동의 상태 조회 (엔드포인트 미확정)
- FA 매칭 고객은 웹 FA 매칭 시 이미 수신 → 동의 Y 상태

### 설문 결과 전송
- **API**: 미확정 (개발 필요 — 인출설계 설문 전용 엔드포인트)
- 전송 데이터: 은퇴시기, 기대수명, 생활비, 국민연금 수령액, 근로소득, 기타소득

---

## 표준 HTTP 헤더

```
Authorization: Bearer {accessToken}    — JWT 인증
x-device-id: {uuid}                    — 디바이스 식별
x-alliance: {alliance_code}            — 제휴 코드
Content-Type: application/json
```

---

## 오류 처리 패턴

```typescript
// 모든 API 오류 응답 구조
interface ErrorResponse {
  statusCode: number;
  errorCode: string;   // 예: "400123"
  message: string;
}

// 앱 레벨 처리
switch (errorCode) {
  case '400123': // PIN_MISMATCH → 로그인 실패 안내
  case '400124': // PIN_ABOVE_ERR_CNT → 계정 잠금 안내
  case '400133': // USER_NOT_FOUND_DEVICE_INFO → 재등록 유도
}
```

---

## 환경별 API 기본 URL

| 환경 | URL |
|------|-----|
| 로컬 | `http://localhost:13100` |
| 개발 | 환경변수 `API_BASE_URL` |
| 프로덕션 | NCP NLB → 10.0.2.14:13100 |
