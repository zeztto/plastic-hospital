export type NoticePriority = 'normal' | 'important' | 'urgent'

export const NOTICE_PRIORITY_LABELS: Record<NoticePriority, string> = {
  normal: '일반',
  important: '중요',
  urgent: '긴급',
}

export const NOTICE_PRIORITY_COLORS: Record<NoticePriority, string> = {
  normal: 'bg-gray-100 text-gray-800',
  important: 'bg-yellow-100 text-yellow-800',
  urgent: 'bg-red-100 text-red-800',
}

export interface Notice {
  id: string
  title: string
  content: string
  priority: NoticePriority
  author: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export type NaverSyncStatus = 'synced' | 'pending' | 'conflict'

export const NAVER_SYNC_STATUS_LABELS: Record<NaverSyncStatus, string> = {
  synced: '동기화 완료',
  pending: '대기 중',
  conflict: '충돌',
}

export const NAVER_SYNC_STATUS_COLORS: Record<NaverSyncStatus, string> = {
  synced: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  conflict: 'bg-red-100 text-red-800',
}

export interface NaverBooking {
  id: string
  naverBookingId: string
  customerName: string
  customerPhone: string
  procedure: string
  date: string
  time: string
  syncStatus: NaverSyncStatus
  syncedAt: string | null
  createdAt: string
}

export interface PhoneCallRecord {
  id: string
  callerPhone: string
  callerName: string | null
  customerId: string | null
  direction: 'inbound' | 'outbound'
  duration: string
  note: string
  createdAt: string
}

export const CALL_DIRECTION_LABELS: Record<'inbound' | 'outbound', string> = {
  inbound: '수신',
  outbound: '발신',
}
