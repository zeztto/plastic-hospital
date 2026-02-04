# 뷰티플 성형외과

강남 프리미엄 성형외과 병원을 위한 올인원 웹 플랫폼입니다.
고객용 웹사이트, CRM(예약/마케팅/고객/스케줄 관리), EMR(전자의무기록) 세 가지 시스템을 통합 제공합니다.

CRM과 EMR은 200명의 공유 인물 데이터(`masterPersonData`)를 기반으로 연동되어, 동일한 환자/고객이 양쪽 시스템에서 일관되게 관리됩니다.

## 기술 스택

- **프레임워크**: React 19 + TypeScript
- **빌드 도구**: Vite 7 (코드 스플리팅 + vendor 청크 분리)
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: Shadcn UI (Radix UI 기반)
- **차트**: Recharts
- **알림**: Sonner (토스트)
- **아이콘**: Lucide React
- **라우팅**: React Router v7
- **폰트**: Pretendard (한글 웹폰트)
- **데이터 저장**: localStorage (백엔드 없음, safeParse 유틸리티로 안전한 읽기)

## 시스템 구성

| 시스템 | 경로 | 비밀번호 | 설명 |
|--------|------|----------|------|
| 고객 웹사이트 | `/` | 없음 | 병원 소개 + 온라인 예약 |
| CRM | `/admin` | `beauty1234` | 예약/고객/스케줄 관리 + 마케팅 분석 |
| EMR | `/emr` | `emr5678` | 전자의무기록 (환자/진료/시술/처방) |

## 주요 기능

### 고객용 웹사이트 (`/`)

- 반응형 디자인 (모바일/태블릿/데스크톱)
- 부드러운 스크롤 네비게이션 + 모바일 햄버거 메뉴
- 8개 섹션: 히어로, 시술 소개, 의료진, 전후 사진, 고객 후기, 오시는 길, 상담 예약, FAQ
- **온라인 예약 시스템** — 유입 경로(어떻게 알게 되셨나요?) 수집 + UTM 파라미터 자동 캡처

### CRM — 예약/고객/스케줄 관리 시스템 (`/admin`)

- **대시보드** — 예약 통계 (전체/대기중/확인됨/취소됨), 전환율, 최다 유입 채널, 오늘의 예약, 다가오는 예약
- **예약 관리** (`/admin/bookings`) — 테이블 뷰, 검색(이름/연락처/시술/유입경로), 상태별 필터, 유입경로 컬럼
- **예약 상세** (`/admin/bookings/:id`) — 고객 정보, 상태 변경, 관리자 메모, 마케팅 정보(유입경로/매체/캠페인), 고객 여정 관리
- **고객 관리** (`/admin/customers`) — 고객 등급(VIP/골드/실버/일반/신규) 관리, 등급별 필터, 태그 관리, 검색, 페이지네이션
- **고객 상세** (`/admin/customers/:id`) — 등급 변경, 태그 추가/삭제, 예약 이력, 팔로업 관리, 메모(일반/접수/상담) CRUD
- **팔로업 관리** (`/admin/follow-ups`) — 시술 후 경과 확인/재방문 안내/상담 후 확인 등 자동 리스트업, 상태별 필터, 기한 초과 알림, 완료/건너뛰기 처리
- **스케줄 관리** (`/admin/schedule`) — 주간 캘린더 뷰, 진료의별 컬럼, 시간 슬롯 그리드(09:00-18:00), 드래그앤드롭 예약 변경, 예약 막기(TimeBlock) 생성/삭제
- **마케팅 분석** (`/admin/marketing`) — 유입 채널별 바/파이 차트, 고객 여정 퍼널, 일별 예약 추이, 캠페인 성과 테이블, 채널별 전환 성과
- **메시지 관리** (`/admin/messages`) — 메시지 템플릿(카카오/SMS/LMS) CRUD, 고객 선택 후 발송, 발송 이력 조회, 자동 발송 규칙 관리
- **병원 운영** (`/admin/operations`) — 공지사항 CRUD (우선순위/읽음 상태), 전화 연동 (고객 자동 매칭), 네이버 예약 동기화

