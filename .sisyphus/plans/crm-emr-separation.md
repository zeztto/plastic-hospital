# CRM/EMR 시스템 분리 (원무과 ↔ 전자의무기록)

## TL;DR

> **Quick Summary**: Separate the unified admin dashboard into two independent systems — CRM (원무과, booking management at `/admin`) and EMR (전자의무기록 at `/emr`) — with distinct authentication, routing, layouts, and access controls. Create a rich EMR dashboard with patient/procedure/prescription statistics.
> 
> **Deliverables**:
> - Separate auth contexts with distinct passwords and sessionStorage keys
> - Two independent route trees (`/admin/*` for CRM, `/emr/*` for EMR)
> - Two layout components with system-specific sidebar navigation
> - EMR login page at `/emr/login`
> - Rich EMR dashboard with clinical statistics
> - Updated all internal links to use correct route prefixes
> - CRM stripped of all EMR access (patients, records, procedures, prescriptions)
> 
> **Estimated Effort**: Medium (8-12 focused tasks)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 (Auth) → Task 3 (Routes/App.tsx) → Task 6 (EMR Dashboard) → Task 8 (Verification)

---

## Context

### Original Request
Separate the CRM (원무과 어드민 대시보드) and EMR (전자의무기록) systems with different access controls. Patient medical records are sensitive and should not be accessible from the general CRM. The EMR should also have a more detailed dashboard with rich information. All UI must be in Korean (한국어).

### Interview Summary
**Key Discussions**:
- User provided extremely detailed spec with full file listing, route structure, and data models
- No ambiguities — all decisions pre-made by user

**Research Findings**:
- Current auth: single password `beauty1234`, sessionStorage key `plastic-hospital-admin-auth`
- Dashboard.tsx only uses `useBookings` — clean separation, no EMR dependency
- EMR pages all under `src/pages/admin/emr/` — need to relocate to `src/pages/emr/`
- Internal links in EMR pages (PatientChart, NewPatient, PatientList, RecordsList) hardcode `/admin/patients` paths — must update to `/emr/patients`
- AdminLayout sidebar includes EMR nav items (환자 관리, 진료 기록) — must remove from CRM
- BookingProvider wraps everything including public booking form — must remain accessible to public route
- EMRProvider only used by EMR pages — can be scoped to EMR route tree only
- emrStorage has `getStats()` returning `totalPatients`, `totalRecords`, `totalProcedures`, `scheduledProcedures` — good foundation for EMR dashboard but needs enhancement (recent records, today's patients, completed procedures, recent prescriptions)

### Metis Review (Self-Analysis)
**Identified Gaps** (addressed):
- Gap: EMR dashboard needs richer stats than currently available from `emrStorage.getStats()` → Solution: Add new query methods to emrStorage (getRecentRecords, getRecentPrescriptions, getAllProcedures, getTodayPatients)
- Gap: Vercel SPA rewrites need to handle both `/admin/*` and `/emr/*` → Solution: vercel.json already has catch-all rewrite `/(.*) → /`, which handles both
- Gap: Public booking form (`src/components/sections/Booking.tsx`) uses `useBookings` → Solution: BookingProvider must remain in provider hierarchy above both public and CRM routes
- Gap: EMR pages link back to `/admin/patients` → Solution: Update all internal links in EMR pages to use `/emr/` prefix

---

## Work Objectives

### Core Objective
Achieve complete access control separation between CRM (원무과) and EMR (전자의무기록) systems such that CRM users cannot access any clinical/medical data, and EMR users have a rich clinical dashboard.

### Concrete Deliverables
- `src/contexts/EMRAuthContext.tsx` — new EMR-specific auth context
- `src/components/emr/EMRLayout.tsx` — EMR sidebar layout
- `src/components/emr/EMRProtectedRoute.tsx` — EMR route guard
- `src/pages/emr/EMRLogin.tsx` — EMR login page
- `src/pages/emr/EMRDashboard.tsx` — rich EMR dashboard
- Updated `src/contexts/AdminAuthContext.tsx` — CRM-only auth (renamed password context)
- Updated `src/components/admin/AdminLayout.tsx` — CRM-only sidebar (remove EMR links)
- Updated `src/App.tsx` — separate route trees
- Updated `src/pages/emr/*.tsx` — relocated EMR pages with corrected links
- Updated `src/services/emrStorage.ts` — new query methods for dashboard

### Definition of Done
- [ ] CRM login with one password grants access to `/admin/*` only (bookings dashboard)
- [ ] EMR login with different password grants access to `/emr/*` only (clinical data)
- [ ] Navigating to `/admin/patients` (or any EMR route under /admin) shows 404 or redirects
- [ ] Navigating to `/emr/*` without EMR auth redirects to `/emr/login`
- [ ] EMR dashboard shows: total patients, today's patients, recent records, procedure stats, recent prescriptions, quick patient access
- [ ] All UI text is in Korean
- [ ] Build succeeds: `npm run build` exits 0
- [ ] All internal links use correct route prefixes

### Must Have
- Two separate passwords (different for CRM and EMR)
- Two separate sessionStorage keys
- EMR auth cannot unlock CRM routes and vice versa
- EMR dashboard with at least 6 stat/info sections
- All Korean UI labels

### Must NOT Have (Guardrails)
- DO NOT create a "super admin" or unified login that accesses both systems
- DO NOT add new npm dependencies
- DO NOT change the public-facing website or booking form functionality
- DO NOT modify the data models/types (Patient, MedicalRecord, etc.)
- DO NOT change localStorage key names (would break existing data)
- DO NOT add English UI text
- DO NOT over-engineer: no RBAC, no role enums, no permission matrices — just two separate auth flows
- DO NOT create a shared auth abstraction — keep the two auth contexts independent and simple

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no test framework configured)
- **User wants tests**: Not requested
- **Framework**: None
- **QA approach**: Manual verification via build check + browser automation

