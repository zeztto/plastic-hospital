import type { Booking, BookingFormData, BookingStatus } from '@/types/booking'

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
    const newBooking: Booking = {
      ...data,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      memo: '',
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
      },
    ]

    save(demoBookings)
  },
}
