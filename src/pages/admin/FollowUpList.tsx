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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useCustomers } from '@/contexts/CustomerContext'
import {
  FOLLOW_UP_STATUS_LABELS,
  FOLLOW_UP_STATUS_COLORS,
  FOLLOW_UP_TYPE_LABELS,
  type FollowUpStatus,
} from '@/types/customer'
import {
  Search,
  Clock,
  Filter,
  Eye,
  CheckCircle,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'

const PAGE_SIZE = 10

export function FollowUpList() {
  const { followUps, pendingFollowUps, updateFollowUpStatus } = useCustomers()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FollowUpStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [actionTarget, setActionTarget] = useState<{
    id: string
    name: string
    action: FollowUpStatus
  } | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const overdueCount = pendingFollowUps.filter((f) => f.dueDate < today).length

  const filtered = useMemo(() => {
    return followUps.filter((f) => {
      const matchesSearch =
        search === '' ||
        f.customerName.includes(search) ||
        f.customerPhone.includes(search) ||
        f.reason.includes(search)
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [followUps, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleAction = () => {
    if (actionTarget) {
      updateFollowUpStatus(actionTarget.id, actionTarget.action)
      setActionTarget(null)
    }
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as FollowUpStatus | 'all')
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const isOverdue = (dueDate: string, status: FollowUpStatus) =>
    status === 'pending' && dueDate < today

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">팔로업 관리</h1>
        <p className="text-muted-foreground mt-1">
          고객 관리를 위한 팔로업 작업을 확인하고 처리합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{followUps.length}</p>
            <p className="text-xs text-muted-foreground">전체</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingFollowUps.length}</p>
            <p className="text-xs text-muted-foreground">대기 중</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            <p className="text-xs text-muted-foreground">기한 초과</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {followUps.filter((f) => f.status === 'completed').length}
            </p>
            <p className="text-xs text-muted-foreground">완료</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              팔로업 목록
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="이름, 연락처, 사유 검색..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="skipped">건너뜀</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginated.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>팔로업 내역이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상태</TableHead>
                      <TableHead>고객명</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>사유</TableHead>
                      <TableHead>기한</TableHead>
                      <TableHead>메모</TableHead>
                      <TableHead className="w-[140px]">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((fu) => (
                      <TableRow
                        key={fu.id}
                        className={isOverdue(fu.dueDate, fu.status) ? 'bg-red-50/50' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge className={FOLLOW_UP_STATUS_COLORS[fu.status]}>
                              {FOLLOW_UP_STATUS_LABELS[fu.status]}
                            </Badge>
                            {isOverdue(fu.dueDate, fu.status) && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{fu.customerName}</TableCell>
                        <TableCell>{fu.customerPhone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{FOLLOW_UP_TYPE_LABELS[fu.type]}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{fu.reason}</TableCell>
                        <TableCell className={isOverdue(fu.dueDate, fu.status) ? 'text-red-600 font-medium' : ''}>
                          {fu.dueDate}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                          {fu.note || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link to={`/admin/customers/${fu.customerId}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            {fu.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:text-green-700"
                                  onClick={() =>
                                    setActionTarget({
                                      id: fu.id,
                                      name: fu.customerName,
                                      action: 'completed',
                                    })
                                  }
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground"
                                  onClick={() =>
                                    setActionTarget({
                                      id: fu.id,
                                      name: fu.customerName,
                                      action: 'skipped',
                                    })
                                  }
                                >
                                  <SkipForward className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    {filtered.length}건 중 {(page - 1) * PAGE_SIZE + 1}-
                    {Math.min(page * PAGE_SIZE, filtered.length)}건
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!actionTarget} onOpenChange={(open) => !open && setActionTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionTarget?.action === 'completed' ? '팔로업 완료 처리' : '팔로업 건너뛰기'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionTarget?.name}님의 팔로업을{' '}
              {actionTarget?.action === 'completed' ? '완료' : '건너뛰기'} 처리하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              {actionTarget?.action === 'completed' ? '완료 처리' : '건너뛰기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
