import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  Pencil,
  Loader2,
} from 'lucide-react'

export function RecordDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRecordById, getPatient, updateRecord, deleteRecord } = useEMR()

  const [record, setRecord] = useState<MedicalRecord | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    date: '',
    doctorName: '',
    chiefComplaint: '',
    diagnosis: '',
    diagnosisCode: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    weight: '',
    height: '',
    treatmentPlan: '',
    notes: '',
  })

  const loadData = () => {
    if (!id) return
    const r = getRecordById(id)
    setRecord(r)
    if (r) setPatient(getPatient(r.patientId))
  }

  useEffect(() => {
    loadData()
    setIsLoading(false)
  }, [id, getRecordById, getPatient])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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

  const handleEditOpen = () => {
    setForm({
      date: record.date,
      doctorName: record.doctorName,
      chiefComplaint: record.chiefComplaint,
      diagnosis: record.diagnosis,
      diagnosisCode: record.diagnosisCode,
      bloodPressure: record.vitalSigns.bloodPressure,
      pulse: String(record.vitalSigns.pulse || ''),
      temperature: String(record.vitalSigns.temperature || ''),
      weight: String(record.vitalSigns.weight || ''),
      height: String(record.vitalSigns.height || ''),
      treatmentPlan: record.treatmentPlan,
      notes: record.notes,
    })
    setEditOpen(true)
  }

  const handleEditSubmit = () => {
    if (!form.chiefComplaint || !form.diagnosis) return
    updateRecord(record.id, {
      date: form.date,
      doctorName: form.doctorName,
      chiefComplaint: form.chiefComplaint,
      diagnosis: form.diagnosis,
      diagnosisCode: form.diagnosisCode,
      vitalSigns: {
        bloodPressure: form.bloodPressure,
        pulse: Number(form.pulse) || 0,
        temperature: Number(form.temperature) || 0,
        weight: Number(form.weight) || 0,
        height: Number(form.height) || 0,
      },
      treatmentPlan: form.treatmentPlan,
      notes: form.notes,
    })
    setEditOpen(false)
    toast.success('진료 기록이 수정되었습니다.')
    loadData()
  }

  const handleDelete = () => {
    deleteRecord(record.id)
    toast.success('진료 기록이 삭제되었습니다.')
    navigate('/emr/records')
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
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleEditOpen}>
              <Pencil className="w-4 h-4 mr-1" />수정
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>진료기록 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>진료일</Label>
                  <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>담당의</Label>
                  <Input value={form.doctorName} onChange={(e) => set('doctorName', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>주소증 *</Label>
                <Input value={form.chiefComplaint} onChange={(e) => set('chiefComplaint', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>진단명 *</Label>
                  <Input value={form.diagnosis} onChange={(e) => set('diagnosis', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>진단코드</Label>
                  <Input value={form.diagnosisCode} onChange={(e) => set('diagnosisCode', e.target.value)} />
                </div>
              </div>
              <Separator />
              <p className="text-sm font-medium flex items-center gap-1">
                <Activity className="w-4 h-4" /> 바이탈 사인
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">혈압</Label>
                  <Input value={form.bloodPressure} onChange={(e) => set('bloodPressure', e.target.value)} placeholder="120/80" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">맥박 (bpm)</Label>
                  <Input type="number" value={form.pulse} onChange={(e) => set('pulse', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">체온 (°C)</Label>
                  <Input type="number" step="0.1" value={form.temperature} onChange={(e) => set('temperature', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">체중 (kg)</Label>
                  <Input type="number" value={form.weight} onChange={(e) => set('weight', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">신장 (cm)</Label>
                  <Input type="number" value={form.height} onChange={(e) => set('height', e.target.value)} />
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <Label>치료 계획</Label>
                <Textarea value={form.treatmentPlan} onChange={(e) => set('treatmentPlan', e.target.value)} rows={2} />
              </div>
              <div className="space-y-1">
                <Label>메모</Label>
                <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} />
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
                    이 진료 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
