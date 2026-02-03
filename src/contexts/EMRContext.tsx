import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Patient, MedicalRecord, ProcedureRecord, Prescription, ProcedureStatus } from '@/types/emr'
import { emrStorage } from '@/services/emrStorage'

interface EMRContextValue {
  patients: Patient[]
  refresh: () => void
  getPatient: (id: string) => Patient | undefined
  createPatient: (data: Omit<Patient, 'id' | 'chartNumber' | 'registeredAt'>) => Patient
  updatePatient: (id: string, data: Partial<Patient>) => void
  getRecords: (patientId: string) => MedicalRecord[]
  createRecord: (data: Omit<MedicalRecord, 'id' | 'createdAt'>) => MedicalRecord
  getProcedures: (patientId: string) => ProcedureRecord[]
  createProcedure: (data: Omit<ProcedureRecord, 'id' | 'createdAt'>) => ProcedureRecord
  updateProcedureStatus: (id: string, status: ProcedureStatus) => void
  getPrescriptions: (patientId: string) => Prescription[]
  createPrescription: (data: Omit<Prescription, 'id' | 'createdAt'>) => Prescription
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

  const getRecords = useCallback((pid: string) => emrStorage.getRecordsByPatient(pid), [])
  const createRecord = useCallback(
    (data: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
      const r = emrStorage.createRecord(data)
      refresh()
      return r
    },
    [refresh]
  )

  const getProcedures = useCallback((pid: string) => emrStorage.getProceduresByPatient(pid), [])
  const createProcedure = useCallback(
    (data: Omit<ProcedureRecord, 'id' | 'createdAt'>) => {
      const p = emrStorage.createProcedure(data)
      refresh()
      return p
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

  const getPrescriptions = useCallback((pid: string) => emrStorage.getPrescriptionsByPatient(pid), [])
  const createPrescription = useCallback(
    (data: Omit<Prescription, 'id' | 'createdAt'>) => {
      const rx = emrStorage.createPrescription(data)
      refresh()
      return rx
    },
    [refresh]
  )

  return (
    <EMRContext.Provider
      value={{
        patients, refresh, getPatient, createPatient, updatePatient,
        getRecords, createRecord,
        getProcedures, createProcedure, updateProcedureStatus,
        getPrescriptions, createPrescription,
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
