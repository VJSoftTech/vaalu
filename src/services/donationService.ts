import api from './api'
import type { BookDonation, BookDonationFormData } from '@/types'

export const donationService = {
  submit: (data: BookDonationFormData) =>
    api.post('/api/donate-books', data).then((r) => r.data),

  getAll: () =>
    api.get<{ data: BookDonation[]; total: number }>('/api/donate-books').then((r) => r.data),
}
