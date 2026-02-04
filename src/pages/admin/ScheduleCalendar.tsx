import { useState, useMemo, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useBookings } from '@/contexts/BookingContext'
import type { Booking } from '@/types/booking'
import { SCHEDULE_DOCTORS, SCHEDULE_TIME_SLOTS, type TimeBlock } from '@/types/schedule'
import { scheduleStorage } from '@/services/scheduleStorage'
import { bookingStorage } from '@/services/bookingStorage'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Ban,
  GripVertical,
} from 'lucide-react'
import { toast } from 'sonner'

function getWeekDates(baseDate: Date): Date[] {
  const monday = new Date(baseDate)
  const day = monday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

export function ScheduleCalendar() {
  const { bookings, refresh } = useBookings()
  const [weekBase, setWeekBase] = useState(() => {
    scheduleStorage.seedDemoData()
    return new Date()
  })
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [deleteBlockTarget, setDeleteBlockTarget] = useState<TimeBlock | null>(null)
  const [newBlock, setNewBlock] = useState({
    doctorId: SCHEDULE_DOCTORS[0].id,
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    reason: '',
  })

  const [dragBooking, setDragBooking] = useState<Booking | null>(null)
  const [dragOverCell, setDragOverCell] = useState<{ date: string; time: string } | null>(null)
  const dragRef = useRef<HTMLDivElement | null>(null)

  const weekDates = useMemo(() => getWeekDates(weekBase), [weekBase])
  const weekStart = formatDate(weekDates[0])
  const weekEnd = formatDate(weekDates[6])

  const refreshBlocks = useCallback(() => {
    setWeekBase((prev) => new Date(prev))
  }, [])

  const weekBookings = useMemo(() => {
    return bookings.filter((b) => b.date >= weekStart && b.date <= weekEnd && b.status !== 'cancelled')
  }, [bookings, weekStart, weekEnd])

  const bookingsByDateAndTime = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of weekBookings) {
      const key = `${b.date}-${b.time}`
      const existing = map.get(key) || []
      existing.push(b)
      map.set(key, existing)
    }
    return map
  }, [weekBookings])

  const timeBlocks = useMemo(
    () => scheduleStorage.getByDateRange(weekStart, weekEnd),
    [weekStart, weekEnd]
  )

  const blocksByDoctorAndDate = useMemo(() => {
    const map = new Map<string, TimeBlock[]>()
    for (const tb of timeBlocks) {
      const key = `${tb.doctorId}-${tb.date}`
      const existing = map.get(key) || []
      existing.push(tb)
      map.set(key, existing)
    }
    return map
  }, [timeBlocks])

  const navigateWeek = (delta: number) => {
    const next = new Date(weekBase)
    next.setDate(weekBase.getDate() + delta * 7)
    setWeekBase(next)
  }

  const goToToday = () => setWeekBase(new Date())

  const handleCreateBlock = () => {
    if (!newBlock.date || !newBlock.reason.trim()) {
      toast.error('날짜와 사유를 입력해주세요.')
      return
    }
    if (newBlock.startTime >= newBlock.endTime) {
      toast.error('종료 시간은 시작 시간 이후여야 합니다.')
      return
    }
    scheduleStorage.create({
      doctorId: newBlock.doctorId,
      date: newBlock.date,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      reason: newBlock.reason.trim(),
    })
    refreshBlocks()
    setBlockDialogOpen(false)
    setNewBlock({
      doctorId: SCHEDULE_DOCTORS[0].id,
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      reason: '',
    })
    toast.success('예약 막기가 등록되었습니다.')
  }

  const handleDeleteBlock = () => {
    if (deleteBlockTarget) {
      scheduleStorage.delete(deleteBlockTarget.id)
      refreshBlocks()
      setDeleteBlockTarget(null)
      toast.success('예약 막기가 삭제되었습니다.')
    }
  }

  const isTimeBlocked = (doctorId: string, date: string, time: string): TimeBlock | undefined => {
    const blocks = blocksByDoctorAndDate.get(`${doctorId}-${date}`) || []
    return blocks.find((b) => b.startTime <= time && b.endTime > time)
  }

  const handleDragStart = (e: React.DragEvent, booking: Booking) => {
    setDragBooking(booking)
    e.dataTransfer.effectAllowed = 'move'
    if (dragRef.current) {
      e.dataTransfer.setDragImage(dragRef.current, 0, 0)
    }
  }

  const handleDragOver = (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCell({ date, time })
  }

  const handleDragLeave = () => {
    setDragOverCell(null)
  }

  const handleDrop = (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault()
    setDragOverCell(null)
    if (!dragBooking) return

    if (dragBooking.date === date && dragBooking.time === time) {
      setDragBooking(null)
      return
    }

    const updated = bookingStorage.updateBookingDateTime(dragBooking.id, date, time)
    if (updated) {
      refresh()
      toast.success(`${dragBooking.name}님 예약이 ${date} ${time}으로 변경되었습니다.`)
    }
    setDragBooking(null)
  }

  const todayStr = formatDate(new Date())

  const weekLabel = `${weekDates[0].getMonth() + 1}/${weekDates[0].getDate()} - ${weekDates[6].getMonth() + 1}/${weekDates[6].getDate()}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">스케줄 관리</h1>
          <p className="text-muted-foreground mt-1">주간 예약 현황과 스케줄을 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNewBlock({ ...newBlock, date: todayStr })
              setBlockDialogOpen(true)
            }}
          >
            <Ban className="w-4 h-4 mr-1" />
            예약 막기
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              주간 스케줄
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateWeek(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                오늘
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">{weekLabel}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateWeek(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap mt-2">
            {SCHEDULE_DOCTORS.map((doc) => (
              <div key={doc.id} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: doc.color }} />
                <span>{doc.name}</span>
                <span className="text-muted-foreground">({doc.specialty})</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-8 border-b bg-muted/30">
                <div className="p-2 text-center text-xs font-medium text-muted-foreground border-r">
                  <Clock className="w-4 h-4 mx-auto" />
                </div>
                {weekDates.map((date, i) => {
                  const dateStr = formatDate(date)
                  const isToday = dateStr === todayStr
                  return (
                    <div
                      key={dateStr}
                      className={`p-2 text-center border-r last:border-r-0 ${isToday ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                        {DAY_LABELS[i]}
                      </div>
                      <div className={`text-sm font-bold ${isToday ? 'text-primary' : ''}`}>
                        {date.getMonth() + 1}/{date.getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {weekBookings.filter((b) => b.date === dateStr).length}건
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {SCHEDULE_TIME_SLOTS.map((time) => (
                  <div key={time} className="grid grid-cols-8 border-b last:border-b-0 min-h-[48px]">
                    <div className="p-1.5 text-xs text-muted-foreground text-center border-r flex items-center justify-center font-mono">
                      {time}
                    </div>
                    {weekDates.map((date) => {
                      const dateStr = formatDate(date)
                      const cellBookings = bookingsByDateAndTime.get(`${dateStr}-${time}`) || []
                      const isToday = dateStr === todayStr
                      const isDragOver = dragOverCell?.date === dateStr && dragOverCell?.time === time

                      const blockedDoctors = SCHEDULE_DOCTORS.map((doc) => ({
                        doc,
                        block: isTimeBlocked(doc.id, dateStr, time),
                      })).filter((x) => x.block)

                      return (
                        <div
                          key={dateStr}
                          className={`p-1 border-r last:border-r-0 relative ${
                            isToday ? 'bg-primary/5' : ''
                          } ${isDragOver ? 'bg-blue-100' : ''}`}
                          onDragOver={(e) => handleDragOver(e, dateStr, time)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, dateStr, time)}
                        >
                          {blockedDoctors.map(({ doc, block }) =>
                            block ? (
                              <div
                                key={`block-${block.id}-${doc.id}`}
                                className="text-[10px] px-1 py-0.5 mb-0.5 rounded bg-gray-200 text-gray-600 flex items-center justify-between cursor-pointer hover:bg-gray-300 transition-colors"
                                onClick={() => setDeleteBlockTarget(block)}
                                title={`${doc.name}: ${block.reason} (클릭하여 삭제)`}
                              >
                                <span className="truncate">
                                  <Ban className="w-2.5 h-2.5 inline mr-0.5" />
                                  {doc.name.split(' ')[0]}
                                </span>
                              </div>
                            ) : null
                          )}
                          {cellBookings.map((booking) => (
                            <div
                              key={booking.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, booking)}
                              className="text-[10px] px-1.5 py-1 mb-0.5 rounded cursor-grab active:cursor-grabbing border shadow-sm hover:shadow transition-shadow"
                              style={{
                                borderLeftWidth: '3px',
                                borderLeftColor: SCHEDULE_DOCTORS.find((d) =>
                                  d.specialty.includes(booking.procedure.slice(0, 2))
                                )?.color || '#6B7280',
                              }}
                            >
                              <div className="flex items-center gap-1">
                                <GripVertical className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium truncate">{booking.name}</span>
                              </div>
                              <div className="text-muted-foreground truncate ml-3.5">
                                {booking.procedure}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden" ref={dragRef}>
        <div className="bg-white border rounded px-2 py-1 text-xs shadow-lg">
          {dragBooking?.name} - {dragBooking?.procedure}
        </div>
      </div>

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 막기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">진료의</label>
              <Select value={newBlock.doctorId} onValueChange={(v) => setNewBlock({ ...newBlock, doctorId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE_DOCTORS.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">날짜</label>
              <Input
                type="date"
                value={newBlock.date}
                onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">시작 시간</label>
                <Select value={newBlock.startTime} onValueChange={(v) => setNewBlock({ ...newBlock, startTime: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">종료 시간</label>
                <Select value={newBlock.endTime} onValueChange={(v) => setNewBlock({ ...newBlock, endTime: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">사유</label>
              <Input
                placeholder="예약 막기 사유를 입력하세요..."
                value={newBlock.reason}
                onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>취소</Button>
            <Button onClick={handleCreateBlock}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteBlockTarget} onOpenChange={(open) => !open && setDeleteBlockTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>예약 막기 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteBlockTarget && (
                <>
                  {SCHEDULE_DOCTORS.find((d) => d.id === deleteBlockTarget.doctorId)?.name}의{' '}
                  {deleteBlockTarget.date} {deleteBlockTarget.startTime}-{deleteBlockTarget.endTime}{' '}
                  예약 막기를 삭제하시겠습니까?
                  <br />
                  사유: {deleteBlockTarget.reason}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBlock}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
