import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Search, Stethoscope } from 'lucide-react'

export function RecordsList() {
  const { patients } = useEMR()
  const [search, setSearch] = useState('')

  const allRecords = useMemo(() => {
    return patients
      .flatMap((p) =>
        emrStorage.getRecordsByPatient(p.id).map((r) => ({
          ...r,
          patientName: p.name,
          patientChartNumber: p.chartNumber,
        }))
      )
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
  }, [patients])

  const filtered = useMemo(() => {
    if (!search) return allRecords
    const q = search.toLowerCase()
    return allRecords.filter(
      (r) =>
        r.patientName.includes(search) ||
        r.doctorName.includes(search) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.chiefComplaint.includes(search) ||
        r.diagnosisCode.toLowerCase().includes(q)
    )
  }, [allRecords, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          진료 기록
        </h1>
        <p className="text-muted-foreground mt-1">
          전체 {allRecords.length}건의 진료 기록을 조회합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="w-5 h-5 text-primary" />
              진료 기록 목록
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="환자명, 담당의, 진단명 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>
                {search
                  ? '검색 결과가 없습니다.'
                  : '진료 기록이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>진료일</TableHead>
                    <TableHead>환자명</TableHead>
                    <TableHead>차트번호</TableHead>
                    <TableHead>담당의</TableHead>
                    <TableHead>주소증</TableHead>
                    <TableHead>진단명</TableHead>
                    <TableHead>진단코드</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <Link
                          to={`/emr/patients/${record.patientId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {record.patientName}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {record.patientChartNumber}
                      </TableCell>
                      <TableCell>{record.doctorName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {record.chiefComplaint}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/emr/records/${record.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {record.diagnosis}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {record.diagnosisCode}
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
