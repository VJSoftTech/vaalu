import { useEffect, useState } from 'react'
import { orderService } from '@/services/orderService'
import type { Order } from '@/types'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Card, CardContent } from '@/components/ui/card'

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getAll().then((res) => setOrders(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.order_status} type="order" />
                  <OrderStatusBadge status={order.payment_status} type="payment" />
                  <span className="font-semibold">{formatCurrency(order.total_amount)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
