import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Booking, BookingFormData, BookingStatus, JourneyStage } from '@/types/booking'
import { bookingStorage } from '@/services/bookingStorage'

interface BookingContextValue {
  bookings: Booking[]
  refresh: () => void
  create: (data: BookingFormData) => Booking
  updateStatus: (id: string, status: BookingStatus) => void
  updateMemo: (id: string, memo: string) => void
  updateJourneyStage: (id: string, stage: JourneyStage, note?: string) => void
  deleteBooking: (id: string) => void
  getById: (id: string) => Booking | undefined
  stats: ReturnType<typeof bookingStorage.getStats>
  marketingStats: ReturnType<typeof bookingStorage.getMarketingStats>
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    bookingStorage.seedDemoData()
    return bookingStorage.getAll()
  })
  const [stats, setStats] = useState(() => bookingStorage.getStats())
  const [marketingStats, setMarketingStats] = useState(() => bookingStorage.getMarketingStats())

  const refresh = useCallback(() => {
    setBookings(bookingStorage.getAll())
    setStats(bookingStorage.getStats())
    setMarketingStats(bookingStorage.getMarketingStats())
  }, [])

  const create = useCallback(
    (data: BookingFormData) => {
      const booking = bookingStorage.create(data)
      refresh()
      return booking
    },
    [refresh]
  )

  const updateStatus = useCallback(
    (id: string, status: BookingStatus) => {
      bookingStorage.updateStatus(id, status)
      refresh()
    },
    [refresh]
  )

  const updateMemo = useCallback(
    (id: string, memo: string) => {
      bookingStorage.updateMemo(id, memo)
      refresh()
    },
    [refresh]
  )

  const updateJourneyStage = useCallback(
    (id: string, stage: JourneyStage, note?: string) => {
      bookingStorage.updateJourneyStage(id, stage, note)
      refresh()
    },
    [refresh]
  )

  const deleteBooking = useCallback(
    (id: string) => {
      bookingStorage.delete(id)
      refresh()
    },
    [refresh]
  )

  const getById = useCallback(
    (id: string) => bookingStorage.getById(id),
    []
  )

  const value = useMemo(
    () => ({
      bookings,
      refresh,
      create,
      updateStatus,
      updateMemo,
      updateJourneyStage,
      deleteBooking,
      getById,
      stats,
      marketingStats,
    }),
    [bookings, refresh, create, updateStatus, updateMemo, updateJourneyStage, deleteBooking, getById, stats, marketingStats]
  )

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
}