#### 메시지 관리 기능 상세

- **템플릿 관리**: 카테고리별(환영/감사/예약확인/예약리마인드/시술후/팔로업/프로모션/커스텀) 메시지 템플릿 CRUD
- **채널 지원**: 카카오알림톡, SMS, LMS 채널 선택
- **변수 치환**: `{{고객명}}`, `{{날짜}}`, `{{시간}}`, `{{시술명}}` 자동 치환 (고객의 실제 예약 데이터 기반)
- **발송**: 템플릿 선택 → 고객 검색/선택 → 미리보기 → 개별/대량 발송
- **발송 이력**: 발송완료/발송실패/발송대기 상태 관리, 검색/필터/페이지네이션
- **자동 발송**: 예약 확정 시, 예약 1일 전, 시술 완료 시, 시술 3일 후 트리거 규칙

#### 병원 운영 기능 상세

- **공지사항**: 우선순위(일반/중요/긴급) 관리, 읽음/안읽음 상태, 미읽음 카운트 배지
- **전화 연동**: 전화번호 입력 → 고객DB 자동 매칭 → 고객 정보 팝업 (등급/예약 이력), 미등록 고객 신규 등록 안내
- **네이버 예약 동기화**: 네이버 예약 목록 조회, 개별/일괄 동기화, 동기화 상태(완료/대기/충돌) 관리

#### 고객 관리 기능 상세

- **고객 등급**: VIP, 골드, 실버, 일반, 신규 — 등급별 배지 색상, 통계 카드
- **자동 고객 동기화**: 예약 데이터로부터 연락처 기준 고객 자동 생성/업데이트
- **태그 관리**: 고객별 자유 태그 추가/삭제
- **메모**: 일반/접수/상담 유형별 메모 CRUD, 시간순 표시
- **팔로업 자동 생성**: 시술 완료(3일 후 경과 확인), 사후 관리(14일 후 재방문 안내), 상담(7일 후 시술 결정 확인)

#### 스케줄 관리 기능 상세

- **주간 캘린더**: 월~일 7일 뷰, 30분 단위 시간 슬롯
- **진료의 4명**: 김태호(눈·코성형), 이서연(안면윤곽·리프팅), 박준혁(가슴·체형), 최민지(피부·쁘띠)
- **드래그앤드롭**: 예약을 끌어서 다른 날짜/시간으로 이동
- **예약 막기**: 진료의별 특정 시간대 블록 설정 (사유 입력), 클릭으로 삭제

#### 마케팅 기능 상세

- **유입 경로 추적**: 네이버, 인스타그램, 유튜브, 카카오톡, 지인소개, 블로그, 광고, 직접방문, 기타
- **UTM 파라미터**: url query에서 `utm_source`, `utm_medium`, `utm_campaign` 자동 캡처
- **고객 여정 6단계**: 문의 → 상담 → 시술예약 → 시술완료 → 사후관리 → 재방문
- **여정 이력**: 각 단계 전환 시 타임스탬프 기록, 시각적 타임라인 표시

### EMR — 전자의무기록 시스템 (`/emr`)

- **대시보드** — 환자/진료기록/시술/처방전 통계, 최근 기록 바로가기
- **환자 관리** — 환자 목록 (정렬/검색/페이지네이션), 신규 등록, 환자 차트 (기본정보/진료기록/시술기록/처방전 4탭)
- **진료기록** — CRUD, 진단코드, 바이탈 사인, 상세 보기/편집
- **시술기록** — CRUD, 상태 관리 (예정/완료/취소), 필터링
- **처방전** — CRUD, 약물 추가/삭제, 알러지 경고
- 전체 목록 페이지에 정렬/페이지네이션(10건/페이지) 적용
- 모든 삭제 동작은 AlertDialog 사용, CRUD 완료 시 토스트 알림

