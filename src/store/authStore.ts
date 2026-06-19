import { create } from 'zustand'
import type { User } from '@/types'
import { storage } from '@/utils/storage'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),

  setAuth: (user, token) => {
    storage.setToken(token)
    storage.setUser(user)
    set({ user, token, isAuthenticated: true })
  },

  clearAuth: () => {
    storage.clear()
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
