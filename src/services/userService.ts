import api from './api'
import type { User } from '@/types'

export interface StaffUserFormData {
  name: string
  email: string
  password?: string
  role: 'admin' | 'staff'
  is_active: boolean
}

export const userService = {
  getAll: () =>
    api.get<{ data: User[]; total: number }>('/api/users').then((r) => r.data),

  create: (data: StaffUserFormData) =>
    api.post<User>('/api/users', data).then((r) => r.data),

  update: (id: number, data: Partial<StaffUserFormData>) =>
    api.put<User>(`/api/users/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/api/users/${id}`).then((r) => r.data),

  toggleActive: (id: number, is_active: boolean) =>
    api.put<User>(`/api/users/${id}`, { is_active }).then((r) => r.data),
}
