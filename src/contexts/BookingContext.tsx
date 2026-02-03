import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Booking, BookingFormData, BookingStatus } from '@/types/booking'
import { bookingStorage } from '@/services/bookingStorage'

interface BookingContextValue {
  bookings: Booking[]
  refresh: () => void
  create: (data: BookingFormData) => Booking
  updateStatus: (id: string, status: BookingStatus) => void
  updateMemo: (id: string, memo: string) => void
  deleteBooking: (id: string) => void
  getById: (id: string) => Booking | undefined
  stats: ReturnType<typeof bookingStorage.getStats>
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState(bookingStorage.getStats())

  const refresh = useCallback(() => {
    setBookings(bookingStorage.getAll())
    setStats(bookingStorage.getStats())
  }, [])

  useEffect(() => {
    bookingStorage.seedDemoData()
    refresh()
  }, [refresh])

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

  return (
    <BookingContext.Provider
      value={{ bookings, refresh, create, updateStatus, updateMemo, deleteBooking, getById, stats }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
}
