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

  // ── Medical Records ──
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

  // ── Procedures ──
  getProceduresByPatient(patientId: string): ProcedureRecord[] {
    return load<ProcedureRecord>(PROCEDURES_KEY)
      .filter((p) => p.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  createProcedure(data: Omit<ProcedureRecord, 'id' | 'createdAt'>): ProcedureRecord {
    const all = load<ProcedureRecord>(PROCEDURES_KEY)
    const proc: ProcedureRecord = { ...data, id: genId('PR'), createdAt: new Date().toISOString() }
    all.push(proc)
    persist(PROCEDURES_KEY, all)
    return proc
  },
  updateProcedureStatus(id: string, status: ProcedureStatus): ProcedureRecord | undefined {
    const all = load<ProcedureRecord>(PROCEDURES_KEY)
    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    all[idx].status = status
    persist(PROCEDURES_KEY, all)
    return all[idx]
  },

  // ── Prescriptions ──
  getPrescriptionsByPatient(patientId: string): Prescription[] {
    return load<Prescription>(PRESCRIPTIONS_KEY)
      .filter((p) => p.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  createPrescription(data: Omit<Prescription, 'id' | 'createdAt'>): Prescription {
    const all = load<Prescription>(PRESCRIPTIONS_KEY)
    const rx: Prescription = { ...data, id: genId('RX'), createdAt: new Date().toISOString() }
    all.push(rx)
    persist(PRESCRIPTIONS_KEY, all)
    return rx
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
    persist(PATIENTS_KEY, patients)

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
    persist(RECORDS_KEY, records)

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
    persist(PROCEDURES_KEY, procedures)

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
    persist(PRESCRIPTIONS_KEY, prescriptions)
  },
}
