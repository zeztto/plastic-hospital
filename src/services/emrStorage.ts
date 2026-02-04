import type {
  Patient,
  MedicalRecord,
  ProcedureRecord,
  Prescription,
  ProcedureStatus,
} from '@/types/emr'
import { MASTER_PERSONS } from '@/services/masterPersonData'
import { safeParse } from '@/lib/safeStorage'

const PATIENTS_KEY = 'plastic-hospital-patients'
const RECORDS_KEY = 'plastic-hospital-records'
const PROCEDURES_KEY = 'plastic-hospital-procedures'
const PRESCRIPTIONS_KEY = 'plastic-hospital-prescriptions'

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

function load<T>(key: string): T[] {
  return safeParse<T>(key, [])
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

    const allPatients: Patient[] = MASTER_PERSONS.map((p, i) => ({
      id: `PT-DEMO-${String(i + 1).padStart(3, '0')}`,
      chartNumber: `C${String(i + 1).padStart(5, '0')}`,
      name: p.name, birthDate: p.birthDate, gender: p.gender,
      phone: p.phone, address: p.address, bloodType: p.bloodType,
      allergies: p.allergies, medicalHistory: p.medicalHistory,
      registeredAt: new Date(2025, 5 + Math.floor(i / 30), 1 + (i % 28), 9 + (i % 8), 0).toISOString(),
    }))
    persist(PATIENTS_KEY, allPatients)

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

    const recordPatientIndices = Array.from({ length: 200 }, (_, i) => i).filter((i) => i % 5 < 3)
    const allRecords: MedicalRecord[] = recordPatientIndices.map((pIdx, ri) => {
      const proc = rPr[pIdx % rPr.length]
      const complaints = rCc[proc]
      const [dg, dc] = rDg[proc]
      return {
        id: `MR-DEMO-${String(ri + 1).padStart(3, '0')}`,
        patientId: `PT-DEMO-${String(pIdx + 1).padStart(3, '0')}`,
        date: new Date(2025, 10 + Math.floor(ri / 40), 1 + (ri % 28)).toISOString().split('T')[0],
        doctorName: rDr[ri % rDr.length],
        chiefComplaint: complaints[ri % complaints.length],
        diagnosis: dg, diagnosisCode: dc,
        vitalSigns: { bloodPressure: `${110 + (ri % 25)}/${70 + (ri % 18)}`, pulse: 64 + (ri % 24), temperature: +(36.2 + (ri % 7) * 0.1).toFixed(1), weight: 48 + (ri % 35), height: 155 + (ri % 27) },
        treatmentPlan: rTp[proc],
        notes: `${complaints[ri % complaints.length]} 소견. 검사 완료. 시술 일정 조율 예정.`,
        createdAt: new Date(2025, 10 + Math.floor(ri / 40), 1 + (ri % 28), 10, 0).toISOString(),
      }
    })
    persist(RECORDS_KEY, allRecords)

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
    const prSt: ProcedureStatus[] = ['completed','scheduled','completed','completed','scheduled','completed','scheduled','completed','completed','cancelled']

    const procPatientIndices = Array.from({ length: 200 }, (_, i) => i).filter((i) => i % 5 < 2)
    const allProcs: ProcedureRecord[] = procPatientIndices.map((pIdx, pi) => {
      const proc = rPr[pIdx % rPr.length]
      const names = prNm[proc]
      const mrIdx = recordPatientIndices.indexOf(pIdx)
      return {
        id: `PR-DEMO-${String(pi + 1).padStart(3, '0')}`,
        patientId: `PT-DEMO-${String(pIdx + 1).padStart(3, '0')}`,
        medicalRecordId: mrIdx >= 0 ? `MR-DEMO-${String(mrIdx + 1).padStart(3, '0')}` : `MR-DEMO-001`,
        date: new Date(2025, 10 + Math.floor(pi / 30), 5 + (pi % 25)).toISOString().split('T')[0],
        procedureName: names[pi % names.length],
        doctor: rDr[pi % rDr.length], anesthesiaType: prAn[proc], duration: prDu[proc],
        details: `${names[pi % names.length]} 시행. 정상 경과.`,
        complications: pi % 7 === 0 ? '경미한 부종' : '없음',
        postOpInstructions: proc === '쁘띠성형' ? '4시간 동안 눕지 말 것' : proc === '피부시술' ? '자외선 차단제 필수' : '처방약 복용, 격한 운동 2주 자제',
        status: prSt[pi % prSt.length],
        createdAt: new Date(2025, 10 + Math.floor(pi / 30), 5 + (pi % 25), 10, 0).toISOString(),
      }
    })
    persist(PROCEDURES_KEY, allProcs)

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

    const rxPatientIndices = Array.from({ length: 200 }, (_, i) => i).filter((i) => i % 4 === 0)
    const allRx: Prescription[] = rxPatientIndices.map((pIdx, ri) => {
      const mrIdx = recordPatientIndices.indexOf(pIdx)
      return {
        id: `RX-DEMO-${String(ri + 1).padStart(3, '0')}`,
        patientId: `PT-DEMO-${String(pIdx + 1).padStart(3, '0')}`,
        medicalRecordId: mrIdx >= 0 ? `MR-DEMO-${String(mrIdx + 1).padStart(3, '0')}` : `MR-DEMO-001`,
        date: new Date(2025, 10 + Math.floor(ri / 20), 1 + (ri % 28)).toISOString().split('T')[0],
        doctorName: rDr[ri % rDr.length],
        medications: rxMeds[ri % rxMeds.length],
        notes: rxNotes[ri % rxNotes.length],
        createdAt: new Date(2025, 10 + Math.floor(ri / 20), 1 + (ri % 28), 11, 0).toISOString(),
      }
    })
    persist(PRESCRIPTIONS_KEY, allRx)
  },
}
