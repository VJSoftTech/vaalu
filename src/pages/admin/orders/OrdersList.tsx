import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, X } from 'lucide-react'
import { orderService } from '@/services/orderService'
import type { Order, OrderStatus } from '@/types'
import { ORDER_STATUSES } from '@/utils/constants'
import { cn } from '@/lib/utils'

const statusColors: Record<OrderStatus, string> = {
  placed:     'bg-blue-100 text-blue-700 border-blue-200',
  confirmed:  'bg-indigo-100 text-indigo-700 border-indigo-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  shipped:    'bg-orange-100 text-orange-700 border-orange-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
  returned:   'bg-gray-100 text-gray-700 border-gray-200',
}
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [proofImage, setProofImage] = useState<string | null>(null)

  useEffect(() => {
    orderService.getAll().then((r) => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId: number, order_status: OrderStatus) => {
    setUpdating(orderId)
    try {
      const updated = await orderService.updateStatus(orderId, { order_status })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, order_status: updated.order_status } : o)))
    } finally {
      setUpdating(null)
    }
  }

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
                <TableHead>Proof</TableHead>
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
                  <TableCell>
                    {order.payment_attachment ? (
                      <button
                        onClick={() => setProofImage(order.payment_attachment!)}
                        className="block w-10 h-10 rounded overflow-hidden border border-gray-200 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        title="View payment proof"
                      >
                        <img
                          src={order.payment_attachment}
                          alt="Payment proof"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.order_status}
                      disabled={updating === order.id}
                      onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}
                    >
                      <SelectTrigger className={cn('w-32 h-7 text-xs font-medium capitalize', statusColors[order.order_status])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
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

      {proofImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setProofImage(null)}
        >
          <div
            className="relative max-w-xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProofImage(null)}
              className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            <img
              src={proofImage}
              alt="Payment proof"
              className="w-full rounded-lg shadow-2xl object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
