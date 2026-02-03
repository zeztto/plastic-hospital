# EMR 추가 고도화 (Additional Enhancements)

## TL;DR

> **Quick Summary**: Enhance the Korean plastic surgery EMR system with edit functionality for all entities, missing Prescriptions list page, toast notifications, confirmation dialogs, improved dashboard navigation, client-side pagination, column sorting, and loading states.
> 
> **Deliverables**:
> - Edit functionality for Patient, MedicalRecord, ProcedureRecord, Prescription
> - Prescriptions list page with search
> - Toast notification system (sonner) for all CRUD operations
> - AlertDialog confirmation for all delete actions
> - Dashboard links pointing to detail pages
> - Client-side pagination (10 items/page) on all list pages
> - Clickable column sorting on all tables
> - Loading state indicators
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 (toast+dialog infra) → Tasks 2-6 (features using infra) → Task 7-8 (pagination+sorting) → Task 9 (loading states)

---

## Context

### Original Request
사용자는 "추가 고도화" (additional enhancements)를 요청. 기존 MVP EMR 시스템을 더 완성도 있게 개선하는 것이 목표.

### Interview Summary
**Key Discussions**:
- User provided exhaustive project context including all routes, data models, storage ops, and identified gaps
- Priority order: Edit → Prescriptions list → Toast → Confirm dialogs → Dashboard links → Pagination → Sorting → Loading states
- localStorage-based demo app - no backend, no auth changes, no external APIs

**Research Findings**:
- Storage layer has `updatePatient`, `updateRecord`, `updateProcedure` but missing `updatePrescription` and `deletePatient`
- EMRContext exposes update ops for Patient/Record/Procedure but NOT for Prescription
- All create forms use plain `useState` with Dialog modals (not react-hook-form)
- Delete actions use `window.confirm()` - no proper confirmation dialog
- No toast library installed, no `alert-dialog.tsx` or `toast.tsx` in components/ui/
- Dashboard links ALL point to `/emr/patients/${id}` instead of direct detail pages
- Sidebar navigation has no "처방전" (Prescriptions) link
- EMR pages are in `src/pages/admin/emr/` (not `src/pages/emr/`)

### Metis Review
**Identified Gaps** (addressed):
- Missing `updatePrescription` in storage AND context - added to Task 2
- Sidebar nav needs "처방전" link - added to Task 3
- Need `getAllRecords`, `getAllProcedures`, `getAllPrescriptions` in context for list pages - currently using `emrStorage` directly which bypasses context's refresh cycle - added context expansion to Task 2

---

## Work Objectives

### Core Objective
Transform the EMR MVP into a polished, production-quality demo by filling critical CRUD gaps and adding essential UX patterns (toast, confirmation, pagination, sorting, loading).

### Concrete Deliverables
- `src/components/ui/sonner.tsx` - Toaster component
- `src/components/ui/alert-dialog.tsx` - AlertDialog component
- Updated `src/services/emrStorage.ts` - add `updatePrescription`, `deletePatient`
- Updated `src/contexts/EMRContext.tsx` - add `updatePrescription`, `deletePatient`, `getAllRecords`, `getAllProcedures`, `getAllPrescriptions`
- Edit dialogs in PatientChart.tsx (InfoTab edit, RecordsTab edit, ProceduresTab edit, PrescriptionsTab edit)
- Edit buttons in RecordDetail, ProcedureDetail, PrescriptionDetail
- `src/pages/admin/emr/PrescriptionsList.tsx` - new list page
- Updated `src/App.tsx` - add prescriptions route
- Updated `src/components/emr/EMRLayout.tsx` - add prescriptions nav item
- Updated dashboard with direct links to detail pages
- Pagination on PatientList, RecordsList, ProceduresList, PrescriptionsList
- Column sorting on all list tables
- Loading state indicators

### Definition of Done
- [ ] All 4 entity types can be edited after creation
- [ ] Prescriptions list page accessible at `/emr/prescriptions`
- [ ] Toast notifications appear for create, update, delete operations
- [ ] Delete actions show AlertDialog confirmation (no more window.confirm)
- [ ] Dashboard items link to their detail pages
- [ ] List pages show 10 items per page with pagination controls
- [ ] Table columns are sortable by clicking headers
- [ ] Pages show loading indicators during data fetch

### Must Have
- Korean language UI (all labels, messages in Korean)
- Follow existing code patterns (useState for forms, Dialog for modals)
- All edits persist to localStorage
- Toast messages for success/error feedback

### Must NOT Have (Guardrails)
- Do NOT use react-hook-form or zod for edit forms (existing pattern is plain useState)
- Do NOT add backend/API integration
- Do NOT modify auth system
- Do NOT add charts/graphs to dashboard (separate scope)
- Do NOT add print/export functionality (separate scope)
- Do NOT add breadcrumb navigation (separate scope)
- Do NOT over-abstract - keep inline form state as per existing pattern
- Do NOT add date range filters (separate scope)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Not requested
- **Framework**: none
- **QA approach**: Manual verification via Playwright browser automation

### Automated Verification

Each TODO includes Playwright-based verification procedures that agents can run directly.

**Evidence Requirements (Agent-Executable):**
- Navigate to pages and verify elements exist via DOM assertions
- Fill forms and verify data persistence
- Click buttons and verify toast/dialog appearance
- Screenshots saved to `.sisyphus/evidence/`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Toast + AlertDialog infrastructure setup
└── Task 2: Storage & Context layer enhancements (updatePrescription, deletePatient, getAll*)

