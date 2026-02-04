import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Search, Pill, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10

type SortKey = 'date' | 'patientName' | 'doctorName' | 'medicationCount'

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

export function PrescriptionsList() {
  const { patients } = useEMR()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const allPrescriptions = useMemo(() => {
    return patients
      .flatMap((p) =>
        emrStorage.getPrescriptionsByPatient(p.id).map((rx) => ({
          ...rx,
          patientName: p.name,
          patientChartNumber: p.chartNumber,
        }))
      )
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
  }, [patients])

  const filtered = useMemo(() => {
    if (!search) return allPrescriptions
    const q = search.toLowerCase()
    return allPrescriptions.filter(
      (rx) =>
        rx.patientName.includes(search) ||
        rx.doctorName.includes(search) ||
        rx.medications.some((m) => m.name.toLowerCase().includes(q))
    )
  }, [allPrescriptions, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === 'medicationCount') {
        const diff = a.medications.length - b.medications.length
        return sortDir === 'asc' ? diff : -diff
      }
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          처방전
        </h1>
        <p className="text-muted-foreground mt-1">
          전체 {allPrescriptions.length}건의 처방전을 조회합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="w-5 h-5 text-primary" />
              처방전 목록
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="환자명, 담당의, 약물명 검색..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>
                {search
                  ? '검색 결과가 없습니다.'
                  : '처방전이 없습니다.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('date')}>
                        <span className="flex items-center">처방일<SortIcon column="date" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('patientName')}>
                        <span className="flex items-center">환자명<SortIcon column="patientName" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead>차트번호</TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('doctorName')}>
                        <span className="flex items-center">담당의<SortIcon column="doctorName" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort('medicationCount')}>
                        <span className="flex items-center">약물 수<SortIcon column="medicationCount" activeKey={sortKey} direction={sortDir} /></span>
                      </TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((rx) => (
                      <TableRow key={rx.id}>
                        <TableCell>{rx.date}</TableCell>
                        <TableCell>
                          <Link
                            to={`/emr/patients/${rx.patientId}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {rx.patientName}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {rx.patientChartNumber}
                        </TableCell>
                        <TableCell>{rx.doctorName}</TableCell>
                        <TableCell>
                          <Link
                            to={`/emr/prescriptions/${rx.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {rx.medications.length}종
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {rx.notes || '-'}
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
