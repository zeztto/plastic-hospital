import type {
  MessageTemplate,
  TemplateCategory,
  MessageChannel,
  MessageSendRecord,
  SendStatus,
  AutoSendRule,
  AutoSendTrigger,
} from '@/types/message'
import { safeParse } from '@/lib/safeStorage'

const TEMPLATE_KEY = 'plastic-hospital-msg-templates'
const SEND_KEY = 'plastic-hospital-msg-sends'
const AUTOSEND_KEY = 'plastic-hospital-msg-autosend'

function generateTemplateId(): string {
  return `TPL-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function generateSendId(): string {
  return `SEND-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function getAllTemplates(): MessageTemplate[] {
  return safeParse<MessageTemplate>(TEMPLATE_KEY, [])
}

function saveTemplates(templates: MessageTemplate[]): void {
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify(templates))
}

function getAllSends(): MessageSendRecord[] {
  return safeParse<MessageSendRecord>(SEND_KEY, [])
}

function saveSends(sends: MessageSendRecord[]): void {
  localStorage.setItem(SEND_KEY, JSON.stringify(sends))
}

function getAllAutoSendRules(): AutoSendRule[] {
  return safeParse<AutoSendRule>(AUTOSEND_KEY, [])
}

function saveAutoSendRules(rules: AutoSendRule[]): void {
  localStorage.setItem(AUTOSEND_KEY, JSON.stringify(rules))
}

