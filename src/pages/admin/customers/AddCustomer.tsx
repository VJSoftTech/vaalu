import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema } from '@/utils/validators'
import { customerService } from '@/services/customerService'
import { toast } from '@/hooks/useToast'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

type CustomerFormData = { name: string; email: string; mobile_number: string; password: string }

export default function AddCustomer() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', mobile_number: '', password: '' },
  })

  const onSubmit = async (data: CustomerFormData) => {
    try {
      await customerService.create(data)
      toast({ title: 'Customer added successfully' })
      navigate('/admin/customers')
    } catch (err: any) {
      toast({ title: err?.response?.data?.message ?? 'Failed to add customer', variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageTitle title="Add Customer" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start" autoComplete="off">
            <div className="space-y-1">
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input {...register('name')} placeholder="Full name" autoComplete="off" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input type="email" {...register('email')} placeholder="customer@example.com" autoComplete="off" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Mobile Number <span className="text-red-500">*</span></Label>
              <Input {...register('mobile_number')} placeholder="9876543210" autoComplete="off" />
              {errors.mobile_number && <p className="text-xs text-destructive">{errors.mobile_number.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Password <span className="text-red-500">*</span></Label>
              <Input type="password" {...register('password')} placeholder="Min. 6 characters" autoComplete="new-password" />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Customer'}
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
