import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, LogIn, UserPlus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store'
import CartItemComponent from '@/components/cart/CartItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatters'

export default function Cart() {
  const { items, totals } = useCart()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/checkout' } })
    } else {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-24 flex flex-col items-center gap-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some books to get started</p>
        <Link to="/books"><Button>Browse Books</Button></Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => <CartItemComponent key={item.book.id} item={item} />)}
        </div>

        <Card className="h-fit sticky top-20">
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (5%)</span>
              <span>{formatCurrency(totals.gst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>

            {!isAuthenticated && (
              <div className="mt-3 rounded-lg bg-muted p-3 space-y-2">
                <p className="text-xs text-center text-muted-foreground font-medium">
                  Sign in or register to continue checkout
                </p>
                <div className="flex gap-2">
                  <Link to="/auth/login" state={{ from: '/checkout' }} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                      <LogIn className="h-3.5 w-3.5" /> Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/register" state={{ from: '/checkout' }} className="flex-1">
                    <Button size="sm" className="w-full gap-1.5 text-xs">
                      <UserPlus className="h-3.5 w-3.5" /> Register
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
