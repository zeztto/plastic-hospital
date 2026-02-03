import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from '@/contexts/BookingContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { Home } from '@/pages/Home'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { Dashboard } from '@/pages/admin/Dashboard'
import { BookingList } from '@/pages/admin/BookingList'
import { BookingDetail } from '@/pages/admin/BookingDetail'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <BookingProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<BookingList />} />
              <Route path="bookings/:id" element={<BookingDetail />} />
            </Route>
          </Routes>
        </BookingProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
