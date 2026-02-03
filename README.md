# 뷰티플 성형외과

강남 프리미엄 성형외과 병원을 위한 올인원 웹 플랫폼입니다.
고객용 웹사이트, CRM(예약/마케팅/고객/스케줄 관리), EMR(전자의무기록) 세 가지 시스템을 통합 제공합니다.

## 기술 스택

- **프레임워크**: React 19 + TypeScript
- **빌드 도구**: Vite 7
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: Shadcn UI (Radix UI 기반)
- **차트**: Recharts
- **알림**: Sonner (토스트)
- **아이콘**: Lucide React
- **라우팅**: React Router v7
- **폰트**: Pretendard (한글 웹폰트)
- **데이터 저장**: localStorage (백엔드 없음)

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
│   │   ├── AdminLayout.tsx          #   사이드바 (대시보드/예약/고객/팔로업/스케줄/마케팅)
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
│   ├── bookingStorage.ts            # CRM localStorage CRUD + 마케팅
│   ├── customerStorage.ts           # CRM 고객/팔로업 localStorage CRUD
│   ├── scheduleStorage.ts           # CRM 스케줄/타임블록 localStorage CRUD
│   └── emrStorage.ts               # EMR localStorage CRUD
├── types/
│   ├── booking.ts                   # CRM 타입 (예약 + 마케팅 + 여정)
│   ├── customer.ts                  # CRM 타입 (고객등급 + 팔로업)
│   ├── schedule.ts                  # CRM 타입 (진료의 + 타임블록)
│   └── emr.ts                      # EMR 타입 (환자/진료/시술/처방)
└── lib/
    └── utils.ts
```

## 데모 데이터

최초 접속 시 자동 생성됩니다.

| 시스템 | 데이터 |
|--------|--------|
| CRM 예약 | 12건 (다양한 유입경로/캠페인/여정 단계) |
| CRM 고객 | 12명 (VIP 1명, 골드 2명, 실버 1명, 일반/신규 8명) |
| CRM 팔로업 | 시술 후 경과 확인, 재방문 안내, 상담 후 확인 등 자동 생성 |
| CRM 스케줄 | 타임블록 3건 (점심시간, 학회 참석, 개인 사유) |
| EMR | 8명 환자, 7건 진료기록, 5건 시술기록, 3건 처방전 |

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
| `/admin/marketing` | 마케팅 분석 | 차트 + 퍼널 + 캠페인 성과 |

## 커스터마이징

- **색상 테마**: `src/index.css`의 CSS 변수
- **콘텐츠**: `src/data/content.ts`
- **CRM 비밀번호**: `src/contexts/AdminAuthContext.tsx` → `ADMIN_PASSWORD`
- **EMR 비밀번호**: `src/contexts/EMRAuthContext.tsx` → `EMR_PASSWORD`
- **CRM 데모 데이터**: `src/services/bookingStorage.ts` → `seedDemoData()`
- **고객 데모 데이터**: `src/services/customerStorage.ts` → `seedDemoData()`
- **스케줄 데모 데이터**: `src/services/scheduleStorage.ts` → `seedDemoData()`
- **EMR 데모 데이터**: `src/services/emrStorage.ts` → `seedDemoData()`

## 라이선스

MIT License
