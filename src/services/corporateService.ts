import api from './api'
import type { CorporateEnquiry, CorporateEnquiryFormData } from '@/types'

export const corporateService = {
  submit: (data: CorporateEnquiryFormData) =>
    api.post('/api/corporate-enquiries', data).then((r) => r.data),

  getAll: () =>
    api.get<{ data: CorporateEnquiry[]; total: number }>('/api/corporate-enquiries').then((r) => r.data),
}
