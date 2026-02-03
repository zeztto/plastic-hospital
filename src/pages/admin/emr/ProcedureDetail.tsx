import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEMR } from '@/contexts/EMRContext'
import {
  PROCEDURE_STATUS_LABELS,
  PROCEDURE_STATUS_COLORS,
  GENDER_LABELS,
} from '@/types/emr'
import type { ProcedureRecord, Patient, ProcedureStatus } from '@/types/emr'
import {
  ArrowLeft,
  Scissors,
  User,
  Calendar,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

export function ProcedureDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProcedureById, getPatient, updateProcedureStatus, deleteProcedure } = useEMR()

  const [procedure, setProcedure] = useState<ProcedureRecord | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()

  const loadData = () => {
    if (!id) return
    const p = getProcedureById(id)
    setProcedure(p)
    if (p) setPatient(getPatient(p.patientId))
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (!procedure) {
    return (
      <div className="text-center py-16">
        <Scissors className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground mb-4">시술 기록을 찾을 수 없습니다.</p>
        <Button variant="outline" asChild>
          <Link to="/emr/procedures">시술 기록 목록으로</Link>
        </Button>
      </div>
    )
  }

  const handleStatusChange = (status: ProcedureStatus) => {
    updateProcedureStatus(procedure.id, status)
    loadData()
  }

  const handleDelete = () => {
    if (window.confirm('이 시술 기록을 삭제하시겠습니까?')) {
      deleteProcedure(procedure.id)
      navigate('/emr/procedures')
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
              {procedure.procedureName}
            </h1>
            <Badge className={PROCEDURE_STATUS_COLORS[procedure.status]}>
              {PROCEDURE_STATUS_LABELS[procedure.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {procedure.date} · {procedure.doctor}
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
            <Scissors className="w-5 h-5 text-primary" />
            시술 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">시술일</p>
              <p className="font-medium">{procedure.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">담당의</p>
              <p className="font-medium">{procedure.doctor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">마취방법</p>
              <p className="font-medium">{procedure.anesthesiaType || '-'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">소요시간</p>
                <p className="font-medium">{procedure.duration || '-'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {procedure.details && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">시술 상세</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{procedure.details}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">합병증</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{procedure.complications || '없음'}</p>
        </CardContent>
      </Card>

      {procedure.postOpInstructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">수술 후 주의사항</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{procedure.postOpInstructions}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">상태 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={procedure.status === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('scheduled')}
              className={procedure.status === 'scheduled' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              예정
            </Button>
            <Button
              variant={procedure.status === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('completed')}
              className={procedure.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              완료
            </Button>
            <Button
              variant={procedure.status === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('cancelled')}
              className={procedure.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <XCircle className="w-4 h-4 mr-1" />
              취소
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">시술 기록 삭제</p>
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
