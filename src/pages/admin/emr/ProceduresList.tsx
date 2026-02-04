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
import { useEMR } from '@/contexts/EMRContext'
import { emrStorage } from '@/services/emrStorage'
import { PROCEDURE_STATUS_LABELS, PROCEDURE_STATUS_COLORS } from '@/types/emr'
import type { ProcedureStatus } from '@/types/emr'
import { Search, Scissors, Filter, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10

type SortKey = 'date' | 'patientName' | 'procedureName' | 'doctor' | 'status'

type SortIconProps = {
  column: SortKey
  activeKey: SortKey
  direction: 'asc' | 'desc'
}

function SortIcon({ column, activeKey, direction }: SortIconProps) {
  if (activeKey !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />
  return direction === 'asc'
    ? <ArrowUp className="w-3 h-3 ml-1" />
    : <ArrowDown className="w-3 h-3 ml-1" />
}

const statusFilters: Array<{ value: ProcedureStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'scheduled', label: '예정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
]

export function ProceduresList() {
  const { patients } = useEMR()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProcedureStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const allProcedures = useMemo(() => {
    return patients
      .flatMap((p) =>
        emrStorage.getProceduresByPatient(p.id).map((pr) => ({
          ...pr,
          patientName: p.name,
          patientChartNumber: p.chartNumber,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [patients])

  const filtered = useMemo(() => {
    return allProcedures.filter((p) => {
      const matchesSearch =
        search === '' ||
        p.patientName.includes(search) ||
        p.procedureName.includes(search) ||
        p.doctor.includes(search)
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [allProcedures, search, statusFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? ''
      const vb = b[sortKey] ?? ''
      const cmp = String(va).localeCompare(String(vb), 'ko')
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setCurrentPage(1)
  }

  const handleSearchChange = (v: string) => {
    setSearch(v)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: ProcedureStatus | 'all') => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          시술 기록
        </h1>
        <p className="text-muted-foreground mt-1">
          전체 {allProcedures.length}건의 시술 기록을 조회합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scissors className="w-5 h-5 text-primary" />
              시술 기록 목록
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="환자명, 시술명, 담당의 검색..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground mt-1" />
            {statusFilters.map((f) => (
              <Button
                key={f.value}
                variant={statusFilter === f.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter(f.value)}
                className={statusFilter === f.value ? 'bg-primary' : ''}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="ml-1 opacity-70">
                    ({allProcedures.filter((p) => p.status === f.value).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Scissors className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>
                {search || statusFilter !== 'all'
                  ? '검색 결과가 없습니다.'
                  : '시술 기록이 없습니다.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('date')}>
                        <span className="flex items-center">시술일<SortIcon column="date" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('patientName')}>
                        <span className="flex items-center">환자명<SortIcon column="patientName" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead>차트번호</TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('procedureName')}>
                        <span className="flex items-center">시술명<SortIcon column="procedureName" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('doctor')}>
                        <span className="flex items-center">담당의<SortIcon column="doctor" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead>마취</TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                        <span className="flex items-center">상태<SortIcon column="status" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((proc) => (
                      <TableRow key={proc.id}>
                        <TableCell>{proc.date}</TableCell>
                        <TableCell>
                          <Link
                            to={`/emr/patients/${proc.patientId}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {proc.patientName}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {proc.patientChartNumber}
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/emr/procedures/${proc.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {proc.procedureName}
                          </Link>
                        </TableCell>
                        <TableCell>{proc.doctor}</TableCell>
                        <TableCell>{proc.anesthesiaType}</TableCell>
                        <TableCell>
                          <Badge className={PROCEDURE_STATUS_COLORS[proc.status]}>
                            {PROCEDURE_STATUS_LABELS[proc.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>전체 {sorted.length}건</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                    이전
                  </Button>
                  <span>{currentPage} / {totalPages || 1} 페이지</span>
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                    다음
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
