import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  ACQUISITION_SOURCE_LABELS,
  JOURNEY_STAGE_LABELS,
  JOURNEY_STAGE_ORDER,
  JOURNEY_STAGE_COLORS,
  type BookingStatus,
  type JourneyStage,
  type AcquisitionSource,
} from '@/types/booking'
import { toast } from 'sonner'
import {
  ArrowLeft,
  User,
  Phone,
  CalendarDays,
  Clock,
  Stethoscope,
  MessageSquare,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Globe,
  TrendingUp,
  Megaphone,
  ChevronRight,
} from 'lucide-react'

export function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getById, updateStatus, updateMemo, updateJourneyStage, deleteBooking } = useBookings()
  const [memo, setMemo] = useState('')
  const [memoSaved, setMemoSaved] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const booking = id ? getById(id) : undefined

  useEffect(() => {
    if (booking) {
      setMemo(booking.memo)
    }
  }, [booking])

  if (!booking) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h2 className="text-xl font-semibold mb-2">예약을 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-4">
          삭제되었거나 존재하지 않는 예약입니다.
        </p>
        <Button asChild>
          <Link to="/admin/bookings">예약 목록으로</Link>
        </Button>
      </div>
    )
  }

  const handleSaveMemo = () => {
    updateMemo(booking.id, memo)
    setMemoSaved(true)
    setTimeout(() => setMemoSaved(false), 2000)
  }

  const handleStatusChange = (status: BookingStatus) => {
    updateStatus(booking.id, status)
    toast.success(`상태가 "${BOOKING_STATUS_LABELS[status]}"(으)로 변경되었습니다.`)
  }

  const handleJourneyAdvance = (stage: JourneyStage) => {
    updateJourneyStage(booking.id, stage)
    toast.success(`여정 단계가 "${JOURNEY_STAGE_LABELS[stage]}"(으)로 업데이트되었습니다.`)
  }

  const handleDeleteConfirm = () => {
    deleteBooking(booking.id)
    toast.success('예약이 삭제되었습니다.')
    navigate('/admin/bookings')
  }

  const currentStageIndex = JOURNEY_STAGE_ORDER.indexOf(booking.journeyStage)
  const nextStage = currentStageIndex < JOURNEY_STAGE_ORDER.length - 1
    ? JOURNEY_STAGE_ORDER[currentStageIndex + 1]
    : null

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/bookings">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">예약 상세</h1>
          <p className="text-sm text-muted-foreground font-mono">{booking.id}</p>
        </div>
        <div className="ml-auto">
          <Badge className={`${BOOKING_STATUS_COLORS[booking.status]} text-sm px-3 py-1`}>
            {BOOKING_STATUS_LABELS[booking.status]}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">고객 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">이름</p>
                <p className="font-medium">{booking.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">연락처</p>
                <a href={`tel:${booking.phone}`} className="font-medium text-primary hover:underline">
                  {booking.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">관심 시술</p>
                <p className="font-medium">{booking.procedure}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">예약 일시</p>
                <p className="font-medium">{booking.date} {booking.time}</p>
              </div>
            </div>
          </div>

          {booking.message && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">상담 내용</p>
                  <p className="mt-1">{booking.message}</p>
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">접수일시</p>
              <p className="text-sm">
                {new Date(booking.createdAt).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5 text-primary" />
            마케팅 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">유입 경로</p>
                <p className="font-medium">
                  {booking.source
                    ? ACQUISITION_SOURCE_LABELS[booking.source as AcquisitionSource]
                    : '-'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">매체</p>
              <p className="font-medium">{booking.medium || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">캠페인</p>
              <p className="font-medium">{booking.campaign || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              고객 여정
            </CardTitle>
            <Badge className={JOURNEY_STAGE_COLORS[booking.journeyStage]}>
              {JOURNEY_STAGE_LABELS[booking.journeyStage]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {JOURNEY_STAGE_ORDER.map((stage, idx) => {
              const stageIdx = JOURNEY_STAGE_ORDER.indexOf(booking.journeyStage)
              const isPast = idx <= stageIdx
              const isCurrent = idx === stageIdx
              return (
                <div key={stage} className="flex items-center">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isPast
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isPast && !isCurrent && <CheckCircle className="w-3 h-3" />}
                    {JOURNEY_STAGE_LABELS[stage]}
                  </div>
                  {idx < JOURNEY_STAGE_ORDER.length - 1 && (
                    <ChevronRight className={`w-4 h-4 mx-0.5 flex-shrink-0 ${isPast ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {nextStage && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleJourneyAdvance(nextStage)}
              >
                <ChevronRight className="w-4 h-4 mr-1" />
                다음 단계: {JOURNEY_STAGE_LABELS[nextStage]}
              </Button>
              {currentStageIndex < JOURNEY_STAGE_ORDER.length - 2 && (
                <div className="flex gap-1">
                  {JOURNEY_STAGE_ORDER.slice(currentStageIndex + 2).map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      onClick={() => handleJourneyAdvance(s)}
                      className="text-xs"
                    >
                      {JOURNEY_STAGE_LABELS[s]}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {booking.journeyHistory && booking.journeyHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">여정 이력</p>
                <div className="relative pl-6">
                  <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border" />
                  {booking.journeyHistory.map((event, idx) => (
                    <div key={idx} className="relative pb-4 last:pb-0">
                      <div className={`absolute left-[-18px] w-3 h-3 rounded-full border-2 ${
                        idx === booking.journeyHistory.length - 1
                          ? 'bg-primary border-primary'
                          : 'bg-background border-muted-foreground/30'
                      }`} />
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {JOURNEY_STAGE_LABELS[event.stage]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      {event.note && (
                        <p className="text-sm text-muted-foreground mt-1">{event.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">상태 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={booking.status === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('pending')}
              className={booking.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              대기중
            </Button>
            <Button
              variant={booking.status === 'confirmed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('confirmed')}
              className={booking.status === 'confirmed' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              확인됨
            </Button>
            <Button
              variant={booking.status === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('completed')}
              className={booking.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              완료
            </Button>
            <Button
              variant={booking.status === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('cancelled')}
              className={booking.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <XCircle className="w-4 h-4 mr-1" />
              취소
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">관리자 메모</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea
              id="memo"
              placeholder="이 예약에 대한 메모를 남겨주세요."
              rows={4}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveMemo} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              메모 저장
            </Button>
            {memoSaved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                저장됨
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">예약 삭제</p>
              <p className="text-sm text-muted-foreground">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>예약 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {booking.name}님의 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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
