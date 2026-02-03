import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBookings } from '@/contexts/BookingContext'
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  type BookingStatus,
} from '@/types/booking'
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  CalendarDays,
  Filter,
} from 'lucide-react'

const statusFilters: Array<{ value: BookingStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기중' },
  { value: 'confirmed', label: '확인됨' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소됨' },
]

export function BookingList() {
  const { bookings, updateStatus, deleteBooking } = useBookings()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        search === '' ||
        b.name.includes(search) ||
        b.phone.includes(search) ||
        b.procedure.includes(search) ||
        b.id.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [bookings, search, statusFilter])

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${name}님의 예약을 삭제하시겠습니까?`)) {
      deleteBooking(id)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">예약 관리</h1>
        <p className="text-muted-foreground mt-1">
          전체 {bookings.length}건의 예약을 관리합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="w-5 h-5 text-primary" />
              예약 목록
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="이름, 연락처, 시술 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground mt-1" />
            {statusFilters.map((f) => (
              <Button
                key={f.value}
                variant={statusFilter === f.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(f.value)}
                className={statusFilter === f.value ? 'bg-primary' : ''}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="ml-1 opacity-70">
                    ({bookings.filter((b) => b.status === f.value).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">예약번호</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>시술</TableHead>
                    <TableHead>예약일시</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[80px]">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">
                        {booking.id}
                      </TableCell>
                      <TableCell className="font-medium">{booking.name}</TableCell>
                      <TableCell>{booking.phone}</TableCell>
                      <TableCell>{booking.procedure}</TableCell>
                      <TableCell>
                        {booking.date} {booking.time}
                      </TableCell>
                      <TableCell>
                        <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                          {BOOKING_STATUS_LABELS[booking.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/bookings/${booking.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                상세보기
                              </Link>
                            </DropdownMenuItem>
                            {booking.status === 'pending' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(booking.id, 'confirmed')
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                확인 처리
                              </DropdownMenuItem>
                            )}
                            {(booking.status === 'pending' ||
                              booking.status === 'confirmed') && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(booking.id, 'completed')
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                완료 처리
                              </DropdownMenuItem>
                            )}
                            {booking.status !== 'cancelled' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(booking.id, 'cancelled')
                                }
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                취소 처리
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                handleDelete(booking.id, booking.name)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
