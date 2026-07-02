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

export default function Dashboard() {
  const [salesData, setSalesData] = useState<{ date: string; revenue: number }[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    reportService
      .getSales()
      .then((data) => {
        const arr: SalesReport[] = Array.isArray(data) ? data : ((data as any)?.data ?? [])
        setSalesData(arr.map((d) => ({ date: d.date, revenue: d.revenue })))
      })
      .catch(() => setSalesData([]))
      .finally(() => setLoading(false))

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
        <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
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
