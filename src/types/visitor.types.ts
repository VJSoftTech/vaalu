export type VisitorStatus = 'online' | 'offline'
export type VisitorDeviceType = 'desktop' | 'mobile' | 'tablet'

export interface VisitorLog {
  id: number
  session_id: string
  user_id: number | null
  user_name: string
  email: string
  page_name: string
  page_url: string
  device_type: VisitorDeviceType
  browser: string
  operating_system: string
  ip_address: string
  visit_date_time: string
  login_time: string
  last_activity_at: string
  status: VisitorStatus
}

export interface VisitorGridParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  search?: string
  from?: string
  to?: string
  user_name?: string
  email?: string
  page_name?: string
  device_type?: string
  browser?: string
  operating_system?: string
  status?: string
}

export interface VisitorGridResponse {
  data: VisitorLog[]
  total: number
  page: number
  pageSize: number
}

export interface VisitorStats {
  totalVisitorsToday: number
  currentOnlineUsers: number
  totalPageVisitsToday: number
  uniqueVisitorsToday: number
  mostVisitedPages: { page_name: string; count: number }[]
}

export type VisitorReportType = 'pages' | 'users' | 'devices' | 'browsers' | 'os' | 'sessions'

export interface VisitorReportResponse<T = Record<string, unknown>> {
  type: VisitorReportType
  data: T[]
}

export interface VisitorPageReportRow {
  page_name: string
  visits: number
  unique_users: number
}

export interface VisitorUserReportRow {
  user_id: number
  user_name: string
  email: string
  total_visits: number
  session_count: number
  last_seen: string
}

export interface VisitorBreakdownRow {
  label: string
  count: number
}

export interface VisitorSessionReportRow {
  session_id: string
  user_name: string
  email: string
  login_time: string
  logout_time: string | null
  last_activity_at: string
  status: VisitorStatus
  duration_seconds: number
}

export interface TrackVisitPayload {
  session_id: string
  user_id: number
  user_name: string
  email: string
  page_name: string
  page_url: string
}
