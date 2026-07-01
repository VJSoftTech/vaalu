import api from './api'
import type { CopyrightEnquiry, CopyrightEnquiryFormData } from '@/types'

export const copyrightService = {
  submit: (data: CopyrightEnquiryFormData) =>
    api.post('/api/copyright-enquiries', data).then((r) => r.data),

  getAll: () =>
    api.get<{ data: CopyrightEnquiry[]; total: number }>('/api/copyright-enquiries').then((r) => r.data),
}
