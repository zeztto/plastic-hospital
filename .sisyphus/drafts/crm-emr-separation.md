# Draft: CRM/EMR System Separation

## Requirements (confirmed)
- Separate CRM (원무과) and EMR (전자의무기록) into independent systems
- Different passwords/access controls for each
- CRM at /admin, EMR at /emr
- Separate login pages: /admin/login, /emr/login
- CRM cannot access patient medical records, procedures, prescriptions
- CRM CAN access: bookings, basic patient name/phone for scheduling
- EMR needs rich detailed dashboard
- All UI in Korean (한국어)
- Rose/pink theme consistent
- localStorage only (no backend)
- Deploy to Vercel (SPA rewrites)

## Technical Decisions
- Auth: Two separate auth contexts with separate sessionStorage keys and passwords
- Routing: Two separate route trees (/admin/* and /emr/*)
- Layouts: Two separate layout components with their own sidebars
- Providers: EMRProvider only wraps EMR routes, BookingProvider wraps CRM routes (and public booking form)
- EMR pages stay at src/pages/emr/ (move from src/pages/admin/emr/)

## Research Findings (from direct code reading)

### Current Auth System
- Single password: 'beauty1234' (hardcoded)
- sessionStorage key: 'plastic-hospital-admin-auth'
- Simple boolean isAuthenticated
- ProtectedRoute redirects to /admin/login

### Current Route Structure
- All admin routes under /admin protected by single ProtectedRoute
- EMR pages nested under /admin: patients, patients/new, patients/:id, records
- CRM pages: bookings, bookings/:id, Dashboard

### Data Layer
- bookingStorage: localStorage key 'plastic-hospital-bookings'
- emrStorage: 4 localStorage keys (patients, records, procedures, prescriptions)
- BookingContext: bookings CRUD, stats
- EMRContext: patients, records, procedures, prescriptions CRUD, stats

### Key Cross-References
- Dashboard.tsx only uses useBookings (no EMR dependency)
- AdminLayout sidebar has 4 items including EMR links (patients, records)
- PatientChart.tsx links back to /admin/patients (will need /emr/patients)
- NewPatient.tsx links to /admin/patients (will need /emr/patients)
- RecordsList.tsx links to /admin/patients/:id (will need /emr/patients/:id)

### Available Shadcn Components
accordion, avatar, badge, button, card, dialog, dropdown-menu, form, input, label, navigation-menu, popover, scroll-area, select, separator, sheet, table, tabs, textarea

### Theme
- Rose/pink oklch color scheme
- Pretendard font
- sidebar variables defined

## Open Questions
- None remaining - requirements are very clear

## Scope Boundaries
- INCLUDE: Auth separation, route separation, layout separation, EMR dashboard, link updates
- EXCLUDE: New features beyond dashboard, backend integration, database migration
