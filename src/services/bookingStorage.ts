import type {
  Booking,
  BookingFormData,
  BookingStatus,
  JourneyStage,
  AcquisitionSource,
} from '@/types/booking'

const STORAGE_KEY = 'plastic-hospital-bookings'

function generateId(): string {
  return `BK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function getAll(): Booking[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as Booking[]
}

function save(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

export const bookingStorage = {
  getAll(): Booking[] {
    return getAll().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  getById(id: string): Booking | undefined {
    return getAll().find((b) => b.id === id)
  },

  create(data: BookingFormData): Booking {
    const bookings = getAll()
    const now = new Date().toISOString()
    const newBooking: Booking = {
      ...data,
      id: generateId(),
      status: 'pending',
      createdAt: now,
      memo: '',
      journeyStage: 'inquiry',
      journeyHistory: [{ stage: 'inquiry', timestamp: now }],
    }
    bookings.push(newBooking)
    save(bookings)
    return newBooking
  },

  updateStatus(id: string, status: BookingStatus): Booking | undefined {
    const bookings = getAll()
    const index = bookings.findIndex((b) => b.id === id)
    if (index === -1) return undefined
    bookings[index].status = status
    save(bookings)
    return bookings[index]
  },

  updateMemo(id: string, memo: string): Booking | undefined {
    const bookings = getAll()
    const index = bookings.findIndex((b) => b.id === id)
    if (index === -1) return undefined
    bookings[index].memo = memo
    save(bookings)
    return bookings[index]
  },

  updateJourneyStage(id: string, stage: JourneyStage, note?: string): Booking | undefined {
    const bookings = getAll()
    const index = bookings.findIndex((b) => b.id === id)
    if (index === -1) return undefined
    bookings[index].journeyStage = stage
    bookings[index].journeyHistory = [
      ...(bookings[index].journeyHistory || []),
      { stage, timestamp: new Date().toISOString(), note },
    ]
    save(bookings)
    return bookings[index]
  },

  delete(id: string): boolean {
    const bookings = getAll()
    const filtered = bookings.filter((b) => b.id !== id)
    if (filtered.length === bookings.length) return false
    save(filtered)
    return true
  },

  getByDate(date: string): Booking[] {
    return getAll().filter((b) => b.date === date)
  },

  getByStatus(status: BookingStatus): Booking[] {
    return getAll().filter((b) => b.status === status)
  },

  getBySource(source: AcquisitionSource): Booking[] {
    return getAll().filter((b) => b.source === source)
  },

  getStats() {
    const all = getAll()
    const today = new Date().toISOString().split('T')[0]
    const todayBookings = all.filter((b) => b.date === today)

    return {
      total: all.length,
      pending: all.filter((b) => b.status === 'pending').length,
      confirmed: all.filter((b) => b.status === 'confirmed').length,
      completed: all.filter((b) => b.status === 'completed').length,
      cancelled: all.filter((b) => b.status === 'cancelled').length,
      todayTotal: todayBookings.length,
      todayPending: todayBookings.filter((b) => b.status === 'pending').length,
    }
  },

  getMarketingStats() {
    const all = getAll()
    const nonCancelled = all.filter((b) => b.status !== 'cancelled')

    const sourceCount: Partial<Record<AcquisitionSource, number>> = {}
    for (const b of all) {
      if (b.source) {
        sourceCount[b.source] = (sourceCount[b.source] || 0) + 1
      }
    }

    const journeyCount: Partial<Record<JourneyStage, number>> = {}
    for (const b of nonCancelled) {
      if (b.journeyStage) {
        journeyCount[b.journeyStage] = (journeyCount[b.journeyStage] || 0) + 1
      }
    }

    const campaignMap: Record<string, { total: number; converted: number }> = {}
    for (const b of all) {
      if (b.campaign) {
        if (!campaignMap[b.campaign]) {
          campaignMap[b.campaign] = { total: 0, converted: 0 }
        }
        campaignMap[b.campaign].total++
        if (b.status === 'completed' || b.journeyStage === 'procedure_done' || b.journeyStage === 'follow_up' || b.journeyStage === 'retention') {
          campaignMap[b.campaign].converted++
        }
      }
    }

    const topSource = Object.entries(sourceCount).sort(([, a], [, b]) => b - a)[0]
    const completedCount = all.filter(
      (b) =>
        b.journeyStage === 'procedure_done' ||
        b.journeyStage === 'follow_up' ||
        b.journeyStage === 'retention'
    ).length
    const conversionRate = nonCancelled.length > 0 ? (completedCount / nonCancelled.length) * 100 : 0

    return {
      sourceCount,
      journeyCount,
      campaignMap,
      topSource: topSource ? (topSource[0] as AcquisitionSource) : null,
      conversionRate: Math.round(conversionRate * 10) / 10,
      totalLeads: all.length,
      convertedLeads: completedCount,
    }
  },

  seedDemoData(): void {
    if (getAll().length > 0) return

    const demoBookings: Booking[] = [
      {
        id: 'BK-DEMO-001',
        name: '김미영',
        phone: '010-1234-5678',
        procedure: '눈성형',
        date: '2026-02-06',
        time: '10:00',
        message: '자연유착 쌍꺼풀 상담 원합니다.',
        status: 'confirmed',
        createdAt: '2026-02-04T09:00:00.000Z',
        memo: '첫 상담 고객, 자연유착 희망',
        source: 'instagram',
        medium: 'social',
        campaign: '2월_눈성형_프로모션',
        journeyStage: 'consultation',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-04T09:00:00.000Z' },
          { stage: 'consultation', timestamp: '2026-02-05T10:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-002',
        name: '박지수',
        phone: '010-9876-5432',
        procedure: '코성형',
        date: '2026-02-06',
        time: '11:00',
        message: '콧대 높이는 수술 상담받고 싶어요.',
        status: 'pending',
        createdAt: '2026-02-05T14:30:00.000Z',
        memo: '',
        source: 'naver',
        medium: 'search',
        campaign: '네이버_코성형_검색광고',
        journeyStage: 'inquiry',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-05T14:30:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-003',
        name: '이수진',
        phone: '010-5555-1234',
        procedure: '리프팅',
        date: '2026-02-07',
        time: '14:00',
        message: '실리프팅 가격과 시술 시간이 궁금합니다.',
        status: 'pending',
        createdAt: '2026-02-05T16:00:00.000Z',
        memo: '',
        source: 'youtube',
        medium: 'video',
        campaign: '유튜브_리프팅_후기영상',
        journeyStage: 'inquiry',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-05T16:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-004',
        name: '최현우',
        phone: '010-3333-7777',
        procedure: '피부시술',
        date: '2026-02-06',
        time: '15:30',
        message: '보톡스 시술 상담 예약합니다.',
        status: 'confirmed',
        createdAt: '2026-02-03T11:00:00.000Z',
        memo: '기존 고객, 3회차 방문',
        source: 'kakao',
        medium: 'message',
        campaign: '',
        journeyStage: 'retention',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-01-10T09:00:00.000Z' },
          { stage: 'consultation', timestamp: '2026-01-12T10:00:00.000Z' },
          { stage: 'procedure_scheduled', timestamp: '2026-01-13T11:00:00.000Z' },
          { stage: 'procedure_done', timestamp: '2026-01-15T14:00:00.000Z' },
          { stage: 'follow_up', timestamp: '2026-01-25T10:00:00.000Z' },
          { stage: 'retention', timestamp: '2026-02-03T11:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-005',
        name: '정예린',
        phone: '010-8888-2222',
        procedure: '안면윤곽',
        date: '2026-02-05',
        time: '10:30',
        message: '광대 축소 수술 상담받고 싶습니다.',
        status: 'completed',
        createdAt: '2026-02-01T10:00:00.000Z',
        memo: '상담 완료, 수술 일정 2/15 확정',
        source: 'referral',
        medium: 'word_of_mouth',
        campaign: '',
        journeyStage: 'procedure_scheduled',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-01T10:00:00.000Z' },
          { stage: 'consultation', timestamp: '2026-02-05T10:30:00.000Z' },
          { stage: 'procedure_scheduled', timestamp: '2026-02-05T11:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-006',
        name: '한소희',
        phone: '010-7777-3333',
        procedure: '쁘띠성형',
        date: '2026-02-04',
        time: '16:00',
        message: '필러 시술 관련 상담 부탁드립니다.',
        status: 'cancelled',
        createdAt: '2026-02-02T08:00:00.000Z',
        memo: '고객 사정으로 취소',
        source: 'blog',
        medium: 'content',
        campaign: '블로그_필러_후기',
        journeyStage: 'inquiry',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-02T08:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-007',
        name: '오민서',
        phone: '010-4444-6666',
        procedure: '눈성형',
        date: '2026-02-08',
        time: '13:00',
        message: '눈밑지방 재배치 상담 원합니다.',
        status: 'pending',
        createdAt: '2026-02-06T07:30:00.000Z',
        memo: '',
        source: 'ad',
        medium: 'display',
        campaign: '2월_눈성형_프로모션',
        journeyStage: 'inquiry',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-06T07:30:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-008',
        name: '강다현',
        phone: '010-2222-8888',
        procedure: '코성형',
        date: '2026-02-03',
        time: '11:00',
        message: '매부리코 교정 상담 원합니다.',
        status: 'completed',
        createdAt: '2026-01-28T09:00:00.000Z',
        memo: '시술 완료, 경과 관찰 중',
        source: 'naver',
        medium: 'search',
        campaign: '네이버_코성형_검색광고',
        journeyStage: 'follow_up',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-01-28T09:00:00.000Z' },
          { stage: 'consultation', timestamp: '2026-01-29T11:00:00.000Z' },
          { stage: 'procedure_scheduled', timestamp: '2026-01-30T10:00:00.000Z' },
          { stage: 'procedure_done', timestamp: '2026-02-03T11:00:00.000Z' },
          { stage: 'follow_up', timestamp: '2026-02-05T10:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-009',
        name: '윤서연',
        phone: '010-1111-9999',
        procedure: '가슴성형',
        date: '2026-02-10',
        time: '14:00',
        message: '가슴확대 상담 예약합니다.',
        status: 'confirmed',
        createdAt: '2026-02-06T10:00:00.000Z',
        memo: '',
        source: 'instagram',
        medium: 'social',
        campaign: '인스타_2월_이벤트',
        journeyStage: 'consultation',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-06T10:00:00.000Z' },
          { stage: 'consultation', timestamp: '2026-02-07T14:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-010',
        name: '임지호',
        phone: '010-6666-4444',
        procedure: '지방흡입',
        date: '2026-02-09',
        time: '10:00',
        message: '복부 지방흡입 비용 문의합니다.',
        status: 'pending',
        createdAt: '2026-02-06T12:00:00.000Z',
        memo: '',
        source: 'walk_in',
        medium: 'direct',
        campaign: '',
        journeyStage: 'inquiry',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-06T12:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-011',
        name: '송하늘',
        phone: '010-5555-7777',
        procedure: '리프팅',
        date: '2026-02-04',
        time: '15:00',
        message: '울쎄라 리프팅 상담 부탁합니다.',
        status: 'completed',
        createdAt: '2026-01-25T10:00:00.000Z',
        memo: '시술 완료, 만족도 높음',
        source: 'naver',
        medium: 'search',
        campaign: '',
        journeyStage: 'procedure_done',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-01-25T10:00:00.000Z' },
          { stage: 'consultation', timestamp: '2026-01-27T15:00:00.000Z' },
          { stage: 'procedure_scheduled', timestamp: '2026-01-28T10:00:00.000Z' },
          { stage: 'procedure_done', timestamp: '2026-02-04T15:00:00.000Z' },
        ],
      },
      {
        id: 'BK-DEMO-012',
        name: '배수아',
        phone: '010-3333-1111',
        procedure: '피부시술',
        date: '2026-02-11',
        time: '16:30',
        message: '레이저 토닝 가격 문의합니다.',
        status: 'pending',
        createdAt: '2026-02-06T14:00:00.000Z',
        memo: '',
        source: 'kakao',
        medium: 'message',
        campaign: '카카오_피부시술_할인',
        journeyStage: 'inquiry',
        journeyHistory: [
          { stage: 'inquiry', timestamp: '2026-02-06T14:00:00.000Z' },
        ],
      },
    ]

    save(demoBookings)
  },
}
