# mgyo_claude — 팀 컨텍스트 복구 가이드

분석 일자: 2026-03-05

## 폴더 구조

```
mgyo_claude/
├── better-wealth-web/   # 베러웰스웹(FA 플랫폼) 팀 컨텍스트
└── better-wealth-app/   # 베러웰스앱 팀 컨텍스트
```

## 전체 팀 구조

```
총괄 (Claude — team-lead)
├── 웹팀-리드
│   ├── 웹-기획자1      (서비스 개요)
│   ├── 웹-기획자2      (UI/UX)
│   ├── 웹-프론트엔드1  (FE 아키텍처)
│   ├── 웹-프론트엔드2  (FE 품질/테스트)
│   ├── 웹-백엔드1      (NestJS)
│   ├── 웹-백엔드2      (FastAPI)
│   ├── 웹-인프라1      (CI/CD, Docker)
│   ├── 웹-코드리뷰어1  (TypeScript 품질)
│   ├── 웹-코드리뷰어2  (Python/인프라 품질)
│   └── 웹-법률전문가1  (개인정보/금융규제)
└── 앱팀-리드
    └── 앱-디자이너     (Figma 디자인 시스템)
```

## 복구 방법

세션 종료 후 아래 명령으로 전체 컨텍스트 복구:

> `/Users/imsi/Desktop/qbg/repo/mgyo_avengers` 하위의 문서들을 읽고 팀을 조직하고 각 팀원들의 컨텍스트를 복구해

### 복구 순서

1. 이 파일(README.md) 읽기
2. `better-wealth-web/README.md` 읽기 -> 웹팀 조직
3. `better-wealth-app/README.md` 읽기 -> 앱팀 조직

### 팀 생성 시 주의사항

- Claude는 Team을 하나만 리드 가능 -> 두 팀을 하나의 팀 내에서 논리적 분리 운영
- 웹팀-리드, 앱팀-리드를 먼저 스폰 후 각 팀원 배치
- 웹팀 팀원 이름은 웹- 프리픽스, 앱팀 팀원 이름은 앱- 프리픽스
