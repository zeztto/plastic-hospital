import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useEMR } from '@/contexts/EMRContext'
import type {
  Patient,
  MedicalRecord,
  ProcedureRecord,
  Prescription,
  Medication,
  ProcedureStatus,
} from '@/types/emr'
import {
  GENDER_LABELS,
  PROCEDURE_STATUS_LABELS,
  PROCEDURE_STATUS_COLORS,
  ANESTHESIA_TYPES,
} from '@/types/emr'
import {
  ArrowLeft,
  Plus,
  User,
  Stethoscope,
  Scissors,
  Pill,
  Activity,
  Trash2,
  Calendar,
} from 'lucide-react'

// ── Tab: 기본정보 ──
function InfoTab({ patient }: { patient: Patient }) {
  const fields = [
    { label: '차트번호', value: patient.chartNumber },
    { label: '이름', value: patient.name },
    { label: '생년월일', value: patient.birthDate },
    { label: '성별', value: GENDER_LABELS[patient.gender] },
    { label: '연락처', value: patient.phone },
    { label: '주소', value: patient.address || '-' },
    { label: '혈액형', value: patient.bloodType || '-' },
    { label: '등록일', value: patient.registeredAt.slice(0, 10) },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fields.map((f) => (
              <div key={f.label}>
                <p className="text-sm text-muted-foreground">{f.label}</p>
                <p className="font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">알레르기</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <Badge key={a} variant="destructive">
                  {a}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">없음</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">기왕력/병력</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {patient.medicalHistory || '특이사항 없음'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Tab: 진료기록 ──
function RecordsTab({
  patientId,
  records,
  onCreated,
}: {
  patientId: string
  records: MedicalRecord[]
  onCreated: () => void
}) {
  const { createRecord } = useEMR()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    date: '2026-02-03',
    doctorName: '김뷰티',
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

  const resetForm = () =>
    setForm({
      date: '2026-02-03',
      doctorName: '김뷰티',
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

  const handleSubmit = () => {
    if (!form.chiefComplaint || !form.diagnosis) return
    createRecord({
      patientId,
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
    resetForm()
    setOpen(false)
    onCreated()
  }

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          진료 기록 ({records.length}건)
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />새 진료기록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 진료기록 작성</DialogTitle>
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
                <Input value={form.chiefComplaint} onChange={(e) => set('chiefComplaint', e.target.value)} placeholder="환자 호소 증상" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>진단명 *</Label>
                  <Input value={form.diagnosis} onChange={(e) => set('diagnosis', e.target.value)} placeholder="진단명" />
                </div>
                <div className="space-y-1">
                  <Label>진단코드</Label>
                  <Input value={form.diagnosisCode} onChange={(e) => set('diagnosisCode', e.target.value)} placeholder="ICD-10" />
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
              <Button onClick={handleSubmit} className="w-full">저장</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>진료 기록이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{r.diagnosis}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.date} · {r.doctorName} · {r.diagnosisCode}
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">주소증:</span>{' '}
                  {r.chiefComplaint}
                </p>
                {r.vitalSigns && (
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {r.vitalSigns.bloodPressure && (
                      <span>BP {r.vitalSigns.bloodPressure}</span>
                    )}
                    {r.vitalSigns.pulse > 0 && (
                      <span>P {r.vitalSigns.pulse}bpm</span>
                    )}
                    {r.vitalSigns.temperature > 0 && (
                      <span>T {r.vitalSigns.temperature}°C</span>
                    )}
                    {r.vitalSigns.weight > 0 && (
                      <span>W {r.vitalSigns.weight}kg</span>
                    )}
                    {r.vitalSigns.height > 0 && (
                      <span>H {r.vitalSigns.height}cm</span>
                    )}
                  </div>
                )}
                {r.treatmentPlan && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">치료계획:</span>{' '}
                    {r.treatmentPlan}
                  </p>
                )}
                {r.notes && (
                  <p className="text-sm text-muted-foreground">{r.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: 시술기록 ──
function ProceduresTab({
  patientId,
  procedures,
  onCreated,
}: {
  patientId: string
  procedures: ProcedureRecord[]
  onCreated: () => void
}) {
  const { createProcedure } = useEMR()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    date: '2026-02-03',
    procedureName: '',
    doctor: '김뷰티',
    anesthesiaType: '',
    duration: '',
    details: '',
    complications: '',
    postOpInstructions: '',
    status: 'scheduled' as ProcedureStatus,
  })

  const resetForm = () =>
    setForm({
      date: '2026-02-03',
      procedureName: '',
      doctor: '김뷰티',
      anesthesiaType: '',
      duration: '',
      details: '',
      complications: '',
      postOpInstructions: '',
      status: 'scheduled',
    })

  const handleSubmit = () => {
    if (!form.procedureName) return
    createProcedure({
      patientId,
      medicalRecordId: '',
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
    resetForm()
    setOpen(false)
    onCreated()
  }

  const set = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          시술 기록 ({procedures.length}건)
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />새 시술기록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 시술기록 작성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>시술일</Label>
                  <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>시술명 *</Label>
                  <Input value={form.procedureName} onChange={(e) => set('procedureName', e.target.value)} placeholder="시술/수술명" />
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
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
              <Button onClick={handleSubmit} className="w-full">저장</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {procedures.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Scissors className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>시술 기록이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {procedures.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.procedureName}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.date} · {p.doctor} · {p.anesthesiaType} · {p.duration}
                    </p>
                  </div>
                  <Badge className={PROCEDURE_STATUS_COLORS[p.status]}>
                    {PROCEDURE_STATUS_LABELS[p.status]}
                  </Badge>
                </div>
                {p.details && (
                  <p className="text-sm">{p.details}</p>
                )}
                {p.complications && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">합병증:</span>{' '}
                    {p.complications}
                  </p>
                )}
                {p.postOpInstructions && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">주의사항:</span>{' '}
                    {p.postOpInstructions}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: 처방전 ──
function PrescriptionsTab({
  patientId,
  prescriptions,
  onCreated,
}: {
  patientId: string
  prescriptions: Prescription[]
  onCreated: () => void
}) {
  const { createPrescription } = useEMR()
  const [open, setOpen] = useState(false)
  const emptyMed: Medication = { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  const [form, setForm] = useState({
    date: '2026-02-03',
    doctorName: '김뷰티',
    notes: '',
  })
  const [meds, setMeds] = useState<Medication[]>([{ ...emptyMed }])

  const resetForm = () => {
    setForm({ date: '2026-02-03', doctorName: '김뷰티', notes: '' })
    setMeds([{ ...emptyMed }])
  }

  const updateMed = (idx: number, key: keyof Medication, value: string) => {
    setMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)))
  }

  const handleSubmit = () => {
    const validMeds = meds.filter((m) => m.name.trim())
    if (validMeds.length === 0) return
    createPrescription({
      patientId,
      medicalRecordId: '',
      date: form.date,
      doctorName: form.doctorName,
      medications: validMeds,
      notes: form.notes,
    })
    resetForm()
    setOpen(false)
    onCreated()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          처방전 ({prescriptions.length}건)
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />새 처방전
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 처방전 작성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>처방일</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>담당의</Label>
                  <Input value={form.doctorName} onChange={(e) => setForm((p) => ({ ...p, doctorName: e.target.value }))} />
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
                  onClick={() => setMeds((prev) => [...prev, { ...emptyMed }])}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  약물 추가
                </Button>
              </div>

              {meds.map((med, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      약물 {idx + 1}
                    </p>
                    {meds.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-destructive"
                        onClick={() => setMeds((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="약물명 *" value={med.name} onChange={(e) => updateMed(idx, 'name', e.target.value)} />
                    <Input placeholder="용량 (예: 500mg)" value={med.dosage} onChange={(e) => updateMed(idx, 'dosage', e.target.value)} />
                    <Input placeholder="복용횟수 (예: 1일 3회)" value={med.frequency} onChange={(e) => updateMed(idx, 'frequency', e.target.value)} />
                    <Input placeholder="기간 (예: 5일)" value={med.duration} onChange={(e) => updateMed(idx, 'duration', e.target.value)} />
                  </div>
                  <Input placeholder="복용지침" value={med.instructions} onChange={(e) => updateMed(idx, 'instructions', e.target.value)} />
                </div>
              ))}

              <Separator />
              <div className="space-y-1">
                <Label>비고</Label>
                <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} />
              </div>
              <Button onClick={handleSubmit} className="w-full">저장</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Pill className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>처방전이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">처방전</p>
                    <p className="text-xs text-muted-foreground">
                      {rx.date} · {rx.doctorName}
                    </p>
                  </div>
                  <Badge variant="outline">{rx.medications.length}종</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-1 pr-3">약물명</th>
                        <th className="pb-1 pr-3">용량</th>
                        <th className="pb-1 pr-3">횟수</th>
                        <th className="pb-1 pr-3">기간</th>
                        <th className="pb-1">지침</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rx.medications.map((m, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-1.5 pr-3 font-medium">{m.name}</td>
                          <td className="py-1.5 pr-3">{m.dosage}</td>
                          <td className="py-1.5 pr-3">{m.frequency}</td>
                          <td className="py-1.5 pr-3">{m.duration}</td>
                          <td className="py-1.5 text-muted-foreground">{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rx.notes && (
                  <p className="text-sm text-muted-foreground">{rx.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main ──
export function PatientChart() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPatient, getRecords, getProcedures, getPrescriptions, refresh } =
    useEMR()

  const [patient, setPatient] = useState<Patient | undefined>()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [procedures, setProcedures] = useState<ProcedureRecord[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  const loadData = () => {
    if (!id) return
    setPatient(getPatient(id))
    setRecords(getRecords(id))
    setProcedures(getProcedures(id))
    setPrescriptions(getPrescriptions(id))
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleCreated = () => {
    refresh()
    loadData()
  }

  if (!patient) {
    return (
      <div className="text-center py-16">
        <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground mb-4">
          환자를 찾을 수 없습니다.
        </p>
        <Button variant="outline" asChild>
          <Link to="/emr/patients">환자 목록으로</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/emr/patients')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {patient.name}
            </h1>
            <Badge variant="outline">{patient.chartNumber}</Badge>
            <Badge variant="secondary">
              {GENDER_LABELS[patient.gender]}
            </Badge>
            {patient.bloodType && (
              <Badge variant="secondary">{patient.bloodType}</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {patient.birthDate} · {patient.phone}
          </p>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="info" className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            기본정보
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4" />
            진료기록
          </TabsTrigger>
          <TabsTrigger value="procedures" className="flex items-center gap-1.5">
            <Scissors className="w-4 h-4" />
            시술기록
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center gap-1.5">
            <Pill className="w-4 h-4" />
            처방전
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <InfoTab patient={patient} />
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <RecordsTab
            patientId={patient.id}
            records={records}
            onCreated={handleCreated}
          />
        </TabsContent>

        <TabsContent value="procedures" className="mt-6">
          <ProceduresTab
            patientId={patient.id}
            procedures={procedures}
            onCreated={handleCreated}
          />
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-6">
          <PrescriptionsTab
            patientId={patient.id}
            prescriptions={prescriptions}
            onCreated={handleCreated}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