export const messageStorage = {
  // ── Template CRUD ─────────────────────────────────────

  getTemplates(): MessageTemplate[] {
    return getAllTemplates().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  },

  getTemplateById(id: string): MessageTemplate | undefined {
    return getAllTemplates().find((t) => t.id === id)
  },

  getTemplatesByCategory(category: TemplateCategory): MessageTemplate[] {
    return getAllTemplates().filter((t) => t.category === category)
  },

  getActiveTemplates(): MessageTemplate[] {
    return getAllTemplates().filter((t) => t.isActive)
  },

  createTemplate(data: {
    name: string
    category: TemplateCategory
    channel: MessageChannel
    content: string
    variables: string[]
  }): MessageTemplate {
    const templates = getAllTemplates()
    const now = new Date().toISOString()
    const template: MessageTemplate = {
      ...data,
      id: generateTemplateId(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }
    templates.push(template)
    saveTemplates(templates)
    return template
  },

  updateTemplate(
    id: string,
    data: Partial<Pick<MessageTemplate, 'name' | 'category' | 'channel' | 'content' | 'variables' | 'isActive'>>
  ): MessageTemplate | undefined {
    const templates = getAllTemplates()
    const index = templates.findIndex((t) => t.id === id)
    if (index === -1) return undefined
    templates[index] = {
      ...templates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    saveTemplates(templates)
    return templates[index]
  },

  deleteTemplate(id: string): boolean {
    const templates = getAllTemplates()
    const filtered = templates.filter((t) => t.id !== id)
    if (filtered.length === templates.length) return false
    saveTemplates(filtered)
    return true
  },

  // ── Send Record CRUD ──────────────────────────────────

  getSendRecords(): MessageSendRecord[] {
    return getAllSends().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  getSendRecordsByStatus(status: SendStatus): MessageSendRecord[] {
    return getAllSends().filter((s) => s.status === status)
  },

  createSendRecord(data: {
    templateId: string
    templateName: string
    channel: MessageChannel
    recipientName: string
    recipientPhone: string
    content: string
  }): MessageSendRecord {
    const sends = getAllSends()
    const now = new Date().toISOString()
    const record: MessageSendRecord = {
      ...data,
      id: generateSendId(),
      status: 'sent' as SendStatus,
      sentAt: now,
      createdAt: now,
    }
    sends.push(record)
    saveSends(sends)
    return record
  },

  createBulkSendRecords(
    recipients: Array<{ name: string; phone: string }>,
    templateId: string,
    templateName: string,
    channel: MessageChannel,
    content: string
  ): MessageSendRecord[] {
    const sends = getAllSends()
    const now = new Date().toISOString()
    const records: MessageSendRecord[] = recipients.map((r, i) => ({
      id: `SEND-${Date.now() + i}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      templateId,
      templateName,
      channel,
      recipientName: r.name,
      recipientPhone: r.phone,
      content,
      status: (Math.random() > 0.1 ? 'sent' : 'failed') as SendStatus,
      sentAt: now,
      createdAt: now,
    }))
    sends.push(...records)
    saveSends(sends)
    return records
  },

  getSendStats() {
    const all = getAllSends()
    return {
      total: all.length,
      sent: all.filter((s) => s.status === 'sent').length,
      failed: all.filter((s) => s.status === 'failed').length,
      pending: all.filter((s) => s.status === 'pending').length,
    }
  },

  // ── Auto Send Rules ───────────────────────────────────

  getAutoSendRules(): AutoSendRule[] {
    return getAllAutoSendRules()
  },

  updateAutoSendRule(id: string, isEnabled: boolean): AutoSendRule | undefined {
    const rules = getAllAutoSendRules()
    const index = rules.findIndex((r) => r.id === id)
    if (index === -1) return undefined
    rules[index].isEnabled = isEnabled
    saveAutoSendRules(rules)
    return rules[index]
  },

  updateAutoSendRuleTemplate(id: string, templateId: string): AutoSendRule | undefined {
    const rules = getAllAutoSendRules()
    const index = rules.findIndex((r) => r.id === id)
    if (index === -1) return undefined
    rules[index].templateId = templateId
    saveAutoSendRules(rules)
    return rules[index]
  },

  // ── Demo Data ─────────────────────────────────────────

  seedDemoData(): void {
    if (getAllTemplates().length > 0) return

    const now = new Date().toISOString()
    const templates: MessageTemplate[] = [
      {
        id: 'TPL-DEMO-001',
        name: '신규 고객 환영 인사',
        category: 'welcome',
        channel: 'kakao',
        content: '안녕하세요 {{고객명}}님! 뷰티플 성형외과에 오신 것을 환영합니다. 첫 상담 시 10% 할인 혜택을 드립니다. 문의: 02-1234-5678',
        variables: ['고객명'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'TPL-DEMO-002',
        name: '소개 감사 인사',
        category: 'thanks',
        channel: 'kakao',
        content: '{{고객명}}님, 소중한 분을 소개해주셔서 감사합니다. 소개 감사 혜택으로 다음 시술 시 5% 추가 할인을 드립니다.',
        variables: ['고객명'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'TPL-DEMO-003',
        name: '예약 확인 안내',
        category: 'booking_confirm',
        channel: 'sms',
        content: '[뷰티플성형외과] {{고객명}}님, {{날짜}} {{시간}} 예약이 확정되었습니다. 변경/취소는 02-1234-5678로 연락 바랍니다.',
        variables: ['고객명', '날짜', '시간'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'TPL-DEMO-004',
        name: '예약 리마인더',
        category: 'booking_reminder',
        channel: 'kakao',
        content: '{{고객명}}님, 내일 {{시간}}에 뷰티플 성형외과 예약이 있습니다. 주소: 서울 강남구 테헤란로 123. 변경 시 02-1234-5678',
        variables: ['고객명', '시간'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'TPL-DEMO-005',
        name: '눈성형 시술 후 안내',
        category: 'post_procedure',
        channel: 'kakao',
        content: '{{고객명}}님, {{시술명}} 시술이 완료되었습니다.\n\n[시술 후 주의사항]\n• 48시간 냉찜질 (15분 간격)\n• 1주일간 음주/흡연 금지\n• 2주간 격한 운동 자제\n• 처방 안약 하루 3회 점안\n\n이상 증상 시 즉시 연락: 02-1234-5678',
        variables: ['고객명', '시술명'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'TPL-DEMO-006',
        name: '코성형 시술 후 안내',
        category: 'post_procedure',
        channel: 'kakao',
        content: '{{고객명}}님, {{시술명}} 시술이 완료되었습니다.\n\n[시술 후 주의사항]\n• 부목 제거 전까지 물 접촉 금지\n• 2주간 안경 착용 금지\n• 1개월간 코를 세게 풀지 않기\n• 처방약 시간 맞춰 복용\n\n이상 증상 시 즉시 연락: 02-1234-5678',
        variables: ['고객명', '시술명'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'TPL-DEMO-007',
        name: '시술 3일 후 경과 확인',
        category: 'follow_up',
        channel: 'sms',
        content: '{{고객명}}님, 시술 후 경과는 어떠신가요? 불편한 점이 있으시면 언제든 연락 주세요. 뷰티플 성형외과 02-1234-5678',
        variables: ['고객명'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'TPL-DEMO-008',
        name: '2월 프로모션 안내',
        category: 'promotion',
        channel: 'lms',
        content: '{{고객명}}님, 2월 한정 프로모션!\n\n🎉 눈성형 20% 할인\n🎉 코성형 15% 할인\n🎉 리프팅 상담 시 피부관리 1회 무료\n\n예약: 02-1234-5678\n뷰티플 성형외과',
        variables: ['고객명'],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]

    const xTplData: Array<{ name: string; category: TemplateCategory; channel: MessageChannel; content: string; variables: string[] }> = [
      { name: '리프팅 시술 후 안내', category: 'post_procedure', channel: 'kakao', content: '{{고객명}}님, {{시술명}} 시술이 완료되었습니다.\n\n[시술 후 주의사항]\n• 3일간 큰 입벌림 자제\n• 1주간 사우나/찜질방 금지\n• 세안 시 시술 부위 문지르지 않기\n\n이상 증상 시: 02-1234-5678', variables: ['고객명', '시술명'] },
      { name: '재방문 안내', category: 'follow_up', channel: 'sms', content: '[뷰티플성형외과] {{고객명}}님, 마지막 방문 후 한 달이 지났습니다. 경과 확인을 위해 재방문을 권장드립니다. 예약: 02-1234-5678', variables: ['고객명'] },
      { name: '봄맞이 프로모션', category: 'promotion', channel: 'lms', content: '{{고객명}}님, 봄맞이 특별 프로모션!\n\n🌸 피부시술 30% 할인\n🌸 보톡스+필러 패키지 25% 할인\n🌸 친구 동반 시 추가 10% 할인\n\n기간: 3/1~3/31\n예약: 02-1234-5678', variables: ['고객명'] },
      { name: 'VIP 고객 감사 메시지', category: 'custom', channel: 'kakao', content: '{{고객명}}님, 항상 뷰티플 성형외과를 이용해주셔서 감사합니다. VIP 고객님께 다음 시술 시 15% 특별 할인을 드립니다. 문의: 02-1234-5678', variables: ['고객명'] },
      { name: '수술 전 주의사항 안내', category: 'custom', channel: 'lms', content: '{{고객명}}님, {{날짜}} {{시술명}} 수술 전 주의사항 안내드립니다.\n\n• 수술 8시간 전부터 금식\n• 당일 화장/렌즈/악세서리 착용 금지\n• 편한 옷차림, 보호자 동반 필수\n• 아스피린/혈액순환제 1주 전부터 중단\n\n문의: 02-1234-5678', variables: ['고객명', '날짜', '시술명'] },
      { name: '신규 환영 할인 안내', category: 'welcome', channel: 'kakao', content: '안녕하세요 {{고객명}}님! 뷰티플 성형외과 첫 방문을 환영합니다. 신규 고객 전용 혜택으로 첫 상담 무료 + 시술 10% 할인을 드립니다. 지금 바로 예약하세요! 02-1234-5678', variables: ['고객명'] },
      { name: '경과 확인 2주차', category: 'follow_up', channel: 'kakao', content: '{{고객명}}님, {{시술명}} 시술 후 2주가 지났습니다. 현재 회복 상태는 어떠신가요? 불편한 점이 있으시면 내원해 주세요. 예약: 02-1234-5678', variables: ['고객명', '시술명'] },
    ]
    const xTemplates: MessageTemplate[] = xTplData.map((d, i) => ({
      ...d,
      id: `TPL-DEMO-${String(i + 9).padStart(3, '0')}`,
      isActive: i !== 4,
      createdAt: now,
      updatedAt: now,
    }))
    saveTemplates([...templates, ...xTemplates])

    const sends: MessageSendRecord[] = [
      {
        id: 'SEND-DEMO-001',
        templateId: 'TPL-DEMO-001',
        templateName: '신규 고객 환영 인사',
        channel: 'kakao',
        recipientName: '박지수',
        recipientPhone: '010-9876-5432',
        content: '안녕하세요 박지수님! 뷰티플 성형외과에 오신 것을 환영합니다. 첫 상담 시 10% 할인 혜택을 드립니다. 문의: 02-1234-5678',
        status: 'sent',
        sentAt: '2026-02-05T14:35:00.000Z',
        createdAt: '2026-02-05T14:35:00.000Z',
      },
      {
        id: 'SEND-DEMO-002',
        templateId: 'TPL-DEMO-003',
        templateName: '예약 확인 안내',
        channel: 'sms',
        recipientName: '김미영',
        recipientPhone: '010-1234-5678',
        content: '[뷰티플성형외과] 김미영님, 2026-02-06 10:00 예약이 확정되었습니다. 변경/취소는 02-1234-5678로 연락 바랍니다.',
        status: 'sent',
        sentAt: '2026-02-05T10:00:00.000Z',
        createdAt: '2026-02-05T10:00:00.000Z',
      },
      {
        id: 'SEND-DEMO-003',
        templateId: 'TPL-DEMO-005',
        templateName: '눈성형 시술 후 안내',
        channel: 'kakao',
        recipientName: '강다현',
        recipientPhone: '010-2222-8888',
        content: '강다현님, 코성형 시술이 완료되었습니다.\n\n[시술 후 주의사항]\n• 부목 제거 전까지 물 접촉 금지\n• 2주간 안경 착용 금지\n• 1개월간 코를 세게 풀지 않기\n• 처방약 시간 맞춰 복용\n\n이상 증상 시 즉시 연락: 02-1234-5678',
        status: 'sent',
        sentAt: '2026-02-03T11:30:00.000Z',
        createdAt: '2026-02-03T11:30:00.000Z',
      },
      {
        id: 'SEND-DEMO-004',
        templateId: 'TPL-DEMO-007',
        templateName: '시술 3일 후 경과 확인',
        channel: 'sms',
        recipientName: '송하늘',
        recipientPhone: '010-5555-7777',
        content: '송하늘님, 시술 후 경과는 어떠신가요? 불편한 점이 있으시면 언제든 연락 주세요. 뷰티플 성형외과 02-1234-5678',
        status: 'sent',
        sentAt: '2026-02-07T09:00:00.000Z',
        createdAt: '2026-02-07T09:00:00.000Z',
      },
      {
        id: 'SEND-DEMO-005',
        templateId: 'TPL-DEMO-008',
        templateName: '2월 프로모션 안내',
        channel: 'lms',
        recipientName: '최현우',
        recipientPhone: '010-3333-7777',
        content: '최현우님, 2월 한정 프로모션!\n\n🎉 눈성형 20% 할인\n🎉 코성형 15% 할인\n🎉 리프팅 상담 시 피부관리 1회 무료\n\n예약: 02-1234-5678\n뷰티플 성형외과',
        status: 'failed',
        sentAt: '2026-02-06T15:00:00.000Z',
        createdAt: '2026-02-06T15:00:00.000Z',
      },
    ]

    const sN = ['김소연','박하나','이지현','최서윤','정다은','한예진','오수빈','강유진','윤채원','임서진','송민지','배지영','조은서','신하영','장수정','문예은','양서현','권다인','류하은','남지우']
    const sP = ['010-1111-2222','010-2222-3333','010-3333-4444','010-4444-5555','010-5555-6666','010-6666-7777','010-7777-8888','010-8888-9999','010-1234-1111','010-2345-2222','010-3456-3333','010-4567-4444','010-5678-5555','010-6789-6666','010-7890-7777','010-8901-8888','010-9012-9999','010-1122-3344','010-2233-4455','010-3344-5566']
    const sTplIds = ['TPL-DEMO-001','TPL-DEMO-003','TPL-DEMO-005','TPL-DEMO-007','TPL-DEMO-008','TPL-DEMO-009','TPL-DEMO-010','TPL-DEMO-011','TPL-DEMO-012','TPL-DEMO-013']
    const sTplNames = ['신규 고객 환영 인사','예약 확인 안내','눈성형 시술 후 안내','시술 3일 후 경과 확인','2월 프로모션 안내','리프팅 시술 후 안내','재방문 안내','봄맞이 프로모션','VIP 고객 감사 메시지','수술 전 주의사항 안내']
    const sCh: MessageChannel[] = ['kakao','sms','kakao','sms','lms','kakao','sms','lms','kakao','lms']
    const sSt: SendStatus[] = ['sent','sent','sent','sent','failed','sent','sent','sent','pending','sent','sent','failed','sent','sent','sent','pending','sent','sent','failed','pending']
    const xSends: MessageSendRecord[] = sN.map((name, i) => ({
      id: `SEND-DEMO-${String(i + 6).padStart(3, '0')}`,
      templateId: sTplIds[i % sTplIds.length],
      templateName: sTplNames[i % sTplNames.length],
      channel: sCh[i % sCh.length],
      recipientName: name,
      recipientPhone: sP[i],
      content: `${name}님께 발송된 ${sTplNames[i % sTplNames.length]} 메시지`,
      status: sSt[i],
      sentAt: new Date(2026, 0, 20 + (i % 15), 9 + (i % 9), i * 3).toISOString(),
      createdAt: new Date(2026, 0, 20 + (i % 15), 9 + (i % 9), i * 3).toISOString(),
    }))
    saveSends([...sends, ...xSends])

    const autoSendRules: AutoSendRule[] = [
      { id: 'AUTO-DEMO-001', trigger: 'booking_confirmed' as AutoSendTrigger, templateId: 'TPL-DEMO-003', channel: 'sms' as MessageChannel, isEnabled: true },
      { id: 'AUTO-DEMO-002', trigger: 'booking_reminder_1d' as AutoSendTrigger, templateId: 'TPL-DEMO-004', channel: 'kakao' as MessageChannel, isEnabled: true },
      { id: 'AUTO-DEMO-003', trigger: 'procedure_done' as AutoSendTrigger, templateId: 'TPL-DEMO-005', channel: 'kakao' as MessageChannel, isEnabled: false },
      { id: 'AUTO-DEMO-004', trigger: 'follow_up_3d' as AutoSendTrigger, templateId: 'TPL-DEMO-007', channel: 'sms' as MessageChannel, isEnabled: true },
    ]

    saveAutoSendRules(autoSendRules)
  },
}
