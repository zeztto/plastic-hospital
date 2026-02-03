import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Patient, MedicalRecord, ProcedureRecord, Prescription, ProcedureStatus } from '@/types/emr'
import { emrStorage } from '@/services/emrStorage'

interface EMRContextValue {
  patients: Patient[]
  refresh: () => void
  getPatient: (id: string) => Patient | undefined
  createPatient: (data: Omit<Patient, 'id' | 'chartNumber' | 'registeredAt'>) => Patient
  updatePatient: (id: string, data: Partial<Patient>) => void
  // Records
  getRecords: (patientId: string) => MedicalRecord[]
  getRecordById: (id: string) => MedicalRecord | undefined
  createRecord: (data: Omit<MedicalRecord, 'id' | 'createdAt'>) => MedicalRecord
  updateRecord: (id: string, data: Partial<MedicalRecord>) => void
  deleteRecord: (id: string) => boolean
  // Procedures
  getProcedures: (patientId: string) => ProcedureRecord[]
  getProcedureById: (id: string) => ProcedureRecord | undefined
  createProcedure: (data: Omit<ProcedureRecord, 'id' | 'createdAt'>) => ProcedureRecord
  updateProcedure: (id: string, data: Partial<ProcedureRecord>) => void
  updateProcedureStatus: (id: string, status: ProcedureStatus) => void
  deleteProcedure: (id: string) => boolean
  // Prescriptions
  getPrescriptions: (patientId: string) => Prescription[]
  getPrescriptionById: (id: string) => Prescription | undefined
  createPrescription: (data: Omit<Prescription, 'id' | 'createdAt'>) => Prescription
  deletePrescription: (id: string) => boolean
  stats: ReturnType<typeof emrStorage.getStats>
}

const EMRContext = createContext<EMRContextValue | null>(null)

export function EMRProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [stats, setStats] = useState(emrStorage.getStats())

  const refresh = useCallback(() => {
    setPatients(emrStorage.getPatients())
    setStats(emrStorage.getStats())
  }, [])

  useEffect(() => {
    emrStorage.seedDemoData()
    refresh()
  }, [refresh])

  const getPatient = useCallback((id: string) => emrStorage.getPatientById(id), [])

  const createPatient = useCallback(
    (data: Omit<Patient, 'id' | 'chartNumber' | 'registeredAt'>) => {
      const p = emrStorage.createPatient(data)
      refresh()
      return p
    },
    [refresh]
  )

  const updatePatient = useCallback(
    (id: string, data: Partial<Patient>) => {
      emrStorage.updatePatient(id, data)
      refresh()
    },
    [refresh]
  )

  // ── Records ──
  const getRecords = useCallback((pid: string) => emrStorage.getRecordsByPatient(pid), [])
  const getRecordById = useCallback((id: string) => emrStorage.getRecordById(id), [])
  const createRecord = useCallback(
    (data: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
      const r = emrStorage.createRecord(data)
      refresh()
      return r
    },
    [refresh]
  )
  const updateRecord = useCallback(
    (id: string, data: Partial<MedicalRecord>) => {
      emrStorage.updateRecord(id, data)
      refresh()
    },
    [refresh]
  )
  const deleteRecord = useCallback(
    (id: string) => {
      const ok = emrStorage.deleteRecord(id)
      if (ok) refresh()
      return ok
    },
    [refresh]
  )

  // ── Procedures ──
  const getProcedures = useCallback((pid: string) => emrStorage.getProceduresByPatient(pid), [])
  const getProcedureById = useCallback((id: string) => emrStorage.getProcedureById(id), [])
  const createProcedure = useCallback(
    (data: Omit<ProcedureRecord, 'id' | 'createdAt'>) => {
      const p = emrStorage.createProcedure(data)
      refresh()
      return p
    },
    [refresh]
  )
  const updateProcedure = useCallback(
    (id: string, data: Partial<ProcedureRecord>) => {
      emrStorage.updateProcedure(id, data)
      refresh()
    },
    [refresh]
  )
  const updateProcedureStatus = useCallback(
    (id: string, status: ProcedureStatus) => {
      emrStorage.updateProcedureStatus(id, status)
      refresh()
    },
    [refresh]
  )
  const deleteProcedure = useCallback(
    (id: string) => {
      const ok = emrStorage.deleteProcedure(id)
      if (ok) refresh()
      return ok
    },
    [refresh]
  )

  // ── Prescriptions ──
  const getPrescriptions = useCallback((pid: string) => emrStorage.getPrescriptionsByPatient(pid), [])
  const getPrescriptionById = useCallback((id: string) => emrStorage.getPrescriptionById(id), [])
  const createPrescription = useCallback(
    (data: Omit<Prescription, 'id' | 'createdAt'>) => {
      const rx = emrStorage.createPrescription(data)
      refresh()
      return rx
    },
    [refresh]
  )
  const deletePrescription = useCallback(
    (id: string) => {
      const ok = emrStorage.deletePrescription(id)
      if (ok) refresh()
      return ok
    },
    [refresh]
  )

  return (
    <EMRContext.Provider
      value={{
        patients, refresh, getPatient, createPatient, updatePatient,
        getRecords, getRecordById, createRecord, updateRecord, deleteRecord,
        getProcedures, getProcedureById, createProcedure, updateProcedure, updateProcedureStatus, deleteProcedure,
        getPrescriptions, getPrescriptionById, createPrescription, deletePrescription,
        stats,
      }}
    >
      {children}
    </EMRContext.Provider>
  )
}

export function useEMR() {
  const ctx = useContext(EMRContext)
  if (!ctx) throw new Error('useEMR must be used within EMRProvider')
  return ctx
}
