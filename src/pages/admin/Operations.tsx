import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { operationStorage } from '@/services/operationStorage'
import { useCustomers } from '@/contexts/CustomerContext'
import {
  NOTICE_PRIORITY_LABELS, NOTICE_PRIORITY_COLORS,
  NAVER_SYNC_STATUS_LABELS, NAVER_SYNC_STATUS_COLORS,
  CALL_DIRECTION_LABELS,
  type NoticePriority, type Notice, type NaverBooking, type PhoneCallRecord,
} from '@/types/operation'
import {
  Megaphone, Phone, Globe, Plus, Pencil, Trash2,
  CheckCircle, RefreshCw, PhoneIncoming, PhoneOutgoing, User,
} from 'lucide-react'
import { toast } from 'sonner'

function NoticesTab() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Notice | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'normal' as NoticePriority,
    author: '관리자',
  })

  const refresh = () => setNotices(operationStorage.getNotices())

  useEffect(() => {
    operationStorage.seedDemoData()
    refresh()
  }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm({ title: '', content: '', priority: 'normal', author: '관리자' })
    setDialogOpen(true)
  }

  const openEdit = (notice: Notice) => {
    setEditTarget(notice)
    setForm({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      author: notice.author,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('제목과 내용을 입력해주세요.')
      return
    }
    if (editTarget) {
      operationStorage.updateNotice(editTarget.id, form)
      toast.success('공지사항이 수정되었습니다.')
    } else {
      operationStorage.createNotice(form)
      toast.success('공지사항이 등록되었습니다.')
    }
    setDialogOpen(false)
    refresh()
  }

  const handleDelete = () => {
    if (deleteTarget) {
      operationStorage.deleteNotice(deleteTarget.id)
      setDeleteTarget(null)
      toast.success('공지사항이 삭제되었습니다.')
      refresh()
    }
  }

  const handleToggleExpand = (notice: Notice) => {
    if (!notice.isRead) {
      operationStorage.markAsRead(notice.id)
      refresh()
    }
    setExpandedId(expandedId === notice.id ? null : notice.id)
  }

  const unreadCount = notices.filter((n) => !n.isRead).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">{unreadCount}건 미읽음</Badge>
          )}
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" />
          새 공지
        </Button>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id} className={!notice.isRead ? 'border-primary/30 bg-primary/5' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => handleToggleExpand(notice)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={NOTICE_PRIORITY_COLORS[notice.priority]}>{NOTICE_PRIORITY_LABELS[notice.priority]}</Badge>
                      <span className="font-medium text-sm">{notice.title}</span>
                      {!notice.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{notice.author}</span>
                      <span>{new Date(notice.createdAt).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openEdit(notice) }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(notice) }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {expandedId === notice.id && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-sm whitespace-pre-wrap">{notice.content}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? '공지사항 수정' : '새 공지사항'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">제목</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="공지사항 제목" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">중요도</label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as NoticePriority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(NOTICE_PRIORITY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">작성자</label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">내용</label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} placeholder="공지사항 내용을 입력하세요..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
            <Button onClick={handleSave}>{editTarget ? '수정' : '등록'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteTarget?.title}&quot; 공지사항을 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PhoneTab() {
  const { getCustomerByPhone } = useCustomers()
  const [calls, setCalls] = useState<PhoneCallRecord[]>([])
  const [simulatePhone, setSimulatePhone] = useState('')
  const [matchedCustomer, setMatchedCustomer] = useState<{ name: string; phone: string; grade: string } | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    operationStorage.seedDemoData()
    setCalls(operationStorage.getPhoneCalls())
  }, [])

  const handleSimulateCall = () => {
    if (!simulatePhone.trim()) {
      toast.error('전화번호를 입력해주세요.')
      return
    }
    const customer = getCustomerByPhone(simulatePhone.trim())
    if (customer) {
      setMatchedCustomer({ name: customer.name, phone: customer.phone, grade: customer.grade })
    } else {
      setMatchedCustomer(null)
    }
    setShowPopup(true)

    operationStorage.addPhoneCall({
      callerPhone: simulatePhone.trim(),
      callerName: customer?.name || null,
      customerId: customer?.id || null,
      direction: 'inbound',
      duration: '0:00',
      note: '',
    })
    setCalls(operationStorage.getPhoneCalls())
  }

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">전화 수신 시뮬레이션</span>
          </div>
          <p className="text-sm text-blue-700 mb-3">전화번호를 입력하면 고객 DB에서 발신자 정보를 조회합니다.</p>
          <div className="flex gap-2">
            <Input
              placeholder="010-0000-0000"
              value={simulatePhone}
              onChange={(e) => setSimulatePhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulateCall()}
              className="flex-1 max-w-[250px]"
            />
            <Button onClick={handleSimulateCall}>
              <PhoneIncoming className="w-4 h-4 mr-1" />
              수신 시뮬레이션
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">최근 통화 이력</CardTitle>
        </CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6">통화 이력이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {calls.slice(0, 10).map((call) => (
                <div key={call.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  {call.direction === 'inbound' ? (
                    <PhoneIncoming className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  ) : (
                    <PhoneOutgoing className="w-4 h-4 text-green-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{call.callerName || '미등록 고객'}</span>
                      <Badge variant="outline">{CALL_DIRECTION_LABELS[call.direction]}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{call.callerPhone}</span>
                      <span>{call.duration}</span>
                      {call.note && <span>{call.note}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(call.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneIncoming className="w-5 h-5 text-blue-600" />
              수신 전화
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {matchedCustomer ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{matchedCustomer.name}</p>
                    <p className="text-sm text-muted-foreground">{matchedCustomer.phone}</p>
                    <Badge variant="outline" className="mt-1">{matchedCustomer.grade.toUpperCase()}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => { setShowPopup(false); toast.success('예약 확정 처리됨') }}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    예약 확정
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowPopup(false)}>
                    통화 종료
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">미등록 고객</p>
                    <p className="text-sm text-muted-foreground">{simulatePhone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => { setShowPopup(false); toast.success('신규 고객 등록 페이지로 이동') }}>
                    <Plus className="w-4 h-4 mr-1" />
                    신규 고객 등록
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowPopup(false)}>
                    통화 종료
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function NaverSyncTab() {
  const [bookings, setBookings] = useState<NaverBooking[]>([])
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    operationStorage.seedDemoData()
    setBookings(operationStorage.getNaverBookings())
  }, [])

  const handleSyncAll = () => {
    setSyncing(true)
    setTimeout(() => {
      const count = operationStorage.syncAllNaverBookings()
      setBookings(operationStorage.getNaverBookings())
      setSyncing(false)
      toast.success(`${count}건의 예약이 동기화되었습니다.`)
    }, 1000)
  }

  const handleSyncOne = (id: string) => {
    operationStorage.syncNaverBooking(id)
    setBookings(operationStorage.getNaverBookings())
    toast.success('예약이 동기화되었습니다.')
  }

  const pendingCount = bookings.filter((b) => b.syncStatus !== 'synced').length

  return (
    <div className="space-y-4">
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-medium text-green-900">네이버 예약 연동</span>
                <p className="text-sm text-green-700">네이버 예약 서비스의 예약을 CRM과 동기화합니다.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800">{pendingCount}건 대기</Badge>
              )}
              <Button onClick={handleSyncAll} disabled={syncing}>
                <RefreshCw className={`w-4 h-4 mr-1 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? '동기화 중...' : '전체 동기화'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>네이버 예약 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>동기화 상태</TableHead>
                <TableHead>네이버 예약번호</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>시술</TableHead>
                <TableHead>예약일시</TableHead>
                <TableHead className="w-[100px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <Badge className={NAVER_SYNC_STATUS_COLORS[b.syncStatus]}>
                      {NAVER_SYNC_STATUS_LABELS[b.syncStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{b.naverBookingId}</TableCell>
                  <TableCell className="font-medium">{b.customerName}</TableCell>
                  <TableCell>{b.customerPhone}</TableCell>
                  <TableCell>{b.procedure}</TableCell>
                  <TableCell>{b.date} {b.time}</TableCell>
                  <TableCell>
                    {b.syncStatus !== 'synced' ? (
                      <Button variant="outline" size="sm" onClick={() => handleSyncOne(b.id)}>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        동기화
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {b.syncedAt ? new Date(b.syncedAt).toLocaleString('ko-KR') : ''}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export function Operations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">병원 운영</h1>
        <p className="text-muted-foreground mt-1">공지사항, 전화 연동, 네이버 예약 연동을 관리합니다.</p>
      </div>

      <Card>
        <CardContent className="p-4 lg:p-6">
          <Tabs defaultValue="notices">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notices" className="flex items-center gap-1">
                <Megaphone className="w-4 h-4" />
                <span className="hidden sm:inline">공지사항</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">전화 연동</span>
              </TabsTrigger>
              <TabsTrigger value="naver" className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">네이버 예약</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notices" className="mt-6">
              <NoticesTab />
            </TabsContent>
            <TabsContent value="phone" className="mt-6">
              <PhoneTab />
            </TabsContent>
            <TabsContent value="naver" className="mt-6">
              <NaverSyncTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
