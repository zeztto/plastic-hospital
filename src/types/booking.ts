export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type JourneyStage =
  | 'inquiry'
  | 'consultation'
  | 'procedure_scheduled'
  | 'procedure_done'
  | 'follow_up'
  | 'retention'

export interface JourneyEvent {
  stage: JourneyStage
  timestamp: string
  note?: string
}

export type AcquisitionSource =
  | 'naver'
  | 'instagram'
  | 'youtube'
  | 'kakao'
  | 'referral'
  | 'blog'
  | 'ad'
  | 'walk_in'
  | 'other'

export interface Booking {
  id: string
  name: string
  phone: string
  procedure: string
  date: string
  time: string
  message: string
  status: BookingStatus
  createdAt: string
  memo: string
  source: AcquisitionSource
  medium: string
  campaign: string
  journeyStage: JourneyStage
  journeyHistory: JourneyEvent[]
}

export interface BookingFormData {
  name: string
  phone: string
  procedure: string
  date: string
  time: string
  message: string
  source: AcquisitionSource
  medium: string
  campaign: string
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: '대기중',
  confirmed: '확인됨',
  completed: '완료',
  cancelled: '취소됨',
}

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export const JOURNEY_STAGE_LABELS: Record<JourneyStage, string> = {
  inquiry: '문의',
  consultation: '상담',
  procedure_scheduled: '시술예약',
  procedure_done: '시술완료',
  follow_up: '사후관리',
  retention: '재방문',
}

export const JOURNEY_STAGE_ORDER: JourneyStage[] = [
  'inquiry',
  'consultation',
  'procedure_scheduled',
  'procedure_done',
  'follow_up',
  'retention',
]

export const JOURNEY_STAGE_COLORS: Record<JourneyStage, string> = {
  inquiry: 'bg-gray-100 text-gray-800',
  consultation: 'bg-blue-100 text-blue-800',
  procedure_scheduled: 'bg-purple-100 text-purple-800',
  procedure_done: 'bg-green-100 text-green-800',
  follow_up: 'bg-orange-100 text-orange-800',
  retention: 'bg-pink-100 text-pink-800',
}

export const ACQUISITION_SOURCES: AcquisitionSource[] = [
  'naver',
  'instagram',
  'youtube',
  'kakao',
  'referral',
  'blog',
  'ad',
  'walk_in',
  'other',
]

export const ACQUISITION_SOURCE_LABELS: Record<AcquisitionSource, string> = {
  naver: '네이버',
  instagram: '인스타그램',
  youtube: '유튜브',
  kakao: '카카오톡',
  referral: '지인소개',
  blog: '블로그',
  ad: '광고',
  walk_in: '직접방문',
  other: '기타',
}

export const ACQUISITION_SOURCE_COLORS: Record<AcquisitionSource, string> = {
  naver: '#03C75A',
  instagram: '#E4405F',
  youtube: '#FF0000',
  kakao: '#FEE500',
  referral: '#6366F1',
  blog: '#3B82F6',
  ad: '#F59E0B',
  walk_in: '#10B981',
  other: '#6B7280',
}

export const PROCEDURES = [
  '눈성형',
  '코성형',
  '안면윤곽',
  '리프팅',
  '가슴성형',
  '지방흡입',
  '피부시술',
  '쁘띠성형',
  '기타',
] as const

export const TIME_SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
] as const
