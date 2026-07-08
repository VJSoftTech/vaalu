import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { visitorService } from '@/services/visitorService'
import { useVisitorSocket } from '@/hooks/useVisitorSocket'
import { useDebounce } from '@/hooks/useDebounce'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import StatsCard from '@/components/dashboard/StatsCard'
import { formatDateTime } from '@/utils/formatters'
import {
  Eye, Users, Circle, Monitor, Smartphone, Tablet,
  ArrowUpDown, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type {
  VisitorLog, VisitorStats, VisitorReportType,
  VisitorPageReportRow, VisitorUserReportRow, VisitorBreakdownRow, VisitorSessionReportRow,
} from '@/types/visitor.types'

const PAGE_SIZE = 20
const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const deviceIcon = (device: string) => {
  const d = device.toLowerCase()
  if (d === 'mobile') return Smartphone
  if (d === 'tablet') return Tablet
  return Monitor
}

const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant="secondary" className={`gap-1.5 ${status === 'online' ? 'text-emerald-600' : 'text-muted-foreground'}`}>
    <Circle className={`h-2 w-2 ${status === 'online' ? 'fill-emerald-500 text-emerald-500' : 'fill-muted-foreground text-muted-foreground'}`} />
    {status === 'online' ? 'Online' : 'Offline'}
  </Badge>
)

