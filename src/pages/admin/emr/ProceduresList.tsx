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
import { Search, Scissors, Filter } from 'lucide-react'

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
                onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => setStatusFilter(f.value)}
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
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Scissors className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>
                {search || statusFilter !== 'all'
                  ? '검색 결과가 없습니다.'
                  : '시술 기록이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시술일</TableHead>
                    <TableHead>환자명</TableHead>
                    <TableHead>차트번호</TableHead>
                    <TableHead>시술명</TableHead>
                    <TableHead>담당의</TableHead>
                    <TableHead>마취</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((proc) => (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
