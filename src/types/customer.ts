export type CustomerGrade = 'vip' | 'gold' | 'silver' | 'normal' | 'new'

export const CUSTOMER_GRADE_LABELS: Record<CustomerGrade, string> = {
  vip: 'VIP',
  gold: '골드',
  silver: '실버',
  normal: '일반',
  new: '신규',
}

export const CUSTOMER_GRADE_COLORS: Record<CustomerGrade, string> = {
  vip: 'bg-purple-100 text-purple-800',
  gold: 'bg-yellow-100 text-yellow-800',
  silver: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  new: 'bg-green-100 text-green-800',
}

export const CUSTOMER_GRADE_ORDER: CustomerGrade[] = ['vip', 'gold', 'silver', 'normal', 'new']

export type MemoType = 'general' | 'reception' | 'consultation'

export interface CustomerMemo {
  id: string
  content: string
  type: MemoType
  createdAt: string
}

export const MEMO_TYPE_LABELS: Record<MemoType, string> = {
  general: '일반',
  reception: '접수',
  consultation: '상담',
}

export interface Customer {
  id: string
  name: string
  phone: string
  grade: CustomerGrade
  tags: string[]
  memos: CustomerMemo[]
  bookingIds: string[]
  totalVisits: number
  lastVisitDate: string | null
  registeredAt: string
}

export type FollowUpStatus = 'pending' | 'completed' | 'skipped'

export type FollowUpType = 'call' | 'sms' | 'kakao'

export interface FollowUpTask {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  type: FollowUpType
  reason: string
  dueDate: string
  status: FollowUpStatus
  note: string
  bookingId?: string
  createdAt: string
}

export const FOLLOW_UP_TYPE_LABELS: Record<FollowUpType, string> = {
  call: '전화',
  sms: '문자',
  kakao: '카카오톡',
}

export const FOLLOW_UP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  pending: '대기',
  completed: '완료',
  skipped: '건너뜀',
}

export const FOLLOW_UP_STATUS_COLORS: Record<FollowUpStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  skipped: 'bg-gray-100 text-gray-800',
}
