import api from './api'
import type { LoginCredentials, AuthResponse, User } from '@/types'

interface RegisterData {
  name: string
  email: string
  mobile_number?: string
  password: string
}

// Demo credentials for testing without a backend
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@vaalu.com': {
    password: 'admin123',
    user: { id: 1, name: 'Admin User', email: 'admin@vaalu.com', role: 'admin', is_active: true, created_at: new Date().toISOString() },
  },
  'staff@vaalu.com': {
    password: 'staff123',
    user: { id: 2, name: 'Staff User', email: 'staff@vaalu.com', role: 'staff', is_active: true, created_at: new Date().toISOString() },
  },
  'customer@vaalu.com': {
    password: 'customer123',
    user: { id: 3, name: 'Customer', email: 'customer@vaalu.com', role: 'customer', is_active: true, created_at: new Date().toISOString() },
  },
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', credentials)
      return response.data
    } catch (err: unknown) {
      // Fall back to demo credentials when backend is unavailable
      const isNetworkError = err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ERR_NETWORK'
      const demo = DEMO_USERS[credentials.email]
      if (isNetworkError && demo && demo.password === credentials.password) {
        return { token: 'demo-token-' + demo.user.role, user: demo.user }
      }
      throw err
    }
  },

  register: (data: RegisterData) => api.post('/api/auth/register', data).then((r) => r.data),

  logout: () => api.post('/api/auth/logout').catch(() => {}),

  getProfile: () => api.get<User>('/api/auth/profile').then((r) => r.data),
}
