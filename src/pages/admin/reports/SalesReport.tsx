import { useEffect, useState } from 'react'
import { reportService, type SalesReport as SalesData } from '@/services/reportService'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatCurrency } from '@/utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SalesReport() {
  const [data, setData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const hasDateRange = Boolean(from && to)

  useEffect(() => {
    setLoading(true)
    reportService
      .getSales(hasDateRange ? { from, to } : { period })
      .then((res) => setData(Array.isArray(res) ? res : []))
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
      <PageTitle title="Sales Report" action={filterBar} />

      {loading ? <LoadingSpinner className="py-16" /> : (
        <>
          <Card>
            <CardHeader><CardTitle>Sales Overview</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Sales Data</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.orders}</TableCell>
                      <TableCell>{formatCurrency(row.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
