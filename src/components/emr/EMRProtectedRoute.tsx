import { Navigate } from 'react-router-dom'
import { useEMRAuth } from '@/contexts/EMRAuthContext'
import type { ReactNode } from 'react'

export function EMRProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useEMRAuth()

  if (!isAuthenticated) {
    return <Navigate to="/emr/login" replace />
  }

  return <>{children}</>
}
