import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const EMR_PASSWORD = 'emr5678'
const EMR_AUTH_KEY = 'plastic-hospital-emr-auth'

interface EMRAuthContextValue {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const EMRAuthContext = createContext<EMRAuthContextValue | null>(null)

export function EMRAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(EMR_AUTH_KEY) === 'true'
  })

  const login = useCallback((password: string) => {
    if (password === EMR_PASSWORD) {
      sessionStorage.setItem(EMR_AUTH_KEY, 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(EMR_AUTH_KEY)
    setIsAuthenticated(false)
  }, [])

  return (
    <EMRAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </EMRAuthContext.Provider>
  )
}

export function useEMRAuth() {
  const ctx = useContext(EMRAuthContext)
  if (!ctx) throw new Error('useEMRAuth must be used within EMRAuthProvider')
  return ctx
}