### Automated Verification

Each TODO includes executable verification:
- `npm run build` → exit code 0 (TypeScript + Vite)
- Browser-based verification via playwright skill for UI flows

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Foundation):
├── Task 1: EMR Auth Context + Protected Route + Login Page
├── Task 2: EMR Layout Component (sidebar)
└── Task 3: Update AdminAuthContext (CRM-only) + Admin Layout (remove EMR links)

Wave 2 (After Wave 1 — Integration):
├── Task 4: Update App.tsx route trees (depends: 1, 2, 3)
├── Task 5: Relocate EMR pages + update internal links (depends: 1, 2)
└── Task 6: Enhance emrStorage + create EMR Dashboard (depends: 1, 2)

Wave 3 (After Wave 2 — Polish + Verify):
├── Task 7: CRM Dashboard cleanup (depends: 4)
└── Task 8: Build verification + comprehensive testing (depends: 4, 5, 6, 7)
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4, 5, 6 | 2, 3 |
| 2 | None | 4, 5, 6 | 1, 3 |
| 3 | None | 4, 7 | 1, 2 |
| 4 | 1, 2, 3 | 7, 8 | 5, 6 |
| 5 | 1, 2 | 8 | 4, 6 |
| 6 | 1, 2 | 8 | 4, 5 |
| 7 | 4 | 8 | 5, 6 |
| 8 | 4, 5, 6, 7 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Dispatch |
|------|-------|---------------------|
| 1 | 1, 2, 3 | 3 parallel agents (quick category each) |
| 2 | 4, 5, 6 | 3 parallel agents after Wave 1 |
| 3 | 7, 8 | Sequential: 7 then 8 |

---

## TODOs

