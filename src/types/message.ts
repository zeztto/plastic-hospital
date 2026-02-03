export type MessageChannel = 'kakao' | 'sms' | 'lms'

export const MESSAGE_CHANNEL_LABELS: Record<MessageChannel, string> = {
  kakao: '카카오 알림톡',
  sms: 'SMS',
  lms: 'LMS',
}

export type TemplateCategory =
  | 'welcome'
  | 'thanks'
  | 'booking_confirm'
  | 'booking_reminder'
  | 'post_procedure'
  | 'follow_up'
  | 'promotion'
  | 'custom'

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  welcome: '환영 인사',
  thanks: '소개 감사',
  booking_confirm: '예약 확인',
  booking_reminder: '예약 리마인더',
  post_procedure: '시술 후 안내',
  follow_up: '경과 확인',
  promotion: '프로모션',
  custom: '직접 작성',
}

export const TEMPLATE_CATEGORY_COLORS: Record<TemplateCategory, string> = {
  welcome: 'bg-green-100 text-green-800',
  thanks: 'bg-pink-100 text-pink-800',
  booking_confirm: 'bg-blue-100 text-blue-800',
  booking_reminder: 'bg-yellow-100 text-yellow-800',
  post_procedure: 'bg-purple-100 text-purple-800',
  follow_up: 'bg-orange-100 text-orange-800',
  promotion: 'bg-red-100 text-red-800',
  custom: 'bg-gray-100 text-gray-800',
}

export interface MessageTemplate {
  id: string
  name: string
  category: TemplateCategory
  channel: MessageChannel
  content: string
  variables: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type SendStatus = 'pending' | 'sent' | 'failed'

export const SEND_STATUS_LABELS: Record<SendStatus, string> = {
  pending: '발송대기',
  sent: '발송완료',
  failed: '발송실패',
}

export const SEND_STATUS_COLORS: Record<SendStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export interface MessageSendRecord {
  id: string
  templateId: string
  templateName: string
  channel: MessageChannel
  recipientName: string
  recipientPhone: string
  content: string
  status: SendStatus
  sentAt: string
  createdAt: string
}

export type AutoSendTrigger = 'booking_confirmed' | 'booking_reminder_1d' | 'procedure_done' | 'follow_up_3d'

export const AUTO_SEND_TRIGGER_LABELS: Record<AutoSendTrigger, string> = {
  booking_confirmed: '예약 확정 시',
  booking_reminder_1d: '예약 1일 전',
  procedure_done: '시술 완료 시',
  follow_up_3d: '시술 3일 후',
}

export interface AutoSendRule {
  id: string
  trigger: AutoSendTrigger
  templateId: string
  channel: MessageChannel
  isEnabled: boolean
}
