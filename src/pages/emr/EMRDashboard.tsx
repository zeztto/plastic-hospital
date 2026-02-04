import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEMR } from '@/contexts/EMRContext'
import { emrStorage } from '@/services/emrStorage'
import {
  GENDER_LABELS,
  PROCEDURE_STATUS_COLORS,
} from '@/types/emr'
import {
  Users,
  Stethoscope,
  Scissors,
  Pill,
  CalendarDays,
  UserPlus,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'

export function EMRDashboard() {
  const { patients, stats } = useEMR()

  const allRecords = useMemo(() => {
    return patients
      .flatMap((p) =>
        emrStorage.getRecordsByPatient(p.id).map((r) => ({
          ...r,
          patientName: p.name,
          patientChartNumber: p.chartNumber,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [patients])

  const allProcedures = useMemo(() => {
    return patients
      .flatMap((p) =>
        emrStorage.getProceduresByPatient(p.id).map((pr) => ({
          ...pr,
          patientName: p.name,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [patients])

  const allPrescriptions = useMemo(() => {
    return patients
      .flatMap((p) =>
        emrStorage.getPrescriptionsByPatient(p.id).map((rx) => ({
          ...rx,
          patientName: p.name,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [patients])

  const scheduledProcedures = allProcedures.filter((p) => p.status === 'scheduled')
  const completedProcedures = allProcedures.filter((p) => p.status === 'completed')

  const recentPatients = patients.slice(0, 5)
  const recentRecords = allRecords.slice(0, 5)
  const recentPrescriptions = allPrescriptions.slice(0, 3)

  const patientsWithAllergies = patients.filter((p) => p.allergies.length > 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">EMR 대시보드</h1>
        <p className="text-muted-foreground mt-1">전자의무기록 시스템 현황</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">전체 환자</p>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">진료 기록</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">총 시술</p>
                <p className="text-2xl font-bold">{stats.totalProcedures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">예정 시술</p>
                <p className="text-2xl font-bold">{stats.scheduledProcedures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">완료 시술</p>
                <p className="text-2xl font-bold">{completedProcedures.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Pill className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">처방전</p>
                <p className="text-2xl font-bold">{allPrescriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="w-5 h-5 text-primary" />
              예정된 시술 ({scheduledProcedures.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledProcedures.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                예정된 시술이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {scheduledProcedures.slice(0, 5).map((proc) => (
                  <Link
                    key={proc.id}
                    to={`/emr/procedures/${proc.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{proc.procedureName}</p>
                      <p className="text-xs text-muted-foreground">
                        {proc.patientName} · {proc.doctor} · {proc.anesthesiaType}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={PROCEDURE_STATUS_COLORS[proc.status]}>
                        {proc.date}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
             )}
            <Link
              to="/emr/procedures"
              className="block text-sm text-primary hover:underline text-center mt-4"
            >
              전체 시술 기록 →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="w-5 h-5 text-primary" />
              최근 등록 환자
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPatients.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                등록된 환자가 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/emr/patients/${patient.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-sm">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.chartNumber} · {GENDER_LABELS[patient.gender]} · {patient.birthDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {patient.registeredAt.slice(0, 10)}
                      </p>
                      {patient.allergies.length > 0 && (
                        <Badge variant="destructive" className="text-[10px] mt-0.5">
                          알레르기 {patient.allergies.length}건
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/emr/patients"
              className="block text-sm text-primary hover:underline text-center mt-4"
            >
              전체 환자 목록 →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="w-5 h-5 text-primary" />
              최근 진료 기록
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecords.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                진료 기록이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {recentRecords.map((record) => (
                  <Link
                    key={record.id}
                    to={`/emr/records/${record.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{record.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.patientName} · {record.doctorName} · {record.diagnosisCode}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {record.date}
                    </p>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/emr/records"
              className="block text-sm text-primary hover:underline text-center mt-4"
            >
              전체 진료 기록 →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              알레르기 유의 환자 ({patientsWithAllergies.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientsWithAllergies.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                알레르기 등록 환자가 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {patientsWithAllergies.slice(0, 5).map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/emr/patients/${patient.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.chartNumber} · {patient.phone}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                      {patient.allergies.map((a) => (
                        <Badge key={a} variant="destructive" className="text-[10px]">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {recentPrescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="w-5 h-5 text-primary" />
              최근 처방전
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPrescriptions.map((rx) => (
                <Link
                  key={rx.id}
                  to={`/emr/prescriptions/${rx.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {rx.patientName} — {rx.medications.length}종 처방
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rx.doctorName} · {rx.medications.map((m) => m.name).join(', ')}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {rx.date}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/emr/prescriptions"
              className="block text-sm text-primary hover:underline text-center mt-4"
            >
              전체 처방전 →
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
