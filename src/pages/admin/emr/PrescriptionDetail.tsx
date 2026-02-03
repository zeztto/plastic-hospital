import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import type { Prescription, Patient } from '@/types/emr'
import { ArrowLeft, Pill, User, Trash2, AlertTriangle } from 'lucide-react'

export function PrescriptionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPrescriptionById, getPatient, deletePrescription } = useEMR()

  const [prescription, setPrescription] = useState<Prescription | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()

  useEffect(() => {
    if (!id) return
    const rx = getPrescriptionById(id)
    setPrescription(rx)
    if (rx) setPatient(getPatient(rx.patientId))
  }, [id, getPrescriptionById, getPatient])

  if (!prescription) {
    return (
      <div className="text-center py-16">
        <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground mb-4">처방전을 찾을 수 없습니다.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          돌아가기
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('이 처방전을 삭제하시겠습니까?')) {
      deletePrescription(prescription.id)
      navigate(`/emr/patients/${prescription.patientId}`)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              처방전
            </h1>
            <Badge variant="outline">{prescription.medications.length}종</Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {prescription.date} · {prescription.doctorName}
          </p>
        </div>
      </div>

      {patient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              환자 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">이름</p>
                <Link
                  to={`/emr/patients/${patient.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {patient.name}
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">차트번호</p>
                <p className="font-mono text-sm">{patient.chartNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">성별</p>
                <p className="font-medium">{GENDER_LABELS[patient.gender]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">연락처</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            </div>
            {patient.allergies.length > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <p className="text-sm font-medium text-destructive">알레르기 주의</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((a) => (
                    <Badge key={a} variant="destructive">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Pill className="w-5 h-5 text-primary" />
            약물 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>약물명</TableHead>
                  <TableHead>용량</TableHead>
                  <TableHead>복용횟수</TableHead>
                  <TableHead>기간</TableHead>
                  <TableHead>복용지침</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.dosage}</TableCell>
                    <TableCell>{m.frequency}</TableCell>
                    <TableCell>{m.duration}</TableCell>
                    <TableCell className="text-muted-foreground">{m.instructions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {prescription.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">비고</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">{prescription.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">처방전 삭제</p>
              <p className="text-sm text-muted-foreground">이 작업은 되돌릴 수 없습니다.</p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
