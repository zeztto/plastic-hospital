import type { TimeBlock } from '@/types/schedule'

const TIMEBLOCK_KEY = 'plastic-hospital-timeblocks'

function generateId(): string {
  return `TB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

function getAll(): TimeBlock[] {
  const raw = localStorage.getItem(TIMEBLOCK_KEY)
  if (!raw) return []
  return JSON.parse(raw) as TimeBlock[]
}

function save(blocks: TimeBlock[]): void {
  localStorage.setItem(TIMEBLOCK_KEY, JSON.stringify(blocks))
}

export const scheduleStorage = {
  getAll(): TimeBlock[] {
    return getAll().sort(
      (a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime()
    )
  },

  getByDateRange(startDate: string, endDate: string): TimeBlock[] {
    return getAll().filter((b) => b.date >= startDate && b.date <= endDate)
  },

  getByDoctorAndDate(doctorId: string, date: string): TimeBlock[] {
    return getAll().filter((b) => b.doctorId === doctorId && b.date === date)
  },

  create(data: Omit<TimeBlock, 'id' | 'createdAt'>): TimeBlock {
    const blocks = getAll()
    const newBlock: TimeBlock = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    blocks.push(newBlock)
    save(blocks)
    return newBlock
  },

  delete(id: string): boolean {
    const blocks = getAll()
    const filtered = blocks.filter((b) => b.id !== id)
    if (filtered.length === blocks.length) return false
    save(filtered)
    return true
  },

  isBlocked(doctorId: string, date: string, time: string): TimeBlock | undefined {
    return getAll().find(
      (b) => b.doctorId === doctorId && b.date === date && b.startTime <= time && b.endTime > time
    )
  },

  seedDemoData(): void {
    if (getAll().length > 0) return

    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    const mondayStr = monday.toISOString().split('T')[0]

    const wednesday = new Date(monday)
    wednesday.setDate(monday.getDate() + 2)
    const wednesdayStr = wednesday.toISOString().split('T')[0]

    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)
    const fridayStr = friday.toISOString().split('T')[0]

    const demo: TimeBlock[] = [
      {
        id: 'TB-DEMO-001',
        doctorId: 'doc-1',
        date: mondayStr,
        startTime: '12:00',
        endTime: '13:00',
        reason: '점심시간',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'TB-DEMO-002',
        doctorId: 'doc-2',
        date: wednesdayStr,
        startTime: '09:00',
        endTime: '11:00',
        reason: '학회 참석',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'TB-DEMO-003',
        doctorId: 'doc-3',
        date: fridayStr,
        startTime: '16:00',
        endTime: '18:00',
        reason: '개인 사유',
        createdAt: new Date().toISOString(),
      },
    ]

    save(demo)
  },
}
