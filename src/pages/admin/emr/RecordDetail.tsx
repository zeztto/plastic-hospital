import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useEMR } from '@/contexts/EMRContext'
import { GENDER_LABELS } from '@/types/emr'
import type { MedicalRecord, Patient } from '@/types/emr'
import {
  ArrowLeft,
  Stethoscope,
  User,
  Activity,
  FileText,
  Trash2,
  Calendar,
} from 'lucide-react'

export function RecordDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRecordById, getPatient, deleteRecord } = useEMR()

  const [record, setRecord] = useState<MedicalRecord | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()

  useEffect(() => {
    if (!id) return
    const r = getRecordById(id)
    setRecord(r)
    if (r) setPatient(getPatient(r.patientId))
  }, [id, getRecordById, getPatient])

  if (!record) {
    return (
      <div className="text-center py-16">
        <Stethoscope className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground mb-4">진료 기록을 찾을 수 없습니다.</p>
        <Button variant="outline" asChild>
          <Link to="/emr/records">진료 기록 목록으로</Link>
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('이 진료 기록을 삭제하시겠습니까?')) {
      deleteRecord(record.id)
      navigate('/emr/records')
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
              {record.diagnosis}
            </h1>
            <Badge variant="outline" className="font-mono">
              {record.diagnosisCode}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {record.date} · {record.doctorName}
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
                <p className="text-sm text-muted-foreground">생년월일</p>
                <p className="font-medium">{patient.birthDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">성별</p>
                <p className="font-medium">{GENDER_LABELS[patient.gender]}</p>
              </div>
            </div>
            {patient.allergies.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-1">알레르기</p>
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
            <Stethoscope className="w-5 h-5 text-primary" />
            진료 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">진료일</p>
              <p className="font-medium">{record.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">담당의</p>
              <p className="font-medium">{record.doctorName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">진단명</p>
              <p className="font-medium">{record.diagnosis}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">진단코드</p>
              <p className="font-mono">{record.diagnosisCode}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <p className="text-sm text-muted-foreground mb-1">주소증</p>
            <p>{record.chiefComplaint}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            바이탈 사인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">혈압</p>
              <p className="text-lg font-bold">{record.vitalSigns.bloodPressure || '-'}</p>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">맥박</p>
              <p className="text-lg font-bold">{record.vitalSigns.pulse || '-'}</p>
              <p className="text-xs text-muted-foreground">bpm</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">체온</p>
              <p className="text-lg font-bold">{record.vitalSigns.temperature || '-'}</p>
              <p className="text-xs text-muted-foreground">°C</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">체중</p>
              <p className="text-lg font-bold">{record.vitalSigns.weight || '-'}</p>
              <p className="text-xs text-muted-foreground">kg</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">신장</p>
              <p className="text-lg font-bold">{record.vitalSigns.height || '-'}</p>
              <p className="text-xs text-muted-foreground">cm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {record.treatmentPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              치료 계획
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{record.treatmentPlan}</p>
          </CardContent>
        </Card>
      )}

      {record.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">메모</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">{record.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">진료 기록 삭제</p>
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
