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
import { useLanguage } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/i18n/translations'

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
  { id: 'full_name',    labelKey: 'fieldFullName',    colSpan: 2, required: true  },
  { id: 'email',        labelKey: 'fieldEmail',       colSpan: 2, required: true  },
  { id: 'address_line1',labelKey: 'fieldAddressLine1',colSpan: 2, required: true  },
  { id: 'address_line2',labelKey: 'fieldAddressLine2',colSpan: 2, required: false },
  { id: 'city',         labelKey: 'fieldCity',        colSpan: 1, required: true  },
  { id: 'state',        labelKey: 'fieldState',       colSpan: 1, required: true  },
  { id: 'pincode',      labelKey: 'fieldPincode',     colSpan: 1, required: true  },
  { id: 'phone',        labelKey: 'fieldPhone',       colSpan: 1, required: true  },
] as const satisfies readonly { id: keyof ShippingForm; labelKey: keyof TranslationKey['checkout']; colSpan: number; required: boolean }[]

export default function Checkout() {
  const { t } = useLanguage()
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
      if (!paymentRefId.trim()) { setError(t.checkout.errRefRequired); return }
      if (!attachment)          { setError(t.checkout.errScreenshotRequired); return }
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
      setError(msg || t.checkout.errGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t.checkout.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Shipping Address */}
          <Card>
            <CardHeader><CardTitle>{t.checkout.shippingAddress}</CardTitle></CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
                {SHIPPING_FIELDS.map(({ id, labelKey, colSpan, required }) => {
                  const label = t.checkout[labelKey]
                  return (
                  <div key={id} className={`space-y-1 ${colSpan === 2 ? 'sm:col-span-2' : ''}`}>
                    <Label htmlFor={id}>
                      {label} {required && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id={id}
                      {...register(id as keyof ShippingForm, { required })}
                      className={errors[id as keyof ShippingForm] ? 'border-red-500' : ''}
                    />
                    {errors[id as keyof ShippingForm] && (
                      <p className="text-xs text-red-500">{label} {t.checkout.isRequired}</p>
                    )}
                  </div>
                  )
                })}
              </form>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader><CardTitle>{t.checkout.paymentMethod}</CardTitle></CardHeader>
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
                      <p className="font-medium text-sm">{t.checkout.onlinePayment}</p>
                      <p className="text-xs text-muted-foreground">{t.checkout.onlinePaymentDesc}</p>
                    </div>
                  </button>
                  <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-300">
                    {t.checkout.comingSoon}
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
                    <p className="font-medium text-sm">{t.checkout.qrCodePayment}</p>
                    <p className="text-xs text-muted-foreground">{t.checkout.qrCodePaymentDesc}</p>
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
                        {t.checkout.scanToPay} {formatCurrency(totals.total)}
                      </p>
                    </div>

                    <div className="flex-1 space-y-3 text-sm w-full">
                      <p className="font-semibold text-base">{t.checkout.paymentDetails}</p>
                      <div className="grid grid-cols-2 gap-y-3">
                        <span className="text-muted-foreground">{t.checkout.payeeName}</span>
                        <span className="font-medium">Vaalu Pathippagam</span>
                        <span className="text-muted-foreground">{t.checkout.upiId}</span>
                        <span className="font-mono font-medium">vaalu@sbi</span>
                        <span className="text-muted-foreground">{t.checkout.amount}</span>
                        <span className="font-semibold text-primary text-base">{formatCurrency(totals.total)}</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 space-y-1">
                        <p className="font-medium">{t.checkout.howToPay}</p>
                        <p>{t.checkout.step1}</p>
                        <p>{t.checkout.step2} {formatCurrency(totals.total)}</p>
                        <p>{t.checkout.step3}</p>
                        <p>{t.checkout.step4}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Proof submission */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">{t.checkout.submitPaymentProof}</p>

                    <div className="space-y-1">
                      <Label htmlFor="payment_ref_id">{t.checkout.paymentRefLabel} <span className="text-red-500">*</span></Label>
                      <Input
                        id="payment_ref_id"
                        placeholder={t.checkout.paymentRefPlaceholder}
                        value={paymentRefId}
                        onChange={(e) => setPaymentRefId(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>{t.checkout.paymentScreenshotLabel} <span className="text-red-500">*</span></Label>
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
                            <p className="text-sm text-muted-foreground">{t.checkout.clickToUpload}</p>
                            <p className="text-xs text-muted-foreground">{t.checkout.uploadHint}</p>
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
            {submitting ? t.checkout.placingOrder : `${t.checkout.placeOrder} — ${formatCurrency(totals.total)}`}
          </Button>
        </div>

        {/* Order Summary */}
        <Card className="h-fit sticky top-6">
          <CardHeader><CardTitle>{t.cart.orderSummary}</CardTitle></CardHeader>
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
              <span className="text-muted-foreground">{t.cart.subtotal}</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.cart.gst}</span>
              <span>{formatCurrency(totals.gst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.cart.shipping}</span>
              <span>{totals.shipping === 0 ? t.cart.free : formatCurrency(totals.shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>{t.cart.total}</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
