import { Badge } from '@/components/ui/badge'
import type { OrderStatus, PaymentStatus } from '@/types'
import { cn } from '@/lib/utils'

const orderColors: Record<OrderStatus, string> = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const paymentColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
}

interface Props {
  status: OrderStatus | PaymentStatus
  type?: 'order' | 'payment'
}

export default function OrderStatusBadge({ status, type = 'order' }: Props) {
  const colorMap = type === 'order' ? orderColors : paymentColors
  return (
    <Badge
      className={cn('capitalize font-medium', colorMap[status as keyof typeof colorMap])}
      variant="outline"
    >
      {status}
    </Badge>
  )
}
