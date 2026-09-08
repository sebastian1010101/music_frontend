import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/use-auth'

export function ProtectedRoute() {
  const { token } = useAuth()
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function PublicOnlyRoute() {
  const { token } = useAuth()
  if (token) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