export default function WhoVisitedSites() {
  const { user } = useAuthStore()

  const [rows, setRows] = useState<VisitorLog[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('visit_date_time')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [deviceType, setDeviceType] = useState('all')
  const [status, setStatus] = useState('all')

  const [tab, setTab] = useState<'grid' | 'reports'>('grid')
  const reportType: VisitorReportType = 'pages'
  const [reportData, setReportData] = useState<unknown[]>([])
  const [reportLoading, setReportLoading] = useState(false)

  const gridParams = useMemo(() => ({
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortDir,
    search: debouncedSearch || undefined,
    from: from || undefined,
    to: to || undefined,
    device_type: deviceType !== 'all' ? deviceType : undefined,
    status: status !== 'all' ? status : undefined,
  }), [page, sortBy, sortDir, debouncedSearch, from, to, deviceType, status])

  const loadGrid = useCallback(() => {
    setLoading(true)
    Promise.all([visitorService.getGrid(gridParams), visitorService.getStats()])
      .then(([grid, s]) => {
        setRows(grid.data)
        setTotal(grid.total)
        setStats(s)
      })
      .catch(() => { setRows([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [gridParams])

  useEffect(() => { loadGrid() }, [loadGrid])

  // Reset to page 1 whenever a filter changes (not on page/sort changes)
  useEffect(() => { setPage(1) }, [debouncedSearch, from, to, deviceType, status])

  // Live updates: any socket event triggers a debounced refetch so the grid/stats
  // stay in sync with the server's derived online/offline state.
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSocketEvent = useCallback(() => {
    if (refetchTimer.current) clearTimeout(refetchTimer.current)
    refetchTimer.current = setTimeout(loadGrid, 400)
  }, [loadGrid])
  useVisitorSocket(handleSocketEvent)
  useEffect(() => () => { if (refetchTimer.current) clearTimeout(refetchTimer.current) }, [])

  useEffect(() => {
    if (tab !== 'reports') return
    setReportLoading(true)
    visitorService
      .getReports(reportType, { from: from || undefined, to: to || undefined })
      .then((r) => setReportData(r.data))
      .catch(() => setReportData([]))
      .finally(() => setReportLoading(false))
  }, [tab, reportType, from, to])

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(col); setSortDir('desc') }
  }

  const clearFilters = () => {
    setSearch(''); setFrom(''); setTo(''); setDeviceType('all'); setStatus('all')
  }
  const hasFilters = Boolean(search || from || to || deviceType !== 'all' || status !== 'all')

  if (user?.role !== 'admin') return <Navigate to="/admin" replace />

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const columns: { key: string; label: string; sortable?: boolean; title?: string }[] = [
    { key: 'visit_date_time', label: 'Visit Time', sortable: true },
    { key: 'user_name', label: 'User Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'page_name', label: 'Page Name', sortable: true },
    { key: 'device_type', label: 'Device', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ]

  return (
    <div className="space-y-6">
      <PageTitle title="Who Visited Sites" subtitle="Real-time visitor activity across the platform" />

      <div className="grid sm:grid-cols-3 gap-4 print:hidden">
        <StatsCard title="Total Visitors Today" value={stats?.totalVisitorsToday ?? 0} icon={Users} color="blue" />
        <StatsCard title="Current Online Users" value={stats?.currentOnlineUsers ?? 0} icon={Circle} color="green" />
        <StatsCard title="Total Page Visits Today" value={stats?.totalPageVisitsToday ?? 0} icon={Eye} color="purple" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="grid">Live Grid</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {tab === 'reports' && (
            <div className="flex items-center gap-2">
              <Input type="date" className="h-8 w-36 text-xs" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" className="h-8 w-36 text-xs" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
            </div>
          )}
        </div>

        <TabsContent value="grid">
          <div className="flex flex-wrap items-center gap-2 mb-4 mt-4">
            <Input placeholder="Search name, email or page..." className="h-8 w-56 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="h-8 w-36 text-xs" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
            <span className="text-xs text-muted-foreground">to</span>
            <Input type="date" className="h-8 w-36 text-xs" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
            {hasFilters && <Button variant="outline" size="sm" className="h-8 text-xs" onClick={clearFilters}>Clear</Button>}
          </div>

          {loading ? <LoadingSpinner className="py-16" /> : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((c) => (
                        <TableHead key={c.key} title={c.title}>
                          {c.sortable ? (
                            <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort(c.key)}>
                              {c.label}
                              <ArrowUpDown className={`h-3 w-3 ${sortBy === c.key ? 'opacity-100' : 'opacity-30'}`} />
                            </button>
                          ) : c.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => {
                      const DeviceIcon = deviceIcon(r.device_type)
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="whitespace-nowrap">{formatDateTime(r.visit_date_time)}</TableCell>
                          <TableCell>{r.user_name}</TableCell>
                          <TableCell>{r.email}</TableCell>
                          <TableCell>{r.page_name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="gap-1 capitalize"><DeviceIcon className="h-3 w-3" />{r.device_type}</Badge>
                          </TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                        </TableRow>
                      )
                    })}
                    {!rows.length && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-12">
                          No visitor activity recorded yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              {total > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
                  <span>Page {page} of {totalPages} · {total} total visits</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1 border-primary text-primary hover:bg-primary/10 hover:text-primary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1 border-primary text-primary hover:bg-primary/10 hover:text-primary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          {reportLoading ? <LoadingSpinner className="py-16" /> : (
            <ReportView type={reportType} data={reportData} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportView({ type, data }: { type: VisitorReportType; data: unknown[] }) {
  if (!data.length) {
    return (
      <Card><CardContent className="text-center text-muted-foreground py-12">No data recorded for this period yet</CardContent></Card>
    )
  }

  if (type === 'devices' || type === 'browsers' || type === 'os') {
    const rows = data as VisitorBreakdownRow[]
    return (
      <Card>
        <CardHeader><CardTitle className="capitalize">{type}-wise Visitors</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={rows} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
                {rows.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  if (type === 'pages') {
    const rows = data as VisitorPageReportRow[]
    return (
      <Card>
        <CardHeader><CardTitle>Most Visited Pages</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="page_name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="visits" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <Table className="mt-4">
            <TableHeader><TableRow><TableHead>Page Name</TableHead><TableHead>Visits</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.page_name}><TableCell>{r.page_name}</TableCell><TableCell>{r.visits}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (type === 'users') {
    const rows = data as VisitorUserReportRow[]
    return (
      <Card>
        <CardHeader><CardTitle>Most Active Users / User Activity History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Total Visits</TableHead><TableHead>Sessions</TableHead><TableHead>Last Seen</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.user_id}>
                  <TableCell>{r.user_name}</TableCell><TableCell>{r.email}</TableCell>
                  <TableCell>{r.total_visits}</TableCell><TableCell>{r.session_count}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDateTime(r.last_seen)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  // sessions → Login/Logout History
  const rows = data as VisitorSessionReportRow[]
  return (
    <Card>
      <CardHeader><CardTitle>Login / Logout History</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>User</TableHead><TableHead>Login Time</TableHead><TableHead>Logout Time</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.session_id}>
                <TableCell>{r.user_name} <span className="text-muted-foreground text-xs">({r.email})</span></TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(r.login_time)}</TableCell>
                <TableCell className="whitespace-nowrap">{r.logout_time ? formatDateTime(r.logout_time) : '—'}</TableCell>
                <TableCell>{Math.max(0, Math.round(r.duration_seconds / 60))} min</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
