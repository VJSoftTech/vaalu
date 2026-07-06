import { useEffect, useState } from 'react'
import { ShoppingBag, BookOpen, Users, DollarSign } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { reportService, type SalesReport, type DashboardStats } from '@/services/reportService'
import { formatCurrency } from '@/utils/formatters'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [salesData, setSalesData] = useState<{ date: string; revenue: number }[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const hasDateRange = Boolean(from && to)

  useEffect(() => {
    setLoading(true)
    reportService
      .getSales(hasDateRange ? { from, to } : { period })
      .then((data) => {
        const arr: SalesReport[] = Array.isArray(data) ? data : ((data as any)?.data ?? [])
        setSalesData(arr.map((d) => ({ date: d.date, revenue: d.revenue })))
      })
      .catch(() => setSalesData([]))
      .finally(() => setLoading(false))
  }, [period, from, to])

  const clearDateRange = () => { setFrom(''); setTo('') }

  useEffect(() => {
    reportService
      .getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false))
  }, [])

  const statCards = [
    {
      title: 'Total Orders',
      value: statsLoading ? '—' : (stats?.total_orders ?? 0).toLocaleString(),
      icon: ShoppingBag,
      color: 'blue' as const,
      trend: stats ? { value: stats.orders_trend, label: 'vs last month' } : undefined,
      href: '/admin/orders',
    },
    {
      title: 'Total Books',
      value: statsLoading ? '—' : (stats?.total_books ?? 0).toLocaleString(),
      icon: BookOpen,
      color: 'purple' as const,
      href: '/admin/books',
    },
    {
      title: 'Customers',
      value: statsLoading ? '—' : (stats?.total_customers ?? 0).toLocaleString(),
      icon: Users,
      color: 'orange' as const,
      trend: stats ? { value: stats.customers_trend, label: 'vs last month' } : undefined,
      href: '/admin/customers',
    },
    {
      title: 'Revenue',
      value: statsLoading ? '—' : formatCurrency(stats?.total_revenue ?? 0),
      icon: DollarSign,
      color: 'green' as const,
      trend: stats ? { value: stats.revenue_trend, label: 'vs last month' } : undefined,
      href: '/admin/reports/revenue',
    },
  ]

  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" subtitle="Welcome back to Vaalu Pathippagam Admin" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)} disabled={hasDateRange}>
              <SelectTrigger className="h-8 w-24 text-xs border-primary text-primary focus:ring-primary"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" className="h-8 w-36 text-xs border-primary text-primary focus-visible:ring-primary" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
            <span className="text-xs text-muted-foreground">to</span>
            <Input type="date" className="h-8 w-36 text-xs border-primary text-primary focus-visible:ring-primary" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
            {hasDateRange && (
              <Button variant="outline" size="sm" className="h-8 text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={clearDateRange}>Clear</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
