import type {
  Notice,
  NoticePriority,
  NaverBooking,
  NaverSyncStatus,
  PhoneCallRecord,
} from '@/types/operation'

const NOTICE_KEY = 'plastic-hospital-notices'
const NAVER_KEY = 'plastic-hospital-naver-bookings'
const PHONE_KEY = 'plastic-hospital-phone-calls'

function generateNoticeId(): string {
  return `NTC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function getAllNotices(): Notice[] {
  const raw = localStorage.getItem(NOTICE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as Notice[]
}

function saveNotices(notices: Notice[]): void {
  localStorage.setItem(NOTICE_KEY, JSON.stringify(notices))
}

function getAllNaverBookings(): NaverBooking[] {
  const raw = localStorage.getItem(NAVER_KEY)
  if (!raw) return []
  return JSON.parse(raw) as NaverBooking[]
}

function saveNaverBookings(bookings: NaverBooking[]): void {
  localStorage.setItem(NAVER_KEY, JSON.stringify(bookings))
}

function getAllPhoneCalls(): PhoneCallRecord[] {
  const raw = localStorage.getItem(PHONE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as PhoneCallRecord[]
}

function savePhoneCalls(calls: PhoneCallRecord[]): void {
  localStorage.setItem(PHONE_KEY, JSON.stringify(calls))
}

export const operationStorage = {
  // ── Notice CRUD ───────────────────────────────────────

  getNotices(): Notice[] {
    return getAllNotices().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  getNoticeById(id: string): Notice | undefined {
    return getAllNotices().find((n) => n.id === id)
  },

  createNotice(data: {
    title: string
    content: string
    priority: NoticePriority
    author: string
  }): Notice {
    const notices = getAllNotices()
    const now = new Date().toISOString()
    const notice: Notice = {
      ...data,
      id: generateNoticeId(),
      isRead: false,
      createdAt: now,
      updatedAt: now,
    }
    notices.push(notice)
    saveNotices(notices)
    return notice
  },

  updateNotice(
    id: string,
    data: Partial<Pick<Notice, 'title' | 'content' | 'priority' | 'isRead'>>
  ): Notice | undefined {
    const notices = getAllNotices()
    const index = notices.findIndex((n) => n.id === id)
    if (index === -1) return undefined
    notices[index] = {
      ...notices[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    saveNotices(notices)
    return notices[index]
  },

  deleteNotice(id: string): boolean {
    const notices = getAllNotices()
    const filtered = notices.filter((n) => n.id !== id)
    if (filtered.length === notices.length) return false
    saveNotices(filtered)
    return true
  },

  markAsRead(id: string): Notice | undefined {
    return operationStorage.updateNotice(id, { isRead: true })
  },

  // ── Naver Booking Sync (Mock) ─────────────────────────

  getNaverBookings(): NaverBooking[] {
    return getAllNaverBookings().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  syncNaverBooking(id: string): NaverBooking | undefined {
    const bookings = getAllNaverBookings()
    const index = bookings.findIndex((b) => b.id === id)
    if (index === -1) return undefined
    bookings[index].syncStatus = 'synced' as NaverSyncStatus
    bookings[index].syncedAt = new Date().toISOString()
    saveNaverBookings(bookings)
    return bookings[index]
  },

  syncAllNaverBookings(): number {
    const bookings = getAllNaverBookings()
    let count = 0
    const now = new Date().toISOString()
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].syncStatus !== 'synced') {
        bookings[i].syncStatus = 'synced'
        bookings[i].syncedAt = now
        count++
      }
    }
    saveNaverBookings(bookings)
    return count
  },

  // ── Phone Call Records (Mock) ─────────────────────────

  getPhoneCalls(): PhoneCallRecord[] {
    return getAllPhoneCalls().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  addPhoneCall(data: Omit<PhoneCallRecord, 'id' | 'createdAt'>): PhoneCallRecord {
    const calls = getAllPhoneCalls()
    const record: PhoneCallRecord = {
      ...data,
      id: `CALL-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    }
    calls.push(record)
    savePhoneCalls(calls)
    return record
  },

  // ── Demo Data ─────────────────────────────────────────

  seedDemoData(): void {
    if (getAllNotices().length > 0) return

    const notices: Notice[] = [
      {
        id: 'NTC-DEMO-001',
        title: '2월 진료 스케줄 변경 안내',
        content: '2월 10일(월)부터 김태호 원장님의 진료 시간이 10:00~18:00에서 09:00~17:00으로 변경됩니다. 예약 시 참고 부탁드립니다.',
        priority: 'important',
        author: '관리자',
        isRead: false,
        createdAt: '2026-02-01T09:00:00.000Z',
        updatedAt: '2026-02-01T09:00:00.000Z',
      },
      {
        id: 'NTC-DEMO-002',
        title: '설 연휴 휴진 안내',
        content: '2026년 설 연휴 기간(2/16~2/18) 동안 휴진합니다. 2/19(목)부터 정상 진료합니다. 응급 시 02-1234-5678로 연락 바랍니다.',
        priority: 'urgent',
        author: '원장',
        isRead: true,
        createdAt: '2026-01-28T10:00:00.000Z',
        updatedAt: '2026-01-28T10:00:00.000Z',
      },
      {
        id: 'NTC-DEMO-003',
        title: '신규 레이저 장비 도입',
        content: '최신형 피코레이저 장비가 도입되었습니다. 피부 시술 시 활용 가능하며, 자세한 시술 가이드라인은 의료진 미팅에서 안내드리겠습니다.',
        priority: 'normal',
        author: '관리자',
        isRead: false,
        createdAt: '2026-02-03T14:00:00.000Z',
        updatedAt: '2026-02-03T14:00:00.000Z',
      },
      {
        id: 'NTC-DEMO-004',
        title: '직원 교육 일정 안내',
        content: '2월 15일(토) 오후 2시~5시 직원 서비스 교육이 진행됩니다. 전 직원 필수 참석입니다. 장소: 3층 회의실',
        priority: 'important',
        author: '인사팀',
        isRead: false,
        createdAt: '2026-02-05T11:00:00.000Z',
        updatedAt: '2026-02-05T11:00:00.000Z',
      },
    ]

    saveNotices(notices)

    const naverBookings: NaverBooking[] = [
      {
        id: 'NV-DEMO-001',
        naverBookingId: 'NB-2026020601',
        customerName: '김서현',
        customerPhone: '010-4567-8901',
        procedure: '피부시술',
        date: '2026-02-08',
        time: '14:00',
        syncStatus: 'pending',
        syncedAt: null,
        createdAt: '2026-02-06T08:00:00.000Z',
      },
      {
        id: 'NV-DEMO-002',
        naverBookingId: 'NB-2026020602',
        customerName: '이준호',
        customerPhone: '010-5678-9012',
        procedure: '쁘띠성형',
        date: '2026-02-09',
        time: '11:00',
        syncStatus: 'synced',
        syncedAt: '2026-02-06T09:00:00.000Z',
        createdAt: '2026-02-06T07:30:00.000Z',
      },
      {
        id: 'NV-DEMO-003',
        naverBookingId: 'NB-2026020603',
        customerName: '박은지',
        customerPhone: '010-6789-0123',
        procedure: '눈성형',
        date: '2026-02-10',
        time: '10:00',
        syncStatus: 'conflict',
        syncedAt: null,
        createdAt: '2026-02-06T10:00:00.000Z',
      },
      {
        id: 'NV-DEMO-004',
        naverBookingId: 'NB-2026020604',
        customerName: '정우진',
        customerPhone: '010-7890-1234',
        procedure: '코성형',
        date: '2026-02-11',
        time: '15:00',
        syncStatus: 'pending',
        syncedAt: null,
        createdAt: '2026-02-06T11:00:00.000Z',
      },
    ]

    saveNaverBookings(naverBookings)

    const phoneCalls: PhoneCallRecord[] = [
      {
        id: 'CALL-DEMO-001',
        callerPhone: '010-3333-7777',
        callerName: '최현우',
        customerId: null,
        direction: 'inbound',
        duration: '3:24',
        note: '보톡스 재시술 예약 문의',
        createdAt: '2026-02-06T09:15:00.000Z',
      },
      {
        id: 'CALL-DEMO-002',
        callerPhone: '010-1234-5678',
        callerName: '김미영',
        customerId: null,
        direction: 'inbound',
        duration: '1:45',
        note: '예약 시간 변경 요청',
        createdAt: '2026-02-06T10:30:00.000Z',
      },
      {
        id: 'CALL-DEMO-003',
        callerPhone: '010-2222-8888',
        callerName: '강다현',
        customerId: null,
        direction: 'outbound',
        duration: '5:12',
        note: '시술 후 경과 확인 전화',
        createdAt: '2026-02-06T11:00:00.000Z',
      },
      {
        id: 'CALL-DEMO-004',
        callerPhone: '010-0000-1111',
        callerName: null,
        customerId: null,
        direction: 'inbound',
        duration: '0:30',
        note: '부재중',
        createdAt: '2026-02-06T14:00:00.000Z',
      },
    ]

    savePhoneCalls(phoneCalls)
  },
}
