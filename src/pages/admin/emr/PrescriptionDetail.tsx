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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import type { Prescription, Patient, Medication } from '@/types/emr'
import { ArrowLeft, Pill, User, Trash2, AlertTriangle, Pencil, Plus, Loader2 } from 'lucide-react'

export function PrescriptionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPrescriptionById, getPatient, updatePrescription, deletePrescription } = useEMR()

  const [prescription, setPrescription] = useState<Prescription | undefined>()
  const [patient, setPatient] = useState<Patient | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const emptyMed: Medication = { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  const [editForm, setEditForm] = useState({ date: '', doctorName: '', notes: '' })
  const [editMeds, setEditMeds] = useState<Medication[]>([{ ...emptyMed }])

  const loadData = () => {
    if (!id) return
    const rx = getPrescriptionById(id)
    setPrescription(rx)
    if (rx) setPatient(getPatient(rx.patientId))
  }

  useEffect(() => {
    loadData()
    setIsLoading(false)
  }, [id, getPrescriptionById, getPatient])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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

  const handleEditOpen = () => {
    setEditForm({
      date: prescription.date,
      doctorName: prescription.doctorName,
      notes: prescription.notes,
    })
    setEditMeds(prescription.medications.map((m) => ({ ...m })))
    setEditOpen(true)
  }

  const updateMed = (idx: number, key: keyof Medication, value: string) => {
    setEditMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)))
  }

  const handleEditSubmit = () => {
    const validMeds = editMeds.filter((m) => m.name.trim())
    if (validMeds.length === 0) return
    updatePrescription(prescription.id, {
      date: editForm.date,
      doctorName: editForm.doctorName,
      medications: validMeds,
      notes: editForm.notes,
    })
    setEditOpen(false)
    toast.success('처방전이 수정되었습니다.')
    loadData()
  }

  const handleDelete = () => {
    deletePrescription(prescription.id)
    toast.success('처방전이 삭제되었습니다.')
    navigate(`/emr/patients/${prescription.patientId}`)
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
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleEditOpen}>
              <Pencil className="w-4 h-4 mr-1" />수정
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>처방전 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>처방일</Label>
                  <Input type="date" value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>담당의</Label>
                  <Input value={editForm.doctorName} onChange={(e) => setEditForm((p) => ({ ...p, doctorName: e.target.value }))} />
                </div>
              </div>

              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Pill className="w-4 h-4" /> 약물 목록
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMeds((prev) => [...prev, { ...emptyMed }])}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  약물 추가
                </Button>
              </div>

              {editMeds.map((med, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      약물 {idx + 1}
                    </p>
                    {editMeds.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-destructive"
                        onClick={() => setEditMeds((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="약물명 *" value={med.name} onChange={(e) => updateMed(idx, 'name', e.target.value)} />
                    <Input placeholder="용량" value={med.dosage} onChange={(e) => updateMed(idx, 'dosage', e.target.value)} />
                    <Input placeholder="복용횟수" value={med.frequency} onChange={(e) => updateMed(idx, 'frequency', e.target.value)} />
                    <Input placeholder="기간" value={med.duration} onChange={(e) => updateMed(idx, 'duration', e.target.value)} />
                  </div>
                  <Input placeholder="복용지침" value={med.instructions} onChange={(e) => updateMed(idx, 'instructions', e.target.value)} />
                </div>
              ))}

              <Separator />
              <div className="space-y-1">
                <Label>비고</Label>
                <Textarea value={editForm.notes} onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} rows={2} />
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
                    이 처방전을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
