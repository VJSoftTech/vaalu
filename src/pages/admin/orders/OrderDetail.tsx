import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, ExternalLink, Package } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const ORDER_STATUS_STEPS: OrderStatus[] = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (!id) return
    orderService.getById(Number(id)).then(setOrder).finally(() => setLoading(false))
  }, [id])

  const updateStatus = async (order_status: OrderStatus) => {
    if (!id) return
    const updated = await orderService.updateStatus(Number(id), { order_status })
    setOrder(updated)
  }

  const verifyPayment = async () => {
    if (!id) return
    setVerifying(true)
    try {
      const updated = await orderService.updateStatus(Number(id), {
        payment_status: 'paid',
        order_status: 'confirmed',
      })
      setOrder(updated)
    } finally {
      setVerifying(false)
    }
  }

  if (loading) return <LoadingSpinner className="py-16" />
  if (!order)  return <div className="text-center py-16">Order not found.</div>

  const shipping = order.shipping_address
  const currentStep = ORDER_STATUS_STEPS.indexOf(order.order_status as OrderStatus)

  return (
    <div className="space-y-6">
      <PageTitle
        title={`Order ${order.order_number}`}
        action={<Button variant="outline" onClick={() => navigate('/admin/orders')}>← Back</Button>}
      />

      {/* Order Status Timeline */}
      <Card>
        <CardHeader><CardTitle>Order Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-0">
            {ORDER_STATUS_STEPS.map((step, i) => {
              const done    = currentStep >= i
              const active  = currentStep === i
              const cancelled = order.order_status === 'cancelled'
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                      cancelled        ? 'border-red-300 bg-red-50 text-red-400'
                      : done && active ? 'border-primary bg-primary text-white'
                      : done           ? 'border-green-500 bg-green-500 text-white'
                                       : 'border-muted bg-muted text-muted-foreground'
                    }`}>
                      {done && !active ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] capitalize text-center ${active ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                  {i < ORDER_STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 mx-1 ${done && currentStep > i ? 'bg-green-400' : 'bg-muted'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

<div className="grid md:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card>
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Date">{formatDateTime(order.created_at)}</Row>
            <Row label="Customer">{order.customer_name}</Row>
            <Row label="Email">{order.customer_email}</Row>
            <Row label="Payment Method">
              <Badge variant="outline" className="capitalize">{order.payment_method || 'qr'}</Badge>
            </Row>
            <Row label="Payment Status">
              <OrderStatusBadge status={order.payment_status} type="payment" />
            </Row>
            <Row label="Order Status">
              <Select value={order.order_status} onValueChange={updateStatus}>
                <SelectTrigger className="w-36 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Row>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Subtotal">{formatCurrency(order.subtotal)}</Row>
            <Row label="GST">{formatCurrency(order.gst_amount)}</Row>
            <Row label="Shipping">{formatCurrency(order.shipping_amount)}</Row>
            <Separator />
            <div className="flex justify-between font-semibold text-base pt-1">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        {shipping && (
          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{shipping.full_name}</p>
              <p>{shipping.address_line1}</p>
              {shipping.address_line2 && <p>{shipping.address_line2}</p>}
              <p>{shipping.city}, {shipping.state} – {shipping.pincode}</p>
              <p className="text-muted-foreground">Phone: {shipping.phone}</p>
            </CardContent>
          </Card>
        )}

        {/* Payment Proof */}
        <Card>
          <CardHeader><CardTitle>Payment Proof</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {order.payment_ref_id ? (
              <>
                <Row label="Reference / UTR">
                  <span className="font-mono font-medium">{order.payment_ref_id}</span>
                </Row>
                {order.payment_attachment && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Screenshot</p>
                    <a
                      href={order.payment_attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={order.payment_attachment}
                        alt="Payment screenshot"
                        className="max-h-48 rounded-lg border object-contain w-full"
                      />
                      <div className="flex items-center gap-1 text-xs text-primary mt-1">
                        <ExternalLink className="h-3 w-3" /> View full image
                      </div>
                    </a>
                  </div>
                )}
                {order.payment_status === 'pending' && (
                  <Button
                    onClick={verifyPayment}
                    disabled={verifying}
                    className="w-full mt-2"
                    size="sm"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {verifying ? 'Verifying…' : 'Verify & Confirm Payment'}
                  </Button>
                )}
                {order.payment_status === 'paid' && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 p-2 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Payment verified
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No payment proof submitted.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Items Ordered</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                  {item.book_cover
                    ? <img src={item.book_cover} alt="" className="w-full h-full object-cover rounded" />
                    : <Package className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{item.book_title}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium shrink-0">{formatCurrency(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  )
}
