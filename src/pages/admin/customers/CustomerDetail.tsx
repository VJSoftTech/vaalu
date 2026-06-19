import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { customerService } from '@/services/customerService'
import type { Customer } from '@/types'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/formatters'

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    customerService.getById(Number(id)).then(setCustomer).finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner className="py-16" />
  if (!customer) return <div className="text-center py-16">Customer not found.</div>

  return (
    <div className="space-y-6">
      <PageTitle
        title={customer.name}
        action={<Button variant="outline" onClick={() => navigate('/admin/customers')}>← Back</Button>}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Email: </span>{customer.email}</div>
            <div><span className="text-muted-foreground">Mobile: </span>{customer.mobile_number}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Purchase Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Total Orders: </span>{customer.orders_count ?? 0}</div>
            <div><span className="text-muted-foreground">Total Spent: </span>{formatCurrency(customer.total_spent ?? 0)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
