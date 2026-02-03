export interface ScheduleDoctor {
  id: string
  name: string
  specialty: string
  color: string
}

export interface TimeBlock {
  id: string
  doctorId: string
  date: string
  startTime: string
  endTime: string
  reason: string
  createdAt: string
}

export const SCHEDULE_DOCTORS: ScheduleDoctor[] = [
  { id: 'doc-1', name: '김태호 원장', specialty: '눈·코성형', color: '#3B82F6' },
  { id: 'doc-2', name: '이서연 원장', specialty: '안면윤곽·리프팅', color: '#8B5CF6' },
  { id: 'doc-3', name: '박준혁 원장', specialty: '가슴·체형', color: '#10B981' },
  { id: 'doc-4', name: '최민지 원장', specialty: '피부·쁘띠', color: '#F59E0B' },
]

export const SCHEDULE_TIME_SLOTS = [
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00',
] as const
