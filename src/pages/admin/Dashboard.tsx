import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBookings } from '@/contexts/BookingContext'
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  ACQUISITION_SOURCE_LABELS,
} from '@/types/booking'
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  AlertCircle,
  TrendingUp,
  Target,
  BarChart3,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const WEEKDAY_LABELS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

export function Dashboard() {
  const { stats, bookings, marketingStats } = useBookings()

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const todayLabel = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAY_LABELS[d.getDay()]}`
  }, [])

  const todayBookings = useMemo(
    () => bookings.filter((b) => b.date === today),
    [bookings, today]
  )

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.date >= today && b.status !== 'cancelled')
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date)
          return a.time.localeCompare(b.time)
        })
        .slice(0, 5),
    [bookings, today]
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">대시보드</h1>
        <p className="text-muted-foreground mt-1">{todayLabel}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-purple-600">전환율</p>
                <p className="text-2xl font-bold text-purple-900">{marketingStats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-700" />
              </div>
              <div>
                <p className="text-sm text-orange-600">최다 유입 채널</p>
                <p className="text-2xl font-bold text-orange-900">
                  {marketingStats.topSource
                    ? ACQUISITION_SOURCE_LABELS[marketingStats.topSource]
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link to="/admin/marketing" className="block">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200 hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 lg:p-6 flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <p className="text-sm text-indigo-600">마케팅 분석</p>
                  <p className="text-sm font-medium text-indigo-900">상세 보기 →</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
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
