import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === 'admin' || user?.role === 'staff' ? '/admin' : '/'}
        replace
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">வாலு பதிப்பகம்</h1>
          <p className="text-muted-foreground mt-1">Vaalu Pathippagam</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
