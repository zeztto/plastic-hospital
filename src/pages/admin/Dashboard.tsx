import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBookings } from '@/contexts/BookingContext'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/types/booking'
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { stats, bookings } = useBookings()

  const todayBookings = bookings.filter(
    (b) => b.date === '2026-02-06'
  )

  const upcomingBookings = bookings
    .filter((b) => b.date >= '2026-02-06' && b.status !== 'cancelled')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">대시보드</h1>
        <p className="text-muted-foreground mt-1">2026년 2월 6일 목요일</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 예약</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">대기중</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">확인됨</p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">취소됨</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="w-5 h-5 text-primary" />
              오늘의 예약 ({todayBookings.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                오늘 예약이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {todayBookings
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((booking) => (
                    <Link
                      key={booking.id}
                      to={`/admin/bookings/${booking.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.time}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.procedure}
                          </p>
                        </div>
                      </div>
                      <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </Badge>
                    </Link>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              다가오는 예약
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                다가오는 예약이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    to={`/admin/bookings/${booking.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{booking.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.date} {booking.time} · {booking.procedure}
                      </p>
                    </div>
                    <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/admin/bookings"
              className="block text-sm text-primary hover:underline text-center mt-4"
            >
              전체 예약 보기 →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
