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
import { useCustomers } from '@/contexts/CustomerContext'
import {
  CUSTOMER_GRADE_LABELS,
  CUSTOMER_GRADE_COLORS,
  CUSTOMER_GRADE_ORDER,
  type CustomerGrade,
} from '@/types/customer'
import { Search, Users, Filter, Eye, Crown, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10

export function CustomerList() {
  const { customers, pendingFollowUps } = useCustomers()
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState<CustomerGrade | 'all'>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        search === '' ||
        c.name.includes(search) ||
        c.phone.includes(search) ||
        c.tags.some((t) => t.includes(search))
      const matchesGrade = gradeFilter === 'all' || c.grade === gradeFilter
      return matchesSearch && matchesGrade
    })
  }, [customers, search, gradeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const gradeStats = useMemo(() => {
    const stats: Record<string, number> = {}
    for (const g of CUSTOMER_GRADE_ORDER) {
      stats[g] = customers.filter((c) => c.grade === g).length
    }
    return stats
  }, [customers])

  const handleGradeChange = (value: string) => {
    setGradeFilter(value as CustomerGrade | 'all')
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">고객 관리</h1>
        <p className="text-muted-foreground mt-1">
          전체 {customers.length}명의 고객을 관리합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => { setGradeFilter('all'); setPage(1) }}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{customers.length}</p>
            <p className="text-xs text-muted-foreground">전체</p>
          </CardContent>
        </Card>
        {CUSTOMER_GRADE_ORDER.map((grade) => (
          <Card
            key={grade}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => { setGradeFilter(grade); setPage(1) }}
          >
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{gradeStats[grade] || 0}</p>
              <Badge className={`${CUSTOMER_GRADE_COLORS[grade]} text-xs mt-1`}>
                {CUSTOMER_GRADE_LABELS[grade]}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingFollowUps.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-orange-900">대기 중인 팔로업 {pendingFollowUps.length}건</p>
                <p className="text-sm text-orange-700">관리가 필요한 고객이 있습니다.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/follow-ups">팔로업 관리 →</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              고객 목록
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="이름, 연락처, 태그 검색..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={gradeFilter} onValueChange={handleGradeChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 등급</SelectItem>
                    {CUSTOMER_GRADE_ORDER.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {CUSTOMER_GRADE_LABELS[grade]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginated.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead>등급</TableHead>
                      <TableHead>태그</TableHead>
                      <TableHead>방문횟수</TableHead>
                      <TableHead>최근 방문</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                          <Badge className={CUSTOMER_GRADE_COLORS[customer.grade]}>
                            {CUSTOMER_GRADE_LABELS[customer.grade]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {customer.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {customer.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{customer.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{customer.totalVisits}회</TableCell>
                        <TableCell>
                          {customer.lastVisitDate || (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {customer.registeredAt.split('T')[0]}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link to={`/admin/customers/${customer.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    {filtered.length}명 중 {(page - 1) * PAGE_SIZE + 1}-
                    {Math.min(page * PAGE_SIZE, filtered.length)}명
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
    </div>
  )
}
