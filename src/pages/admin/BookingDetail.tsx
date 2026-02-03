import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useBookings } from '@/contexts/BookingContext'
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  type BookingStatus,
} from '@/types/booking'
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
} from 'lucide-react'

export function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getById, updateStatus, updateMemo, deleteBooking } = useBookings()
  const [memo, setMemo] = useState('')
  const [memoSaved, setMemoSaved] = useState(false)

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
  }

  const handleDelete = () => {
    if (window.confirm(`${booking.name}님의 예약을 삭제하시겠습니까?`)) {
      deleteBooking(booking.id)
      navigate('/admin/bookings')
    }
  }

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
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