- [ ] 1. EMR 인증 시스템 생성 (Auth Context + Protected Route + Login Page)

  **What to do**:
  - Create `src/contexts/EMRAuthContext.tsx`:
    - Password: `emr2024!` (different from CRM)
    - SessionStorage key: `plastic-hospital-emr-auth`
    - Interface: `{ isAuthenticated: boolean; login: (password: string) => boolean; logout: () => void }`
    - Follow exact same pattern as `AdminAuthContext.tsx` but with EMR-specific constants
  - Create `src/components/emr/EMRProtectedRoute.tsx`:
    - Check `useEMRAuth().isAuthenticated`
    - Redirect to `/emr/login` if not authenticated
    - Follow exact same pattern as `ProtectedRoute.tsx`
  - Create `src/pages/emr/EMRLogin.tsx`:
    - Korean UI: "전자의무기록 로그인", "뷰티플 성형외과 전자의무기록 시스템"
    - Same card layout as AdminLogin.tsx but with EMR branding
    - On success, navigate to `/emr`
    - Demo password hint: `데모 비밀번호: emr2024!`
    - Use Stethoscope icon instead of Lock icon for EMR branding differentiation

  **Must NOT do**:
  - Do NOT modify AdminAuthContext.tsx in this task
  - Do NOT create shared auth utilities
  - Do NOT add role-based logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward file creation following existing patterns, no complex logic
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Login page needs polished Korean UI with rose/pink theme

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5, 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/contexts/AdminAuthContext.tsx:1-44` — EXACT pattern to replicate: createContext, useState with sessionStorage init, login/logout callbacks, Provider component, useHook
  - `src/components/admin/ProtectedRoute.tsx:1-13` — EXACT pattern: check isAuthenticated, Navigate redirect
  - `src/pages/admin/AdminLogin.tsx:1-72` — EXACT pattern: Card+form layout, password input, error display, demo hint

  **API/Type References**:
  - No new types needed — auth interface is inline in context file

  **Documentation References**:
  - This plan's "Must NOT Have" section — no shared abstractions

  **WHY Each Reference Matters**:
  - AdminAuthContext.tsx: Copy this exact structure, change PASSWORD constant and STORAGE_KEY
  - ProtectedRoute.tsx: Copy this exact structure, change hook and redirect path
  - AdminLogin.tsx: Copy this exact structure, change text to EMR-specific Korean labels and navigate path

  **Acceptance Criteria**:

  ```bash
  # Verify files exist
  ls src/contexts/EMRAuthContext.tsx src/components/emr/EMRProtectedRoute.tsx src/pages/emr/EMRLogin.tsx
  # Assert: all 3 files listed, exit code 0
  ```

  ```bash
  # Verify TypeScript compilation of new files
  npx tsc --noEmit src/contexts/EMRAuthContext.tsx 2>&1 || true
  # Note: Full build verification in Task 8
  ```

  **Evidence to Capture:**
  - [ ] File contents of all 3 new files

  **Commit**: YES
  - Message: `feat(emr): add EMR auth context, protected route, and login page`
  - Files: `src/contexts/EMRAuthContext.tsx`, `src/components/emr/EMRProtectedRoute.tsx`, `src/pages/emr/EMRLogin.tsx`

---

- [ ] 2. EMR 레이아웃 컴포넌트 생성 (Sidebar + Layout)

  **What to do**:
  - Create `src/components/emr/EMRLayout.tsx`:
    - Follow exact same layout structure as `AdminLayout.tsx` (desktop sidebar + mobile Sheet)
    - Sidebar header: "뷰티플 성형외과" / "전자의무기록 시스템" (instead of "예약 관리 시스템")
    - Navigation items (EMR-specific):
      ```typescript
      const navItems = [
        { label: '대시보드', href: '/emr', icon: LayoutDashboard },
        { label: '환자 관리', href: '/emr/patients', icon: Users },
        { label: '진료 기록', href: '/emr/records', icon: FileText },
      ]
      ```
    - Logout: call `useEMRAuth().logout()`, navigate to `/emr/login`
    - Footer links: "홈페이지로" (/) and "로그아웃"
    - Mobile top bar: "뷰티플 EMR" (instead of "뷰티플 관리")
    - Uses `<Outlet />` for nested routes

  **Must NOT do**:
  - Do NOT add CRM links (bookings) to EMR sidebar
  - Do NOT create a shared layout component

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component following exact existing pattern
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Sidebar layout needs consistent rose/pink design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 4, 5, 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/admin/AdminLayout.tsx:1-127` — EXACT pattern to replicate: SidebarContent component, navItems array, isActive logic, Sheet for mobile, `<Outlet />` main content area, logout handler

  **API/Type References**:
  - `src/contexts/EMRAuthContext.tsx:useEMRAuth` — hook to use for logout (created in Task 1, but can code against the interface now)

  **WHY Each Reference Matters**:
  - AdminLayout.tsx: This is the EXACT structure to copy. Change navItems, title text, auth hook, and route prefixes.

  **Acceptance Criteria**:

  ```bash
  # Verify file exists
  ls src/components/emr/EMRLayout.tsx
  # Assert: file listed, exit code 0
  ```

  **Evidence to Capture:**
  - [ ] File content showing EMR-specific nav items and sidebar branding

  **Commit**: YES
  - Message: `feat(emr): add EMR layout with dedicated sidebar navigation`
  - Files: `src/components/emr/EMRLayout.tsx`

---

