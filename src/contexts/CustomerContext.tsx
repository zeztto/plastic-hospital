import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import type {
  Customer,
  CustomerGrade,
  MemoType,
  FollowUpTask,
  FollowUpStatus,
} from '@/types/customer'
import { customerStorage } from '@/services/customerStorage'
import { bookingStorage } from '@/services/bookingStorage'

interface CustomerContextValue {
  customers: Customer[]
  followUps: FollowUpTask[]
  pendingFollowUps: FollowUpTask[]
  refresh: () => void
  getCustomerById: (id: string) => Customer | undefined
  getCustomerByPhone: (phone: string) => Customer | undefined
  updateGrade: (id: string, grade: CustomerGrade) => void
  addMemo: (id: string, memo: { content: string; type: MemoType }) => void
  deleteMemo: (customerId: string, memoId: string) => void
  addTag: (id: string, tag: string) => void
  removeTag: (id: string, tag: string) => void
  updateFollowUpStatus: (id: string, status: FollowUpStatus, note?: string) => void
  getFollowUpsByCustomer: (customerId: string) => FollowUpTask[]
}

const CustomerContext = createContext<CustomerContextValue | null>(null)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [followUps, setFollowUps] = useState<FollowUpTask[]>([])

  const pendingFollowUps = useMemo(
    () => followUps.filter((f) => f.status === 'pending'),
    [followUps]
  )

  const refresh = useCallback(() => {
    setCustomers(customerStorage.getAll())
    setFollowUps(customerStorage.getFollowUps())
  }, [])

  useEffect(() => {
    const bookings = bookingStorage.getAll()
    customerStorage.seedDemoData(bookings)
    refresh()
  }, [refresh])

  const getCustomerById = useCallback(
    (id: string) => customerStorage.getById(id),
    []
  )

  const getCustomerByPhone = useCallback(
    (phone: string) => customerStorage.getByPhone(phone),
    []
  )

  const updateGrade = useCallback(
    (id: string, grade: CustomerGrade) => {
      customerStorage.updateGrade(id, grade)
      refresh()
    },
    [refresh]
  )

  const addMemo = useCallback(
    (id: string, memo: { content: string; type: MemoType }) => {
      customerStorage.addMemo(id, memo)
      refresh()
    },
    [refresh]
  )

  const deleteMemo = useCallback(
    (customerId: string, memoId: string) => {
      customerStorage.deleteMemo(customerId, memoId)
      refresh()
    },
    [refresh]
  )

  const addTag = useCallback(
    (id: string, tag: string) => {
      customerStorage.addTag(id, tag)
      refresh()
    },
    [refresh]
  )

  const removeTag = useCallback(
    (id: string, tag: string) => {
      customerStorage.removeTag(id, tag)
      refresh()
    },
    [refresh]
  )

  const updateFollowUpStatus = useCallback(
    (id: string, status: FollowUpStatus, note?: string) => {
      customerStorage.updateFollowUpStatus(id, status, note)
      refresh()
    },
    [refresh]
  )

  const getFollowUpsByCustomer = useCallback(
    (customerId: string) => customerStorage.getFollowUpsByCustomer(customerId),
    []
  )

  const value = useMemo(
    () => ({
      customers,
      followUps,
      pendingFollowUps,
      refresh,
      getCustomerById,
      getCustomerByPhone,
      updateGrade,
      addMemo,
      deleteMemo,
      addTag,
      removeTag,
      updateFollowUpStatus,
      getFollowUpsByCustomer,
    }),
    [customers, followUps, pendingFollowUps, refresh, getCustomerById, getCustomerByPhone, updateGrade, addMemo, deleteMemo, addTag, removeTag, updateFollowUpStatus, getFollowUpsByCustomer]
  )

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomers() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider')
  return ctx
}