Wave 2 (After Wave 1):
├── Task 3: Prescriptions list page + nav link
├── Task 4: Edit functionality for Patient (InfoTab)
├── Task 5: Edit functionality for Records + Procedures + Prescriptions
└── Task 6: Toast notifications + AlertDialog confirmations across all pages

Wave 3 (After Wave 2):
├── Task 7: Dashboard navigation improvements
├── Task 8: Pagination for all list pages
└── Task 9: Column sorting for all tables

Wave 4 (After Wave 3):
└── Task 10: Loading states across all pages

Critical Path: Task 1 → Task 6 → Task 8
Parallel Speedup: ~45% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 6 | 2 |
| 2 | None | 3, 4, 5, 6, 7 | 1 |
| 3 | 2 | 7, 8, 9 | 4, 5, 6 |
| 4 | 2 | 10 | 3, 5, 6 |
| 5 | 2 | 10 | 3, 4, 6 |
| 6 | 1, 2 | 10 | 3, 4, 5 |
| 7 | 2, 3 | 10 | 8, 9 |
| 8 | 3 | 10 | 7, 9 |
| 9 | 3 | 10 | 7, 8 |
| 10 | 4, 5, 6 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | Two parallel `visual-engineering` agents with `frontend-ui-ux` skill |
| 2 | 3, 4, 5, 6 | Four parallel `visual-engineering` agents with `frontend-ui-ux` skill |
| 3 | 7, 8, 9 | Three parallel `visual-engineering` agents |
| 4 | 10 | One `quick` agent |

---

## TODOs

