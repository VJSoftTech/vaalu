import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { staffUserSchema } from '@/utils/validators'
import { userService } from '@/services/userService'
import type { StaffUserFormData } from '@/services/userService'
import { toast } from '@/hooks/useToast'
import PageTitle from '@/components/common/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export default function AddUser() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StaffUserFormData>({
    resolver: zodResolver(staffUserSchema),
    defaultValues: { name: '', email: '', password: '', role: 'staff', is_active: true },
  })

  const onSubmit = async (data: StaffUserFormData) => {
    try {
      await userService.create(data)
      toast({ title: 'User created successfully.' })
      navigate('/admin/users')
    } catch (err: any) {
      toast({ title: err?.response?.data?.message ?? 'Failed to create user', variant: 'destructive' })
    }
  }

  return (
    <div>
      <PageTitle title="Add Staff User" />
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
              <Input type="email" {...register('email')} placeholder="user@vaalu.com" autoComplete="off" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Password <span className="text-red-500">*</span></Label>
              <Input type="password" {...register('password')} placeholder="Min. 6 characters" autoComplete="new-password" />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Role <span className="text-red-500">*</span></Label>
              <select
                {...register('role')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" id="is_active" {...register('is_active')} className="h-4 w-4" defaultChecked />
              <Label htmlFor="is_active">Active (allow login)</Label>
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create User'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
