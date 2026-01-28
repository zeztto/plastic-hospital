# 뷰티플 성형외과 웹사이트

강남 프리미엄 성형외과 병원을 위한 모던하고 세련된 반응형 웹사이트입니다.

## 기술 스택

- **프레임워크**: React 19 + TypeScript
- **빌드 도구**: Vite 7
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: Shadcn UI
- **아이콘**: Lucide React
- **폰트**: Pretendard (한글 웹폰트)

## 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **부드러운 스크롤 네비게이션**: 섹션간 스무스 스크롤
- **모바일 메뉴**: 햄버거 메뉴 및 시트 컴포넌트
- **상담 예약 폼**: 폼 유효성 검사 및 제출 상태 관리
- **Before/After 갤러리**: 탭 기반 시술별 분류
- **FAQ 아코디언**: 접었다 펼 수 있는 FAQ 섹션

## 페이지 구성

1. **히어로 섹션** - 병원 슬로건 및 CTA 버튼
2. **시술 소개** - 8가지 주요 시술 카테고리
3. **의료진 소개** - 전문의 프로필 및 경력
4. **전후 사진** - 시술별 Before/After 갤러리
5. **고객 후기** - 실제 시술 후기
6. **오시는 길** - 위치, 연락처, 진료시간
7. **상담 예약** - 온라인 예약 신청 폼
8. **FAQ** - 자주 묻는 질문

## 시작하기

### 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치

```bash
# 의존성 설치
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

### 빌드 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── Header.tsx   # 헤더 및 네비게이션
│   │   ├── Footer.tsx   # 푸터
│   │   └── Layout.tsx   # 전체 레이아웃 래퍼
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
├── data/
│   └── content.ts       # 정적 콘텐츠 데이터
├── lib/
│   └── utils.ts         # 유틸리티 함수
├── pages/
│   └── Home.tsx         # 홈 페이지
├── App.tsx
├── main.tsx
└── index.css            # 글로벌 스타일 및 Tailwind 설정
```

## 커스터마이징

### 색상 테마 변경

`src/index.css` 파일의 CSS 변수를 수정하여 색상 테마를 변경할 수 있습니다:

```css
:root {
  --primary: oklch(0.55 0.12 350);  /* 프라이머리 색상 */
  --background: oklch(0.995 0.002 70);  /* 배경 색상 */
  /* ... */
}
```

### 콘텐츠 수정

`src/data/content.ts` 파일에서 병원 정보, 서비스, 의료진, 후기 등의 콘텐츠를 수정할 수 있습니다.

## 라이선스

MIT License

## 문의

개발 관련 문의사항이 있으시면 이슈를 등록해주세요.
