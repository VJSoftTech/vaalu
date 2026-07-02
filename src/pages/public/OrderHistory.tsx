import { useEffect, useState } from 'react'
import { orderService } from '@/services/orderService'
import type { Order, OrderStatus } from '@/types'
import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Package, Clock, CheckCircle2, Truck, Home, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { getBookCover } from '@/assets/images/bookCovers'

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'placed',     label: 'Order Placed', icon: <Clock className="h-3.5 w-3.5" /> },
  { key: 'confirmed',  label: 'Confirmed',    icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: 'processing', label: 'Processing',   icon: <Package className="h-3.5 w-3.5" /> },
  { key: 'shipped',    label: 'Shipped',      icon: <Truck className="h-3.5 w-3.5" /> },
  { key: 'delivered',  label: 'Delivered',    icon: <Home className="h-3.5 w-3.5" /> },
]

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  placed:     'bg-blue-100 text-blue-700 border-blue-200',
  confirmed:  'bg-indigo-100 text-indigo-700 border-indigo-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  shipped:    'bg-orange-100 text-orange-700 border-orange-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
  returned:   'bg-gray-100 text-gray-600 border-gray-200',
}

function StatusTimeline({ order }: { order: Order }) {
  const cancelled = order.order_status === 'cancelled' || order.order_status === 'returned'
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === order.order_status)

  if (cancelled) {
    return (
      <div className="mt-3 px-1">
        <Badge className="bg-red-100 text-red-700 border-red-300 capitalize">{order.order_status}</Badge>
      </div>
    )
  }

  return (
    <div className="mt-3 px-1">
      <div className="flex items-start gap-0">
        {STATUS_STEPS.map((step, i) => {
          const done   = currentIdx >= i
          const active = currentIdx === i
          return (
            <div key={step.key} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                  active ? 'border-primary bg-primary text-white'
                  : done  ? 'border-green-500 bg-green-500 text-white'
                          : 'border-muted bg-background text-muted-foreground'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-[9px] text-center leading-tight max-w-[52px] ${
                  active ? 'font-semibold text-primary' : done ? 'text-green-600' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mt-3.5 mx-1 ${done && currentIdx > i ? 'bg-green-400' : 'bg-muted'}`} />
              )}
            </div>
          )
        })}
      </div>

      {order.payment_status === 'pending' && order.payment_method === 'qr' && (
        <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-1.5 mt-3">
          Payment proof under review — your order will be confirmed once verified.
        </p>
      )}
    </div>
  )
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedStatus, setExpandedStatus] = useState<Record<number, boolean>>({})

  useEffect(() => {
    orderService.getAll().then((res) => setOrders(res.data)).finally(() => setLoading(false))
  }, [])

  const toggleStatus = (id: number) =>
    setExpandedStatus((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="container py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden shadow-sm">
              {/* Header */}
              <CardHeader className="bg-muted/40 px-4 py-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-foreground">{order.order_number}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs font-medium ${ORDER_STATUS_COLORS[order.order_status as OrderStatus] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {order.order_status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <OrderStatusBadge status={order.payment_status} type="payment" />
                    <span className="font-bold text-sm ml-1">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-4 py-3">
                {/* Book Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={item.id}>
                        <div className="flex gap-3 items-center">
                          {/* Cover */}
                          <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden border bg-muted flex items-center justify-center">
                            {getBookCover(item.book_id, item.book_cover ?? '') ? (
                              <img
                                src={getBookCover(item.book_id, item.book_cover ?? '')}
                                alt={item.book_title ?? 'Book cover'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
                                  if (fallback) fallback.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div
                              style={{ display: getBookCover(item.book_id, item.book_cover ?? '') ? 'none' : 'flex' }}
                              className="w-full h-full items-center justify-center"
                            >
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>

                          {/* Title + Qty */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
                              {item.book_title ?? 'Book'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                          </div>

                          {/* Track Order Button */}
                          {idx === 0 && (
                            <div className="flex-shrink-0">
                              <Button
                                size="sm"
                                className="h-7 px-3 text-[11px] bg-green-600 hover:bg-green-700 text-white gap-1"
                                onClick={() => toggleStatus(order.id)}
                              >
                                {expandedStatus[order.id]
                                  ? <><ChevronUp className="h-3 w-3" />Hide</>
                                  : <><ChevronDown className="h-3 w-3" />Track Order</>
                                }
                              </Button>
                            </div>
                          )}
                        </div>
                        {idx < (order.items?.length ?? 0) - 1 && <Separator className="mt-2" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Status Timeline */}
                {expandedStatus[order.id] && (
                  <>
                    <Separator className="mt-3" />
                    <StatusTimeline order={order} />
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
