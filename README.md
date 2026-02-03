# 뷰티플 성형외과 웹사이트

강남 프리미엄 성형외과 병원을 위한 모던하고 세련된 반응형 웹사이트입니다.

## 기술 스택

- **프레임워크**: React 19 + TypeScript
- **빌드 도구**: Vite 7
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: Shadcn UI
- **아이콘**: Lucide React
- **라우팅**: React Router v7
- **폰트**: Pretendard (한글 웹폰트)
- **데이터 저장**: localStorage

## 주요 기능

### 고객용 웹사이트 (`/`)
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 부드러운 스크롤 네비게이션
- 모바일 햄버거 메뉴
- **온라인 예약 시스템** - 날짜/시간 선택, 시술 종류 선택
- Before/After 갤러리 (탭 기반)
- FAQ 아코디언

### 관리자 대시보드 (`/admin`)
- **비밀번호 인증** 로그인 시스템
- **대시보드** - 전체 통계, 오늘 예약 현황, 다가오는 예약
- **예약 관리** - 테이블 뷰, 검색, 상태별 필터링
- **예약 상세** - 상태 변경 (대기중/확인됨/완료/취소), 관리자 메모
- **예약 삭제** 기능

## 페이지 구성

### 고객용 페이지
1. 히어로 섹션 - 병원 슬로건 및 CTA 버튼
2. 시술 소개 - 8가지 주요 시술 카테고리
3. 의료진 소개 - 전문의 프로필 및 경력
4. 전후 사진 - 시술별 Before/After 갤러리
5. 고객 후기 - 실제 시술 후기
6. 오시는 길 - 위치, 연락처, 진료시간
7. 상담 예약 - 온라인 예약 신청 폼
8. FAQ - 자주 묻는 질문

### 관리자 페이지
1. `/admin/login` - 관리자 로그인
2. `/admin` - 대시보드 (통계, 오늘 예약, 다가오는 예약)
3. `/admin/bookings` - 예약 목록 (검색, 필터, 상태 관리)
4. `/admin/bookings/:id` - 예약 상세 (상태 변경, 메모)

## 시작하기

### 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
```

### 관리자 접속

1. `/admin/login` 경로로 접속
2. 비밀번호: `beauty1234`
3. 대시보드에서 예약 관리

## 프로젝트 구조

```
src/
├── components/
│   ├── admin/           # 관리자 컴포넌트
│   │   ├── AdminLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── sections/        # 페이지 섹션 컴포넌트
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Doctors.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── Reviews.tsx
│   │   ├── Location.tsx
│   │   ├── Booking.tsx
│   │   └── FAQ.tsx
│   └── ui/              # Shadcn UI 컴포넌트
├── contexts/
│   ├── BookingContext.tsx    # 예약 상태 관리
│   └── AdminAuthContext.tsx  # 관리자 인증
├── data/
│   └── content.ts       # 정적 콘텐츠 데이터
├── pages/
│   ├── Home.tsx         # 고객용 홈페이지
│   └── admin/           # 관리자 페이지
│       ├── AdminLogin.tsx
│       ├── Dashboard.tsx
│       ├── BookingList.tsx
│       └── BookingDetail.tsx
├── services/
│   └── bookingStorage.ts    # localStorage CRUD
├── types/
│   └── booking.ts       # 예약 타입 정의
├── lib/
│   └── utils.ts
├── App.tsx              # 라우터 설정
├── main.tsx
└── index.css
```

## 커스터마이징

### 색상 테마 변경

`src/index.css` 파일의 CSS 변수를 수정하여 색상 테마를 변경할 수 있습니다.

### 콘텐츠 수정

`src/data/content.ts` 파일에서 병원 정보, 서비스, 의료진, 후기 등의 콘텐츠를 수정할 수 있습니다.

### 관리자 비밀번호 변경

`src/contexts/AdminAuthContext.tsx` 파일에서 `ADMIN_PASSWORD` 상수를 변경합니다.

### 데모 데이터

최초 접속 시 7건의 데모 예약 데이터가 자동으로 생성됩니다. `src/services/bookingStorage.ts`의 `seedDemoData()` 함수에서 수정할 수 있습니다.

## 라이선스

MIT License
