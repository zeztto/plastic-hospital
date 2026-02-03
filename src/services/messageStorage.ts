import type {
  MessageTemplate,
  TemplateCategory,
  MessageChannel,
  MessageSendRecord,
  SendStatus,
  AutoSendRule,
  AutoSendTrigger,
} from '@/types/message'

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
  const raw = localStorage.getItem(TEMPLATE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as MessageTemplate[]
}

function saveTemplates(templates: MessageTemplate[]): void {
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify(templates))
}

function getAllSends(): MessageSendRecord[] {
  const raw = localStorage.getItem(SEND_KEY)
  if (!raw) return []
  return JSON.parse(raw) as MessageSendRecord[]
}

function saveSends(sends: MessageSendRecord[]): void {
  localStorage.setItem(SEND_KEY, JSON.stringify(sends))
}

function getAllAutoSendRules(): AutoSendRule[] {
  const raw = localStorage.getItem(AUTOSEND_KEY)
  if (!raw) return []
  return JSON.parse(raw) as AutoSendRule[]
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

    saveTemplates(templates)

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

    saveSends(sends)

    const autoSendRules: AutoSendRule[] = [
      { id: 'AUTO-DEMO-001', trigger: 'booking_confirmed' as AutoSendTrigger, templateId: 'TPL-DEMO-003', channel: 'sms' as MessageChannel, isEnabled: true },
      { id: 'AUTO-DEMO-002', trigger: 'booking_reminder_1d' as AutoSendTrigger, templateId: 'TPL-DEMO-004', channel: 'kakao' as MessageChannel, isEnabled: true },
      { id: 'AUTO-DEMO-003', trigger: 'procedure_done' as AutoSendTrigger, templateId: 'TPL-DEMO-005', channel: 'kakao' as MessageChannel, isEnabled: false },
      { id: 'AUTO-DEMO-004', trigger: 'follow_up_3d' as AutoSendTrigger, templateId: 'TPL-DEMO-007', channel: 'sms' as MessageChannel, isEnabled: true },
    ]

    saveAutoSendRules(autoSendRules)
  },
}