- [ ] 3. CRM 인증 및 레이아웃 정리 (Remove EMR from CRM)

  **What to do**:
  - Update `src/contexts/AdminAuthContext.tsx`:
    - Change password from `beauty1234` to `admin2024!` (new CRM-specific password)
    - Keep the same sessionStorage key (existing sessions preserved)
    - No structural changes needed
  - Update `src/components/admin/AdminLayout.tsx`:
    - Remove EMR nav items from `navItems` array
    - Keep ONLY:
      ```typescript
      const navItems = [
        { label: '대시보드', href: '/admin', icon: LayoutDashboard },
        { label: '예약 관리', href: '/admin/bookings', icon: CalendarDays },
      ]
      ```
    - Remove `Users` and `FileText` icon imports (no longer needed)
    - Sidebar subtitle remains: "예약 관리 시스템"
  - Update `src/components/admin/ProtectedRoute.tsx`:
    - No changes needed — already redirects to `/admin/login`

  **Must NOT do**:
  - Do NOT change the sessionStorage key name
  - Do NOT add any EMR-related imports

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple edits to existing files, removing lines
  - **Skills**: []
    - No special skills needed — straightforward edits

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 4, 7
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/contexts/AdminAuthContext.tsx:3` — Line with `ADMIN_PASSWORD = 'beauty1234'` → change to `admin2024!`
  - `src/components/admin/AdminLayout.tsx:18-23` — navItems array → remove patients and records items
  - `src/components/admin/AdminLayout.tsx:13-14` — `Users` and `FileText` imports → remove
  - `src/pages/admin/AdminLogin.tsx:65` — Demo password hint → update to `admin2024!`

  **WHY Each Reference Matters**:
  - Line 3 of AdminAuthContext: Exact line to change the password
  - Lines 18-23 of AdminLayout: Exact array to trim down to 2 items
  - Line 65 of AdminLogin: Demo hint must match new password

  **Acceptance Criteria**:

  ```bash
  # Verify password changed in context
  grep -c "admin2024!" src/contexts/AdminAuthContext.tsx
  # Assert: output is "1"

  # Verify EMR nav items removed from admin layout
  grep -c "patients" src/components/admin/AdminLayout.tsx
  # Assert: output is "0"

  # Verify demo hint updated in login page
  grep -c "admin2024!" src/pages/admin/AdminLogin.tsx
  # Assert: output is "1"
  ```

  **Evidence to Capture:**
  - [ ] grep output confirming password change and nav item removal

  **Commit**: YES
  - Message: `refactor(admin): remove EMR access from CRM, update password`
  - Files: `src/contexts/AdminAuthContext.tsx`, `src/components/admin/AdminLayout.tsx`, `src/pages/admin/AdminLogin.tsx`

---

- [ ] 4. App.tsx 라우트 트리 분리 (Separate Route Trees)

  **What to do**:
  - Rewrite `src/App.tsx` with two independent route trees:
    ```
    Provider Hierarchy:
    <BrowserRouter>
      <BookingProvider>        ← stays top-level for public booking form
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          {/* CRM (원무과) */}
          <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
          <Route path="/admin" element={
            <AdminAuthProvider>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </AdminAuthProvider>
          }>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
          </Route>

          {/* EMR (전자의무기록) */}
          <Route path="/emr/login" element={<EMRAuthProvider><EMRLogin /></EMRAuthProvider>} />
          <Route path="/emr" element={
            <EMRAuthProvider>
              <EMRProvider>
                <EMRProtectedRoute>
                  <EMRLayout />
                </EMRProtectedRoute>
              </EMRProvider>
            </EMRAuthProvider>
          }>
            <Route index element={<EMRDashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/new" element={<NewPatient />} />
            <Route path="patients/:id" element={<PatientChart />} />
            <Route path="records" element={<RecordsList />} />
          </Route>
        </Routes>
      </BookingProvider>
    </BrowserRouter>
    ```
  - Key architectural decisions:
    - `AdminAuthProvider` wraps ONLY CRM routes (not EMR)
    - `EMRAuthProvider` wraps ONLY EMR routes (not CRM)
    - `EMRProvider` (data) wraps ONLY EMR routes
    - `BookingProvider` stays at top level (needed by public booking form in Home)
    - Login pages need their own auth provider wrapper for the hook to work
  - Update imports to use new file locations

  **Must NOT do**:
  - Do NOT wrap EMR routes with AdminAuthProvider
  - Do NOT wrap CRM routes with EMRProvider
  - Do NOT remove BookingProvider from around public routes
  - Do NOT add catch-all routes or 404 pages (not requested)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file rewrite with clear structure
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (partially — can parallelize with 5, 6)
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  **Pattern References**:
  - `src/App.tsx:1-51` — Current route structure to modify. Keep the import style and BrowserRouter wrapper.

  **API/Type References**:
  - `src/contexts/EMRAuthContext.tsx:EMRAuthProvider, useEMRAuth` — New provider and hook (from Task 1)
  - `src/components/emr/EMRLayout.tsx:EMRLayout` — New layout (from Task 2)
  - `src/components/emr/EMRProtectedRoute.tsx:EMRProtectedRoute` — New guard (from Task 1)
  - `src/pages/emr/EMRLogin.tsx:EMRLogin` — New login page (from Task 1)
  - `src/pages/emr/EMRDashboard.tsx:EMRDashboard` — New dashboard (from Task 6)

  **WHY Each Reference Matters**:
  - Current App.tsx is the ONLY file that wires routes — this rewrite completely restructures it
  - Import paths change because EMR pages move from `src/pages/admin/emr/` to `src/pages/emr/`

  **Acceptance Criteria**:

  ```bash
  # Verify no EMR routes under /admin
  grep -c "patients\|records" src/App.tsx | head -1
  # Should only appear in /emr section

  # Verify separate provider wrapping
  grep -c "EMRAuthProvider" src/App.tsx
  # Assert: appears 2 times (login wrapper + routes wrapper)

  grep -c "AdminAuthProvider" src/App.tsx
  # Assert: appears 2 times (login wrapper + routes wrapper)
  ```

  **Evidence to Capture:**
  - [ ] Full content of rewritten App.tsx

  **Commit**: YES
  - Message: `feat(routes): separate CRM and EMR route trees with independent auth`
  - Files: `src/App.tsx`

---

- [ ] 5. EMR 페이지 이동 및 내부 링크 수정 (Relocate + Update Links)

  **What to do**:
  - Move EMR page files:
    - `src/pages/admin/emr/PatientList.tsx` → `src/pages/emr/PatientList.tsx`
    - `src/pages/admin/emr/NewPatient.tsx` → `src/pages/emr/NewPatient.tsx`
    - `src/pages/admin/emr/PatientChart.tsx` → `src/pages/emr/PatientChart.tsx`
    - `src/pages/admin/emr/RecordsList.tsx` → `src/pages/emr/RecordsList.tsx`
  - Delete empty directory: `src/pages/admin/emr/`
  - Update ALL internal links in moved files:
    - PatientList.tsx:
      - Line 45: `/admin/patients/new` → `/emr/patients/new`
      - Line 111: `/admin/patients/${patient.id}` → `/emr/patients/${patient.id}`
    - NewPatient.tsx:
      - Line 52: `navigate('/admin/patients/${patient.id}')` → `navigate('/emr/patients/${patient.id}')`
      - Line 59: `/admin/patients` → `/emr/patients`
      - Line 196: `/admin/patients` → `/emr/patients`
    - PatientChart.tsx:
      - Line 737: `/admin/patients` → `/emr/patients` (back button link text)
      - Line 746: `navigate('/admin/patients')` → `navigate('/emr/patients')`
    - RecordsList.tsx:
      - Line 107: `/admin/patients/${record.patientId}` → `/emr/patients/${record.patientId}`
  - Replace ALL occurrences of `/admin/patients` with `/emr/patients` in these 4 files

  **Must NOT do**:
  - Do NOT change any component logic or data handling
  - Do NOT change any Korean labels
  - Do NOT modify imports (relative imports to @/ remain the same)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File moves + string replacements, no logic changes
  - **Skills**: []
    - No special skills needed — straightforward path updates

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 8
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/PatientList.tsx:45,111` — Lines containing `/admin/patients` links
  - `src/pages/admin/emr/NewPatient.tsx:52,59,196` — Lines containing `/admin/patients` links
  - `src/pages/admin/emr/PatientChart.tsx:737,746` — Lines containing `/admin/patients` links
  - `src/pages/admin/emr/RecordsList.tsx:107` — Line containing `/admin/patients` link

  **WHY Each Reference Matters**:
  - Every internal link MUST be updated or users will navigate to CRM routes from EMR pages, breaking the separation

  **Acceptance Criteria**:

  ```bash
  # Verify files moved
  ls src/pages/emr/PatientList.tsx src/pages/emr/NewPatient.tsx src/pages/emr/PatientChart.tsx src/pages/emr/RecordsList.tsx
  # Assert: all 4 files listed, exit code 0

  # Verify old directory removed
  ls src/pages/admin/emr/ 2>&1
  # Assert: "No such file or directory"

  # Verify no /admin/patients links remain in EMR pages
  grep -r "/admin/patients" src/pages/emr/
  # Assert: no output (0 matches)

  # Verify /emr/patients links exist
  grep -r "/emr/patients" src/pages/emr/ | wc -l
  # Assert: > 0
  ```

  **Evidence to Capture:**
  - [ ] grep output confirming no /admin/patients references remain

  **Commit**: YES
  - Message: `refactor(emr): relocate EMR pages to src/pages/emr and update internal links`
  - Files: `src/pages/emr/PatientList.tsx`, `src/pages/emr/NewPatient.tsx`, `src/pages/emr/PatientChart.tsx`, `src/pages/emr/RecordsList.tsx`

---

- [ ] 6. EMR 대시보드 생성 (Rich EMR Dashboard)

  **What to do**:
  - Enhance `src/services/emrStorage.ts` — add new query methods:
    ```typescript
    // Add these methods to the emrStorage object:
    getAllRecords(): MedicalRecord[]  // all records sorted by date desc
    getAllProcedures(): ProcedureRecord[]  // all procedures sorted by date desc
    getAllPrescriptions(): Prescription[]  // all prescriptions sorted by date desc
    getRecentRecords(limit: number): (MedicalRecord & { patientName: string })[]
    getRecentPrescriptions(limit: number): (Prescription & { patientName: string })[]
    getDetailedStats(): {
      totalPatients: number
      totalRecords: number
      totalProcedures: number
      scheduledProcedures: number
      completedProcedures: number
      cancelledProcedures: number
      totalPrescriptions: number
      recentPatients: Patient[]  // last 5 registered
    }
    ```
  - Create `src/pages/emr/EMRDashboard.tsx` — rich dashboard with these sections:
    1. **Header**: "전자의무기록 대시보드" with today's date
    2. **Stat Cards Row** (4 cards in grid):
       - 전체 환자 (totalPatients) — Users icon, blue
       - 전체 진료기록 (totalRecords) — Stethoscope icon, green
       - 예정 시술 (scheduledProcedures) — Calendar icon, yellow
       - 완료 시술 (completedProcedures) — CheckCircle icon, emerald
    3. **Second Row** (2 cards):
       - 전체 처방전 (totalPrescriptions) — Pill icon, purple
       - 취소 시술 (cancelledProcedures) — XCircle icon, red
    4. **최근 진료 기록** (Recent Medical Records) — table/list of last 5 records with patient name, date, diagnosis, doctor. Click links to `/emr/patients/:id`
    5. **최근 처방전** (Recent Prescriptions) — list of last 5 prescriptions with patient name, date, medication count
    6. **최근 등록 환자** (Recently Registered Patients) — list of last 5 patients with name, chart number, registration date. Click links to `/emr/patients/:id`
    7. **시술 현황** (Procedure Status Overview) — visual breakdown of scheduled/completed/cancelled
  - All Korean labels, rose/pink theme consistent with CRM dashboard
  - Use Card, CardHeader, CardTitle, CardContent, Badge, Table components
  - Follow same stat card pattern as CRM Dashboard.tsx but with more sections

  **Must NOT do**:
  - Do NOT modify existing emrStorage methods (only add new ones)
  - Do NOT change Patient, MedicalRecord, etc. type definitions
  - Do NOT use external charting libraries

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Rich dashboard with multiple sections, needs polished UI design
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Dashboard needs thoughtful layout, card design, visual hierarchy

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 8
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `src/pages/admin/Dashboard.tsx:1-184` — CRM dashboard pattern: stat cards grid, today's bookings list, upcoming bookings list. Follow this EXACT card structure and styling pattern but with EMR data.
  - `src/services/emrStorage.ts:114-124` — Existing `getStats()` method — extend this pattern for `getDetailedStats()`
  - `src/services/emrStorage.ts:28-35` — `getPatients()` pattern — follow for new query methods

  **API/Type References**:
  - `src/types/emr.ts:1-114` — All EMR types (Patient, MedicalRecord, ProcedureRecord, Prescription, PROCEDURE_STATUS_LABELS, PROCEDURE_STATUS_COLORS)
  - `src/contexts/EMRContext.tsx:5-18` — EMRContextValue interface — dashboard will use `useEMR()` hook

  **External References**:
  - No external references needed

  **WHY Each Reference Matters**:
  - Dashboard.tsx: Exact visual pattern to follow (stat card layout, list sections, link styling)
  - emrStorage getStats(): Foundation to extend — add procedure breakdowns, prescription count, recent items
  - types/emr.ts: Need PROCEDURE_STATUS_LABELS and PROCEDURE_STATUS_COLORS for the procedure status section

  **Acceptance Criteria**:

  ```bash
  # Verify files exist
  ls src/pages/emr/EMRDashboard.tsx
  # Assert: file listed

  # Verify emrStorage has new methods
  grep -c "getDetailedStats\|getAllRecords\|getAllProcedures\|getAllPrescriptions\|getRecentRecords\|getRecentPrescriptions" src/services/emrStorage.ts
  # Assert: >= 6

  # Verify dashboard imports useEMR
  grep -c "useEMR" src/pages/emr/EMRDashboard.tsx
  # Assert: >= 1

  # Verify Korean labels in dashboard
  grep -c "전자의무기록\|전체 환자\|진료기록\|처방전\|시술" src/pages/emr/EMRDashboard.tsx
  # Assert: >= 5
  ```

  **Evidence to Capture:**
  - [ ] File content of EMRDashboard.tsx
  - [ ] Updated emrStorage.ts showing new methods

  **Commit**: YES
  - Message: `feat(emr): create rich EMR dashboard with clinical statistics`
  - Files: `src/pages/emr/EMRDashboard.tsx`, `src/services/emrStorage.ts`

---

- [ ] 7. CRM 대시보드 정리 (Ensure CRM Dashboard is EMR-free)

  **What to do**:
  - Review `src/pages/admin/Dashboard.tsx`:
    - Confirm it only uses `useBookings()` (already the case based on code review)
    - Confirm no EMR imports or references
    - No changes needed if already clean (current code IS clean — only imports BookingContext)
  - Review `src/pages/admin/BookingList.tsx` and `src/pages/admin/BookingDetail.tsx`:
    - Confirm no EMR imports (already clean)
    - No changes needed
  - IF any EMR references exist, remove them
  - Update Dashboard.tsx subtitle from "2026년 2월 6일 목요일" to use dynamic date:
    ```typescript
    const today = new Date()
    const dateStr = today.toLocaleDateString('ko-KR', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
    })
    ```
  - Similarly update the hardcoded date in todayBookings filter to use actual today's date

  **Must NOT do**:
  - Do NOT add EMR functionality to CRM
  - Do NOT change booking logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification + minor date fix, minimal changes
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential after Task 4)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 8
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `src/pages/admin/Dashboard.tsx:16-28` — Hardcoded dates `'2026-02-06'` → replace with dynamic today's date
  - `src/pages/admin/Dashboard.tsx:34` — Hardcoded date string "2026년 2월 6일 목요일" → replace with dynamic

  **WHY Each Reference Matters**:
  - Lines 16-28: todayBookings and upcomingBookings use hardcoded date — must be dynamic for production
  - Line 34: Display date is hardcoded — must be dynamic

  **Acceptance Criteria**:

  ```bash
  # Verify no EMR imports in CRM pages
  grep -r "useEMR\|EMRContext\|emrStorage" src/pages/admin/
  # Assert: no output (0 matches)

  # Verify hardcoded dates removed
  grep -c "2026-02-06" src/pages/admin/Dashboard.tsx
  # Assert: output is "0"

  # Verify dynamic date logic
  grep -c "toLocaleDateString\|new Date()" src/pages/admin/Dashboard.tsx
  # Assert: >= 1
  ```

  **Evidence to Capture:**
  - [ ] grep output confirming no EMR references in CRM pages

  **Commit**: YES
  - Message: `fix(admin): use dynamic dates in CRM dashboard, verify EMR separation`
  - Files: `src/pages/admin/Dashboard.tsx`

