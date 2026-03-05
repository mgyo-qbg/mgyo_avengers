# FastAPI Nudge 서비스 — 백엔드개발자-나래

## 서비스 개요

**역할**: 금융 계산 엔진 마이크로서비스 (연산 집약적 금융 로직 전담)

- Python 3.11, FastAPI 0.104.1, Uvicorn, Pydantic v2
- 포트: 13550 (프로덕션: HAProxy 로드밸런서 → 워커 13551-13554)
- API 프리픽스: `/api/v1/nudge`
- Swagger: `/api/v1/nudge/docs`

## 라우터 구조 (5개 도메인)

```
routers/
├── wm/        # Wealth Management
│   ├── gbi/          - Goal-Based Investing
│   ├── inv/          - 투자진단, 시뮬레이션, 수익률 백분위
│   ├── retirement/   - 은퇴 캐시플로우, 은퇴진단
│   ├── cf/           - 현금흐름 분석
│   ├── single/       - 단일 자산 분석
│   └── withdrawal/   - 인출 시뮬레이션
├── fin/       # Finance
│   ├── tvm/          - 화폐의 시간가치
│   ├── nps/          - 국민연금
│   ├── nhis/         - 건강보험
│   ├── ehr/          - 조기수령
│   ├── loan/         - 대출계산
│   ├── tax/          - 세금 (근로/연금/양도/퇴직소득세)
│   ├── pension/      - 연금 저축/인출
│   ├── pension_crossover/ - 연금교차분석
│   ├── inflation/    - 인플레이션
│   └── inheritance/  - 상속세
├── ai/        # AI (OpenAI GPT-4o 연동)
│   ├── inv/diag/     - AI 투자진단
│   └── retirement/cashflow/ - AI 은퇴 캐시플로우
├── kfr/       # 한국금융투자협회 데이터
│   └── fund/dividend/, fund/fee/
└── misc/      # 헬스체크, 베타
```

## NestJS ↔ FastAPI 통신

### 통신 방식: 동기 REST API (HTTP)
- NestJS의 `NudgeService`(libs/external.interlock)가 HTTP로 Nudge 호출
- `AppConfigService.internalHost`로 Nudge 호스트 URL 관리
- **메시지 큐 없음** — 순수 REST 기반 동기 통신

### AI 라우터의 역방향 통신 (순환 의존성)
- `ai/inv/diag`에서 Nudge → NestJS API 역호출
- `BETTER_WEALTH_BASE_URL` + `better-wealth-auth` 헤더로 NestJS 호출
- 호출 예: `/main/advisor/customer/diag/ef-frontier/`, stress-test API

### GBI 워커 통신
- `NUDGE_WORKER_BASE_URL`로 연산을 워커 프로세스에 위임
- 워커 실패 시 로컬 fallback 로직

## 데이터베이스

### Prisma (Python Client) — MySQL, 18개 모델

**포트폴리오/투자 참조 데이터 (RD_ 접두사) — 10개:**
- RD_PORT_RISK_RETURN, RD_PORT_WEIGHTS, RD_PORT_BASIC
- RD_CORRELATION_DATA, RD_PORTFOLIO_RETURN, RD_PORTFOLIO_STD_DEV
- RD_PORTFOLIO_SCORE, RD_LAB_INC_TAX, RD_PNS_INC_TAX_SEV_*, RD_NPS_CONST

**KFR 펀드 데이터 (BD_ 접두사) — 7개:**
- BD_KFR_FUND_DIVIDEND, BD_KFR_FUND_BASE_INFO_LATEST
- BD_KFR_FUND_PROPERTY_CODE, BD_KFR_ETF, BD_KFR_FUND_RATE, BD_KFR_PRICE

**주의**: NestJS와 동일한 MySQL 인스턴스 공유 (완전한 서비스 독립성 미확보)

### Pydantic v2 모델
- `common/model.py`: 공통 Enum (Owner, PensionTypes, LoanTypes 등)
- 각 라우터별 `model.py`: 도메인 특화 요청/응답 모델

## 에러 모델 (`common/error/model.py`)
- `ErrStatus`, `ErrType`, `ErrCode`, `ErrMsg`, `ErrDetail` 체계
- 50개 이상 도메인별 에러 코드
- 한국어 에러 메시지

## 인증/보안 현황

**자체 인증 없음:**
- 모든 라우터 `dependencies=[]`
- CORS: `allow_origins=["*"]`, `allow_credentials=True` — 전체 허용
- NestJS가 게이트웨이 역할 → Nudge는 내부망 접근 전제
- `.env`, `.env.development`, `.env.production` 모두 Git에 포함

**Redis 캐시 보안 위험:**
- `fncache.py`에서 pickle 직렬화/역직렬화 사용 — RCE 취약점 가능

## 핵심 라이브러리
| 라이브러리 | 용도 |
|-----------|------|
| numpy / scipy / numba | 수치 계산, 최적화, JIT 컴파일 |
| numpy-financial | 재무 함수 (PV, FV, PMT) |
| pandas | 데이터 프레임 처리 |
| openai | GPT-4o AI 분석 |
| httpx | 비동기 HTTP 클라이언트 |
| yfinance | 금융 데이터 수집 |
| redis | LRU 캐시 |

## 주요 이슈

### 높은 우선순위 (보안)
1. **CORS 전체 허용** — 특정 도메인으로 제한 필요
2. **API 인증 미들웨어 없음** — API Key 또는 mTLS 도입 필요
3. **.env 파일 Git 노출** — OPENAI_API_KEY, DB 비밀번호 등 포함
4. **pickle 직렬화** — JSON 직렬화로 전환 권장
5. **비활성 FA 라우터 코드 정리** — `prisma_fa` 참조 남아있음

### 중간 우선순위
6. **순환 의존성** — Nudge → NestJS 역호출 → 이벤트 기반이나 데이터 전달 방식으로 해소
7. **`except BaseException`** → `except Exception`으로 변경
8. **서비스 레이어 부재** — route.py에 비즈니스 로직 혼재
9. **타임아웃 3초** — 복잡한 계산 시 부족

### 낮은 우선순위
10. **requirements.txt 관리** — pip-tools 또는 poetry 도입
11. **비활성 코드 정리** — `faRoutes`, `prisma_fa` 주석 처리 코드
12. **Enum 오타** — `FMType.CHILDREN = "CHRIDREN"` (common/model.py:72)
13. **update_env_file 버그** — key 파라미터 무시하고 NUDGE_PORT= 하드코딩

## 테스트 현황
- 유닛 테스트 7개 (세금/연금 계산 위주)
- Bruno API 테스트 22개 (CI 통합 어려운 구조)
- AI, 상속세, 대출 등 주요 도메인 테스트 없음

## 프로덕션 인프라
- Supervisor + HAProxy (로드밸런서, 워커 4개 round-robin)
- 로그: `/var/log/turple/all.log`
