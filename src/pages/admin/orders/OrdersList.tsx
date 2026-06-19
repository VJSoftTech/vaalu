import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { orderService } from '@/services/orderService'
import type { Order } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getAll().then((r) => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageTitle title="Orders" />
      {loading ? <LoadingSpinner className="py-16" /> : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                  <TableCell className="text-sm">{order.customer_name}</TableCell>
                  <TableCell className="text-sm">{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell><OrderStatusBadge status={order.payment_status} type="payment" /></TableCell>
                  <TableCell><OrderStatusBadge status={order.order_status} type="order" /></TableCell>
                  <TableCell className="text-right">
                    <Link to={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
