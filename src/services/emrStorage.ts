import type {
  Patient,
  MedicalRecord,
  ProcedureRecord,
  Prescription,
  ProcedureStatus,
} from '@/types/emr'

const PATIENTS_KEY = 'plastic-hospital-patients'
const RECORDS_KEY = 'plastic-hospital-records'
const PROCEDURES_KEY = 'plastic-hospital-procedures'
const PRESCRIPTIONS_KEY = 'plastic-hospital-prescriptions'

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

function load<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  return JSON.parse(raw) as T[]
}

function persist<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export const emrStorage = {
  // ── Patients ──
  getPatients(): Patient[] {
    return load<Patient>(PATIENTS_KEY).sort(
      (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    )
  },
  getPatientById(id: string): Patient | undefined {
    return load<Patient>(PATIENTS_KEY).find((p) => p.id === id)
  },
  createPatient(data: Omit<Patient, 'id' | 'chartNumber' | 'registeredAt'>): Patient {
    const all = load<Patient>(PATIENTS_KEY)
    const chartNum = `C${String(all.length + 1).padStart(5, '0')}`
    const patient: Patient = {
      ...data,
      id: genId('PT'),
      chartNumber: chartNum,
      registeredAt: new Date().toISOString(),
    }
    all.push(patient)
    persist(PATIENTS_KEY, all)
    return patient
  },
  updatePatient(id: string, data: Partial<Patient>): Patient | undefined {
    const all = load<Patient>(PATIENTS_KEY)
    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    all[idx] = { ...all[idx], ...data, id: all[idx].id, chartNumber: all[idx].chartNumber }
    persist(PATIENTS_KEY, all)
    return all[idx]
  },
  deletePatient(id: string): boolean {
    const patients = load<Patient>(PATIENTS_KEY)
    const filtered = patients.filter((p) => p.id !== id)
    if (filtered.length === patients.length) return false
    persist(PATIENTS_KEY, filtered)
    // Cascade delete related records
    const records = load<MedicalRecord>(RECORDS_KEY).filter((r) => r.patientId !== id)
    persist(RECORDS_KEY, records)
    const procedures = load<ProcedureRecord>(PROCEDURES_KEY).filter((p) => p.patientId !== id)
    persist(PROCEDURES_KEY, procedures)
    const prescriptions = load<Prescription>(PRESCRIPTIONS_KEY).filter((p) => p.patientId !== id)
    persist(PRESCRIPTIONS_KEY, prescriptions)
    return true
  },

  // ── Medical Records ──
  getAllRecords(): MedicalRecord[] {
    return load<MedicalRecord>(RECORDS_KEY).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  },
  getRecordsByPatient(patientId: string): MedicalRecord[] {
    return load<MedicalRecord>(RECORDS_KEY)
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  getRecordById(id: string): MedicalRecord | undefined {
    return load<MedicalRecord>(RECORDS_KEY).find((r) => r.id === id)
  },
  createRecord(data: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord {
    const all = load<MedicalRecord>(RECORDS_KEY)
    const record: MedicalRecord = { ...data, id: genId('MR'), createdAt: new Date().toISOString() }
    all.push(record)
    persist(RECORDS_KEY, all)
    return record
  },
  updateRecord(id: string, data: Partial<MedicalRecord>): MedicalRecord | undefined {
    const all = load<MedicalRecord>(RECORDS_KEY)
    const idx = all.findIndex((r) => r.id === id)
    if (idx === -1) return undefined
    all[idx] = { ...all[idx], ...data, id: all[idx].id, patientId: all[idx].patientId }
    persist(RECORDS_KEY, all)
    return all[idx]
  },
  deleteRecord(id: string): boolean {
    const all = load<MedicalRecord>(RECORDS_KEY)
    const filtered = all.filter((r) => r.id !== id)
    if (filtered.length === all.length) return false
    persist(RECORDS_KEY, filtered)
    return true
  },

  // ── Procedures ──
  getAllProcedures(): ProcedureRecord[] {
    return load<ProcedureRecord>(PROCEDURES_KEY).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  },
  getProceduresByPatient(patientId: string): ProcedureRecord[] {
    return load<ProcedureRecord>(PROCEDURES_KEY)
      .filter((p) => p.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  getProcedureById(id: string): ProcedureRecord | undefined {
    return load<ProcedureRecord>(PROCEDURES_KEY).find((p) => p.id === id)
  },
  createProcedure(data: Omit<ProcedureRecord, 'id' | 'createdAt'>): ProcedureRecord {
    const all = load<ProcedureRecord>(PROCEDURES_KEY)
    const proc: ProcedureRecord = { ...data, id: genId('PR'), createdAt: new Date().toISOString() }
    all.push(proc)
    persist(PROCEDURES_KEY, all)
    return proc
  },
  updateProcedure(id: string, data: Partial<ProcedureRecord>): ProcedureRecord | undefined {
    const all = load<ProcedureRecord>(PROCEDURES_KEY)
    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    all[idx] = { ...all[idx], ...data, id: all[idx].id, patientId: all[idx].patientId }
    persist(PROCEDURES_KEY, all)
    return all[idx]
  },
  updateProcedureStatus(id: string, status: ProcedureStatus): ProcedureRecord | undefined {
    const all = load<ProcedureRecord>(PROCEDURES_KEY)
    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    all[idx].status = status
    persist(PROCEDURES_KEY, all)
    return all[idx]
  },
  deleteProcedure(id: string): boolean {
    const all = load<ProcedureRecord>(PROCEDURES_KEY)
    const filtered = all.filter((p) => p.id !== id)
    if (filtered.length === all.length) return false
    persist(PROCEDURES_KEY, filtered)
    return true
  },

  // ── Prescriptions ──
  getAllPrescriptions(): Prescription[] {
    return load<Prescription>(PRESCRIPTIONS_KEY).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  },
  getPrescriptionsByPatient(patientId: string): Prescription[] {
    return load<Prescription>(PRESCRIPTIONS_KEY)
      .filter((p) => p.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  getPrescriptionById(id: string): Prescription | undefined {
    return load<Prescription>(PRESCRIPTIONS_KEY).find((p) => p.id === id)
  },
  createPrescription(data: Omit<Prescription, 'id' | 'createdAt'>): Prescription {
    const all = load<Prescription>(PRESCRIPTIONS_KEY)
    const rx: Prescription = { ...data, id: genId('RX'), createdAt: new Date().toISOString() }
    all.push(rx)
    persist(PRESCRIPTIONS_KEY, all)
    return rx
  },
  updatePrescription(id: string, data: Partial<Prescription>): Prescription | undefined {
    const all = load<Prescription>(PRESCRIPTIONS_KEY)
    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    all[idx] = { ...all[idx], ...data, id: all[idx].id, patientId: all[idx].patientId, medicalRecordId: all[idx].medicalRecordId }
    persist(PRESCRIPTIONS_KEY, all)
    return all[idx]
  },
  deletePrescription(id: string): boolean {
    const all = load<Prescription>(PRESCRIPTIONS_KEY)
    const filtered = all.filter((p) => p.id !== id)
    if (filtered.length === all.length) return false
    persist(PRESCRIPTIONS_KEY, filtered)
    return true
  },

  // ── Stats ──
  getStats() {
    const patients = load<Patient>(PATIENTS_KEY)
    const records = load<MedicalRecord>(RECORDS_KEY)
    const procedures = load<ProcedureRecord>(PROCEDURES_KEY)
    return {
      totalPatients: patients.length,
      totalRecords: records.length,
      totalProcedures: procedures.length,
      scheduledProcedures: procedures.filter((p) => p.status === 'scheduled').length,
    }
  },

  // ── Seed Demo Data ──
  seedDemoData(): void {
    if (load<Patient>(PATIENTS_KEY).length > 0) return

    const patients: Patient[] = [
      {
        id: 'PT-DEMO-001', chartNumber: 'C00001', name: '김미영',
        birthDate: '1990-03-15', gender: 'female', phone: '010-1234-5678',
        address: '서울시 강남구 역삼동 123-45', bloodType: 'A+',
        allergies: ['페니실린'], medicalHistory: '특이사항 없음',
        registeredAt: '2025-06-10T09:00:00.000Z',
      },
      {
        id: 'PT-DEMO-002', chartNumber: 'C00002', name: '박지수',
        birthDate: '1988-07-22', gender: 'female', phone: '010-9876-5432',
        address: '서울시 서초구 서초동 456-78', bloodType: 'B+',
        allergies: [], medicalHistory: '고혈압 가족력',
        registeredAt: '2025-08-15T10:00:00.000Z',
      },
      {
        id: 'PT-DEMO-003', chartNumber: 'C00003', name: '이수진',
        birthDate: '1995-11-08', gender: 'female', phone: '010-5555-1234',
        address: '서울시 송파구 잠실동 789-10', bloodType: 'O+',
        allergies: ['아스피린', '라텍스'], medicalHistory: '아토피 피부염',
        registeredAt: '2025-09-20T11:00:00.000Z',
      },
      {
        id: 'PT-DEMO-004', chartNumber: 'C00004', name: '최현우',
        birthDate: '1985-01-30', gender: 'male', phone: '010-3333-7777',
        address: '서울시 강남구 논현동 234-56', bloodType: 'AB+',
        allergies: [], medicalHistory: '당뇨 전단계',
        registeredAt: '2025-10-05T14:00:00.000Z',
      },
      {
        id: 'PT-DEMO-005', chartNumber: 'C00005', name: '정예린',
        birthDate: '1992-05-18', gender: 'female', phone: '010-8888-2222',
        address: '서울시 마포구 합정동 567-89', bloodType: 'A-',
        allergies: ['세팔로스포린'], medicalHistory: '갑상선 기능저하증(레보티록신 복용 중)',
        registeredAt: '2025-11-12T09:30:00.000Z',
      },
      {
        id: 'PT-DEMO-006', chartNumber: 'C00006', name: '한소희',
        birthDate: '1997-09-25', gender: 'female', phone: '010-7777-3333',
        address: '서울시 용산구 이태원동 890-12', bloodType: 'B-',
        allergies: [], medicalHistory: '특이사항 없음',
        registeredAt: '2025-12-01T10:00:00.000Z',
      },
      {
        id: 'PT-DEMO-007', chartNumber: 'C00007', name: '오민서',
        birthDate: '1993-12-03', gender: 'female', phone: '010-4444-6666',
        address: '서울시 강동구 천호동 345-67', bloodType: 'O-',
        allergies: [], medicalHistory: '특이사항 없음',
        registeredAt: '2026-01-08T15:00:00.000Z',
      },
      {
        id: 'PT-DEMO-008', chartNumber: 'C00008', name: '강도윤',
        birthDate: '1991-04-12', gender: 'male', phone: '010-2222-8888',
        address: '서울시 종로구 종로동 678-90', bloodType: 'A+',
        allergies: ['리도카인'], medicalHistory: '비중격만곡증 기왕력',
        registeredAt: '2026-01-20T09:00:00.000Z',
      },
    ]
    const pN = ['김소연','박하나','이지현','최서윤','정다은','한예진','오수빈','강유진','윤채원','임서진','송민지','배지영','조은서','신하영','장수정','문예은','양서현','권다인','류하은','남지우','홍수아','전예나','고은별','서하늘','안지민','유다현','노서윤','황예림','방지혜','차서연']
    const pP = ['010-1111-2222','010-2222-3333','010-3333-4444','010-4444-5555','010-5555-6666','010-6666-7777','010-7777-8888','010-8888-9999','010-1234-1111','010-2345-2222','010-3456-3333','010-4567-4444','010-5678-5555','010-6789-6666','010-7890-7777','010-8901-8888','010-9012-9999','010-1122-3344','010-2233-4455','010-3344-5566','010-4455-6677','010-5566-7788','010-6677-8899','010-7788-9900','010-8899-0011','010-9900-1122','010-1010-2020','010-2020-3030','010-3030-4040','010-4040-5050']
    const pBt = ['A+','B+','O+','AB+','A-','B-','O-','AB-']
    const pAl = ['페니실린','아스피린','라텍스','세팔로스포린','리도카인','설파제','NSAIDs','요오드']
    const pMh = ['특이사항 없음','고혈압 가족력','당뇨 전단계','갑상선 기능저하증','아토피 피부염','비중격만곡증 기왕력','빈혈','천식','편두통','위장장애']
    const pAd = ['서울시 강남구 테헤란로 45','서울시 서초구 서초대로 120','서울시 송파구 올림픽로 300','서울시 마포구 월드컵로 55','서울시 용산구 이태원로 200','서울시 강동구 천호대로 150','서울시 영등포구 여의대방로 100','서울시 성북구 보문로 80','서울시 관악구 관악로 60','서울시 중구 을지로 30']
    const xPatients: Patient[] = pN.map((name, i) => ({
      id: `PT-DEMO-${String(i + 9).padStart(3, '0')}`,
      chartNumber: `C${String(i + 9).padStart(5, '0')}`,
      name, birthDate: `${1985 + (i % 16)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + ((i * 3) % 28)).padStart(2, '0')}`,
      gender: 'female' as const, phone: pP[i],
      address: pAd[i % pAd.length], bloodType: pBt[i % pBt.length],
      allergies: i % 3 === 0 ? [pAl[i % pAl.length]] : [],
      medicalHistory: pMh[i % pMh.length],
      registeredAt: new Date(2025, 9 + Math.floor(i / 8), 1 + (i % 28)).toISOString(),
    }))
    persist(PATIENTS_KEY, [...patients, ...xPatients])

    const records: MedicalRecord[] = [
      {
        id: 'MR-DEMO-001', patientId: 'PT-DEMO-001', date: '2025-12-10',
        doctorName: '김뷰티', chiefComplaint: '쌍꺼풀 수술 상담',
        diagnosis: '안검하수', diagnosisCode: 'H02.3',
        vitalSigns: { bloodPressure: '118/76', pulse: 72, temperature: 36.5, weight: 52, height: 163 },
        treatmentPlan: '자연유착 쌍꺼풀 수술 권고. 수술 전 혈액검사 시행.',
        notes: '양측 안검하수 소견. 자연유착법으로 자연스러운 쌍꺼풀 라인 형성 계획. 환자 동의 완료.',
        createdAt: '2025-12-10T10:30:00.000Z',
      },
      {
        id: 'MR-DEMO-002', patientId: 'PT-DEMO-001', date: '2026-01-15',
        doctorName: '김뷰티', chiefComplaint: '쌍꺼풀 수술 후 경과 확인',
        diagnosis: '안검하수 수술 후 경과관찰', diagnosisCode: 'H02.3',
        vitalSigns: { bloodPressure: '120/78', pulse: 68, temperature: 36.4, weight: 52, height: 163 },
        treatmentPlan: '수술 부위 회복 양호. 2주 후 재방문.',
        notes: '수술 후 4주차. 부종 거의 소실. 쌍꺼풀 라인 자연스러움. 환자 만족도 높음.',
        createdAt: '2026-01-15T11:00:00.000Z',
      },
      {
        id: 'MR-DEMO-003', patientId: 'PT-DEMO-002', date: '2026-01-05',
        doctorName: '김뷰티', chiefComplaint: '콧대가 낮아서 높이고 싶음',
        diagnosis: '코의 후천성 변형', diagnosisCode: 'M95.0',
        vitalSigns: { bloodPressure: '122/80', pulse: 76, temperature: 36.6, weight: 55, height: 168 },
        treatmentPlan: '실리콘 보형물 + 자가 비중격 연골 이용 코끝 성형 계획',
        notes: '낮은 콧대 및 뭉툭한 코끝 소견. 실리콘 보형물로 콧대 높이고 자가연골로 코끝 다듬기 계획. CT 촬영 완료.',
        createdAt: '2026-01-05T14:00:00.000Z',
      },
      {
        id: 'MR-DEMO-004', patientId: 'PT-DEMO-003', date: '2026-01-20',
        doctorName: '김뷰티', chiefComplaint: '실리프팅 상담',
        diagnosis: '피부의 노인성 변화', diagnosisCode: 'L57.4',
        vitalSigns: { bloodPressure: '110/70', pulse: 68, temperature: 36.3, weight: 48, height: 160 },
        treatmentPlan: 'MINT 리프팅 실 60개 시술 계획',
        notes: '양측 볼처짐 및 팔자주름 소견. MINT 리프팅 실로 탄력 개선 계획.',
        createdAt: '2026-01-20T10:00:00.000Z',
      },
      {
        id: 'MR-DEMO-005', patientId: 'PT-DEMO-004', date: '2025-12-20',
        doctorName: '이아름', chiefComplaint: '이마 주름 보톡스 시술 희망',
        diagnosis: '미용목적의 성형수술', diagnosisCode: 'Z41.1',
        vitalSigns: { bloodPressure: '130/85', pulse: 78, temperature: 36.7, weight: 75, height: 178 },
        treatmentPlan: '보톡스 이마 30유닛, 미간 20유닛',
        notes: '이마 및 미간 표정 주름 소견. 보톡스 시술로 주름 개선 계획. 혈압 다소 높아 모니터링 필요.',
        createdAt: '2025-12-20T15:00:00.000Z',
      },
      {
        id: 'MR-DEMO-006', patientId: 'PT-DEMO-005', date: '2026-02-01',
        doctorName: '김뷰티', chiefComplaint: '광대뼈 축소 수술 상담',
        diagnosis: '두부의 기타 후천성 변형', diagnosisCode: 'M95.2',
        vitalSigns: { bloodPressure: '115/72', pulse: 70, temperature: 36.5, weight: 50, height: 165 },
        treatmentPlan: '광대뼈 축소술 시행 예정. 전신마취 하 구강 내 절개 접근.',
        notes: '양측 광대뼈 돌출 소견. 3D CT 분석 완료. 광대뼈 아치 절골술로 축소 계획. 갑상선약 복용 유지.',
        createdAt: '2026-02-01T10:30:00.000Z',
      },
      {
        id: 'MR-DEMO-007', patientId: 'PT-DEMO-008', date: '2026-02-03',
        doctorName: '김뷰티', chiefComplaint: '매부리코 교정 상담',
        diagnosis: '코의 후천성 변형', diagnosisCode: 'M95.0',
        vitalSigns: { bloodPressure: '125/80', pulse: 74, temperature: 36.6, weight: 72, height: 175 },
        treatmentPlan: '매부리코 교정 + 코끝 성형. 비중격만곡 동시 교정 고려.',
        notes: '매부리코 소견 및 경미한 비중격만곡 확인. 매부리 제거 후 코끝 다듬기 계획. 리도카인 알레르기로 마취제 변경 필요.',
        createdAt: '2026-02-03T09:30:00.000Z',
      },
    ]
    const rDr = ['김뷰티','이아름','박성형','최미소']
    const rPr = ['눈성형','코성형','안면윤곽','리프팅','가슴성형','지방흡입','피부시술','쁘띠성형']
    const rCc: Record<string, string[]> = {
      '눈성형': ['쌍꺼풀 수술 상담','눈매교정 희망','눈밑 지방 제거 상담','눈 재수술 상담'],
      '코성형': ['콧대를 높이고 싶음','매부리코 교정 상담','코끝 성형 상담','코 재수술 상담'],
      '안면윤곽': ['광대뼈 축소 상담','사각턱 교정 상담','V라인 턱 성형 상담','이마 성형 상담'],
      '리프팅': ['실리프팅 상담','안면 처짐 개선 희망','볼처짐 리프팅 상담','이중턱 리프팅 상담'],
      '가슴성형': ['가슴 확대 상담','가슴 축소 상담','가슴 보형물 교체 상담','가슴 재건 상담'],
      '지방흡입': ['복부 지방흡입 상담','허벅지 지방흡입 상담','팔뚝 지방흡입 상담','턱밑 지방흡입 상담'],
      '피부시술': ['여드름 흉터 치료 상담','기미 제거 상담','모공 축소 상담','레이저 토닝 상담'],
      '쁘띠성형': ['보톡스 시술 희망','필러 시술 상담','물광주사 상담','입술 필러 상담'],
    }
    const rDg: Record<string, [string, string]> = {
      '눈성형': ['안검하수', 'H02.3'], '코성형': ['코의 후천성 변형', 'M95.0'],
      '안면윤곽': ['두부의 기타 후천성 변형', 'M95.2'], '리프팅': ['피부의 노인성 변화', 'L57.4'],
      '가슴성형': ['미용목적의 성형수술', 'Z41.1'], '지방흡입': ['미용목적의 성형수술', 'Z41.1'],
      '피부시술': ['피부의 기타 변화', 'L98.8'], '쁘띠성형': ['미용목적의 성형수술', 'Z41.1'],
    }
    const rTp: Record<string, string> = {
      '눈성형': '자연유착 쌍꺼풀 수술 권고', '코성형': '실리콘 보형물 + 자가연골 코끝 성형 계획',
      '안면윤곽': '광대뼈 축소술 시행 예정', '리프팅': 'MINT 리프팅 실 60개 시술 계획',
      '가슴성형': '가슴 보형물 삽입술 계획', '지방흡입': '복부 지방흡입 시술 계획',
      '피부시술': '레이저 토닝 5회 시술 계획', '쁘띠성형': '보톡스 50유닛 시술 계획',
    }
    const xRecords: MedicalRecord[] = pN.map((_, i) => {
      const proc = rPr[i % rPr.length]
      const complaints = rCc[proc]
      const [dg, dc] = rDg[proc]
      return {
        id: `MR-DEMO-${String(i + 8).padStart(3, '0')}`,
        patientId: `PT-DEMO-${String(i + 9).padStart(3, '0')}`,
        date: new Date(2025, 10 + Math.floor(i / 10), 5 + (i % 25)).toISOString().split('T')[0],
        doctorName: rDr[i % rDr.length],
        chiefComplaint: complaints[i % complaints.length],
        diagnosis: dg, diagnosisCode: dc,
        vitalSigns: { bloodPressure: `${110 + (i % 25)}/${70 + (i % 18)}`, pulse: 64 + (i % 24), temperature: +(36.2 + (i % 7) * 0.1).toFixed(1), weight: 48 + (i % 35), height: 155 + (i % 27) },
        treatmentPlan: rTp[proc],
        notes: `${complaints[i % complaints.length]} 소견. 검사 완료. 시술 일정 조율 예정.`,
        createdAt: new Date(2025, 10 + Math.floor(i / 10), 5 + (i % 25), 10, 0).toISOString(),
      }
    })
    persist(RECORDS_KEY, [...records, ...xRecords])

    const procedures: ProcedureRecord[] = [
      {
        id: 'PR-DEMO-001', patientId: 'PT-DEMO-001', medicalRecordId: 'MR-DEMO-001',
        date: '2025-12-17', procedureName: '자연유착 쌍꺼풀 수술',
        doctor: '김뷰티', anesthesiaType: '수면마취', duration: '40분',
        details: '양측 자연유착법 시행. 절개선 6mm. 지방제거 소량 시행.',
        complications: '없음', postOpInstructions: '냉찜질 3일, 실밥 제거 5일 후, 1주간 눈화장 금지',
        status: 'completed', createdAt: '2025-12-17T10:00:00.000Z',
      },
      {
        id: 'PR-DEMO-002', patientId: 'PT-DEMO-004', medicalRecordId: 'MR-DEMO-005',
        date: '2025-12-20', procedureName: '보톡스 시술 (이마+미간)',
        doctor: '이아름', anesthesiaType: '해당없음', duration: '15분',
        details: '이마 30유닛, 미간 20유닛 주사. 총 50유닛.',
        complications: '없음', postOpInstructions: '4시간 동안 눕지 말 것, 시술 부위 문지르지 말 것',
        status: 'completed', createdAt: '2025-12-20T15:30:00.000Z',
      },
      {
        id: 'PR-DEMO-003', patientId: 'PT-DEMO-002', medicalRecordId: 'MR-DEMO-003',
        date: '2026-02-15', procedureName: '코성형 (실리콘+자가연골)',
        doctor: '김뷰티', anesthesiaType: '전신마취', duration: '90분',
        details: '실리콘 보형물 삽입 및 비중격 연골 채취 후 코끝 성형 예정',
        complications: '', postOpInstructions: '부목 7일 착용, 2주간 안경 금지, 코풀기 금지',
        status: 'scheduled', createdAt: '2026-01-05T14:30:00.000Z',
      },
      {
        id: 'PR-DEMO-004', patientId: 'PT-DEMO-003', medicalRecordId: 'MR-DEMO-004',
        date: '2026-02-10', procedureName: 'MINT 실리프팅',
        doctor: '김뷰티', anesthesiaType: '국소마취', duration: '45분',
        details: 'MINT 리프팅 실 60개 (양측 30개씩) 삽입 예정',
        complications: '', postOpInstructions: '3일간 큰 입벌림 자제, 1주간 사우나 금지',
        status: 'scheduled', createdAt: '2026-01-20T10:30:00.000Z',
      },
      {
        id: 'PR-DEMO-005', patientId: 'PT-DEMO-005', medicalRecordId: 'MR-DEMO-006',
        date: '2026-02-20', procedureName: '광대뼈 축소술',
        doctor: '김뷰티', anesthesiaType: '전신마취', duration: '120분',
        details: '구강 내 절개 접근. 양측 광대뼈 아치 절골술 예정.',
        complications: '', postOpInstructions: '압박 붕대 2주, 유동식 1주, 1개월간 딱딱한 음식 금지',
        status: 'scheduled', createdAt: '2026-02-01T11:00:00.000Z',
      },
    ]
    const prNm: Record<string, string[]> = {
      '눈성형': ['자연유착 쌍꺼풀 수술','눈매교정술','하안검 성형술','눈밑 지방재배치'],
      '코성형': ['코성형 (실리콘+자가연골)','매부리코 교정술','코끝 성형술','비중격 교정술'],
      '안면윤곽': ['광대뼈 축소술','사각턱 축소술','V라인 턱끝 성형','이마 보형물 삽입'],
      '리프팅': ['MINT 실리프팅','울쎄라 리프팅','HIFU 리프팅','안면거상술'],
      '가슴성형': ['가슴 보형물 삽입술','지방이식 가슴확대','가슴 축소술','보형물 교체술'],
      '지방흡입': ['복부 지방흡입','허벅지 지방흡입','팔뚝 지방흡입','턱밑 지방흡입'],
      '피부시술': ['프락셀 레이저','CO2 레이저','IPL 시술','레이저 토닝'],
      '쁘띠성형': ['보톡스 시술 (이마+미간)','히알루론산 필러','물광주사','스킨보톡스'],
    }
    const prAn: Record<string, string> = {
      '눈성형':'수면마취','코성형':'전신마취','안면윤곽':'전신마취','리프팅':'국소마취',
      '가슴성형':'전신마취','지방흡입':'수면마취','피부시술':'해당없음','쁘띠성형':'해당없음',
    }
    const prDu: Record<string, string> = {
      '눈성형':'40분','코성형':'90분','안면윤곽':'120분','리프팅':'45분',
      '가슴성형':'100분','지방흡입':'60분','피부시술':'20분','쁘띠성형':'15분',
    }
    const prSt: ProcedureStatus[] = ['completed','scheduled','scheduled','completed','scheduled','completed','scheduled','scheduled','completed','cancelled']
    const xProcs: ProcedureRecord[] = Array.from({ length: 20 }, (_, i) => {
      const proc = rPr[i % rPr.length]
      const names = prNm[proc]
      return {
        id: `PR-DEMO-${String(i + 6).padStart(3, '0')}`,
        patientId: `PT-DEMO-${String(i + 9).padStart(3, '0')}`,
        medicalRecordId: `MR-DEMO-${String(i + 8).padStart(3, '0')}`,
        date: new Date(2025, 10 + Math.floor(i / 8), 12 + (i % 20)).toISOString().split('T')[0],
        procedureName: names[i % names.length],
        doctor: rDr[i % rDr.length], anesthesiaType: prAn[proc], duration: prDu[proc],
        details: `${names[i % names.length]} 시행. 정상 경과.`,
        complications: i % 5 === 0 ? '경미한 부종' : '없음',
        postOpInstructions: proc === '쁘띠성형' ? '4시간 동안 눕지 말 것' : proc === '피부시술' ? '자외선 차단제 필수' : '처방약 복용, 격한 운동 2주 자제',
        status: prSt[i % prSt.length],
        createdAt: new Date(2025, 10 + Math.floor(i / 8), 12 + (i % 20), 10, 0).toISOString(),
      }
    })
    persist(PROCEDURES_KEY, [...procedures, ...xProcs])

    const prescriptions: Prescription[] = [
      {
        id: 'RX-DEMO-001', patientId: 'PT-DEMO-001', medicalRecordId: 'MR-DEMO-001',
        date: '2025-12-17', doctorName: '김뷰티',
        medications: [
          { name: '세프라딘 500mg', dosage: '500mg', frequency: '1일 3회', duration: '5일', instructions: '식후 30분 복용' },
          { name: '이부프로펜 400mg', dosage: '400mg', frequency: '1일 3회', duration: '3일', instructions: '식후 복용, 통증 시' },
          { name: '레바미피드 100mg', dosage: '100mg', frequency: '1일 3회', duration: '5일', instructions: '위장보호제, 식전 복용' },
        ],
        notes: '페니실린 알레르기 확인 → 세팔로스포린계 처방. 통증 심할 시 이부프로펜 추가 복용 가능.',
        createdAt: '2025-12-17T10:45:00.000Z',
      },
      {
        id: 'RX-DEMO-002', patientId: 'PT-DEMO-004', medicalRecordId: 'MR-DEMO-005',
        date: '2025-12-20', doctorName: '이아름',
        medications: [
          { name: '아르니카 연고', dosage: '적당량', frequency: '1일 2회', duration: '5일', instructions: '멍 부위 도포' },
        ],
        notes: '보톡스 시술 후 처방. 멍 발생 시 도포.',
        createdAt: '2025-12-20T16:00:00.000Z',
      },
      {
        id: 'RX-DEMO-003', patientId: 'PT-DEMO-001', medicalRecordId: 'MR-DEMO-002',
        date: '2026-01-15', doctorName: '김뷰티',
        medications: [
          { name: '비타민C 1000mg', dosage: '1000mg', frequency: '1일 1회', duration: '30일', instructions: '아침 식후 복용' },
          { name: '히루도이드 겔', dosage: '적당량', frequency: '1일 2회', duration: '14일', instructions: '흉터 부위 도포' },
        ],
        notes: '수술 후 회복 촉진 및 흉터 관리 목적.',
        createdAt: '2026-01-15T11:30:00.000Z',
      },
    ]
    const rxMeds: Array<Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>> = [
      [{ name: '세프라딘 500mg', dosage: '500mg', frequency: '1일 3회', duration: '5일', instructions: '식후 30분 복용' }, { name: '이부프로펜 400mg', dosage: '400mg', frequency: '1일 3회', duration: '3일', instructions: '통증 시 식후 복용' }, { name: '레바미피드 100mg', dosage: '100mg', frequency: '1일 3회', duration: '5일', instructions: '위장보호제, 식전 복용' }],
      [{ name: '아목시실린 500mg', dosage: '500mg', frequency: '1일 3회', duration: '7일', instructions: '식후 30분 복용' }, { name: '아세트아미노펜 500mg', dosage: '500mg', frequency: '1일 3회', duration: '5일', instructions: '통증 시 복용' }],
      [{ name: '클라리스로마이신 250mg', dosage: '250mg', frequency: '1일 2회', duration: '7일', instructions: '식후 복용' }, { name: '판토프라졸 40mg', dosage: '40mg', frequency: '1일 1회', duration: '14일', instructions: '아침 식전 복용' }, { name: '아르니카 연고', dosage: '적당량', frequency: '1일 2회', duration: '7일', instructions: '멍 부위 도포' }],
      [{ name: '트라마돌 50mg', dosage: '50mg', frequency: '1일 2회', duration: '3일', instructions: '심한 통증 시 복용' }, { name: '레바미피드 100mg', dosage: '100mg', frequency: '1일 3회', duration: '5일', instructions: '위장보호제' }],
      [{ name: '비타민C 1000mg', dosage: '1000mg', frequency: '1일 1회', duration: '30일', instructions: '아침 식후 복용' }, { name: '히루도이드 겔', dosage: '적당량', frequency: '1일 2회', duration: '14일', instructions: '흉터 부위 도포' }, { name: '콜라겐 보충제', dosage: '1포', frequency: '1일 1회', duration: '30일', instructions: '아침 공복 복용' }],
      [{ name: '무피로신 연고', dosage: '적당량', frequency: '1일 3회', duration: '7일', instructions: '상처 부위 도포' }, { name: '이부프로펜 400mg', dosage: '400mg', frequency: '1일 3회', duration: '5일', instructions: '식후 복용' }],
      [{ name: '세프라딘 500mg', dosage: '500mg', frequency: '1일 3회', duration: '5일', instructions: '식후 복용' }, { name: '푸시딘 연고', dosage: '적당량', frequency: '1일 2회', duration: '10일', instructions: '절개 부위 도포' }, { name: '판토프라졸 40mg', dosage: '40mg', frequency: '1일 1회', duration: '7일', instructions: '아침 식전 복용' }, { name: '아세트아미노펜 500mg', dosage: '500mg', frequency: '1일 3회', duration: '3일', instructions: '통증 시 복용' }],
      [{ name: '아르니카 연고', dosage: '적당량', frequency: '1일 2회', duration: '5일', instructions: '멍 부위 도포' }],
      [{ name: '아목시실린 500mg', dosage: '500mg', frequency: '1일 3회', duration: '7일', instructions: '식후 복용' }, { name: '트라마돌 50mg', dosage: '50mg', frequency: '1일 2회', duration: '5일', instructions: '통증 시 복용' }, { name: '레바미피드 100mg', dosage: '100mg', frequency: '1일 3회', duration: '7일', instructions: '위장보호제' }],
      [{ name: '비타민C 1000mg', dosage: '1000mg', frequency: '1일 1회', duration: '30일', instructions: '아침 식후 복용' }, { name: '히루도이드 겔', dosage: '적당량', frequency: '1일 2회', duration: '14일', instructions: '흉터 부위 도포' }],
      [{ name: '클라리스로마이신 250mg', dosage: '250mg', frequency: '1일 2회', duration: '5일', instructions: '식후 복용' }, { name: '이부프로펜 400mg', dosage: '400mg', frequency: '1일 3회', duration: '3일', instructions: '식후 복용' }, { name: '무피로신 연고', dosage: '적당량', frequency: '1일 3회', duration: '7일', instructions: '상처 부위 도포' }],
      [{ name: '아세트아미노펜 500mg', dosage: '500mg', frequency: '1일 3회', duration: '5일', instructions: '통증 시 복용' }, { name: '판토프라졸 40mg', dosage: '40mg', frequency: '1일 1회', duration: '7일', instructions: '식전 복용' }],
      [{ name: '세프라딘 500mg', dosage: '500mg', frequency: '1일 3회', duration: '7일', instructions: '식후 복용' }, { name: '푸시딘 연고', dosage: '적당량', frequency: '1일 2회', duration: '14일', instructions: '절개 부위 도포' }, { name: '비타민C 1000mg', dosage: '1000mg', frequency: '1일 1회', duration: '30일', instructions: '회복 촉진' }],
      [{ name: '아르니카 연고', dosage: '적당량', frequency: '1일 2회', duration: '5일', instructions: '멍 부위 도포' }, { name: '콜라겐 보충제', dosage: '1포', frequency: '1일 1회', duration: '30일', instructions: '피부 회복' }],
      [{ name: '아목시실린 500mg', dosage: '500mg', frequency: '1일 3회', duration: '5일', instructions: '식후 복용' }, { name: '이부프로펜 400mg', dosage: '400mg', frequency: '1일 3회', duration: '3일', instructions: '통증 시 식후 복용' }, { name: '레바미피드 100mg', dosage: '100mg', frequency: '1일 3회', duration: '5일', instructions: '위장보호제' }, { name: '히루도이드 겔', dosage: '적당량', frequency: '1일 2회', duration: '14일', instructions: '흉터 관리' }],
    ]
    const rxNotes = ['수술 후 감염 예방 및 통증 관리 목적 처방.','항생제 및 진통제 처방. 통증 심할 시 트라마돌 추가 가능.','시술 후 회복 촉진 및 멍 관리 목적 처방.','통증 관리 목적 처방. 위장 장애 시 레바미피드 병용.','수술 후 회복 촉진, 흉터 관리 및 영양 보충 목적.','상처 부위 감염 예방 및 통증 관리.','절개 수술 후 항생제, 연고, 진통제 복합 처방.','쁘띠 시술 후 멍 관리 목적 최소 처방.','전신마취 수술 후 항생제, 진통제, 위장보호제 처방.','경과 관찰 후 회복 보조 처방.','감염 예방 및 통증 관리 복합 처방.','경미한 시술 후 진통제 및 위장보호제 처방.','절개 수술 후 항생제, 연고, 비타민 복합 처방.','비수술 시술 후 멍 관리 및 피부 회복 처방.','수술 후 감염 예방, 통증 관리, 흉터 관리 복합 처방.']
    const xPrescriptions: Prescription[] = Array.from({ length: 15 }, (_, i) => ({
      id: `RX-DEMO-${String(i + 4).padStart(3, '0')}`,
      patientId: `PT-DEMO-${String(i + 9).padStart(3, '0')}`,
      medicalRecordId: `MR-DEMO-${String(i + 8).padStart(3, '0')}`,
      date: new Date(2025, 10 + Math.floor(i / 6), 15 + (i % 20)).toISOString().split('T')[0],
      doctorName: rDr[i % rDr.length],
      medications: rxMeds[i],
      notes: rxNotes[i],
      createdAt: new Date(2025, 10 + Math.floor(i / 6), 15 + (i % 20), 11, 0).toISOString(),
    }))
    persist(PRESCRIPTIONS_KEY, [...prescriptions, ...xPrescriptions])
  },
}
