# Draft: CRM Marketing Tools Integration

## Requirements (confirmed)
- Add acquisition channel tracking (유입경로 추적) to Booking type
- Add customer journey tracking (고객 여정 추적) with stage history
- Create marketing analytics dashboard with charts (recharts)
- Enhance existing CRM dashboard with marketing summary
- Add sidebar nav items for new pages
- Auto-capture UTM parameters from URL
- Fix window.confirm → AlertDialog in BookingList & BookingDetail

## Technical Decisions
- Chart library: recharts (user specified)
- Storage: localStorage only (no backend)
- UI: shadcn/ui + tailwind + lucide icons (existing patterns)
- All text: Korean
- Reuse EMR patterns for sorting/pagination/AlertDialog/toast

## Acquisition Channels (Korean plastic surgery specific)
네이버, 인스타그램, 유튜브, 카카오톡, 지인소개, 블로그, 광고, 직접방문, 기타

## Journey Stages
inquiry(문의) → consultation(상담) → procedure_scheduled(시술예약) → procedure_done(시술완료) → follow_up(사후관리) → retention(재방문)

## Scope Boundaries
- INCLUDE: Type expansion, booking form update, journey tracking, analytics page, dashboard enhancement, sidebar update, AlertDialog migration
- EXCLUDE: EMR system (separate routes/auth), backend/API, i18n

## Open Questions
- Test strategy: TDD vs manual verification?

## Research (pending)
- CRM codebase structure: awaiting explore agent
- EMR patterns: awaiting explore agent
- Test infrastructure: awaiting explore agent
