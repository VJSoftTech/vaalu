import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/store/cartStore'
import { formatCurrency } from '@/utils/formatters'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'

interface Props {
  item: CartItemType
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart()
  const price = item.book.discount_price ?? item.book.price

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <img
        src={item.book.cover_image}
        alt={item.book.title}
        className="w-16 h-20 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.book.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{item.book.author_name}</p>
        <p className="font-semibold text-primary mt-1">{formatCurrency(price)}</p>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
            onClick={() => removeItem(item.book.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
