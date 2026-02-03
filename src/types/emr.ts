export type Gender = 'male' | 'female'

export interface Patient {
  id: string
  chartNumber: string
  name: string
  birthDate: string
  gender: Gender
  phone: string
  address: string
  bloodType: string
  allergies: string[]
  medicalHistory: string
  registeredAt: string
}

export interface VitalSigns {
  bloodPressure: string
  pulse: number
  temperature: number
  weight: number
  height: number
}

export interface MedicalRecord {
  id: string
  patientId: string
  date: string
  doctorName: string
  chiefComplaint: string
  diagnosis: string
  diagnosisCode: string
  vitalSigns: VitalSigns
  treatmentPlan: string
  notes: string
  createdAt: string
}

export type ProcedureStatus = 'scheduled' | 'completed' | 'cancelled'

export interface ProcedureRecord {
  id: string
  patientId: string
  medicalRecordId: string
  date: string
  procedureName: string
  doctor: string
  anesthesiaType: string
  duration: string
  details: string
  complications: string
  postOpInstructions: string
  status: ProcedureStatus
  createdAt: string
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface Prescription {
  id: string
  patientId: string
  medicalRecordId: string
  date: string
  doctorName: string
  medications: Medication[]
  notes: string
  createdAt: string
}

export const GENDER_LABELS: Record<Gender, string> = {
  male: '남성',
  female: '여성',
}

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const

export const PROCEDURE_STATUS_LABELS: Record<ProcedureStatus, string> = {
  scheduled: '예정',
  completed: '완료',
  cancelled: '취소',
}

export const PROCEDURE_STATUS_COLORS: Record<ProcedureStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export const ANESTHESIA_TYPES = [
  '국소마취',
  '수면마취',
  '전신마취',
  '해당없음',
] as const

export const COMMON_DIAGNOSES = [
  { code: 'Z41.1', name: '미용목적의 성형수술' },
  { code: 'H02.3', name: '안검하수' },
  { code: 'M95.0', name: '코의 후천성 변형' },
  { code: 'M95.2', name: '두부의 기타 후천성 변형' },
  { code: 'L90.5', name: '피부의 흉터 및 섬유증' },
  { code: 'L57.4', name: '피부의 노인성 변화' },
  { code: 'N62', name: '유방비대' },
  { code: 'E65', name: '국한성 지방과잉' },
  { code: 'L70.0', name: '심상성 여드름' },
  { code: 'L81.1', name: '색소침착' },
] as const
