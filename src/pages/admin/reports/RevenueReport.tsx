import { useEffect, useState } from 'react'
import { reportService } from '@/services/reportService'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatCurrency } from '@/utils/formatters'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RevenueReport() {
  const [data, setData] = useState<{ date: string; revenue: number }[]>([])
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(true)

  const hasDateRange = Boolean(from && to)

  useEffect(() => {
    setLoading(true)
    reportService
      .getRevenue(hasDateRange ? { from, to } : { period })
      .then(setData)
      .finally(() => setLoading(false))
  }, [period, from, to])

  const clearDateRange = () => { setFrom(''); setTo('') }

  const filterBar = (
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
  )

  return (
    <div className="space-y-6">
      <PageTitle title="Revenue Report" action={filterBar} />

      {loading ? <LoadingSpinner className="py-16" /> : (
        <Card>
          <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
