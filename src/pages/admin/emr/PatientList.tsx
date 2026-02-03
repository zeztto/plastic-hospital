import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { GENDER_LABELS } from '@/types/emr'
import { Search, Plus, Users } from 'lucide-react'

export function PatientList() {
  const { patients } = useEMR()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return patients
    const q = search.toLowerCase()
    return patients.filter(
      (p) =>
        p.name.includes(search) ||
        p.chartNumber.toLowerCase().includes(q) ||
        p.phone.includes(search) ||
        p.bloodType.toLowerCase().includes(q) ||
        p.allergies.some((a) => a.includes(search))
    )
  }, [patients, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            환자 관리
          </h1>
          <p className="text-muted-foreground mt-1">
            전체 {patients.length}명의 환자를 관리합니다.
          </p>
        </div>
        <Button asChild>
          <Link to="/emr/patients/new">
            <Plus className="w-4 h-4 mr-2" />
            신규 환자 등록
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              환자 목록
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="이름, 차트번호, 연락처, 혈액형 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-72"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>
                {search ? '검색 결과가 없습니다.' : '등록된 환자가 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">차트번호</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>생년월일</TableHead>
                    <TableHead>성별</TableHead>
                    <TableHead>혈액형</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>알레르기</TableHead>
                    <TableHead>등록일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((patient) => (
                    <TableRow
                      key={patient.id}
                      onClick={() => navigate(`/emr/patients/${patient.id}`)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs">
                        {patient.chartNumber}
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        {patient.name}
                      </TableCell>
                      <TableCell>{patient.birthDate}</TableCell>
                      <TableCell>
                        {GENDER_LABELS[patient.gender]}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{patient.bloodType || '-'}</Badge>
                      </TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        {patient.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {patient.allergies.map((a) => (
                              <Badge key={a} variant="destructive" className="text-[10px]">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">없음</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {patient.registeredAt.slice(0, 10)}
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
