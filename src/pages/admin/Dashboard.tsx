import { useEffect, useState } from 'react'
import { ShoppingBag, BookOpen, Users, DollarSign } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { reportService, type SalesReport } from '@/services/reportService'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportService
      .getSales()
      .then((data) => {
        const arr: SalesReport[] = Array.isArray(data) ? data : ((data as any)?.data ?? [])
        setSalesData(arr.map((d) => ({ date: d.date, revenue: d.revenue })))
      })
      .catch(() => setSalesData([]))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { title: 'Total Orders', value: '1,284', icon: ShoppingBag, color: 'blue' as const, trend: { value: 12, label: 'vs last month' } },
    { title: 'Total Books', value: '482', icon: BookOpen, color: 'green' as const },
    { title: 'Customers', value: '3,921', icon: Users, color: 'orange' as const, trend: { value: 8, label: 'vs last month' } },
    { title: 'Revenue', value: '₹2.4L', icon: DollarSign, color: 'red' as const, trend: { value: 15, label: 'vs last month' } },
  ]

  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" subtitle="Welcome back to VPMS Admin" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
