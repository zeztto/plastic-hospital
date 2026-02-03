import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from '@/contexts/BookingContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { EMRProvider } from '@/contexts/EMRContext'
import { Home } from '@/pages/Home'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { Dashboard } from '@/pages/admin/Dashboard'
import { BookingList } from '@/pages/admin/BookingList'
import { BookingDetail } from '@/pages/admin/BookingDetail'
import { PatientList } from '@/pages/admin/emr/PatientList'
import { NewPatient } from '@/pages/admin/emr/NewPatient'
import { PatientChart } from '@/pages/admin/emr/PatientChart'
import { RecordsList } from '@/pages/admin/emr/RecordsList'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <BookingProvider>
          <EMRProvider>
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
                <Route path="patients" element={<PatientList />} />
                <Route path="patients/new" element={<NewPatient />} />
                <Route path="patients/:id" element={<PatientChart />} />
                <Route path="records" element={<RecordsList />} />
              </Route>
            </Routes>
          </EMRProvider>
        </BookingProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
