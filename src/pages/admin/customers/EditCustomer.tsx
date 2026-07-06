import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerEditSchema } from '@/utils/validators'
import { customerService } from '@/services/customerService'
import { toast } from '@/hooks/useToast'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

type CustomerEditFormData = { name: string; email: string; mobile_number: string; password?: string }

export default function EditCustomer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CustomerEditFormData>({
    resolver: zodResolver(customerEditSchema),
  })

  useEffect(() => {
    customerService.getById(Number(id))
      .then((customer) => {
        reset({ name: customer.name, email: customer.email, mobile_number: customer.mobile_number, password: '' })
      })
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data: CustomerEditFormData) => {
    try {
      const payload: Partial<CustomerEditFormData> = { name: data.name, email: data.email, mobile_number: data.mobile_number }
      if (data.password) payload.password = data.password
      await customerService.update(Number(id), payload)
      toast({ title: 'Customer updated successfully' })
      navigate('/admin/customers')
    } catch (err: any) {
      toast({ title: err?.response?.data?.message ?? 'Failed to update customer', variant: 'destructive' })
    }
  }

  if (loading) return <LoadingSpinner className="py-16" />

  return (
    <div>
      <PageTitle title="Edit Customer" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start" autoComplete="off">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input {...register('name')} placeholder="Full name" autoComplete="off" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" {...register('email')} placeholder="customer@example.com" autoComplete="off" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Mobile Number</Label>
              <Input {...register('mobile_number')} placeholder="9876543210" autoComplete="off" />
              {errors.mobile_number && <p className="text-xs text-destructive">{errors.mobile_number.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>New Password <span className="text-muted-foreground">(leave blank to keep current)</span></Label>
              <Input type="password" {...register('password')} placeholder="Min. 6 characters" autoComplete="new-password" />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/customers')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
