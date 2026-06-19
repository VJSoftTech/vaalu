import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderConfirmation() {
  const { id } = useParams()

  return (
    <div className="container py-24 flex flex-col items-center text-center gap-4">
      <CheckCircle2 className="h-20 w-20 text-green-500" />
      <h1 className="text-3xl font-bold">Order Confirmed!</h1>
      <p className="text-muted-foreground">
        Thank you for your purchase. Your order #{id} has been placed successfully.
      </p>
      <p className="text-sm text-muted-foreground">
        You will receive a confirmation email shortly.
      </p>
      <div className="flex gap-3 mt-4">
        <Link to="/orders"><Button variant="outline">View My Orders</Button></Link>
        <Link to="/books"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  )
}
