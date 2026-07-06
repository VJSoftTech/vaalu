import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { t } = useLanguage()

  return (
    <div className="container py-24 flex flex-col items-center text-center gap-6 max-w-lg mx-auto">
      <CheckCircle2 className="h-20 w-20 text-green-500" />
      <div>
        <h1 className="text-3xl font-bold">{t.orderConfirmation.title}</h1>
        <p className="text-muted-foreground mt-1">{t.orderConfirmation.thankYou}</p>
      </div>

      <Card className="w-full text-left">
        <CardContent className="p-5 space-y-2 text-sm">
          <p className="font-semibold text-base">{t.orderConfirmation.orderNumber}{id}</p>
          <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2.5">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{t.orderConfirmation.underReview}</span>
          </div>
          <p className="text-muted-foreground text-xs pt-1">
            {t.orderConfirmation.confirmedNote1} <strong>{t.orderConfirmation.confirmedStatus}</strong>{t.orderConfirmation.confirmedNote2}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link to="/orders">
          <Button variant="outline">{t.orderConfirmation.trackMyOrders}</Button>
        </Link>
        <Link to="/books">
          <Button>{t.orderConfirmation.continueShopping}</Button>
        </Link>
      </div>
    </div>
  )
}
