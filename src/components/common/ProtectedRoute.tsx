import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store'

interface Props {
  adminOnly?: boolean
}

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />

  if (adminOnly && user?.role !== 'admin' && user?.role !== 'staff') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
