import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import type { Patient, MedicalRecord, ProcedureRecord, Prescription, ProcedureStatus } from '@/types/emr'
import { emrStorage } from '@/services/emrStorage'

interface EMRContextValue {
  patients: Patient[]
  refresh: () => void
  getPatient: (id: string) => Patient | undefined
  createPatient: (data: Omit<Patient, 'id' | 'chartNumber' | 'registeredAt'>) => Patient
  updatePatient: (id: string, data: Partial<Patient>) => void
  deletePatient: (id: string) => boolean
  // Records
  getAllRecords: () => MedicalRecord[]
  getRecords: (patientId: string) => MedicalRecord[]
  getRecordById: (id: string) => MedicalRecord | undefined
  createRecord: (data: Omit<MedicalRecord, 'id' | 'createdAt'>) => MedicalRecord
  updateRecord: (id: string, data: Partial<MedicalRecord>) => void
  deleteRecord: (id: string) => boolean
  // Procedures
  getAllProcedures: () => ProcedureRecord[]
  getProcedures: (patientId: string) => ProcedureRecord[]
  getProcedureById: (id: string) => ProcedureRecord | undefined
  createProcedure: (data: Omit<ProcedureRecord, 'id' | 'createdAt'>) => ProcedureRecord
  updateProcedure: (id: string, data: Partial<ProcedureRecord>) => void
  updateProcedureStatus: (id: string, status: ProcedureStatus) => void
  deleteProcedure: (id: string) => boolean
  // Prescriptions
  getAllPrescriptions: () => Prescription[]
  getPrescriptions: (patientId: string) => Prescription[]
  getPrescriptionById: (id: string) => Prescription | undefined
  createPrescription: (data: Omit<Prescription, 'id' | 'createdAt'>) => Prescription
  updatePrescription: (id: string, data: Partial<Prescription>) => void
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
  const deletePatient = useCallback(
    (id: string) => {
      const ok = emrStorage.deletePatient(id)
      if (ok) refresh()
      return ok
    },
    [refresh]
  )

  // ── Records ──
  const getAllRecords = useCallback(() => emrStorage.getAllRecords(), [])
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
  const getAllProcedures = useCallback(() => emrStorage.getAllProcedures(), [])
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
  const getAllPrescriptions = useCallback(() => emrStorage.getAllPrescriptions(), [])
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
  const updatePrescription = useCallback(
    (id: string, data: Partial<Prescription>) => {
      emrStorage.updatePrescription(id, data)
      refresh()
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

  const value = useMemo(
    () => ({
      patients, refresh, getPatient, createPatient, updatePatient, deletePatient,
      getAllRecords, getRecords, getRecordById, createRecord, updateRecord, deleteRecord,
      getAllProcedures, getProcedures, getProcedureById, createProcedure, updateProcedure, updateProcedureStatus, deleteProcedure,
      getAllPrescriptions, getPrescriptions, getPrescriptionById, createPrescription, updatePrescription, deletePrescription,
      stats,
    }),
    [patients, refresh, getPatient, createPatient, updatePatient, deletePatient,
      getAllRecords, getRecords, getRecordById, createRecord, updateRecord, deleteRecord,
      getAllProcedures, getProcedures, getProcedureById, createProcedure, updateProcedure, updateProcedureStatus, deleteProcedure,
      getAllPrescriptions, getPrescriptions, getPrescriptionById, createPrescription, updatePrescription, deletePrescription,
      stats]
  )

  return (
    <EMRContext.Provider value={value}>
      {children}
    </EMRContext.Provider>
  )
}

export function useEMR() {
  const ctx = useContext(EMRContext)
  if (!ctx) throw new Error('useEMR must be used within EMRProvider')
  return ctx
}
