import { useEffect, useState } from 'react'
import { reportService, type CustomerReport as CustomerData } from '@/services/reportService'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatCurrency } from '@/utils/formatters'
import StatsCard from '@/components/dashboard/StatsCard'
import { Users, UserPlus } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CustomerReport() {
  const [data, setData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportService.getCustomers().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner className="py-16" />

  return (
    <div className="space-y-6">
      <PageTitle title="Customer Report" />
      <div className="grid sm:grid-cols-2 gap-4">
        <StatsCard title="Total Customers" value={data?.total_customers ?? 0} icon={Users} color="blue" />
        <StatsCard title="New This Month" value={data?.new_this_month ?? 0} icon={UserPlus} color="purple" />
      </div>
      <Card>
        <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.top_customers?.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.orders}</TableCell>
                  <TableCell className="font-medium text-emerald-600">{formatCurrency(c.total_spent)}</TableCell>
                </TableRow>
              ))}
              {!data?.top_customers?.length && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No customer purchases recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
