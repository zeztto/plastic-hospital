import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { BookingProvider } from '@/contexts/BookingContext'
import { CustomerProvider } from '@/contexts/CustomerContext'
import { MessageProvider } from '@/contexts/MessageContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { EMRAuthProvider } from '@/contexts/EMRAuthContext'
import { EMRProvider } from '@/contexts/EMRContext'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { EMRLayout } from '@/components/emr/EMRLayout'
import { EMRProtectedRoute } from '@/components/emr/EMRProtectedRoute'

const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })))
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard').then((m) => ({ default: m.Dashboard })))
const BookingList = lazy(() => import('@/pages/admin/BookingList').then((m) => ({ default: m.BookingList })))
const BookingDetail = lazy(() => import('@/pages/admin/BookingDetail').then((m) => ({ default: m.BookingDetail })))
const MarketingDashboard = lazy(() => import('@/pages/admin/MarketingDashboard').then((m) => ({ default: m.MarketingDashboard })))
const CustomerList = lazy(() => import('@/pages/admin/CustomerList').then((m) => ({ default: m.CustomerList })))
const CustomerDetail = lazy(() => import('@/pages/admin/CustomerDetail').then((m) => ({ default: m.CustomerDetail })))
const FollowUpList = lazy(() => import('@/pages/admin/FollowUpList').then((m) => ({ default: m.FollowUpList })))
const ScheduleCalendar = lazy(() => import('@/pages/admin/ScheduleCalendar').then((m) => ({ default: m.ScheduleCalendar })))
const MessageCenter = lazy(() => import('@/pages/admin/MessageCenter').then((m) => ({ default: m.MessageCenter })))
const Operations = lazy(() => import('@/pages/admin/Operations').then((m) => ({ default: m.Operations })))
const EMRLogin = lazy(() => import('@/pages/emr/EMRLogin').then((m) => ({ default: m.EMRLogin })))
const EMRDashboard = lazy(() => import('@/pages/emr/EMRDashboard').then((m) => ({ default: m.EMRDashboard })))
const PatientList = lazy(() => import('@/pages/admin/emr/PatientList').then((m) => ({ default: m.PatientList })))
const NewPatient = lazy(() => import('@/pages/admin/emr/NewPatient').then((m) => ({ default: m.NewPatient })))
const PatientChart = lazy(() => import('@/pages/admin/emr/PatientChart').then((m) => ({ default: m.PatientChart })))
const RecordsList = lazy(() => import('@/pages/admin/emr/RecordsList').then((m) => ({ default: m.RecordsList })))
const RecordDetail = lazy(() => import('@/pages/admin/emr/RecordDetail').then((m) => ({ default: m.RecordDetail })))
const ProceduresList = lazy(() => import('@/pages/admin/emr/ProceduresList').then((m) => ({ default: m.ProceduresList })))
const ProcedureDetail = lazy(() => import('@/pages/admin/emr/ProcedureDetail').then((m) => ({ default: m.ProcedureDetail })))
const PrescriptionsList = lazy(() => import('@/pages/admin/emr/PrescriptionsList').then((m) => ({ default: m.PrescriptionsList })))
const PrescriptionDetail = lazy(() => import('@/pages/admin/emr/PrescriptionDetail').then((m) => ({ default: m.PrescriptionDetail })))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <EMRAuthProvider>
            <BookingProvider>
              <CustomerProvider>
              <MessageProvider>
              <EMRProvider>
              <Suspense fallback={<LoadingFallback />}>
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
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="customers/:id" element={<CustomerDetail />} />
                  <Route path="follow-ups" element={<FollowUpList />} />
                  <Route path="schedule" element={<ScheduleCalendar />} />
                  <Route path="messages" element={<MessageCenter />} />
                  <Route path="operations" element={<Operations />} />
                  <Route path="marketing" element={<MarketingDashboard />} />
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
                  <Route path="records/:id" element={<RecordDetail />} />
                  <Route path="procedures" element={<ProceduresList />} />
                  <Route path="procedures/:id" element={<ProcedureDetail />} />
                  <Route path="prescriptions" element={<PrescriptionsList />} />
                  <Route path="prescriptions/:id" element={<PrescriptionDetail />} />
                </Route>
              </Routes>
              </Suspense>
              <Toaster richColors position="top-right" />
              </EMRProvider>
              </MessageProvider>
              </CustomerProvider>
          </BookingProvider>
        </EMRAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

export default App