## 시작하기

### 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
```

### 접속 정보

| 시스템 | URL | 비밀번호 |
|--------|-----|----------|
| CRM | `/admin/login` | `beauty1234` |
| EMR | `/emr/login` | `emr5678` |

## 프로젝트 구조

```
src/
├── App.tsx                          # 전체 라우팅
├── components/
│   ├── admin/                       # CRM 레이아웃
│   │   ├── AdminLayout.tsx          #   사이드바 (대시보드/예약/고객/팔로업/스케줄/메시지/병원운영/마케팅)
│   │   └── ProtectedRoute.tsx
│   ├── emr/                         # EMR 레이아웃
│   │   ├── EMRLayout.tsx            #   사이드바 (대시보드/환자/진료/시술/처방전)
│   │   └── EMRProtectedRoute.tsx
│   ├── layout/                      # 공개 사이트 레이아웃
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── sections/                    # 공개 사이트 섹션
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Doctors.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── Reviews.tsx
│   │   ├── Location.tsx
│   │   ├── Booking.tsx              #   예약 폼 (유입경로 + UTM)
│   │   └── FAQ.tsx
│   └── ui/                          # Shadcn UI 컴포넌트
├── contexts/
│   ├── AdminAuthContext.tsx          # CRM 인증 (beauty1234)
│   ├── BookingContext.tsx            # CRM 예약/마케팅 상태
│   ├── CustomerContext.tsx           # CRM 고객/팔로업 상태
│   ├── MessageContext.tsx            # CRM 메시지 템플릿/발송 상태
│   ├── EMRAuthContext.tsx            # EMR 인증 (emr5678)
│   └── EMRContext.tsx               # EMR 환자/기록 상태
├── data/
│   └── content.ts                   # 정적 콘텐츠
├── pages/
│   ├── Home.tsx                     # 공개 웹사이트
│   ├── admin/                       # CRM 페이지
│   │   ├── AdminLogin.tsx
│   │   ├── Dashboard.tsx            #   대시보드 (통계 + 마케팅 요약)
│   │   ├── BookingList.tsx          #   예약 목록 (유입경로 컬럼)
│   │   ├── BookingDetail.tsx        #   예약 상세 (마케팅 + 여정)
│   │   ├── CustomerList.tsx         #   고객 목록 (등급/태그/검색)
│   │   ├── CustomerDetail.tsx       #   고객 상세 (등급/메모/팔로업)
│   │   ├── FollowUpList.tsx         #   팔로업 관리 (자동 리스트업)
│   │   ├── ScheduleCalendar.tsx     #   스케줄 (주간 캘린더/드래그앤드롭)
│   │   ├── MessageCenter.tsx        #   메시지 관리 (템플릿/발송/이력/자동발송)
│   │   ├── Operations.tsx           #   병원 운영 (공지사항/전화연동/네이버예약)
│   │   └── MarketingDashboard.tsx   #   마케팅 분석 (차트/퍼널/캠페인)
│   ├── emr/
│   │   ├── EMRLogin.tsx
│   │   └── EMRDashboard.tsx
│   └── admin/emr/                   # EMR 페이지
│       ├── PatientList.tsx
│       ├── PatientChart.tsx
│       ├── NewPatient.tsx
│       ├── RecordsList.tsx
│       ├── RecordDetail.tsx
│       ├── ProceduresList.tsx
│       ├── ProcedureDetail.tsx
│       ├── PrescriptionsList.tsx
│       └── PrescriptionDetail.tsx
├── services/
│   ├── masterPersonData.ts          # CRM+EMR 공유 인물 200명 마스터 데이터
│   ├── bookingStorage.ts            # CRM localStorage CRUD + 마케팅
│   ├── customerStorage.ts           # CRM 고객/팔로업 localStorage CRUD
│   ├── scheduleStorage.ts           # CRM 스케줄/타임블록 localStorage CRUD
│   ├── messageStorage.ts            # CRM 메시지 템플릿/발송 localStorage CRUD
│   ├── operationStorage.ts          # CRM 공지사항/네이버예약/전화 localStorage CRUD
│   └── emrStorage.ts               # EMR localStorage CRUD
├── types/
│   ├── booking.ts                   # CRM 타입 (예약 + 마케팅 + 여정)
│   ├── customer.ts                  # CRM 타입 (고객등급 + 팔로업)
│   ├── schedule.ts                  # CRM 타입 (진료의 + 타임블록)
│   ├── message.ts                   # CRM 타입 (메시지 템플릿/발송/자동발송)
│   ├── operation.ts                 # CRM 타입 (공지사항/네이버예약/전화)
│   └── emr.ts                      # EMR 타입 (환자/진료/시술/처방)
└── lib/
    ├── safeStorage.ts               # localStorage 안전한 JSON.parse 유틸리티
    └── utils.ts
