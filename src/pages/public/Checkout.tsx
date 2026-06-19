import { useForm } from 'react-hook-form'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ShippingForm {
  full_name: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  pincode: string
  phone: string
}

export default function Checkout() {
  const { items, totals } = useCart()
  const { register, handleSubmit } = useForm<ShippingForm>()

  const onSubmit = (data: ShippingForm) => {
    console.log('Checkout:', data)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: 'full_name', label: 'Full Name', colSpan: 2 },
                  { id: 'address_line1', label: 'Address Line 1', colSpan: 2 },
                  { id: 'address_line2', label: 'Address Line 2 (Optional)', colSpan: 2 },
                  { id: 'city', label: 'City' },
                  { id: 'state', label: 'State' },
                  { id: 'pincode', label: 'Pincode' },
                  { id: 'phone', label: 'Phone' },
                ].map(({ id, label, colSpan }) => (
                  <div
                    key={id}
                    className={`space-y-1 ${colSpan === 2 ? 'sm:col-span-2' : ''}`}
                  >
                    <Label htmlFor={id}>{label}</Label>
                    <Input id={id} {...register(id as keyof ShippingForm)} />
                  </div>
                ))}
                <div className="sm:col-span-2 mt-2">
                  <Button type="submit" size="lg" className="w-full">
                    Pay {formatCurrency(totals.total)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.book.id} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1 mr-2">
                  {item.book.title} × {item.quantity}
                </span>
                <span>{formatCurrency((item.book.discount_price ?? item.book.price) * item.quantity)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
