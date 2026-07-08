import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { staffUserEditSchema } from '@/utils/validators'
import { userService } from '@/services/userService'
import type { StaffUserFormData } from '@/services/userService'
import { toast } from '@/hooks/useToast'
import PageTitle from '@/components/common/PageTitle'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export default function EditUser() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StaffUserFormData>({
    resolver: zodResolver(staffUserEditSchema),
  })

  useEffect(() => {
    userService.getAll()
      .then((r) => {
        const user = r.data.find((u) => u.id === Number(id))
        if (user) reset({ name: user.name, email: user.email, role: user.role as 'admin' | 'staff', is_active: user.is_active, password: '' })
      })
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data: StaffUserFormData) => {
    try {
      const payload: Partial<StaffUserFormData> = { name: data.name, email: data.email, role: data.role, is_active: data.is_active }
      if (data.password) payload.password = data.password
      await userService.update(Number(id), payload)
      toast({ title: 'User updated successfully' })
      navigate('/admin/users')
    } catch (err: any) {
      toast({ title: err?.response?.data?.message ?? 'Failed to update user', variant: 'destructive' })
    }
  }

  if (loading) return <LoadingSpinner className="py-16" />

  return (
    <div>
      <PageTitle title="Edit Staff User" />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            <div className="space-y-1">
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>New Password <span className="text-muted-foreground">(leave blank to keep current)</span></Label>
              <Input type="password" {...register('password')} placeholder="Min. 6 characters" />
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
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" id="is_active" {...register('is_active')} className="h-4 w-4" />
              <Label htmlFor="is_active">Active (allow login)</Label>
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
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
