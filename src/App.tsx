import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from '@/contexts/BookingContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { EMRAuthProvider } from '@/contexts/EMRAuthContext'
import { EMRProvider } from '@/contexts/EMRContext'
import { Home } from '@/pages/Home'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { Dashboard } from '@/pages/admin/Dashboard'
import { BookingList } from '@/pages/admin/BookingList'
import { BookingDetail } from '@/pages/admin/BookingDetail'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { EMRLogin } from '@/pages/emr/EMRLogin'
import { EMRDashboard } from '@/pages/emr/EMRDashboard'
import { EMRLayout } from '@/components/emr/EMRLayout'
import { EMRProtectedRoute } from '@/components/emr/EMRProtectedRoute'
import { PatientList } from '@/pages/admin/emr/PatientList'
import { NewPatient } from '@/pages/admin/emr/NewPatient'
import { PatientChart } from '@/pages/admin/emr/PatientChart'
import { RecordsList } from '@/pages/admin/emr/RecordsList'

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <EMRAuthProvider>
          <BookingProvider>
            <EMRProvider>
              <Routes>
                <Route path="/" element={<Home />} />

                {/* CRM: 원무과 예약 관리 시스템 */}
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

                {/* EMR: 전자의무기록 시스템 (의료진 전용) */}
                <Route path="/emr/login" element={<EMRLogin />} />
                <Route
                  path="/emr"
                  element={
                    <EMRProtectedRoute>
                      <EMRLayout />
                    </EMRProtectedRoute>
                  }
                >
                  <Route index element={<EMRDashboard />} />
                  <Route path="patients" element={<PatientList />} />
                  <Route path="patients/new" element={<NewPatient />} />
                  <Route path="patients/:id" element={<PatientChart />} />
                  <Route path="records" element={<RecordsList />} />
                </Route>
              </Routes>
            </EMRProvider>
          </BookingProvider>
        </EMRAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