```

## 데모 데이터

최초 접속 시 자동 생성됩니다.

| 시스템 | 데이터 |
|--------|--------|
| CRM 예약 | 280건 (200명, 다양한 유입경로/캠페인/여정 단계) |
| CRM 고객 | 200명 (VIP 3명, 골드 8명, 실버 10명, 일반/신규 179명) |
| CRM 팔로업 | 시술 후 경과 확인, 재방문 안내, 상담 후 확인 등 자동 생성 |
| CRM 스케줄 | 타임블록 10건 |
| CRM 메시지 | 15개 템플릿, 25건 발송 이력, 4개 자동 발송 규칙 |
| CRM 운영 | 14건 공지사항, 14건 네이버 예약, 17건 전화 기록 |
| EMR | 200명 환자, 120건 진료기록, 80건 시술기록, 50건 처방전 |

## CRM 라우트

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/admin` | 대시보드 | 예약 통계 + 마케팅 요약 |
| `/admin/bookings` | 예약 관리 | 예약 목록 + 검색/필터 |
| `/admin/bookings/:id` | 예약 상세 | 상태 변경 + 여정 관리 |
| `/admin/customers` | 고객 관리 | 등급별 필터 + 태그 검색 |
| `/admin/customers/:id` | 고객 상세 | 등급/메모/팔로업 관리 |
| `/admin/follow-ups` | 팔로업 관리 | 자동 리스트업 + 상태 처리 |
| `/admin/schedule` | 스케줄 관리 | 주간 캘린더 + 드래그앤드롭 |
| `/admin/messages` | 메시지 관리 | 템플릿 + 발송 + 이력 + 자동발송 |
| `/admin/operations` | 병원 운영 | 공지사항 + 전화연동 + 네이버예약 |
| `/admin/marketing` | 마케팅 분석 | 차트 + 퍼널 + 캠페인 성과 |

## 커스터마이징

- **색상 테마**: `src/index.css`의 CSS 변수
- **콘텐츠**: `src/data/content.ts`
- **CRM 비밀번호**: `src/contexts/AdminAuthContext.tsx` → `ADMIN_PASSWORD`
- **EMR 비밀번호**: `src/contexts/EMRAuthContext.tsx` → `EMR_PASSWORD`
- **CRM 데모 데이터**: `src/services/bookingStorage.ts` → `seedDemoData()`
- **고객 데모 데이터**: `src/services/customerStorage.ts` → `seedDemoData()`
- **스케줄 데모 데이터**: `src/services/scheduleStorage.ts` → `seedDemoData()`
- **메시지 데모 데이터**: `src/services/messageStorage.ts` → `seedDemoData()`
- **운영 데모 데이터**: `src/services/operationStorage.ts` → `seedDemoData()`
- **EMR 데모 데이터**: `src/services/emrStorage.ts` → `seedDemoData()`

## 라이선스

MIT License
