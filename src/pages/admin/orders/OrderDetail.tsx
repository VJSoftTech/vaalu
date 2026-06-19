import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderService } from '@/services/orderService'
import type { Order, OrderStatus } from '@/types'
import { ORDER_STATUSES } from '@/utils/constants'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    orderService.getById(Number(id)).then(setOrder).finally(() => setLoading(false))
  }, [id])

  const updateStatus = async (status: OrderStatus) => {
    if (!id) return
    const updated = await orderService.updateStatus(Number(id), status)
    setOrder(updated)
  }

  if (loading) return <LoadingSpinner className="py-16" />
  if (!order) return <div className="text-center py-16">Order not found.</div>

  return (
    <div className="space-y-6">
      <PageTitle
        title={`Order ${order.order_number}`}
        action={<Button variant="outline" onClick={() => navigate('/admin/orders')}>← Back</Button>}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{formatDateTime(order.created_at)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{order.customer_email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><OrderStatusBadge status={order.payment_status} type="payment" /></div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order Status</span>
              <Select value={order.order_status} onValueChange={updateStatus}>
                <SelectTrigger className="w-36 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>GST</span><span>{formatCurrency(order.gst_amount)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shipping_amount)}</span></div>
            <div className="flex justify-between font-semibold text-base border-t pt-2"><span>Total</span><span>{formatCurrency(order.total_amount)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
