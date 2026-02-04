import type {
  Customer,
  CustomerGrade,
  CustomerMemo,
  MemoType,
  FollowUpTask,
  FollowUpStatus,
  FollowUpType,
} from '@/types/customer'
import type { Booking } from '@/types/booking'
import { safeParse } from '@/lib/safeStorage'

const CUSTOMER_KEY = 'plastic-hospital-customers'
const FOLLOWUP_KEY = 'plastic-hospital-followups'

function generateCustomerId(): string {
  return `CUS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function generateMemoId(): string {
  return `MEMO-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function generateFollowUpId(): string {
  return `FU-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function getAllCustomers(): Customer[] {
  return safeParse<Customer>(CUSTOMER_KEY, [])
}

function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers))
}

function getAllFollowUps(): FollowUpTask[] {
  return safeParse<FollowUpTask>(FOLLOWUP_KEY, [])
}

function saveFollowUps(followUps: FollowUpTask[]): void {
  localStorage.setItem(FOLLOWUP_KEY, JSON.stringify(followUps))
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

export const customerStorage = {
  // ── Customer CRUD ──────────────────────────────────────

  getAll(): Customer[] {
    return getAllCustomers().sort(
      (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    )
  },

  getById(id: string): Customer | undefined {
    return getAllCustomers().find((c) => c.id === id)
  },

  getByPhone(phone: string): Customer | undefined {
    return getAllCustomers().find((c) => c.phone === phone)
  },

  saveCustomer(customer: Customer): void {
    const customers = getAllCustomers()
    const index = customers.findIndex((c) => c.id === customer.id)
    if (index === -1) {
      customers.push(customer)
    } else {
      customers[index] = customer
    }
    saveCustomers(customers)
  },

  updateGrade(id: string, grade: CustomerGrade): Customer | undefined {
    const customers = getAllCustomers()
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return undefined
    customers[index].grade = grade
    saveCustomers(customers)
    return customers[index]
  },

  addMemo(id: string, memo: { content: string; type: MemoType }): Customer | undefined {
    const customers = getAllCustomers()
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return undefined
    const newMemo: CustomerMemo = {
      id: generateMemoId(),
      content: memo.content,
      type: memo.type,
      createdAt: new Date().toISOString(),
    }
    customers[index].memos = [newMemo, ...customers[index].memos]
    saveCustomers(customers)
    return customers[index]
  },

  deleteMemo(customerId: string, memoId: string): Customer | undefined {
    const customers = getAllCustomers()
    const index = customers.findIndex((c) => c.id === customerId)
    if (index === -1) return undefined
    customers[index].memos = customers[index].memos.filter((m) => m.id !== memoId)
    saveCustomers(customers)
    return customers[index]
  },

  addTag(id: string, tag: string): Customer | undefined {
    const customers = getAllCustomers()
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return undefined
    if (!customers[index].tags.includes(tag)) {
      customers[index].tags = [...customers[index].tags, tag]
      saveCustomers(customers)
    }
    return customers[index]
  },

  removeTag(id: string, tag: string): Customer | undefined {
    const customers = getAllCustomers()
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return undefined
    customers[index].tags = customers[index].tags.filter((t) => t !== tag)
    saveCustomers(customers)
    return customers[index]
  },

  // ── Sync from bookings ────────────────────────────────

  syncFromBookings(bookings: Booking[]): void {
    const existing = getAllCustomers()
    const existingByPhone = new Map(existing.map((c) => [c.phone, c]))

    const byPhone = new Map<string, Booking[]>()
    for (const b of bookings) {
      const group = byPhone.get(b.phone) || []
      group.push(b)
      byPhone.set(b.phone, group)
    }

    const updated: Customer[] = []

    for (const [phone, phoneBookings] of byPhone) {
      const sorted = [...phoneBookings].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      const latest = sorted[0]
      const earliest = sorted[sorted.length - 1]
      const completedBookings = phoneBookings.filter(
        (b) =>
          b.status === 'completed' ||
          b.journeyStage === 'procedure_done' ||
          b.journeyStage === 'follow_up' ||
          b.journeyStage === 'retention'
      )
      const lastCompleted = completedBookings.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]

      const existingCustomer = existingByPhone.get(phone)

      if (existingCustomer) {
        existingCustomer.name = latest.name
        existingCustomer.bookingIds = phoneBookings.map((b) => b.id)
        existingCustomer.totalVisits = completedBookings.length
        existingCustomer.lastVisitDate = lastCompleted ? lastCompleted.date : null
        updated.push(existingCustomer)
        existingByPhone.delete(phone)
      } else {
        updated.push({
          id: generateCustomerId(),
          name: latest.name,
          phone,
          grade: 'new',
          tags: [],
          memos: [],
          bookingIds: phoneBookings.map((b) => b.id),
          totalVisits: completedBookings.length,
          lastVisitDate: lastCompleted ? lastCompleted.date : null,
          registeredAt: earliest.createdAt,
        })
      }
    }

    for (const remaining of existingByPhone.values()) {
      updated.push(remaining)
    }

    saveCustomers(updated)
  },

  // ── Follow-up CRUD ────────────────────────────────────

  getFollowUps(): FollowUpTask[] {
    return getAllFollowUps().sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
  },

  getFollowUpsByCustomer(customerId: string): FollowUpTask[] {
    return getAllFollowUps()
      .filter((f) => f.customerId === customerId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  },

  getPendingFollowUps(): FollowUpTask[] {
    return getAllFollowUps()
      .filter((f) => f.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  },

  updateFollowUpStatus(
    id: string,
    status: FollowUpStatus,
    note?: string
  ): FollowUpTask | undefined {
    const followUps = getAllFollowUps()
    const index = followUps.findIndex((f) => f.id === id)
    if (index === -1) return undefined
    followUps[index].status = status
    if (note !== undefined) {
      followUps[index].note = note
    }
    saveFollowUps(followUps)
    return followUps[index]
  },

  // ── Auto-generate follow-ups ──────────────────────────

  generateFollowUps(bookings: Booking[]): void {
    const customers = getAllCustomers()
    const phoneToCustomer = new Map(customers.map((c) => [c.phone, c]))
    const existing = getAllFollowUps()
    const newFollowUps: FollowUpTask[] = [...existing]

    const hasFollowUp = (bookingId: string, reason: string): boolean =>
      existing.some((f) => f.bookingId === bookingId && f.reason === reason)

    for (const booking of bookings) {
      if (booking.status === 'cancelled') continue
      const customer = phoneToCustomer.get(booking.phone)
      if (!customer) continue

      const lastEvent = booking.journeyHistory[booking.journeyHistory.length - 1]
      if (!lastEvent) continue

      // Procedure done → 3-day post-op check
      if (
        booking.journeyStage === 'procedure_done' &&
        !hasFollowUp(booking.id, '시술 후 경과 확인')
      ) {
        const doneEvent = booking.journeyHistory.find((e) => e.stage === 'procedure_done')
        if (doneEvent) {
          newFollowUps.push({
            id: generateFollowUpId(),
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            type: 'call' as FollowUpType,
            reason: '시술 후 경과 확인',
            dueDate: addDays(doneEvent.timestamp, 3),
            status: 'pending',
            note: '',
            bookingId: booking.id,
            createdAt: new Date().toISOString(),
          })
        }
      }

      // Follow-up stage → 14-day revisit reminder
      if (
        booking.journeyStage === 'follow_up' &&
        !hasFollowUp(booking.id, '재방문 안내')
      ) {
        const followUpEvent = booking.journeyHistory.find((e) => e.stage === 'follow_up')
        if (followUpEvent) {
          newFollowUps.push({
            id: generateFollowUpId(),
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            type: 'sms' as FollowUpType,
            reason: '재방문 안내',
            dueDate: addDays(followUpEvent.timestamp, 14),
            status: 'pending',
            note: '',
            bookingId: booking.id,
            createdAt: new Date().toISOString(),
          })
        }
      }

      // Consultation → 7-day decision check
      if (
        booking.journeyStage === 'consultation' &&
        !hasFollowUp(booking.id, '상담 후 시술 결정 확인')
      ) {
        const consultEvent = booking.journeyHistory.find((e) => e.stage === 'consultation')
        if (consultEvent) {
          newFollowUps.push({
            id: generateFollowUpId(),
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            type: 'call' as FollowUpType,
            reason: '상담 후 시술 결정 확인',
            dueDate: addDays(consultEvent.timestamp, 7),
            status: 'pending',
            note: '',
            bookingId: booking.id,
            createdAt: new Date().toISOString(),
          })
        }
      }
    }

    saveFollowUps(newFollowUps)
  },

  // ── Demo data ─────────────────────────────────────────

  seedDemoData(bookings: Booking[]): void {
    if (getAllCustomers().length > 0) return

    customerStorage.syncFromBookings(bookings)

    const customers = getAllCustomers()

    const vipPhones = ['010-3333-7777', '010-1111-2222', '010-3333-4444']
    const goldPhones = ['010-2222-8888', '010-8888-2222', '010-2222-3333', '010-5555-6666', '010-7777-8888', '010-1234-1111', '010-4567-4444', '010-6789-6666']
    const silverPhones = ['010-5555-7777', '010-4444-5555', '010-6666-7777', '010-8888-9999', '010-2345-2222', '010-3456-3333', '010-7890-7777', '010-8901-8888', '010-9012-9999', '010-1122-3344']

    const vipSet = new Set(vipPhones)
    const goldSet = new Set(goldPhones)
    const silverSet = new Set(silverPhones)

    for (const c of customers) {
      if (vipSet.has(c.phone)) c.grade = 'vip'
      else if (goldSet.has(c.phone)) c.grade = 'gold'
      else if (silverSet.has(c.phone)) c.grade = 'silver'
      else if (c.totalVisits > 0) c.grade = 'normal'
    }

    const choi = customers.find((c) => c.phone === '010-3333-7777')
    if (choi) {
      choi.memos = [{ id: 'MEMO-DEMO-001', content: '3회차 방문 고객, 항상 정시 방문', type: 'reception' as MemoType, createdAt: '2026-02-03T11:00:00.000Z' }]
      choi.tags = ['보톡스', '재방문', 'VIP']
    }

    const kang = customers.find((c) => c.phone === '010-2222-8888')
    if (kang) {
      kang.memos = [{ id: 'MEMO-DEMO-002', content: '코 교정 후 경과 좋음, 추가 시술 관심 있음', type: 'consultation' as MemoType, createdAt: '2026-02-05T10:00:00.000Z' }]
      kang.tags = ['코성형', '경과관찰']
    }

    const jung = customers.find((c) => c.phone === '010-8888-2222')
    if (jung) { jung.tags = ['안면윤곽', '수술예정'] }

    const kimSoyeon = customers.find((c) => c.phone === '010-1111-2222')
    if (kimSoyeon) {
      kimSoyeon.tags = ['눈성형', '재방문', 'VIP', '소개고객']
      kimSoyeon.memos = [{ id: 'MEMO-DEMO-003', content: '지인 3명 소개한 우수 고객. 항상 친절하고 시간 약속 잘 지킴.', type: 'reception' as MemoType, createdAt: '2026-01-15T10:00:00.000Z' }]
    }

    const leeJihyun = customers.find((c) => c.phone === '010-3333-4444')
    if (leeJihyun) {
      leeJihyun.tags = ['코성형', '리프팅', 'VIP', '고액시술']
      leeJihyun.memos = [{ id: 'MEMO-DEMO-004', content: '코성형 + 리프팅 동시 시술 고객. 시술 결과 매우 만족. 추가 시술 관심.', type: 'consultation' as MemoType, createdAt: '2026-01-20T14:00:00.000Z' }]
    }

    const tagAssignments: Array<[string, string[]]> = [
      ['010-2222-3333', ['코성형', '경과좋음']],
      ['010-5555-6666', ['리프팅', '정기방문']],
      ['010-7777-8888', ['가슴성형', '상담완료']],
      ['010-1234-1111', ['안면윤곽', '수술예정']],
      ['010-4444-5555', ['피부시술']],
      ['010-6666-7777', ['쁘띠성형', '보톡스']],
      ['010-8888-9999', ['눈성형']],
      ['010-2345-2222', ['지방흡입', '상담중']],
      ['010-3456-3333', ['피부시술', '레이저']],
      ['010-4567-4444', ['코성형', '재방문']],
      ['010-6789-6666', ['눈성형', '만족고객']],
      ['010-7890-7777', ['리프팅']],
      ['010-8901-8888', ['안면윤곽']],
      ['010-9012-9999', ['가슴성형', '상담중']],
      ['010-1122-3344', ['피부시술', '정기관리']],
    ]
    for (const [phone, tags] of tagAssignments) {
      const c = customers.find((cst) => cst.phone === phone)
      if (c) c.tags = tags
    }

    saveCustomers(customers)

    customerStorage.generateFollowUps(bookings)
  },
}
