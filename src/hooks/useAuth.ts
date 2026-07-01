import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { authService } from '@/services/authService'
import type { LoginCredentials } from '@/types'

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authService.login(credentials)
      setAuth(data.user, data.token)
      const from = (location.state as { from?: string })?.from
      if (data.user.role === 'admin' || data.user.role === 'staff') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from ?? '/', { replace: true })
      }
    } catch {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      clearAuth()
      navigate('/auth/login')
    }
  }

  return { user, isAuthenticated, isLoading, error, login, logout }
}