---

- [ ] 8. 빌드 검증 및 종합 테스트 (Build Verification + Comprehensive Testing)

  **What to do**:
  - Run full build: `npm run build`
    - Fix any TypeScript errors
    - Fix any import path errors
    - Ensure exit code 0
  - Run lint: `npm run lint`
    - Fix any linting errors
  - Verify route isolation via browser:
    1. **CRM Login Flow**:
       - Navigate to `/admin/login`
       - Login with `admin2024!`
       - Verify redirect to `/admin` dashboard
       - Verify sidebar has only: 대시보드, 예약 관리
       - Click through bookings pages
       - Verify `/admin/patients` is NOT accessible (no nav link, route doesn't exist)
    2. **EMR Login Flow**:
       - Navigate to `/emr/login`
       - Login with `emr2024!`
       - Verify redirect to `/emr` dashboard
       - Verify dashboard shows: patient stats, recent records, procedure stats, prescriptions, recent patients
       - Verify sidebar has: 대시보드, 환자 관리, 진료 기록
       - Click through patient list → patient chart → all tabs work
       - Verify `/emr/bookings` is NOT accessible (no route)
    3. **Cross-Auth Verification**:
       - While logged into CRM, navigate to `/emr` → should redirect to `/emr/login`
       - While logged into EMR, navigate to `/admin` → should redirect to `/admin/login`
    4. **Public Site**:
       - Navigate to `/` → home page works
       - Submit a booking → works (BookingProvider still active)
  - Verify vercel.json still works (SPA catch-all rewrite handles all routes)

  **Must NOT do**:
  - Do NOT skip build verification
  - Do NOT skip cross-auth testing

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Comprehensive browser testing across multiple flows
  - **Skills**: [`playwright`]
    - `playwright`: Browser automation for testing login flows, navigation, route isolation

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final, sequential)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 4, 5, 6, 7

  **References**:

  **Pattern References**:
  - `package.json:8` — build command: `tsc -b && vite build`
  - `vercel.json:1-5` — SPA rewrite config (should not need changes)
  - All files created/modified in Tasks 1-7

  **WHY Each Reference Matters**:
  - package.json build script: This is the exact command to run for verification
  - vercel.json: Confirm the catch-all rewrite handles both /admin/* and /emr/* paths

  **Acceptance Criteria**:

  ```bash
  # Full build succeeds
  npm run build
  # Assert: exit code 0, no errors

  # Lint passes
  npm run lint
  # Assert: exit code 0
  ```

  ```
  # Browser verification via playwright:
  1. Start dev server: npm run dev
  2. Navigate to http://localhost:5173/admin/login
  3. Fill password: admin2024!
  4. Click login
  5. Assert: URL is /admin
  6. Assert: sidebar contains "대시보드" and "예약 관리"
  7. Assert: sidebar does NOT contain "환자 관리" or "진료 기록"
  8. Screenshot: .sisyphus/evidence/crm-dashboard.png

  9. Navigate to http://localhost:5173/emr/login
  10. Fill password: emr2024!
  11. Click login
  12. Assert: URL is /emr
  13. Assert: page contains "전자의무기록 대시보드"
  14. Assert: page contains "전체 환자"
  15. Assert: sidebar contains "환자 관리" and "진료 기록"
  16. Screenshot: .sisyphus/evidence/emr-dashboard.png

  17. Navigate to http://localhost:5173/
  18. Assert: home page loads
  19. Screenshot: .sisyphus/evidence/public-home.png
  ```

  **Evidence to Capture:**
  - [ ] `npm run build` terminal output showing success
  - [ ] Screenshots of CRM dashboard, EMR dashboard, and public home page
  - [ ] Browser verification of route isolation

  **Commit**: YES (if any fixes needed)
  - Message: `fix: resolve build errors and verify CRM/EMR separation`
  - Files: Any files that needed fixes

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(emr): add EMR auth context, protected route, and login page` | 3 new files | Files exist |
| 2 | `feat(emr): add EMR layout with dedicated sidebar navigation` | 1 new file | File exists |
| 3 | `refactor(admin): remove EMR access from CRM, update password` | 3 modified files | grep checks |
| 4 | `feat(routes): separate CRM and EMR route trees with independent auth` | 1 modified file | grep checks |
| 5 | `refactor(emr): relocate EMR pages to src/pages/emr and update internal links` | 4 moved files | grep: no /admin/patients |
| 6 | `feat(emr): create rich EMR dashboard with clinical statistics` | 2 files | Files exist, Korean labels |
| 7 | `fix(admin): use dynamic dates in CRM dashboard, verify EMR separation` | 1 file | No hardcoded dates |
| 8 | `fix: resolve build errors and verify CRM/EMR separation` | Any fixes | `npm run build` → 0 |

---

## Success Criteria

### Verification Commands
```bash
npm run build          # Expected: exit code 0
npm run lint           # Expected: exit code 0

# Route separation
grep -r "useEMR\|EMRContext\|emrStorage" src/pages/admin/  # Expected: no matches
grep -r "/admin/patients" src/pages/emr/                   # Expected: no matches

# Auth separation
grep "admin2024!" src/contexts/AdminAuthContext.tsx         # Expected: 1 match
grep "emr2024!" src/contexts/EMRAuthContext.tsx             # Expected: 1 match
```

### Final Checklist
- [ ] CRM has: dashboard (bookings stats), booking list, booking detail
- [ ] CRM does NOT have: patient list, patient chart, records, procedures, prescriptions
- [ ] EMR has: rich dashboard, patient list, new patient, patient chart (4 tabs), records list
- [ ] EMR does NOT have: booking management
- [ ] CRM password: `admin2024!`
- [ ] EMR password: `emr2024!`
- [ ] Separate sessionStorage keys (no cross-auth)
- [ ] All UI in Korean
- [ ] Rose/pink theme consistent
- [ ] Build succeeds
- [ ] Public site + booking form still works
- [ ] Vercel deployment compatible
