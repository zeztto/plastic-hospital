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

    const ntcData: Array<{ title: string; content: string; priority: NoticePriority; author: string; isRead: boolean }> = [
      { title: '3월 휴진 안내 (개원기념일)', content: '3월 15일(토)은 개원기념일로 휴진합니다. 3월 16일(일) 정상 진료합니다. 양해 부탁드립니다.', priority: 'important', author: '관리자', isRead: false },
      { title: '소독 장비 정기 점검 안내', content: '2월 20일(목) 오전 소독 장비 정기 점검이 예정되어 있습니다. 오전 시술 시 일회용 소독키트를 사용해 주세요.', priority: 'normal', author: '시설관리팀', isRead: true },
      { title: '신규 간호사 채용 공고', content: '성형외과 경력 2년 이상 간호사를 모집합니다. 관심 있는 분은 인사팀으로 연락 바랍니다. 접수 마감: 2/28', priority: 'normal', author: '인사팀', isRead: false },
      { title: '의료 폐기물 처리 규정 변경', content: '2026년 3월부터 의료 폐기물 분리 기준이 강화됩니다. 첨부된 가이드라인을 숙지해 주세요. 교육 일정은 추후 공지.', priority: 'important', author: '의료팀', isRead: false },
      { title: '2월 원내 세미나 안내', content: '2월 22일(토) 오후 3시 "최신 리프팅 트렌드" 세미나가 진행됩니다. 강사: 이서연 원장. 장소: 4층 세미나실. 전 의료진 필수 참석.', priority: 'important', author: '원장', isRead: true },
      { title: '환자 개인정보 보호 교육 안내', content: '개인정보보호법 개정에 따라 전 직원 대상 교육을 실시합니다. 2월 25일(화) 오후 2시, 3층 회의실. 미참석 시 개별 교육 예정.', priority: 'urgent', author: '관리자', isRead: false },
      { title: '주차장 공사 안내', content: '2월 17일~21일 주차장 보수 공사가 진행됩니다. 이 기간 동안 인근 공영주차장 이용을 안내해 주세요. 주차비 지원 가능.', priority: 'normal', author: '시설관리팀', isRead: true },
      { title: '3월 프로모션 기획 회의', content: '3월 봄맞이 프로모션 기획 회의를 2월 18일(화) 오전 11시에 진행합니다. 마케팅팀 + 원장님 참석. 아이디어 사전 제출 바랍니다.', priority: 'normal', author: '마케팅팀', isRead: false },
      { title: '응급 환자 대응 매뉴얼 업데이트', content: '응급 상황 대응 매뉴얼이 업데이트되었습니다. 모든 의료진은 새 매뉴얼을 숙지해 주세요. 파일은 공유폴더에 업로드 완료.', priority: 'urgent', author: '의료팀', isRead: false },
      { title: 'CCTV 시스템 업그레이드 완료', content: 'CCTV 시스템이 4K 고해상도로 업그레이드되었습니다. 모니터링 화면 접속 방법은 시설관리팀에 문의하세요.', priority: 'normal', author: '시설관리팀', isRead: true },
    ]
    const xNotices: Notice[] = ntcData.map((d, i) => ({
      ...d,
      id: `NTC-DEMO-${String(i + 5).padStart(3, '0')}`,
      createdAt: new Date(2026, 0, 25 + (i % 12), 9 + (i % 8), 0).toISOString(),
      updatedAt: new Date(2026, 0, 25 + (i % 12), 9 + (i % 8), 0).toISOString(),
    }))
    saveNotices([...notices, ...xNotices])

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

    const nvN = ['서지원','강민주','윤하린','조영서','임수현','백서영','허다은','손예진','구민서','피지혜']
    const nvP = ['010-1212-3434','010-2323-4545','010-3434-5656','010-4545-6767','010-5656-7878','010-6767-8989','010-7878-9090','010-8989-0101','010-9191-0202','010-0202-1313']
    const nvPr = ['눈성형','코성형','피부시술','리프팅','쁘띠성형','안면윤곽','지방흡입','가슴성형','눈성형','피부시술']
    const nvSt: NaverSyncStatus[] = ['synced','pending','pending','synced','pending','conflict','pending','synced','conflict','pending']
    const xNaver: NaverBooking[] = nvN.map((name, i) => ({
      id: `NV-DEMO-${String(i + 5).padStart(3, '0')}`,
      naverBookingId: `NB-20260210${String(i + 5).padStart(2, '0')}`,
      customerName: name,
      customerPhone: nvP[i],
      procedure: nvPr[i],
      date: new Date(2026, 1, 10 + (i % 14)).toISOString().split('T')[0],
      time: `${String(9 + (i % 8)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
      syncStatus: nvSt[i],
      syncedAt: nvSt[i] === 'synced' ? new Date(2026, 1, 10 + (i % 14), 10, 0).toISOString() : null,
      createdAt: new Date(2026, 1, 9 + (i % 12), 7 + (i % 5), 0).toISOString(),
    }))
    saveNaverBookings([...naverBookings, ...xNaver])

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

    const callData: Array<{ phone: string; name: string | null; direction: 'inbound' | 'outbound'; duration: string; note: string }> = [
      { phone: '010-1111-2222', name: '김소연', direction: 'inbound', duration: '2:15', note: '쌍꺼풀 수술 상담 문의' },
      { phone: '010-3333-4444', name: '이지현', direction: 'inbound', duration: '4:30', note: '코성형 비용 문의' },
      { phone: '010-5555-6666', name: '정다은', direction: 'outbound', duration: '3:10', note: '시술 후 2주차 경과 확인' },
      { phone: '010-7777-8888', name: '오수빈', direction: 'inbound', duration: '1:45', note: '예약 시간 변경 요청' },
      { phone: '010-9876-5432', name: '박지수', direction: 'outbound', duration: '2:50', note: '다음 시술 일정 안내' },
      { phone: '010-0101-2323', name: null, direction: 'inbound', duration: '0:45', note: '진료 시간 문의 (신규)' },
      { phone: '010-8888-9999', name: '강유진', direction: 'inbound', duration: '5:20', note: '리프팅 시술 종류 문의' },
      { phone: '010-4567-4444', name: '배지영', direction: 'outbound', duration: '1:30', note: '예약 확인 전화' },
      { phone: '010-3232-5454', name: null, direction: 'inbound', duration: '0:20', note: '부재중 (콜백 필요)' },
      { phone: '010-1234-1111', name: '윤채원', direction: 'inbound', duration: '6:10', note: '안면윤곽 수술 상세 상담' },
      { phone: '010-6677-8899', name: '고은별', direction: 'outbound', duration: '2:00', note: '시술 3일 후 경과 확인 전화' },
      { phone: '010-7676-8787', name: null, direction: 'inbound', duration: '1:10', note: '주차 안내 문의' },
      { phone: '010-2345-2222', name: '임서진', direction: 'outbound', duration: '3:45', note: '피부시술 후 관리 안내' },
    ]
    const xCalls: PhoneCallRecord[] = callData.map((d, i) => ({
      id: `CALL-DEMO-${String(i + 5).padStart(3, '0')}`,
      callerPhone: d.phone,
      callerName: d.name,
      customerId: null,
      direction: d.direction,
      duration: d.duration,
      note: d.note,
      createdAt: new Date(2026, 1, 3 + (i % 7), 9 + (i % 9), i * 5).toISOString(),
    }))
    savePhoneCalls([...phoneCalls, ...xCalls])
  },
}
