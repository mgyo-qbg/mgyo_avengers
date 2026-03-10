# mgyo_avengers — 팀 컨텍스트 복구 가이드

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


최종 업데이트: 2026-03-06

## 폴더 구조

```
mgyo_avengers/
├── README.md            # 전체 팀 구조 및 복구 순서 (이 파일)
├── MEMORY.md            # Claude 자동 메모리 정본 (symlink 대상)
├── better-wealth-web/   # 베러웰스웹(FA 플랫폼) 팀 컨텍스트
├── better-wealth-app/   # 베러웰스앱 팀 컨텍스트
└── issues/              # 이슈별 작업 문서 (앱/웹 통합)
    └── feature/
        └── {이슈번호}/  # {번호}spec.md, {번호}results.md, figma-plugin/
```

## 전체 팀 구조

```
총괄 (Claude — team-lead)
├── 웹팀-리드
│   ├── 웹-기획자1      (서비스 개요, 기능 목록)
│   ├── 웹-기획자2      (UI/UX, 화면 구성)
│   ├── 웹-프론트엔드1  (FE 아키텍처)
│   ├── 웹-프론트엔드2  (FE 품질/테스트)
│   ├── 웹-백엔드1      (NestJS)
│   ├── 웹-백엔드2      (FastAPI)
│   ├── 웹-인프라1      (CI/CD, Docker)
│   ├── 웹-코드리뷰어1  (TypeScript 품질)
│   ├── 웹-코드리뷰어2  (Python/인프라 품질)
│   └── 웹-법률전문가1  (개인정보/금융규제)
└── 앱팀-리드
    ├── 앱-기획자       (화면 플로우, 제약사항, Figma 코멘트 관리)
    └── 앱-디자이너     (Figma 디자인 시스템, 플러그인 스케치 생성)
```

## 복구 방법

세션 종료 후 아래 명령으로 전체 컨텍스트 복구:

> `/Users/imsi/Desktop/qbg/repo/mgyo_avengers` 하위의 문서들을 읽고 팀을 조직하고 각 팀원들의 컨텍스트를 복구해

### 복구 순서

1. 이 파일(README.md) 읽기
2. `MEMORY.md` 읽기 — Claude 자동 메모리 정본, 반드시 읽을 것
3. `better-wealth-web/README.md` 읽기 -> 웹팀 조직
4. `better-wealth-app/README.md` 읽기 -> 앱팀 조직
5. 진행 중인 이슈가 있으면 `issues/feature/{번호}/` 하위 문서 읽기

### 팀 생성 시 주의사항

- Claude는 Team을 하나만 리드 가능 -> 두 팀을 하나의 팀 내에서 논리적 분리 운영
- 웹팀-리드, 앱팀-리드를 먼저 스폰 후 각 팀원 배치
- 웹팀 팀원 이름은 웹- 프리픽스, 앱팀 팀원 이름은 앱- 프리픽스
