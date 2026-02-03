export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

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
}

export interface BookingFormData {
  name: string
  phone: string
  procedure: string
  date: string
  time: string
  message: string
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
