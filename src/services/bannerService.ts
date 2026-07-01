import api from './api'
import type { Advertisement } from '@/types'

export const bannerService = {
  getActiveBanners: () =>
    api.get<{ data: Advertisement[]; total: number }>('/api/banners').then((r) => r.data),
}