- [ ] 1. Toast 및 AlertDialog UI 인프라 설치

  **What to do**:
  - Install `sonner` package: `npm install sonner`
  - Add `alert-dialog` shadcn component: Create `src/components/ui/alert-dialog.tsx` following shadcn/ui pattern with Radix AlertDialog
  - Create `src/components/ui/sonner.tsx` wrapper component for the Toaster
  - Add `<Toaster />` to `src/App.tsx` (inside BrowserRouter, after Routes)
  - Verify sonner works with a test toast

  **Must NOT do**:
  - Do NOT use react-hot-toast or other toast libraries (use sonner specifically)
  - Do NOT create custom toast implementation

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small infrastructure task - install package and create 2 component files
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Needed for proper shadcn/ui component patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/components/ui/dialog.tsx` - Existing Radix dialog component pattern (follow same export/import style)
  - `src/components/ui/sheet.tsx` - Another Radix-based overlay component for reference
  - `src/App.tsx:26-78` - Where to add Toaster (after Routes, inside BrowserRouter)

  **API/Type References**:
  - `package.json` - Add sonner dependency here

  **External References**:
  - sonner docs: https://sonner.emilkowal.dev - Toast API and customization
  - shadcn/ui sonner: https://ui.shadcn.com/docs/components/sonner - Shadcn wrapper pattern
  - shadcn/ui alert-dialog: https://ui.shadcn.com/docs/components/alert-dialog - AlertDialog component

  **WHY Each Reference Matters**:
  - `dialog.tsx`: Follow the exact same Radix primitive wrapping pattern for alert-dialog
  - `App.tsx`: The Toaster must be rendered at the root level to be accessible from any page
  - Sonner docs: Need correct API for toast() function calls

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  1. Run: npm ls sonner → Assert: sonner is listed in dependencies
  2. Check file exists: src/components/ui/sonner.tsx
  3. Check file exists: src/components/ui/alert-dialog.tsx
  4. Run: npx tsc --noEmit → Assert: No TypeScript errors
  5. Navigate to: http://localhost:5173/emr (after login)
  6. Assert: Toaster component is rendered in DOM (check for [data-sonner-toaster] selector)
  ```

  **Commit**: YES
  - Message: `feat(ui): add sonner toast and AlertDialog infrastructure`
  - Files: `package.json, package-lock.json, src/components/ui/sonner.tsx, src/components/ui/alert-dialog.tsx, src/App.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 2. Storage 및 Context 레이어 확장

  **What to do**:
  - Add `updatePrescription(id, data)` to `emrStorage` in `src/services/emrStorage.ts`:
    - Same pattern as `updateRecord` - find by id, merge partial data, persist
    - Preserve `id`, `patientId`, `medicalRecordId` fields (immutable)
  - Add `deletePatient(id)` to `emrStorage` with cascade delete:
    - Delete the patient
    - Delete all MedicalRecords where `patientId` matches
    - Delete all ProcedureRecords where `patientId` matches  
    - Delete all Prescriptions where `patientId` matches
    - Return boolean success
  - Expand `EMRContext` (`src/contexts/EMRContext.tsx`):
    - Add `updatePrescription` function (wrap emrStorage.updatePrescription + refresh)
    - Add `deletePatient` function (wrap emrStorage.deletePatient + refresh)
    - Add `getAllRecords` function (wrap emrStorage.getAllRecords)
    - Add `getAllProcedures` function (wrap emrStorage.getAllProcedures)
    - Add `getAllPrescriptions` function (wrap emrStorage.getAllPrescriptions)
    - Update `EMRContextValue` interface with new functions
    - Update Provider value prop

  **Must NOT do**:
  - Do NOT change existing function signatures
  - Do NOT modify seed data
  - Do NOT change localStorage keys

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward data layer additions following existing patterns exactly
  - **Skills**: []
    - No special skills needed - pure TypeScript logic following established patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 3, 4, 5, 6, 7
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/services/emrStorage.ts:81-88` - `updateRecord` pattern to follow for `updatePrescription`
  - `src/services/emrStorage.ts:89-95` - `deleteRecord` pattern to follow for cascade in `deletePatient`
  - `src/services/emrStorage.ts:118-125` - `updateProcedure` pattern (another update example)
  - `src/contexts/EMRContext.tsx:78-84` - `updateRecord` context wrapper pattern
  - `src/contexts/EMRContext.tsx:85-92` - `deleteRecord` context wrapper pattern
  - `src/contexts/EMRContext.tsx:5-30` - `EMRContextValue` interface to extend

  **API/Type References**:
  - `src/types/emr.ts:65-74` - `Prescription` type definition (fields to preserve: id, patientId, medicalRecordId)
  - `src/types/emr.ts:3-15` - `Patient` type definition

  **WHY Each Reference Matters**:
  - `updateRecord` and `deleteRecord`: Exact patterns to replicate for prescription/patient
  - `EMRContextValue`: Must add new function types to this interface
  - Type definitions: Know which fields are immutable during updates

  **Acceptance Criteria**:

  **Automated Verification (Bash)**:
  ```bash
  # Verify TypeScript compiles
  npx tsc --noEmit
  # Assert: Exit code 0
  
  # Verify updatePrescription exists in storage
  grep -c "updatePrescription" src/services/emrStorage.ts
  # Assert: >= 1
  
  # Verify deletePatient exists in storage
  grep -c "deletePatient" src/services/emrStorage.ts
  # Assert: >= 1
  
  # Verify context exposes new functions
  grep -c "updatePrescription" src/contexts/EMRContext.tsx
  # Assert: >= 2 (interface + implementation)
  
  grep -c "deletePatient" src/contexts/EMRContext.tsx
  # Assert: >= 2
  
  grep -c "getAllRecords" src/contexts/EMRContext.tsx
  # Assert: >= 2
  
  grep -c "getAllPrescriptions" src/contexts/EMRContext.tsx
  # Assert: >= 2
  ```

  **Commit**: YES
  - Message: `feat(emr): add updatePrescription, deletePatient, and getAll* operations`
  - Files: `src/services/emrStorage.ts, src/contexts/EMRContext.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 3. 처방전 목록 페이지 + 사이드바 네비게이션

  **What to do**:
  - Create `src/pages/admin/emr/PrescriptionsList.tsx`:
    - Follow `RecordsList.tsx` pattern exactly (same layout structure)
    - Table columns: 처방일, 환자명, 차트번호, 담당의, 약물 수, 메모 (truncated)
    - Search by 환자명, 담당의, 약물명
    - Use context's `getAllPrescriptions` (from Task 2) or existing patient-based approach
    - Each row links to `/emr/prescriptions/${id}` for prescription detail
    - Patient name links to `/emr/patients/${patientId}` for patient chart
  - Add route in `src/App.tsx`:
    - Import PrescriptionsList
    - Add `<Route path="prescriptions" element={<PrescriptionsList />} />` in EMR section (before `prescriptions/:id`)
  - Add sidebar nav item in `src/components/emr/EMRLayout.tsx`:
    - Add `{ label: '처방전', href: '/emr/prescriptions', icon: Pill }` to `navItems` array
    - Import `Pill` from lucide-react

  **Must NOT do**:
  - Do NOT add pagination yet (Task 8)
  - Do NOT add column sorting yet (Task 9)
  - Keep same visual style as RecordsList and ProceduresList

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Creating a new page with table UI following existing patterns
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Ensure consistent UI quality with existing list pages

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 6)
  - **Blocks**: Tasks 7, 8, 9
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/RecordsList.tsx:1-142` - EXACT pattern to follow for list page layout, search, table structure
  - `src/pages/admin/emr/ProceduresList.tsx:1-171` - Another list page reference (has status filter for extra reference)
  - `src/components/emr/EMRLayout.tsx:19-24` - `navItems` array to add prescriptions link

  **API/Type References**:
  - `src/types/emr.ts:65-74` - `Prescription` and `Medication` types for table columns
  - `src/contexts/EMRContext.tsx` - `getAllPrescriptions` function (added in Task 2)
  - `src/App.tsx:69` - Existing prescriptions/:id route (add list route BEFORE this)

  **WHY Each Reference Matters**:
  - `RecordsList.tsx`: The template to clone - same header, search bar, table structure, empty state
  - `EMRLayout.tsx:navItems`: Exactly where to insert the new nav item
  - `App.tsx:69`: Route must go before the `:id` param route to avoid conflicts

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  1. Navigate to: http://localhost:5173/emr/login
  2. Fill: input[type="password"] with "emr1234"
  3. Click: login button
  4. Assert: Sidebar contains "처방전" link
  5. Click: "처방전" in sidebar navigation
  6. Assert: URL is /emr/prescriptions
  7. Assert: Page title contains "처방전"
  8. Assert: Table is visible with prescription data
  9. Fill: search input with "김뷰티"
  10. Assert: Table rows filter to show only 김뷰티's prescriptions
  11. Screenshot: .sisyphus/evidence/task-3-prescriptions-list.png
  ```

  **Commit**: YES
  - Message: `feat(emr): add prescriptions list page with search and sidebar nav`
  - Files: `src/pages/admin/emr/PrescriptionsList.tsx, src/App.tsx, src/components/emr/EMRLayout.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 4. 환자 정보 수정 기능 (Patient Edit)

  **What to do**:
  - In `src/pages/admin/emr/PatientChart.tsx`, modify the `InfoTab` component:
    - Add "수정" (Edit) button next to "기본 정보" card title
    - Add a Dialog that opens with a form pre-populated with current patient data
    - Form fields: 이름, 생년월일, 성별, 연락처, 주소, 혈액형, 알레르기, 기왕력/병력
    - Immutable fields (display only, NOT editable): 차트번호, 등록일
    - On submit: call `updatePatient(patient.id, formData)` from context
    - After save: call `onUpdated()` callback to refresh data (same pattern as `onCreated`)
  - Update `PatientChart` main component:
    - Add `updatePatient` to useEMR destructure
    - Pass `onUpdated={handleCreated}` (reuse same refresh handler) to InfoTab
  - Add an `onUpdated` prop to `InfoTab`: `{ patient: Patient; onUpdated: () => void }`

  **Must NOT do**:
  - Do NOT allow editing chartNumber or registeredAt
  - Do NOT use react-hook-form (follow existing plain useState pattern)
  - Do NOT add toast here (Task 6 will add toast to all forms)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Modifying existing UI component with form dialog
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form layout quality and UX patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5, 6)
  - **Blocks**: Task 10
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/PatientChart.tsx:53-117` - Current `InfoTab` component to modify
  - `src/pages/admin/emr/PatientChart.tsx:120-328` - `RecordsTab` with Dialog create form (PATTERN to follow for edit dialog)
  - `src/pages/admin/emr/NewPatient.tsx:19-53` - Patient creation form fields (reuse same fields for edit)
  - `src/pages/admin/emr/PatientChart.tsx:706-733` - Main component data loading pattern

  **API/Type References**:
  - `src/contexts/EMRContext.tsx:10` - `updatePatient(id, data: Partial<Patient>)` signature
  - `src/types/emr.ts:3-15` - Patient type (know which fields to include in form)
  - `src/types/emr.ts:76-79` - GENDER_LABELS for select options
  - `src/types/emr.ts:81` - BLOOD_TYPES for select options

  **WHY Each Reference Matters**:
  - `InfoTab`: The exact component to modify - add edit button and dialog
  - `RecordsTab` Dialog: Follow this exact Dialog pattern for the edit dialog (same structure, same styling)
  - `NewPatient.tsx`: Has the complete list of form fields to reuse

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  1. Navigate to: http://localhost:5173/emr/patients/PT-DEMO-001
  2. Assert: Tab "기본정보" is active
  3. Assert: "수정" button is visible
  4. Click: "수정" button
  5. Assert: Edit dialog opens with pre-filled data (name "김미영")
  6. Clear and fill: name field with "김미영수정"
  7. Clear and fill: phone field with "010-0000-0000"
  8. Click: save/submit button in dialog
  9. Assert: Dialog closes
  10. Assert: Page shows updated name "김미영수정"
  11. Assert: Page shows updated phone "010-0000-0000"
  12. Reload page
  13. Assert: Updated name persists ("김미영수정")
  14. Screenshot: .sisyphus/evidence/task-4-patient-edit.png
  ```

  **Commit**: YES
  - Message: `feat(emr): add patient info edit functionality`
  - Files: `src/pages/admin/emr/PatientChart.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 5. 진료기록, 시술기록, 처방전 수정 기능

  **What to do**:

  **Part A: 진료기록 (MedicalRecord) Edit**
  - In `PatientChart.tsx` → `RecordsTab`:
    - The existing create Dialog pattern is the template
    - Add an edit mode: when clicking existing record card, show edit dialog (not just navigate)
    - OR add a small "수정" icon button on each record card that opens an edit dialog
    - Better approach: Add "수정" button on `RecordDetail.tsx` page (next to delete button)
  - In `src/pages/admin/emr/RecordDetail.tsx`:
    - Add "수정" button in the header area (next to back button)
    - Add Dialog with form pre-populated from current record data
    - On submit: call `updateRecord(record.id, formData)` then reload data
    - Form fields: same as create form in RecordsTab (date, doctorName, chiefComplaint, diagnosis, diagnosisCode, vitalSigns, treatmentPlan, notes)

  **Part B: 시술기록 (ProcedureRecord) Edit**
  - In `src/pages/admin/emr/ProcedureDetail.tsx`:
    - Add "수정" button in the header area
    - Add Dialog with form pre-populated from current procedure data
    - On submit: call `updateProcedure(procedure.id, formData)` then reload
    - Form fields: same as create form in ProceduresTab (date, procedureName, doctor, anesthesiaType, duration, details, complications, postOpInstructions, status)

  **Part C: 처방전 (Prescription) Edit**
  - In `src/pages/admin/emr/PrescriptionDetail.tsx`:
    - Add "수정" button in the header area
    - Add Dialog with form pre-populated from current prescription data
    - Medications list: pre-populate all medications, allow add/remove
    - On submit: call `updatePrescription(prescription.id, formData)` then reload
    - Form fields: date, doctorName, medications[], notes

  **Must NOT do**:
  - Do NOT allow editing patientId or medicalRecordId (immutable foreign keys)
  - Do NOT allow editing id or createdAt
  - Do NOT add toast here (Task 6 handles it)
  - Do NOT change the existing create dialog behavior

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Multiple UI edits across 3 files with complex form pre-population
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Complex form dialogs with pre-populated data and medication array editing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 6)
  - **Blocks**: Task 10
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/PatientChart.tsx:120-328` - `RecordsTab` create dialog (EXACT form to replicate for record edit)
  - `src/pages/admin/emr/PatientChart.tsx:332-517` - `ProceduresTab` create dialog (template for procedure edit)
  - `src/pages/admin/emr/PatientChart.tsx:520-703` - `PrescriptionsTab` create dialog with medications array (template for prescription edit)
  - `src/pages/admin/emr/RecordDetail.tsx:54-233` - Record detail page to add edit button/dialog
  - `src/pages/admin/emr/ProcedureDetail.tsx:68-251` - Procedure detail page to add edit button/dialog
  - `src/pages/admin/emr/PrescriptionDetail.tsx:53-183` - Prescription detail page to add edit button/dialog

  **API/Type References**:
  - `src/contexts/EMRContext.tsx:15` - `updateRecord(id, data: Partial<MedicalRecord>)`
  - `src/contexts/EMRContext.tsx:21` - `updateProcedure(id, data: Partial<ProcedureRecord>)`
  - Context `updatePrescription` (added in Task 2) - `updatePrescription(id, data: Partial<Prescription>)`
  - `src/types/emr.ts:17-23` - VitalSigns type for record form
  - `src/types/emr.ts:57-63` - Medication type for prescription form

  **WHY Each Reference Matters**:
  - Create dialogs in PatientChart: These are the EXACT form structures to replicate - same fields, same layout, same state management pattern. Only difference: pre-populate with existing data.
  - Detail pages: The 3 pages where edit buttons need to be added
  - Update functions: The context functions to call on form submit

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  # Record Edit
  1. Navigate to: http://localhost:5173/emr/records/MR-DEMO-001
  2. Assert: "수정" button is visible
  3. Click: "수정" button
  4. Assert: Edit dialog opens with pre-filled diagnosis "안검하수"
  5. Clear and fill: notes field with "수정된 메모"
  6. Click: save button
  7. Assert: Dialog closes and page shows "수정된 메모"
  8. Screenshot: .sisyphus/evidence/task-5-record-edit.png
  
  # Procedure Edit
  9. Navigate to: http://localhost:5173/emr/procedures/PR-DEMO-001
  10. Click: "수정" button
  11. Assert: Edit dialog with pre-filled procedure name "자연유착 쌍꺼풀 수술"
  12. Clear and fill: complications field with "경미한 부종"
  13. Click: save button
  14. Assert: Page shows "경미한 부종" in complications
  15. Screenshot: .sisyphus/evidence/task-5-procedure-edit.png
  
  # Prescription Edit  
  16. Navigate to: http://localhost:5173/emr/prescriptions/RX-DEMO-001
  17. Click: "수정" button
  18. Assert: Edit dialog with 3 pre-filled medications
  19. Clear and fill: notes field with "수정된 비고"
  20. Click: save button
  21. Assert: Page shows "수정된 비고"
  22. Screenshot: .sisyphus/evidence/task-5-prescription-edit.png
  ```

  **Commit**: YES
  - Message: `feat(emr): add edit functionality for records, procedures, and prescriptions`
  - Files: `src/pages/admin/emr/RecordDetail.tsx, src/pages/admin/emr/ProcedureDetail.tsx, src/pages/admin/emr/PrescriptionDetail.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 6. Toast 알림 + AlertDialog 확인 다이얼로그 전체 적용

  **What to do**:

  **Part A: Toast Notifications**
  - Import `toast` from `sonner` in ALL pages that perform CRUD operations
  - Add toast after every successful create/update/delete:
    - `PatientChart.tsx` - RecordsTab create: `toast.success('진료 기록이 등록되었습니다.')`
    - `PatientChart.tsx` - ProceduresTab create: `toast.success('시술 기록이 등록되었습니다.')`
    - `PatientChart.tsx` - PrescriptionsTab create: `toast.success('처방전이 등록되었습니다.')`
    - `PatientChart.tsx` - InfoTab edit (Task 4): `toast.success('환자 정보가 수정되었습니다.')`
    - `NewPatient.tsx` - create: `toast.success('환자가 등록되었습니다.')`
    - `RecordDetail.tsx` - edit: `toast.success('진료 기록이 수정되었습니다.')`, delete: `toast.success('진료 기록이 삭제되었습니다.')`
    - `ProcedureDetail.tsx` - edit: `toast.success(...)`, delete: `toast.success(...)`, status change: `toast.success('시술 상태가 변경되었습니다.')`
    - `PrescriptionDetail.tsx` - edit: `toast.success(...)`, delete: `toast.success(...)`

  **Part B: AlertDialog Confirmations**
  - Replace ALL `window.confirm()` calls with AlertDialog:
    - `RecordDetail.tsx:47-51` - `window.confirm('이 진료 기록을 삭제하시겠습니까?')` → AlertDialog
    - `ProcedureDetail.tsx:61-65` - `window.confirm('이 시술 기록을 삭제하시겠습니까?')` → AlertDialog
    - `PrescriptionDetail.tsx:46-50` - `window.confirm('이 처방전을 삭제하시겠습니까?')` → AlertDialog
  - AlertDialog pattern for each:
    - Trigger: Existing delete Button
    - Title: "삭제 확인"
    - Description: Entity-specific message (e.g., "이 진료 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    - Cancel button: "취소"
    - Confirm button: "삭제" (destructive variant)
    - On confirm: execute delete + toast + navigate

  **Must NOT do**:
  - Do NOT keep any `window.confirm()` calls
  - Do NOT add toast for read/navigation operations
  - Do NOT change error handling flow

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Touching many files, adding UI patterns consistently across the app
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Consistent toast messaging and dialog UX patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 5)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/RecordDetail.tsx:47-51` - `window.confirm` to replace with AlertDialog
  - `src/pages/admin/emr/ProcedureDetail.tsx:61-65` - Another `window.confirm` to replace
  - `src/pages/admin/emr/PrescriptionDetail.tsx:46-50` - Another `window.confirm` to replace
  - `src/pages/admin/emr/PatientChart.tsx:162-184` - Create handler where to add toast (RecordsTab)
  - `src/pages/admin/emr/PatientChart.tsx:368-386` - Create handler for ProceduresTab
  - `src/pages/admin/emr/PatientChart.tsx:549-563` - Create handler for PrescriptionsTab
  - `src/pages/admin/emr/NewPatient.tsx:32-53` - Patient create handler

  **API/Type References**:
  - `src/components/ui/alert-dialog.tsx` (created in Task 1) - AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
  - `sonner` package - `toast.success(message)`, `toast.error(message)` API

  **WHY Each Reference Matters**:
  - Each `window.confirm` location: EXACT lines to replace with AlertDialog
  - Create handlers: EXACT locations to add `toast.success()` calls after successful operations
  - AlertDialog component: Must import correctly from Task 1's output

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  # Toast on create
  1. Navigate to: http://localhost:5173/emr/patients/new
  2. Fill: required patient fields (name, birthDate, gender, phone)
  3. Click: submit button
  4. Assert: Toast notification appears with success message
  5. Screenshot: .sisyphus/evidence/task-6-toast-create.png
  
  # AlertDialog on delete
  6. Navigate to: http://localhost:5173/emr/records/MR-DEMO-003
  7. Click: "삭제" button
  8. Assert: AlertDialog appears (NOT browser confirm)
  9. Assert: AlertDialog contains "삭제 확인" title
  10. Assert: "취소" and "삭제" buttons visible
  11. Click: "취소" button
  12. Assert: Dialog closes, record still exists
  13. Screenshot: .sisyphus/evidence/task-6-alert-dialog.png
  
  # Verify no window.confirm remaining
  14. Run: grep -r "window.confirm" src/pages/ → Assert: 0 matches
  ```

  **Commit**: YES
  - Message: `feat(emr): add toast notifications and AlertDialog confirmations`
  - Files: `src/pages/admin/emr/PatientChart.tsx, src/pages/admin/emr/NewPatient.tsx, src/pages/admin/emr/RecordDetail.tsx, src/pages/admin/emr/ProcedureDetail.tsx, src/pages/admin/emr/PrescriptionDetail.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 7. 대시보드 네비게이션 개선

  **What to do**:
  - In `src/pages/emr/EMRDashboard.tsx`, change Link `to` props to point to detail pages instead of patient charts:
    - "예정된 시술" section (line 177-179): Change `to={/emr/patients/${proc.patientId}}` → `to={/emr/procedures/${proc.id}}`
    - "최근 진료 기록" section (line 269-270): Change `to={/emr/patients/${record.patientId}}` → `to={/emr/records/${record.id}}`
    - "최근 처방전" section (line 348-349): Change `to={/emr/patients/${rx.patientId}}` → `to={/emr/prescriptions/${rx.id}}`
    - "알레르기 유의 환자" section: Keep as-is (already links to patient chart, which is correct)
    - "최근 등록 환자" section: Keep as-is (links to patient chart, correct)
  - Add "전체 처방전 →" link at the bottom of the 처방전 section (like other sections have)
    - Link to `/emr/prescriptions`
  - Add "전체 시술 기록 →" link at the bottom of the 시술 section
    - Link to `/emr/procedures`

  **Must NOT do**:
  - Do NOT change "최근 등록 환자" or "알레르기 유의 환자" links (they correctly link to patient)
  - Do NOT redesign the dashboard layout
  - Do NOT add charts/graphs

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple link URL changes in a single file
  - **Skills**: []
    - No special skills needed - straightforward link changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 2, 3

  **References**:

  **Pattern References**:
  - `src/pages/emr/EMRDashboard.tsx:176-194` - Scheduled procedures links (change to procedure detail)
  - `src/pages/emr/EMRDashboard.tsx:267-283` - Recent records links (change to record detail)
  - `src/pages/emr/EMRDashboard.tsx:346-365` - Recent prescriptions links (change to prescription detail)
  - `src/pages/emr/EMRDashboard.tsx:286-292` - "전체 진료 기록 →" link pattern to replicate for procedures and prescriptions

  **WHY Each Reference Matters**:
  - Lines with incorrect `to` prop: These are the EXACT places to change navigation targets
  - "전체 진료 기록 →" pattern: Copy this exact Link pattern for the missing "전체" links

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  1. Navigate to: http://localhost:5173/emr
  2. Assert: Dashboard loads with all sections
  
  # Verify scheduled procedure links
  3. Click: first item in "예정된 시술" section
  4. Assert: URL contains /emr/procedures/ (NOT /emr/patients/)
  5. Navigate back to /emr
  
  # Verify record links
  6. Click: first item in "최근 진료 기록" section
  7. Assert: URL contains /emr/records/ (NOT /emr/patients/)
  8. Navigate back to /emr
  
  # Verify prescription links
  9. Click: first item in "최근 처방전" section
  10. Assert: URL contains /emr/prescriptions/ (NOT /emr/patients/)
  
  # Verify "전체" links exist
  11. Navigate to: /emr
  12. Assert: Link "전체 시술 기록 →" exists
  13. Assert: Link "전체 처방전 →" exists (or similar text)
  14. Screenshot: .sisyphus/evidence/task-7-dashboard-links.png
  ```

  **Commit**: YES
  - Message: `fix(emr): update dashboard links to navigate to detail pages`
  - Files: `src/pages/emr/EMRDashboard.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 8. 목록 페이지 페이지네이션

  **What to do**:
  - Create a reusable pagination component or inline pagination logic
  - Add client-side pagination (10 items per page) to ALL list pages:
    - `PatientList.tsx`
    - `RecordsList.tsx`
    - `ProceduresList.tsx`
    - `PrescriptionsList.tsx` (from Task 3)

  **Implementation approach**:
  - Add state: `const [currentPage, setCurrentPage] = useState(1)` and `const PAGE_SIZE = 10`
  - Compute: `const totalPages = Math.ceil(filtered.length / PAGE_SIZE)`
  - Slice: `const paginatedData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)`
  - Use paginatedData in table rendering instead of filtered
  - Reset currentPage to 1 when search/filter changes
  - Add pagination controls below table:
    - "이전" / "다음" buttons (disabled when at boundary)
    - Page number display: "N / M 페이지"
    - Total count display: "전체 X건"

  **Must NOT do**:
  - Do NOT create an overly complex pagination component with page number buttons
  - Keep it simple: prev/next with page indicator
  - Do NOT add page size selector (keep fixed at 10)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Modifying 4 list page files with consistent pagination pattern
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Clean pagination UI design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/PatientList.tsx:24-35` - Existing `filtered` memo that pagination wraps around
  - `src/pages/admin/emr/RecordsList.tsx:35-46` - Similar filter pattern
  - `src/pages/admin/emr/ProceduresList.tsx:45-55` - Similar filter pattern with status filter
  - `src/components/ui/button.tsx` - Button component for prev/next controls

  **WHY Each Reference Matters**:
  - Filter patterns: Pagination wraps AFTER filtering - need to understand the data flow
  - Button component: Use existing Button for pagination controls (maintain consistency)

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  # PatientList pagination (8 demo patients, should be 1 page)
  1. Navigate to: http://localhost:5173/emr/patients
  2. Assert: Pagination controls visible (even if just 1 page)
  3. Assert: "전체 8건" text visible
  
  # RecordsList pagination (7 demo records)
  4. Navigate to: /emr/records
  5. Assert: Pagination controls visible
  6. Assert: Table shows all records (less than 10, so 1 page)
  
  # Verify pagination works when there are many items (add patients first)
  # Note: With 8 patients and 7 records in demo data, we may need to create extra items to test pagination
  # Alternative: Verify the pagination logic by checking:
  7. Assert: "이전" button exists and is disabled on page 1
  8. Assert: Page indicator shows "1 / 1 페이지" (or similar)
  9. Screenshot: .sisyphus/evidence/task-8-pagination.png
  ```

  **Commit**: YES
  - Message: `feat(emr): add client-side pagination to all list pages`
  - Files: `src/pages/admin/emr/PatientList.tsx, src/pages/admin/emr/RecordsList.tsx, src/pages/admin/emr/ProceduresList.tsx, src/pages/admin/emr/PrescriptionsList.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 9. 테이블 컬럼 정렬 기능

  **What to do**:
  - Add clickable column headers to all list page tables
  - State: `const [sortColumn, setSortColumn] = useState<string>('date')` and `const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')`
  - Clicking a column header toggles sort: first click → asc, second click → desc, third click → asc again
  - Visual indicator: Arrow icon (▲/▼) on the active sort column using lucide `ArrowUp`, `ArrowDown`, or `ArrowUpDown` icons
  - Apply sorting BEFORE pagination (sort → filter → paginate)

  **Sortable columns per page**:
  - `PatientList`: 차트번호, 이름, 생년월일, 성별, 혈액형, 등록일
  - `RecordsList`: 진료일, 환자명, 담당의, 진단명, 진단코드
  - `ProceduresList`: 시술일, 환자명, 시술명, 담당의, 상태
  - `PrescriptionsList`: 처방일, 환자명, 담당의, 약물 수

  **Implementation**:
  - Make `TableHead` content clickable with cursor-pointer
  - Add sort icon next to header text
  - Sort comparison: string comparison for text fields, date comparison for date fields, number comparison for counts

  **Must NOT do**:
  - Do NOT make ALL columns sortable (e.g., skip 주소증 which is truncated text)
  - Do NOT add multi-column sort
  - Do NOT persist sort preference to localStorage

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Modifying 4 files with consistent sorting pattern
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Sort indicator visual design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/PatientList.tsx:85-95` - TableHeader/TableHead to make clickable
  - `src/pages/admin/emr/RecordsList.tsx:89-99` - Another table header to modify
  - `src/pages/admin/emr/ProceduresList.tsx:119-128` - Another table header
  - `src/components/ui/table.tsx` - Table component (check if TableHead accepts onClick)

  **External References**:
  - `lucide-react` icons: ArrowUpDown, ArrowUp, ArrowDown - for sort indicators

  **WHY Each Reference Matters**:
  - Table headers: These are the EXACT elements to make clickable
  - `table.tsx`: Need to verify TableHead supports click handlers (it does - it's a `<th>`)

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  1. Navigate to: http://localhost:5173/emr/patients
  2. Assert: Column headers show sort icons
  3. Click: "이름" column header
  4. Assert: Data sorted alphabetically (ascending)
  5. Assert: Sort indicator shows on "이름" column
  6. Click: "이름" column header again
  7. Assert: Data sorted reverse alphabetically (descending)
  8. Screenshot: .sisyphus/evidence/task-9-sorting.png
  
  9. Navigate to: /emr/records
  10. Click: "진료일" column header
  11. Assert: Records sorted by date
  12. Screenshot: .sisyphus/evidence/task-9-records-sorting.png
  ```

  **Commit**: YES
  - Message: `feat(emr): add column sorting to all list tables`
  - Files: `src/pages/admin/emr/PatientList.tsx, src/pages/admin/emr/RecordsList.tsx, src/pages/admin/emr/ProceduresList.tsx, src/pages/admin/emr/PrescriptionsList.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 10. 로딩 상태 표시

  **What to do**:
  - Add loading state indicators to pages that fetch data
  - Pattern: Show a spinner/skeleton while data is loading from localStorage
  - Even though localStorage is synchronous, adding loading states makes the app feel more professional and prepares for potential async data sources

  **Implementation**:
  - Add `const [isLoading, setIsLoading] = useState(true)` to detail pages
  - Set `setIsLoading(false)` after data is loaded in useEffect
  - While loading: show a centered spinner (lucide `Loader2` icon with `animate-spin`)
  - Apply to:
    - `PatientChart.tsx` - while loading patient data
    - `RecordDetail.tsx` - while loading record data
    - `ProcedureDetail.tsx` - while loading procedure data
    - `PrescriptionDetail.tsx` - while loading prescription data
    - `EMRDashboard.tsx` - while loading stats (brief flash)

  **Loading indicator design**:
  ```tsx
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  ```

  **Must NOT do**:
  - Do NOT use skeleton loaders (too complex for this scope)
  - Do NOT add artificial delay to make loading visible
  - Do NOT add loading to list pages (they already show empty states)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple pattern addition to 5 files
  - **Skills**: []
    - No special skills needed - simple state and conditional rendering

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (solo, after all other tasks)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 4, 5, 6 (these modify the same files)

  **References**:

  **Pattern References**:
  - `src/pages/admin/emr/PatientChart.tsx:725-728` - useEffect data loading where to add setIsLoading(false)
  - `src/pages/admin/emr/RecordDetail.tsx:28-33` - useEffect data loading
  - `src/pages/admin/emr/ProcedureDetail.tsx:40-42` - useEffect data loading
  - `src/pages/admin/emr/PrescriptionDetail.tsx:27-32` - useEffect data loading

  **External References**:
  - `lucide-react` - `Loader2` icon (spinner)

  **WHY Each Reference Matters**:
  - useEffect locations: These are the EXACT places to set `isLoading = false` after data loads
  - Current "not found" states: Loading state should appear BEFORE the not-found check

  **Acceptance Criteria**:

  **Automated Verification (Playwright)**:
  ```
  1. Navigate to: http://localhost:5173/emr/patients/PT-DEMO-001
  2. Assert: Page eventually shows patient data (loading was brief or instant)
  3. Assert: Loader2 spinner class exists in component source (code review via grep)
  
  # Verify via code inspection
  4. Run: grep -c "isLoading" src/pages/admin/emr/PatientChart.tsx → Assert: >= 2
  5. Run: grep -c "isLoading" src/pages/admin/emr/RecordDetail.tsx → Assert: >= 2
  6. Run: grep -c "Loader2" src/pages/admin/emr/PatientChart.tsx → Assert: >= 1
  7. Run: npx tsc --noEmit → Assert: Exit code 0
  ```

  **Commit**: YES
  - Message: `feat(emr): add loading state indicators to detail pages`
  - Files: `src/pages/admin/emr/PatientChart.tsx, src/pages/admin/emr/RecordDetail.tsx, src/pages/admin/emr/ProcedureDetail.tsx, src/pages/admin/emr/PrescriptionDetail.tsx, src/pages/emr/EMRDashboard.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(ui): add sonner toast and AlertDialog infrastructure` | package.json, ui/sonner.tsx, ui/alert-dialog.tsx, App.tsx | `npx tsc --noEmit` |
| 2 | `feat(emr): add updatePrescription, deletePatient, and getAll* operations` | emrStorage.ts, EMRContext.tsx | `npx tsc --noEmit` |
| 3 | `feat(emr): add prescriptions list page with search and sidebar nav` | PrescriptionsList.tsx, App.tsx, EMRLayout.tsx | `npx tsc --noEmit` |
| 4 | `feat(emr): add patient info edit functionality` | PatientChart.tsx | `npx tsc --noEmit` |
| 5 | `feat(emr): add edit functionality for records, procedures, and prescriptions` | RecordDetail.tsx, ProcedureDetail.tsx, PrescriptionDetail.tsx | `npx tsc --noEmit` |
| 6 | `feat(emr): add toast notifications and AlertDialog confirmations` | PatientChart.tsx, NewPatient.tsx, RecordDetail.tsx, ProcedureDetail.tsx, PrescriptionDetail.tsx | `npx tsc --noEmit` |
| 7 | `fix(emr): update dashboard links to navigate to detail pages` | EMRDashboard.tsx | `npx tsc --noEmit` |
| 8 | `feat(emr): add client-side pagination to all list pages` | PatientList.tsx, RecordsList.tsx, ProceduresList.tsx, PrescriptionsList.tsx | `npx tsc --noEmit` |
| 9 | `feat(emr): add column sorting to all list tables` | PatientList.tsx, RecordsList.tsx, ProceduresList.tsx, PrescriptionsList.tsx | `npx tsc --noEmit` |
| 10 | `feat(emr): add loading state indicators to detail pages` | PatientChart.tsx, RecordDetail.tsx, ProcedureDetail.tsx, PrescriptionDetail.tsx, EMRDashboard.tsx | `npx tsc --noEmit` |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit    # Expected: no errors
npm run build       # Expected: successful build
grep -r "window.confirm" src/pages/  # Expected: 0 matches
```

### Final Checklist
- [ ] All 4 entity types (Patient, Record, Procedure, Prescription) can be edited
- [ ] Prescriptions list page exists at /emr/prescriptions
- [ ] Sidebar has 처방전 link
- [ ] Toast notifications on all CRUD operations
- [ ] AlertDialog for all destructive actions (no window.confirm)
- [ ] Dashboard links go to detail pages
- [ ] All list pages have pagination
- [ ] All list tables have sortable columns
- [ ] Detail pages show loading states
- [ ] All Korean language labels
- [ ] No TypeScript errors
- [ ] Successful build
