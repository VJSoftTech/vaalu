import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { CreditCard, QrCode, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/formatters'
import { orderService } from '@/services/orderService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface ShippingForm {
  full_name: string
  email: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  pincode: string
  phone: string
}

type PaymentMethod = 'online' | 'qr'

const SHIPPING_FIELDS = [
  { id: 'full_name',    label: 'Full Name',               colSpan: 2, required: true  },
  { id: 'email',        label: 'Email',                   colSpan: 2, required: true  },
  { id: 'address_line1',label: 'Address Line 1',          colSpan: 2, required: true  },
  { id: 'address_line2',label: 'Address Line 2 (Optional)',colSpan: 2, required: false },
  { id: 'city',         label: 'City',                    colSpan: 1, required: true  },
  { id: 'state',        label: 'State',                   colSpan: 1, required: true  },
  { id: 'pincode',      label: 'Pincode',                 colSpan: 1, required: true  },
  { id: 'phone',        label: 'Phone',                   colSpan: 1, required: true  },
] as const

export default function Checkout() {
  const { items, totals, clearCart } = useCart()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingForm>()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr')
  const [paymentRefId, setPaymentRefId] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const upiLink = `upi://pay?pa=vaalu@sbi&pn=Vaalu+Pathippagam&am=${totals.total}&cu=INR&tn=Order+Payment`

  const onSubmit = async (data: ShippingForm) => {
    if (paymentMethod === 'qr') {
      if (!paymentRefId.trim()) { setError('Please enter your Payment Reference / UTR Number.'); return }
      if (!attachment)          { setError('Please upload your payment screenshot.'); return }
    }
    setError('')
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => fd.append(k, v))
      fd.append('payment_method',   paymentMethod)
      fd.append('payment_ref_id',   paymentRefId)
      fd.append('subtotal',         String(totals.subtotal))
      fd.append('gst_amount',       String(totals.gst))
      fd.append('shipping_amount',  String(totals.shipping))
      fd.append('total_amount',     String(totals.total))
      fd.append('items', JSON.stringify(
        items.map((i) => ({
          book_id:    i.book.id,
          quantity:   i.quantity,
          unit_price: i.book.discount_price ?? i.book.price,
        }))
      ))
      if (attachment) fd.append('payment_attachment', attachment)

      const order = await orderService.create(fd)
      clearCart()
      navigate(`/order-confirmation/${order.order_number}`)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Shipping Address */}
          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
                {SHIPPING_FIELDS.map(({ id, label, colSpan, required }) => (
                  <div key={id} className={`space-y-1 ${colSpan === 2 ? 'sm:col-span-2' : ''}`}>
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      {...register(id as keyof ShippingForm, { required })}
                      className={errors[id as keyof ShippingForm] ? 'border-red-500' : ''}
                    />
                    {errors[id as keyof ShippingForm] && (
                      <p className="text-xs text-red-500">{label} is required</p>
                    )}
                  </div>
                ))}
              </form>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
            <CardContent className="space-y-4">

              {/* Method selector cards */}
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Online Payment – disabled */}
                <div className="relative">
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-muted bg-muted/20 opacity-50 cursor-not-allowed text-left"
                  >
                    <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Online Payment</p>
                      <p className="text-xs text-muted-foreground">Cards, Net Banking, UPI Apps</p>
                    </div>
                  </button>
                  <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-300">
                    Coming Soon
                  </Badge>
                </div>

                {/* QR Code Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-colors ${
                    paymentMethod === 'qr'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/40'
                  }`}
                >
                  <QrCode className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">QR Code Payment</p>
                    <p className="text-xs text-muted-foreground">Scan & pay via UPI</p>
                  </div>
                  {paymentMethod === 'qr' && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                </button>
              </div>

              {/* QR Payment panel */}
              {paymentMethod === 'qr' && (
                <div className="rounded-xl border bg-muted/10 p-5 space-y-5">
                  {/* QR + Payment info */}
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="p-3 bg-white rounded-xl border shadow-sm">
                        <QRCodeSVG value={upiLink} size={175} includeMargin={false} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Scan to pay {formatCurrency(totals.total)}
                      </p>
                    </div>

                    <div className="flex-1 space-y-3 text-sm w-full">
                      <p className="font-semibold text-base">Payment Details</p>
                      <div className="grid grid-cols-2 gap-y-3">
                        <span className="text-muted-foreground">Payee Name</span>
                        <span className="font-medium">Vaalu Pathippagam</span>
                        <span className="text-muted-foreground">UPI ID</span>
                        <span className="font-mono font-medium">vaalu@sbi</span>
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold text-primary text-base">{formatCurrency(totals.total)}</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 space-y-1">
                        <p className="font-medium">How to pay:</p>
                        <p>1. Open any UPI app (GPay, PhonePe, Paytm)</p>
                        <p>2. Scan the QR code and pay {formatCurrency(totals.total)}</p>
                        <p>3. Note the UTR / reference number from the success screen</p>
                        <p>4. Enter it below and upload your payment screenshot</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Proof submission */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Submit Payment Proof</p>

                    <div className="space-y-1">
                      <Label htmlFor="payment_ref_id">Payment Reference / UTR Number *</Label>
                      <Input
                        id="payment_ref_id"
                        placeholder="e.g. 425123456789"
                        value={paymentRefId}
                        onChange={(e) => setPaymentRefId(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Payment Screenshot *</Label>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        {attachment ? (
                          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span className="truncate max-w-[240px]">{attachment.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload screenshot</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 5 MB</p>
                          </div>
                        )}
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Placing Order…' : `Place Order — ${formatCurrency(totals.total)}`}
          </Button>
        </div>

        {/* Order Summary */}
        <Card className="h-fit sticky top-6">
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.book.id} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1 mr-2">
                  {item.book.title} × {item.quantity}
                </span>
                <span className="shrink-0">
                  {formatCurrency((item.book.discount_price ?? item.book.price) * item.quantity)}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (5%)</span>
              <span>{formatCurrency(totals.gst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
