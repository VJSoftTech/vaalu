import api from './api'
import type {
  VisitorGridParams,
  VisitorGridResponse,
  VisitorStats,
  VisitorReportType,
  VisitorReportResponse,
  TrackVisitPayload,
} from '@/types/visitor.types'

export const visitorService = {
  track: (payload: TrackVisitPayload) =>
    api.post('/api/visitors/track', payload).then((r) => r.data),

  heartbeat: (session_id: string) =>
    api.post('/api/visitors/heartbeat', { session_id }).then((r) => r.data),

  logout: (session_id: string) =>
    api.post('/api/visitors/logout', { session_id }).then((r) => r.data),

  getGrid: (params?: VisitorGridParams) =>
    api.get<VisitorGridResponse>('/api/visitors', { params }).then((r) => r.data),

  // Requests the full filtered set (capped) for Excel/PDF export — not just the visible page.
  exportGrid: (params?: Omit<VisitorGridParams, 'page' | 'pageSize'>) =>
    api
      .get<VisitorGridResponse>('/api/visitors', { params: { ...params, page: 1, pageSize: 5000 } })
      .then((r) => r.data.data),

  getStats: () => api.get<VisitorStats>('/api/visitors/stats').then((r) => r.data),

  getReports: (type: VisitorReportType, params?: { from?: string; to?: string }) =>
    api
      .get<VisitorReportResponse>('/api/visitors/reports', { params: { type, ...params } })
      .then((r) => r.data),
}
