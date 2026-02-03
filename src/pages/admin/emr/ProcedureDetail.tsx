import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useEMR } from '@/contexts/EMRContext'
import {
  PROCEDURE_STATUS_LABELS,
  PROCEDURE_STATUS_COLORS,
  GENDER_LABELS,
  ANESTHESIA_TYPES,
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
  Pencil,
  Loader2,
} from 'lucide-react'

export function ProcedureDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProcedureById, getPatient, updateProcedure, updateProcedureStatus, deleteProcedure } = useEMR()

  const [procedure, setProcedure] = useState<ProcedureRecord | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    date: '',
    procedureName: '',
    doctor: '',
    anesthesiaType: '',
    duration: '',
    details: '',
    complications: '',
    postOpInstructions: '',
    status: 'scheduled' as ProcedureStatus,
  })

  const loadData = () => {
    if (!id) return
    const p = getProcedureById(id)
    setProcedure(p)
    if (p) setPatient(getPatient(p.patientId))
  }

  useEffect(() => {
    loadData()
    setIsLoading(false)
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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

  const handleEditOpen = () => {
    setForm({
      date: procedure.date,
      procedureName: procedure.procedureName,
      doctor: procedure.doctor,
      anesthesiaType: procedure.anesthesiaType,
      duration: procedure.duration,
      details: procedure.details,
      complications: procedure.complications,
      postOpInstructions: procedure.postOpInstructions,
      status: procedure.status,
    })
    setEditOpen(true)
  }

  const handleEditSubmit = () => {
    if (!form.procedureName) return
    updateProcedure(procedure.id, {
      date: form.date,
      procedureName: form.procedureName,
      doctor: form.doctor,
      anesthesiaType: form.anesthesiaType,
      duration: form.duration,
      details: form.details,
      complications: form.complications,
      postOpInstructions: form.postOpInstructions,
      status: form.status,
    })
    setEditOpen(false)
    toast.success('시술 기록이 수정되었습니다.')
    loadData()
  }

  const handleStatusChange = (status: ProcedureStatus) => {
    updateProcedureStatus(procedure.id, status)
    toast.success('시술 상태가 변경되었습니다.')
    loadData()
  }

  const handleDelete = () => {
    deleteProcedure(procedure.id)
    toast.success('시술 기록이 삭제되었습니다.')
    navigate('/emr/procedures')
  }

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }))

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
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleEditOpen}>
              <Pencil className="w-4 h-4 mr-1" />수정
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>시술기록 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>시술일</Label>
                  <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>시술명 *</Label>
                  <Input value={form.procedureName} onChange={(e) => set('procedureName', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>담당의</Label>
                  <Input value={form.doctor} onChange={(e) => set('doctor', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>마취방법</Label>
                  <Select value={form.anesthesiaType} onValueChange={(v) => set('anesthesiaType', v)}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      {ANESTHESIA_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>소요시간</Label>
                  <Input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="예: 40분" />
                </div>
                <div className="space-y-1">
                  <Label>상태</Label>
                  <Select value={form.status} onValueChange={(v) => set('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">예정</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="cancelled">취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>시술 상세</Label>
                <Textarea value={form.details} onChange={(e) => set('details', e.target.value)} rows={2} />
              </div>
              <div className="space-y-1">
                <Label>합병증</Label>
                <Input value={form.complications} onChange={(e) => set('complications', e.target.value)} placeholder="없음" />
              </div>
              <div className="space-y-1">
                <Label>수술 후 주의사항</Label>
                <Textarea value={form.postOpInstructions} onChange={(e) => set('postOpInstructions', e.target.value)} rows={2} />
              </div>
              <Button onClick={handleEditSubmit} className="w-full">저장</Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>삭제 확인</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 시술 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">삭제</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
